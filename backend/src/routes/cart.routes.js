const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, CartController.getCart);
router.post('/items', authenticate, CartController.addItem);
router.patch('/items/:id', authenticate, CartController.updateItem);
router.delete('/items/:id', authenticate, CartController.removeItem);
router.delete('/', authenticate, CartController.clearCart);

module.exports = router;
