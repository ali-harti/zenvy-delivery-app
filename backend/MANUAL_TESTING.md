# Manual Testing Guide: Delivery (Livreur) Backend

Use this guide to verify the full delivery lifecycle using Postman or Curl.

**Base URL**: `http://localhost:5010/api/v1`

## 1. Prerequisites (Authentication)
First, you need tokens for the different roles.

### A. Admin Login (For simulation)
*   **POST** `/auth/login`
*   **Body**:
    ```json
    {
        "email": "admin@zenvy.com",
        "password": "password123"
    }
    ```
*   **Save Token**: `ADMIN_TOKEN`

### B. Register Customer
*   **POST** `/auth/register`
*   **Body**:
    ```json
    {
        "email": "customer1@test.com",
        "password": "password123",
        "firstName": "John",
        "lastName": "Doe"
    }
    ```
*   **Save Token**: `CUSTOMER_TOKEN`

---

## 2. Order Creation Flow

### Step 1: Create Order (Customer)
*   **POST** `/orders`
*   **Header**: `Authorization: Bearer CUSTOMER_TOKEN`
*   **Body**:
    ```json
    {
        "storeId": 4, 
        "items": [
            { "productId": 13, "quantity": 1 }
        ],
        "deliveryAddress": "123 Main St",
        "totalAmount": 50.00
    }
    ```
*   **Response**: Note the `id` of the order (e.g., `15`).

### Step 2: Prepare Order (Admin/Store)
*   **PATCH** `/orders/15/status`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN`
*   **Body**: `{ "status": "confirmed" }` -> Send
*   **Body**: `{ "status": "preparing" }` -> Send
*   **Body**: `{ "status": "ready" }` -> Send
*   **Note**: The order **MUST** be in `ready` status to be visible to drivers.

---

## 3. Delivery Flow (Driver)

### Step 3: Find Available Orders
*   **GET** `/delivery/available`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN` (Acting as Driver)
*   **Response**: List of orders with `status: "ready"`.

### Step 4: Accept Order
*   **POST** `/delivery/orders/15/accept`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN`
*   **Response**: Status becomes `driver_assigned`.

### Step 5: Pickup Order
*   **POST** `/delivery/orders/15/pickup`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN`
*   **Response**: Status becomes `in_delivery`.

### Step 6: Complete Delivery
*   **POST** `/delivery/orders/15/deliver`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN`
*   **Response**: Status becomes `delivered`.

---

## 4. Verification
### Check Order History
*   **GET** `/delivery/history`
*   **Header**: `Authorization: Bearer ADMIN_TOKEN`
*   **Response**: Should show the recently delivered order.
