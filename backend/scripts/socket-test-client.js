const io = require('socket.io-client');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const LOG_FILE = 'socket_events_log.txt';

// Clear previous log
fs.writeFileSync(LOG_FILE, '');

const log = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(LOG_FILE, logMessage);
};

const socket = io(BASE_URL, {
    path: '/socket.io',
    transports: ['websocket'],
});

let eventCount = 0;
let piiViolations = 0;

socket.on('connect', () => {
    log('✓ Connected to Socket.IO server');
    log(`Socket ID: ${socket.id}`);
});

socket.on('disconnect', () => {
    log('✗ Disconnected from server');
});

socket.on('connect_error', (error) => {
    log(`✗ Connection error: ${error.message}`);
});

// Listen to order events
socket.on('order:created', (data) => {
    eventCount++;
    log('\n========================================');
    log('[EVENT] order:created');
    log('Payload: ' + JSON.stringify(data, null, 2));

    // BLOCKER: Validate payload safety (no PII)
    const piiFields = ['deliveryAddress', 'phoneNumber', 'paymentMethod', 'customerPhone', 'notes'];
    const hasPII = piiFields.some(field => data.hasOwnProperty(field));

    if (hasPII) {
        piiViolations++;
        log('✗ FAIL: PII detected in broadcast event!');
        log('PII fields found: ' + piiFields.filter(f => data.hasOwnProperty(f)).join(', '));
    } else {
        log('✓ PASS: No PII in payload');
    }

    // Should only contain safe fields
    const expectedSafeFields = ['orderId', 'userId', 'storeId', 'status', 'timestamp', 'event'];
    const actualFields = Object.keys(data);
    const unexpectedFields = actualFields.filter(f => !expectedSafeFields.includes(f));

    if (unexpectedFields.length === 0) {
        log('✓ PASS: Payload contains only safe fields');
    } else {
        log('⚠ WARNING: Unexpected fields in payload: ' + unexpectedFields.join(', '));
    }

    log('========================================');
});

socket.on('order:status_updated', (data) => {
    eventCount++;
    log('\n========================================');
    log('[EVENT] order:status_updated');
    log('Payload: ' + JSON.stringify(data, null, 2));

    // Same PII checks
    const piiFields = ['deliveryAddress', 'phoneNumber', 'paymentMethod', 'customerPhone', 'notes'];
    const hasPII = piiFields.some(field => data.hasOwnProperty(field));

    if (hasPII) {
        piiViolations++;
        log('✗ FAIL: PII detected in status update event!');
        log('PII fields found: ' + piiFields.filter(f => data.hasOwnProperty(f)).join(', '));
    } else {
        log('✓ PASS: No PII in payload');
    }

    log('========================================');
});

// Test: afterCommit guarantee (no events on rollback)
socket.on('test:rollback_event', (data) => {
    eventCount++;
    log('\n========================================');
    log('✗ BLOCKER FAIL: Received event after rollback!');
    log('This should NEVER happen - afterCommit() is broken!');
    log('Event data: ' + JSON.stringify(data, null, 2));
    log('========================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
    log('\n\n========================================');
    log('SOCKET.IO TEST SUMMARY');
    log('========================================');
    log(`Total events received: ${eventCount}`);
    log(`PII violations: ${piiViolations}`);
    if (piiViolations === 0 && eventCount > 0) {
        log('✓ PASS: All events were PII-safe');
    } else if (piiViolations > 0) {
        log(`✗ FAIL: ${piiViolations} PII violation(s) detected`);
    } else {
        log('⚠ WARNING: No events received during test');
    }
    log('========================================');
    log(`Full log saved to: ${LOG_FILE}`);

    socket.disconnect();
    process.exit(0);
});

log('Listening for Socket.IO events...');
log('Perform order operations to trigger events.');
log('Press Ctrl+C to exit and see summary\n');
