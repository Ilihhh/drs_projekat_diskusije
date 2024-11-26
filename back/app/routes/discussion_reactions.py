from flask import Blueprint, jsonify, request # type: ignore
from ..auth.auth import token_required
from ..models.discussion import Discussion
from ..models.discussion_reaction import DiscussionReaction
from ..database import db

reaction_blueprint = Blueprint('reactions', __name__)

@reaction_blueprint.route('/reaction', methods=['POST'])
@token_required
def manage_reaction(current_user):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing data."}), 400

    discussion_id = data.get("discussion_id")
    reaction = data.get("reaction")

    if not discussion_id or reaction not in ["like", "dislike", "none"]:
        return jsonify({"error": "Invalid input. 'discussion_id' and valid 'reaction' are required."}), 400

    discussion = Discussion.query.get(discussion_id)
    if not discussion:
        return jsonify({"error": "Discussion not found."}), 404

    existing_reaction = DiscussionReaction.query.filter_by(
        user_id=current_user.id,
        discussion_id=discussion_id
    ).first()

    try:
        if reaction == "none":
            if existing_reaction:
                db.session.delete(existing_reaction)
                message = "Reaction removed."
            else:
                return jsonify({"error": "No reaction to remove."}), 400
        elif existing_reaction:
            if existing_reaction.reaction == reaction:
                db.session.delete(existing_reaction)
                message = "Reaction removed."
            else:
                existing_reaction.reaction = reaction
                message = "Reaction updated."
        else:
            new_reaction = DiscussionReaction(
                user_id=current_user.id,
                discussion_id=discussion_id,
                reaction=reaction
            )
            db.session.add(new_reaction)
            message = "Reaction added."

        db.session.commit()

        likes = DiscussionReaction.query.filter_by(discussion_id=discussion_id, reaction="like").count()
        dislikes = DiscussionReaction.query.filter_by(discussion_id=discussion_id, reaction="dislike").count()

        # Proverite trenutnu reakciju korisnika nakon ažuriranja
        user_reaction = (
            DiscussionReaction.query.filter_by(
                user_id=current_user.id, discussion_id=discussion_id
            ).first()
        )
        current_reaction = user_reaction.reaction if user_reaction else "none"

        return jsonify({
            "message": message,
            "likes": likes,
            "dislikes": dislikes,
            "current_user_reaction": current_reaction
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while managing the reaction.", "details": str(e)}), 500


@reaction_blueprint.route('/user-reactions', methods=['POST'])
@token_required
def get_user_reactions(current_user):
    data = request.get_json()

    if not data or "discussion_ids" not in data:
        return jsonify({"error": "Missing 'discussion_ids' in request data."}), 400

    discussion_ids = data.get("discussion_ids")

    if not isinstance(discussion_ids, list) or not all(isinstance(d_id, int) for d_id in discussion_ids):
        return jsonify({"error": "Invalid 'discussion_ids'. It should be a list of integers."}), 400

    try:
        # Dobavljanje reakcija za korisnika i prosleđene diskusije
        reactions = DiscussionReaction.query.filter(
            DiscussionReaction.user_id == current_user.id,
            DiscussionReaction.discussion_id.in_(discussion_ids)
        ).all()

        # Mapiranje rezultata u {discussion_id: reaction}
        user_reactions = {reaction.discussion_id: reaction.reaction for reaction in reactions}

        # Vraća reakcije za sve diskusije, ako nema reakcije postavlja 'none'
        response = {d_id: user_reactions.get(d_id, "none") for d_id in discussion_ids}

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": "An error occurred while fetching reactions.", "details": str(e)}), 500
