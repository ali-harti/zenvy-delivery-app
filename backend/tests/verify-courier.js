const axios = require('axios');

const API_URL = 'http://localhost:5012/api/v1';

async function verify() {
    try {
        console.log('=== COURIER WORKFLOW VERIFICATION ===\n');

        const timestamp = Date.now();

        // 1. Register Courier
        console.log('1. Registering Courier...');
        const courierReg = await axios.post(`${API_URL}/auth/register`, {
            email: `courier_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'Driver',
            phone: '0700000001',
            role: 'courier'
        });
        const courierToken = courierReg.data.data.token;
        const courierId = courierReg.data.data.user.id;
        console.log(`✓ Courier registered: ${courierId}\n`);

        // 2. Setup: Create Order (via Merchant + Customer)
        console.log('2. Setting up Test Order...');

        // Merchant
        const merchantReg = await axios.post(`${API_URL}/merchant/register`, {
            email: `merchant_courier_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'M',
            lastName: 'M',
            businessName: 'Test Store',
            taxId: 'TAX_C'
        });
        const merchantToken = merchantReg.data.token;

        await axios.post(`${API_URL}/merchant/store`, {
            name: 'Burger House',
            category: 'food',
            address: '789 Courier St',
            phone: '0700000002'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const product = await axios.post(`${API_URL}/merchant/products`, {
            name: 'Cheeseburger',
            price: 8.99,
            category: 'burger',
            stock: 100
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        // Customer
        const customerReg = await axios.post(`${API_URL}/auth/register`, {
            email: `customer_courier_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'C',
            lastName: 'C',
            phone: '0700000003'
        });
        const customerToken = customerReg.data.data.token;

        const order = await axios.post(`${API_URL}/orders`, {
            storeId: product.data.storeId,
            items: [{ productId: product.data.id, quantity: 1 }],
            deliveryAddress: '999 Customer Rd'
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        const orderId = order.data.data.order.id;

        // Merchant marks as ready
        await axios.patch(`${API_URL}/merchant/orders/${orderId}/status`, {
            status: 'ready'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        console.log(`✓ Order #${orderId} created and ready for pickup\n`);

        // 3. Get Available Deliveries
        console.log('3. Fetching Available Deliveries...');
        const available = await axios.get(`${API_URL}/delivery/available`, {
            headers: { Authorization: `Bearer ${courierToken}` }
        });
        console.log(`✓ Available deliveries: ${available.data.data.orders.length}\n`);

        // 4. Accept Delivery
        console.log('4. Accepting Delivery...');
        const accept = await axios.post(`${API_URL}/delivery/orders/${orderId}/accept`, {},
            { headers: { Authorization: `Bearer ${courierToken}` } });
        console.log(`✓ Delivery accepted: ${accept.data.data.order.status}\n`);

        // 5. Mark as Picked Up
        console.log('5. Marking Order as Picked Up...');
        const pickup = await axios.post(`${API_URL}/delivery/orders/${orderId}/pickup`, {},
            { headers: { Authorization: `Bearer ${courierToken}` } });
        console.log(`✓ Order picked up: ${pickup.data.data.order.status}\n`);

        // 6. Mark as Delivered
        console.log('6. Marking Order as Delivered...');
        const deliver = await axios.post(`${API_URL}/delivery/orders/${orderId}/deliver`, {},
            { headers: { Authorization: `Bearer ${courierToken}` } });
        console.log(`✓ Order delivered: ${deliver.data.data.order.status}\n`);

        // 7. View Delivery History
        console.log('7. Viewing Delivery History...');
        const history = await axios.get(`${API_URL}/delivery/history`, {
            headers: { Authorization: `Bearer ${courierToken}` }
        });
        console.log(`✓ Completed deliveries: ${history.data.data.orders.length}\n`);

        console.log('✅ COURIER WORKFLOW VERIFIED!\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

verify();
