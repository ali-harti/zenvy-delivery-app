const jwt = require('jsonwebtoken');
const config = require('../config');
const { User } = require('../models');

// Map to store online users: { userId: socketId }
const onlineUsers = new Map();

module.exports = (io) => {
    // Middleware for Auth
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            // Remove 'Bearer ' if present
            const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

            const decoded = jwt.verify(tokenString, config.jwt.secret);
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.email} (${socket.id})`);

        // Join User Room
        socket.join(`user_${socket.user.id}`);
        onlineUsers.set(socket.user.id, socket.id);

        if (socket.user.role === 'courier') {
            socket.join(`courier_${socket.user.id}`);
        } else if (socket.user.role === 'merchant') {
            socket.join(`merchant_${socket.user.id}`); // Or store ID logic
        }

        // Handle Disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.email}`);
            onlineUsers.delete(socket.user.id);
        });

        // --- Event Handlers ---

        // Join Order Room (for tracking)
        socket.on('join_order', (orderId) => {
            if (!orderId) return;
            // Add authorization check here if needed (is user related to order?)
            socket.join(`order_${orderId}`);
            console.log(`User ${socket.user.id} joined order_${orderId}`);
        });

        // Courier Location Update
        socket.on('update_location', (data) => {
            // data: { orderId, latitude, longitude, heading }
            // Broadcast to Order Room
            if (data.orderId) {
                socket.to(`order_${data.orderId}`).emit('courier_location', {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    heading: data.heading,
                    timestamp: Date.now()
                });
            }
        });
    });
};
