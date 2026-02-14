/**
 * Request Context Middleware
 * Adds unique request ID and context to all requests
 */

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Add request ID to all incoming requests
 */
function requestContext(req, res, next) {
    // Generate unique request ID (use standard req.requestId)
    req.requestId = req.headers['x-request-id'] || uuidv4();

    // Add request ID to response headers
    res.setHeader('X-Request-ID', req.requestId);

    // Attach logger with request ID
    req.logger = logger.withRequestId(req.requestId);

    // Log incoming request
    const start = Date.now();

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.logRequest(req, res, duration);
    });

    next();
}

module.exports = requestContext;
