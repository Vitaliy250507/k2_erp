from marshmallow import Schema, validate, fields

class ClientCreateSchema(Schema):
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=100, error="Ім'я має бути від 2 до 100 символів.")
    )
    email = fields.Email(
        required=True,
        error="Некоректний формат email-адреси."
    )

class ClientResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)

client_create_schema = ClientCreateSchema()
client_response_schema = ClientResponseSchema()
clients_list_schema = ClientResponseSchema(many=True)