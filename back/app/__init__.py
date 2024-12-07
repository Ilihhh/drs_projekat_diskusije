# import eventlet  # type: ignore
# eventlet.monkey_patch()

from flask import Flask  # type: ignore
from .config import Config
from .database import db, migrate
from .routes import initialize_routes
from flask_cors import CORS  # type: ignore
from .services import mail  # Import Flask-Mail instance
from .socketio import socketio  # Import Flask-SocketIO instance
from . import events  # Ensure events are registered

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Load settings from Config class

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)  # Initialize Flask-Mail
    CORS(app)  # Add CORS support to all routes

    # Initialize SocketIO with Flask app
    socketio.init_app(app, cors_allowed_origins="*", async_mode="eventlet")

    # Register application routes
    initialize_routes(app)

    return app
