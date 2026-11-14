-- =============================================================================
-- Migration 0004: Billing, Invoices, M-Pesa Payments, Allocations & Deposits
-- =============================================================================

-- Invoices: Draft | Issued | Partially Paid | Paid | Overdue | Cancelled
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(64) NOT NULL,
    billing_period CHAR(7) NOT NULL, -- Format: YYYY-MM (e.g. 2026-11)
    invoice_type VARCHAR(32) NOT NULL DEFAULT 'MONTHLY_RENT' CHECK (invoice_type IN ('MONTHLY_RENT', 'UTILITY', 'PENALTY', 'DEPOSIT', 'AD_HOC')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal_kes NUMERIC(14, 2) NOT NULL CHECK (subtotal_kes >= 0),
    penalty_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (penalty_kes >= 0),
    credit_applied_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (credit_applied_kes >= 0),
    total_amount_kes NUMERIC(14, 2) NOT NULL CHECK (total_amount_kes >= 0),
    amount_paid_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid_kes >= 0),
    balance_kes NUMERIC(14, 2) NOT NULL CHECK (balance_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED')),
    idempotency_key VARCHAR(128) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, invoice_number),
    UNIQUE (organization_id, idempotency_key)
);

-- Critical idempotency constraint: at most one non-cancelled MONTHLY_RENT invoice per lease per billing_period
CREATE UNIQUE INDEX idx_invoices_unique_lease_period
    ON invoices (organization_id, lease_id, billing_period)
    WHERE invoice_type = 'MONTHLY_RENT' AND status <> 'CANCELLED';

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_code VARCHAR(64) NOT NULL, -- RENT, WATER, GARBAGE, SERVICE_CHARGE, LATE_FEE
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.00 CHECK (quantity > 0),
    unit_price_kes NUMERIC(14, 2) NOT NULL CHECK (unit_price_kes >= 0),
    line_total_kes NUMERIC(14, 2) NOT NULL CHECK (line_total_kes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    credit_note_number VARCHAR(64) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    reason TEXT NOT NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, credit_note_number)
);

-- Payments: Initiated -> Completed | Failed | Reversed
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    property_id UUID REFERENCES properties(id) ON DELETE RESTRICT,
    unit_id UUID REFERENCES units(id) ON DELETE RESTRICT,
    lease_id UUID REFERENCES leases(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    payment_reference VARCHAR(64) NOT NULL,
    idempotency_key VARCHAR(128) NOT NULL,
    payment_method VARCHAR(32) NOT NULL CHECK (payment_method IN ('MPESA_STK', 'MPESA_C2B', 'BANK_TRANSFER', 'MANUAL_ADJUSTMENT')),
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    allocated_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (allocated_amount_kes >= 0),
    unallocated_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (unallocated_amount_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    provider_receipt_number VARCHAR(64), -- e.g. M-Pesa Receipt "SJK8912XYZ"
    payer_phone VARCHAR(32),
    paid_at TIMESTAMPTZ,
    reversed_at TIMESTAMPTZ,
    reversal_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (allocated_amount_kes + unallocated_amount_kes <= amount_kes),
    UNIQUE (organization_id, payment_reference),
    UNIQUE (organization_id, idempotency_key)
);

-- Separate M-Pesa Daraja transaction log with strict duplicate-callback protection
CREATE TABLE mpesa_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    payment_id UUID REFERENCES payments(id) ON DELETE RESTRICT,
    transaction_type VARCHAR(32) NOT NULL CHECK (transaction_type IN ('STK_PUSH', 'C2B_CONFIRMATION', 'C2B_VALIDATION')),
    merchant_request_id VARCHAR(128),
    checkout_request_id VARCHAR(128) UNIQUE,
    mpesa_receipt_number VARCHAR(64) UNIQUE,
    shortcode VARCHAR(32) NOT NULL,
    account_reference VARCHAR(64) NOT NULL,
    phone_number VARCHAR(32) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    result_code INTEGER,
    result_desc TEXT,
    raw_callback_payload JSONB,
    callback_received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    event_type VARCHAR(64) NOT NULL, -- INITIATED, CALLBACK_VERIFIED, ALLOCATED, REVERSED
    amount_kes NUMERIC(14, 2) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Allocations (M:N link between Payments and Invoices with audit trail)
CREATE TABLE payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    allocated_amount_kes NUMERIC(14, 2) NOT NULL CHECK (allocated_amount_kes > 0),
    allocation_strategy VARCHAR(64) NOT NULL DEFAULT 'FIFO_OLDEST_FIRST',
    is_reversed BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    reason TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'COMPLETED', 'REJECTED')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL UNIQUE REFERENCES payments(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(64) NOT NULL,
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pdf_storage_key TEXT,
    UNIQUE (organization_id, receipt_number)
);

-- Security Deposits (Held as Tenant Liability, NEVER treated as rental revenue)
CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    lease_id UUID NOT NULL UNIQUE REFERENCES leases(id) ON DELETE RESTRICT,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    required_amount_kes NUMERIC(14, 2) NOT NULL CHECK (required_amount_kes >= 0),
    received_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (received_amount_kes >= 0),
    deducted_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (deducted_amount_kes >= 0),
    refunded_amount_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (refunded_amount_kes >= 0),
    current_liability_balance_kes NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (current_liability_balance_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'HELD', 'PARTIALLY_DEDUCTED', 'REFUNDED', 'FORFEITED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (current_liability_balance_kes = received_amount_kes - deducted_amount_kes - refunded_amount_kes)
);

CREATE TABLE deposit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    deposit_id UUID NOT NULL REFERENCES deposits(id) ON DELETE RESTRICT,
    transaction_type VARCHAR(32) NOT NULL CHECK (transaction_type IN ('RECEIVED', 'DEDUCTION', 'REFUND')),
    amount_kes NUMERIC(14, 2) NOT NULL CHECK (amount_kes > 0),
    description TEXT NOT NULL,
    reference_id UUID,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_org_status ON invoices(organization_id, status);
CREATE INDEX idx_invoices_tenant ON invoices(organization_id, tenant_id);
CREATE INDEX idx_payments_org_status ON payments(organization_id, status);
CREATE INDEX idx_payments_tenant ON payments(organization_id, tenant_id);
CREATE INDEX idx_payment_allocations_invoice ON payment_allocations(invoice_id);
CREATE INDEX idx_payment_allocations_payment ON payment_allocations(payment_id);
