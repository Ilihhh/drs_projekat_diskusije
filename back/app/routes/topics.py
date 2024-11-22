from ..auth.auth import token_required, role_required
##from ..services.users_service import DiscussionService
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.topic_schema import TopicSchema
from ..models.topic import Topic
from ..database import db
from ..services.topic_service import TopicService

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

@topics_blueprint.route('/topic/create-topic', methods=['POST'])
@token_required
@role_required('admin')
def create_topic(current_user):

    data = request.get_json()
    
    try:
        topic = TopicService.create_topic(data)        
        return jsonify({"message": "Topic created successfully!"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@topics_blueprint.route('/topic/edit-topic', methods=['PUT'])
@token_required
@role_required('admin')    
def edit_topic(current_user):
    data = request.get_json()
    
    try:
        topic = TopicService.edit_topic(data)
        if topic:  # Check if topic was returned after editing
            return jsonify({"message": "Topic edited successfully!"}), 200
        else:
            return jsonify({"error": "Failed to edit topic."}), 500
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal error occurred."}), 500
    
@topics_blueprint.route('/topic/delete-topic', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_topic(current_user):
    data = request.get_json()
    try:
        # Pozivanje servisa za brisanje topic-a
        success = TopicService.delete_topic(data)
        
        if success:
            return jsonify({"message": "Topic deleted successfully!"}), 200
        else:
            return jsonify({"error": "Topic not found."}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal error occurred."}), 500
    

@topics_blueprint.route('/topic/delete-selected-topic', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_topics(current_user):
    # Dobijamo listu ID-ova iz zahteva
    data = request.get_json()

    # Proveravamo da li je prosleđena lista direktno, umesto sa "ids" ključem
    if not isinstance(data, list):  # Očekujemo da je data lista
        return jsonify({"error": "Invalid input. A list of topic IDs is required."}), 400

    ids = data  # Ako je data lista, direktno dodeljujemo

    try:
        # Pozivanje servisa za brisanje više tema
        success = TopicService.delete_topics({'ids': ids})

        if success:
            return jsonify({"message": "Topics deleted successfully!"}), 200
        else:
            return jsonify({"error": "Some topics not found."}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal error occurred."}), 500


