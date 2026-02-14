const axios = require('axios');
const API_URL = 'http://localhost:5012/api/v1';

async function run() {
    try {
        // 0. Register New Merchant
        const email = `store_test_${Date.now()}@test.com`;
        console.log('Registering:', email);
        const reg = await axios.post(`${API_URL}/merchant/register`, {
            email,
            password: 'password123',
            firstName: 'Store',
            lastName: 'Owner',
            businessName: 'Test Business',
            taxId: 'TAX_123'
        });
        const token = reg.data.token;
        console.log('Registered & Logged in. Token:', token.substring(0, 20) + '...');

        // 2. Create/Update Store
        console.log('Updating Store...');
        const storeData = {
            name: 'Debug Store',
            description: 'Best debug store in town',
            category: 'food',
            address: '123 Debug Lane',
            phone: '555-0199',
            deliveryTimeMin: 45,
            deliveryFee: 5.99,
            minimumOrder: 15.00,
            openingTime: '09:00',
            closingTime: '21:00'
        };

        const update = await axios.post(`${API_URL}/merchant/store`, storeData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Store Update Success:', update.data);

        // 3. Verify Profile linking
        console.log('Verifying Profile Link...');
        const profile = await axios.get(`${API_URL}/merchant/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (profile.data.store && profile.data.store.name === 'Debug Store') {
            console.log('✅ Store linked correctly in Profile');
        } else {
            console.error('❌ Store missing or incorrect in Profile', profile.data);
        }

    } catch (e) {
        console.error('Test Failed Full:', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', e.response.data);
        }
    }
}
run();
