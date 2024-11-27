from flask import Blueprint, jsonify, request # type: ignore
from ..auth.auth import token_required
from ..services.discussion_reaction_service import DiscussionReactionService

reaction_blueprint = Blueprint('reactions', __name__)

@reaction_blueprint.route('/reaction', methods=['POST'])
@token_required
def manage_reaction(current_user):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing data."}), 400

    try:
        response = DiscussionReactionService.manage_reaction(
            current_user=current_user,
            discussion_id=data.get("discussion_id"),
            reaction=data.get("reaction")
        )
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred while managing the reaction.", "details": str(e)}), 500


@reaction_blueprint.route('/user-reactions', methods=['POST'])
@token_required
def get_user_reactions(current_user):
    data = request.get_json()

    if not data or "discussion_ids" not in data:
        return jsonify({"error": "Missing 'discussion_ids' in request data."}), 400

    try:
        response = DiscussionReactionService.get_user_reactions(
            current_user=current_user,
            discussion_ids=data.get("discussion_ids")
        )
        return jsonify(response), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred while fetching reactions.", "details": str(e)}), 500

