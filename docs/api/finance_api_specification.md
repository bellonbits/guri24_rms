# Spring Boot Financial Service API Specification (v1)

## 1. Overview & Protocol Contract

The **Spring Boot Financial Service** provides the authoritative REST interface for all financial mutations, invoicing, M-Pesa processing, double-entry general ledger, deposit liabilities, and bank reconciliation in Guri24 RMS.

- **Base URL**: `http://financial-service:8086/api/v1/finance`
- **Protocol**: HTTP/1.1 with TLS / mTLS in production.
- **Data Exchange**: JSON (`application/json; charset=UTF-8`).
- **Precision**: Money values are encoded as standard numeric values with 2 decimal places (PostgreSQL `NUMERIC(14, 2)` / Java `BigDecimal`).
- **Timezone**: Africa/Nairobi (`UTC+03:00`).

---

## 2. Mandatory Cross-Service Headers

All requests made by the Rust Core API or external callers must supply the following headers:

| Header Name | Type | Required | Description |
|---|---|---|---|
| `X-Internal-Service-Key` | String | Yes | Pre-shared secret matching `INTERNAL_SERVICE_AUTH_SECRET`. Rejects with `401 Unauthorized` if invalid. |
| `X-Organization-Id` | UUID | Yes | Multi-tenant organization context. Rejects with `400 Bad Request` if omitted. |
| `X-Correlation-Id` | String | Yes | Distributed trace ID for end-to-end auditability. |
| `X-Actor-User-Id` | UUID | Yes | Identifier of the authenticated user performing the action. |
| `X-Actor-Role` | String | Yes | Role of the user (`FINANCIAL_CONTROLLER`, `PROPERTY_MANAGER`, `OWNER`, `SYSTEM`). |

---

## 3. Endpoints Specification

### 3.1 Invoices & Billing

#### `POST /api/v1/finance/invoices`
Generate and post a new rent/utility invoice for a tenant and lease.

**Request Body**:
```json
{
  "property_id": "90fa1d84-772d-4a91-ac20-872bb04faf70",
  "unit_id": "b18d2d3a-156c-4623-b1c4-54c30c33d267",
  "lease_id": "c86f7881-807e-406e-8ff5-cf1f044d0811",
  "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
  "billing_period": "2026-11",
  "due_date": "2026-11-05",
  "items": [
    {
      "description": "Base Residential Rent",
      "category": "RENT",
      "amount_kes": 35000.00
    },
    {
      "description": "Water Consumption (Meter #W-104)",
      "category": "WATER",
      "amount_kes": 1850.00
    }
  ]
}
```

**Response (`201 Created`)**:
```json
{
  "id": "e931fa38-2d83-4a11-a83d-392182c49a11",
  "organization_id": "90fa1d84-772d-4a91-ac20-872bb04faf70",
  "invoice_number": "INV-2026-00104",
  "billing_period": "2026-11",
  "due_date": "2026-11-05",
  "total_amount_kes": 36850.00,
  "paid_amount_kes": 0.00,
  "balance_kes": 36850.00,
  "status": "ISSUED",
  "journal_entry_id": "f821ba33-8711-4099-a112-998811223344",
  "created_at": "2026-11-01T08:00:00Z"
}
```

---

### 3.2 Payments & M-Pesa Integration

#### `POST /api/v1/finance/payments/mpesa/c2b-callback`
Process authoritative C2B confirmation from Safaricom Daraja.

**Request Body**:
```json
{
  "TransactionType": "Pay Bill",
  "TransID": "QJH7891234",
  "TransTime": "20261116203000",
  "TransAmount": "36850.00",
  "BusinessShortCode": "600000",
  "BillRefNumber": "INV-2026-00104",
  "MSISDN": "254712345678",
  "FirstName": "JOHN",
  "LastName": "KAMAU"
}
```

**Response (`200 OK`)**:
```json
{
  "ResultCode": 0,
  "ResultDesc": "Payment accepted and posted to General Ledger Account 1010"
}
```

#### `POST /api/v1/finance/payments/allocate`
Distribute unallocated receipt balance across tenant invoices using FIFO policy.

**Request Body**:
```json
{
  "payment_id": "a821fa33-8711-4099-a112-998811223344",
  "strategy": "FIFO"
}
```

