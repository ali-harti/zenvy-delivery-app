const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password_hash'
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'last_name'
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            validate: {
                is: /^[0-9+\-\s()]+$/
            }
        },

        role: {
            type: DataTypes.ENUM('customer', 'merchant', 'courier', 'admin'),
            defaultValue: 'customer',
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'is_active'
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            field: 'last_login_at'
        },
        // Courier Specific Fields
        locationPermission: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'location_permission'
        },
        notificationPermission: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'notification_permission'
        },
        preferredVehicle: {
            type: DataTypes.ENUM('bike', 'scooter', 'car'),
            defaultValue: 'bike',
            field: 'preferred_vehicle'
        },
        currentZone: {
            type: DataTypes.STRING,
            field: 'current_zone'
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_online'
        },
        onboardingComplete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'onboarding_complete'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true,
        indexes: [
            { unique: true, fields: ['email'] },
            { fields: ['role'] }
        ]
    });

    // Instance methods
    User.prototype.comparePassword = async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.passwordHash);
    };

    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.passwordHash;
        return values;
    };

    // Class methods
    User.hashPassword = async (password) => {
        return await bcrypt.hash(password, config.bcrypt.rounds);
    };

    // Associations
    User.associate = (models) => {
        User.hasMany(models.Order, {
            foreignKey: 'userId',
            as: 'orders'
        });

        User.hasOne(models.Cart, {
            foreignKey: 'userId',
            as: 'cart'
        });

        User.hasMany(models.Store, {
            foreignKey: 'merchantId',
            as: 'stores'
        });
    };

    return User;
};
