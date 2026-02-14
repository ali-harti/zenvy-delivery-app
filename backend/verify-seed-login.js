const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function verifyLogin() {
    console.log('🔍 Verifying login for client@test.com...');

    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();

        // 1. Get user
        const res = await client.query("SELECT * FROM users WHERE email = 'client@test.com'");
        if (res.rows.length === 0) {
            console.log('❌ User client@test.com NOT FOUND in database');
            return;
        }

        const user = res.rows[0];
        console.log('✓ User found:', user.email);
        console.log('  Hash:', user.password_hash);

        // 2. Compare password
        const password = 'password123';
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            console.log('✅ Password Match! Login SHOULD work.');
        } else {
            console.log('❌ Password DOES NOT match hash.');

            // Generate new hash to see what it should be
            const newHash = await bcrypt.hash(password, 10);
            console.log('  Expected valid hash would look like:', newHash);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

verifyLogin();
