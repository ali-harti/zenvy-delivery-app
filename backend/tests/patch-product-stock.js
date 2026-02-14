const { Sequelize } = require('sequelize');
const config = require('../src/config/database');
const env = 'development'; // Hardcoded for simplified patch

const sequelize = new Sequelize(config[env]);

async function patch() {
    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Connected.');

        console.log('Adding stock column...');
        await sequelize.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;');
        console.log('✅ Success: stock column added.');
    } catch (error) {
        console.error('❌ Patch failed:', error);
    } finally {
        await sequelize.close();
    }
}

patch();
