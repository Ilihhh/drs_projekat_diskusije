# schemas/korisnik_schema.py
from marshmallow import Schema, fields # type: ignore

class KorisnikSchema(Schema):
    id = fields.Int(dump_only=True)
    ime = fields.Str(required=True)
    prezime = fields.Str(required=True)
    email = fields.Str(required=True)
    korisnicko_ime = fields.Str(required=True)
    grad = fields.Str()
    drzava = fields.Str()
    broj_telefona = fields.Str()

    # Lozinka neće biti serijalizovana u odgovoru
    lozinka = fields.Str(load_only=True)
