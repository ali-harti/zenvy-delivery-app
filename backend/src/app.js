require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const requestContext = require('./middleware/requestContext');
const { apiLimiter } = require('./middleware/rateLimiter');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Trust reverse proxy (environment-driven for flexibility)
// TRUST_PROXY_HOPS=1 for Nginx/single proxy
// TRUST_PROXY_HOPS=2 for Cloudflare->Nginx->Node
// TRUST_PROXY_HOPS=0 for direct public Node (no proxy)
const trustProxyHops = parseInt(process.env.TRUST_PROXY_HOPS || '1', 10);
app.set('trust proxy', trustProxyHops);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production'
}));

// CORS - FIXED: Proper whitelist, no * with credentials
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://localhost:19006']; // Dev defaults

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman)
        // 🟠 SECURITY FIX: Removed allowedOrigins.includes('*') - force explicit origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// Compression
app.use(compression());

// Request context (MUST be before other middleware to set req.requestId)
app.use(requestContext);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// Health endpoint (BEFORE rate limiting)
app.use('/health', healthRoutes);

// Rate limiting (AFTER health endpoint)
app.use(apiLimiter);

// API routes
app.use('/api/v1', routes);

// Error handling (must be last)
app.use(errorHandler);

module.exports = app;
