/**
 * Audit Service
 * Handles immutable audit logging for all sensitive operations
 * 
 * IMPORTANT: Log only relevant fields to avoid bloating audit_logs table
 * - For status changes: log only { status: value }
 * - For field updates: log only changed fields
 * - Never log entire nested objects with relations
 */

const { AuditLog } = require('../models');
const logger = require('../utils/logger');

class AuditService {
    /**
     * Log an audit event
     * 
     * @param {Object} params
     * @param {number} params.actorId - User ID performing action
     * @param {string} params.actorRole - Role of actor (customer/merchant/courier/admin)
     * @param {string} params.action - Action performed (e.g., 'order_status_changed')
     * @param {string} params.entityType - Entity type (order/merchant/product/etc)
     * @param {number} params.entityId - ID of entity affected
     * @param {Object} [params.before] - MINIMAL state before change (omit for create)
     * @param {Object} [params.after] - MINIMAL state after change (omit for delete)
     * @param {Object} [params.req] - Express request object (for IP/UA)
     * @param {Object} [params.metadata] - Additional context (SMALL objects only)
     * 
     * @returns {Promise<Object>} Created audit log entry
     */
    async logAudit({
        actorId,
        actorRole,
        action,
        entityType,
        entityId,
        before = null,
        after = null,
        req = null,
        metadata = null
    }) {
        try {
            const auditData = {
                actorUserId: actorId,
                actorRole,
                action,
                entityType,
                entityId,
                beforeJson: before,
                afterJson: after,
                metadata
            };

            // Extract request context if provided (SCALE-GRADE: capture real IP + chain)
            if (req) {
                // req.ip is the real client IP (thanks to trust proxy)
                auditData.ipAddress = req.ip;
                // req.ips is the full chain of IPs from X-Forwarded-For (for debugging)
                auditData.ipChain = req.ips && req.ips.length > 0 ? req.ips.join(',') : null;
                auditData.userAgent = req.headers['user-agent'];
                auditData.requestId = req.requestId; // Fixed: use req.requestId
            }

            const auditLog = await AuditLog.create(auditData);

            logger.info('Audit log created', {
                auditId: auditLog.id,
                action,
                actorId,
                entityType,
                entityId
            });

            return auditLog;
        } catch (error) {
            // Audit logging should NEVER crash the main operation
            // Log error but don't throw
            logger.error('Failed to create audit log', {
                error: error.message,
                action,
                entityType,
                entityId
            });
            return null;
        }
    }

    /**
     * Log order status change (MINIMAL payload)
     * @param {Object} order - Order instance
     * @param {string} oldStatus - Previous status
     * @param {string} newStatus - New status
     * @param {number} actorId - User performing change
     * @param {string} actorRole - Role of actor
     * @param {Object} req - Express request
     */
    async logOrderStatusChange(order, oldStatus, newStatus, actorId, actorRole, req) {
        return this.logAudit({
            actorId,
            actorRole,
            action: 'order_status_changed',
            entityType: 'order',
            entityId: order.id,
            before: { status: oldStatus }, // Only log changed field
            after: { status: newStatus },
            req,
            metadata: {
                orderId: order.id,
                storeId: order.storeId,
                customerId: order.userId,
                totalAmount: parseFloat(order.totalAmount) // Convert decimal to number
            }
        });
    }

    /**
     * Log merchant approval/rejection
     */
    async logMerchantApproval(merchantId, newStatus, actorId, req) {
        return this.logAudit({
            actorId,
            actorRole: 'admin',
            action: `merchant_${newStatus}`,
            entityType: 'merchant',
            entityId: merchantId,
            after: { status: newStatus },
            req
        });
    }

    /**
     * Log product stock change
     */
    async logStockChange(productId, oldStock, newStock, actorId, actorRole, reason, req) {
        return this.logAudit({
            actorId,
            actorRole,
            action: 'product_stock_changed',
            entityType: 'product',
            entityId: productId,
            before: { stock: oldStock },
            after: { stock: newStock },
            req,
            metadata: { reason }
        });
    }

    /**
     * Log platform settings change
     */
    async logSettingChange(key, oldValue, newValue, actorId, req) {
        return this.logAudit({
            actorId,
            actorRole: 'admin',
            action: 'platform_setting_changed',
            entityType: 'platform_setting',
            entityId: 0, // Settings don't have numeric IDs
            before: { key, value: oldValue },
            after: { key, value: newValue },
            req
        });
    }

    /**
     * Log transaction status change (refunds, completions)
     */
    async logTransactionChange(transactionId, oldStatus, newStatus, actorId, req, metadata = {}) {
        return this.logAudit({
            actorId,
            actorRole: 'admin',
            action: 'transaction_status_changed',
            entityType: 'transaction',
            entityId: transactionId,
            before: { status: oldStatus },
            after: { status: newStatus },
            req,
            metadata
        });
    }

    /**
     * Get audit logs for an entity
     * @param {string} entityType
     * @param {number} entityId
     * @param {Object} options - Pagination options
     */
    async getAuditLogs(entityType, entityId, options = {}) {
        const { limit = 50, offset = 0, orderBy = 'createdAt', order = 'DESC' } = options;

        try {
            const logs = await AuditLog.findAll({
                where: { entityType, entityId },
                order: [[orderBy, order]],
                limit,
                offset
            });

            const total = await AuditLog.count({
                where: { entityType, entityId }
            });

            return {
                logs,
                total,
                limit,
                offset,
                hasMore: offset + limit < total
            };
        } catch (error) {
            logger.error('Failed to retrieve audit logs', {
                error: error.message,
                entityType,
                entityId
            });
            throw error;
        }
    }

    /**
     * Get audit logs by actor
     */
    async getAuditLogsByActor(actorId, options = {}) {
        const { limit = 50, offset = 0 } = options;

        const logs = await AuditLog.findAll({
            where: { actorUserId: actorId },
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        return logs;
    }
}

module.exports = new AuditService();
