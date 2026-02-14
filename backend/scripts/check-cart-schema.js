const { sequelize } = require('../src/models');

async function checkCartSchema() {
    try {
        const [columns] = await sequelize.query(`
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'cart_items'
            ORDER BY ordinal_position;
        `);

        console.log('Cart Items Table Schema:');
        console.table(columns);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkCartSchema();
