require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    apiVersion: process.env.API_VERSION || 'v1',

    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION
    },

    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS) || 10
    },

    cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:19006']
    },

    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
    }
};
