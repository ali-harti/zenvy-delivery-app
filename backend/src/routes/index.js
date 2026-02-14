const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const storeRoutes = require('./store.routes');
const orderRoutes = require('./order.routes');
const cartRoutes = require('./cart.routes');
const deliveryRoutes = require('./delivery.routes');

router.use('/auth', authRoutes);
router.use('/stores', storeRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/permissions', require('./permissions.routes'));
router.use('/livreur', require('./livreur.routes'));
router.use('/merchant', require('./merchant.routes'));
router.use('/admin', require('./admin.routes'));

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Zenvy API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
