const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authenticate, authorize } = require('../middleware/auth');
const { createOrderValidation } = require('../middleware/validator');

// Customer routes
router.post('/', authenticate, createOrderValidation, OrderController.create);
router.get('/', authenticate, OrderController.getHistory);
router.get('/:id', authenticate, OrderController.getById);
router.patch('/:id/cancel', authenticate, OrderController.cancel);

// Admin/Merchant routes
router.patch('/:id/status', authenticate, authorize('admin', 'merchant'), OrderController.updateStatus);

module.exports = router;
