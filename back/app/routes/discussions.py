from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.discussion_schema import DiscussionSchema
from ..models.topic import Topic
from ..models.discussion import Discussion
from ..models.comment import Comment
from ..services.discussion_service import DiscussionService
from ..models.user import User  

discussions_blueprint = Blueprint('discussions', __name__)

@discussions_blueprint.route('/discussions', methods=['GET'])
def get_all_discussions():
    discussions = Discussion.query.all()

    # Prikupi sve jedinstvene topic_id i author_id iz diskusija
    unique_topic_ids = {discussion.topic_id for discussion in discussions}
    unique_author_ids = {discussion.author_id for discussion in discussions}

    # Učitaj sve teme povezane sa diskusijama
    topics = Topic.query.filter(Topic.id.in_(unique_topic_ids)).all()
    topic_map = {topic.id: {"id": topic.id, "name": topic.name, "description": topic.description} for topic in topics}

    # Učitaj sve korisnike povezane sa autorima diskusija
    users = User.query.filter(User.id.in_(unique_author_ids)).all()
    user_map = {user.id: {"id": user.id, "username": user.username, "email": user.email} for user in users}

    # Prikupi sve jedinstvene discussion_id iz komentara
    unique_discussion_ids = {discussion.id for discussion in discussions}

    # Učitaj sve komentare povezane sa diskusijama
    comments = Comment.query.filter(Comment.discussion_id.in_(unique_discussion_ids)).all()

    # Prikupi sve jedinstvene author_id iz komentara (dodajemo ih u mapu korisnika)
    comment_author_ids = {comment.author_id for comment in comments}
    additional_users = User.query.filter(User.id.in_(comment_author_ids - unique_author_ids)).all()
    for user in additional_users:
        user_map[user.id] = {"id": user.id, "username": user.username, "email": user.email}

    # Dodaj informacije o korisnicima u komentare
    comment_map = {}
    for comment in comments:
        if comment.discussion_id not in comment_map:
            comment_map[comment.discussion_id] = []
        comment_map[comment.discussion_id].append({
            "id": comment.id,
            "author": user_map.get(comment.author_id, None),  # Dodaj informacije o autoru
            "text": comment.text,
            "creation_date": comment.creation_date
        })

    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

    # Dodaj temu, autora i komentare za svaku diskusiju
    for discussion in discussions_data:
        topic_id = discussion["topic_id"]
        discussion["topic"] = topic_map.get(topic_id, None)

        author_id = discussion["author_id"]
        discussion["author"] = user_map.get(author_id, None)  # Dodaj autora

        discussion_id = discussion["id"]
        discussion["comments"] = comment_map.get(discussion_id, [])

    return jsonify(discussions_data), 200




@discussions_blueprint.route('/userdiscussions', methods=['GET'])
@token_required
def get_user_discussions(current_user):
    
    # Filtriramo diskusije prema korisniku koji je trenutno prijavljen
    discussions = Discussion.query.filter_by(author_id=current_user.id).all()

    # Ako nema diskusija za ovog korisnika, vraćamo praznu listu
    if not discussions:
        return jsonify([]), 200

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

@discussions_blueprint.route('/create-discussion', methods=['POST'])
@token_required  # Pretpostavljamo da je korisnik autentifikovan
def create_discussion(current_user):
    # Uzmi podatke iz zahteva
    data = request.get_json()

    try:
        # Pozovi metodu iz DiscussionService za kreiranje diskusije
        new_discussion = DiscussionService.create_discussion(data, current_user)
        
        # Serijalizuj novu diskusiju i vrati je kao odgovor
        discussion_schema = DiscussionSchema()
        discussion_data = discussion_schema.dump(new_discussion)
        
        return jsonify(discussion_data), 201  # Diskusija je uspešno kreirana
    
    except ValueError as e:
        return jsonify({"message": str(e)}), 400  # Ako je došlo do greške (npr. missing data)
    except Exception as e:
        return jsonify({"message": "An internal error occurred.", "error": str(e)}), 500  # Greška servera
    
@discussions_blueprint.route('/edit-discussion', methods=['PUT'])
@token_required
@role_required('admin')  # You can adjust this depending on the required role
def edit_discussion(current_user):
    data = request.get_json()  # Get JSON data from the request
    
    try:
        # Call the service method to handle the editing logic
        discussion = DiscussionService.edit_discussion(data)
        
        # If the discussion is successfully updated, return a success message
        if discussion:
            return jsonify({"message": "Discussion edited successfully!"}), 200
        else:
            return jsonify({"error": "Failed to edit discussion."}), 500
    
    except ValueError as e:
        # If the service raises a ValueError, it means validation failed (e.g., missing fields, duplicates)
        return jsonify({"error": str(e)}), 400  # Return 400 Bad Request for validation issues
    
    except Exception as e:
        # Catch any other unexpected errors and return a generic server error message
        return jsonify({"error": "An internal error occurred."}), 500