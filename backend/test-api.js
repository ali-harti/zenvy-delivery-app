const request = require('supertest');
// Note: Since supertest is not installed, we'll use a simple HTTP test instead

const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing ZENYY Backend API\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
        // Test 1: Root endpoint
        console.log('Test 1: GET / (Root endpoint)');
        const root = await testEndpoint('/');
        console.log(`  Status: ${root.status}`);
        console.log(`  Message: ${root.data.message}`);
        console.log(`  ✅ ${root.status === 200 ? 'PASSED' : 'FAILED'}\n`);

        // Test 2: Register a new user
        console.log('Test 2: POST /api/auth/register');
        const register = await testEndpoint('/api/auth/register', 'POST', {
            email: `test${Date.now()}@zenyy.fr`,
            password: 'password123',
            first_name: 'Test',
            last_name: 'User',
            phone: '+33612345678',
            role: 'customer'
        });
        console.log(`  Status: ${register.status}`);
        console.log(`  Success: ${register.data.success}`);
        if (register.data.data && register.data.data.token) {
            console.log(`  Token received: ${register.data.data.token.substring(0, 20)}...`);
        }
        console.log(`  ✅ ${register.status === 201 ? 'PASSED' : 'FAILED'}\n`);

        // Test 3: Login
        console.log('Test 3: POST /api/auth/login');
        const login = await testEndpoint('/api/auth/login', 'POST', {
            email: 'customer@test.com',
            password: 'password123'
        });
        console.log(`  Status: ${login.status}`);
        console.log(`  Success: ${login.data.success}`);
        if (login.data.data && login.data.data.user) {
            console.log(`  User: ${login.data.data.user.email} (${login.data.data.user.role})`);
        }
        console.log(`  ✅ ${login.status === 200 ? 'PASSED' : 'FAILED'}\n`);

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ All tests completed!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nMake sure the server is running: npm run dev');
    }
}

runTests();
