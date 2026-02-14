#!/bin/bash
# ========================================
# Zenvy API Validation Test Pack
# Production Readiness - API Semantics + Security
# ========================================

BASE_URL=${BASE_URL:-"http://localhost:3001"}
echo "===================================="
echo "ZENVY API VALIDATION TESTS"
echo "Base URL: $BASE_URL"
echo "Date: $(date)"
echo "===================================="

# Test user tokens (will be set via environment or prompts)
CUSTOMER_TOKEN=${CUSTOMER_TOKEN:-""}
MERCHANT_TOKEN=${MERCHANT_TOKEN:-""}
COURIER_TOKEN=${COURIER_TOKEN:-""}

# Counters
PASS_COUNT=0
FAIL_COUNT=0

# Colors for output (works in Git Bash on Windows too)
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS_COUNT++))
}

fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL_COUNT++))
}

# BLOCKER-6: Health liveness (no DB dependency)
echo "\n[BLOCKER-6] Health Liveness..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health/live")
if [ "$response" == "200" ]; then
    pass "Liveness returns 200"
else
    fail "Liveness returned $response (expected 200)"
fi

# BLOCKER-7: Health readiness (with DB)
echo "\n[BLOCKER-7] Health Readiness..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health/ready")
if [ "$response" == "200" ]; then
    pass "Readiness returns 200"
else
    fail "Readiness returned $response (expected 200)"
fi

# HIGH-9: Request ID propagation
echo "\n[HIGH-9] Request ID Propagation..."
request_id=$(curl -s -H "X-Request-ID: test-123-abc" "$BASE_URL/health/live" -D - 2>/dev/null | grep -i "X-Request-ID" | awk '{print $2}' | tr -d '\r')
if [ "$request_id" == "test-123-abc" ]; then
    pass "Request ID returned in response"
else
    fail "Request ID not propagated (got: $request_id)"
fi

# Check if tokens are set
if [ -z "$CUSTOMER_TOKEN" ] || [ -z "$MERCHANT_TOKEN" ]; then
    echo "\n⚠️  WARNING: Auth tokens not set. Skipping authenticated tests."
    echo "Set CUSTOMER_TOKEN, MERCHANT_TOKEN, COURIER_TOKEN environment variables to run full suite."
else
    # BLOCKER-8: Invalid status enum (400)
    echo "\n[BLOCKER-8] Invalid Status Enum (400)..."
    response=$(curl -s -X PATCH "$BASE_URL/api/v1/orders/1/status" \
        -H "Authorization: Bearer $MERCHANT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"status":"garbage"}' \
        -w "%{http_code}" -o /tmp/response.json 2>/dev/null)
    error_code=$(cat /tmp/response.json | grep -o '"errorCode":"[^"]*"' | cut -d'"' -f4 2>/dev/null)
    if [ "$response" == "400" ] && [ "$error_code" == "INVALID_INPUT" ]; then
        pass "Invalid enum returns 400 with INVALID_INPUT"
    else
        fail "Expected 400/INVALID_INPUT, got $response/$error_code"
    fi

    # BLOCKER-9: Role violation (403)
    echo "\n[BLOCKER-9] Role Violation (403)..."
    response=$(curl -s -X PATCH "$BASE_URL/api/v1/orders/1/status" \
        -H "Authorization: Bearer $CUSTOMER_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"status":"confirmed"}' \
        -w "%{http_code}" -o /tmp/response.json 2>/dev/null)
    if [ "$response" == "403" ]; then
        pass "Customer confirming order returns 403"
    else
        fail "Expected 403, got $response"
    fi

    # BLOCKER-10: Invalid transition (409)
    echo "\n[BLOCKER-10] Invalid Transition (409)..."
    response=$(curl -s -X PATCH "$BASE_URL/api/v1/orders/1/status" \
        -H "Authorization: Bearer $MERCHANT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"status":"delivered"}' \
        -w "%{http_code}" -o /tmp/response.json 2>/dev/null)
    error_code=$(cat /tmp/response.json | grep -o '"errorCode":"[^"]*"' | cut -d'"' -f4 2>/dev/null)
    if [ "$response" == "409" ]; then
        pass "Skipping states returns 409"
    else
        fail "Expected 409, got $response"
    fi
fi

# HIGH-10: CORS untrusted origin
echo "\n[HIGH-10] CORS Untrusted Origin..."
response=$(curl -s -H "Origin: https://evil.com" "$BASE_URL/api/v1/stores" -D - 2>/dev/null | grep -i "Access-Control-Allow-Origin")
if [ -z "$response" ]; then
    pass "Untrusted origin rejected (no CORS header)"
else
    fail "Untrusted origin allowed: $response"
fi

# HIGH-11: CORS trusted origin
echo "\n[HIGH-11] CORS Trusted Origin..."
response=$(curl -s -H "Origin: http://localhost:3000" "$BASE_URL/api/v1/stores" -D - 2>/dev/null | grep -i "Access-Control-Allow-Origin")
if [[ "$response" == *"http://localhost:3000"* ]]; then
    pass "Trusted origin allowed"
else
    fail "Trusted origin not in CORS header"
fi

# HIGH-12: CORS no-origin (mobile apps)
echo "\n[HIGH-12] CORS No-Origin (Mobile Apps)..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/stores")
if [ "$response" == "200" ]; then
    pass "No-origin requests allowed (mobile apps)"
else
    fail "No-origin request failed: $response"
fi

# HIGH-13: Rate limiting (health never limited)
echo "\n[HIGH-13] Rate Limiting - Health Endpoints..."
success_count=0
for i in {1..50}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health/ready")
    if [ "$response" == "200" ]; then
        ((success_count++))
    fi
done
if [ "$success_count" == "50" ]; then
    pass "Health endpoints not rate limited (50/50 succeeded)"
else
    fail "Health endpoints rate limited ($success_count/50 succeeded)"
fi

# Summary
echo "\n===================================="
echo "API VALIDATION SUMMARY"
echo "PASS: $PASS_COUNT"
echo "FAIL: $FAIL_COUNT"
if [ "$FAIL_COUNT" == "0" ]; then
    echo "STATUS: ✓ ALL TESTS PASSED"
else
    echo "STATUS: ✗ $FAIL_COUNT TEST(S) FAILED"
fi
echo "===================================="
