# services/users_service.py
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore
from ..models.user import User
from ..database import db
from ..config import Config  # Import Config class
import re
from datetime import datetime, timedelta
import jwt  # type: ignore
from .email_service import EmailService
from ..socketio import socketio
from ..dtos.user_schema import UserSchema

class UserService:

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
        # Validacija i kreiranje korisnika (već implementirano)
        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            address=data['address'],
            username=data['username'],
            password=generate_password_hash(data['password']),
            city=data.get('city'),
            country=data.get('country'),
            phone_number=data.get('phone_number'),
            status='pending'  # Pretpostavka da je inicijalni status 'pending'
        )
        
        # Sačuvaj korisnika u bazi
        db.session.add(user)
        db.session.commit()

        # Serijalizacija podataka korisnika pomoću šeme
        user_schema = UserSchema()
        serialized_user = user_schema.dump(user)

        # Emituj događaj za novog korisnika
        try:
            socketio.emit('new-user-registered', serialized_user)
        except Exception as e:
            print(f"SocketIO emit failed: {e}")

        return user


    @staticmethod
    def notify_admins_of_first_login(user):
        try:
            admins = User.query.filter_by(role="admin").all()
            for admin in admins:
                EmailService.send_email(
                    admin.email,
                    "First Login Notification",
                    f"User {user.email} has logged in for the first time."
                )
            user.is_first_login = False
            db.session.commit()
        except Exception as e:
            raise Exception(f"Failed to handle first login notification: {str(e)}")


    @staticmethod
    def login_user(data):
        email = data.get("email")
        password = data.get("password")

        # Pronađi korisnika
        user = User.query.filter_by(email=email).first()

        if not user:
            raise ValueError("Invalid credentials")

        if user.status == "pending":
            raise PermissionError("Your account is still pending approval.")

        if user.status == "rejected":
            raise PermissionError("Your account has been rejected.")

        # Provera lozinke
        if not UserService.check_password(user, password):
            raise ValueError("Invalid credentials")

        # Obrada prve prijave
        if user.is_first_login:
            UserService.notify_admins_of_first_login(user)

        # Generiši i vrati JWT token
        return UserService.create_jwt_token(user)

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

        VALID_STATUSES = ["approved", "rejected"]
        if new_status not in VALID_STATUSES:
            return None, "Invalid status"

        # Update user status
        user.status = new_status

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return None, f"Database commit failed: {e}"

        # Emit event via WebSocket
        try:
                socketio.emit("registration_update", {"user_id": user.id, "status": user.status})
        except Exception as e:
            print(f"SocketIO emit failed: {e}")
        

        # Send email to the user about the status update
        try:
            EmailService.send_email(
                recipient=user.email,
                subject=f"Your registration has been {new_status}",
                body=f"Dear {user.first_name},\n\nYour registration status has been updated to {new_status}.\n\nBest regards,\nYour team"
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

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
            token = UserService.create_jwt_token(user)
            return user, token
        
        except Exception as e:
            db.session.rollback()
            return None, str(e)
