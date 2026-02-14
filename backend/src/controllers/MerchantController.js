const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

class MerchantController {
    // Register a new Merchant (User + Merchant Profile)
    static async register(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const {
                email,
                password,
                firstName,
                lastName,
                phone,
                businessName,
                taxId
            } = req.body;

            // 1. Check if user exists
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                await t.rollback();
                return res.status(400).json({ error: 'User already exists' });
            }

            // 2. Create User
            const passwordHash = await db.User.hashPassword(password);
            const user = await db.User.create({
                email,
                passwordHash,
                firstName,
                lastName,
                phone,
                role: 'merchant'
            }, { transaction: t });

            // 3. Create Merchant Profile
            const merchant = await db.Merchant.create({
                userId: user.id,
                businessName,
                taxId,
                status: 'pending' // Default status
            }, { transaction: t });

            // 4. Create Merchant Stats
            await db.MerchantStats.create({
                merchantId: merchant.id
            }, { transaction: t });

            await t.commit();

            // 5. Generate Token
            const token = jwt.sign(
                { id: user.id, role: user.role, merchantId: merchant.id },
                config.jwt.secret,
                { expiresIn: config.jwt.expiration }
            );

            res.status(201).json({
                message: 'Merchant registered successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                merchant: {
                    id: merchant.id,
                    businessName: merchant.businessName,
                    status: merchant.status
                }
            });

        } catch (error) {
            await t.rollback();
            console.error('Merchant Register Error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }

    // Get Merchant Profile
    static async getProfile(req, res) {
        try {
            const merchant = await db.Merchant.findOne({
                where: { userId: req.user.id },
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: { exclude: ['passwordHash'] }
                    },
                    {
                        model: db.Store,
                        as: 'store'
                    },
                    {
                        model: db.MerchantStats,
                        as: 'stats'
                    }
                ]
            });

            if (!merchant) {
                return res.status(404).json({ error: 'Merchant profile not found' });
            }

            res.json(merchant);
        } catch (error) {
            console.error('Get Profile Error:', error);
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    }

    // Update Store Settings (Create or Update)
    static async updateStore(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const userId = req.user.id;
            const {
                name,
                description,
                category,
                address,
                phone,
                deliveryTimeMin,
                deliveryFee,
                minimumOrder,
                openingTime,
                closingTime,
                latitude,
                longitude,
                isOpen
            } = req.body;

            // 1. Find or Create Store
            let store = await db.Store.findOne({ where: { merchantId: userId } });

            if (store) {
                // Update existing
                await store.update({
                    name,
                    description,
                    category,
                    address,
                    phone,
                    deliveryTimeMin,
                    deliveryFee,
                    minimumOrder,
                    openingTime,
                    closingTime,
                    latitude,
                    longitude,
                    isOpen
                }, { transaction: t });
            } else {
                // Create new
                store = await db.Store.create({
                    merchantId: userId,
                    name,
                    description,
                    category: category || 'shops', // Default
                    address,
                    phone,
                    deliveryTimeMin,
                    deliveryFee,
                    minimumOrder,
                    openingTime,
                    closingTime,
                    latitude,
                    longitude,
                    isActive: true, // Default
                    isOpen: true
                }, { transaction: t });

                // Link to Merchant Profile
                await db.Merchant.update(
                    { storeId: store.id },
                    { where: { userId }, transaction: t }
                );
            }

            await t.commit();
            res.json({ message: 'Store updated successfully', store });

        } catch (error) {
            await t.rollback();
            console.error('Update Store Error:', error);
            res.status(500).json({
                error: 'Failed to update store',
                details: error.message
            });
        }
    }


    // --- Product Management ---

    // Create Product
    static async createProduct(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const userId = req.user.id;
            // Get Merchant's Store
            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) {
                await t.rollback();
                return res.status(400).json({ error: 'You must create a store first' });
            }

            const product = await db.Product.create({
                storeId: store.id,
                ...req.body
            }, { transaction: t });

            await t.commit();
            res.status(201).json(product);
        } catch (error) {
            await t.rollback();
            console.error('Create Product Error:', error);
            res.status(500).json({ error: 'Failed to create product' });
        }
    }

    // Get All Products for Merchant
    static async getProducts(req, res) {
        try {
            const userId = req.user.id;
            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) {
                return res.json([]); // No store, no products
            }

            const products = await db.Product.findAll({
                where: { storeId: store.id },
                order: [['createdAt', 'DESC']]
            });
            res.json(products);
        } catch (error) {
            console.error('Get Products Error:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // Update Product
    static async updateProduct(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const userId = req.user.id;
            const { id } = req.params;

            // Verify ownership
            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) return res.status(403).json({ error: 'Unauthorized' });

            const product = await db.Product.findOne({
                where: { id, storeId: store.id }
            });

            if (!product) {
                await t.rollback();
                return res.status(404).json({ error: 'Product not found' });
            }

            await product.update(req.body, { transaction: t });
            await t.commit();
            res.json(product);
        } catch (error) {
            await t.rollback();
            console.error('Update Product Error:', error);
            res.status(500).json({ error: 'Failed to update product' });
        }
    }

    // Delete Product
    static async deleteProduct(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) return res.status(403).json({ error: 'Unauthorized' });

            const product = await db.Product.findOne({
                where: { id, storeId: store.id }
            });

            if (!product) return res.status(404).json({ error: 'Product not found' });

            await product.destroy();
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Delete Product Error:', error);
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }


    // --- Order Management ---

    // Get Orders for Merchant's Store
    static async getOrders(req, res) {
        try {
            const userId = req.user.id;
            const { status } = req.query;

            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) return res.json([]);

            const whereClause = { storeId: store.id };
            if (status) {
                whereClause.status = status;
            }

            const orders = await db.Order.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.User,
                        as: 'customer',
                        attributes: ['id', 'firstName', 'lastName', 'phone']
                    },
                    {
                        model: db.OrderItem,
                        as: 'items',
                        include: [{ model: db.Product, as: 'product', attributes: ['name'] }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(orders);
        } catch (error) {
            console.error('Get Orders Error:', error);
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    }

    // Get Order Details
    static async getOrderDetails(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) return res.status(403).json({ error: 'Unauthorized' });

            const order = await db.Order.findOne({
                where: { id, storeId: store.id },
                include: [
                    {
                        model: db.User,
                        as: 'customer',
                        attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
                    },
                    {
                        model: db.OrderItem,
                        as: 'items',
                        include: [{ model: db.Product, as: 'product', attributes: ['name', 'price'] }]
                    }
                ]
            });

            if (!order) return res.status(404).json({ error: 'Order not found' });

            res.json(order);
        } catch (error) {
            console.error('Get Order Details Error:', error);
            res.status(500).json({ error: 'Failed to fetch order details' });
        }
    }

    // Update Order Status
    static async updateOrderStatus(req, res) {
        const t = await db.sequelize.transaction();
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['confirmed', 'preparing', 'ready', 'cancelled', 'in_delivery', 'delivered'];
            if (!validStatuses.includes(status)) {
                await t.rollback();
                return res.status(400).json({ error: 'Invalid status update by merchant' });
            }

            const store = await db.Store.findOne({ where: { merchantId: userId } });
            if (!store) {
                await t.rollback();
                return res.status(403).json({ error: 'Unauthorized' });
            }

            const order = await db.Order.findOne({
                where: { id, storeId: store.id }
            });

            if (!order) {
                await t.rollback();
                return res.status(404).json({ error: 'Order not found' });
            }

            // Simple state transition check
            if (order.status === 'cancelled' || order.status === 'delivered') {
                await t.rollback();
                return res.status(400).json({ error: 'Cannot update completed order' });
            }

            await order.update({ status }, { transaction: t });
            await t.commit();

            // Send real-time notification to customer
            const NotificationService = require('../services/NotificationService');
            await NotificationService.send(
                order.userId,
                `Order ${status}`,
                `Your order #${order.id} is now ${status}`,
                'order_update',
                { orderId: order.id, status }
            );

            res.json(order);

        } catch (error) {
            await t.rollback();
            console.error('Update Order Status Error:', error);
            res.status(500).json({ error: 'Failed to update order status' });
        }
    }
}

module.exports = MerchantController;
