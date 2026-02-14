const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/StoreController');
const { storeIdValidation } = require('../middleware/validator');

router.get('/', StoreController.getAll);
router.get('/:id', storeIdValidation, StoreController.getById);
router.get('/:id/products', storeIdValidation, StoreController.getProducts);

module.exports = router;
