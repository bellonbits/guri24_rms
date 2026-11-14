-- Migration 0008: AI Agent Assistant, Vendors, Inspections, Branches & SaaS Subscriptions
-- Strict organization_id scoping, RBAC tool audit logs, and action confirmation gates.

CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(140) NOT NULL,
    county VARCHAR(80) NOT NULL,
    address TEXT,
    is_headquarters BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY,
    code VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    monthly_price_kes NUMERIC(14, 2) NOT NULL CHECK (monthly_price_kes >= 0),
    max_units INTEGER NOT NULL CHECK (max_units > 0),
    max_ocr_pages_per_month INTEGER NOT NULL DEFAULT 500,
    max_ai_queries_per_month INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(32) NOT NULL CHECK (status IN ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED')),
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_code VARCHAR(64) NOT NULL,
    billing_period VARCHAR(7) NOT NULL,
    used_quantity INTEGER NOT NULL DEFAULT 0,
    limit_quantity INTEGER NOT NULL DEFAULT 1000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, metric_code, billing_period)
);

CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    vendor_code VARCHAR(32) NOT NULL,
    company_name VARCHAR(160) NOT NULL,
    trade_category VARCHAR(64) NOT NULL,
    contact_person VARCHAR(120) NOT NULL,
    phone VARCHAR(24) NOT NULL,
    email VARCHAR(160),
    kra_pin VARCHAR(32),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, vendor_code)
);

CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    inspection_type VARCHAR(32) NOT NULL CHECK (inspection_type IN ('MOVE_IN', 'PERIODIC', 'MOVE_OUT')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    inspector_name VARCHAR(120) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED')),
    overall_condition VARCHAR(32) NOT NULL DEFAULT 'GOOD',
    recommended_deposit_deduction_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspection_items (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    room_or_area VARCHAR(80) NOT NULL,
    condition_status VARCHAR(32) NOT NULL CHECK (condition_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED')),
    estimated_repair_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    comment TEXT
);

CREATE TABLE IF NOT EXISTS assistant_conversations (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_messages (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(24) NOT NULL CHECK (sender_role IN ('USER', 'ASSISTANT', 'SYSTEM')),
    content TEXT NOT NULL,
    citations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_tool_calls (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES assistant_messages(id) ON DELETE CASCADE,
    tool_name VARCHAR(80) NOT NULL,
    required_permission VARCHAR(80) NOT NULL,
    arguments_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    result_summary TEXT NOT NULL,
    authorized BOOLEAN NOT NULL DEFAULT TRUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_action_confirmations (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL REFERENCES assistant_conversations(id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(80) NOT NULL,
    action_summary TEXT NOT NULL,
    payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(32) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_usage_records (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    provider_name VARCHAR(64) NOT NULL,
    model_name VARCHAR(80) NOT NULL,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
