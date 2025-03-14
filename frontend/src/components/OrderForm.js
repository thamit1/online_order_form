import React, { useState } from "react";
import axios from "axios";

function OrderForm({ onOrderAdded }) {
  const [order, setOrder] = useState({ customer_name: "", item: "", quantity: 0, price: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/orders", order);
      alert("Order Created Successfully!");
      setOrder({ customer_name: "", item: "", quantity: 0, price: 0 }); // Reset form
      if (onOrderAdded) {
        onOrderAdded(); // Re-fetch orders after adding a new one
      }
    } catch (error) {
      alert("Error creating order: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Customer Name"
        value={order.customer_name}
        onChange={(e) => setOrder({ ...order, customer_name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Item"
        value={order.item}
        onChange={(e) => setOrder({ ...order, item: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={order.quantity}
        onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value) })}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={order.price}
        onChange={(e) => setOrder({ ...order, price: parseInt(e.target.value) })}
        required
      />
      <button type="submit">Add Order</button>
    </form>
  );
}

export default OrderForm;
