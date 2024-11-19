from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.topic_schema import TopicSchema
from ..models.topic import Topic
from ..database import db

topics_blueprint = Blueprint('topics', __name__)

@topics_blueprint.route('/topics', methods=['GET'])
@token_required
def get_all_topics(user):
    topics = Topic.query.all()  # Dobijanje svih topika iz baze
    
    # Serializacija podataka pomoću TopicSchema
    topic_schema = TopicSchema(many=True)
    topics_data = topic_schema.dump(topics)
    
    return jsonify(topics_data), 200  # Vraća listu topika u JSON formatu

@topics_blueprint.route('/topics/<int:id>', methods=['GET'])
@token_required
def get_topic_by_id(user, id):
    # Pronalaženje topika sa određenim ID-jem
    topic = Topic.query.get(id)

    if topic is None:
        return jsonify({"message": "Topic not found"}), 404  # Ako topik nije pronađen

    # Serializacija podataka pomoću TopicSchema
    topic_schema = TopicSchema()
    topic_data = topic_schema.dump(topic)
    
    return jsonify(topic_data), 200  # Vraća pojedinačan topik u JSON formatu