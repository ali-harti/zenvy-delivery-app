/**
 * Order Controller (Fixed)
 * Uses OrderService with centralized status transitions
 */

const OrderService = require('../services/OrderService');
const { successResponse, errorResponse } = require('../utils/response');

class OrderController {
    /**
     * Create order from cart
     * POST /api/v1/orders
     */
    async create(req, res) {
        try {
            const { deliveryAddress, paymentMethod, notes } = req.body;
            const userId = req.user.id;

            const order = await OrderService.createOrderFromCart({
                userId,
                deliveryAddress,
                paymentMethod: paymentMethod || 'cash_on_delivery',
                notes: notes || '',
                req
            });

            return successResponse(res, { order }, 'Order created successfully', 201);
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'ValidationError') {
                return errorResponse(res, error.message, 400);
            }
            console.error('Create order error:', error);
            return errorResponse(res, 'Failed to create order', 500);
        }
    }

    /**
     * Get order history
     * GET /api/v1/orders
     */
    async getHistory(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20, status } = req.query;

            const where = { userId };
            if (status) where.status = status;

            const offset = (page - 1) * limit;

            const { Order, OrderItem, Product, Store } = require('../models');
            const orders = await Order.findAll({
                where,
                include: [
                    {
                        model: OrderItem,
                        as: 'items',
                        include: [{ model: Product, as: 'product' }]
                    },
                    {
                        model: Store,
                        as: 'store',
                        attributes: ['id', 'name', 'imageUrl']
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            const total = await Order.count({ where });

            return successResponse(res, {
                orders,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Get order history error:', error);
            return errorResponse(res, 'Failed to fetch orders', 500);
        }
    }

    /**
     * Get order by ID
     * GET /api/v1/orders/:id
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const role = req.user.role;

            const order = await OrderService.getOrderById(id, userId, role);

            return successResponse(res, { order });
        } catch (error) {
            if (error.name === 'NotFoundError') {
                return errorResponse(res, error.message, 404);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403);
            }
            console.error('Get order error:', error);
            return errorResponse(res, 'Failed to fetch order', 500);
        }
    }

    /**
     * Cancel order (uses centralized transition)
     * PATCH /api/v1/orders/:id/cancel
     */
    async cancel(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;

            const order = await OrderService.cancelOrder({
                orderId: id,
                actorId: req.user.id,
                actorRole: req.user.role,
                reason,
                req
            });

            return successResponse(res, { order }, 'Order cancelled successfully');
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403);
            }
            console.error('Cancel order error:', error);
            return errorResponse(res, 'Failed to cancel order', 500);
        }
    }

    /**
     * Update order status (Admin/Merchant) - uses centralized transition
     * PATCH /api/v1/orders/:id/status
     */
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // INPUT VALIDATION FIX: Validate enum at controller layer (400, not 409)
            const { ORDER_STATUS } = require('../services/stateMachine');
            if (!status || !Object.values(ORDER_STATUS).includes(status)) {
                return errorResponse(res, 'Invalid status value. Must be one of: ' + Object.values(ORDER_STATUS).join(', '), 400, 'INVALID_INPUT');
            }

            const order = await OrderService.transitionStatus({
                orderId: id,
                nextStatus: status,
                actorId: req.user.id,
                actorRole: req.user.role,
                req
            });

            return successResponse(res, { order }, 'Order status updated');
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403);
            }
            console.error('Update order status error:', error);
            return errorResponse(res, 'Failed to update order status', 500);
        }
    }
}

module.exports = new OrderController();
