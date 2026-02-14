'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const table = 'users';

        const columns = [
            { name: 'location_permission', type: Sequelize.BOOLEAN, defaultValue: false },
            { name: 'notification_permission', type: Sequelize.BOOLEAN, defaultValue: false },
            { name: 'preferred_vehicle', type: Sequelize.ENUM('bike', 'scooter', 'car'), defaultValue: 'bike' },
            { name: 'current_zone', type: Sequelize.STRING },
            { name: 'is_online', type: Sequelize.BOOLEAN, defaultValue: false },
            { name: 'onboarding_complete', type: Sequelize.BOOLEAN, defaultValue: false }
        ];

        for (const col of columns) {
            try {
                await queryInterface.addColumn(table, col.name, {
                    type: col.type,
                    defaultValue: col.defaultValue
                });
            } catch (e) {
                // console.log(`Column ${col.name} might already exist`);
            }
        }
    },

    down: async (queryInterface, Sequelize) => {
        const table = 'users';
        try {
            await queryInterface.removeColumn(table, 'location_permission');
            await queryInterface.removeColumn(table, 'notification_permission');
            await queryInterface.removeColumn(table, 'preferred_vehicle');
            await queryInterface.removeColumn(table, 'current_zone');
            await queryInterface.removeColumn(table, 'is_online');
            await queryInterface.removeColumn(table, 'onboarding_complete');
        } catch (e) {
            console.error(e);
        }
    }
};
