const { Notification } = require('../models');

class NotificationService {
    constructor() {
        this.io = null;
    }

    setSocket(io) {
        console.log('NotificationService: Socket initialized');
        this.io = io;
    }

    async send(userId, title, message, type = 'system', metadata = {}) {
        try {
            // 1. Save to Database
            const notification = await Notification.create({
                userId,
                title,
                message,
                type,
                metadata
            });

            // 2. Emit to Socket Room (if connected)
            if (this.io) {
                console.log(`Debug: Emitting to user_${userId}`);
                this.io.to(`user_${userId}`).emit('notification', {
                    id: notification.id,
                    title,
                    message,
                    type,
                    metadata,
                    createdAt: notification.createdAt
                });
                console.log(`Notification sent to user_${userId}: ${title}`);
            }

            return notification;
        } catch (error) {
            console.error('Notification Service Error:', error);
            // Don't throw, just log. Notifications shouldn't break the main flow.
            return null;
        }
    }
}

module.exports = new NotificationService();
