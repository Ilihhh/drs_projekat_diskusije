from ..database import db

class Korisnik(db.Model):
    __tablename__ = 'korisnici'

    id = db.Column(db.Integer, primary_key=True)
    ime = db.Column(db.String(50), nullable=False)
    prezime = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    korisnicko_ime = db.Column(db.String(50), unique=True, nullable=False)
    lozinka = db.Column(db.String(255), nullable=False)
    grad = db.Column(db.String(50))
    drzava = db.Column(db.String(50))
    broj_telefona = db.Column(db.String(20))
    
    # Kolona koja čuva ulogu
    uloga = db.Column(db.String(50), nullable=False, default="korisnik")  # Primer: 'admin', 'korisnik', itd.
    
    # Relacije
    diskusije = db.relationship('Diskusija', backref='autor', lazy=True)
    komentari = db.relationship('Komentar', backref='autor', lazy=True)

    def __repr__(self):
        return f"<Korisnik {self.korisnicko_ime}>"
