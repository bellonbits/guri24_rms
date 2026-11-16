-- =============================================================================
-- Migration 0013: Database Ownership, Dedicated Service Roles & Permissions Contract
-- =============================================================================
-- Establishes the authoritative database ownership boundaries across services:
-- 1. guri24_rust_app: Owns Properties, Units, Tenants, Leases, Maintenance, Operations
-- 2. guri24_spring_app: Owns Invoices, Payments, Deposits, General Ledger, Reconciliation
-- 3. guri24_python_app: Owns OCR extraction jobs & AI inference metadata
--
-- Sharing a single Supabase PostgreSQL database does NOT grant every service write access
-- to every table. Dedicated database credentials enforce domain boundaries at the engine level.
-- =============================================================================

-- Step 1: Provision dedicated database roles safely (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'guri24_rust_app') THEN
        CREATE ROLE guri24_rust_app WITH LOGIN PASSWORD 'guri24_rust_secure_pass_change_in_prod';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'guri24_spring_app') THEN
        CREATE ROLE guri24_spring_app WITH LOGIN PASSWORD 'guri24_spring_secure_pass_change_in_prod';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'guri24_python_app') THEN
        CREATE ROLE guri24_python_app WITH LOGIN PASSWORD 'guri24_python_secure_pass_change_in_prod';
    END IF;
END $$;

-- Step 2: Grant base schema usage to all service roles
GRANT USAGE ON SCHEMA public TO guri24_rust_app, guri24_spring_app, guri24_python_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO guri24_rust_app, guri24_spring_app, guri24_python_app;

-- Step 3: Transactional Outbox & Event Consumers for Cross-Service Events
CREATE TABLE IF NOT EXISTS financial_outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(96) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    correlation_id VARCHAR(128) NOT NULL,
    schema_version VARCHAR(16) NOT NULL DEFAULT '1.0',
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'DEAD_LETTER')),
    attempts SMALLINT NOT NULL DEFAULT 0,
    max_retries SMALLINT NOT NULL DEFAULT 5,
    last_error TEXT,
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_outbox_status ON financial_outbox_events(status, available_at) WHERE status IN ('PENDING', 'FAILED');

CREATE TABLE IF NOT EXISTS processed_domain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumer_service VARCHAR(64) NOT NULL, -- 'rust-core-api', 'spring-financial-service', 'spring-notification-service'
    event_id UUID NOT NULL,
    event_type VARCHAR(96) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (consumer_service, event_id)
);

-- =============================================================================
-- ROLE 1: guri24_rust_app (Rust / Axum Operations, Inventory, Tenants, Leases)
-- =============================================================================
-- Write & Read Permissions on Rust-Owned Tables
GRANT SELECT, INSERT, UPDATE, DELETE ON 
    organizations,
    organization_members,
    users,
    properties,
    buildings,
    floors,
    units,
    tenants,
    tenant_applications,
    leases,
    maintenance_requests,
    work_orders,
    maintenance_costs,
    inspections,
    inspection_items,
    vendors,
    documents,
    subscriptions,
    assistant_conversations,
    assistant_messages,
    announcements,
    scheduled_jobs,
    audit_logs,
    outbox_events,
    processed_domain_events
TO guri24_rust_app;

-- Read-Only Projections on Spring-Owned Finance Tables (For Cache & Projection Only; NO WRITES)
GRANT SELECT ON 
    invoices,
    invoice_items,
    payments,
    payment_allocations,
    security_deposit_ledger,
    deposit_refunds,
    deposit_refund_requests,
    chart_of_accounts,
    accounting_periods,
    journal_entries,
    journal_lines,
    property_expenses,
    reconciliation_batches,
    reconciliation_external_transactions,
    reconciliation_matches,
    reconciliation_exceptions,
    financial_report_runs,
    financial_audit_events,
    financial_outbox_events
TO guri24_rust_app;

-- Explicitly REVOKE all write operations from Rust on finance tables
REVOKE INSERT, UPDATE, DELETE ON 
    invoices,
    invoice_items,
    payments,
    payment_allocations,
    security_deposit_ledger,
    deposit_refunds,
    deposit_refund_requests,
    chart_of_accounts,
    accounting_periods,
    journal_entries,
    journal_lines,
    property_expenses,
    reconciliation_batches,
    reconciliation_external_transactions,
    reconciliation_matches,
    reconciliation_exceptions,
    financial_report_runs,
    financial_audit_events
FROM guri24_rust_app;

-- =============================================================================
-- ROLE 2: guri24_spring_app (Spring Boot Financial Service Authoritative Owner)
-- =============================================================================
-- Write & Read Permissions on Spring-Owned Finance Tables
GRANT SELECT, INSERT, UPDATE, DELETE ON 
    invoices,
    invoice_items,
    payments,
    payment_allocations,
    security_deposit_ledger,
    deposit_refunds,
    deposit_refund_requests,
    chart_of_accounts,
    accounting_periods,
    journal_entries,
    journal_lines,
    property_expenses,
    reconciliation_batches,
    reconciliation_external_transactions,
    reconciliation_matches,
    reconciliation_exceptions,
    financial_report_runs,
    financial_audit_events,
    financial_outbox_events,
    processed_domain_events
TO guri24_spring_app;

-- Read-Only Reference Permissions on Rust-Owned Inventory & Master Data
GRANT SELECT ON 
    organizations,
    users,
    properties,
    buildings,
    floors,
    units,
    tenants,
    leases,
    vendors,
    work_orders,
    maintenance_costs
TO guri24_spring_app;

-- Explicitly REVOKE write operations from Spring on inventory & master tables
REVOKE INSERT, UPDATE, DELETE ON 
    organizations,
    organization_members,
    users,
    properties,
    buildings,
    floors,
    units,
    tenants,
    leases,
    maintenance_requests,
    documents,
    assistant_conversations
FROM guri24_spring_app;

-- =============================================================================
-- ROLE 3: guri24_python_app (Python OCR & AI Inference Service)
-- =============================================================================
-- Write & Read Permissions on OCR & Extraction Jobs
GRANT SELECT, INSERT, UPDATE, DELETE ON 
    ocr_jobs,
    processed_domain_events
TO guri24_python_app;

-- Read-Only Permissions on Document Metadata to verify file location
GRANT SELECT ON documents TO guri24_python_app;

-- Explicitly REVOKE all access to Financial and Personal Tenant tables from Python
REVOKE ALL ON 
    invoices,
    invoice_items,
    payments,
    payment_allocations,
    journal_entries,
    journal_lines,
    chart_of_accounts,
    security_deposit_ledger,
    deposit_refunds,
    reconciliation_batches,
    users,
    tenants,
    leases
FROM guri24_python_app;

-- =============================================================================
-- Financial Immutability & Audit Protection Triggers
-- =============================================================================
CREATE OR REPLACE FUNCTION trg_assert_finance_mutation_authorizer()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent deletion of posted journal entries unconditionally
    IF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Financial Integrity Violation: Posted journal entries are strictly immutable and cannot be deleted. Use reversal journal instead.';
    END IF;

    -- Prevent modification of lines of a posted journal
    IF TG_OP = 'UPDATE' AND OLD.status = 'POSTED' AND NEW.status != 'REVERSED' THEN
        RAISE EXCEPTION 'Financial Integrity Violation: Posted journal entry % cannot be modified.', OLD.entry_number;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_journal_immutability ON journal_entries;
CREATE TRIGGER trg_protect_journal_immutability
BEFORE UPDATE OR DELETE ON journal_entries
FOR EACH ROW EXECUTE FUNCTION trg_assert_finance_mutation_authorizer();
