const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const { User } = require('../models');

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 'No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        // Verify token
        const decoded = verifyToken(token);

        // Find user
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        if (!user.isActive) {
            return errorResponse(res, 'Account is deactivated', 403);
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 'Authentication failed: ' + error.message, 401);
    }
};

/**
 * Middleware to check if user has specific role
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Forbidden: Insufficient permissions', 403);
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
