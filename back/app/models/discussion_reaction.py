from ..database import db

class DiscussionReaction(db.Model):
    __tablename__ = 'discussion_reactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    discussion_id = db.Column(db.Integer, db.ForeignKey('discussions.id'), nullable=False)
    reaction = db.Column(db.String(10), nullable=False)  # Može biti "like", "dislike", ili "none"

    # Relationships
    user = db.relationship('User', backref='discussion_reactions', lazy=True)
    discussion = db.relationship('Discussion', backref='reactions', lazy=True)

    def __repr__(self):
        return f"<DiscussionReaction user_id={self.user_id}, discussion_id={self.discussion_id}, reaction={self.reaction}>"
