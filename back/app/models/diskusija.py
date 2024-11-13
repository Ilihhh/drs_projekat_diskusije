from datetime import datetime
from ..database import db

class Diskusija(db.Model):
    __tablename__ = 'diskusije'

    id = db.Column(db.Integer, primary_key=True)
    naslov = db.Column(db.String(150), nullable=False)
    tekst = db.Column(db.Text, nullable=False)
    datum_kreiranja = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Strani ključevi
    autor_id = db.Column(db.Integer, db.ForeignKey('korisnici.id'), nullable=False)
    tema_id = db.Column(db.Integer, db.ForeignKey('teme.id'), nullable=False)

    # Relacija prema Komentarima
    komentari = db.relationship('Komentar', backref='diskusija', lazy=True)
    
    def __repr__(self):
        return f"<Diskusija {self.naslov}>"
