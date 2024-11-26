from datetime import datetime
from flask import jsonify # type: ignore
from ..models.comment import Comment
from ..models.discussion import Discussion
from ..models.user import User
from ..database import db
from ..services.email_service import EmailService
from pytz import timezone # type: ignore

class CommentService:
    

    @staticmethod
    def add_comment(data, current_user):
        comment_text = data.get("commentText")
        discussion_id = data.get("discussionId")
        mentions = data.get("mentions", [])

        if not comment_text or not discussion_id:
            return {"message": "Comment text and discussionId are required."}, 400

        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            return {"message": "Discussion not found."}, 404

        invalid_mentions = [
            username for username in mentions 
            if not User.query.filter_by(username=username).first()
        ]
        if invalid_mentions:
            return {
                "message": "Invalid mentions.",
                "invalid_mentions": invalid_mentions
            }, 400

        new_comment = Comment(
            text=comment_text,
            author_id=current_user.id,
            discussion_id=discussion_id
        )

        try:
            db.session.add(new_comment)
            db.session.commit()

            author = User.query.get(current_user.id)

            # Notify mentioned users
            for username in mentions:
                mentioned_user = User.query.filter_by(username=username).first()
                if mentioned_user and mentioned_user.email:
                    email_body = (
                        f"Hello {mentioned_user.username},\n\n"
                        f"You were mentioned in a comment by {author.username}:\n\n"
                        f"\"{comment_text}\"\n\n"
                        "Visit the discussion to reply or read more.\n\n"
                        "Best regards,\n"
                        "Your Discussion App"
                    )
                    EmailService.send_email(
                        recipient=mentioned_user.email,
                        subject="You were mentioned in a comment",
                        body=email_body
                    )

            # CET time zone for formatting
            cet = timezone('CET')
            creation_date_cet = new_comment.creation_date.astimezone(cet).isoformat()

            response_data = {
                "id": new_comment.id,
                "text": new_comment.text,
                "creation_date": creation_date_cet,
                "author": {
                    "id": author.id,
                    "username": author.username,
                    "email": author.email
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

        # Fetch the discussion associated with the comment
        discussion = Discussion.query.get(comment.discussion_id)

        # Check if the current user is authorized to delete the comment
        is_author = comment.author_id == current_user.id
        is_discussion_owner = discussion and discussion.author_id == current_user.id
        is_admin = current_user.role == 'admin'  # Adjust based on how roles are defined in your app

        if not (is_author or is_discussion_owner or is_admin):
            return {"message": "You are not authorized to delete this comment."}, 403

        try:
            # Delete the comment from the database
            db.session.delete(comment)
            db.session.commit()
            return {"message": "Comment deleted successfully."}, 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Error deleting comment.", "error": str(e)}, 500
