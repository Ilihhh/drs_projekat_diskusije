from ..auth.auth import token_required, role_required
from ..services.users_service import UsersService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.user_schema import UserSchema
from ..models.user import User
from ..database import db
from ..services.email_service import EmailService


users_blueprint = Blueprint('users', __name__)

                                             
@users_blueprint.route('/users', methods=['GET'])
@token_required                                                         #mora da stoji ispod blueprinta :)                                                 
def get_users(current_user):                                            #mora da se stavi current_user zbog funkcije token_reqired koja prosledjuje ovo (iako nam ne treba)
    users = User.query.all()  # Fetch all users
    users_schema = UserSchema(many=True)  # many=True means we map multiple users
    return jsonify(users_schema.dump(users))  # Return serialized data


@users_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    try:
        user = UsersService.create_user(data)
        
        # Ne generišemo token, samo vraćamo potvrdu o primljenom zahtevu
        return jsonify({"message": "Registration request received. Awaiting approval."}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@users_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if user.status == "pending":
        return jsonify({"error": "Your account is still pending approval."}), 403

    if user.status == "rejected":
        return jsonify({"error": "Your account has been rejected."}), 403

    if UsersService.check_password(user, password):
        # Provera da li je prva prijava
        if user.is_first_login:
            try:
                # Dobavljanje email-a administratora iz baze
                admins = User.query.filter_by(role="admin").all()  # Filtriraj sve administratore
                if admins:
                    for admin in admins:
                        # Slanje email obaveštenja svakom administratoru
                        subject = "First Login Notification"
                        body = f"User {user.email} has logged in for the first time."
                        EmailService.send_email(admin.email, subject, body)

                # Ažuriranje polja is_first_login na False
                user.is_first_login = False
                db.session.commit()
            except Exception as e:
                return jsonify({"error": f"Failed to handle first login notification: {str(e)}"}), 500

        # Generisanje JWT tokena
        token = UsersService.create_jwt_token(user)
        return jsonify({"token": token}), 200

    else:
        return jsonify({"error": "Invalid credentials"}), 401

    
@users_blueprint.route('/registration-requests', methods=['GET'])                   # dobavljanje korisnika koji imaju status pending
@token_required
@role_required("admin")
def get_registration_requests(current_user):
    pending_users = User.query.filter_by(status="pending").all()
    user_schema = UserSchema(many=True)
    return jsonify(user_schema.dump(pending_users))


@users_blueprint.route('/update-registration/<int:user_id>', methods=['PUT'])
@token_required
@role_required("admin")
def update_registration_status(current_user, user_id):
    data = request.get_json()
    new_status = data.get("status")  # approved or rejected

    user, error = UsersService.update_user_status(user_id, new_status)

    if error:
        return jsonify({"error": error}), 400

    return jsonify({"message": "User status updated", "user": user.id}), 200



@users_blueprint.route('/userinfo', methods=['GET'])
@token_required
def get_user_info(current_user):
    """
    Dohvata informacije o trenutnom korisniku na osnovu JWT tokena.
    """
    user_schema = UserSchema()  # Kreiramo instancu šeme za serializaciju
    return jsonify(user_schema.dump(current_user)), 200


@users_blueprint.route('/edituser', methods=['PUT'])
@token_required
def edit_user(current_user):
    """
    Ažurira korisničke podatke i šalje novi token sa ažuriranim podacima.
    """
    data = request.get_json()

    # Proveravamo da li korisnik pokušava da menja svoje podatke
    if current_user.id != data.get('id'):
        return jsonify({"error": "You are not authorized to edit this user."}), 403

    # Pozivamo metodu iz UsersService za ažuriranje podataka
    user, token_or_error = UsersService.update_user_data(current_user, data)
    
    if user:
        return jsonify({"message": "User updated successfully", "token": token_or_error}), 200
    else:
        return jsonify({"error": token_or_error}), 400


# @users_blueprint.route('/search', methods=['GET'])
# @token_required
# def search_users(current_user):
#     """
#     Vraća listu potvrđenih korisnika sa opcionalnim filtriranjem po imenu ili email-u.
#     """
#     # Dohvati query parametre
#     name_query = request.args.get('name', '').strip().lower()
#     email_query = request.args.get('email', '').strip().lower()

#     # Početni upit: samo potvrđeni korisnici
#     query = User.query.filter_by(status="approved")

#     # Filtriranje po imenu
#     if name_query:
#         query = query.filter(User.name.ilike(f"%{name_query}%"))

#     # Filtriranje po email-u
#     if email_query:
#         query = query.filter(User.email.ilike(f"%{email_query}%"))

#     # Izvrši upit
#     users = query.all()

#     # Serijalizuj rezultate
#     users_schema = UserSchema(many=True)
#     return jsonify(users_schema.dump(users)), 200

