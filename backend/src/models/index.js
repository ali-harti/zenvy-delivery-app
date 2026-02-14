const { Sequelize } = require('sequelize');
const config = require('../config/database');
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(config[env]);
console.log('Sequelize Config:', {
    env,
    dialect: config[env].dialect,
    logging: config[env].logging
});

const db = {
    sequelize,
    Sequelize,
    User: require('./User')(sequelize),
    Store: require('./Store')(sequelize),
    Product: require('./Product')(sequelize),
    Cart: require('./Cart')(sequelize),
    CartItem: require('./CartItem')(sequelize),
    Order: require('./Order')(sequelize),
    OrderItem: require('./OrderItem')(sequelize),
    Merchant: require('./Merchant')(sequelize),
    Admin: require('./Admin')(sequelize),
    Transaction: require('./Transaction')(sequelize),
    MerchantStats: require('./MerchantStats')(sequelize),
    PlatformSettings: require('./PlatformSettings')(sequelize),
    Notification: require('./Notification')(sequelize)
};

// Associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
