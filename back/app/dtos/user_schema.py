# schemas/user_schema.py
from marshmallow import Schema, fields  # type: ignore

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email = fields.Str(required=True)
    username = fields.Str(required=True)
    city = fields.Str()
    country = fields.Str()
    phone_number = fields.Str()
    address = fields.Str()  # Dodato polje za adresu

    # Password will not be serialized in the response
    password = fields.Str(load_only=True)

    # Status field for registration requests
    status = fields.Str(dump_only=True)  # Ensures the status is only returned, not updated via API
