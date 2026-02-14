const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'cart_id'
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'product_id'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
        priceSnapshot: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'price_snapshot'
        }
    }, {
        tableName: 'cart_items',
        timestamps: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['cart_id', 'product_id'] }
        ]
    });

    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'cartId',
            as: 'cart'
        });

        CartItem.belongsTo(models.Product, {
            foreignKey: 'productId',
            as: 'product'
        });
    };

    return CartItem;
};
