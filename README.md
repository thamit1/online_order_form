# Order Management System

An **Order Management System** built with **FastAPI** for the backend and **React** for the frontend. This project allows users to manage orders, enabling functionality such as adding, updating, and viewing them in real-time across multiple screens using **WebSockets**. It is designed as a full-stack application to showcase modern, scalable architecture.

---

## Features
- **Full CRUD Functionality**: Create, read, and update orders via an intuitive UI.
- **Real-Time Synchronization**: Orders are updated on all connected screens instantly using WebSockets.
- **Modular Design**: The frontend and backend are decoupled for scalability and maintainability.
- **RESTful API**: A FastAPI-based backend with clean, efficient endpoints.

---

## Technologies Used

### Backend:
- **FastAPI**: A modern, high-performance web framework for Python.
- **SQLite**: A lightweight SQL database for persistent storage.
- **SQLAlchemy**: Object-relational mapper (ORM) for managing database operations.
- **WebSockets**: For bi-directional, real-time communication.
- **Pydantic**: For data validation and serialization.

### Frontend:
- **React**: A JavaScript library for building dynamic user interfaces.
- **Axios**: HTTP client for interacting with the backend API.
- **WebSocket API**: Enables live, real-time updates on the frontend.

---

## Installation and Setup

### Prerequisites
1. Python 3.8+ installed.
2. Node.js and npm installed.

---

### Backend Setup
1. Clone the repository and navigate to the `backend` directory.
2. Create a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # For Windows: env\Scripts\activate

3. Install required dependencies:
    pip install -r requirements.txt

4. To start backend
    cd backend
    python main.py

5. To start UI server
    cd frontend
    npm start

# Order Management System

An **Order Management System** built with FastAPI for the backend and React for the frontend. This system allows users to manage orders with features like adding, editing, and real-time updates across multiple screens using WebSockets.

---

## Usage

### Accessing the Application
1. Ensure that both the backend (`uvicorn`) and frontend (`npm start`) servers are running.
2. Open your browser and go to [http://127.0.0.1:3000](http://127.0.0.1:3000).

### Managing Orders
- **Add Order**: Fill out the form with order details and click **Add Order** to create a new order.
- **Edit Order**: Modify existing orders directly in the grid.
- **Real-Time Updates**: Any changes made on one screen will automatically reflect on all other connected screens in real time.

---

## API Documentation
FastAPI automatically generates interactive API documentation available at:
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## API Endpoints

### **GET `/orders`**
Fetch all open orders.

### **POST `/orders`**
Add a new order.
- **Request Body Example**:
  ```json
  {
    "customer_name": "John Doe",
    "item": "Laptop",
    "quantity": 1,
    "price": 1200
  }
