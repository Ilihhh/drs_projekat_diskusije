from marshmallow import Schema, fields # type: ignore
from datetime import datetime
from ..dtos.user_schema import UserSchema  # Pretpostavljam da već postoji UserSchema

class CommentSchema(Schema):
    id = fields.Int(dump_only=True)
    discussion_id = fields.Int(required=True)
    text = fields.Str(required=True)
    creation_date = fields.DateTime(dump_only=True)
    
    # Dodavanje autora komentara
    author = fields.Nested(UserSchema, dump_only=True)  # Povezivanje sa korisnikom
