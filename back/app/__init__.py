from flask import Flask # type: ignore
from .config import Config
from .database import db, migrate
from .routes import initialize_routes
from flask_cors import CORS # type: ignore
from .services import mail

# Importujemo socketio iz novog fajla
from .socketio import socketio


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Učitajte sve postavke iz Config klase

    # Inicijalizacija ekstenzija
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)  # Inicijalizujte Flask-Mail

    # Dodavanje CORS-a za svaku rutu u aplikaciji
    CORS(app)

    # SocketIO povezujemo sa Flask aplikacijom
    socketio.init_app(app)

    # Registracija ruta
    initialize_routes(app)

    return app
