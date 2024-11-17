from ..auth.auth import token_required, role_required
from ..services.users_service import UsersService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.user_schema import UserSchema
from ..models.user import User
from ..database import db

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
        token = UsersService.create_jwt_token(user)
        return jsonify({"token": token}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@users_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json() 

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    
    if user and UsersService.check_password(user, password):
        token = UsersService.create_jwt_token(user)
        return jsonify({"token": token}), 200 
    else:
        return jsonify({"error": "Invalid credentials"}), 401  
    

# @users_blueprint.route('/protected', methods=['GET'])                         
# @token_required
# def protected(current_user):
#     return jsonify({"message": f"Hello {current_user.username}, your role is {current_user.role}"})
