-- =============================================================================
-- Migration 0006: Maintenance, Vendors, Inspections, Documents, Outbox & Audit
-- =============================================================================

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_name VARCHAR(180) NOT NULL,
    contact_person VARCHAR(180) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    specialty VARCHAR(64) NOT NULL CHECK (specialty IN ('PLUMBING', 'ELECTRICAL', 'CARPENTRY', 'MASONRY', 'PAINTING', 'APPLIANCES', 'SECURITY', 'CLEANING', 'GENERAL')),
    kra_pin VARCHAR(32),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintenance Workflow:
-- SUBMITTED -> REVIEWED -> APPROVED -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED -> CLOSED (or REJECTED)
CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    request_number VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('PLUMBING', 'ELECTRICAL', 'CARPENTRY', 'MASONRY', 'PAINTING', 'APPLIANCES', 'SECURITY', 'PEST_CONTROL', 'GENERAL')),
    priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
    title VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CLOSED')),
    assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    estimated_cost_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (estimated_cost_kes >= 0),
    actual_cost_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (actual_cost_kes >= 0),
    completion_notes TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, request_number)
);

CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    maintenance_request_id UUID NOT NULL UNIQUE REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    work_order_number VARCHAR(64) NOT NULL,
    assigned_vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date DATE,
    instructions TEXT NOT NULL,
    approved_budget_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (approved_budget_kes >= 0),
    actual_cost_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (actual_cost_kes >= 0),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, work_order_number)
);

CREATE TABLE maintenance_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    item_description VARCHAR(180) NOT NULL,
    cost_type VARCHAR(32) NOT NULL CHECK (cost_type IN ('LABOR', 'MATERIALS', 'CALLOUT_FEE')),
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes >= 0),
    chargeable_to_deposit BOOLEAN NOT NULL DEFAULT FALSE,
    expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    lease_id UUID REFERENCES leases(id) ON DELETE SET NULL,
    inspection_type VARCHAR(32) NOT NULL CHECK (inspection_type IN ('MOVE_IN', 'PERIODIC', 'MOVE_OUT')),
    inspection_date DATE NOT NULL,
    inspector_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    overall_condition VARCHAR(32) NOT NULL CHECK (overall_condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED')),
    summary_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inspection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    room_or_area VARCHAR(80) NOT NULL,
    condition VARCHAR(32) NOT NULL CHECK (condition IN ('GOOD', 'WEAR_AND_TEAR', 'DAMAGED')),
    estimated_repair_cost_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (estimated_repair_cost_kes >= 0),
    notes TEXT,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Private S3-compatible Document Management (Signed URLs only)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL CHECK (category IN ('LEASE_AGREEMENT', 'TENANT_ID', 'RECEIPT', 'INVOICE', 'PROPERTY_DEED', 'MAINTENANCE_REPORT', 'INSPECTION_REPORT')),
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    s3_bucket VARCHAR(120) NOT NULL,
    s3_object_key TEXT NOT NULL UNIQUE,
    checksum_sha256 VARCHAR(64) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications, Templates & Announcements
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('SMS', 'EMAIL', 'IN_APP')),
    subject_template VARCHAR(255),
    body_template TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, event_type, channel)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('SMS', 'EMAIL', 'IN_APP')),
    destination VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SENT', 'DELIVERED', 'FAILED')),
    retry_count SMALLINT NOT NULL DEFAULT 0,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    body TEXT NOT NULL,
    audience VARCHAR(32) NOT NULL DEFAULT 'ALL_TENANTS' CHECK (audience IN ('ALL_TENANTS', 'PROPERTY_TENANTS', 'STAFF_ONLY')),
    published_by UUID REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactional Outbox Pattern (Reliable Domain Event Delivery)
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(96) NOT NULL,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED')),
    attempts SMALLINT NOT NULL DEFAULT 0,
    last_error TEXT,
    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(64) NOT NULL, -- MPESA_DARAJA, AFRICASTALKING
    external_event_id VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, external_event_id)
);

CREATE TABLE integration_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL,
    account_identifier VARCHAR(120) NOT NULL,
    encrypted_credentials TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, provider, account_identifier)
);

CREATE TABLE scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    job_type VARCHAR(64) NOT NULL,
    cron_expression VARCHAR(64) NOT NULL,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'IDLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(64),
    action VARCHAR(96) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    ip_address VARCHAR(64),
    changes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_org_status ON maintenance_requests(organization_id, status);
CREATE INDEX idx_documents_org_entity ON documents(organization_id, entity_type, entity_id);
CREATE INDEX idx_outbox_pending ON outbox_events(status, available_at) WHERE status = 'PENDING';
CREATE INDEX idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);
