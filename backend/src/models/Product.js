const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'store_id'
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        imageUrl: {
            type: DataTypes.TEXT,
            field: 'image_url'
        },
        category: {
            type: DataTypes.STRING(100)
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_available'
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'products',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['store_id'] },
            { fields: ['is_available'] },
            { fields: ['category'] }
        ]
    });

    Product.associate = (models) => {
        Product.belongsTo(models.Store, {
            foreignKey: 'storeId',
            as: 'store'
        });

        Product.hasMany(models.CartItem, {
            foreignKey: 'productId',
            as: 'cartItems'
        });

        Product.hasMany(models.OrderItem, {
            foreignKey: 'productId',
            as: 'orderItems'
        });
    };

    return Product;
};
