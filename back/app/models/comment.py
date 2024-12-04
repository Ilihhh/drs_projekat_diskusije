from datetime import datetime
from ..database import db
import pytz # type: ignore

class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    creation_date = db.Column(
        db.DateTime, 
        default=lambda: datetime.now(pytz.timezone('CET'))  # Koristimo CET vremensku zonu
    )

    # Foreign keys
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussions.id'), nullable=False)
    
    def __repr__(self):
        return f"<Comment {self.text[:20]}...>"
