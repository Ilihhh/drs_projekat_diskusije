import os
from dotenv import load_dotenv # type: ignore

load_dotenv()  # Učitavanje varijabli iz .env fajla

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")  # URI za pristup bazi
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
