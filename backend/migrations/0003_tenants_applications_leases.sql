-- =============================================================================
-- Migration 0003: Tenants, Applications & Lease Lifecycle
-- =============================================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_code VARCHAR(32) NOT NULL,
    full_name VARCHAR(180) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    alternate_phone VARCHAR(32),
    email VARCHAR(255),
    occupation VARCHAR(120),
    employer_name VARCHAR(180),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PROSPECT', 'ACTIVE', 'FORMER', 'BLACKLISTED')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, tenant_code),
    UNIQUE (organization_id, phone)
);

-- Minimized identification record per Kenya Data Protection Act 2019
CREATE TABLE tenant_identifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    id_type VARCHAR(32) NOT NULL CHECK (id_type IN ('NATIONAL_ID', 'PASSPORT', 'ALIEN_ID')),
    id_number_hash VARCHAR(128) NOT NULL, -- Salted hash for duplicate detection without exposing raw ID in logs
    id_number_masked VARCHAR(32) NOT NULL, -- e.g. "****5678"
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, id_type, id_number_hash)
);

CREATE TABLE tenant_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    contact_type VARCHAR(32) NOT NULL CHECK (contact_type IN ('EMERGENCY', 'NEXT_OF_KIN', 'GUARANTOR')),
    full_name VARCHAR(180) NOT NULL,
    relationship VARCHAR(64) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tenant_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    proposed_move_in_date DATE NOT NULL,
    monthly_income_kes NUMERIC(14, 2),
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leases: Draft -> Pending Approval -> Active -> Expiring -> Renewed | Terminated
CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    primary_tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    lease_number VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    billing_day SMALLINT NOT NULL DEFAULT 1 CHECK (billing_day BETWEEN 1 AND 28),
    monthly_rent_kes NUMERIC(14, 2) NOT NULL CHECK (monthly_rent_kes > 0),
    security_deposit_kes NUMERIC(14, 2) NOT NULL CHECK (security_deposit_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'EXPIRING', 'RENEWED', 'TERMINATED')),
    payment_account_reference VARCHAR(64) NOT NULL, -- Used for M-Pesa Paybill Account No (e.g. "HSE-A101")
    terms_and_conditions TEXT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    terminated_at TIMESTAMPTZ,
    termination_reason TEXT,
    renewed_from_lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_date > start_date),
    UNIQUE (organization_id, lease_number)
);

-- Prevent multiple simultaneous ACTIVE or EXPIRING leases on the same unit
CREATE UNIQUE INDEX idx_leases_unique_active_unit
    ON leases (unit_id)
    WHERE status IN ('ACTIVE', 'EXPIRING');

CREATE TABLE lease_tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    responsibility_share_pct NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (responsibility_share_pct > 0 AND responsibility_share_pct <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lease_id, tenant_id)
);

CREATE TABLE lease_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    clause_title VARCHAR(120) NOT NULL,
    clause_body TEXT NOT NULL,
    display_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recurring additional charges on a lease (e.g. Garbage KES 500, Service Charge KES 2,000, Water Fixed)
CREATE TABLE lease_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    charge_code VARCHAR(64) NOT NULL,
    description VARCHAR(180) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes >= 0),
    is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (lease_id, charge_code)
);

CREATE TABLE lease_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    document_name VARCHAR(180) NOT NULL,
    storage_key TEXT NOT NULL,
    signed_by_tenant_at TIMESTAMPTZ,
    signed_by_manager_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lease_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    previous_status VARCHAR(32),
    new_status VARCHAR(32) NOT NULL,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_org ON tenants(organization_id);
CREATE INDEX idx_leases_org_status ON leases(organization_id, status);
CREATE INDEX idx_leases_tenant ON leases(organization_id, primary_tenant_id);
CREATE INDEX idx_leases_end_date ON leases(organization_id, end_date);
