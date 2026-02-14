const axios = require('axios');

const BASE_URL = 'http://localhost:5010/api/v1';

// Colors for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    cyan: "\x1b[36m"
};

const logStep = (step, msg) => console.log(`\n${colors.cyan}Step ${step}: ${msg}${colors.reset}`);
const logSuccess = (msg) => console.log(`${colors.green}  ✅ ${msg}${colors.reset}`);
const logInfo = (msg) => console.log(`${colors.blue}  ℹ️  ${msg}${colors.reset}`);
const logError = (msg) => console.log(`${colors.red}  ❌ ${msg}${colors.reset}`);

async function runManualTest() {
    console.log(`${colors.yellow}╔═══════════════════════════════════════════════╗`);
    console.log(`║   🛵 ZENVY DELIVERY BACKEND - MANUAL TEST     ║`);
    console.log(`╚═══════════════════════════════════════════════╝${colors.reset}`);

    try {
        // ---------------------------------------------------------
        // 1. Authenticate Actors
        // ---------------------------------------------------------
        logStep(1, "Authenticating Actors (Customer, Admin, Driver)");

        // Register Customer
        const custEmail = `cust${Date.now()}@test.com`;
        const custRes = await axios.post(`${BASE_URL}/auth/register`, {
            email: custEmail, password: 'password123', firstName: 'John', lastName: 'Customer', role: 'customer'
        });
        const customerToken = custRes.data.data.token;
        logSuccess(`Customer registered: ${custEmail}`);

        // Login Admin (Pre-seeded)
        const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@zenvy.com', password: 'password123'
        });
        const adminToken = adminRes.data.data.token;
        logSuccess("Admin logged in (admin@zenvy.com)");

        // Register Driver (Using Admin Token for test simplicity, or register new if allowed)
        // Note: In our current setup, we need Admin token to register a 'delivery' role via API if we enforced it, 
        // OR we just use Admin token as the driver token because Admin has all permissions.
        // Let's try to register a real driver first, if it fails (due to AuthController restriction), we fallback to Admin.
        let driverToken;
        try {
            const driverEmail = `driver${Date.now()}@test.com`;
            const driverRes = await axios.post(`${BASE_URL}/auth/register`, {
                email: driverEmail, password: 'password123', firstName: 'Fast', lastName: 'Driver', role: 'delivery'
            });
            // If the controller ignores role 'delivery', this user will be 'customer'.
            // Let's check the role returned.
            if (driverRes.data.data.user.role === 'header') {
                // It worked
                driverToken = driverRes.data.data.token;
                logSuccess(`Driver registered: ${driverEmail}`);
            } else {
                // It defaulted to customer, so we use Admin token for delivery actions
                logInfo("Regular registration defaulted to 'customer'. Using Admin token for Driver actions.");
                driverToken = adminToken;
            }
        } catch (e) {
            driverToken = adminToken;
            logInfo("Using Admin token for Driver actions.");
        }

        // ---------------------------------------------------------
        // 2. Customer Creates Order
        // ---------------------------------------------------------
        logStep(2, "Customer Creates Order");

        // Get Store & Product
        const storesRes = await axios.get(`${BASE_URL}/stores`);
        const store = storesRes.data.data.stores[0];
        const productsRes = await axios.get(`${BASE_URL}/stores/${store.id}/products`);
        const product = productsRes.data.data.products[0];

        const orderRes = await axios.post(`${BASE_URL}/orders`, {
            storeId: store.id,
            items: [{ productId: product.id, quantity: 1 }],
            totalAmount: 50.00,
            deliveryAddress: "Apartment 4B, Casablanca Center"
        }, { headers: { Authorization: `Bearer ${customerToken}` } });

        const orderId = orderRes.data.data.order.id;
        logSuccess(`Order #${orderId} created successfully`);
        logInfo(`Order Status: ${orderRes.data.data.order.status}`);

        // ---------------------------------------------------------
        // 3. Store/Admin Prepares Order
        // ---------------------------------------------------------
        logStep(3, "Store/Admin Updates Status (Pending -> Ready)");

        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'confirmed' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'preparing' }, { headers: { Authorization: `Bearer ${adminToken}` } });
        await axios.patch(`${BASE_URL}/orders/${orderId}/status`, { status: 'ready' }, { headers: { Authorization: `Bearer ${adminToken}` } });

        logSuccess("Order status updated to 'ready'");

        // ---------------------------------------------------------
        // 4. Driver Finds Available Order
        // ---------------------------------------------------------
        logStep(4, "Driver Checks Availability");

        const availRes = await axios.get(`${BASE_URL}/delivery/available`, { headers: { Authorization: `Bearer ${driverToken}` } });
        const availableOrders = availRes.data.data.orders;
        const targetOrder = availableOrders.find(o => o.id === orderId);

        if (targetOrder) {
            logSuccess(`Driver sees Order #${orderId} in available list`);
        } else {
            logError(`Order #${orderId} NOT found in available list`);
            process.exit(1);
        }

        // ---------------------------------------------------------
        // 5. Driver Accepts Order
        // ---------------------------------------------------------
        logStep(5, "Driver Accepts Order");

        const acceptRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/accept`, {}, { headers: { Authorization: `Bearer ${driverToken}` } });
        logSuccess(`Order Accepted. New Status: ${acceptRes.data.data.order.status}`);

        // ---------------------------------------------------------
        // 6. Driver Picks Up Order
        // ---------------------------------------------------------
        logStep(6, "Driver Picks Up Order");

        const pickupRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/pickup`, {}, { headers: { Authorization: `Bearer ${driverToken}` } });
        logSuccess(`Order Picked Up. New Status: ${pickupRes.data.data.order.status}`);

        // ---------------------------------------------------------
        // 7. Driver Delivers Order
        // ---------------------------------------------------------
        logStep(7, "Driver Delivers Order");

        const deliverRes = await axios.post(`${BASE_URL}/delivery/orders/${orderId}/deliver`, {}, { headers: { Authorization: `Bearer ${driverToken}` } });
        logSuccess(`Order Delivered. New Status: ${deliverRes.data.data.order.status}`);

        console.log(`\n${colors.green}✨ TEST COMPLETED SUCCESSFULLY ✨${colors.reset}\n`);

    } catch (error) {
        console.log(`\n${colors.red}❌ TEST FAILED${colors.reset}`);
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Data:`, error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

runManualTest();
