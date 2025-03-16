import React, { useState, useEffect } from "react";
import axios from "axios";

function OrderGrid({ orders, setOrders }) {
  const [infoMessage, setInfoMessage] = useState("");
  const [editingOrder, setEditingOrder] = useState({});
  const [highlightedCells, setHighlightedCells] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "order_updated") {
        const updatedOrder = message.order;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );

        // Highlight the updated cells
        Object.keys(updatedOrder).forEach((field) => {
          setHighlightedCells((prev) => ({
            ...prev,
            [updatedOrder.id]: {
              ...prev[updatedOrder.id],
              [field]: true,
            },
          }));
          setTimeout(() => {
            setHighlightedCells((prev) => ({
              ...prev,
              [updatedOrder.id]: {
                ...prev[updatedOrder.id],
                [field]: false,
              },
            }));
          }, 10000); // Clear highlight after 10 seconds
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [setOrders]);

  const handleEdit = async (id, field, value) => {
    try {
      const orderToUpdate = orders.find((order) => order.id === id);
      const updatedOrder = { ...orderToUpdate, [field]: value };

      // Update the order in the backend
      await axios.put(`http://127.0.0.1:8000/orders/${id}`, updatedOrder);

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? updatedOrder : order
        )
      );

      // Highlight the cell
      setHighlightedCells((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: true,
        },
      }));
      setTimeout(() => {
        setHighlightedCells((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            [field]: false,
          },
        }));
      }, 10000); // Clear highlight after 10 seconds

      // Show information message
      setInfoMessage("Order Updated!");
      setTimeout(() => setInfoMessage(""), 10000); // Clear message after 10 seconds
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  const handleKeyDown = (e, id, field) => {
    if (e.key === "Enter") {
      const value = editingOrder[id]?.[field];
      if (value !== undefined && value !== orders.find((order) => order.id === id)[field]) {
        handleEdit(id, field, value);
      }
    }
  };

  const handleBlur = (id, field) => {
    const value = editingOrder[id]?.[field];
    if (value !== undefined && value !== orders.find((order) => order.id === id)[field]) {
      handleEdit(id, field, value);
    }
  };

  const handleChange = (e, id, field) => {
    const { value } = e.target;
    setEditingOrder((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      {infoMessage && (
        <div style={{ backgroundColor: "green", color: "white", padding: "10px" }}>
          {infoMessage}
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <input
                  value={editingOrder[order.id]?.customer_name || order.customer_name}
                  onChange={(e) => handleChange(e, order.id, "customer_name")}
                  onKeyDown={(e) => handleKeyDown(e, order.id, "customer_name")}
                  onBlur={() => handleBlur(order.id, "customer_name")}
                  style={{
                    backgroundColor: highlightedCells[order.id]?.customer_name ? "yellow" : "white",
                  }}
                />
              </td>
              <td>
                <input
                  value={editingOrder[order.id]?.item || order.item}
                  onChange={(e) => handleChange(e, order.id, "item")}
                  onKeyDown={(e) => handleKeyDown(e, order.id, "item")}
                  onBlur={() => handleBlur(order.id, "item")}
                  style={{
                    backgroundColor: highlightedCells[order.id]?.item ? "yellow" : "white",
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={editingOrder[order.id]?.quantity || order.quantity}
                  onChange={(e) => handleChange(e, order.id, "quantity")}
                  onKeyDown={(e) => handleKeyDown(e, order.id, "quantity")}
                  onBlur={() => handleBlur(order.id, "quantity")}
                  style={{
                    backgroundColor: highlightedCells[order.id]?.quantity ? "yellow" : "white",
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={editingOrder[order.id]?.price || order.price}
                  onChange={(e) => handleChange(e, order.id, "price")}
                  onKeyDown={(e) => handleKeyDown(e, order.id, "price")}
                  onBlur={() => handleBlur(order.id, "price")}
                  style={{
                    backgroundColor: highlightedCells[order.id]?.price ? "yellow" : "white",
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderGrid;
