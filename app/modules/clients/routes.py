from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.extensions import db
from app.modules.clients.models import Client
from app.modules.clients.schemas import client_create_schema, client_response_schema

clients_bp = Blueprint("clients", __name__, url_prefix="/api/clients")


@clients_bp.route("", methods=["GET"])
def get_clients():
    clients = Client.query.all()
    return jsonify(client_response_schema.dump(clients, many=True)), 200


@clients_bp.route("", methods=["POST"])
def create_client():
    try:
        data = client_create_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    if Client.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Клієнт з таким email вже існує."}), 400

    new_client = Client(name=data["name"], email=data["email"])
    db.session.add(new_client)
    db.session.commit()

    return jsonify(client_response_schema.dump(new_client)), 201
