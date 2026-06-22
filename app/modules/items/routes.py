from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.extensions import db
from app.modules.items.models import Item
from app.modules.items.schemas import item_create_schema, item_response_schema

items_bp = Blueprint('items', __name__, url_prefix='/api/items')

@items_bp.route('', methods=['POST'])
def create_item():
    try:
        data = item_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    new_item = Item(title=data['title'], price=data['price'])
    db.session.add(new_item)
    db.session.commit()

    return jsonify(item_response_schema.dump(new_item)), 201