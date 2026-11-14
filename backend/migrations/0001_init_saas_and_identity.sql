-- =============================================================================
-- Migration 0001: SaaS Multi-Tenancy, Identity, RBAC & Subscriptions
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Subscription Plans
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    monthly_price_kes NUMERIC(14, 2) NOT NULL CHECK (monthly_price_kes >= 0),
    annual_price_kes NUMERIC(14, 2) NOT NULL CHECK (annual_price_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    max_units INTEGER NOT NULL CHECK (max_units > 0),
    max_users INTEGER NOT NULL CHECK (max_users > 0),
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations (Tenants of the SaaS platform)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(180) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    organization_type VARCHAR(64) NOT NULL CHECK (organization_type IN ('INDEPENDENT_LANDLORD', 'PROPERTY_MANAGEMENT_COMPANY', 'REAL_ESTATE_OWNER')),
    kra_pin VARCHAR(32),
    business_registration_number VARCHAR(64),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(32) NOT NULL,
    county VARCHAR(80) NOT NULL DEFAULT 'Nairobi',
    physical_address TEXT,
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Nairobi',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization-level configurable settings & billing strategies
CREATE TABLE organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    rent_calculation_strategy VARCHAR(64) NOT NULL DEFAULT 'FIXED_MONTHLY' CHECK (rent_calculation_strategy IN ('FIXED_MONTHLY', 'PRORATED_DAILY')),
    late_fee_strategy VARCHAR(64) NOT NULL DEFAULT 'PERCENTAGE_GRACE_PERIOD' CHECK (late_fee_strategy IN ('NONE', 'FLAT_FEE', 'PERCENTAGE_GRACE_PERIOD')),
    late_fee_grace_days INTEGER NOT NULL DEFAULT 5 CHECK (late_fee_grace_days >= 0 AND late_fee_grace_days <= 28),
    late_fee_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5.00 CHECK (late_fee_percentage >= 0),
    late_fee_flat_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (late_fee_flat_kes >= 0),
    payment_allocation_strategy VARCHAR(64) NOT NULL DEFAULT 'FIFO_OLDEST_FIRST' CHECK (payment_allocation_strategy IN ('FIFO_OLDEST_FIRST', 'RENT_PRIORITY_FIRST')),
    deposit_calculation_strategy VARCHAR(64) NOT NULL DEFAULT 'MONTHS_MULTIPLIER' CHECK (deposit_calculation_strategy IN ('MONTHS_MULTIPLIER', 'FIXED_AMOUNT')),
    default_deposit_months NUMERIC(4, 2) NOT NULL DEFAULT 1.00 CHECK (default_deposit_months >= 0),
    default_billing_day SMALLINT NOT NULL DEFAULT 1 CHECK (default_billing_day BETWEEN 1 AND 28),
    mpesa_paybill_shortcode VARCHAR(32),
    mpesa_till_number VARCHAR(32),
    sms_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization Branches
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    code VARCHAR(32) NOT NULL,
    county VARCHAR(80) NOT NULL,
    physical_address TEXT,
    phone VARCHAR(32),
    email VARCHAR(255),
    is_headquarters BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

-- Platform Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(180) NOT NULL,
    password_hash TEXT NOT NULL,
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Roles (System-wide templates + Organization-customizable roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE NULLS NOT DISTINCT (organization_id, code)
);

-- Granular Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(96) NOT NULL UNIQUE,
    module VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role <-> Permission Mapping
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- Organization Memberships (Links a User to an Organization and Role)
CREATE TABLE organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('INVITED', 'ACTIVE', 'SUSPENDED', 'REVOKED')),
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- Rotating Refresh Tokens (Supports token family rotation & revocation)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    family_id UUID NOT NULL,
    replaced_by_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    revoked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL CHECK (status IN ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED')),
    billing_cycle VARCHAR(16) NOT NULL DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'ANNUAL')),
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage Tracking
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    metric_code VARCHAR(64) NOT NULL,
    quantity BIGINT NOT NULL DEFAULT 0,
    recorded_period CHAR(7) NOT NULL, -- YYYY-MM
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, metric_code, recorded_period)
);

CREATE INDEX idx_org_memberships_user ON organization_memberships(user_id);
CREATE INDEX idx_org_memberships_org ON organization_memberships(organization_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);

-- Seed standard RBAC permissions
INSERT INTO permissions (code, module, description) VALUES
    ('properties.view', 'properties', 'View properties, buildings, floors and units'),
    ('properties.create', 'properties', 'Create properties, buildings, floors and units'),
    ('properties.update', 'properties', 'Update property and unit details'),
    ('tenants.view', 'tenants', 'View tenants and rental applications'),
    ('tenants.create', 'tenants', 'Register new tenants and process applications'),
    ('leases.view', 'leases', 'View lease agreements and schedules'),
    ('leases.create', 'leases', 'Draft new lease agreements'),
    ('leases.approve', 'leases', 'Approve, activate, renew or terminate leases'),
    ('invoices.view', 'billing', 'View tenant invoices and statements'),
    ('invoices.create', 'billing', 'Generate recurring or ad-hoc invoices and credit notes'),
    ('payments.view', 'payments', 'View payments and M-Pesa transactions'),
    ('payments.reconcile', 'payments', 'Allocate, reconcile or reverse payments'),
    ('expenses.approve', 'accounting', 'Record and approve property expenses and journals'),
    ('maintenance.view', 'maintenance', 'View maintenance requests and work orders'),
    ('maintenance.assign', 'maintenance', 'Approve, assign and verify maintenance work orders'),
    ('documents.view', 'documents', 'Generate signed URLs for authorized documents'),
    ('reports.export', 'reports', 'View and export occupancy and financial reports'),
    ('users.manage', 'users', 'Manage organization team members, roles and permissions')
ON CONFLICT (code) DO NOTHING;
