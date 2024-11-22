from marshmallow import Schema, fields # type: ignore
from datetime import datetime
from ..dtos.topic_schema import TopicSchema
from ..dtos.comment_schema import CommentSchema
class DiscussionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    text = fields.Str(required=True)
    creation_date = fields.DateTime(dump_only=True, default=datetime.utcnow)
    author_id = fields.Int(required=True)
    topic_id = fields.Int(required=True)
    comments = fields.List(fields.Nested(CommentSchema))  # Direktna referenca radi

    # Dodavanje povezane teme
    topic = fields.Nested(TopicSchema, dump_only=True)

    # Dodavanje broja lajkova i dislajkova
    likes_count = fields.Method("get_likes_count", dump_only=True)
    dislikes_count = fields.Method("get_dislikes_count", dump_only=True)

    def get_likes_count(self, obj):
        """Broj lajkova za diskusiju."""
        return obj.get_likes_count()

    def get_dislikes_count(self, obj):
        """Broj dislajkova za diskusiju."""
        return obj.get_dislikes_count()
