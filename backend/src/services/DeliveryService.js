/**
 * Delivery Service
 * Handles courier operations with race-condition prevention
 * 
 * CRITICAL FIXES:
 * 1. Uses OrderService.transitionStatus() for all status changes
 * 2. transaction.afterCommit() for events
 * 3. Ownership checks enforced
 * 4. Proper error handling (403 vs 409)
 */

const { sequelize, Order, Store, User } = require('../models');
const OrderService = require('./OrderService');
const { ORDER_STATUS } = require('./stateMachine');
const AuditService = require('./AuditService');
const { ConflictError, NotFoundError, ForbiddenError } = require('../utils/errors');
const logger = require('../utils/logger');

class DeliveryService {
    /**
     * Accept delivery assignment (RACE-PROOF)
     * Ensures only one courier can accept an order using row-level locking
     * and database unique constraint on courier_assignments.order_id
     * 
     * @param {Object} params
     * @param {number} params.orderId
     * @param {number} params.courierId
     * @param {string} [params.requestId] - Idempotency key (optional)
     * @param {Object} [params.req] - Express request
     * 
     * @returns {Promise<Object>} { order, assignment, wasAlreadyAccepted }
     * 
     * @throws {NotFoundError} If order not found (404)
     * @throws {ConflictError} If order not in 'ready' status or already accepted (409)
     */
    async acceptDelivery({ orderId, courierId, requestId = null, req }) {
        const transaction = await sequelize.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });

        try {
            logger.info('Courier attempting to accept delivery', { orderId, courierId, requestId });

            // 1. Lock order row for update
            const order = await Order.findByPk(orderId, {
                lock: transaction.LOCK.UPDATE,
                transaction,
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address']
                }]
            });

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            // 2. Check if courier already accepted this order (idempotency)
            if (order.status === ORDER_STATUS.DRIVER_ASSIGNED && order.deliveryPersonId === courierId) {
                logger.info('Courier already accepted this order (idempotent)', { orderId, courierId });

                await transaction.commit();

                return {
                    order,
                    assignment: null,
                    wasAlreadyAccepted: true
                };
            }

            // 3. Validate order is ready for pickup
            if (order.status !== ORDER_STATUS.READY) {
                throw new ConflictError(
                    'ORDER_NOT_READY',
                    `Order is not available for pickup. Current status: ${order.status}`
                );
            }

            // 4. Use centralized transitionStatus (enforces state machine)
            // BLOCKER #2 FIX: Capture updated order returned from transitionStatus
            const updatedOrder = await OrderService.transitionStatus({
                orderId: order.id,
                nextStatus: ORDER_STATUS.DRIVER_ASSIGNED,
                actorId: courierId,
                actorRole: 'courier',
                transaction,
                req,
                additionalUpdates: { deliveryPersonId: courierId }
            });

            // 5. Create courier assignment record (if table exists)
            let assignment = null;
            try {
                const CourierAssignment = sequelize.model('CourierAssignment');

                if (CourierAssignment) {
                    assignment = await CourierAssignment.create({
                        orderId: order.id,
                        courierId: courierId,
                        assignedAt: new Date(),
                        acceptedAt: new Date(),
                        acceptedBy: courierId,
                        acceptRequestId: requestId,
                        earnings: 8.50
                    }, { transaction });
                }
            } catch (err) {
                // Check if error is unique constraint violation
                if (err.name === 'SequelizeUniqueConstraintError' || err.code === '23505') {
                    throw new ConflictError(
                        'ORDER_ALREADY_ACCEPTED',
                        'This order has already been accepted by another courier'
                    );
                }
                // If CourierAssignment doesn't exist, we rely on order.deliveryPersonId
                if (err.name !== 'SequelizeEagerLoadingError') {
                    throw err;
                }
            }

            // 6. Event emitted via transaction.afterCommit in OrderService.transitionStatus

            // 7. Commit transaction
            await transaction.commit();

            logger.info('Delivery accepted successfully', {
                orderId,
                courierId,
                assignmentId: assignment?.id
            });

            // 8. Audit log (non-blocking)
            setImmediate(() => {
                AuditService.logAudit({
                    actorId: courierId,
                    actorRole: 'courier',
                    action: 'delivery_accepted',
                    entityType: 'order',
                    entityId: updatedOrder.id,
                    before: { status: ORDER_STATUS.READY, deliveryPersonId: null },
                    after: { status: ORDER_STATUS.DRIVER_ASSIGNED, deliveryPersonId: courierId },
                    req
                });
            });

            // BLOCKER #2 FIX: Return the updated order from transitionStatus, not stale reload
            return {
                order: updatedOrder,
                assignment,
                wasAlreadyAccepted: false
            };

        } catch (error) {
            await transaction.rollback();

            logger.error('Failed to accept delivery', {
                error: error.message,
                orderId,
                courierId
            });

            throw error;
        }
    }

    /**
     * Pickup order from store (uses centralized transitionStatus)
     * SILENT KILLER #4 FIX: Ownership check under lock in same transaction
     */
    async pickupOrder({ orderId, courierId, req }) {
        const transaction = await sequelize.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });

        try {
            // SILENT KILLER #4 FIX: Lock order FIRST, then check ownership
            const order = await Order.findByPk(orderId, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            // Check ownership under lock (prevents TOCTOU)
            if (order.deliveryPersonId !== courierId) {
                throw new ForbiddenError('This order is not assigned to you');
            }

            // Use centralized transition (pass the transaction)
            const updatedOrder = await OrderService.transitionStatus({
                orderId,
                nextStatus: ORDER_STATUS.IN_DELIVERY,
                actorId: courierId,
                actorRole: 'courier',
                transaction,
                req,
                additionalUpdates: { pickedUpAt: new Date() }
            });

            // Update courier assignment pickup time (if exists)
            try {
                const CourierAssignment = sequelize.model('CourierAssignment');
                if (CourierAssignment) {
                    await CourierAssignment.update(
                        { pickedUpAt: new Date() },
                        { where: { orderId }, transaction }
                    );
                }
            } catch (err) {
                // Non-critical, continue
            }

            await transaction.commit();

            logger.info('Order picked up', { orderId, courierId });

            return updatedOrder;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Complete delivery (uses centralized transitionStatus)
     * SILENT KILLER #3 FIX: Check payment on locked order, not stale instance
     */
    async completeDelivery({ orderId, courierId, req }) {
        const transaction = await sequelize.transaction({
            isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        });

        try {
            // Lock order FIRST to check ownership
            const order = await Order.findByPk(orderId, {
                lock: transaction.LOCK.UPDATE,
                transaction
            });

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            // Check ownership under lock
            if (order.deliveryPersonId !== courierId) {
                throw new ForbiddenError('This order is not assigned to you');
            }

            // Use centralized transition (returns updated order)
            const updatedOrder = await OrderService.transitionStatus({
                orderId,
                nextStatus: ORDER_STATUS.DELIVERED,
                actorId: courierId,
                actorRole: 'courier',
                transaction,
                req
            });

            // Update courier assignment completion time
            try {
                const CourierAssignment = sequelize.model('CourierAssignment');
                if (CourierAssignment) {
                    await CourierAssignment.update(
                        { completedAt: new Date() },
                        { where: { orderId }, transaction }
                    );
                }
            } catch (err) {
                // Non-critical
            }

            // SILENT KILLER #3 FIX: Use updatedOrder (from locked state) for payment check
            if (updatedOrder.paymentMethod === 'cash_on_delivery') {
                const Transaction = sequelize.model('Transaction');
                if (Transaction) {
                    await Transaction.update(
                        { status: 'completed' },
                        { where: { orderId }, transaction }
                    );
                }
            }

            await transaction.commit();

            logger.info('Delivery completed', { orderId, courierId });

            return updatedOrder;

        } catch (error) {
            await transaction.rollback();
            logger.error('Failed to complete delivery', { error: error.message, orderId, courierId });
            throw error;
        }
    }

    /**
     * Get available deliveries for courier
     */
    async getAvailableDeliveries({ latitude, longitude, radius = 10 } = {}) {
        const orders = await Order.findAll({
            where: { status: ORDER_STATUS.READY },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address', 'latitude', 'longitude', 'phone']
                },
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'firstName', 'lastName', 'phone']
                }
            ],
            order: [['createdAt', 'ASC']],
            limit: 20
        });

        return orders;
    }

    /**
     * Get courier's active deliveries (with ownership check)
     */
    async getActiveDeliveries(courierId) {
        const orders = await Order.findAll({
            where: {
                deliveryPersonId: courierId,
                status: [ORDER_STATUS.DRIVER_ASSIGNED, ORDER_STATUS.IN_DELIVERY]
            },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address', 'phone']
                },
                {
                    model: User,
                    as: 'customer',
                    attributes: ['id', 'firstName', 'lastName', 'phone']
                }
            ],
            order: [['updatedAt', 'DESC']]
        });

        return orders;
    }

    /**
     * Get courier's delivery history (with ownership check)
     */
    async getDeliveryHistory(courierId, { limit = 50, offset = 0 } = {}) {
        const orders = await Order.findAll({
            where: {
                deliveryPersonId: courierId,
                status: ORDER_STATUS.DELIVERED
            },
            include: [
                {
                    model: Store,
                    as: 'store',
                    attributes: ['id', 'name', 'address']
                }
            ],
            order: [['deliveredAt', 'DESC']],
            limit,
            offset
        });

        const total = await Order.count({
            where: {
                deliveryPersonId: courierId,
                status: ORDER_STATUS.DELIVERED
            }
        });

        return { orders, total, limit, offset };
    }
}

module.exports = new DeliveryService();
