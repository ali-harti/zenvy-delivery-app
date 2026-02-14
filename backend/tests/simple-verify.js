const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../src/models');

async function testConnection() {
    console.log('Testing connection...');
    try {
        console.log('Config:', {
            host: db.sequelize.config.host,
            database: db.sequelize.config.database,
            user: db.sequelize.config.username,
            port: db.sequelize.config.port
        });

        await db.sequelize.authenticate();
        console.log('✅ Connection Successful!');

        const [results] = await db.sequelize.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';");
        console.log('Tables:', results.map(r => r.tablename));

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
        process.exit(1);
    }
}

testConnection();
