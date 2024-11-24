from ..models.topic import Topic
from ..models.user import User
from ..database import db
from ..models.discussion import Discussion

class DiscussionService:
    @staticmethod
    def create_discussion(data, current_user):
        """Metoda za kreiranje nove diskusije"""
        # Proveri da li su svi potrebni podaci prisutni
        title = data.get("title")
        text = data.get("text")
        topic_id = data.get("topic_id")

        if not title or not text or not topic_id:
            raise ValueError("Title, text, and topic_id are required.")

        # Proveri da li tema postoji
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")

        # Kreiraj novu diskusiju
        new_discussion = Discussion(
            title=title,
            text=text,
            topic_id=topic_id,
            author_id=current_user.id  # Korisnik koji je kreirao diskusiju
        )

        try:
            # Dodaj diskusiju u bazu podataka
            db.session.add(new_discussion)
            db.session.commit()
            return new_discussion
        except Exception as e:
            db.session.rollback()
            raise ValueError(f"Error creating discussion: {str(e)}")

    @staticmethod
    def edit_discussion(data):
        # Validate input data
        if not data or 'id' not in data or 'title' not in data or 'text' not in data or 'topic_id' not in data:
            raise ValueError("Invalid input. 'id', 'title', 'text', and 'topic_id' are required.")
        
        discussion_id = data['id']
        title = data['title']
        text = data['text']
        topic_id = data['topic_id']

        # Fetch the existing discussion
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            raise ValueError("Discussion not found. 404")

        # Fetch the topic to ensure it's valid
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found. 404")

        # Check if a discussion with the same title already exists under a different ID
        existing_discussion = Discussion.query.filter_by(title=title).filter(Discussion.id != discussion_id).first()
        if existing_discussion:
            raise ValueError("A discussion with this title already exists. 409")

        try:
            # Update the discussion fields
            discussion.title = title
            discussion.text = text
            discussion.topic_id = topic_id  # Ensure that the correct topic is set

            # Commit the changes to the database
            db.session.commit()
            return discussion

        except Exception as e:
            # Rollback in case of an error
            db.session.rollback()
            raise ValueError("An error occurred while updating the discussion. 500")