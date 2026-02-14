const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Merchant = sequelize.define('Merchant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: 'user_id'
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'store_id'
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
            defaultValue: 'pending',
            allowNull: false
        },
        commissionRate: {
            type: DataTypes.DECIMAL(5, 2),
            defaultValue: 15.00,
            field: 'commission_rate'
        },
        businessName: {
            type: DataTypes.STRING(255),
            field: 'business_name'
        },
        taxId: {
            type: DataTypes.STRING(100),
            field: 'tax_id'
        }
    }, {
        tableName: 'merchants',
        timestamps: true,
        underscored: true
    });

    Merchant.associate = (models) => {
        Merchant.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });

        Merchant.belongsTo(models.Store, {
            foreignKey: 'storeId',
            as: 'store'
        });

        Merchant.hasOne(models.MerchantStats, {
            foreignKey: 'merchantId',
            as: 'stats'
        });

        Merchant.hasMany(models.Transaction, {
            foreignKey: 'merchantId',
            as: 'transactions'
        });
    };

    return Merchant;
};
