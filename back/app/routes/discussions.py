from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.discussion_schema import DiscussionSchema
from ..models.topic import Topic
from ..models.discussion import Discussion

discussions_blueprint = Blueprint('discussions', __name__)

@discussions_blueprint.route('/discussions', methods=['GET'])
@token_required
def get_all_discussions(user):
    discussions = Discussion.query.all()

    unique_topic_ids = {discussion.topic_id for discussion in discussions}

    topics = Topic.query.filter(Topic.id.in_(unique_topic_ids)).all()
    
    # Kreiraj mapu tema po njihovom ID-u za brži pristup
    topic_map = {topic.id: {"id": topic.id, "name": topic.name, "description": topic.description} for topic in topics}  
       
    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)
    
    for discussion in discussions_data:
        topic_id = discussion["topic_id"]
        discussion["topic"] = topic_map.get(topic_id, None)  # Dodaj temu ili None ako nije pronađena
    
    return jsonify(discussions_data), 200