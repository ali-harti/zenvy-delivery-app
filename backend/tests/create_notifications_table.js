const db = require('../src/models');

async function patch() {
    try {
        await db.sequelize.getQueryInterface().createTable('notifications', {
            id: {
                type: db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: db.Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' }
            },
            title: {
                type: db.Sequelize.STRING,
                allowNull: false
            },
            message: {
                type: db.Sequelize.TEXT,
                allowNull: false
            },
            type: {
                type: db.Sequelize.STRING,
                defaultValue: 'system'
            },
            is_read: {
                type: db.Sequelize.BOOLEAN,
                defaultValue: false
            },
            metadata: {
                type: db.Sequelize.JSON
            },
            created_at: {
                allowNull: false,
                type: db.Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: db.Sequelize.DATE
            }
        });
        console.log('Notifications table created');
    } catch (e) {
        console.error('Patch failed:', e);
    }
}
patch();
