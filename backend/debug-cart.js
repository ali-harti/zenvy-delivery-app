const axios = require('axios');

const BASE_URL = 'http://localhost:5010/api/v1';

async function debugCart() {
    try {
        console.log('1. Registering user...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, {
            email: `debug${Date.now()}@test.com`,
            password: 'password123',
            firstName: 'Debug',
            lastName: 'User'
        });
        const token = regRes.data.data.token;
        console.log('   User registered. Token:', token.substring(0, 10) + '...');

        console.log('\n2. Getting Stores (to find a product)...');
        const storeRes = await axios.get(`${BASE_URL}/stores`);
        const storeId = storeRes.data.data.stores[0].id;
        console.log(`   Found store ID: ${storeId}`);

        console.log('\n3. Getting Products...');
        const prodRes = await axios.get(`${BASE_URL}/stores/${storeId}/products`);
        const product = prodRes.data.data.products[0];
        console.log(`   Found product: ${product.id} (${product.name}) - Price: ${product.price}`);

        console.log('\n4. Attempting Add To Cart...');
        try {
            const addRes = await axios.post(
                `${BASE_URL}/cart/items`,
                {
                    productId: product.id,
                    quantity: 1
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log('   SUCCESS:', addRes.data);
        } catch (err) {
            console.error('   FAILED!');
            console.error('   Status:', err.response?.status);
            console.error('   Data:', JSON.stringify(err.response?.data, null, 2));
        }

    } catch (error) {
        console.error('Setup failed:', error.message);
        if (error.response) {
            console.error(error.response.data);
        }
    }
}

debugCart();
