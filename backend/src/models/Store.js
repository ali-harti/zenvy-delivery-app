const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Store = sequelize.define('Store', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('food', 'groceries', 'pharmacy', 'shops', 'beauty'),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.TEXT,
            field: 'image_url'
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        openingTime: {
            type: DataTypes.TIME,
            field: 'opening_time',
            defaultValue: '08:00:00'
        },
        closingTime: {
            type: DataTypes.TIME,
            field: 'closing_time',
            defaultValue: '22:00:00'
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_open'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        },
        merchantId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'merchant_id'
        },
        rating: {
            type: DataTypes.DECIMAL(2, 1),
            defaultValue: 4.5,
            validate: {
                min: 0,
                max: 5
            }
        },
        deliveryFee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 15.00,
            field: 'delivery_fee'
        },
        minimumOrder: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            field: 'minimum_order'
        }
    }, {
        tableName: 'stores',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['category'] },
            { fields: ['is_open'] },
            { fields: ['merchant_id'] }
        ]
    });

    Store.associate = (models) => {
        Store.hasMany(models.Product, {
            foreignKey: 'storeId',
            as: 'products',
            onDelete: 'CASCADE'
        });

        Store.hasMany(models.Order, {
            foreignKey: 'storeId',
            as: 'orders'
        });

        Store.belongsTo(models.User, {
            foreignKey: 'merchantId',
            as: 'merchant'
        });
    };

    return Store;
};
