from ..auth.auth import token_required, role_required
from ..services.user_service import UserService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.user_schema import UserSchema
from ..models.user import User
from sqlalchemy.exc import IntegrityError # type: ignore

users_blueprint = Blueprint('users', __name__)

                                             
@users_blueprint.route('/users', methods=['GET'])
                                                                         #mora da stoji ispod blueprinta :)                                                 
def get_users():                                                         #mora da se stavi current_user zbog funkcije token_reqired koja prosledjuje ovo (iako nam ne treba)
    users = User.query.all()  # Fetch all users
    users_schema = UserSchema(many=True)  # many=True means we map multiple users
    return jsonify(users_schema.dump(users))  # Return serialized data


@users_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    try:
        user = UserService.create_user(data)
        return jsonify({"message": "Registration request received. Awaiting approval."}), 201

    except ValueError as e:
        return jsonify({"errors": {"general": str(e)}}), 400  # Vrati generalnu grešku
    
    except IntegrityError as e:
        errors = {}
        if 'email' in str(e.orig):
            errors['email'] = "Email is already registered"
        if 'username' in str(e.orig):
            errors['username'] = "Username is already taken"
        
        if errors:
            return jsonify({"errors": errors}), 400
        
        return jsonify({"errors": {"general": "An unknown error occurred"}}), 400




@users_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    try:
        # Metod servisa vraća token ili baca grešku
        token = UserService.login_user(data)
        return jsonify({"token": token}), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 401  # Npr. za "Invalid credentials"

    except PermissionError as e:
        return jsonify({"error": str(e)}), 403  # Npr. za "Account is pending/rejected"

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


    
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

    user, error = UserService.update_user_status(user_id, new_status)

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
    user, token_or_error = UserService.update_user_data(current_user, data)
    
    if user:
        return jsonify({"message": "User updated successfully", "token": token_or_error}), 200
    else:
        return jsonify({"error": token_or_error}), 400
