from functools import wraps
from flask import request, jsonify # type: ignore
import jwt # type: ignore
from ..models.user import User
from ..config import Config

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            decoded_token = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(username=decoded_token["username"]).first()
            if not current_user:
                return jsonify({"message": "Invalid token!"}), 403
        except Exception as e:
            return jsonify({"message": str(e)}), 403

        return f(current_user, *args, **kwargs)
    return decorated_function

def role_required(role):
    def wrapper(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            if current_user.role != role:
                return jsonify({"message": "Access forbidden: Insufficient permissions"}), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return wrapper
