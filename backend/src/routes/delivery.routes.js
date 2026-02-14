const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/DeliveryController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and delivery role
router.use(authenticate);
router.use(authorize('courier', 'admin'));

router.get('/available', deliveryController.getAvailableOrders);
router.post('/orders/:id/accept', deliveryController.acceptOrder);
router.post('/orders/:id/pickup', deliveryController.pickupOrder);
router.post('/orders/:id/deliver', deliveryController.deliverOrder);
router.get('/history', deliveryController.getDeliveryHistory);

module.exports = router;
