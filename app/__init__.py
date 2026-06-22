from flask import Flask
from app.config import Config
from app.extensions import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    from app.extensions import migrate
    migrate.init_app(app, db)

    from app.modules.clients.routes import clients_bp
    from app.modules.items.routes import items_bp
    from app.modules.orders.routes import orders_bp

    app.register_blueprint(clients_bp)
    app.register_blueprint(items_bp)
    app.register_blueprint(orders_bp)

    return app