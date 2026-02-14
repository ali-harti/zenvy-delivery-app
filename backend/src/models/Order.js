const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'store_id'
        },
        deliveryPersonId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'delivery_person_id'
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'total_amount',
            validate: {
                min: 0
            }
        },
        deliveryFee: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 15.00,
            field: 'delivery_fee'
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'driver_assigned', 'in_delivery', 'delivered', 'cancelled'),
            defaultValue: 'pending',
            allowNull: false
        },
        deliveryAddress: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'delivery_address'
        },
        notes: {
            type: DataTypes.TEXT
        },
        cancelReason: {
            type: DataTypes.TEXT,
            field: 'cancel_reason'
        },
        deliveredAt: {
            type: DataTypes.DATE,
            field: 'delivered_at'
        }
    }, {
        tableName: 'orders',
        timestamps: true,
        underscored: true,
        indexes: [
            { fields: ['user_id'] },
            { fields: ['store_id'] },
            { fields: ['status'] },
            { fields: ['created_at'] }
        ]
    });

    Order.associate = (models) => {
        Order.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'customer'
        });

        Order.belongsTo(models.Store, {
            foreignKey: 'storeId',
            as: 'store'
        });

        Order.belongsTo(models.User, {
            foreignKey: 'deliveryPersonId',
            as: 'deliveryPerson'
        });

        Order.hasMany(models.OrderItem, {
            foreignKey: 'orderId',
            as: 'items',
            onDelete: 'CASCADE'
        });
    };

    return Order;
};
