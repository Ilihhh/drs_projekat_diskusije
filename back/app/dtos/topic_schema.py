# schemas/topics_schema.py
from marshmallow import Schema, fields # type: ignore

class TopicSchema(Schema):
    id = fields.Int(dump_only=True)  # dump_only znači da se ovo polje samo serializuje, ne prima podatke prilikom deserializacije
    name = fields.Str(required=True)  # required znači da je ovo polje obavezno prilikom deserializacije
    description = fields.Str()