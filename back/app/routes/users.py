from ..auth.auth import token_required, role_required
from ..services.users_service import UsersService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.user_schema import UserSchema
from ..models.user import User
from ..database import db
# Importujemo socketio iz __init__.py


users_blueprint = Blueprint('users', __name__)

                                             
@users_blueprint.route('/users', methods=['GET'])
@token_required                                                         #mora da stoji ispod blueprinta :)
@role_required('admin')                                                 
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

