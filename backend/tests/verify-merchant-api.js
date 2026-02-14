const axios = require('axios');
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m'
};

const API_URL = 'http://localhost:5010/api/v1';
const testMerchant = {
    email: `merchant_${Date.now()}@test.com`,
    password: 'password123',
    firstName: 'Test',
    lastName: 'Merchant',
    businessName: 'Zenvy Tech',
    taxId: 'TAX_99999',
    phone: '1234567890'
};

async function runTest() {
    console.log('\n🏪 Testing Merchant API Endpoints...\n');

    try {
        // 1. Register
        console.log('1. Testing POST /merchant/register');
        const regRes = await axios.post(`${API_URL}/merchant/register`, testMerchant);

        if (regRes.status === 201 && regRes.data.token) {
            console.log(colors.green + '   ✓ Registered successfully' + colors.reset);
            console.log(`   Token: ${regRes.data.token.substring(0, 10)}...`);
        } else {
            throw new Error(`Registration failed: ${regRes.status}`);
        }

        const token = regRes.data.token;

        // 2. Get Profile
        console.log('\n2. Testing GET /merchant/profile');
        const profileRes = await axios.get(`${API_URL}/merchant/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (profileRes.status === 200 && profileRes.data.businessName === testMerchant.businessName) {
            console.log(colors.green + '   ✓ Profile fetched successfully' + colors.reset);
            console.log('   Stats:', profileRes.data.stats);
        } else {
            throw new Error(`Profile fetch failed: ${profileRes.status}`);
        }

        console.log(colors.green + '\n✨ Merchant API Validation Passed!' + colors.reset);
        process.exit(0);

    } catch (error) {
        console.error(colors.red + '\n❌ Test Failed:' + colors.reset);
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Error:', error.message);
        }
        process.exit(1);
    }
}

// Wait for server to be ready
setTimeout(runTest, 2000);
