require('dotenv').config();
const app = require('./app');
const config = require('./config');
const { sequelize } = require('./models');

const PORT = config.port;

// Test database connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');

        // Sync models in development
        if (config.env === 'development') {
            await sequelize.sync({ alter: false });
            console.log('✅ Database models synced');
        }
    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
}

const http = require('http');
const { Server } = require('socket.io');
const socketController = require('./socket');
const NotificationService = require('./services/NotificationService');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Initialize Socket
socketController(io);
NotificationService.setSocket(io);


// Start server
async function startServer() {
    await testConnection();

    console.log(`Attempting to listen on port: ${PORT}`);
    server.listen(PORT, '0.0.0.0', (err) => {
        if (err) {
            console.error('Listen error:', err);
            return;
        }
        console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🚀 Zenvy API Server                     ║
    ║   📍 Environment: ${config.env.padEnd(25)}  ║
    ║   🌐 Port: ${PORT.toString().padEnd(32)}  ║
    ║   📡 API: http://localhost:${PORT}/api/${config.apiVersion}  ║
    ║   🔌 Socket.IO: Active                   ║
    ╚═══════════════════════════════════════════╝
    `);
    });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await sequelize.close();
    process.exit(0);
});
