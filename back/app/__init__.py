from flask import Flask # type: ignore
from .config import Config
from .database import db, migrate
from .routes import initialize_routes
from flask_cors import CORS # type: ignore

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)                                       # Dodavanja CORS-a za svaku rutu u aplikaciji (mlogo vazno)

    # Inicijalizacija ekstenzija
    db.init_app(app)
    migrate.init_app(app, db)

    # Registracija ruta
    initialize_routes(app)

    return app
