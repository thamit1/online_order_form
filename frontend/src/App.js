import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderForm from "./components/OrderForm";
import OrderGrid from "./components/OrderGrid";

function App() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "order_created" || data.event === "order_updated") {
        fetchOrders();
      }
    };
    return () => socket.close();
  }, []);

  return (
    <div>
      <h1>Order Management</h1>
      <OrderForm onOrderAdded={fetchOrders} />
      <OrderGrid orders={orders} setOrders={setOrders} />
    </div>
  );
}

export default App;
