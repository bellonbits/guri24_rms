# Database Schema and Table Ownership Documentation

## 1. Multi-Service Role Definition

PostgreSQL engine-level roles enforce the boundaries of the Guri24 RMS multi-service architecture:

| Database Role | Associated Service | Connection String Env Var | Write Access | Read Access |
|---|---|---|---|---|
| `guri24_rust_app` | Rust Core API & Gateway | `DATABASE_URL_RUST` | Master Data, Properties, Units, Leases, Maintenance, Operations | All tables (Read-only projections on finance tables) |
| `guri24_spring_app` | Spring Financial Service | `DATABASE_URL_SPRING` | Invoices, Payments, Deposits, General Ledger, Reconciliation | Finance tables + Read-only reference on properties/units/tenants |
| `guri24_python_app` | Python OCR & AI Service | `DATABASE_URL_PYTHON` | `ocr_jobs`, `ocr_extracted_fields` | `documents` (metadata only). REVOKE on all finance/identity tables |

---

## 2. Granular Table Ownership & Permissions Matrix

### 2.1 Core Master & Operational Domain (Owner: `guri24_rust_app`)

| Table Name | Owning Role | `guri24_rust_app` | `guri24_spring_app` | `guri24_python_app` | Purpose |
|---|---|---|---|---|---|
| `organizations` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Multi-tenant organization boundaries |
| `organization_members` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | User membership & RBAC roles |
| `users` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | User credentials & contact profiles |
| `properties` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Real estate estate/property entities |
| `buildings` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Multi-story building structures |
| `floors` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Building floor levels |
| `units` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Rental units and occupancy state |
| `tenants` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Kenyan tenant master profiles |
| `leases` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Contractual lease agreements & terms |
| `maintenance_requests` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Tenant repair & maintenance tickets |
| `work_orders` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Vendor work order dispatches |
| `maintenance_costs` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Maintenance line-item itemizations |
| `inspections` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Move-in/move-out condition inspections |
| `documents` | `guri24_rust_app` | `ALL` | `SELECT` | `SELECT` | Private S3 document metadata |
| `outbox_events` | `guri24_rust_app` | `ALL` | `SELECT` | `NONE` | Operational transactional outbox |

### 2.2 Financial Intelligence & Ledger Domain (Owner: `guri24_spring_app`)

| Table Name | Owning Role | `guri24_spring_app` | `guri24_rust_app` | `guri24_python_app` | Purpose |
|---|---|---|---|---|---|
| `invoices` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Tenant billing statements |
| `invoice_items` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Rent, water, penalty line items |
| `payments` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Verified M-Pesa / Bank transactions |
| `payment_allocations` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | FIFO settlement breakdown |
| `security_deposit_ledger`| `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Account 2100 escrow liabilities |
| `deposit_refund_requests`| `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | 8-stage move-out refund workflow |
| `chart_of_accounts` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | 1000s-5000s general ledger accounts |
| `journal_entries` | `guri24_spring_app` | `ALL` (No delete)| `SELECT` (Read-only) | `NONE` | Double-entry journal transactions |
| `journal_lines` | `guri24_spring_app` | `ALL` (No delete)| `SELECT` (Read-only) | `NONE` | Balanced debits and credits |
| `property_expenses` | `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Property operating disbursements |
| `reconciliation_batches`| `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Bank/M-Pesa statement import runs |
| `reconciliation_matches`| `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Statement match audit trails |
| `reconciliation_exceptions`| `guri24_spring_app`| `ALL` | `SELECT` (Read-only) | `NONE` | Unmatched transaction disputes |
| `financial_report_runs`| `guri24_spring_app` | `ALL` | `SELECT` (Read-only) | `NONE` | Immutable snapshot financial reports |
| `financial_audit_events`| `guri24_spring_app`| `ALL` (Append)| `SELECT` (Read-only) | `NONE` | Immutable financial audit trail |
| `financial_outbox_events`| `guri24_spring_app`| `ALL` | `SELECT` (Read-only) | `NONE` | Financial domain outbox events |

### 2.3 Document Intelligence & OCR Domain (Owner: `guri24_python_app`)

| Table Name | Owning Role | `guri24_python_app` | `guri24_rust_app` | `guri24_spring_app` | Purpose |
|---|---|---|---|---|---|
| `ocr_jobs` | `guri24_python_app` | `ALL` | `SELECT, INSERT` | `NONE` | Document extraction jobs |
| `ocr_extracted_fields`| `guri24_python_app`| `ALL` | `SELECT` | `NONE` | Candidate fields awaiting human review |

---

## 3. Financial Immutability & Security Triggers

1. **Delete Protection on Financial Ledgers**:
   PostgreSQL trigger `trg_protect_journal_immutability` blocks any `DELETE` operation on `journal_entries` and `journal_lines`. Corrections can only be executed by posting an offsetting reversal entry.

2. **Deposit Liability Segregation Check**:
   Security deposit receipts must specify Account 2100 as the credit account and must not credit Account 4000 (Rental Revenue).

3. **Multi-Tenant Row-Level Security (RLS)**:
   Every table contains an `organization_id` column indexed with foreign key reference `REFERENCES organizations(id) ON DELETE CASCADE`.
