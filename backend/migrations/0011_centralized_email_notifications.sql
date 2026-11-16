-- =============================================================================
-- Migration 0011: Centralized Automated Email Notification Engine & Templates
-- =============================================================================

-- Notification Templates (Branded, versioned, responsive HTML + Plain text)
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    template_key VARCHAR(64) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    category VARCHAR(32) NOT NULL CHECK (category IN ('TENANT', 'STAFF', 'OWNER', 'SYSTEM')),
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    subject_template TEXT NOT NULL,
    html_template TEXT NOT NULL,
    text_template TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, template_key, version)
);

-- Organization Notification Settings & Reminder Schedules
CREATE TABLE IF NOT EXISTS notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rent_reminder_days_before INTEGER NOT NULL DEFAULT 7,
    rent_due_date_reminder BOOLEAN NOT NULL DEFAULT TRUE,
    overdue_reminder_days JSONB NOT NULL DEFAULT '[3, 7, 14, 30]'::jsonb,
    lease_expiry_days JSONB NOT NULL DEFAULT '[90, 60, 30, 7]'::jsonb,
    daily_collection_summary BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_operational_report BOOLEAN NOT NULL DEFAULT TRUE,
    monthly_financial_report BOOLEAN NOT NULL DEFAULT TRUE,
    deposit_liability_summary BOOLEAN NOT NULL DEFAULT TRUE,
    staff_escalation_emails JSONB NOT NULL DEFAULT '[]'::jsonb,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Nairobi',
    email_from VARCHAR(128) NOT NULL DEFAULT 'Guri24 RMS <guri24@aqivo.shop>',
    brand_logo_url TEXT,
    brand_primary_color VARCHAR(32) NOT NULL DEFAULT '#0f172a',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id)
);

-- User Notification Preferences (Tenants & Staff opt-in/opt-out for optional categories)
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(32) NOT NULL,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sms_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id, category)
);

-- Notification Deliveries & Audit Ledger
CREATE TABLE IF NOT EXISTS notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(128),
    recipient_role VARCHAR(64),
    template_key VARCHAR(64) NOT NULL,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED' CHECK (
        status IN ('QUEUED', 'PROCESSING', 'SENT', 'DELIVERED', 'BOUNCED', 'COMPLAINED', 'FAILED', 'SUPPRESSED', 'CANCELLED')
    ),
    provider VARCHAR(32) NOT NULL DEFAULT 'RESEND',
    provider_message_id VARCHAR(128),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    idempotency_key VARCHAR(128),
    related_entity_type VARCHAR(64),
    related_entity_id UUID,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_notification_deliveries_org_status ON notification_deliveries(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_template ON notification_deliveries(template_key);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_recipient ON notification_deliveries(recipient_email);
