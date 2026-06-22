from app.extensions import db

class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Colun(db.String(120), unique=True, nullable=False)

    orders = db.relationship('Order', back_populates='client', lazy=True)