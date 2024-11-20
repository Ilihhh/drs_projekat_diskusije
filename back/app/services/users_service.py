# services/users_service.py
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore
from ..models.user import User
from ..database import db
from ..config import Config  # Import Config class
import re
from datetime import datetime, timedelta
import jwt  # type: ignore
from .email_service import EmailService
from ..socketio import socketio  # type: ignore # Instanciran u fajlu ..socketio.py

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

    # New method to update user registration status
    @staticmethod
    def update_user_status(user_id, new_status):
        # Fetch user from the database
        user = User.query.get(user_id)

        if not user:
            return None, "User not found"

        if new_status not in ["approved", "rejected"]:
            return None, "Invalid status"

        # Update user status
        user.status = new_status
        db.session.commit()

        # Emit event via WebSocket
        socketio.emit("registration_update", {"user_id": user.id, "status": user.status})

        # Send email to the user about the status update
        EmailService.send_email(
            recipient=user.email,
            subject=f"Your registration has been {new_status}",
            body=f"Dear {user.first_name},\n\nYour registration status has been updated to {new_status}.\n\nBest regards,\nYour team"
        )

        return user, None  # Return updated user and no error


    @staticmethod
    def update_user_data(current_user, data):
        # Pronalazimo korisnika iz baze
        user = User.query.get(current_user.id)
        if not user:
            return None, "User not found"
        
        # Ažuriramo podatke korisnika
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        user.username = data.get('username', user.username)  # Ovaj deo ažurira korisničko ime
        user.city = data.get('city', user.city)
        user.country = data.get('country', user.country)
        user.phone_number = data.get('phone_number', user.phone_number)
        user.address = data.get('address', user.address)
        
        # Ažuriranje lozinke ako je dostavljena i nije prazan string
        new_password = data.get('password')
        if new_password and new_password.strip():
            user.password = generate_password_hash(new_password)

        # Provera da li korisničko ime već postoji
        if data.get('username'):
            existing_user = User.query.filter_by(username=data['username']).first()
            if existing_user and existing_user.id != user.id:
                return None, "Username already exists"

        # Čuvanje promena u bazi
        try:
            db.session.commit()
            
            # Ako se menja korisničko ime, treba generisati novi token
            token = UsersService.create_jwt_token(user)
            return user, token
        
        except Exception as e:
            db.session.rollback()
            return None, str(e)
