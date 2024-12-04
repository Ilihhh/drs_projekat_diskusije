from flask import Blueprint, request, jsonify # type: ignore
from ..auth.auth import token_required
from ..services.comment_service import CommentService

comments_blueprint = Blueprint('comments', __name__)

@comments_blueprint.route('/add-comment', methods=['POST'])
@token_required  # Ensure the user is authenticated to add a comment
def add_comment(current_user):
    # Get the data from the JSON request body
    data = request.get_json()

    # Call the service to handle the business logic
    response, status_code = CommentService.add_comment(data, current_user)

    # Return the response from the service
    return jsonify(response), status_code

@comments_blueprint.route('/delete-comment/<int:comment_id>', methods=['DELETE'])
@token_required  # Ensure the user is authenticated to delete a comment
def delete_comment(current_user, comment_id):
    # Call the service to handle the business logic
    response, status_code = CommentService.delete_comment(comment_id, current_user)

    # Return the response from the service
    return jsonify(response), status_code
