# ========================================
# PRODUCTION READINESS - LIVE EXECUTION GUIDE
# Zenvy Backend QA Validation
# ========================================

## SETUP

Before starting, ensure you have:
1. PostgreSQL running
2. Node.js installed
3. Backend server can start
4. Test database created (zenvy_db or zenvy_test)

## PHASE 0: PRE-FLIGHT CHECK (5 minutes)

### Step 1: Check Environment

```bash
cd "C:\Users\dell\OneDrive\Documents\Zenvy Delivery App\backend"

# Check Node version
node -v
# Expected: v14+ or v16+

# Check Postgres
psql --version
# Expected: PostgreSQL 12+ or 14+

# Check database exists
psql -lqt | cut -d \| -f 1 | grep -qw zenvy_db && echo "✓ Database exists" || echo "✗ Database not found"
```

### Step 2: Start Server

```bash
# Start server (leave this running)
npm start

# Expected output:
# Server running on port 3000
# Database connected
# Socket.IO initialized
```

### Step 3: Verify Health Endpoints

```bash
# In a new terminal
curl http://localhost:3001/health/live
# Expected: {"status":"ok","timestamp":"...","service":"Zenvy Delivery API","uptime":...}

curl http://localhost:3001/health/ready
# Expected: {"status":"ok","database":"connected","timestamp":"..."}
```

**✓ PRE-FLIGHT PASS if:**
- Server starts without errors
- /health/live returns 200
- /health/ready returns 200

---

## PHASE 1: DATABASE INTEGRITY (10 minutes)

### Run SQL Integrity Checks

```bash
# Run integrity check
psql -d zenvy_db -f scripts/db-integrity-check.sql > reports/db_integrity_report.txt

# View results
cat reports/db_integrity_report.txt
```

### Manually verify BLOCKER results

```bash
# Quick check: All BLOCKER counts should be 0
psql -d zenvy_db -c "
SELECT 
    (SELECT COUNT(*) FROM products WHERE stock < 0) as negative_stock,
    (SELECT COUNT(*) FROM order_items oi LEFT JOIN orders o ON oi.order_id = o.id WHERE o.id IS NULL) as orphaned_items,
    (SELECT COUNT(*) FROM orders WHERE status = 'delivered' AND delivered_at IS NULL) as delivered_no_timestamp,
    (SELECT COUNT(*) FROM orders WHERE status = 'driver_assigned' AND delivery_person_id IS NULL) as assigned_no_courier;
"
```

**Expected Output:**
```
 negative_stock | orphaned_items | delivered_no_timestamp | assigned_no_courier 
----------------+----------------+------------------------+---------------------
              0 |              0 |                      0 |                   0
```

**✓ BLOCKER PASS if all counts = 0**  
**✗ NO-GO if any count > 0**

---

## PHASE 2: GET AUTH TOKENS (5 minutes)

### Login to get tokens

```bash
# Login as customer
CUSTOMER_TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"customer@test.com","password":"password"}' \
    | jq -r '.data.token')

echo "Customer Token: $CUSTOMER_TOKEN"

# Login as merchant
MERCHANT_TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"merchant@test.com","password":"password"}' \
    | jq -r '.data.token')

echo "Merchant Token: $MERCHANT_TOKEN"

# Login as courier
COURIER_TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"courier@test.com","password":"password"}' \
    | jq -r '.data.token')

echo "Courier Token: $COURIER_TOKEN"

# Export for script usage
export CUSTOMER_TOKEN
export MERCHANT_TOKEN
export COURIER_TOKEN
```

**If login fails or you don't have test users:**

```bash
# Check existing users
psql -d zenvy_db -c "SELECT id, name, email, role FROM users LIMIT 10;"

# Or create test users via seeds
npm run db:seed

# Then retry login
```

---

## PHASE 3: API VALIDATION (15 minutes)

### Run API Validation Script

```bash
# Make script executable (Git Bash on Windows)
chmod +x scripts/api-validation.sh

# Run validation
./scripts/api-validation.sh > reports/api_validation_output.txt

# View results
cat reports/api_validation_output.txt
```

### Manual API Tests (if script fails)

```bash
# Test 1: Invalid enum (should return 400)
curl -X PATCH http://localhost:3001/api/v1/orders/1/status \
    -H "Authorization: Bearer $MERCHANT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"garbage"}' \
    -w "\nHTTP Status: %{http_code}\n"

# Expected: HTTP Status: 400
# Body should contain: "errorCode":"INVALID_INPUT"

# Test 2: Role violation (should return 403)
curl -X PATCH http://localhost:3001/api/v1/orders/1/status \
    -H "Authorization: Bearer $CUSTOMER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"confirmed"}' \
    -w "\nHTTP Status: %{http_code}\n"

# Expected: HTTP Status: 403

# Test 3: CORS untrusted origin
curl -H "Origin: https://evil.com" \
    http://localhost:3001/api/v1/stores \
    -v 2>&1 | grep "Access-Control-Allow-Origin"

# Expected: No output (header not present)

# Test 4: CORS trusted origin
curl -H "Origin: http://localhost:3000" \
    http://localhost:3001/api/v1/stores \
    -v 2>&1 | grep "Access-Control-Allow-Origin"

# Expected: Access-Control-Allow-Origin: http://localhost:3000
```

