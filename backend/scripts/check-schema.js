const { sequelize } = require('../src/models');

async function checkSchema() {
    try {
        console.log('Checking schema...\n');

        // Check products table
        const [products] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'products'
            ORDER BY ordinal_position;
        `);
        console.log('Products table columns:');
        console.table(products);

        // Check cart_items table
        const [cartItems] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'cart_items'
            ORDER BY ordinal_position;
        `);
        console.log('\nCart_items table columns:');
        console.table(cartItems);

        // Check foreign keys
        const [fks] = await sequelize.query(`
            SELECT
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_name IN ('cart_items', 'carts');
        `);
        console.log('\nForeign keys:');
        console.table(fks);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
