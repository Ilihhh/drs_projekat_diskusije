from datetime import datetime
from flask import jsonify # type: ignore
from ..models.comment import Comment
from ..models.discussion import Discussion
from ..models.user import User
from ..database import db


class CommentService:
    @staticmethod
    def add_comment(data, current_user):
        # Extract required fields from the data
        comment_text = data.get("commentText")
        discussion_id = data.get("discussionId")
        mentions = data.get("mentions", [])  # List of users mentioned in the comment (if any)

        # Validate the presence of required fields
        if not comment_text or not discussion_id:
            return {"message": "Comment text and discussionId are required."}, 400

        # Check if the discussion exists
        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return {"message": "Discussion not found."}, 404

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

            # Fetch author details
            author = User.query.get(current_user.id)

            # Build the response
            response_data = {
                "id": new_comment.id,
                "text": new_comment.text,
                "creation_date": new_comment.creation_date.strftime("%a, %d %b %Y %H:%M:%S GMT"),
                "author": {
                    "id": author.id,
                    "username": author.username,
                    "email": author.email  # Include other fields if needed
                }
            }
            return response_data, 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Error adding comment.", "error": str(e)}, 500


    @staticmethod
    def delete_comment(comment_id, current_user):
        # Fetch the comment from the database
        comment = Comment.query.get(comment_id)

        if not comment:
            return {"message": "Comment not found."}, 404

        # Check if the current user is the author of the comment
        if comment.author_id != current_user.id:
            return {"message": "You are not authorized to delete this comment."}, 403

        try:
            # Delete the comment from the database
            db.session.delete(comment)
            db.session.commit()
            return {"message": "Comment deleted successfully."}, 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Error deleting comment.", "error": str(e)}, 500