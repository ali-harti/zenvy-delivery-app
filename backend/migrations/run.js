const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runMigrations() {
    try {
        console.log('🚀 Starting database migrations...\n');
        console.log(`📍 Connecting to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

        // Test connection first
        console.log('🔌 Testing connection...');
        const testResult = await pool.query('SELECT version()');
        console.log('✓ Connected to:', testResult.rows[0].version.split(' ')[0]);

        // Run schema migration
        console.log('\n📋 Running schema migrations...');

        const migrationFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ensure 001 comes before 002

        for (const file of migrationFiles) {
            console.log(`\n📄 Executing ${file}...`);
            const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
            await pool.query(sql);
            console.log(`   ✓ ${file} applied`);
        }

        console.log('\n✓ All schema migrations completed successfully\n');

        // Run seed data
        console.log('🌱 Inserting seed data...');
        const seedSQL = fs.readFileSync(path.join(__dirname, '../seeds/seed.sql'), 'utf8');
        await pool.query(seedSQL);
        console.log('✓ Seed data inserted successfully\n');

        // Verify data
        console.log('🔍 Verifying data...');
        const storesResult = await pool.query('SELECT COUNT(*) FROM stores');
        const usersResult = await pool.query('SELECT COUNT(*) FROM users');
        const productsResult = await pool.query('SELECT COUNT(*) FROM products');

        console.log(`✓ Users: ${usersResult.rows[0].count}`);
        console.log(`✓ Stores: ${storesResult.rows[0].count}`);
        console.log(`✓ Products: ${productsResult.rows[0].count}`);

        console.log('\n✅ All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error.message);
        console.error('\nFull error:');
        console.error(error);
        console.error('\nConnection details:');
        console.error(`  Host: ${process.env.DB_HOST}`);
        console.error(`  Database: ${process.env.DB_NAME}`);
        console.error(`  User: ${process.env.DB_USER}`);
        process.exit(1);
    }
}

runMigrations();
