from marshmallow import Schema, fields # type: ignore

class DiscussionReactionSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    discussion_id = fields.Int(required=True)
    reaction = fields.Str(required=True, validate=lambda r: r in ["like", "dislike", "none"])
