/**
 * Structured Logger with Request ID Correlation
 * Using Winston for production-grade logging
 */

const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const requestId = meta.requestId ? `[${meta.requestId}]` : '';
        const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
        return `${timestamp} ${level} ${requestId}: ${message} ${metaStr}`;
    })
);

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'zenvy-api' },
    transports: [
        // File transport for errors
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),

        // File transport for all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../../logs/combined.log'),
            maxsize: 5242880,
            maxFiles: 5
        })
    ]
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
} else {
    // In production, still log to console but in JSON format
    logger.add(new winston.transports.Console({
        format: logFormat
    }));
}

/**
 * Create child logger with request context
 * @param {string} requestId - Request correlation ID
 * @returns {winston.Logger}
 */
logger.withRequestId = function (requestId) {
    return logger.child({ requestId });
};

/**
 * Log HTTP request
 */
logger.logRequest = function (req, res, duration) {
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger.log(level, 'HTTP Request', {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        ip,
        requestId: req.id,
        userId: req.user?.id
    });
};

module.exports = logger;
