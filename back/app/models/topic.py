from ..database import db

class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)

    # Relationship to Discussions
    discussions = db.relationship('Discussion', backref='topic', lazy=True)
    
    def __repr__(self):
        return f"<Topic {self.name}>"
