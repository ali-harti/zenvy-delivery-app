const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/MerchantController');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors: validate } = require('../middleware/validator');
const { body } = require('express-validator');

// Validation rules
const registerValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('businessName').notEmpty(),
    validate
];

// Public
router.post('/register', registerValidation, MerchantController.register);

// Protected (Merchant only)
router.use(authenticate);
router.use(authorize('merchant'));

router.get('/profile', MerchantController.getProfile);
router.post('/store', MerchantController.updateStore);

// Products
router.post('/products', MerchantController.createProduct);
router.get('/products', MerchantController.getProducts);
router.put('/products/:id', MerchantController.updateProduct);
router.delete('/products/:id', MerchantController.deleteProduct);

// Orders
router.get('/orders', MerchantController.getOrders);
router.get('/orders/:id', MerchantController.getOrderDetails);
router.patch('/orders/:id/status', MerchantController.updateOrderStatus);

module.exports = router;
