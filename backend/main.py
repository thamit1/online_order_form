"""
main.py

This module sets up a FastAPI application for managing orders with WebSocket support for real-time updates.

Modules:
    fastapi: FastAPI framework for building APIs.
    sqlalchemy.orm: ORM for interacting with the database.
    models: Contains the SQLAlchemy models.
    schemas: Contains Pydantic schemas for request and response validation.
    database: Contains functions for database operations.
    asyncio: Provides support for asynchronous programming.
    typing: Provides support for type hints.

Functions:
    get_db: Dependency function to get a database session.
    websocket_endpoint: WebSocket endpoint for handling real-time connections.
    broadcast: Sends a message to all active WebSocket connections.
    read_orders: Endpoint to get a list of all orders.
    create_order: Endpoint to create a new order.
    edit_order: Endpoint to update an existing order.

Middleware:
    CORSMiddleware: Middleware to handle Cross-Origin Resource Sharing (CORS).

Usage:
    Run this module directly to start the FastAPI application with Uvicorn.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SessionLocal, Order
from schemas import OrderCreate, OrderResponse
from database import get_orders, add_order, update_order
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from asyncio import Lock

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    """
    Dependency function to get a database session.
    Yields:
        db (Session): SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

active_connections: List[WebSocket] = []
lock = Lock()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for handling real-time connections.
    Args:
        websocket (WebSocket): WebSocket connection.
    """
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast(message: dict):
    """
    Sends a message to all active WebSocket connections.
    Args:
        message (dict): Message to be sent.
    """
    async with lock:
        for connection in active_connections:
            print(f"The host name for connection is {connection.client.host}")
            await connection.send_json(message)

@app.get("/orders", response_model=List[OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    """
    Endpoint to get a list of all orders.
    Args:
        db (Session): SQLAlchemy database session.
    Returns:
        List[OrderResponse]: List of orders.
    """
    return get_orders(db)

@app.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Endpoint to create a new order.
    Args:
        order (OrderCreate): Order data.
        db (Session): SQLAlchemy database session.
    Returns:
        OrderResponse: Created order.
    """
    new_order = add_order(db, order.dict())
    serialized_order = OrderResponse.from_orm(new_order).dict()
    await broadcast({"event": "order_created", "order": serialized_order})
    return new_order

@app.put("/orders/{order_id}", response_model=OrderResponse)
async def edit_order(order_id: int, updated_data: OrderCreate, db: Session = Depends(get_db)):
    """
    Endpoint to update an existing order.
    Args:
        order_id (int): ID of the order to be updated.
        updated_data (OrderCreate): Updated order data.
        db (Session): SQLAlchemy database session.
    Returns:
        OrderResponse: Updated order.
    Raises:
        HTTPException: If the order is not found.
    """
    updated_order = update_order(db, order_id, updated_data.dict(exclude_unset=True))
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    serialized_order = OrderResponse.from_orm(updated_order).dict()
    await broadcast({"event": "order_updated", "order": serialized_order})
    return updated_order

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host='0.0.0.0', port=8000, workers=2, reload=True)
