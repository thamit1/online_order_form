from pydantic import BaseModel
from typing import Optional

class OrderCreate(BaseModel):
    customer_name: str
    item: str
    quantity: int
    price: int
    is_open: Optional[bool] = True

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    item: str
    quantity: int
    price: int
    is_open: bool

    class Config:
        from_attributes = True  # Ensures ORM support

