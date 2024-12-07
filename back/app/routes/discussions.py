from ..auth.auth import token_required, role_required
from flask import Blueprint, jsonify, request  # type: ignore
from ..dtos.discussion_schema import DiscussionSchema
from ..models.discussion import Discussion
from ..services.discussion_service import DiscussionService


discussions_blueprint = Blueprint('discussions', __name__)

@discussions_blueprint.route('/discussions', methods=['GET'])
def get_all_discussions():
    discussions = Discussion.query.all()

    # Serijalizuj diskusije sa povezanim temama, autorima i komentarima
    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

    return jsonify(discussions_data), 200


@discussions_blueprint.route('/userdiscussions', methods=['GET'])
@token_required
def get_user_discussions(current_user):
    # Filtriraj diskusije prema korisniku koji je trenutno prijavljen
    discussions = Discussion.query.filter_by(author_id=current_user.id).all()

    # Ako nema diskusija za ovog korisnika, vraćamo praznu listu
    if not discussions:
        return jsonify([]), 200

    # Serijalizuj diskusije sa povezanim temama, autorima i komentarima
    discussion_schema = DiscussionSchema(many=True)
    discussions_data = discussion_schema.dump(discussions)

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
def edit_discussion(current_user):
    data = request.get_json()  
    
    try:

        discussion = DiscussionService.get_discussion_by_id(data.get('id'))
        
        # Provera prava pristupa: samo autor diskusije ili admin može da uređuje
        if current_user.role != 'admin' and discussion.author_id != current_user.id:
            return jsonify({"error": "You do not have permission to edit this discussion."}), 403

   
        updated_discussion = DiscussionService.edit_discussion(data)
        
       
        if updated_discussion:
            return jsonify({"message": "Discussion edited successfully!"}), 200
        else:
            return jsonify({"error": "Failed to edit discussion."}), 500
    
    except ValueError as e:
       
        return jsonify({"error": str(e)}), 400  
    
    except Exception as e:
       
        return jsonify({"error": "An internal error occurred.", "details": str(e)}), 500
    
@discussions_blueprint.route('/search-discussions', methods=['POST'])
def search_discussions():
    # Get the search data from the request JSON body
    data = request.get_json()

    # Call the search function to retrieve discussions
    discussions = DiscussionService.search_discussions(data)

    if not discussions:
        return jsonify({"message": "No results found for your search."}), 404

    # Serialize the discussions
    discussion_schema = DiscussionSchema(many=True)
    
    return jsonify(discussion_schema.dump(discussions))




@discussions_blueprint.route('/delete-discussion/<int:discussion_id>', methods=['DELETE'])
@token_required
def delete_discussion(current_user, discussion_id):
    try:
      
        discussion = DiscussionService.get_discussion_by_id(discussion_id)
        if not discussion:
            return jsonify({"error": "Discussion not found"}), 404

        # Proveri da li je korisnik admin ili vlasnik diskusije
        if current_user.role != 'admin' and discussion.author_id != current_user.id:
            return jsonify({"error": "You are not authorized to delete this discussion"}), 403

       
        DiscussionService.delete_discussion(discussion_id)
        return jsonify({"message": "Discussion, comments, and reactions deleted successfully"}), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An internal error occurred.", "details": str(e)}), 500
