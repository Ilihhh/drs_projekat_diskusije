from datetime import datetime
from ..database import db

class Discussion(db.Model):
    __tablename__ = 'discussions'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    text = db.Column(db.Text, nullable=False)
    creation_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)

    # Relationships
    comments = db.relationship('Comment', backref='discussion', lazy=True)

    def get_likes_count(self):
        return len([reaction for reaction in self.reactions if reaction.reaction == "like"])

    def get_dislikes_count(self):
        return len([reaction for reaction in self.reactions if reaction.reaction == "dislike"])

    def __repr__(self):
        return f"<Discussion {self.title}>"
