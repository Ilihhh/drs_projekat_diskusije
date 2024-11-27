from ..models.discussion import Discussion
from ..models.discussion_reaction import DiscussionReaction
from ..database import db


class DiscussionReactionService:
    @staticmethod
    def manage_reaction(current_user, discussion_id, reaction):
        if not discussion_id or reaction not in ["like", "dislike", "none"]:
            raise ValueError("Invalid input. 'discussion_id' and valid 'reaction' are required.")

        discussion = Discussion.query.get(discussion_id)
        if not discussion:
            raise ValueError("Discussion not found.")

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
                    raise ValueError("No reaction to remove.")
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

            # Trenutna reakcija korisnika nakon ažuriranja
            user_reaction = (
                DiscussionReaction.query.filter_by(
                    user_id=current_user.id, discussion_id=discussion_id
                ).first()
            )
            current_reaction = user_reaction.reaction if user_reaction else "none"

            return {
                "message": message,
                "likes": likes,
                "dislikes": dislikes,
                "current_user_reaction": current_reaction
            }
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def get_user_reactions(current_user, discussion_ids):
        if not isinstance(discussion_ids, list) or not all(isinstance(d_id, int) for d_id in discussion_ids):
            raise ValueError("Invalid 'discussion_ids'. It should be a list of integers.")

        try:
            reactions = DiscussionReaction.query.filter(
                DiscussionReaction.user_id == current_user.id,
                DiscussionReaction.discussion_id.in_(discussion_ids)
            ).all()

            # Mapiranje rezultata u {discussion_id: reaction}
            user_reactions = {reaction.discussion_id: reaction.reaction for reaction in reactions}

            # Vraća reakcije za sve diskusije, ako nema reakcije postavlja 'none'
            return {d_id: user_reactions.get(d_id, "none") for d_id in discussion_ids}
        except Exception:
            raise
