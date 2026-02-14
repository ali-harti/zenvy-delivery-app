const { body, param, query, validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/response');

/**
 * Middleware to handle validation results
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));

        return validationErrorResponse(res, formattedErrors);
    }

    next();
};

/**
 * Validation rules for user registration
 */
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

/**
 * Validation rules for user login
 */
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

/**
 * Validation rules for creating order
 */
const createOrderValidation = [
    body('storeId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid store ID is required'),
    body('items')
        .optional()
        .isArray({ min: 1 })
        .withMessage('At least one item is required'),
    body('items.*.productId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    body('items.*.quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('deliveryAddress')
        .trim()
        .notEmpty()
        .withMessage('Delivery address is required'),
    body('notes')
        .optional()
        .trim(),
    handleValidationErrors
];

/**
 * Validation for product ID parameter
 */
const productIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    handleValidationErrors
];

/**
 * Validation for store ID parameter
 */
const storeIdValidation = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Valid store ID is required'),
    handleValidationErrors
];

module.exports = {
    registerValidation,
    loginValidation,
    createOrderValidation,
    productIdValidation,
    storeIdValidation,
    handleValidationErrors
};
