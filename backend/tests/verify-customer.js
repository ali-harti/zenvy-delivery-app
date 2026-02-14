const axios = require('axios');

const API_URL = 'http://localhost:5012/api/v1';

async function verify() {
    try {
        console.log('=== CUSTOMER JOURNEY VERIFICATION ===\n');

        // 1. Customer Registration
        console.log('1. Registering Customer...');
        const timestamp = Date.now();
        const customerReg = await axios.post(`${API_URL}/auth/register`, {
            email: `customer_test_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'Customer',
            phone: '0600000001'
        });
        const customerToken = customerReg.data.data.token;
        const customerId = customerReg.data.data.user.id;
        console.log(`✓ Customer registered: ${customerId}\n`);

        // 2. Setup: Create Merchant + Store + Products
        console.log('2. Setting up Test Store...');
        const merchantReg = await axios.post(`${API_URL}/merchant/register`, {
            email: `merchant_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'Merchant',
            businessName: 'Test Restaurant',
            taxId: 'TAX_TEST'
        });
        const merchantToken = merchantReg.data.token;

        await axios.post(`${API_URL}/merchant/store`, {
            name: 'Pizza Palace',
            category: 'food',
            address: '123 Main St',
            phone: '0600000002'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const product1 = await axios.post(`${API_URL}/merchant/products`, {
            name: 'Margherita Pizza',
            price: 12.99,
            category: 'pizza',
            stock: 50,
            description: 'Classic pizza'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const product2 = await axios.post(`${API_URL}/merchant/products`, {
            name: 'Pepperoni Pizza',
            price: 14.99,
            category: 'pizza',
            stock: 30,
            description: 'Spicy pizza'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const storeId = product1.data.storeId;
        const productId1 = product1.data.id;
        const productId2 = product2.data.id;
        console.log(`✓ Store created with 2 products\n`);

        // 3. Browse Stores
        console.log('3. Browsing Stores...');
        const stores = await axios.get(`${API_URL}/stores`);
        const storesList = stores.data.data?.stores || stores.data.stores || stores.data;
        console.log(`✓ Found ${storesList.length} store(s)\n`);

        // 4. View Store Details
        console.log('4. Viewing Store Details...');
        const storeDetails = await axios.get(`${API_URL}/stores/${storeId}`);
        const store = storeDetails.data.data.store;
        console.log(`✓ Store: ${store.name}`);
        console.log(`✓ Products: ${store.products.length}\n`);

        // 5. Add to Cart
        console.log('5. Adding Items to Cart...');
        await axios.post(`${API_URL}/cart/items`, {
            productId: productId1,
            quantity: 2
        }, { headers: { Authorization: `Bearer ${customerToken}` } });

        await axios.post(`${API_URL}/cart/items`, {
            productId: productId2,
            quantity: 1
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        console.log(`✓ Added 2 items to cart\n`);

        // 6. View Cart
        console.log('6. Viewing Cart...');
        const cart = await axios.get(`${API_URL}/cart`, {
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        console.log(`✓ Cart Total: ${cart.data.data.cart.totalAmount} MAD`);
        console.log(`✓ Cart Items: ${cart.data.data.cart.items.length}\n`);

        // 7. Place Order
        console.log('7. Placing Order from Cart...');
        const order = await axios.post(`${API_URL}/orders`, {
            storeId,
            items: [
                { productId: productId1, quantity: 2 },
                { productId: productId2, quantity: 1 }
            ],
            deliveryAddress: '456 Test Avenue, Casablanca'
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        const orderId = order.data.data.order.id;
        console.log(`✓ Order placed: #${orderId}\n`);

        // 8. View Order History
        console.log('8. Viewing Order History...');
        const history = await axios.get(`${API_URL}/orders`, {
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        console.log(`✓ Total Orders: ${history.data.data.count}\n`);

        // 9. View Order Details
        console.log('9. Viewing Order Details...');
        const orderDetails = await axios.get(`${API_URL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${customerToken}` }
        });
        console.log(`✓ Order Status: ${orderDetails.data.data.order.status}`);
        console.log(`✓ Total Amount: ${orderDetails.data.data.order.totalAmount} MAD\n`);

        // 10. Cancel Order (if pending)
        console.log('10. Testing Order Cancellation...');
        const cancelOrder = await axios.patch(`${API_URL}/orders/${orderId}/cancel`, {
            reason: 'Changed my mind'
        }, { headers: { Authorization: `Bearer ${customerToken}` } });
        console.log(`✓ Order cancelled: ${cancelOrder.data.data.order.status}\n`);

        console.log('✅ CUSTOMER JOURNEY VERIFIED!\n');
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
