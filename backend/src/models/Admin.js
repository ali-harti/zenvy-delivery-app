const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
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
        role: {
            type: DataTypes.ENUM('super_admin', 'moderator', 'support'),
            defaultValue: 'moderator',
            allowNull: false
        },
        permissions: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        }
    }, {
        tableName: 'admins',
        timestamps: true,
        underscored: true
    });

    Admin.associate = (models) => {
        Admin.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Admin;
};
