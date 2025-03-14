import React from "react";
import axios from "axios";

function OrderGrid({ orders, setOrders }) {
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

      alert("Order Updated!");
    } catch (error) {
      alert("Error updating order: " + error.message);
    }
  };

  return (
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
                value={order.customer_name}
                onChange={(e) =>
                  handleEdit(order.id, "customer_name", e.target.value)
                }
              />
            </td>
            <td>
              <input
                value={order.item}
                onChange={(e) =>
                  handleEdit(order.id, "item", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={order.quantity}
                onChange={(e) =>
                  handleEdit(order.id, "quantity", parseInt(e.target.value))
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={order.price}
                onChange={(e) =>
                  handleEdit(order.id, "price", parseInt(e.target.value))
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrderGrid;
