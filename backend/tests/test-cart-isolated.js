const axios = require('axios');

const API_URL = 'http://localhost:5012/api/v1';

async function testCart() {
    try {
        console.log('=== CART ISOLATION TEST ===\n');

        // 1. Register customer
        const timestamp = Date.now();
        const customerReg = await axios.post(`${API_URL}/auth/register`, {
            email: `cart_test_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            phone: '0700000077'
        });
        const customerToken = customerReg.data.data.token;
        console.log('✓ Customer registered\n');

        // 2. Setup merchant + product
        const merchantReg = await axios.post(`${API_URL}/merchant/register`, {
            email: `merchant_cart_${timestamp}@test.com`,
            password: 'password123',
            firstName: 'M',
            lastName: 'M',
            businessName: 'Test Store',
            taxId: 'TAX_C'
        });
        const merchantToken = merchantReg.data.token;

        await axios.post(`${API_URL}/merchant/store`, {
            name: 'Test Store',
            category: 'food',
            address: '123 St',
            phone: '0700000078'
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const product = await axios.post(`${API_URL}/merchant/products`, {
            name: 'Test Product',
            price: 10.00,
            category: 'test',
            stock: 100
        }, { headers: { Authorization: `Bearer ${merchantToken}` } });

        const productId = product.data.id;
        console.log(`✓ Product created: ${productId}\n`);

        // 3. Add to cart
        console.log('Testing: Add to cart...');
        const addResult = await axios.post(`${API_URL}/cart/items`, {
            productId,
            quantity: 2
        }, { headers: { Authorization: `Bearer ${customerToken}` } });

        console.log('✓ Cart add successful!');
        console.log('Response:', JSON.stringify(addResult.data, null, 2));

        console.log('\n✅ CART TEST PASSED!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Cart Test Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

testCart();
