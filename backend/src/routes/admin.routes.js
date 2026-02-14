const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require Admin role
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/stats', AdminController.getDashboardStats);

// Merchant Management
router.get('/merchants', AdminController.getMerchants);
router.patch('/merchants/:id/status', AdminController.updateMerchantStatus);

// User Management
router.get('/users', AdminController.getUsers);

module.exports = router;
