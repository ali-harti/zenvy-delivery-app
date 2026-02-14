module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('products', [
            // Marjane Market (store_id: 1)
            {
                store_id: 1,
                name: 'Fresh Milk 1L',
                description: 'Full cream fresh milk',
                price: 12.50,
                image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
                category: 'Dairy',
                is_available: true,
                stock: 50,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 1,
                name: 'Organic Eggs (12 pcs)',
                description: 'Farm fresh organic eggs',
                price: 35.00,
                image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
                category: 'Dairy',
                is_available: true,
                stock: 30,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 1,
                name: 'Tomatoes (1kg)',
                description: 'Fresh red tomatoes',
                price: 8.00,
                image_url: 'https://images.unsplash.com/photo-1546470427-e26264be0b93?w=400',
                category: 'Vegetables',
                is_available: true,
                stock: 100,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 1,
                name: 'Bread Baguette',
                description: 'Freshly baked French baguette',
                price: 3.50,
                image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
                category: 'Bakery',
                is_available: true,
                stock: 80,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Beauty Success (store_id: 2)
            {
                store_id: 2,
                name: 'L\'Oréal Shampoo',
                description: 'Moisturizing shampoo for dry hair',
                price: 85.00,
                image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
                category: 'Hair Care',
                is_available: true,
                stock: 25,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 2,
                name: 'Nivea Face Cream',
                description: 'Hydrating face cream',
                price: 120.00,
                image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
                category: 'Skin Care',
                is_available: true,
                stock: 40,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 2,
                name: 'Lipstick Red Passion',
                description: 'Long-lasting matte lipstick',
                price: 65.00,
                image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
                category: 'Makeup',
                is_available: true,
                stock: 60,
                created_at: new Date(),
                updated_at: new Date()
            },
            // McDonald's (store_id: 3)
            {
                store_id: 3,
                name: 'Big Mac Menu',
                description: 'Big Mac + Fries + Drink',
                price: 55.00,
                image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
                category: 'Burgers',
                is_available: true,
                stock: 999,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 3,
                name: 'Chicken McNuggets (9 pcs)',
                description: 'Crispy chicken nuggets',
                price: 35.00,
                image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
                category: 'Chicken',
                is_available: true,
                stock: 999,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 3,
                name: 'McFlurry Oreo',
                description: 'Ice cream with Oreo pieces',
                price: 25.00,
                image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
                category: 'Desserts',
                is_available: true,
                stock: 999,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Pharmacie Centrale (store_id: 4)
            {
                store_id: 4,
                name: 'Paracetamol 500mg',
                description: 'Pain relief tablets (20 tablets)',
                price: 15.00,
                image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
                category: 'Medication',
                is_available: true,
                stock: 200,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 4,
                name: 'Vitamin C 1000mg',
                description: 'Immune system support',
                price: 45.00,
                image_url: 'https://images.unsplash.com/photo-1550572017-4bfbd6c86384?w=400',
                category: 'Supplements',
                is_available: true,
                stock: 150,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 4,
                name: 'Hand Sanitizer 500ml',
                description: 'Antibacterial hand sanitizer',
                price: 35.00,
                image_url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400',
                category: 'Hygiene',
                is_available: true,
                stock: 100,
                created_at: new Date(),
                updated_at: new Date()
            },
            // Zara Home (store_id: 5)
            {
                store_id: 5,
                name: 'Cotton Bed Sheets Set',
                description: 'Premium cotton sheets (Queen size)',
                price: 450.00,
                image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
                category: 'Bedroom',
                is_available: true,
                stock: 15,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 5,
                name: 'Decorative Cushion',
                description: 'Velvet decorative cushion 45x45cm',
                price: 120.00,
                image_url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
                category: 'Decor',
                is_available: true,
                stock: 40,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                store_id: 5,
                name: 'Scented Candles Set (3 pcs)',
                description: 'Lavender, vanilla & rose scents',
                price: 180.00,
                image_url: 'https://images.unsplash.com/photo-1602874801006-2f2d55dd6471?w=400',
                category: 'Decor',
                is_available: true,
                stock: 25,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('products', null, {});
    }
};
