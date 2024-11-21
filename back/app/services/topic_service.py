# services/topic_service.py
from ..models.topic import Topic
from ..database import db
from ..config import Config  # Import Config class

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
        if not data or 'id' not in data:
            raise ValueError("Invalid input. 'id' is required.")

        topic_id = data['id']

     
        topic = Topic.query.get(topic_id)
        if not topic:
            raise ValueError("Topic not found.")

        try:
           
            db.session.delete(topic)
            db.session.commit()
            return True  

        except Exception as e:
            db.session.rollback()
            raise ValueError("An error occurred while deleting the topic.")