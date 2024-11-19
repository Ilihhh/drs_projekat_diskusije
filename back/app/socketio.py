# app/socketio.py

from flask_socketio import SocketIO # type: ignore

# Inicijalizacija SocketIO
socketio = SocketIO(cors_allowed_origins="*")
