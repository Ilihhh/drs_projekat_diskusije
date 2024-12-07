import eventlet  # type: ignore
eventlet.monkey_patch()
import os
from dotenv import load_dotenv  # type: ignore


load_dotenv()  # Učitavanje varijabli iz .env fajla

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")  # URI za pristup bazi
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")

    # Flask-Mail configuration
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 25))  # Podrazumevana vrednost 25 ako MAIL_PORT nije postavljen
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "False") == "True"  # Konverzija stringa u bool
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", "False") == "True"  # Konverzija stringa u bool
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")




# Za povezivanje sa bazom napravi .env i dodaj (sa parametrima koji pasu):
# DATABASE_URI=postgresql://username:password@localhost:5432/ime_baze
# SECRET_KEY=neki_tajni_kljuc

# Flask-Mail configuration for Gmail
# MAIL_SERVER=smtp.gmail.com  # SMTP server za Gmail
# MAIL_PORT=587  # Port za TLS
# MAIL_USE_TLS=True  # Koristi TLS za sigurnu vezu
# MAIL_USE_SSL=False  # SSL nije potrebno kad koristite TLS
# MAIL_USERNAME=ilijapekimilanmilan@gmail.com  # Vaš Gmail korisnički nalog
# MAIL_PASSWORD=scfk czkd pccb jwjx  # Lozinka za Gmail nalog
# MAIL_DEFAULT_SENDER=ilijapekimilanmilan@gmail.com  # Pošiljalac je isti kao korisničko ime