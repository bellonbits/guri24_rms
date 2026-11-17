-- =============================================================================
-- Migration 0015: User Onboarding, Staff Management, Property Scoping & Platform Administration
-- =============================================================================

-- 1. Invitations Table (Hashed cryptographically, single-use, configurable expiration)
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invitation_type VARCHAR(32) NOT NULL CHECK (invitation_type IN ('ORGANIZATION_ADMIN', 'STAFF', 'TENANT', 'VENDOR')),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    full_name VARCHAR(180) NOT NULL,
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    role_code VARCHAR(64) NOT NULL,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('DRAFT', 'PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED', 'FAILED')),
    property_ids UUID[] DEFAULT '{}'::uuid[],
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    additional_permissions JSONB DEFAULT '[]'::jsonb,
    invitation_message TEXT,
    delivery_status VARCHAR(32) DEFAULT 'QUEUED' CHECK (delivery_status IN ('QUEUED', 'SENT', 'DELIVERED', 'FAILED')),
    delivery_error TEXT,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate pending invitations for the same email within an organization
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_invitation 
ON invitations(organization_id, LOWER(email)) 
WHERE status = 'PENDING';

CREATE INDEX IF NOT EXISTS idx_invitations_token_hash ON invitations(token_hash);
CREATE INDEX IF NOT EXISTS idx_invitations_org_status ON invitations(organization_id, status);

-- 2. Property-Level Access Scoping (Defense-in-depth authorization)
CREATE TABLE IF NOT EXISTS user_property_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    access_level VARCHAR(32) NOT NULL DEFAULT 'FULL' CHECK (access_level IN ('FULL', 'VIEW_ONLY', 'MAINTENANCE_ONLY')),
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_user_prop_access ON user_property_access(user_id, property_id);

-- 3. Access & Identity Audit Logs (Detailed tracking for compliance & Kenya DPA 2019)
CREATE TABLE IF NOT EXISTS access_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(64),
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_audit_org ON access_audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_audit_event ON access_audit_logs(event_type, created_at DESC);

-- 4. User Active Sessions & Revocation
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    session_token_hash VARCHAR(128) NOT NULL UNIQUE,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason TEXT,
    revoked_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(64),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id) WHERE NOT is_revoked;

-- 5. Seed Granular Permissions for Users, Roles, Properties, and Platform Administration
INSERT INTO permissions (code, module, description) VALUES
    ('organization.view', 'organization', 'View organization profile, branding, and details'),
    ('organization.manage', 'organization', 'Update organization operational profile and settings'),
    ('organization.settings.manage', 'organization', 'Manage organization billing strategies and notification policies'),
    ('users.view', 'users', 'View organization team members and staff list'),
    ('users.invite', 'users', 'Create and dispatch invitations to staff, tenants, and vendors'),
    ('users.manage', 'users', 'Manage user details, roles, and assigned property scopes'),
    ('users.suspend', 'users', 'Suspend or reactivate user accounts and revoke active sessions'),
    ('roles.view', 'roles', 'View role definitions and permission mappings'),
    ('roles.manage', 'roles', 'Customize organization roles and permitted capabilities'),
    ('permissions.assign', 'roles', 'Assign additional granular permissions to staff roles'),
    ('properties.manage', 'properties', 'Configure property portfolios, buildings, and unit rules'),
    ('units.manage', 'properties', 'Manage individual unit statuses, features, and specs'),
    ('tenants.manage', 'tenants', 'Update tenant lifecycle, contacts, and identification records'),
    ('leases.manage', 'leases', 'Execute lease renewals, terminations, and legal addenda'),
    ('payments.manage', 'payments', 'Perform manual payment overrides, allocations, and receipts'),
    ('invoices.manage', 'billing', 'Issue manual invoices, credit notes, and adjustments'),
    ('ledger.view', 'finance', 'Access General Ledger, Trial Balance, and double-entry journals'),
    ('reconciliation.manage', 'finance', 'Execute M-Pesa automated Daraja and bank reconciliation batches'),
    ('refunds.manage', 'finance', 'Review and disburse tenant deposit move-out refunds'),
    ('notifications.send', 'notifications', 'Dispatch ad-hoc manual or broadcast notifications'),
    ('documents.manage', 'documents', 'Manage document storage, archiving, and deletion policies'),
    ('analytics.view', 'analytics', 'Access property and portfolio analytics reports'),
    -- Platform-level Super Administrator Permissions
    ('platform.admin', 'platform', 'Full super-administrative access to Guri24 SaaS platform'),
    ('platform.organizations.manage', 'platform', 'Register, approve, suspend, or terminate client organizations'),
    ('platform.subscriptions.manage', 'platform', 'Configure platform pricing plans, quotas, and subscription overrides'),
    ('platform.support.audit', 'platform', 'Perform audited platform support operations and inspect system telemetry')
ON CONFLICT (code) DO NOTHING;

-- 6. Ensure OrganizationAdministrator Role has authoritative access to all tenant-scoped permissions
DO $$
DECLARE
    v_role_id UUID;
    v_perm RECORD;
BEGIN
    FOR v_role_id IN 
        SELECT id FROM roles WHERE code = 'ORGANIZATION_ADMINISTRATOR' OR code = 'ORGANIZATION_ADMIN'
    LOOP
        FOR v_perm IN 
            SELECT id FROM permissions 
            WHERE module NOT IN ('platform') -- Exclude platform-level permissions
        LOOP
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES (v_role_id, v_perm.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;
