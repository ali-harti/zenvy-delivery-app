const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const passwordHash = await bcrypt.hash('password123', 10);

        return queryInterface.bulkInsert('users', [
            {
                email: 'customer@zenvy.com',
                password_hash: passwordHash,
                first_name: 'John',
                last_name: 'Doe',
                phone: '+212600000001',
                address: 'Boulevard Mohammed V, Casablanca, Morocco',
                role: 'customer',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'merchant@zenvy.com',
                password_hash: passwordHash,
                first_name: 'Sarah',
                last_name: 'Smith',
                phone: '+212600000002',
                address: 'Rue de Paris, Casablanca, Morocco',
                role: 'merchant',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'admin@zenvy.com',
                password_hash: passwordHash,
                first_name: 'Admin',
                last_name: 'User',
                phone: '+212600000003',
                role: 'admin',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