**✓ BLOCKER PASS if:**
- Invalid enum returns 400 with INVALID_INPUT
- Role violation returns 403
- Invalid transition returns 409
- CORS rejects untrusted origins
- Health endpoints not rate limited

---

## PHASE 4: SOCKET.IO VALIDATION (10 minutes)

### Start Socket.IO Listener

```bash
# Terminal 1: Start Socket.IO client
node scripts/socket-test-client.js

# Expected output:
# Listening for Socket.IO events...
# Perform order operations to trigger events.
```

### Trigger Events (in another terminal)

```bash
# Terminal 2: Create an order
curl -X POST http://localhost:3001/api/v1/orders \
    -H "Authorization: Bearer $CUSTOMER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "deliveryAddress": "123 Test Street",
        "paymentMethod": "cash_on_delivery"
    }'

# Update order status
curl -X PATCH http://localhost:3001/api/v1/orders/1/status \
    -H "Authorization: Bearer $MERCHANT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"confirmed"}'
```

### Check Socket.IO Output (Terminal 1)

**Expected:**
```
[EVENT] order:created
Payload: {
  "orderId": 1,
  "userId": 1,
  "storeId": 1,
  "status": "pending",
  "timestamp": "...",
  "event": "order:created"
}
✓ PASS: No PII in payload
✓ PASS: Payload contains only safe fields
```

**✗ BLOCKER FAIL if:**
- Event contains deliveryAddress, phone, paymentMethod
- Event contains any customer PII

### Stop listener (Ctrl+C) and check log

```bash
cat socket_events_log.txt
```

**✓ BLOCKER PASS if:**
- All events show "No PII in payload"
- No unexpected fields

---

## PHASE 5: CONCURRENCY TESTS (30 minutes)

### Test A: Stock Safety

**Requires: Multiple terminal windows or a script**

```bash
# Prepare: Set product stock to 2
psql -d zenvy_db -c "UPDATE products SET stock = 2 WHERE id = 1;"

# Create 5 customer carts (manual or via script)
# Each cart has 1 item of product_id=1

# Concurrent checkout (run simultaneously in 5 terminals)
# Terminal 1-5:
curl -X POST http://localhost:3001/api/v1/orders \
    -H "Authorization: Bearer $CUSTOMER_TOKEN_1" \
    -H "Content-Type: application/json" \
    -d '{"deliveryAddress":"123 Test","paymentMethod":"cash_on_delivery"}'

# Check final stock
psql -d zenvy_db -c "SELECT stock FROM products WHERE id = 1;"
```

**Expected:**
- Final stock = 0 (never negative!)
- Exactly 2 customers get 200 OK
- Exactly 3 customers get 409 Conflict (Insufficient stock)

**✗ BLOCKER FAIL if stock < 0**

### Test B: Courier Accept Race

```bash
# Prepare: Create order in READY status
ORDER_ID=$(psql -d zenvy_db -t -c "
    INSERT INTO orders (user_id, store_id, status, total_amount, created_at, updated_at) 
    VALUES (1, 1, 'ready', 100, NOW(), NOW()) 
    RETURNING id;
" | tr -d ' ')

echo "Test Order ID: $ORDER_ID"

# Launch 10 concurrent courier accepts (in parallel)
for i in {1..10}; do
    (curl -X POST "http://localhost:3001/api/v1/delivery/orders/$ORDER_ID/accept" \
        -H "Authorization: Bearer $COURIER_TOKEN" \
        -w "\nCourier $i: %{http_code}\n" \
        -o /dev/null -s) &
done
wait

# Check courier assignments
psql -d zenvy_db -c "
    SELECT COUNT(*) as assignment_count 
    FROM courier_assignments 
    WHERE order_id = $ORDER_ID;
"
```

**Expected:**
- assignment_count = 1 (exactly one)
- Exactly 1 courier got 200 OK
- Exactly 9 couriers got 409 Conflict

**✗ BLOCKER FAIL if assignment_count > 1**

---

## PHASE 6: HEALTH RELIABILITY (15 minutes)

### Test A: DB Down Scenario

