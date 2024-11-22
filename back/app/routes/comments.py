from flask import Blueprint, jsonify, request # type: ignore
from ..auth.auth import token_required  # Ensure token_required is imported for authentication
from ..models.comment import Comment
from ..models.discussion import Discussion
from ..database import db

comments_blueprint = Blueprint('comments', __name__)

@comments_blueprint.route('/add-comment', methods=['POST'])
@token_required  # Ensure the user is authenticated to add a comment
def add_comment(current_user):
    # Get the data from the JSON request body
    data = request.get_json()

    # Extract required fields from the data
    comment_text = data.get("commentText")
    discussion_id = data.get("discussionId")
    mentions = data.get("mentions", [])  # List of users mentioned in the comment (if any)

    # Validate the presence of required fields
    if not comment_text or not discussion_id:
        return jsonify({"message": "Comment text and discussionId are required."}), 400

    # Check if the discussion exists
    discussion = Discussion.query.get(discussion_id)
    if not discussion:
        return jsonify({"message": "Discussion not found."}), 404

    # Create a new comment
    new_comment = Comment(
        text=comment_text,
        author_id=current_user.id,  # The user who posted the comment
        discussion_id=discussion_id  # The discussion the comment belongs to
    )

    try:
        # Add the comment to the database
        db.session.add(new_comment)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error adding comment.", "error": str(e)}), 500

    # Return a successful response with the new comment data
    return jsonify({
        "message": "Comment added successfully.",
        "comment": {
            "id": new_comment.id,
            "text": new_comment.text,
            "creation_date": new_comment.creation_date.isoformat(),
            "author_id": new_comment.author_id,
            "discussion_id": new_comment.discussion_id,
            "mentions": mentions  # Include mentions if any
        }
    }), 200
