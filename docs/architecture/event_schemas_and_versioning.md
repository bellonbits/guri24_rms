# Guri24 RMS — Domain Event Schemas and Versioning Policy

## 1. Event Architecture Principles

Asynchronous cross-service communication in Guri24 RMS is mediated through **strongly-typed, versioned domain events** persisted via the **Transactional Outbox Pattern**.

### Guiding Principles:
1. **At-Least-Once Delivery & Consumer Idempotency**: Consumers must enforce idempotency using `(consumer_service, event_id)` records in `processed_domain_events`.
2. **Standard CloudEvents-Compatible Envelope**: Every event carries standard routing metadata including `organization_id`, `correlation_id`, `trace_id`, and `schema_version`.
3. **Payload Self-Sufficiency**: Events carry sufficient context so downstream consumers do not need to make synchronous back-queries for basic metadata.
4. **Timezone Standardization**: All timestamps are formatted as ISO 8601 UTC strings (`YYYY-MM-DDTHH:MM:SS.sssZ`).

---

## 2. Standard Domain Event Envelope

```json
{
  "$schema": "https://guri24rms.co.ke/schemas/v1/event-envelope.json",
  "event_id": "9a12c842-8356-4c7b-b5a1-77889900aabb",
  "event_type": "TenantCreated",
  "schema_version": "1.0",
  "producer_service": "rust-core-api",
  "timestamp": "2026-11-16T20:45:00.000Z",
  "organization_id": "90fa1d84-772d-4a91-ac20-872bb04faf70",
  "correlation_id": "corr-8f192b-20261116",
  "trace_id": "trace-44a1-89bc-1122",
  "payload": {}
}
```

---

## 3. Event Versioning & Evolution Policy

1. **Semantic Versioning (`MAJOR.MINOR`)**:
   - `MINOR` bump (`1.0` -> `1.1`): Adding optional fields or metadata. Fully backward-compatible. Consumers must ignore unknown fields.
   - `MAJOR` bump (`1.0` -> `2.0`): Renaming fields, changing data types, or removing fields. Requires side-by-side publishing during migration.
2. **Consumer Tolerance**:
   - Consumers must use permissive JSON deserialization (e.g. `@JsonIgnoreProperties(ignoreUnknown = true)` in Java Jackson, `#[serde(default)]` in Rust Serde).
3. **Deprecation Window**:
   - A major version must be supported for at least **90 days** alongside its successor before being sunset.

---

## 4. Complete Domain Event Catalogue

### 4.1 Master Data & Operations Events (Produced by Rust)

#### 1. `TenantCreated` (`v1.0`)
Triggered when a tenant profile is registered in the system.
```json
{
  "event_type": "TenantCreated",
  "schema_version": "1.0",
  "producer_service": "rust-core-api",
  "payload": {
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "national_id": "12345678",
    "full_name": "John Kamau",
    "email": "john.kamau@example.co.ke",
    "phone": "254712345678",
    "created_at": "2026-11-16T20:45:00Z"
  }
}
```

#### 2. `LeaseActivated` (`v1.0`)
Triggered when a lease contract becomes active, triggering Spring Boot to schedule recurring billing and deposit requests.
```json
{
  "event_type": "LeaseActivated",
  "schema_version": "1.0",
  "producer_service": "rust-core-api",
  "payload": {
    "lease_id": "c86f7881-807e-406e-8ff5-cf1f044d0811",
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "property_id": "90fa1d84-772d-4a91-ac20-872bb04faf70",
    "unit_id": "b18d2d3a-156c-4623-b1c4-54c30c33d267",
    "start_date": "2026-12-01",
    "end_date": "2027-11-30",
    "monthly_rent_kes": 35000.00,
    "security_deposit_required_kes": 35000.00,
    "billing_day_of_month": 5
  }
}
```

---

### 4.2 Billing & Invoice Events (Produced by Spring Boot Finance)

#### 3. `InvoiceIssued` (`v1.0`)
Triggered when a new invoice is posted to the ledger.
```json
{
  "event_type": "InvoiceIssued",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "invoice_id": "e931fa38-2d83-4a11-a83d-392182c49a11",
    "invoice_number": "INV-2026-00104",
    "lease_id": "c86f7881-807e-406e-8ff5-cf1f044d0811",
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "billing_period": "2026-11",
    "due_date": "2026-11-05",
    "total_amount_kes": 36850.00,
    "items": [
      { "category": "RENT", "amount_kes": 35000.00 },
      { "category": "WATER", "amount_kes": 1850.00 }
    ]
  }
}
```

---

### 4.3 Payment & M-Pesa Events (Produced by Spring Boot Finance)

