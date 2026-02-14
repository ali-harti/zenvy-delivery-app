/**
 * Health Check Routes
 * Fast health endpoints for monitoring and load balancers
 * 
 * CRITICAL: Use fast queries only (SELECT 1, not COUNT(*) on large tables)
 * CRITICAL: Hard timeout protection with proper timer cleanup
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const logger = require('../utils/logger');

/**
 * Promise timeout wrapper (TRULY BULLETPROOF)
 * Clears timer in .finally() to prevent timer churn
 */
const withTimeout = (promise, ms, label = 'Operation') => {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        if (timer) clearTimeout(timer);
    });
};

/**
 * Liveness probe (no external dependencies)
 * GET /health OR GET /health/live
 * Returns: 200 OK if server process is running
 * 
 * Use this for Kubernetes/Docker liveness probes
 * Load balancers should NOT kill instance if this fails
 */
router.get('/', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Zenvy Delivery API',
        uptime: process.uptime()
    });
});

router.get('/live', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Zenvy Delivery API',
        uptime: process.uptime()
    });
});

/**
 * Readiness probe (checks external dependencies)
 * GET /health/ready OR GET /health/db
 * Returns: 200 OK if database is reachable
 * 
 * Use this for Kubernetes/Docker readiness probes
 * Load balancers should remove from pool (but not kill) if this fails
 * 
 * PRODUCTION-SAFE:
 * - Uses SELECT 1 (fast), NOT COUNT(*) (slow on large tables)
 * - Hard timeout via Promise.race (5 seconds max)
 * - Timer properly cleared in .finally() (no timer churn)
 * - No error details leaked to client (logged with requestId)
 */
router.get('/ready', async (req, res) => {
    try {
        // BULLETPROOF: Hard timeout with proper timer cleanup
        await withTimeout(
            sequelize.query('SELECT 1', {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            }),
            5000,
            'DB readiness check'
        );

        return res.status(200).json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Log real error server-side with requestId
        req.logger?.error?.('Database readiness check failed', {
            error: error.message,
            requestId: req.requestId
        }) || logger.error('Database readiness check failed', {
            error: error.message,
            requestId: req.requestId
        });

        // Return generic error to client (no error details leaked)
        return res.status(503).json({
            status: 'error',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

// Alias for backward compatibility
router.get('/db', async (req, res) => {
    try {
        await withTimeout(
            sequelize.query('SELECT 1', {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            }),
            5000,
            'DB health check'
        );

        return res.status(200).json({
            status: 'ok',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        req.logger?.error?.('Database health check failed', {
            error: error.message,
            requestId: req.requestId
        }) || logger.error('Database health check failed', {
            error: error.message,
            requestId: req.requestId
        });

        return res.status(503).json({
            status: 'error',
            database: 'disconnected',
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Detailed health check (for monitoring dashboards)
 * GET /health/detailed
 * Returns: System metrics + DB status
 */
router.get('/detailed', async (req, res) => {
    const healthData = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Zenvy Delivery API',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: Math.floor(process.uptime()),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            unit: 'MB'
        }
    };

    try {
        // Fast DB check with timeout and proper cleanup
        await withTimeout(
            sequelize.query('SELECT 1', {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            }),
            5000,
            'DB detailed check'
        );

        healthData.database = {
            status: 'connected',
            type: sequelize.getDialect()
        };
    } catch (error) {
        healthData.status = 'degraded';
        healthData.database = {
            status: 'disconnected'
            // No error details leaked
        };
    }

    const statusCode = healthData.status === 'ok' ? 200 : 503;
    return res.status(statusCode).json(healthData);
});

module.exports = router;
