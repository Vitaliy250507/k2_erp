from app.extensions import db
from datetime import datetime

order_items = db.Table('order_items',
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id', ondelete='CASCADE'), primary_key=True),
    db.Column('item_id', db.Integer, db.ForeignKey('items.id'), primary_key=True),
    db.Column('quantity', db.Integer, default=1)
)


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float, default=0.0)


    client_id = db.Column(db.Integer, db.ForeignKey('clients.id', ondelete='CASCADE'), nullable=False)

    client = db.relationship('Client', back_populates='orders')
    items = db.relationship('Item', secondary=order_items, backref=db.backref('orders', lazy='dynamic'))

    def calculate_total(self):
        total = 0.0
        for item in self.items:
            stmt = db.select(order_items.c.quantity).where(
                order_items.c.order_id == self.id,
                order_items.c.item_id == item.id
            )
            qty = db.session.execute(stmt).scalar() or 1
            total += item.price * qty

        self.total_amount = total