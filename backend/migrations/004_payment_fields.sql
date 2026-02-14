-- Migration: 004_payment_fields.sql
-- Description: Add payment method and status tracking to orders
-- Date: 2026-02-06

-- Add payment fields to orders table
ALTER TABLE orders 
  ADD COLUMN payment_method VARCHAR(30) DEFAULT 'cash_on_delivery'
    CHECK (payment_method IN ('cash_on_delivery', 'card', 'wallet')),
  ADD COLUMN payment_status VARCHAR(20) DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded'));

-- Update existing orders to cash_on_delivery + unpaid
UPDATE orders SET 
  payment_method = 'cash_on_delivery',
  payment_status = 'unpaid'
WHERE payment_method IS NULL;

-- Make payment_method NOT NULL after backfill
ALTER TABLE orders ALTER COLUMN payment_method SET NOT NULL;
ALTER TABLE orders ALTER COLUMN payment_status SET NOT NULL;

-- Add index for payment status queries
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Update transactions table for better payment tracking
ALTER TABLE transactions
  ADD COLUMN external_reference VARCHAR(255), -- Gateway transaction ID
  ADD COLUMN payment_gateway VARCHAR(50), -- stripe, paypal, etc.
  ADD COLUMN failure_reason TEXT, -- Error message if payment failed
  ADD COLUMN refund_amount DECIMAL(15, 2) DEFAULT 0.00,
  ADD COLUMN refunded_at TIMESTAMP;

-- Add index for transaction lookups by external reference
CREATE INDEX idx_transactions_external_ref ON transactions(external_reference);

-- Add constraint: refund_amount cannot exceed amount
ALTER TABLE transactions 
  ADD CONSTRAINT chk_refund_amount CHECK (refund_amount <= amount);

COMMENT ON COLUMN orders.payment_method IS 'Payment method chosen at checkout';
COMMENT ON COLUMN orders.payment_status IS 'Current payment lifecycle status';
COMMENT ON COLUMN transactions.external_reference IS 'Payment gateway transaction ID';
