-- Migration: 002_merchant_admin_schema.sql
-- Description: Adds tables for Merchant and Admin roles, transactions, and platform settings.

-- 1. Admins Table
-- Extends the users table for admin-specific roles/permissions
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'moderator' CHECK (role IN ('super_admin', 'moderator', 'support')),
    permissions TEXT[], -- Array of strings for granular permissions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 2. Merchants Table
-- connect users to stores with business and approval logic
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL, -- Can be null initially if store not created yet
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    commission_rate DECIMAL(5, 2) DEFAULT 15.00, -- Percentage (e.g., 15.00 for 15%)
    business_name VARCHAR(255),
    tax_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- 3. Platform Settings Table
-- Global configuration
CREATE TABLE platform_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'default_delivery_fee'
    value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Merchant Stats Table
-- Analytics aggregation
CREATE TABLE merchant_stats (
    merchant_id INTEGER NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (merchant_id)
);

-- 5. Transactions Table
-- Financial tracking
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('order_payment', 'payout', 'refund', 'fee')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    
    -- Relationships (polymorphic-ish or nullable FKs)
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    merchant_id INTEGER REFERENCES merchants(id) ON DELETE SET NULL,
    courier_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Courier is a User
    
    -- Split details (if order payment)
    platform_fee DECIMAL(15, 2) DEFAULT 0.00,
    merchant_amount DECIMAL(15, 2) DEFAULT 0.00,
    courier_amount DECIMAL(15, 2) DEFAULT 0.00,
    
    reference_id VARCHAR(100), -- External gateway ID (Stripe, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_transactions_merchant ON transactions(merchant_id);
CREATE INDEX idx_merchants_status ON merchants(status);
CREATE INDEX idx_admins_role ON admins(role);

-- Triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at BEFORE UPDATE ON platform_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
