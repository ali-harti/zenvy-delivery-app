-- ========================================
-- ZENVY DATABASE INTEGRITY VALIDATION
-- Production Readiness Check - BLOCKER Tests
-- ========================================

\echo '===================='
\echo 'DATABASE INTEGRITY CHECKS'
\echo 'Test Date:' 
\echo `date`
\echo '===================='

-- BLOCKER 1: Negative stock check
\echo '\n[BLOCKER-1] Checking for negative stock...'
SELECT id, name, stock, store_id
FROM products
WHERE stock < 0;
\echo 'Expected: 0 rows | Actual:'
SELECT COUNT(*) as negative_stock_count FROM products WHERE stock < 0;

-- BLOCKER 2: Orphaned order items
\echo '\n[BLOCKER-2] Checking for orphaned order_items...'
SELECT oi.id, oi.order_id, oi.product_id
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL;
\echo 'Expected: 0 rows | Actual:'
SELECT COUNT(*) as orphaned_items FROM order_items oi LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL;

-- BLOCKER 3: Delivered orders missing timestamp
\echo '\n[BLOCKER-3] Checking delivered orders with NULL delivered_at...'
SELECT id, status, delivered_at, created_at
FROM orders
WHERE status = 'delivered' AND delivered_at IS NULL;
\echo 'Expected: 0 rows | Actual:'
SELECT COUNT(*) as missing_delivered_at FROM orders WHERE status = 'delivered' AND delivered_at IS NULL;

-- BLOCKER 4: driver_assigned orders missing courier
\echo '\n[BLOCKER-4] Checking driver_assigned orders with NULL delivery_person_id...'
SELECT id, status, delivery_person_id, store_id
FROM orders
WHERE status = 'driver_assigned' AND delivery_person_id IS NULL;
\echo 'Expected: 0 rows | Actual:'
SELECT COUNT(*) as missing_courier FROM orders WHERE status = 'driver_assigned' AND delivery_person_id IS NULL;

-- BLOCKER 5: Duplicate courier assignments
\echo '\n[BLOCKER-5] Checking for duplicate courier assignments per order...'
SELECT order_id, COUNT(*) as assignment_count
FROM courier_assignments
GROUP BY order_id
HAVING COUNT(*) > 1;
\echo 'Expected: 0 rows | Actual:'
SELECT COUNT(*) as duplicate_assignments FROM (
    SELECT order_id FROM courier_assignments GROUP BY order_id HAVING COUNT(*) > 1
) sub;

-- HIGH 6: in_delivery orders missing pickedUpAt
\echo '\n[HIGH-6] Checking in_delivery orders with NULL picked_up_at...'
SELECT id, status, picked_up_at
FROM orders
WHERE status = 'in_delivery' AND picked_up_at IS NULL;
\echo 'Expected: 0 rows (or very few) | Actual:'
SELECT COUNT(*) as missing_pickup_time FROM orders WHERE status = 'in_delivery' AND picked_up_at IS NULL;

-- MEDIUM 7: Audit payload size check
\echo '\n[MEDIUM-7] Checking audit log payload sizes (should be minimal)...'
SELECT 
    id,
    action,
    LENGTH(before_json::text) as before_size,
    LENGTH(after_json::text) as after_size
FROM audit_logs
WHERE LENGTH(before_json::text) > 1000 OR LENGTH(after_json::text) > 1000
LIMIT 10;
\echo 'Expected: 0 rows or very few | Actual:'
SELECT COUNT(*) as large_payloads FROM audit_logs WHERE LENGTH(before_json::text) > 1000 OR LENGTH(after_json::text) > 1000;

-- MEDIUM 8: Missing requestId in audit logs
\echo '\n[MEDIUM-8] Checking for audit logs missing request_id...'
SELECT COUNT(*) as missing_request_id
FROM audit_logs
WHERE request_id IS NULL
ORDER BY created_at DESC
LIMIT 100;

-- Summary counts
\echo '\n===================='
\echo 'SUMMARY'
\echo '===================='
SELECT 
    (SELECT COUNT(*) FROM products WHERE stock < 0) as negative_stock,
    (SELECT COUNT(*) FROM order_items oi LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL) as orphaned_items,
    (SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND delivered_at IS NULL) as delivered_no_timestamp,
    (SELECT COUNT(*) FROM orders WHERE status = 'driver_assigned' AND delivery_person_id IS NULL) as assigned_no_courier,
    (SELECT COUNT(*) FROM (SELECT order_id FROM courier_assignments GROUP BY order_id HAVING COUNT(*) > 1) sub) as duplicate_assignments;

\echo '\n===================='
\echo 'VERDICT'
\echo 'PASS if all BLOCKER counts = 0'
\echo '===================='