```bash
# Terminal 1: Server running

# Terminal 2: Stop PostgreSQL
# Windows:
net stop postgresql-x64-14
# OR Docker:
docker stop postgres-container

# Terminal 3: Test liveness (should work)
curl http://localhost:3001/health/live
# Expected: 200 OK

# Test readiness (should fail)
curl http://localhost:3001/health/ready
# Expected: 503 Service Unavailable

# Terminal 2: Restart PostgreSQL
net start postgresql-x64-14

# Terminal 3: Test readiness again
curl http://localhost:3001/health/ready
# Expected: 200 OK
```

**✓ BLOCKER PASS if:**
- Liveness stays 200 when DB is down
- Readiness returns 503 when DB is down
- Readiness returns 200 when DB is back up

### Test B: Timeout Test (TEST ONLY - REVERT AFTER)

**WARNING: Temporarily modify code**

```javascript
// In src/routes/health.routes.js
// Line ~70: Change SELECT 1 to SELECT pg_sleep(10)
await withTimeout(
    sequelize.query('SELECT pg_sleep(10)', {  // TEMPORARY
        type: sequelize.QueryTypes.SELECT,
        raw: true
    }),
    5000,
    'DB readiness check'
);
```

```bash
# Test timeout
time curl http://localhost:3001/health/ready

# Expected:
# HTTP 503
# Time: ~5 seconds (NOT 10 seconds)
# Body: {"status":"error","database":"disconnected",...}
```

**IMPORTANT: Revert change immediately!**

```javascript
// Change back to SELECT 1
await withTimeout(
    sequelize.query('SELECT 1', {
        type: sequelize.QueryTypes.SELECT,
        raw: true
    }),
    5000,
    'DB readiness check'
);
```

**✓ BLOCKER PASS if timeout occurs in ~5s**

---

## PHASE 7: LOAD TESTING (Optional - requires k6)

**Skip if k6 not available. Not a blocker.**

```bash
# Install k6 (Windows)
choco install k6

# Run baseline load test (5 minutes)
k6 run scripts/k6-baseline-load.js

# Review metrics:
# - http_req_duration p(95) < 500ms
# - http_req_failed rate < 0.01 (1%)
# - No increasing memory trend
```

---

## REPORTING

### Create Final Report

```bash
mkdir -p reports

# Collect all artifacts
cat reports/db_integrity_report.txt
cat reports/api_validation_output.txt
cat socket_events_log.txt
```

### Checklist

```
✓ or ✗ for each:

BLOCKER Tests:
[ ] Negative stock = 0
[ ] Orphaned order_items = 0  
[ ] Delivered orders missing timestamp = 0
[ ] driver_assigned missing courier = 0
[ ] Duplicate courier assignments = 0
[ ] Health liveness works without DB
[ ] Health readiness fails without DB
[ ] Health readiness timeout ~5s
[ ] Invalid enum returns 400
[ ] Role violation returns 403
[ ] Invalid transition returns 409
[ ] CORS rejects untrusted origins
[ ] Stock concurrency: never negative
[ ] Courier accept: exactly-once
[ ] Socket.IO: no PII in broadcasts
[ ] afterCommit: no events on rollback

HIGH Priority:
[ ] RequestId propagation works
[ ] Trust proxy: real IP in audit logs
[ ] CORS allows trusted origins
[ ] CORS allows no-origin (mobile)
[ ] Health never rate limited
```

---

## GO/NO-GO DECISION

**NO-GO if ANY BLOCKER fails**

**GO FOR UI/UX if:**
- All BLOCKER tests pass
- No negative stock detected
- No duplicate courier assignments
- Correct status codes (400/403/409/503)
- Health timeout ≤ 5.2s
- No PII in Socket.IO events

**Report Format:**
- Copy template from production_readiness_test_plan.md
- Fill in PASS/FAIL for each test
- Attach evidence (SQL output, curl responses, logs)
- Provide final GO/NO-GO verdict

---

## TROUBLESHOOTING

**Issue: psql command not found**
```bash
# Add PostgreSQL to PATH
# Windows: Add C:\Program Files\PostgreSQL\14\bin to PATH
```

**Issue: curl command not found (Windows)**
```bash
# Use Git Bash or install curl
# Or use PowerShell equivalent:
Invoke-WebRequest -Uri "http://localhost:3001/health/live"
```

**Issue: Tokens not working**
```bash
# Check if users exist
psql -d zenvy_db -c "SELECT * FROM users WHERE email = 'customer@test.com';"

# Reset passwords if needed
node gen-hash.js
# Update users table with new hash
```

**Issue: Server won't start**
```bash
# Check logs
tail -f server.log

# Check port not in use
netstat -ano | findstr :3001

# Check database connection
psql -d zenvy_db -c "SELECT 1;"
```

---

This guide provides step-by-step execution instructions. Follow each phase, collect output, and make GO/NO-GO decision based on BLOCKER test results.
