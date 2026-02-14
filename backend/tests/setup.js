/**
 * Jest Global Setup for Zenvy Test Suite
 * Sets up test database, environment, and utilities
 */

const { sequelize } = require('../src/models');
const logger = require('../src/utils/logger');

module.exports = async () => {
    // Set testing flag
    process.env.TESTING = 'true';
    process.env.NODE_ENV = 'test';

    logger.info('Setting up test environment...');

    try {
        // Test database connection
        await sequelize.authenticate();
        logger.info('✓ Database connection established');

        // Run migrations
        await sequelize.sync({ force: true });
        logger.info('✓ Database schema synchronized');

        logger.info('✓ Test environment ready');
    } catch (error) {
        logger.error('✗ Test setup failed:', error);
        throw error;
    }
};
