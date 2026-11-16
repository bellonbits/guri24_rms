-- =============================================================================
-- Migration 0010: Financial Operations, Multi-Stage Refunds & Reconciliation Engine
-- =============================================================================

-- Reconciliation Batches (e.g. M-Pesa statements or Bank CSV/XLSX imports)
CREATE TABLE IF NOT EXISTS reconciliation_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    batch_reference VARCHAR(64) NOT NULL,
    source VARCHAR(32) NOT NULL CHECK (source IN ('MPESA_STATEMENT', 'BANK_STATEMENT', 'DARAJA_API_QUERY', 'MANUAL_IMPORT')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_external_count INTEGER NOT NULL DEFAULT 0,
    total_external_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    matched_count INTEGER NOT NULL DEFAULT 0,
    matched_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    unmatched_count INTEGER NOT NULL DEFAULT 0,
    unmatched_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'RECONCILED', 'DISCREPANCIES_FLAGGED', 'FINALIZED')),
    imported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    finalized_by UUID REFERENCES users(id) ON DELETE SET NULL,
    finalized_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, batch_reference)
);

-- External transactions parsed from statements
CREATE TABLE IF NOT EXISTS reconciliation_external_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    external_transaction_id VARCHAR(128) NOT NULL, -- e.g. M-Pesa code "SJK8912XYZ" or bank ref
    transaction_date TIMESTAMPTZ NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    payer_name VARCHAR(128),
    payer_phone VARCHAR(32),
    account_reference VARCHAR(64),
    raw_description TEXT,
    match_status VARCHAR(32) NOT NULL DEFAULT 'UNMATCHED' CHECK (match_status IN ('MATCHED', 'PARTIALLY_MATCHED', 'UNMATCHED', 'DUPLICATE', 'AMOUNT_MISMATCH', 'RESOLVED_MANUAL')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, external_transaction_id)
);

-- Matches between external transactions and internal payment records
CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    external_transaction_id UUID NOT NULL REFERENCES reconciliation_external_transactions(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    match_confidence_pct INTEGER NOT NULL CHECK (match_confidence_pct BETWEEN 0 AND 100),
    match_strategy VARCHAR(64) NOT NULL, -- EXACT_PROVIDER_RECEIPT, AMOUNT_PHONE_WINDOW, MANUAL_REVIEW
    discrepancy_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    is_disputed BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reconciliation Exceptions requiring investigation
CREATE TABLE IF NOT EXISTS reconciliation_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    external_transaction_id UUID REFERENCES reconciliation_external_transactions(id) ON DELETE SET NULL,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    exception_type VARCHAR(64) NOT NULL, -- UNMATCHED_EXTERNAL, UNMATCHED_INTERNAL, AMOUNT_MISMATCH, DUPLICATE_EXTERNAL
    notes TEXT,
    resolution_status VARCHAR(32) NOT NULL DEFAULT 'OPEN' CHECK (resolution_status IN ('OPEN', 'INVESTIGATING', 'RESOLVED', 'WRITTEN_OFF')),
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution_action TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8-Stage Move-Out Security Deposit Refund Workflow
-- Vacates -> Inspection -> Liability Review -> Calculation -> Request -> Approval -> Execution -> Completion
CREATE TABLE IF NOT EXISTS deposit_refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    deposit_id UUID NOT NULL REFERENCES deposits(id) ON DELETE RESTRICT,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    refund_number VARCHAR(64) NOT NULL,
    
    -- Step 1: Vacating details
    actual_vacate_date DATE NOT NULL,
    handover_notes TEXT,
    
    -- Step 2: Inspection reference
    inspection_id UUID,
    inspection_condition_summary TEXT,
    
    -- Step 3 & 4: Deductions and formula calculation
    -- Refundable = Held - Deductions - Previously Refunded
    original_held_deposit_kes NUMERIC(14, 2) NOT NULL CHECK (original_held_deposit_kes >= 0),
    total_deductions_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_deductions_kes >= 0),
    deductions_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    calculated_refundable_kes NUMERIC(14, 2) NOT NULL CHECK (calculated_refundable_kes >= 0),
    
    -- Step 5: Proposed disbursement
    payout_channel VARCHAR(32) NOT NULL CHECK (payout_channel IN ('MPESA_B2C', 'BANK_TRANSFER', 'CHEQUE')),
    payee_phone_or_account VARCHAR(64) NOT NULL,
    payee_name VARCHAR(128) NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Step 6: Approval (Separation of duties: approved_by != requested_by)
    approval_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Step 7 & 8: Execution & Completion
    execution_status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (execution_status IN ('PENDING', 'SUBMITTED', 'CONFIRMED', 'FAILED')),
    payout_transaction_reference VARCHAR(128),
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, refund_number)
);

-- Financial Audit Events (Immutable journal event log for all money operations)
CREATE TABLE IF NOT EXISTS financial_audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    event_type VARCHAR(64) NOT NULL, -- PAYMENT_RECEIVED, PAYMENT_ALLOCATED, ALLOCATION_REVERSED, DEPOSIT_DEDUCTION, DEPOSIT_REFUNDED, RECONCILIATION_POSTED
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(64),
    amount_kes NUMERIC(14, 2),
    summary TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reconciliation_batches_org ON reconciliation_batches(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_reconciliation_ext_tx_batch ON reconciliation_external_transactions(batch_id, match_status);
CREATE INDEX IF NOT EXISTS idx_deposit_refund_requests_org ON deposit_refund_requests(organization_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_financial_audit_events_org ON financial_audit_events(organization_id, event_type);
