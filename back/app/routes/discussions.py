from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.discussion_schema import DiscussionSchema
from ..models.topic import Topic
from ..models.discussion import Discussion

discussions_blueprint = Blueprint('discussions', __name__)

@discussions_blueprint.route('/discussions', methods=['GET'])
def get_all_discussions():
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

@discussions_blueprint.route('/userdiscussions', methods=['GET'])
@token_required
def get_user_discussions(current_user):
    # Provodi se provera da li je korisnik autorizovan da vidi svoje diskusije
    # (obično se verifikuje u token_required dekoratoru)
    
    # Filtriramo diskusije prema korisniku koji je trenutno prijavljen
    discussions = Discussion.query.filter_by(author_id=current_user.id).all()

    # Ako nema diskusija za ovog korisnika, vraćamo praznu listu
    if not discussions:
        return jsonify({"message": "No discussions found for this user."}), 404

    # Izdvajamo jedinstvene topic_id-eve iz diskusija
    unique_topic_ids = {discussion.topic_id for discussion in discussions}

    # Filtriramo teme koje odgovaraju tim topic_id-evima
    topics = Topic.query.filter(Topic.id.in_(unique_topic_ids)).all()

    # Kreiramo mapu tema po njihovim ID-evima za brži pristup
    topic_map = {topic.id: {"id": topic.id, "name": topic.name, "description": topic.description} for topic in topics}  

    # Serijalizujemo diskusije
    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

    # Dodajemo podatke o temi svakoj diskusiji
    for discussion in discussions_data:
        topic_id = discussion["topic_id"]
        discussion["topic"] = topic_map.get(topic_id, None)  # Dodaj temu ili None ako nije pronađena
    
    return jsonify(discussions_data), 200

