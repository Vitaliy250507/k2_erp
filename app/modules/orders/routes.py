from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.extensions import db
from app.modules.clients.models import Client
from app.modules.items.models import Item
from app.modules.orders.models import Order, order_items
from app.modules.orders.schemas import order_create_schema, order_response_schema, orders_list_schema

orders_bp = Blueprint('orders', __name__, url_prefix='/api')


@orders_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = order_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    client = Client.query.get(data['client_id'])
    if not client:
        return jsonify({"error": f"Клієнта з ID {data['client_id']} не знайдено."}), 404

    item_ids = data['items']
    items = Item.query.filter(Item.id.in_(item_ids)).all()

    if len(items) != len(set(item_ids)):
        return jsonify({"error": "Один або кілька вказаних товарів не існують у базі."}), 400

    new_order = Order(client_id=client.id)
    db.session.add(new_order)
    db.session.flush()
    for item in items:
        quantity = item_ids.count(item.id)
        stmt = order_items.insert().values(
            order_id=new_order.id,
            item_id=item.id,
            quantity=quantity
        )
        db.session.execute(stmt)

    db.session.refresh(new_order)

    new_order.calculate_total()
    db.session.commit()

    return jsonify(order_response_schema.dump(new_order)), 201



@orders_bp.route('/clients/<int:client_id>/orders', methods=['GET'])
def get_client_orders(client_id):
    client = Client.query.get(client_id)
    if not client:
        return jsonify({"error": f"Клієнта з ID {client_id} не знайдено."}), 404

    return jsonify(orders_list_schema.dump(client.orders)), 200