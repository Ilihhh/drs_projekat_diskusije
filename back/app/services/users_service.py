# services/users_service.py
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore
from ..models.user import User
from ..database import db
from ..config import Config  # Import Config class
import re
from datetime import datetime, timedelta
import jwt  # type: ignore

class UsersService:

    # Function to create a JWT token
    @staticmethod
    def create_jwt_token(user):
        payload = {
            "username": user.username,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=1)  # Token is valid for 1 hour
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
        return token
    
    @staticmethod
    def create_user(data):
        # Data validation
        if not UsersService.valid_email(data['email']):
            raise ValueError("Invalid email")
        
        # if not UsersService.valid_phone_number(data.get('phone_number', '')):
        #     raise ValueError("Invalid phone number")

        # Creating a user
        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            username=data['username'],
            password=generate_password_hash(data['password']),  # Password is hashed before being stored
            city=data.get('city'),
            country=data.get('country'),
            phone_number=data.get('phone_number')
        )
        
        # Saving the user to the database
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def valid_email(email):
        return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

    # @staticmethod
    # def valid_phone_number(phone_number):
    #     return re.match(r"^\+?\d{10,15}$", phone_number) is not None

    @staticmethod
    def check_password(user, password):
        return check_password_hash(user.password, password)
