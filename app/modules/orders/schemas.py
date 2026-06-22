from marshmallow import Schema, fields, validate, ValidationError
from app.modules.items.schemas import ItemResponseSchema

def validate_items_not_empty(items_list):
    if not items_list:
        raise ValidationError("У замовленні має бути хоча б один товар.")


class OrderCreateSchema(Schema):
    client_id = fields.Int(
        required=True,
        error_messages={"required": "Не можна створити замовлення без клієнта."}
    )
    items = fields.List(
        fields.Int(),
        required=True,
        validate=validate_items_not_empty
    )

class OrderResponseSchema(Schema):
    id = fields.Int(dump_only=True)
    client_id = fields.Int(dump_only=True)
    total_amount = fields.Float(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    items = fields.Nested(ItemResponseSchema, many=True)

order_create_schema = OrderCreateSchema()
order_response_schema = OrderResponseSchema()
orders_list_schema = OrderResponseSchema(many=True)
