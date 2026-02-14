const io = require('socket.io-client');
const axios = require('axios');

const API_URL = 'http://localhost:5012/api/v1';
const SOCKET_URL = 'http://localhost:5012';

async function verify() {
    try {
        console.log('1. Authenticating User...');
        const email = `socket_test_${Date.now()}@test.com`;
        const reg = await axios.post(`${API_URL}/auth/register`, {
            email,
            password: 'password123',
            firstName: 'Socket',
            lastName: 'User',
            phone: '999999999'
        });
        const token = reg.data.data.token;
        const userId = reg.data.data.user.id;
        console.log(`User registered: ${userId}`);

        console.log('2. Connecting to Socket...');
        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket']
        });

        // Promise to wait for notification
        const notificationPromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject('Notification timeout'), 5000);

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
            });

            socket.on('connect_error', (err) => {
                console.error('Connection Error:', err.message);
                reject(err);
            });

            socket.on('notification', (data) => {
                console.log('📩 Notification Received:', data);
                clearTimeout(timeout);
                resolve(data);
            });
        });

        // Create an Order and Update Status via API to trigger notification
        // Note: We need a Merchant implementation to properly update status or Admin
        // For simplicity, we assume we can register as admin to update status OR hack it?
        // Actually, OrderController.updateStatus expects Admin or Merchant.

        // Let's create an Admin to trigger the update
        const adminEmail = `admin_socket_${Date.now()}@test.com`;
        const adminReg = await axios.post(`${API_URL}/auth/register`, {
            email: adminEmail,
            role: 'admin',
            password: 'password123',
            firstName: 'Admin',
            lastName: 'Socket',
            phone: '888888888'
        });
        const adminToken = adminReg.data.data.token;

        // Create Store/Product/Order (Standard flow)
        // ... Skipping full setup for brevity, assume we can hit status update if order exists.
        // Wait, we need an order linked to our User.

        // REUSE verify-merchant-orders logic simplified?
        // Too complex for single script.
        // Let's mock a "System" notification to self?
        // NotificationService.send(userId, ...) isn't exposed via API directly.

        // Alternate: Add a temporary test endpoint to trigger notification?
        // Or just complete the flow.

        console.log('Triggering flow...');
        // Let's rely on the fact that if we create an order, and then update it, it works.
        // But creating order needs store/product.

        // Let's just create a dummy "admin" trigger if possible or... 
        // Actually, let's use the `NotificationService` directly if we were inside.
        // Since we are black-box testing, we MUST use the API.

        // Okay, let's Register User -> Connect Socket -> Wait.
        // Parallel: Register Merchant -> Create Store -> Create Product -> User Places Order -> Merchant Updates Order.
        // This is the robust way.

        // Merchant
        const merchReg = await axios.post(`${API_URL}/merchant/register`, {
            email: `merch_sock_${Date.now()}@test.com`,
            password: 'password123',
            firstName: 'Merchant',
            lastName: 'Socket',
            businessName: 'SocketBiz',
            taxId: 'TAX_999'
        });
        const merchToken = merchReg.data.token;

        await axios.post(`${API_URL}/merchant/store`, {
            name: 'SockStore',
            category: 'food',
            address: '123 Socket St',
            phone: '111222333'
        }, { headers: { Authorization: `Bearer ${merchToken}` } });
        const prod = await axios.post(`${API_URL}/merchant/products`, { name: 'P', price: 10, stock: 10, category: 'test' }, { headers: { Authorization: `Bearer ${merchToken}` } });
        const prodId = prod.data.id;
        const storeId = prod.data.storeId;

        // User Places Order
        const order = await axios.post(`${API_URL}/orders`, {
            storeId, items: [{ productId: prodId, quantity: 1 }], deliveryAddress: 'Home'
        }, { headers: { Authorization: `Bearer ${token}` } });
        const orderId = order.data.data.order.id;
        console.log('Order Placed:', orderId);

        // Merchant Updates Status -> Should trigger notification
        console.log('Merchant Updating Status...');
        await axios.patch(`${API_URL}/merchant/orders/${orderId}/status`, {
            status: 'confirmed'
        }, { headers: { Authorization: `Bearer ${merchToken}` } });

        await notificationPromise;
        console.log('✅ Socket Verification Passed');
        socket.disconnect();
        process.exit(0);

    } catch (e) {
        console.error('Test Failed:', e.message);
        if (e.response) console.error(e.response.data);
        process.exit(1);
    }
}
verify();
