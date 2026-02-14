const getStores = async (req, res) => {
    try {
        // Simulating Real DB Data with Premium Content
        // In a real scenario, this would query the database 'stores' table.
        const stores = [
            {
                id: '1',
                name: "Joe's Burger Bar",
                rating: 4.8,
                reviewCount: 240,
                deliveryTime: '20-30 min',
                deliveryFee: 2.99,
                category: 'Burgers',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
                address: '123 Main St, New York',
                tags: ['Burgers', 'American', 'Comfort Food']
            },
            {
                id: '2',
                name: "Sushi Master",
                rating: 4.9,
                reviewCount: 500,
                deliveryTime: '30-45 min',
                deliveryFee: 3.99,
                category: 'Asian',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
                address: '456 Sushi Lane',
                tags: ['Sushi', 'Japanese', 'Fresh']
            },
            {
                id: '3',
                name: "Pizza Heaven",
                rating: 4.5,
                reviewCount: 150,
                deliveryTime: '25-40 min',
                deliveryFee: 1.99,
                category: 'Pizza',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80',
                address: '789 Pizza Blvd',
                tags: ['Pizza', 'Italian', 'Vegetarian']
            },
            {
                id: '4',
                name: "Green Salad Co.",
                rating: 4.7,
                reviewCount: 85,
                deliveryTime: '15-25 min',
                deliveryFee: 0.99,
                category: 'Healthy',
                image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
                address: '321 Healthy Way',
                tags: ['Healthy', 'Salads', 'Vegan']
            },
            {
                id: '5',
                name: "Taco Fiesta",
                rating: 4.6,
                reviewCount: 320,
                deliveryTime: '20-35 min',
                deliveryFee: 2.49,
                category: 'Mexican',
                image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
                address: '567 Taco St',
                tags: ['Tacos', 'Mexican', 'Spicy']
            },
        ];

        // Filter logic could go here based on req.query.category

        res.json({
            success: true,
            count: stores.length,
            data: stores
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error fetching stores'
        });
    }
};

const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        // Mock detailed data
        const store = {
            id: id,
            name: "Joe's Burger Bar",
            rating: 4.8,
            reviewCount: 240,
            deliveryTime: '20-30 min',
            deliveryFee: 2.99,
            category: 'Burgers',
            image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80',
            address: '123 Main St, New York',
            products: [
                {
                    category: 'Popular',
                    data: [
                        { id: '101', name: 'Classic Cheeseburger', description: 'Beef patty with cheese, lettuce, tomato', price: 12.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', rating: 4.7, popular: true },
                        { id: '102', name: 'Bacon Deluxe', description: 'Double patty with crispy bacon and cheese', price: 15.99, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80', rating: 4.8, popular: true },
                    ]
                },
                {
                    category: 'Sides',
                    data: [
                        { id: '201', name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 4.99, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80', rating: 4.5 },
                    ]
                }
            ]
        };

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        res.json({
            success: true,
            data: store
        });
    } catch (error) {
        console.error('Error fetching store details:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getStores,
    getStoreById
};
