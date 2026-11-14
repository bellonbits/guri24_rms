-- =============================================================================
-- Migration 0009: Complete Supabase PostgreSQL Domain Schema & Durable Store
-- Target: Supabase PostgreSQL / PostgreSQL 16+
-- Market: Kenya (KES, Africa/Nairobi)
-- =============================================================================

-- 1. SaaS Usage Records & Integration Accounts
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_code VARCHAR(64) NOT NULL, -- e.g. 'ACTIVE_UNITS', 'OCR_PAGES', 'GROQ_TOKENS'
    quantity NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    billing_period VARCHAR(7) NOT NULL, -- YYYY-MM
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_records_org_period
    ON usage_records(organization_id, billing_period);

CREATE TABLE IF NOT EXISTS integration_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider_code VARCHAR(64) NOT NULL, -- 'MPESA_DARAJA', 'GROQ_AI', 'ALLENAI_OLMOCR', 'SUPABASE_STORAGE'
    account_identifier VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'CONFIGURED',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, provider_code)
);

-- 2. Property Ownership Records & Unit Amenities
CREATE TABLE IF NOT EXISTS ownership_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES property_owners(id) ON DELETE CASCADE,
    ownership_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unit_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    amenity_code VARCHAR(64) NOT NULL,
    amenity_label VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (unit_id, amenity_code)
);

-- 3. Lease Terms, Lease Documents & Lease Events
CREATE TABLE IF NOT EXISTS lease_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    clause_number INTEGER NOT NULL,
    clause_title VARCHAR(160) NOT NULL,
    clause_body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lease_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document_role VARCHAR(64) NOT NULL DEFAULT 'SIGNED_LEASE_AGREEMENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lease_id, document_id)
);

CREATE TABLE IF NOT EXISTS lease_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL, -- 'CREATED', 'APPROVED', 'ACTIVATED', 'RENEWED', 'TERMINATED'
    actor_user_id UUID,
    notes TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Payment Transactions & Payment Refunds
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL DEFAULT 'MPESA_DARAJA',
    external_transaction_id VARCHAR(128) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    refund_reference VARCHAR(64) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    reason TEXT NOT NULL,
    approved_by_user_id UUID,
    status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, refund_reference)
);

-- 5. Maintenance Costs
CREATE TABLE IF NOT EXISTS maintenance_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    cost_type VARCHAR(64) NOT NULL DEFAULT 'MATERIALS_AND_LABOR',
    description TEXT NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    incurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Document Pages & Document Processing Events (Allen AI olmOCR pipeline)
CREATE TABLE IF NOT EXISTS document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ocr_job_id UUID REFERENCES ocr_jobs(id) ON DELETE SET NULL,
    page_number INTEGER NOT NULL CHECK (page_number >= 1),
    markdown_content TEXT NOT NULL,
    confidence_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (document_id, page_number)
);

CREATE TABLE IF NOT EXISTS document_processing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ocr_job_id UUID NOT NULL REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    stage VARCHAR(64) NOT NULL, -- 'UPLOADED', 'QUEUED', 'OLMOCR_PROCESSING', 'NEEDS_REVIEW', 'VERIFIED', 'FAILED'
    engine_model VARCHAR(128) NOT NULL DEFAULT 'allenai/olmOCR-2-7B-1025-FP8',
    detail TEXT,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Groq AI Assistant Usage Records
CREATE TABLE IF NOT EXISTS assistant_usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    provider VARCHAR(64) NOT NULL DEFAULT 'groq',
    model_name VARCHAR(128) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Platform Operations: Announcements & Scheduled Jobs
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(64) NOT NULL DEFAULT 'ALL_TENANTS',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    job_type VARCHAR(64) NOT NULL, -- 'RECURRING_RENT_INVOICING', 'LEASE_EXPIRY_REMINDER', 'OCR_RETRY'
    cron_schedule VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Authoritative Relational Snapshot Store for Multi-Tenant Repository Persistence
CREATE TABLE IF NOT EXISTS rms_domain_store (
    collection_key VARCHAR(64) PRIMARY KEY,
    payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row-Level Security (RLS) across all newly added tenant-scoped tables
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ownership_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
