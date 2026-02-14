const { Store, Product } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

class StoreController {
    /**
     * Get all stores with optional filters
     * GET /api/stores?category=food&search=marjane
     */
    async getAll(req, res) {
        try {
            const { category, search, isOpen } = req.query;

            // Build where clause
            const where = {};

            if (category) {
                where.category = category;
            }

            if (search) {
                where.name = {
                    [Op.iLike]: `%${search}%`
                };
            }

            if (isOpen !== undefined) {
                where.isOpen = isOpen === 'true';
            }

            const stores = await Store.findAll({
                where,
                attributes: [
                    'id', 'name', 'category', 'imageUrl', 'address',
                    'latitude', 'longitude', 'isOpen', 'rating',
                    'deliveryFee', 'minimumOrder', 'openingTime', 'closingTime'
                ],
                order: [['rating', 'DESC']]
            });

            return successResponse(res, { stores, count: stores.length });
        } catch (error) {
            console.error('Get stores error:', error);
            return errorResponse(res, 'Failed to fetch stores', 500);
        }
    }

    /**
     * Get store by ID
     * GET /api/stores/:id
     */
    async getById(req, res) {
        try {
            const { id } = req.params;

            const store = await Store.findByPk(id, {
                include: [
                    {
                        model: Product,
                        as: 'products',
                        where: { isAvailable: true },
                        required: false,
                        attributes: [
                            'id', 'name', 'description', 'price',
                            'imageUrl', 'category', 'isAvailable', 'stock'
                        ]
                    }
                ]
            });

            if (!store) {
                return errorResponse(res, 'Store not found', 404);
            }

            return successResponse(res, { store });
        } catch (error) {
            console.error('Get store error:', error);
            return errorResponse(res, 'Failed to fetch store', 500);
        }
    }

    /**
     * Get store products
     * GET /api/stores/:id/products
     */
    async getProducts(req, res) {
        try {
            const { id } = req.params;
            const { category, search } = req.query;

            // Check if store exists
            const store = await Store.findByPk(id);
            if (!store) {
                return errorResponse(res, 'Store not found', 404);
            }

            // Build where clause
            const where = {
                storeId: id,
                isAvailable: true
            };

            if (category) {
                where.category = category;
            }

            if (search) {
                where.name = {
                    [Op.iLike]: `%${search}%`
                };
            }

            const products = await Product.findAll({
                where,
                attributes: [
                    'id', 'name', 'description', 'price',
                    'imageUrl', 'category', 'isAvailable', 'stock'
                ],
                order: [['name', 'ASC']]
            });

            return successResponse(res, { products, count: products.length });
        } catch (error) {
            console.error('Get products error:', error);
            return errorResponse(res, 'Failed to fetch products', 500);
        }
    }
}

module.exports = new StoreController();
