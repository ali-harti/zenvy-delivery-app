const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.ENUM('order_payment', 'payout', 'refund', 'fee'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending',
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING(10),
            defaultValue: 'MAD'
        },
        orderId: {
            type: DataTypes.INTEGER,
            field: 'order_id'
        },
        merchantId: {
            type: DataTypes.INTEGER,
            field: 'merchant_id'
        },
        courierId: {
            type: DataTypes.INTEGER,
            field: 'courier_id'
        },
        platformFee: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            field: 'platform_fee'
        },
        merchantAmount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            field: 'merchant_amount'
        },
        courierAmount: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            field: 'courier_amount'
        },
        referenceId: {
            type: DataTypes.STRING(100),
            field: 'reference_id'
        }
    }, {
        tableName: 'transactions',
        timestamps: true,
        underscored: true
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Order, {
            foreignKey: 'orderId',
            as: 'order'
        });

        Transaction.belongsTo(models.Merchant, {
            foreignKey: 'merchantId',
            as: 'merchant'
        });

        Transaction.belongsTo(models.User, {
            foreignKey: 'courierId',
            as: 'courier'
        });
    };

    return Transaction;
};
