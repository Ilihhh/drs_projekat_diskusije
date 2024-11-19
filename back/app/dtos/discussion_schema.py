from marshmallow import Schema, fields  # type: ignore
from datetime import datetime
from ..dtos.topic_schema import TopicSchema

class DiscussionSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    text = fields.Str(required=True)
    creation_date = fields.DateTime(dump_only=True, default=datetime.utcnow)
    author_id = fields.Int(required=True)
    topic_id = fields.Int(required=True)
    comments = fields.List(fields.Nested('CommentSchema', exclude=('discussion',)))

    # Dodavanje povezane teme
    topic = fields.Nested(TopicSchema, dump_only=True) 
