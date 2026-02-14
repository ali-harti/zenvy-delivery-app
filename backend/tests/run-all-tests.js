const axios = require('axios');

const BASE_URL = 'http://localhost:5010/api/v1'; // Port 5010 as defined in .env
let authToken = '';
let userId = '';
let storeId = '';
let productId = '';
let cartItemId = '';
let orderId = '';

// Colors for console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
    const symbol = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${symbol} ${name}`, color);
    if (details) log(`   ${details}`, 'yellow');
}

async function testHealthCheck() {
    log('\n━━━ Health Check ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/health`);
        logTest('Health Check', res.data.success === true);
    } catch (error) {
        logTest('Health Check', false, error.message);
    }
}

async function testRegister() {
    log('\n━━━ Authentication: Register ━━━', 'blue');
    try {
        const res = await axios.post(`${BASE_URL}/auth/register`, {
            email: `testuser${Date.now()}@zenvy.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            phone: '+212600000099',
            address: '123 Test Street, Casablanca'
        });

        authToken = res.data.data.token;
        userId = res.data.data.user.id;

        logTest('Register User', res.status === 201 && authToken);
        logTest('Token Generated', authToken.length > 0);
    } catch (error) {
        logTest('Register User', false, error.response?.data?.message || error.message);
    }
}

async function testLogin() {
    log('\n━━━ Authentication: Login ━━━', 'blue');
    try {
        // Register a known user first
        await axios.post(`${BASE_URL}/auth/register`, {
            email: 'logintest@zenvy.com',
            password: 'password123',
            firstName: 'Login',
            lastName: 'Test'
        }).catch(() => { }); // Ignore if already exists

        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'logintest@zenvy.com',
            password: 'password123'
        });

        logTest('Login User', res.status === 200 && res.data.data.token);
        logTest('User Data Returned', res.data.data.user.email === 'logintest@zenvy.com');
    } catch (error) {
        logTest('Login User', false, error.response?.data?.message || error.message);
    }
}

async function testGetProfile() {
    log('\n━━━ Authentication: Get Profile ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        logTest('Get Profile', res.status === 200);
        logTest('Profile Data Complete', res.data.data.user.email && res.data.data.user.firstName);
    } catch (error) {
        logTest('Get Profile', false, error.response?.data?.message || error.message);
    }
}

async function testGetStores() {
    log('\n━━━ Stores: Get All ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/stores`);

        storeId = res.data.data.stores[0]?.id;

        logTest('Get All Stores', res.status === 200);
        logTest('Stores Array Returned', Array.isArray(res.data.data.stores));
        logTest('Store Count', res.data.data.stores.length > 0, `Found ${res.data.data.count} stores`);
    } catch (error) {
        logTest('Get All Stores', false, error.response?.data?.message || error.message);
    }
}

async function testGetStoresByCategory() {
    log('\n━━━ Stores: Filter by Category ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/stores?category=food`);

        logTest('Filter Stores by Category', res.status === 200);
        logTest('Filtered Results', res.data.data.stores.every(s => s.category === 'food'));
    } catch (error) {
        logTest('Filter Stores', false, error.response?.data?.message || error.message);
    }
}

async function testSearchStores() {
    log('\n━━━ Stores: Search ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/stores?search=marj`);

        logTest('Search Stores', res.status === 200);
        logTest('Search Results', res.data.data.stores.some(s => s.name.toLowerCase().includes('marj')));
    } catch (error) {
        logTest('Search Stores', false, error.response?.data?.message || error.message);
    }
}

async function testGetStoreById() {
    log('\n━━━ Stores: Get by ID ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/stores/${storeId}`);

        logTest('Get Store by ID', res.status === 200);
        logTest('Store Details', res.data.data.store.id === storeId);
        logTest('Products Included', Array.isArray(res.data.data.store.products));
    } catch (error) {
        logTest('Get Store by ID', false, error.response?.data?.message || error.message);
    }
}

async function testGetProducts() {
    log('\n━━━ Products: Get Store Products ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/stores/${storeId}/products`);

        productId = res.data.data.products[0]?.id;

        logTest('Get Store Products', res.status === 200);
        logTest('Products Array', Array.isArray(res.data.data.products));
        logTest('Product Data Complete', res.data.data.products[0]?.name && res.data.data.products[0]?.price);
    } catch (error) {
        logTest('Get Products', false, error.response?.data?.message || error.message);
    }
}

async function testGetCart() {
    log('\n━━━ Cart: Get Cart ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        logTest('Get Cart', res.status === 200);
        logTest('Cart Structure', res.data.data.cart.items !== undefined);
    } catch (error) {
        logTest('Get Cart', false, error.response?.data?.message || error.message);
    }
}

async function testAddToCart() {
    log('\n━━━ Cart: Add Item ━━━', 'blue');
    try {
        const res = await axios.post(
            `${BASE_URL}/cart/items`,
            {
                productId: productId,
                quantity: 2
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        cartItemId = res.data.data.cart.items[0]?.id;

        logTest('Add to Cart', res.status === 200);
        logTest('Item Added', res.data.data.cart.items.length > 0);
        logTest('Quantity Correct', res.data.data.cart.items[0]?.quantity === 2);
        logTest('Total Calculated', res.data.data.cart.totalAmount > 0);
    } catch (error) {
        logTest('Add to Cart', false, error.response?.data?.message || error.message);
    }
}

async function testUpdateCartItem() {
    log('\n━━━ Cart: Update Item Quantity ━━━', 'blue');
    try {
        const res = await axios.patch(
            `${BASE_URL}/cart/items/${cartItemId}`,
            { quantity: 3 },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        logTest('Update Cart Item', res.status === 200);
        logTest('Quantity Updated', res.data.data.cart.items.find(i => i.id === cartItemId)?.quantity === 3);
    } catch (error) {
        logTest('Update Cart Item', false, error.response?.data?.message || error.message);
    }
}

async function testCreateOrder() {
    log('\n━━━ Orders: Create Order ━━━', 'blue');
    try {
        // First ensure cart has items
        await axios.post(
            `${BASE_URL}/cart/items`,
            { productId: productId, quantity: 2 },
            { headers: { Authorization: `Bearer ${authToken}` } }
        ).catch(() => { });

        // Get product price
        const productsRes = await axios.get(`${BASE_URL}/stores/${storeId}/products`);
        const product = productsRes.data.data.products.find(p => p.id === productId);

        const res = await axios.post(
            `${BASE_URL}/orders`,
            {
                storeId: storeId,
                items: [
                    {
                        productId: productId,
                        quantity: 2
                    }
                ],
                deliveryAddress: '123 Test Street, Casablanca, Morocco',
                notes: 'Test order - please handle with care'
            },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        orderId = res.data.data.order.id;

        logTest('Create Order', res.status === 201);
        logTest('Order ID Generated', orderId > 0);
        logTest('Order Status', res.data.data.order.status === 'pending');
        logTest('Total Amount', res.data.data.order.totalAmount > 0);
    } catch (error) {
        logTest('Create Order', false, error.response?.data?.message || error.message);
    }
}

async function testGetOrderHistory() {
    log('\n━━━ Orders: Get History ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        logTest('Get Order History', res.status === 200);
        logTest('Orders Array', Array.isArray(res.data.data.orders));
        logTest('Order Found', res.data.data.orders.length > 0);
    } catch (error) {
        logTest('Get Order History', false, error.response?.data?.message || error.message);
    }
}

async function testGetOrderById() {
    log('\n━━━ Orders: Get Order Details ━━━', 'blue');
    try {
        const res = await axios.get(`${BASE_URL}/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        logTest('Get Order by ID', res.status === 200);
        logTest('Order Details', res.data.data.order.id === orderId);
        logTest('Store Info', res.data.data.order.store !== null);
        logTest('Items Included', Array.isArray(res.data.data.order.items) && res.data.data.order.items.length > 0);
    } catch (error) {
        logTest('Get Order by ID', false, error.response?.data?.message || error.message);
    }
}

async function testCancelOrder() {
    log('\n━━━ Orders: Cancel Order ━━━', 'blue');
    try {
        const res = await axios.patch(
            `${BASE_URL}/orders/${orderId}/cancel`,
            { reason: 'Changed my mind' },
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        logTest('Cancel Order', res.status === 200);
        logTest('Order Cancelled', res.data.data.order.status === 'cancelled');
        logTest('Cancel Reason', res.data.data.order.cancelReason !== null);
    } catch (error) {
        logTest('Cancel Order', false, error.response?.data?.message || error.message);
    }
}

async function testRemoveFromCart() {
    log('\n━━━ Cart: Remove Item ━━━', 'blue');
    try {
        const res = await axios.delete(
            `${BASE_URL}/cart/items/${cartItemId}`,
            {
                headers: { Authorization: `Bearer ${authToken}` }
            }
        );

        logTest('Remove from Cart', res.status === 200);
        logTest('Item Removed', !res.data.data.cart.items.find(i => i.id === cartItemId));
    } catch (error) {
        logTest('Remove from Cart', false, error.response?.data?.message || error.message);
    }
}

async function testClearCart() {
    log('\n━━━ Cart: Clear Cart ━━━', 'blue');
    try {
        const res = await axios.delete(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        logTest('Clear Cart', res.status === 200);
    } catch (error) {
        logTest('Clear Cart', false, error.response?.data?.message || error.message);
    }
}

async function testErrorHandling() {
    log('\n━━━ Error Handling ━━━', 'blue');

    // Test 401 Unauthorized
    try {
        await axios.get(`${BASE_URL}/auth/me`);
        logTest('401 Unauthorized', false, 'Should have thrown error');
    } catch (error) {
        logTest('401 Unauthorized', error.response?.status === 401);
    }

    // Test 404 Not Found
    try {
        await axios.get(`${BASE_URL}/stores/999999`);
        logTest('404 Not Found', false, 'Should have thrown error');
    } catch (error) {
        logTest('404 Not Found', error.response?.status === 404);
    }

    // Test 422 Validation Error
    try {
        await axios.post(`${BASE_URL}/auth/register`, {
            email: 'invalid-email',
            password: '123'
        });
        logTest('422 Validation Error', false, 'Should have thrown error');
    } catch (error) {
        logTest('422 Validation Error', error.response?.status === 422);
    }
}

async function runAllTests() {
    log('\n╔═══════════════════════════════════════════════╗', 'blue');
    log('║   🧪 ZENVY API - COMPLETE TEST SUITE         ║', 'blue');
    log('╚═══════════════════════════════════════════════╝', 'blue');

    try {
        await testHealthCheck();
        await testRegister();
        await testLogin();
        await testGetProfile();
        await testGetStores();
        await testGetStoresByCategory();
        await testSearchStores();
        await testGetStoreById();
        await testGetProducts();
        await testGetCart();
        await testAddToCart();
        await testUpdateCartItem();
        await testCreateOrder();
        await testGetOrderHistory();
        await testGetOrderById();
        await testCancelOrder();
        await testRemoveFromCart();
        await testClearCart();
        await testErrorHandling();

        log('\n╔═══════════════════════════════════════════════╗', 'green');
        log('║   ✅ ALL TESTS COMPLETED                      ║', 'green');
        log('╚═══════════════════════════════════════════════╝', 'green');
    } catch (error) {
        log('\n╔═══════════════════════════════════════════════╗', 'red');
        log('║   ❌ TEST SUITE FAILED                        ║', 'red');
        log('╚═══════════════════════════════════════════════╝', 'red');
        console.error(error);
    }
}

runAllTests();
