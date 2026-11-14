-- =============================================================================
-- Migration 0005: Double-Entry Accounting Foundation & Immutability Controls
-- =============================================================================

-- Chart of Accounts
-- Standard codes:
-- 1010: Cash / M-Pesa Clearing Account (ASSET)
-- 1100: Accounts Receivable - Tenants (ASSET)
-- 2100: Tenant Security Deposits Held (LIABILITY)
-- 2200: Tenant Unallocated Prepayments (LIABILITY)
-- 4000: Residential Rental Revenue (REVENUE)
-- 4100: Utility & Service Charge Recovery (REVENUE)
-- 4200: Late Payment Penalty Revenue (REVENUE)
-- 5000: Property Maintenance & Repairs Expense (EXPENSE)
-- 5100: Property Utilities & Operations Expense (EXPENSE)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    account_code VARCHAR(32) NOT NULL,
    name VARCHAR(120) NOT NULL,
    account_type VARCHAR(32) NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    normal_balance VARCHAR(8) NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    is_system_account BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, account_code)
);

-- Double-Entry Journal Entries (Immutable once POSTED; never deleted)
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    property_id UUID REFERENCES properties(id) ON DELETE RESTRICT,
    entry_number VARCHAR(64) NOT NULL,
    entry_date DATE NOT NULL,
    source_event_type VARCHAR(64) NOT NULL, -- INVOICE_ISSUED, PAYMENT_RECEIVED, DEPOSIT_RECEIVED, DEPOSIT_REFUNDED, EXPENSE_APPROVED, REVERSAL
    source_entity_id UUID NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'POSTED' CHECK (status IN ('POSTED', 'REVERSED')),
    reversal_of_entry_id UUID REFERENCES journal_entries(id) ON DELETE RESTRICT,
    total_debit_kes NUMERIC(14, 2) NOT NULL CHECK (total_debit_kes > 0),
    total_credit_kes NUMERIC(14, 2) NOT NULL CHECK (total_credit_kes > 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (total_debit_kes = total_credit_kes),
    UNIQUE (organization_id, entry_number)
);

CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    tenant_id UUID REFERENCES tenants(id) ON DELETE RESTRICT,
    lease_id UUID REFERENCES leases(id) ON DELETE RESTRICT,
    debit_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (debit_kes >= 0),
    credit_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (credit_kes >= 0),
    memo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK ((debit_kes > 0 AND credit_kes = 0) OR (credit_kes > 0 AND debit_kes = 0))
);

-- Property Operating Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    building_id UUID REFERENCES buildings(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES units(id) ON DELETE RESTRICT,
    expense_number VARCHAR(64) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('MAINTENANCE', 'UTILITIES', 'SECURITY', 'CLEANING', 'INSURANCE', 'LAND_RATES', 'MANAGEMENT_FEE', 'OTHER')),
    vendor_name VARCHAR(180),
    description TEXT NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    expense_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'PAID', 'REJECTED')),
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE RESTRICT,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, expense_number)
);

-- Immutability Trigger: Never allow DELETE on posted journal entries or journal lines
CREATE OR REPLACE FUNCTION prevent_posted_financial_deletion()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Posted financial records are immutable and cannot be deleted. Create a reversing journal entry instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_journal_entry_delete
BEFORE DELETE ON journal_entries
FOR EACH ROW EXECUTE FUNCTION prevent_posted_financial_deletion();

CREATE TRIGGER trg_prevent_journal_line_delete
BEFORE DELETE ON journal_lines
FOR EACH ROW EXECUTE FUNCTION prevent_posted_financial_deletion();

CREATE INDEX idx_journal_entries_org_date ON journal_entries(organization_id, entry_date);
CREATE INDEX idx_journal_lines_entry ON journal_lines(journal_entry_id);
CREATE INDEX idx_journal_lines_account ON journal_lines(organization_id, account_id);
CREATE INDEX idx_expenses_org_property ON expenses(organization_id, property_id);