**Response (`200 OK`)**:
```json
{
  "payment_id": "a821fa33-8711-4099-a112-998811223344",
  "allocated_amount_kes": 36850.00,
  "unallocated_amount_kes": 0.00,
  "invoices_settled": ["INV-2026-00104"]
}
```

---

### 3.3 Security Deposits (Account 2100 Liability & Move-Out Refunds)

#### `POST /api/v1/finance/deposits/receive`
Record tenant security deposit into segregated escrow liability.

**Request Body**:
```json
{
  "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
  "lease_id": "c86f7881-807e-406e-8ff5-cf1f044d0811",
  "amount_kes": 50000.00,
  "payment_reference": "QJH1122334"
}
```

**Response (`201 Created`)**:
```json
{
  "deposit_id": "d821fa33-8711-4099-a112-998811223344",
  "status": "HELD_ESCROW",
  "account_code": "2100",
  "current_liability_kes": 50000.00
}
```

#### `POST /api/v1/finance/deposits/refunds/request`
Initiate move-out refund calculation and inspection deduction.

**Request Body**:
```json
{
  "deposit_id": "d821fa33-8711-4099-a112-998811223344",
  "inspection_id": "i711fa33-8711-4099-a112-998811223344",
  "deductions": [
    {
      "description": "Repainting unit walls after unauthorized drilling",
      "category": "REPAIR",
      "amount_kes": 7500.00
    },
    {
      "description": "Unpaid final electricity bill",
      "category": "UTILITY_ARREARS",
      "amount_kes": 2500.00
    }
  ],
  "tenant_payout_msisdn": "254712345678"
}
```

**Response (`201 Created`)**:
```json
{
  "refund_request_id": "r821fa33-8711-4099-a112-998811223344",
  "initial_deposit_kes": 50000.00,
  "total_deductions_kes": 10000.00,
  "refundable_balance_kes": 40000.00,
  "status": "AWAITING_APPROVAL"
}
```

---

### 3.4 General Ledger & Double-Entry Accounting

#### `POST /api/v1/finance/ledger/journals`
Post an immutable, balanced double-entry journal entry.

**Request Body**:
```json
{
  "property_id": "90fa1d84-772d-4a91-ac20-872bb04faf70",
  "description": "Quarterly Generator Fuel Purchase & Service",
  "source_event_type": "EXPENSE_APPROVED",
  "source_entity_id": "e821fa33-8711-4099-a112-998811223344",
  "lines": [
    {
      "account_code": "5000",
      "account_name": "Property Maintenance & Repairs Expense",
      "account_type": "EXPENSE",
      "debit_kes": 18500.00,
      "credit_kes": 0.00,
      "memo": "50L Diesel and oil filter"
    },
    {
      "account_code": "1010",
      "account_name": "M-Pesa & Bank Clearing Account",
      "account_type": "ASSET",
      "debit_kes": 0.00,
      "credit_kes": 18500.00,
      "memo": "M-Pesa Buy Goods payment to Shell"
    }
  ]
}
```

**Response (`201 Created`)**:
```json
{
  "id": "j821fa33-8711-4099-a112-998811223344",
  "entry_number": "JRN-00108",
  "entry_date": "2026-11-16",
  "total_debit_kes": 18500.00,
  "total_credit_kes": 18500.00,
  "status": "POSTED"
}
```

#### `POST /api/v1/finance/ledger/journals/{id}/reverse`
Post a reversing journal entry with inverted debits and credits.

**Request Body**:
```json
{
  "reason": "Voucher recorded with incorrect expense category"
}
```

**Response (`200 OK`)**:
```json
{
  "original_entry_id": "j821fa33-8711-4099-a112-998811223344",
  "reversal_entry_id": "j999fa33-8711-4099-a112-998811223344",
  "reversal_entry_number": "JRN-00109",
  "status": "POSTED"
}
```

---

### 3.5 Financial Statements & Reports

#### `GET /api/v1/finance/reports/overview`
Retrieve reconciled executive overview.
- **Response**: Expected revenue, actual collections, collection rate %, arrears, expenses, NOI, deposit liability.

#### `GET /api/v1/finance/ledger/trial-balance`
Retrieve live trial balance with net-zero validation.
- **Response**: Accounts with Debit/Credit totals, proving `total_debits == total_credits`.

#### `GET /api/v1/finance/ledger/profit-loss`
Retrieve P&L statement.
- **Response**: Operating Revenue − Operating Expenses = Net Operating Income.
