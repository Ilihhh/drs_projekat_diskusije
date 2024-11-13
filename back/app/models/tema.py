from ..database import db

class Tema(db.Model):
    __tablename__ = 'teme'

    id = db.Column(db.Integer, primary_key=True)
    naziv = db.Column(db.String(100), nullable=False, unique=True)
    opis = db.Column(db.Text)

    # Relacija prema Diskusijama
    diskusije = db.relationship('Diskusija', backref='tema', lazy=True)
    
    def __repr__(self):
        return f"<Tema {self.naziv}>"
