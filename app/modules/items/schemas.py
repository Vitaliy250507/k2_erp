from marshmallow import fields, Schema, validate

class ItemCreateSchema(Schema):
    title = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=150, error="Назва товару не може бути порожньою.")
    )
    price = fields.Float(
        required=True,
        validate=validate.Range(min=0.01, error="Ціна товару повинна бути більшою за 0.")
    )

class ItemResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(dump_only=True)
    price = fields.Float(dump_only=True)

item_create_schema = ItemCreateSchema()
item_response_schema = ItemResponseSchema()
items_list_schema = ItemResponseSchema(many=True)