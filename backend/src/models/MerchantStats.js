const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MerchantStats = sequelize.define('MerchantStats', {
        merchantId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            field: 'merchant_id'
        },
        totalOrders: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'total_orders'
        },
        totalRevenue: {
            type: DataTypes.DECIMAL(15, 2),
            defaultValue: 0.00,
            field: 'total_revenue'
        },
        averageRating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.00,
            field: 'average_rating'
        }
    }, {
        tableName: 'merchant_stats',
        timestamps: false, // Updated via triggers
        underscored: true
    });

    MerchantStats.associate = (models) => {
        MerchantStats.belongsTo(models.Merchant, {
            foreignKey: 'merchantId',
            as: 'merchant'
        });
    };

    return MerchantStats;
};
