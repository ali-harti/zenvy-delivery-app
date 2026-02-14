const axios = require('axios');

const API_URL = 'http://localhost:5012/api/v1';

async function testStoreDetails() {
    try {
        console.log('=== STORE DETAILS TEST ===\n');

        // 1. Get all stores
        const stores = await axios.get(`${API_URL}/stores`);
        const storesList = stores.data.data?.stores || stores.data.stores || stores.data;

        if (storesList.length === 0) {
            console.log('No stores found!');
            process.exit(1);
        }

        const storeId = storesList[0].id;
        console.log(`✓ Found ${storesList.length} stores`);
        console.log(`  Testing with Store ID: ${storeId}\n`);

        // 2. Get store details
        console.log(`Fetching store details for ID ${storeId}...`);
        const storeDetails = await axios.get(`${API_URL}/stores/${storeId}`);

        console.log('✓ Store details retrieved successfully!');
        console.log('Response:', JSON.stringify(storeDetails.data, null, 2));

        console.log('\n✅ STORE DETAILS TEST PASSED!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

testStoreDetails();
