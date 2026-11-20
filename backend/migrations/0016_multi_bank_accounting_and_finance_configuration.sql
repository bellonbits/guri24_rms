-- =============================================================================
-- Migration 0016: Multi-Bank Accounting, Channel Configuration & Statement Imports
-- =============================================================================

-- 1. Organization Financial Settings
CREATE TABLE IF NOT EXISTS organization_financial_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    legal_name VARCHAR(180) NOT NULL,
    reporting_currency CHAR(3) NOT NULL DEFAULT 'KES',
    timezone VARCHAR(64) NOT NULL DEFAULT 'Africa/Nairobi',
    fiscal_year_start VARCHAR(10) NOT NULL DEFAULT '01-01',
    fiscal_year_end VARCHAR(10) NOT NULL DEFAULT '12-31',
    accounting_basis VARCHAR(16) NOT NULL DEFAULT 'ACCRUAL' CHECK (accounting_basis IN ('ACCRUAL', 'CASH')),
    default_reporting_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_configured BOOLEAN NOT NULL DEFAULT FALSE,
    configured_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id)
);

-- 2. Organization Payment & Collection Channels (Bank, M-Pesa Paybill, M-Pesa Till, Cash, Petty Cash)
CREATE TABLE IF NOT EXISTS financial_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    channel_type VARCHAR(32) NOT NULL CHECK (channel_type IN ('BANK', 'MPESA_PAYBILL', 'MPESA_TILL', 'CASH', 'PETTY_CASH', 'OTHER')),
    channel_name VARCHAR(120) NOT NULL,
    identifier VARCHAR(64) NOT NULL, -- Shortcode, Till, Account number, or Cash Box Ref
    gl_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    gl_account_code VARCHAR(32) NOT NULL DEFAULT '1010',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    integration_status VARCHAR(32) NOT NULL DEFAULT 'NOT_CONFIGURED' CHECK (integration_status IN ('NOT_CONFIGURED', 'CONFIGURED', 'OPERATIONAL', 'DEGRADED', 'UNAVAILABLE')),
    config_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Multi-Bank Accounts Configuration
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    bank_name VARCHAR(120) NOT NULL, -- e.g. Equity Bank, NCBA Bank, Co-operative Bank, KCB, Stanbic
    account_name VARCHAR(120) NOT NULL,
    account_number VARCHAR(64) NOT NULL,
    account_currency CHAR(3) NOT NULL DEFAULT 'KES',
    account_type VARCHAR(32) NOT NULL DEFAULT 'OPERATING' CHECK (account_type IN ('OPERATING', 'RENT_COLLECTION', 'ESCROW_DEPOSITS', 'PETTY_CASH', 'SAVINGS')),
    branch_name VARCHAR(120),
    branch_code VARCHAR(32),
    swift_bic VARCHAR(32),
    gl_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    gl_account_code VARCHAR(32) NOT NULL DEFAULT '1010',
    opening_balance_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    opening_balance_date DATE,
    assigned_property_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    reconciliation_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Property Account Mappings (Routing rent, deposits, and expenses per property)
CREATE TABLE IF NOT EXISTS property_account_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    default_collection_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    default_deposit_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    default_expense_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, property_id)
);

-- 5. Opening Balances (Historical verified balance migration with balanced journal posting)
CREATE TABLE IF NOT EXISTS opening_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    account_code VARCHAR(32) NOT NULL,
    account_name VARCHAR(120) NOT NULL,
    balance_kes NUMERIC(14, 2) NOT NULL CHECK (balance_kes >= 0),
    normal_balance VARCHAR(8) NOT NULL CHECK (normal_balance IN ('DEBIT', 'CREDIT')),
    effective_date DATE NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'POSTED', 'REJECTED')),
    journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
    supporting_document_url TEXT,
    entered_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Bank Statement Imports (CSV & XLSX statement upload and parsing records)
CREATE TABLE IF NOT EXISTS bank_statement_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_format VARCHAR(16) NOT NULL CHECK (file_format IN ('CSV', 'XLSX', 'PDF')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_transactions INTEGER NOT NULL DEFAULT 0,
    total_debit_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    total_credit_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    matched_count INTEGER NOT NULL DEFAULT 0,
    unmatched_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'RECONCILED', 'DISCREPANCIES_FLAGGED', 'FINALIZED')),
    imported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bank Statement Transaction Line Items
CREATE TABLE IF NOT EXISTS bank_statement_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    import_id UUID NOT NULL REFERENCES bank_statement_imports(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    value_date DATE,
    reference VARCHAR(128) NOT NULL,
    check_number VARCHAR(64),
    description TEXT NOT NULL,
    debit_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (debit_kes >= 0),
    credit_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (credit_kes >= 0),
    balance_kes NUMERIC(14, 2),
    match_status VARCHAR(32) NOT NULL DEFAULT 'UNMATCHED' CHECK (match_status IN ('UNMATCHED', 'MATCHED', 'PARTIALLY_MATCHED', 'DUPLICATE', 'AMOUNT_MISMATCH', 'RESOLVED_MANUAL')),
    matched_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    matched_expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
    matched_at TIMESTAMPTZ,
    matched_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Reconciliation Rules & Configuration
CREATE TABLE IF NOT EXISTS reconciliation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rule_name VARCHAR(120) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 1,
    match_strategy VARCHAR(64) NOT NULL DEFAULT 'EXACT_REFERENCE' CHECK (match_strategy IN ('EXACT_REFERENCE', 'AMOUNT_DATE_WINDOW', 'TENANT_NAME_AMOUNT', 'MANUAL_ONLY')),
    date_tolerance_days INTEGER NOT NULL DEFAULT 3,
    auto_reconcile BOOLEAN NOT NULL DEFAULT FALSE,
    column_mapping JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index optimizations
CREATE INDEX IF NOT EXISTS idx_bank_accounts_org ON bank_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_financial_channels_org ON financial_channels(organization_id);
CREATE INDEX IF NOT EXISTS idx_opening_balances_org ON opening_balances(organization_id);
CREATE INDEX IF NOT EXISTS idx_statement_imports_org ON bank_statement_imports(organization_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_statement_txs_import ON bank_statement_transactions(import_id, match_status);
