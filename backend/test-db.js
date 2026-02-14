const pool = require('./src/config/database');

async function checkTables() {
    try {
        console.log('Checking database tables...\n');

        // List all tables
        const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        if (tables.rows.length === 0) {
            console.log('❌ No tables found! Migration may have failed.');
            console.log('\nRunning migration manually...\n');

            const fs = require('fs');
            const path = require('path');

            const schemaSQL = fs.readFileSync(path.join(__dirname, 'migrations/001_init.sql'), 'utf8');
            await pool.query(schemaSQL);
            console.log('✅ Schema created!');

            const seedSQL = fs.readFileSync(path.join(__dirname, 'seeds/seed.sql'), 'utf8');
            await pool.query(seedSQL);
            console.log('✅ Seed data inserted!');
        } else {
            console.log(`✅ Found ${tables.rows.length} tables:`);
            tables.rows.forEach(row => console.log('  -', row.table_name));
        }

        // Count records
        console.log('\nCounting records...');
        const stores = await pool.query('SELECT COUNT(*) FROM stores');
        const users = await pool.query('SELECT COUNT(*) FROM users');
        const products = await pool.query('SELECT COUNT(*) FROM products');

        console.log(`  Stores: ${stores.rows[0].count}`);
        console.log(`  Users: ${users.rows[0].count}`);
        console.log(`  Products: ${products.rows[0].count}`);

        console.log('\n✅ Database is ready!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkTables();
