module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('stores', [
            {
                name: 'Marjane Market',
                category: 'groceries',
                image_url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800',
                address: 'Boulevard Mohammed V, Casablanca, Morocco',
                latitude: 33.5731,
                longitude: -7.5898,
                opening_time: '08:00:00',
                closing_time: '22:00:00',
                is_open: true,
                rating: 4.5,
                delivery_fee: 15.00,
                minimum_order: 50.00,
                merchant_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Beauty Success',
                category: 'beauty',
                image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
                address: 'Ain Diab, Casablanca, Morocco',
                latitude: 33.5944,
                longitude: -7.6606,
                opening_time: '09:00:00',
                closing_time: '21:00:00',
                is_open: true,
                rating: 4.7,
                delivery_fee: 20.00,
                minimum_order: 100.00,
                merchant_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'McDonald\'s Maarif',
                category: 'food',
                image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
                address: 'Boulevard Zerktouni, Casablanca, Morocco',
                latitude: 33.5883,
                longitude: -7.6366,
                opening_time: '10:00:00',
                closing_time: '23:00:00',
                is_open: true,
                rating: 4.3,
                delivery_fee: 10.00,
                minimum_order: 30.00,
                merchant_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pharmacie Centrale',
                category: 'pharmacy',
                image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800',
                address: 'Place Mohammed V, Casablanca, Morocco',
                latitude: 33.5950,
                longitude: -7.6187,
                opening_time: '08:00:00',
                closing_time: '20:00:00',
                is_open: true,
                rating: 4.8,
                delivery_fee: 12.00,
                minimum_order: 20.00,
                merchant_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Zara Home',
                category: 'shops',
                image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
                address: 'Morocco Mall, Casablanca, Morocco',
                latitude: 33.5469,
                longitude: -7.6707,
                opening_time: '10:00:00',
                closing_time: '22:00:00',
                is_open: true,
                rating: 4.6,
                delivery_fee: 25.00,
                minimum_order: 200.00,
                merchant_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('stores', null, {});
    }
};
