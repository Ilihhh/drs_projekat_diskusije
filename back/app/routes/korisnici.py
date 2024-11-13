from ..auth.auth import token_required
from ..services.korisnici_service import KorisniciService
from flask import Blueprint, jsonify, request # type: ignore
from ..dtos.korisnik_schema import KorisnikSchema
from ..models.korisnik import Korisnik
from ..database import db

korisnici_blueprint = Blueprint('korisnici', __name__)

@korisnici_blueprint.route('/korisnici', methods=['GET'])
def get_korisnici():
    korisnici = Korisnik.query.all()  # Uzmi sve korisnike
    korisnici_schema = KorisnikSchema(many=True)  # many=True znači da mapiramo više korisnika
    return jsonify(korisnici_schema.dump(korisnici))  # Vraćamo serializovane podatke


@korisnici_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    try:
        korisnik = KorisniciService.create_korisnik(data)
        token = KorisniciService.create_jwt_token(korisnik)
        return jsonify({"token": token}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@korisnici_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json() 

    email = data.get("email")
    lozinka = data.get("lozinka")

    korisnik = Korisnik.query.filter_by(email=email).first()
    
    if korisnik and KorisniciService.check_password(korisnik, lozinka):
        token = KorisniciService.create_jwt_token(korisnik)
        return jsonify({"token": token}), 200 
    else:
        return jsonify({"error": "Nevalidni podaci"}), 401  
    

@korisnici_blueprint.route('/protected', methods=['GET'])
@token_required
def protected(current_user):
    return jsonify({"message": f"Hello {current_user.korisnicko_ime}, your role is {current_user.uloga}"})