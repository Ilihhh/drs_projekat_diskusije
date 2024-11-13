from datetime import datetime
from ..database import db

class Komentar(db.Model):
    __tablename__ = 'komentari'

    id = db.Column(db.Integer, primary_key=True)
    tekst = db.Column(db.Text, nullable=False)
    datum_kreiranja = db.Column(db.DateTime, default=datetime.utcnow)

    # Strani ključevi
    autor_id = db.Column(db.Integer, db.ForeignKey('korisnici.id'), nullable=False)
    diskusija_id = db.Column(db.Integer, db.ForeignKey('diskusije.id'), nullable=False)
    
    def __repr__(self):
        return f"<Komentar {self.tekst[:20]}...>"
