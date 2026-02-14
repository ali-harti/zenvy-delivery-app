/**
 * Rate Limiter Middleware
 * Prevents abuse and DoS attacks
 * 
 * SCALE-GRADE:
 * - Prefers userId over IP when authenticated (more fair, harder to bypass)
 * - Collision-proof keys with namespace separators (user:, ip:, order:, accept:)
 * - Skips health endpoints using req.originalUrl (future-proof)
 */

const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Auth endpoints (login, register) - strict limits
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        error: 'Too many authentication attempts. Please try again later.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count all requests
    keyGenerator: (req) => {
        // Rate limit by IP + email (if provided)
        const email = req.body?.email || '';
        const ip = ipKeyGenerator(req);
        return `auth:${ip}_${email}`;
    }
});

// General API endpoints - moderate limits
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests. Please slow down.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // SCALE-GRADE: Prefer userId when authenticated (more fair, harder to bypass)
    // BULLETPROOF: Colon separators guarantee namespace separation
    keyGenerator: (req) => {
        if (req.user?.id) {
            return `user:${req.user.id}`;
        }
        return `ip:${ipKeyGenerator(req)}`;
    },
    skip: (req) => {
        // FUTURE-PROOF: Use req.originalUrl (works regardless of mount point)
        // Health routes mounted before this middleware, but this provides defense in depth
        return req.originalUrl.startsWith('/health');
    }
});

// Order creation - prevent rapid order spam
const orderLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 orders per 5 min
    message: {
        success: false,
        error: 'Too many orders created. Please wait before creating another order.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    keyGenerator: (req) => {
        // SCALE-GRADE: Prefer userId (required for orders anyway)
        // BULLETPROOF: Colon separator for namespace isolation
        if (req.user?.id) {
            return `order:${req.user.id}`;
        }
        // Fallback to IP if somehow no auth (shouldn't happen)
        return `order_ip:${ipKeyGenerator(req)}`;
    }
});

// Courier accept - prevent rapid-fire accepts
const courierAcceptLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 accept attempts per minute
    message: {
        success: false,
        error: 'Too many delivery accept attempts. Please slow down.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    },
    keyGenerator: (req) => {
        // SCALE-GRADE: Prefer userId (required for courier actions anyway)
        // BULLETPROOF: Colon separator for namespace isolation
        if (req.user?.id) {
            return `accept:${req.user.id}`;
        }
        return `accept_ip:${ipKeyGenerator(req)}`;
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
    orderLimiter,
    courierAcceptLimiter
};
