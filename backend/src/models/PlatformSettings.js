const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PlatformSettings = sequelize.define('PlatformSettings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'platform_settings',
        timestamps: true,
        underscored: true
    });

    return PlatformSettings;
};
