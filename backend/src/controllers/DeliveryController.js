/**
 * Delivery Controller (Fixed)
 * Uses DeliveryService with proper error handling (403 vs 409)
 */

const DeliveryService = require('../services/DeliveryService');
const { successResponse, errorResponse } = require('../utils/response');

class DeliveryController {
    /**
     * Get available orders for delivery
     * GET /api/v1/delivery/available
     */
    async getAvailableOrders(req, res) {
        try {
            const orders = await DeliveryService.getAvailableDeliveries();
            return successResponse(res, { orders });
        } catch (error) {
            console.error('Get available orders error:', error);
            return errorResponse(res, 'Failed to fetch available orders', 500);
        }
    }

    /**
     * Accept delivery assignment
     * POST /api/v1/delivery/orders/:id/accept
     */
    async acceptOrder(req, res) {
        try {
            const { id } = req.params;
            const courierId = req.user.id;
            const requestId = req.requestId; // Fixed: use req.requestId

            const result = await DeliveryService.acceptDelivery({
                orderId: id,
                courierId,
                requestId,
                req
            });

            if (result.wasAlreadyAccepted) {
                return successResponse(res, {
                    order: result.order,
                    message: 'You have already accepted this delivery'
                });
            }

            return successResponse(res, {
                order: result.order,
                assignment: result.assignment
            }, 'Delivery accepted successfully');
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'NotFoundError') {
                return errorResponse(res, error.message, 404);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403, error.errorCode);
            }
            console.error('Accept order error:', error);
            return errorResponse(res, 'Failed to accept delivery', 500);
        }
    }

    /**
     * Pickup order from store
     * POST /api/v1/delivery/orders/:id/pickup
     */
    async pickupOrder(req, res) {
        try {
            const { id } = req.params;
            const courierId = req.user.id;

            const order = await DeliveryService.pickupOrder({
                orderId: id,
                courierId,
                req
            });

            return successResponse(res, { order }, 'Order picked up');
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403);
            }
            console.error('Pickup order error:', error);
            return errorResponse(res, 'Failed to pickup order', 500);
        }
    }

    /**
     * Complete delivery
     * POST /api/v1/delivery/orders/:id/deliver
     */
    async deliverOrder(req, res) {
        try {
            const { id } = req.params;
            const courierId = req.user.id;

            const order = await DeliveryService.completeDelivery({
                orderId: id,
                courierId,
                req
            });

            return successResponse(res, { order }, 'Delivery completed successfully');
        } catch (error) {
            if (error.name === 'ConflictError') {
                return errorResponse(res, error.message, 409, error.errorCode);
            }
            if (error.name === 'ForbiddenError') {
                return errorResponse(res, error.message, 403);
            }
            console.error('Deliver order error:', error);
            return errorResponse(res, 'Failed to complete delivery', 500);
        }
    }

    /**
     * Get courier's active deliveries
     * GET /api/v1/delivery/active
     */
    async getActiveDeliveries(req, res) {
        try {
            const courierId = req.user.id;
            const orders = await DeliveryService.getActiveDeliveries(courierId);

            return successResponse(res, { orders });
        } catch (error) {
            console.error('Get active deliveries error:', error);
            return errorResponse(res, 'Failed to fetch active deliveries', 500);
        }
    }

    /**
     * Get delivery history
     * GET /api/v1/delivery/history
     */
    async getDeliveryHistory(req, res) {
        try {
            const courierId = req.user.id;
            const { page = 1, limit = 50 } = req.query;
            const offset = (page - 1) * limit;

            const result = await DeliveryService.getDeliveryHistory(courierId, {
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return successResponse(res, {
                orders: result.orders,
                pagination: {
                    total: result.total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(result.total / limit)
                }
            });
        } catch (error) {
            console.error('Get delivery history error:', error);
            return errorResponse(res, 'Failed to fetch history', 500);
        }
    }
}

module.exports = new DeliveryController();
