/**
 * Event Dispatcher
 * Transaction-aware event emitter for Socket.IO
 * Ensures events are only emitted AFTER database transaction commits
 * 
 * CRITICAL: Use transaction.afterCommit() pattern (implemented in services)
 * This class provides helper methods for immediate emission
 */

const logger = require('../utils/logger');

class EventDispatcher {
    constructor() {
        this.io = null; // Will be set by server.js
    }

    /**
     * Set the Socket.IO instance
     * Called once during server initialization
     */
    setIO(socketIOInstance) {
        this.io = socketIOInstance;
        logger.info('EventDispatcher: Socket.IO instance attached');
    }

    /**
     * Emit event immediately (for use in transaction.afterCommit())
     * 
     * USAGE PATTERN:
     * ```
     * const transaction = await sequelize.transaction();
     * // ... DB operations ...
     * transaction.afterCommit(() => {
     *   EventDispatcher.emitNow('order:created', { orderId: 123 });
     * });
     * await transaction.commit(); // Event fires here
     * ```
     * 
     * @param {string} eventName - Socket.IO event name
     * @param {Object} payload - Event payload (must be JSON-serializable)
     */
    emitNow(eventName, payload) {
        if (!this.io) {
            logger.warn('EventDispatcher: Socket.IO not initialized, cannot emit event', { eventName });
            return;
        }

        try {
            // Emit to all connected clients
            this.io.emit(eventName, {
                ...payload,
                timestamp: new Date().toISOString(),
                event: eventName
            });

            logger.info('Socket.IO event emitted', {
                eventName,
                payloadKeys: Object.keys(payload)
            });
        } catch (error) {
            logger.error('Failed to emit Socket.IO event', {
                error: error.message,
                eventName
            });
        }
    }

    /**
     * Emit to specific user's room
     */
    emitToUser(userId, eventName, payload) {
        if (!this.io) {
            logger.warn('EventDispatcher: Socket.IO not initialized');
            return;
        }

        const roomName = `user_${userId}`;
        this.io.to(roomName).emit(eventName, {
            ...payload,
            timestamp: new Date().toISOString(),
            event: eventName
        });

        logger.info('Socket.IO event emitted to user', {
            userId,
            eventName
        });
    }

    /**
     * Emit to specific store's room (for merchants)
     */
    emitToStore(storeId, eventName, payload) {
        if (!this.io) {
            logger.warn('EventDispatcher: Socket.IO not initialized');
            return;
        }

        const roomName = `store_${storeId}`;
        this.io.to(roomName).emit(eventName, {
            ...payload,
            timestamp: new Date().toISOString(),
            event: eventName
        });

        logger.info('Socket.IO event emitted to store', {
            storeId,
            eventName
        });
    }

    /**
     * Emit to all couriers
     */
    emitToCouriers(eventName, payload) {
        if (!this.io) return;

        const roomName = 'couriers';
        this.io.to(roomName).emit(eventName, {
            ...payload,
            timestamp: new Date().toISOString(),
            event: eventName
        });
    }
}

// Export singleton
module.exports = new EventDispatcher();
