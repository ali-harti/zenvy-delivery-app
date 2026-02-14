-- Migration: 003_audit_logs.sql
-- Description: Audit logging table for tracking all sensitive operations
-- Date: 2026-02-06

-- Create audit_logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(20), -- Denormalized for historical accuracy
    action VARCHAR(100) NOT NULL, -- e.g., 'order_status_changed', 'merchant_approved'
    entity_type VARCHAR(50) NOT NULL, -- e.g., 'order', 'merchant', 'product'
    entity_id INTEGER NOT NULL, -- ID of the affected entity
    before_json JSONB, -- State before change
    after_json JSONB, -- State after change
    ip_address INET, -- Client IP
    user_agent TEXT, -- Client user agent
    request_id VARCHAR(100), -- Correlation ID
    metadata JSONB, -- Additional context (e.g., reason for cancellation)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_audit_logs_entity_actor ON audit_logs(entity_type, entity_id, actor_user_id);

COMMENT ON TABLE audit_logs IS 'Immutable audit trail for all sensitive operations';
COMMENT ON COLUMN audit_logs.before_json IS 'JSON snapshot before change (null for create)';
COMMENT ON COLUMN audit_logs.after_json IS 'JSON snapshot after change (null for delete)';
COMMENT ON COLUMN audit_logs.request_id IS 'UUID for correlating related actions';
