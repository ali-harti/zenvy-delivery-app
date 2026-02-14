const axios = require('axios');
const API_URL = 'http://localhost:5012/api/v1';

async function run() {
    try {
        // 1. Register & Login (Reuse verified flow)
        const email = `prod_test_${Date.now()}@test.com`;
        console.log('Registering:', email);
        const reg = await axios.post(`${API_URL}/merchant/register`, {
            email,
            password: 'password123',
            firstName: 'Prod',
            lastName: 'Master',
            businessName: 'Product Corp',
            taxId: 'TAX_PROD'
        });
        const token = reg.data.token;
        console.log('Token acquired.');

        // 2. Create Store (Required for products)
        await axios.post(`${API_URL}/merchant/store`, {
            name: 'Product Store',
            category: 'shops',
            address: '123 Prod St'
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Store created.');

        // 3. Create Product
        console.log('Creating product...');
        const p1 = await axios.post(`${API_URL}/merchant/products`, {
            name: 'Test Widget',
            price: 19.99,
            description: 'A great widget',
            category: 'widgets',
            stock: 100
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Product created:', p1.data.id);

        // 4. List Products
        console.log('Listing products...');
        const list = await axios.get(`${API_URL}/merchant/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Products found:', list.data.length);
        if (list.data.length !== 1) throw new Error('Product count mismatch');

        // 5. Update Product
        console.log('Updating product...');
        await axios.put(`${API_URL}/merchant/products/${p1.data.id}`, {
            price: 25.00
        }, { headers: { Authorization: `Bearer ${token}` } });

        // 6. Delete Product
        console.log('Deleting product...');
        await axios.delete(`${API_URL}/merchant/products/${p1.data.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Product deleted.');

        // Verify Empty
        const empty = await axios.get(`${API_URL}/merchant/products`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (empty.data.length !== 0) throw new Error('Delete failed');

        console.log('✅ Product CRUD Verified!');

    } catch (e) {
        console.error('Test Failed Full:', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', e.response.data);
        }
    }
}
run();
