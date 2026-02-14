const { sequelize, User, Store, Product, Order, OrderItem } = require('./src/models');
const bcrypt = require('bcryptjs');

async function createTestClient() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        const email = 'client.test@zenvy.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Cleanup existing test user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            console.log('⚠️  User exists, cleaning up...');
            await existingUser.destroy();
            console.log('🗑️  Old user deleted.');
        }

        // 2. Create User
        console.log('👤 Creating test user...');
        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            firstName: 'Test',
            lastName: 'Client',
            phone: '+212600000099',
            role: 'customer',
            isActive: true,
            address: '123 Test Blvd, Tech City',
        });
        console.log(`✅ User created: ${user.email}`);

        // 3. Find Stores/Products for History
        // We look for a store that has products.
        let store = await Store.findOne({
            include: [{ model: Product, as: 'products' }]
        });

        // If no store found, OR store found but has no products
        if (!store || !store.products || store.products.length === 0) {
            console.log('⚠️  No valid store found (with products). Creating/Updating mock store...');

            // If we didn't find a store at all, create one
            if (!store) {
                // Check for merchant first
                let merchant = await User.findOne({ where: { role: 'merchant' } });
                if (!merchant) {
                    console.log('⚠️  No merchant found. Creating mock merchant...');
                    const merchantHash = await bcrypt.hash('password123', 10);
                    merchant = await User.create({
                        email: 'merchant.mock@zenvy.com',
                        passwordHash: merchantHash,
                        firstName: 'Mock',
                        lastName: 'Merchant',
                        role: 'merchant',
                        isActive: true
                    });
                }

                store = await Store.create({
                    merchantId: merchant.id,
                    name: 'Zenvy Mock Store',
                    address: '123 Mock Lane',
                    phone: '+1234567890',
                    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80',
                    isActive: true
                });
            }

            // At this point 'store' exists (either found or created).
            // Now create products for it.
            console.log(`🍔 Creating products for store ID: ${store.id}...`);
            await Product.create({
                storeId: store.id,
                name: 'Mock Burger',
                description: 'A delicious mock burger',
                price: 12.99,
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
                isAvailable: true
            });
            await Product.create({
                storeId: store.id,
                name: 'Mock Fries',
                description: 'Crispy mock fries',
                price: 4.99,
                imageUrl: 'https://images.unsplash.com/photo-1573080496987-a2267f139612?w=500&q=80',
                isAvailable: true
            });

            // Reload store to get the products
            store = await Store.findOne({
                where: { id: store.id },
                include: [{ model: Product, as: 'products' }]
            });
        }

        // Now we are guaranteed to have store.products with at least 1 item
        const product1 = store.products[0];
        const product2 = store.products[1] || product1;

        // 4. Create "Delivered" Order (Past)
        console.log('📦 Creating past order...');
        const order1 = await Order.create({
            userId: user.id,
            storeId: store.id,
            totalAmount: (parseFloat(product1.price) * 2) + 15.00, // 2 items + delivery
            deliveryFee: 15.00,
            status: 'delivered',
            deliveryAddress: '123 Test Blvd, Tech City',
            notes: 'Leave at front door',
            createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
            deliveredAt: new Date(Date.now() - 86400000)
        });

        await OrderItem.create({
            orderId: order1.id,
            productId: product1.id,
            quantity: 2,
            priceSnapshot: product1.price
        });

        // 5. Create "Active" Order (Preparing)
        console.log('🍳 Creating active order...');
        const order2 = await Order.create({
            userId: user.id,
            storeId: store.id,
            totalAmount: parseFloat(product2.price) + 15.00,
            deliveryFee: 15.00,
            status: 'preparing',
            deliveryAddress: 'Office 404, Business Center',
            notes: 'Call upon arrival',
            createdAt: new Date()
        });

        await OrderItem.create({
            orderId: order2.id,
            productId: product2.id,
            quantity: 1,
            priceSnapshot: product2.price
        });

        console.log('\n✨ Test Account Ready! ✨');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Error creating test client:', error);
    } finally {
        await sequelize.close();
    }
}

createTestClient();
