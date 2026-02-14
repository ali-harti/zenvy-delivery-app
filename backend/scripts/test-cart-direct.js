const { Product, Cart, CartItem } = require('../src/models');

async function directTest() {
    try {
        console.log('=== DIRECT CART OPERATION TEST ===\n');

        // Step 1: Find a product
        const product = await Product.findOne({ where: { stock: { [require('sequelize').Op.gt]: 0 } } });
        if (!product) {
            console.log('No products found!');
            process.exit(1);
        }
        console.log(`✓ Found product: ID=${product.id}, Name=${product.name}, Price=${product.price}, Stock=${product.stock}\n`);

        // Step 2: Create a cart for a test user (assume user ID 1 exists)
        const userId = 1;
        console.log(`Creating/finding cart for user ${userId}...`);

        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            console.log('Creating new cart...');
            cart = await Cart.create({ userId });
        }
        console.log(`✓ Cart ID: ${cart.id}\n`);

        // Step 3: Try to create a cart item
        console.log(`Creating cart item: cartId=${cart.id}, productId=${product.id}, quantity=1, price=${product.price}...`);

        const cartItem = await CartItem.create({
            cartId: cart.id,
            productId: product.id,
            quantity: 1,
            priceSnapshot: parseFloat(product.price)
        });

        console.log(`✓ Cart item created successfully!`);
        console.log(`  Cart Item ID: ${cartItem.id}`);
        console.log(`  Quantity: ${cartItem.quantity}`);
        console.log(`  Price Snapshot: ${cartItem.priceSnapshot}\n`);

        console.log('✅ CART OPERATIONS WORK!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Full error:', error);
        if (error.original) {
            console.error('\nSQL Error:', error.original);
        }
        process.exit(1);
    }
}

directTest();
