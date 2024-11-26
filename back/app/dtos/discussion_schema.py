from marshmallow import Schema, fields  # type: ignore
from datetime import datetime
from ..dtos.topic_schema import TopicSchema
from ..dtos.comment_schema import CommentSchema
from ..dtos.user_schema import UserSchema  # Pretpostavka da UserSchema postoji

class DiscussionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    text = fields.Str(required=True)
    creation_date = fields.DateTime(dump_only=True, default=datetime.utcnow)
    author_id = fields.Int(required=True)
    topic_id = fields.Int(required=True)
    comments = fields.List(fields.Nested(CommentSchema))  # Direktna referenca na komentare

    # Povezana tema
    topic = fields.Nested(TopicSchema, dump_only=True)

    # Informacije o autoru
    author = fields.Nested(UserSchema, dump_only=True)

    # Broj lajkova i dislajkova
    likes_count = fields.Method("get_likes_count", dump_only=True)
    dislikes_count = fields.Method("get_dislikes_count", dump_only=True)


    def get_likes_count(self, obj):
        """Broj lajkova za diskusiju."""
        return obj.get_likes_count() if hasattr(obj, "get_likes_count") else 0

    def get_dislikes_count(self, obj):
        """Broj dislajkova za diskusiju."""
        return obj.get_dislikes_count() if hasattr(obj, "get_dislikes_count") else 0
