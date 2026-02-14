const { sequelize } = require('../src/models');

async function createCartTables() {
    try {
        console.log('Creating cart tables...');

        // Create carts table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS carts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ carts table created');

        // Create cart_items table
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
                price_snapshot DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(cart_id, product_id)
            );
        `);
        console.log('✓ cart_items table created');

        // Create indexes
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
            CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
        `);
        console.log('✓ Indexes created');

        console.log('\n✅ Cart tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating cart tables:', error);
        process.exit(1);
    }
}

createCartTables();
