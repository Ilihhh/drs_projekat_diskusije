from marshmallow import Schema, fields # type: ignore
from datetime import datetime

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    text = fields.Str(required=True)
    creation_date = fields.DateTime(dump_only=True)  # dump_only da ne bi bilo problema tokom serijalizacije
    
    author_id = fields.Int(required=True)
    discussion_id = fields.Int(required=True)

    

    # Ako želiš da uključiš povezane objekte, možeš dodati 'author' i 'discussion' ako to zahtevaš
    # author = fields.Nested('UserSchema', exclude=('comments',))  # Ako imaš UserSchema
    # discussion = fields.Nested('DiscussionSchema', exclude=('comments',))  # Ako imaš DiscussionSchema
