from marshmallow import Schema, fields

class UsuarioSchema(Schema):
    id_usuario = fields.Int(dump_only=True)
    nombre = fields.Str(required=True)
    email = fields.Email(required=True)
    contraseña = fields.Str(load_only=True)
    rol = fields.Str()
