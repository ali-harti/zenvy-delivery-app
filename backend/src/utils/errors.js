/**
 * Custom Error Classes
 * Standardized error types for consistent API responses
 * 
 * HTTP Status Code Rules:
 * - 400 Bad Request: Invalid input, missing fields, invalid enum values
 * - 401 Unauthorized: Missing or invalid authentication token
 * - 403 Forbidden: User role not allowed for this endpoint/action
 * - 404 Not Found: Resource doesn't exist
 * - 409 Conflict: Valid role, but state machine conflict or business rule violation
 * - 429 Too Many Requests: Rate limit exceeded
 * - 500 Internal Server Error: Unexpected server error
 */

class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

/**
 * ConflictError - 409
 * Use for: state machine violations, race conditions, business rule conflicts
 * Example: Order already accepted, insufficient stock, invalid state transition
 */
class ConflictError extends AppError {
    constructor(code, message) {
        super(message, 409, code);
    }
}

/**
 * ForbiddenError - 403
 * Use for: role-based access violations, ownership checks
 * Example: Customer trying to confirm order, courier accessing another's delivery
 */
class ForbiddenError extends AppError {
    constructor(message = 'You do not have permission to perform this action') {
        super(message, 403, 'FORBIDDEN');
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    ConflictError,
    ForbiddenError,
    UnauthorizedError,
    RateLimitError
};
