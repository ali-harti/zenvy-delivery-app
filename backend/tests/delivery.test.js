const axios = require('axios');

const BASE_URL = 'http://localhost:5010/api/v1';
let authToken = '';
let driverToken = '';
let orderId = '';

async function runDeliveryTests() {
    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║   🛵 ZENVY DELIVERY API TEST SUITE            ║');
    console.log('╚═══════════════════════════════════════════════╝\n');

    try {
        // 1. Setup: Create Customer & Order
        console.log('━━━ Setup: Create Order ━━━');

        // Register Customer
        const customerRes = await axios.post(`${BASE_URL}/auth/register`, {
            email: `cust${Date.now()}@test.com`,
            password: 'password123',
            firstName: 'Customer',
            lastName: 'Test',
            role: 'customer'
        });
        authToken = customerRes.data.data.token;
        console.log('✅ Customer Registered');

        // Create Order (Needs store ID which is seeded as 999999 or 4)
        // Fetch stores first to get valid ID
        const storesRes = await axios.get(`${BASE_URL}/stores`);
        const storeId = storesRes.data.data.stores[0].id;

        const productsRes = await axios.get(`${BASE_URL}/stores/${storeId}/products`);
        const productId = productsRes.data.data.products[0].id;

        const orderRes = await axios.post(`${BASE_URL}/orders`, {
            storeId: storeId,
            items: [{ productId, quantity: 1 }],
            totalAmount: 50.00,
            deliveryAddress: '123 Test St'
        }, { headers: { Authorization: `Bearer ${authToken}` } });

        orderId = orderRes.data.data.order.id;
        console.log(`✅ Order Created (ID: ${orderId})`);

        // Update Order Status to 'ready' (Simulate store prep)
        // Direct DB update or Admin/Store API would be better, but for now we assume it's ready
        // We will need to update db manually or via a mock store endpoint if we had one.
        // For this test, we might fail if we can't set it to ready.
        // Let's rely on Seed or create a helper if needed. 
        // WAIT: Order default is 'pending'. Delivery only sees 'ready'.
        // We need a way to transition Pending -> Confirmed -> Preparing -> Ready.
        // Or we can mock the status in the DB.

        // Register Driver
        // driverToken assigned later after Admin login

    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
        process.exit(1);
    }

    // Since we don't have Store API to update status, we need to hack it via direct DB call 
    // OR we just test that empty list is returned if no ready orders.
    // Ideally we should have a way to move the order. 
    // For this test, let's try to 'Accept' an order even if pending, expecting 400.
    // AND let's rely on the seed data if possible? No, we just reset DB.

    // WORKAROUND: Use the Store/Admin endpoint to update status? We implemented updateStatus for OrderController?
    // Let's check OrderController.js permissions. It allows Admin/Merchant.

    // We need a Merchant token to move the order to ready.
    // Let's register a merchant.
    try {
        // Login as Seeded Admin
        console.log('   Logging in as Admin...');
        const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@zenvy.com',
            password: 'password123'
        });
        const merchantToken = adminRes.data.data.token;
        driverToken = merchantToken; // Use Admin as Driver for tests
        console.log('✅ Driver (Admin) Ready');

        // Move to Ready
        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'confirmed' }, { headers: { Authorization: `Bearer ${merchantToken}` } });
        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'preparing' }, { headers: { Authorization: `Bearer ${merchantToken}` } });
        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'ready' }, { headers: { Authorization: `Bearer ${merchantToken}` } });
        console.log('✅ Order Moved to READY Status');

        // Now Test Delivery Flow

        // 1. Get Available Orders
        console.log('\n━━━ Delivery: Get Available Orders ━━━');
        const availableRes = await axios.get(`${BASE_URL}/delivery/available`, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });

        if (availableRes.data.data.orders.length > 0) {
            console.log('✅ Found Available Orders');
        } else {
            console.error('❌ No Available Orders Found');
        }

        // 2. Accept Order
        console.log('\n━━━ Delivery: Accept Order ━━━');
        const acceptRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/accept`, {}, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });
        if (acceptRes.data.data.order.status === 'driver_assigned') {
            console.log('✅ Order Accepted');
        } else {
            console.error('❌ Accept Failed');
        }

        // 3. Pickup Order
        console.log('\n━━━ Delivery: Pickup Order ━━━');
        const pickupRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/pickup`, {}, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });
        if (pickupRes.data.data.order.status === 'in_delivery') {
            console.log('✅ Order Picked Up');
        } else {
            console.error('❌ Pickup Failed');
        }

        // 4. Deliver Order
        console.log('\n━━━ Delivery: Deliver Order ━━━');
        const deliverRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/deliver`, {}, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });
        if (deliverRes.data.data.order.status === 'delivered') {
            console.log('✅ Order Delivered');
        } else {
            console.error('❌ Delivery Failed');
        }

        // 5. Get History
        console.log('\n━━━ Delivery: History ━━━');
        const historyRes = await axios.get(`${BASE_URL}/delivery/history`, {
            headers: { Authorization: `Bearer ${driverToken}` }
        });
        if (historyRes.data.data.orders.length > 0) {
            console.log('✅ History Verified');
        } else {
            console.error('❌ History Empty');
        }

        console.log('\n╔═══════════════════════════════════════════════╗');
        console.log('║   ✅ ALL DELIVERY TESTS COMPLETED             ║');
        console.log('╚═══════════════════════════════════════════════╝');

    } catch (error) {
        console.error('❌ Delivery Test Failed:', error.response ? error.response.data : error.message);
    }
}

runDeliveryTests();
