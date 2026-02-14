const { sequelize } = require('../src/models');

async function fixCartItems() {
    try {
        console.log('Checking cart_items schema...\n');

        // Drop and recreate cart_items table with correct schema
        await sequelize.query(`DROP TABLE IF EXISTS cart_items CASCADE;`);
        console.log('✓ Dropped cart_items table');

        await sequelize.query(`
            CREATE TABLE cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
                price_snapshot NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(cart_id, product_id)
            );
        `);
        console.log('✓ Created cart_items table with price_snapshot column');

        await sequelize.query(`
            CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
            CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
        `);
        console.log('✓ Created indexes');

        console.log('\n✅ Cart schema fixed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixCartItems();
