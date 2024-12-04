# services/topic_service.py
from ..dtos.topic_schema import TopicSchema
from ..models.discussion import Discussion
from ..models.comment import Comment
from ..models.topic import Topic
from ..database import db
from ..config import Config  # Import Config class
from ..models.discussion_reaction import DiscussionReaction

class TopicService:

    @staticmethod
    def create_topic(data):
        if not data or 'name' not in data or 'description' not in data:
            return ValueError("Invalid input. 'name' and 'description' are required.")
        
        name = data['name']
        description = data['description']


        existing_topic = Topic.query.filter_by(name=name).first()
        if existing_topic:
            return ValueError("Topic with this name already exists.")

        new_topic = Topic(name=name, description=description)

        try:
            db.session.add(new_topic)
            db.session.commit()
            return 
        except Exception as e:
            db.session.rollback()
            return ValueError({"An error occurred while creating the topic. 500"})       

    @staticmethod
    def edit_topic(data):
        if not data or 'id' not in data or 'name' not in data or 'description' not in data:
            raise ValueError("Invalid input. 'id', 'name', and 'description' are required.")
        
        topic_id = data['id']
        name = data['name']
        description = data['description']

        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found. 404")

        existing_topic = Topic.query.filter_by(name=name).filter(Topic.id != topic_id).first()
        if existing_topic:
            raise ValueError("A topic with this name already exists. 409")

        try:
            topic.name = name  
            topic.description = description            
            db.session.commit()
            return topic 

        except Exception as e:
            db.session.rollback()
            raise ValueError("An error occurred while updating the topic. 500")
        
    @staticmethod
    def delete_topic(data):
        if not data or 'id' not in data or 'delete_discussions' not in data:
            raise ValueError("Invalid input. 'id' and 'delete_discussions' are required.")

        topic_id = data['id']
        delete_discussions = data['delete_discussions']

        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")

        try:
            if delete_discussions:
                # Delete all discussions associated with the topic
                discussions = Discussion.query.filter_by(topic_id=topic_id).all()
                for discussion in discussions:
                    db.session.delete(discussion)

            db.session.delete(topic)
            db.session.commit()
            return True

        except Exception as e:
            db.session.rollback()
            raise ValueError(f"An error occurred while deleting the topic: {str(e)}")

    
    

    @staticmethod
    def delete_topics(data):
        # Provera da li su prosleđeni podaci i da li sadrže 'ids'
        if not data or 'ids' not in data or not isinstance(data['ids'], list):
            raise ValueError("Invalid input. 'ids' list is required.")

        ids = data['ids']

        # Pronađi sve teme koje odgovaraju ID-evima
        topics = Topic.query.filter(Topic.id.in_(ids)).all()

        if not topics:
            raise ValueError("No topics found with the provided IDs.")

        try:
            # Brisanje svih pronađenih tema
            for topic in topics:
                db.session.delete(topic)
            
            db.session.commit()
            return True  # Vraćamo True ako su sve teme obrisane

        except Exception as e:
            db.session.rollback()  # Rollback ako dođe do greške
            error_message = str(e)
            
            # Provera da li greška sadrži poruku o stranim ključevima
            if "foreign key" in error_message.lower() or "constraint" in error_message.lower():
                raise ValueError("There are discussions associated with this topic. Please remove or reassign them before deleting the topic.")
            else:
                raise ValueError(f"An error occurred while deleting topics: {error_message}")
    

    @staticmethod
    def delete_topic_and_discussions_with_reactions(topic_id):
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")

        # Pronađi sve diskusije povezane sa topikom
        discussions = Discussion.query.filter_by(topic_id=topic_id).all()

        for discussion in discussions:
            # Obriši sve reakcije povezane sa diskusijom
            DiscussionReaction.query.filter_by(discussion_id=discussion.id).delete()

            # Obriši sve komentare povezane sa diskusijom
            Comment.query.filter_by(discussion_id=discussion.id).delete()

            # Obriši diskusiju
            db.session.delete(discussion)

        # Na kraju obriši i topik
        db.session.delete(topic)

        # Sačuvaj promene
        db.session.commit()

    @staticmethod
    def delete_topics_and_discussions_with_reactions(topic_ids):
        topics = Topic.query.filter(Topic.id.in_(topic_ids)).all()

        if not topics:
            raise ValueError("No topics found for the given IDs.")

        for topic in topics:
            # Pronađi sve diskusije povezane sa topikom
            discussions = Discussion.query.filter_by(topic_id=topic.id).all()

            for discussion in discussions:
                # Obriši sve reakcije povezane sa diskusijom
                DiscussionReaction.query.filter_by(discussion_id=discussion.id).delete()

                # Obriši sve komentare povezane sa diskusijom
                Comment.query.filter_by(discussion_id=discussion.id).delete()

                # Obriši diskusiju
                db.session.delete(discussion)

            # Na kraju obriši i topik
            db.session.delete(topic)

        # Sačuvaj promene
        db.session.commit()


    @staticmethod
    def get_topic_by_id(topic_id):
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")
        return topic

    @staticmethod
    def get_all_topics():
        # Dobijanje svih topika iz baze
        topics = Topic.query.all()

        # Serializacija podataka pomoću TopicSchema
        topic_schema = TopicSchema(many=True)
        return topic_schema.dump(topics)

    @staticmethod
    def get_topic_by_id(topic_id):
        # Pronalaženje topika sa određenim ID-jem
        topic = Topic.query.get(topic_id)

        if topic is None:
            return None

        # Serializacija podataka pomoću TopicSchema
        topic_schema = TopicSchema()
        return topic_schema.dump(topic)