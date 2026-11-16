# Guri24 RMS — Database Ownership and Multi-Service Architecture Contract

## 1. Architectural Principle

Guri24 RMS employs a single authoritative **Supabase PostgreSQL** database shared across:
1. **Rust / Axum Core API** (Port 8085)
2. **Spring Boot Financial Service** (Port 8086)
3. **Spring Boot Notification Service** (Port 8087)
4. **Python OCR & AI Inference Service** (Port 8000)

### Fundamental Rule:
> **Sharing a single PostgreSQL database does not grant every service permission to modify every table.**
> Every business domain has exactly **one** authoritative owning service. Only the authoritative owning service is granted write permissions (`INSERT`, `UPDATE`, `DELETE`) on its tables.

Any cross-service request to mutate data owned by another domain must occur via:
- **Synchronous REST APIs** for immediate query/response needs.
- **Asynchronous Domain Events & Transactional Outbox** for event-driven updates.

---

## 2. Service Ownership Matrix

| Domain / Capability | Authoritative Owning Service | Allowed Database Writers | Allowed Database Readers | Communication Protocol |
|---|---|---|---|---|
| **Organizations & Membership** | Rust Core API | `guri24_rust_app` | `guri24_rust_app`, `guri24_spring_app` | REST / JWT Context |
| **Properties, Buildings, Floors, Units** | Rust Core API | `guri24_rust_app` | `guri24_rust_app`, `guri24_spring_app` | Synchronous REST (`/api/v1/properties`) |
| **Tenants & Applications** | Rust Core API | `guri24_rust_app` | `guri24_rust_app`, `guri24_spring_app` | Event: `TenantCreated` |
| **Lease Agreements & Lifecycle** | Rust Core API | `guri24_rust_app` | `guri24_rust_app`, `guri24_spring_app` | Event: `LeaseActivated` |
| **Maintenance, Work Orders & Inspections** | Rust Core API | `guri24_rust_app` | `guri24_rust_app`, `guri24_spring_app` | Internal REST |
| **Invoices & Billing Schedules** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Synchronous REST (`/api/v1/finance/invoices`) / Event: `InvoiceIssued` |
| **Payments & M-Pesa Daraja Integration** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Callback: Daraja C2B/STK / Event: `PaymentVerified`, `PaymentAllocated` |
| **FIFO Payment Allocation** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app` | Internal Domain Transaction |
| **Security Deposits (Account 2100 Escrow)** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Event: `DepositReceived`, `RefundRequested`, `RefundApproved` |
| **General Ledger & Double-Entry Accounting** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Synchronous REST (`/api/v1/finance/ledger/*`) |
| **Bank & M-Pesa Reconciliation Engine** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Event: `ReconciliationCompleted` |
| **Financial Statements (P&L, Balance Sheet)** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app`, `guri24_rust_app` (Read-only) | Synchronous REST (`/api/v1/finance/reports/*`) |
| **Financial Audit Events (Append-Only)** | **Spring Boot Finance** | `guri24_spring_app` | `guri24_spring_app` | Append-only Trigger & Outbox |
| **OCR Document Parsing & Layout Extraction** | Python Service (FastAPI) | `guri24_python_app` | `guri24_python_app`, `guri24_rust_app` | Internal REST (`/v1/ocr/extract`) |
| **AI Inference & Assistant Tools** | Rust Core API (Groq) | `guri24_rust_app` | `guri24_rust_app` | Internal Groq API Adapter |
| **Automated Email Notifications** | Spring Boot Notifications | `guri24_spring_app` | `guri24_spring_app` | Outbox Poller / Resend API |

---

## 3. Database Table Ownership Registry

### 3.1 Rust-Owned Tables (`guri24_rust_app`)
The following tables can **only** be modified by the Rust Core API:
- `organizations`, `organization_members`, `users`
- `properties`, `buildings`, `floors`, `units`
- `tenants`, `tenant_applications`, `leases`
- `maintenance_requests`, `work_orders`, `maintenance_costs`
- `inspections`, `inspection_items`
- `vendors`, `documents`, `subscriptions`
- `assistant_conversations`, `assistant_messages`
- `announcements`, `scheduled_jobs`, `audit_logs`
- `outbox_events` (operational outbox)

### 3.2 Spring Boot Finance-Owned Tables (`guri24_spring_app`)
The following tables can **only** be modified by the Spring Boot Financial Service:
- `invoices`, `invoice_items`
- `payments`, `payment_allocations`
- `security_deposit_ledger`, `deposit_refunds`, `deposit_refund_requests`
- `chart_of_accounts`, `accounting_periods`
- `journal_entries`, `journal_lines`
- `property_expenses`
- `reconciliation_batches`, `reconciliation_external_transactions`, `reconciliation_matches`, `reconciliation_exceptions`
- `financial_report_runs`, `financial_audit_events`
- `financial_outbox_events`

### 3.3 Python-Owned Tables (`guri24_python_app`)
- `ocr_jobs`, `ocr_extracted_fields`
- *Strict Boundary Constraint*: Python has `REVOKE ALL` on all financial and tenant personal identity tables. Extracted financial data from vouchers or statements must be submitted via versioned REST APIs to Spring Boot for human review and validation.

---

## 4. Cross-Service Interaction Rules

### Rule 1: No Direct Financial Table Writes Outside Spring Boot
Neither Rust nor Python may execute `INSERT`, `UPDATE`, or `DELETE` statements on `invoices`, `payments`, `journal_entries`, `security_deposit_ledger`, or `property_expenses`. Database-level grants strictly enforce this constraint.

### Rule 2: Synchronous REST Protocol
For user-facing interactions that require an immediate response (e.g. generating an invoice on demand, recording an approved expense voucher, querying trial balance):
- Rust calls Spring Boot: `POST http://financial-service:8086/api/v1/finance/*`
- All calls pass mandatory security headers:
  - `X-Internal-Service-Key`: Pre-shared internal service secret.
  - `X-Organization-Id`: UUID of the authenticated organization.
  - `X-Correlation-Id`: Distributed trace ID for end-to-end auditability.
  - `X-Actor-User-Id`: Authenticated user initiating the transaction.
  - `X-Actor-Role`: Authenticated role (e.g., `FINANCIAL_CONTROLLER`, `PROPERTY_MANAGER`).

### Rule 3: Asynchronous Domain Events & Transactional Outbox
When an operational event occurs in Rust (such as `LeaseActivated` or `TenantCreated`):
1. Rust writes the aggregate mutation and inserts an event record into `outbox_events` inside the **same database transaction**.
2. An asynchronous worker delivers the event payload to Spring Boot.
3. Spring Boot receives the event, verifies idempotency in `processed_domain_events`, and performs financial actions (e.g. creating recurring billing schedules or opening deposit escrow).

### Rule 4: Analytics and Reporting Authority
- **Financial metrics** (Revenue, Collections, Arrears, Expenses, NOI, Deposit Escrow Liabilities) must come authoritatively from the Spring Boot Financial Service.
- **Operational metrics** (Unit inventory, Occupancy %, Work order counts, Inspection status) come from Rust Core API.
- Combined reports must explicitly identify their reporting timestamp and authoritative source.
