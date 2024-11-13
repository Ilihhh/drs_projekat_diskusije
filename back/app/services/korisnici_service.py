# services/korisnici_service.py
from werkzeug.security import generate_password_hash, check_password_hash # type: ignore
from ..models.korisnik import Korisnik
from ..database import db
from ..config import Config  # Importujte Config klasu
import re
from datetime import datetime, timedelta
import jwt  # type: ignore

class KorisniciService:

    # Funkcija za kreiranje JWT tokena
    @staticmethod
    def create_jwt_token(korisnik):
        payload = {
            "korisnicko_ime": korisnik.korisnicko_ime,
            "uloga": korisnik.uloga,
            "exp": datetime.utcnow() + timedelta(hours=1)  # Token važi 1 sat
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
        return token
    
    @staticmethod
    def create_korisnik(data):
        # Validacija podataka
        if not KorisniciService.valid_email(data['email']):
            raise ValueError("Nevalidan email")
        
        # if not KorisniciService.valid_broj_telefona(data.get('broj_telefona', '')):
        #     raise ValueError("Nevalidan broj telefona")

        # Kreiranje korisnika
        korisnik = Korisnik(
            ime=data['ime'],
            prezime=data['prezime'],
            email=data['email'],
            korisnicko_ime=data['korisnicko_ime'],
            lozinka=generate_password_hash(data['lozinka']),  # Lozinka se hash-uje pre nego što je sačuvana
            grad=data.get('grad'),
            drzava=data.get('drzava'),
            broj_telefona=data.get('broj_telefona')
        )
        
        # Čuvanje korisnika u bazi
        db.session.add(korisnik)
        db.session.commit()
        return korisnik

    @staticmethod
    def valid_email(email):
        return re.match(r"[^@]+@[^@]+\.[^@]+", email) is not None

    # @staticmethod
    # def valid_broj_telefona(broj_telefona):
    #     return re.match(r"^\+?\d{10,15}$", broj_telefona) is not None

    @staticmethod
    def check_password(korisnik, password):
        return check_password_hash(korisnik.lozinka, password)