#### 4. `PaymentInitiated` (`v1.0`)
Triggered when an M-Pesa STK Push authorization prompt is requested.
```json
{
  "event_type": "PaymentInitiated",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "payment_id": "p821fa33-8711-4099-a112-998811223344",
    "checkout_request_id": "ws_CO_16112026203000_12345678",
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "amount_kes": 36850.00,
    "msisdn": "254712345678",
    "initiated_at": "2026-11-16T20:30:00Z"
  }
}
```

#### 5. `PaymentVerified` (`v1.0`)
Triggered when an authoritative Daraja callback confirms receipt of funds into Account 1010.
```json
{
  "event_type": "PaymentVerified",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "payment_id": "p821fa33-8711-4099-a112-998811223344",
    "mpesa_receipt_number": "QJH7891234",
    "checkout_request_id": "ws_CO_16112026203000_12345678",
    "amount_kes": 36850.00,
    "journal_entry_id": "j821fa33-8711-4099-a112-998811223344",
    "verified_at": "2026-11-16T20:30:15Z"
  }
}
```

#### 6. `PaymentFailed` (`v1.0`)
Triggered when user cancels STK prompt or has insufficient M-Pesa balance.
```json
{
  "event_type": "PaymentFailed",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "payment_id": "p821fa33-8711-4099-a112-998811223344",
    "checkout_request_id": "ws_CO_16112026203000_12345678",
    "failure_code": "1032",
    "failure_reason": "Request cancelled by user",
    "failed_at": "2026-11-16T20:31:00Z"
  }
}
```

#### 7. `PaymentAllocated` (`v1.0`)
Triggered when verified payment funds are allocated against outstanding invoices.
```json
{
  "event_type": "PaymentAllocated",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "payment_id": "p821fa33-8711-4099-a112-998811223344",
    "allocations": [
      {
        "invoice_id": "e931fa38-2d83-4a11-a83d-392182c49a11",
        "allocated_amount_kes": 36850.00,
        "remaining_invoice_balance_kes": 0.00
      }
    ],
    "unallocated_advance_kes": 0.00,
    "allocated_at": "2026-11-16T20:30:16Z"
  }
}
```

---

### 4.4 Security Deposit & Move-Out Refund Events (Produced by Spring Boot Finance)

#### 8. `DepositReceived` (`v1.0`)
Triggered when a security deposit is received into segregated escrow (Account 2100).
```json
{
  "event_type": "DepositReceived",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "deposit_id": "d821fa33-8711-4099-a112-998811223344",
    "lease_id": "c86f7881-807e-406e-8ff5-cf1f044d0811",
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "amount_kes": 35000.00,
    "account_code": "2100",
    "received_at": "2026-11-16T20:35:00Z"
  }
}
```

#### 9. `RefundRequested` (`v1.0`)
Triggered upon move-out inspection when initial deductions are calculated.
```json
{
  "event_type": "RefundRequested",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "refund_request_id": "r821fa33-8711-4099-a112-998811223344",
    "deposit_id": "d821fa33-8711-4099-a112-998811223344",
    "tenant_id": "d4e21a92-911e-4581-872f-537482f3a21b",
    "initial_deposit_kes": 35000.00,
    "deductions_kes": 5000.00,
    "requested_refund_amount_kes": 30000.00,
    "requested_at": "2026-11-16T20:40:00Z"
  }
}
```

#### 10. `RefundApproved` (`v1.0`)
Triggered when the Property Manager or Financial Controller approves the net refund calculation.
```json
{
  "event_type": "RefundApproved",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "refund_request_id": "r821fa33-8711-4099-a112-998811223344",
    "approved_by_user_id": "u111fa33-8711-4099-a112-998811223344",
    "approved_payout_kes": 30000.00,
    "approved_at": "2026-11-16T20:42:00Z"
  }
}
```

#### 11. `RefundExecutionVerified` (`v1.0`)
Triggered when the B2C payout reference is verified, closing out the liability from Account 2100.
```json
{
  "event_type": "RefundExecutionVerified",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "refund_request_id": "r821fa33-8711-4099-a112-998811223344",
    "external_payout_ref": "B2C_QJH998877",
    "payout_amount_kes": 30000.00,
    "journal_entry_id": "j900fa33-8711-4099-a112-998811223344",
    "disbursed_at": "2026-11-16T20:44:00Z"
  }
}
```

---

### 4.5 Bank & M-Pesa Reconciliation Events (Produced by Spring Boot Finance)

#### 12. `ReconciliationCompleted` (`v1.0`)
Triggered when a statement import batch finishes automated reconciliation.
```json
{
  "event_type": "ReconciliationCompleted",
  "schema_version": "1.0",
  "producer_service": "spring-financial-service",
  "payload": {
    "batch_id": "b821fa33-8711-4099-a112-998811223344",
    "file_name": "Mpesa_Statement_Oct2026.csv",
    "statement_channel": "MPESA_STATEMENT",
    "total_records": 120,
    "matched_records": 118,
    "exception_records": 2,
    "completed_at": "2026-11-16T20:45:00Z"
  }
}
```
