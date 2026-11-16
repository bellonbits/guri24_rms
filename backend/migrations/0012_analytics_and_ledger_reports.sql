-- =============================================================================
-- Migration 0012: Comprehensive Analytics, Accounting Periods, Financial Reports & Audit Events
-- =============================================================================

-- Accounting Periods (Monthly & Annual Fiscal Accounting Cycles with Locking Controls)
CREATE TABLE IF NOT EXISTS accounting_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_name VARCHAR(64) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 13),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'LOCKED')),
    closed_at TIMESTAMPTZ,
    closed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, fiscal_year, period_number)
);

-- Financial Report Runs (Auditable Snapshot Records of Generated Financial Statements)
CREATE TABLE IF NOT EXISTS financial_report_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    report_type VARCHAR(64) NOT NULL, -- PROFIT_AND_LOSS, BALANCE_SHEET, CASH_FLOW, TRIAL_BALANCE, AGING_RECEIVABLES, COLLECTIONS_REPORT, PROPERTY_PERFORMANCE
    title VARCHAR(180) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    summary_data JSONB NOT NULL,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Audit Events (Strictly Append-Only Audit Trail for Financial Actions)
CREATE TABLE IF NOT EXISTS financial_audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
    event_type VARCHAR(64) NOT NULL, -- JOURNAL_POSTED, JOURNAL_REVERSED, RECONCILIATION_MATCH, REFUND_APPROVED, REFUND_VERIFIED, EXPENSE_APPROVED, REPORT_GENERATED, MANUAL_ADJUSTMENT
    source_entity_type VARCHAR(64) NOT NULL,
    source_entity_id UUID NOT NULL,
    description TEXT NOT NULL,
    before_state JSONB,
    after_state JSONB,
    correlation_id VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index optimizations for multi-tenant analytics & rapid financial rollups
CREATE INDEX IF NOT EXISTS idx_journal_entries_org_date ON journal_entries(organization_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(organization_id, account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org_status_due ON invoices(organization_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_payments_org_date ON payments(organization_id, created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_org_date ON expenses(organization_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_financial_audit_org_created ON financial_audit_events(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_reports_org_type ON financial_report_runs(organization_id, report_type, created_at DESC);
