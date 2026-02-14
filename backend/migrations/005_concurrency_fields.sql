-- Migration: 005_concurrency_fields.sql
-- Description: Add fields for concurrency control and race condition prevention
-- Date: 2026-02-06

-- Add version field to products for optimistic locking
ALTER TABLE products
  ADD COLUMN version INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN products.version IS 'Optimistic lock version for concurrent stock updates';

-- Add accepted_by and accepted_at to courier_assignments for idempotency
ALTER TABLE courier_assignments
  ADD COLUMN accepted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN accept_request_id VARCHAR(100) UNIQUE; -- Idempotency key

COMMENT ON COLUMN courier_assignments.accepted_by IS 'Denormalized courier ID for quick lookup';
COMMENT ON COLUMN courier_assignments.accept_request_id IS 'Unique request ID for idempotent accepts';

-- Ensure order_id is truly unique (should already be from 001_init.sql, but enforce)
-- This prevents race condition where two couriers accept same order
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'courier_assignments_order_id_key'
  ) THEN
    ALTER TABLE courier_assignments 
      ADD CONSTRAINT courier_assignments_order_id_key UNIQUE (order_id);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX idx_courier_assignments_accepted_by ON courier_assignments(accepted_by);
CREATE INDEX idx_products_version ON products(version);

-- Create a function to increment product version on update
CREATE OR REPLACE FUNCTION increment_product_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment version on stock changes
CREATE TRIGGER trigger_increment_product_version
BEFORE UPDATE ON products
FOR EACH ROW
WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
EXECUTE FUNCTION increment_product_version();

COMMENT ON FUNCTION increment_product_version IS 'Auto-increment version when stock changes for optimistic locking';
