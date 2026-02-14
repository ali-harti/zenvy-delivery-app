const db = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

class AdminController {

    // Get Dashboard Stats
    static async getDashboardStats(req, res) {
        try {
            const userCount = await db.User.count();
            const merchantCount = await db.Merchant.count();
            const orderCount = await db.Order.count();
            const totalRevenue = await db.Order.sum('totalAmount', { where: { status: 'delivered' } }) || 0;

            const pendingMerchants = await db.Merchant.count({ where: { status: 'pending' } });

            return successResponse(res, {
                users: userCount,
                merchants: merchantCount,
                orders: orderCount,
                revenue: totalRevenue,
                pendingMerchants
            });
        } catch (error) {
            console.error('Admin Stats Error:', error);
            return errorResponse(res, 'Failed to fetch stats', 500);
        }
    }

    // Get All Merchants (with filters)
    static async getMerchants(req, res) {
        try {
            const { status } = req.query;
            const whereClause = {};
            if (status) whereClause.status = status;

            const merchants = await db.Merchant.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'email', 'phone']
                    },
                    {
                        model: db.Store,
                        as: 'store',
                        attributes: ['name', 'address']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            return successResponse(res, merchants);
        } catch (error) {
            console.error('Get Merchants Error:', error);
            return errorResponse(res, 'Failed to fetch merchants', 500);
        }
    }

    // Approve/Reject Merchant
    static async updateMerchantStatus(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const { id } = req.params;
            const { status } = req.body; // 'approved', 'rejected'

            if (!['approved', 'rejected', 'pending'].includes(status)) {
                await t.rollback();
                return errorResponse(res, 'Invalid status', 400);
            }

            const merchant = await db.Merchant.findByPk(id);
            if (!merchant) {
                await t.rollback();
                return errorResponse(res, 'Merchant not found', 404);
            }

            await merchant.update({ status }, { transaction: t });

            // If approved, ensure Store is active? 
            // Logic: Merchant status controls login, Store status controls visibility.
            // For now, just update merchant status.

            await t.commit();
            return successResponse(res, merchant, `Merchant ${status} successfully`);

        } catch (error) {
            await t.rollback();
            console.error('Update Merchant Status Error:', error);
            return errorResponse(res, 'Failed to update merchant status', 500);
        }
    }

    // Get All Users
    static async getUsers(req, res) {
        try {
            const users = await db.User.findAll({
                attributes: { exclude: ['passwordHash'] },
                order: [['createdAt', 'DESC']]
            });
            return successResponse(res, users);
        } catch (error) {
            console.error('Get Users Error:', error);
            return errorResponse(res, 'Failed to fetch users', 500);
        }
    }
}

module.exports = AdminController;
