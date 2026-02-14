/**
 * AuditLog Model
 * Immutable audit trail for sensitive operations
 */

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        actorUserId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Null for system actions
            field: 'actor_user_id'
        },
        actorRole: {
            type: DataTypes.STRING(20),
            allowNull: true,
            field: 'actor_role'
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'entity_type'
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'entity_id'
        },
        beforeJson: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'before_json'
        },
        afterJson: {
            type: DataTypes.JSONB,
            allowNull: true,
            field: 'after_json'
        },
        ipAddress: {
            type: DataTypes.INET,
            allowNull: true,
            field: 'ip_address'
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'user_agent'
        },
        requestId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'request_id'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    }, {
        tableName: 'audit_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false, // Audit logs are immutable
        indexes: [
            { fields: ['actor_user_id'] },
            { fields: ['entity_type', 'entity_id'] },
            { fields: ['action'] },
            { fields: ['created_at'] }
        ]
    });

    // Associations
    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, {
            foreignKey: 'actorUserId',
            as: 'actor'
        });
    };

    return AuditLog;
};
