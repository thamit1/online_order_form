from sqlalchemy.orm import Session
from models import Order

def get_orders(session: Session):
    return session.query(Order).filter(Order.is_open == True).all()

def add_order(session: Session, order_data: dict):
    order = Order(**order_data)
    session.add(order)
    session.commit()
    session.refresh(order)
    return order

def update_order(session: Session, order_id: int, updated_data: dict):
    order = session.query(Order).get(order_id)
    if order:
        for key, value in updated_data.items():
            setattr(order, key, value)
        session.commit()
    return order
