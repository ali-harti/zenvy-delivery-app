/**
 * State Machine for Order Status Transitions
 * Enforces valid state transitions with role-based access control
 */

const { ConflictError, ForbiddenError } = require('../utils/errors');

// Order status enum
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    DRIVER_ASSIGNED: 'driver_assigned',
    IN_DELIVERY: 'in_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// User roles
const ROLE = {
    CUSTOMER: 'customer',
    MERCHANT: 'merchant',
    COURIER: 'courier',
    ADMIN: 'admin'
};

/**
 * Transition map: current_status => { next_status => [ allowed_roles ] }
 * If next_status not in map, transition is FORBIDDEN
 */
const ORDER_TRANSITIONS = {
    [ORDER_STATUS.PENDING]: {
        [ORDER_STATUS.CONFIRMED]: [ROLE.MERCHANT, ROLE.ADMIN],
        [ORDER_STATUS.CANCELLED]: [ROLE.CUSTOMER, ROLE.MERCHANT, ROLE.ADMIN]
    },

    [ORDER_STATUS.CONFIRMED]: {
        [ORDER_STATUS.PREPARING]: [ROLE.MERCHANT, ROLE.ADMIN],
        [ORDER_STATUS.CANCELLED]: [ROLE.CUSTOMER, ROLE.MERCHANT, ROLE.ADMIN]
    },

    [ORDER_STATUS.PREPARING]: {
        [ORDER_STATUS.READY]: [ROLE.MERCHANT, ROLE.ADMIN],
        [ORDER_STATUS.CANCELLED]: [ROLE.MERCHANT, ROLE.ADMIN] // Customer cannot cancel once preparing
    },

    [ORDER_STATUS.READY]: {
        [ORDER_STATUS.DRIVER_ASSIGNED]: [ROLE.COURIER, ROLE.ADMIN], // Courier accepts
        [ORDER_STATUS.CANCELLED]: [ROLE.MERCHANT, ROLE.ADMIN]
    },

    [ORDER_STATUS.DRIVER_ASSIGNED]: {
        [ORDER_STATUS.IN_DELIVERY]: [ROLE.COURIER, ROLE.ADMIN], // Courier picks up
        [ORDER_STATUS.CANCELLED]: [ROLE.ADMIN] // Only admin can cancel at this stage
    },

    [ORDER_STATUS.IN_DELIVERY]: {
        [ORDER_STATUS.DELIVERED]: [ROLE.COURIER, ROLE.ADMIN], // Courier completes
        [ORDER_STATUS.CANCELLED]: [ROLE.ADMIN] // Rare: admin intervention
    },

    [ORDER_STATUS.DELIVERED]: {
        // Terminal state - no transitions except possible refund by admin
    },

    [ORDER_STATUS.CANCELLED]: {
        // Terminal state
    }
};

/**
 * Validate if a status transition is allowed
 * 
 * @param {string} currentStatus - Current order status
 * @param {string} nextStatus - Desired next status
 * @param {string} actorRole - Role of the user attempting transition
 * 
 * @throws {ForbiddenError} If role is not permitted (403)
 * @throws {ConflictError} If transition is invalid from current state (409)
 * 
 * @example
 * validateTransition('pending', 'confirmed', 'merchant') // OK
 * validateTransition('pending', 'confirmed', 'customer') // throws ForbiddenError (403)
 * validateTransition('pending', 'delivered', 'admin') // throws ConflictError (409)
 */
function validateTransition(currentStatus, nextStatus, actorRole) {
    // Same status is always allowed (idempotent)
    if (currentStatus === nextStatus) {
        return;
    }

    // Check if current status exists in transition map
    if (!ORDER_TRANSITIONS[currentStatus]) {
        throw new ConflictError(
            'INVALID_STATUS',
            `Unknown current status: ${currentStatus}`
        );
    }

    const allowedTransitions = ORDER_TRANSITIONS[currentStatus];

    // Check if next status is reachable from current
    if (!allowedTransitions[nextStatus]) {
        throw new ConflictError(
            'INVALID_TRANSITION',
            `Cannot transition from ${currentStatus} to ${nextStatus}. This transition is not allowed.`
        );
    }

    const allowedRoles = allowedTransitions[nextStatus];

    // Check if actor's role is permitted - this is a ROLE violation (403)
    if (!allowedRoles.includes(actorRole)) {
        throw new ForbiddenError(
            `Your role (${actorRole}) does not have permission to change order status from ${currentStatus} to ${nextStatus}. Allowed roles: ${allowedRoles.join(', ')}`
        );
    }

    // All checks passed
}

/**
 * Get all possible next states for a given status and role
 * 
 * @param {string} currentStatus - Current order status
 * @param {string} actorRole - Role of the user
 * @returns {string[]} Array of allowed next statuses
 */
function getAllowedNextStatuses(currentStatus, actorRole) {
    if (!ORDER_TRANSITIONS[currentStatus]) {
        return [];
    }

    const transitions = ORDER_TRANSITIONS[currentStatus];
    return Object.keys(transitions).filter(nextStatus => {
        return transitions[nextStatus].includes(actorRole);
    });
}

/**
 * Check if a status is a terminal state
 */
function isTerminalStatus(status) {
    return status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED;
}

/**
 * Get human-readable transition path
 */
function getTransitionPath(fromStatus, toStatus) {
    const paths = {
        'pending->confirmed': 'Order confirmed by merchant',
        'confirmed->preparing': 'Merchant started preparing order',
        'preparing->ready': 'Order ready for pickup',
        'ready->driver_assigned': 'Courier accepted delivery',
        'driver_assigned->in_delivery': 'Courier picked up order',
        'in_delivery->delivered': 'Order delivered to customer',
        'pending->cancelled': 'Order cancelled',
        'confirmed->cancelled': 'Order cancelled',
        'preparing->cancelled': 'Order cancelled',
        'ready->cancelled': 'Order cancelled'
    };

    return paths[`${fromStatus}->${toStatus}`] || `Status changed from ${fromStatus} to ${toStatus}`;
}

module.exports = {
    ORDER_STATUS,
    ROLE,
    ORDER_TRANSITIONS,
    validateTransition,
    getAllowedNextStatuses,
    isTerminalStatus,
    getTransitionPath
};
