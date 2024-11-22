from ..models.topic import Topic
from ..database import db
from ..models.user import User

class Discussion(db.Model):
    @staticmethod
    def create_discussion(data):
        if not data or 'title' not in data or 'text' not in data or 'topic_id' not in data or 'author_id' not in data:
            return ValueError("Invalid input. 'title', 'text', 'topic_id', and 'author_id' are required.")

        title = data['title']
        text = data['text']
        topic_id = data['topic_id']
        author_id = data['author_id']

        # Check if the topic exists
        topic = Topic.query.get(topic_id)
        if not topic:
            return ValueError("Topic not found.")

        # Check if the author exists
        author = User.query.get(author_id)
        if not author:
            return ValueError("Author not found.")

        # Check if a discussion with this title already exists within the same topic
        existing_discussion = Discussion.query.filter_by(title=title, topic_id=topic_id).first()
        if existing_discussion:
            return ValueError("Discussion with this title already exists in this topic.")

        # Create new discussion
        new_discussion = Discussion(title=title, text=text, topic_id=topic_id, author_id=author_id)

        try:
            db.session.add(new_discussion)
            db.session.commit()
            return new_discussion  # Return the created discussion object (or just a success message)
        except Exception as e:
            db.session.rollback()
            return ValueError(f"An error occurred while creating the discussion: {str(e)}")
