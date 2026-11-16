# ADR 002: Hybrid Rust + Spring Boot Enterprise Architecture

## Status
Accepted

## Context
Guri24 RMS has grown into a comprehensive residential rental management platform designed for the Kenyan multi-tenant real estate market. The current architecture employs Rust (`Axum`, `Tokio`, `SQLx`) as the backend modular monolith. To scale enterprise adoption, bank integrations, regulatory double-entry compliance, and enterprise ERP capabilities, the system is being extended into a hybrid enterprise architecture:

1. **Rust + Axum (Primary Core API & Gateway)**: Retains high-performance request routing, multi-tenant organization isolation, authentication (Argon2id + JWT), property/unit/tenant hierarchies, lease lifecycle, document metadata, and Groq-powered AI tool execution.
2. **Java + Spring Boot (Financial Service)**: Dedicated enterprise accounting service managing the General Ledger, double-entry journal balance invariants, chart of accounts, FIFO payment allocation, M-Pesa Daraja callbacks, Account 2100 tenant security deposit liabilities, and automated bank reconciliation.
3. **Java + Spring Boot (Notification Service)**: Dedicated enterprise event-driven notification engine managing multi-channel delivery (Resend API, SMTP fallback, SMS), scheduled rent and lease reminders, periodic portfolio summaries, transactional outbox consumption, and delivery tracking.
4. **Python + Allen AI olmOCR (OCR Service)**: Dedicated microservice serving document layout analysis and OCR extraction via `allenai/olmOCR-2-7B-1025-FP8` and FastAPI.
5. **Supabase PostgreSQL**: The single, authoritative source of truth. No secondary database is introduced.

---

## Service Boundaries & Table Ownership Matrix

| Service | Primary Technology | Port | Authoritative Tables Owned | Responsibilities |
|---|---|---|---|---|
| **Rust Core API** | Rust (Axum, Tokio, SQLx) | `8085` | `organizations`, `organization_members`, `properties`, `buildings`, `floors`, `units`, `tenants`, `tenant_applications`, `leases`, `maintenance_requests`, `documents`, `assistant_conversations`, `assistant_messages` | Primary frontend gateway, auth & RBAC, hierarchy management, AI tool execution, API orchestration. |
| **Spring Financial Service** | Java 21 (Spring Boot 3.3, Spring Data, Hibernate, Resilience4j) | `8086` | `chart_of_accounts`, `accounting_periods`, `journal_entries`, `journal_lines`, `invoices`, `invoice_items`, `payments`, `payment_allocations`, `security_deposit_ledger`, `deposit_refunds`, `property_expenses`, `reconciliation_batches`, `reconciliation_items` | General ledger, double-entry journals, FIFO payment distribution, M-Pesa Daraja callback validation, deposit liabilities (Account 2100), move-out refunds, and bank reconciliation. |
| **Spring Notification Service** | Java 21 (Spring Boot 3.3, Spring Mail, Quartz / Spring Scheduler) | `8087` | `notification_templates`, `notification_settings`, `notification_preferences`, `notification_deliveries`, `notification_logs`, `notification_suppressions` | Event-driven notifications via Resend API, scheduled rent & lease reminders, staff escalation, idempotency deduplication, outbox processing. |
| **Python OCR Service** | Python 3.11 (FastAPI, olmOCR) | `8000` | `ocr_jobs` (execution runtime) | Document layout extraction, PII identification, PDF text parsing. |

---

## Communication Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Frontend (React Vite)    │
                                  └──────────────┬────────────────┘
                                                 │ HTTP /api/v1/* (JWT Auth)
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │   Rust Core API & Gateway     │
                                  │         (Port 8085)           │
                                  └──────┬───────────────┬────────┘
                                         │               │
                 Internal REST (Secret)  │               │ Internal REST (Secret)
             ┌───────────────────────────┘               └───────────────────────────┐
             ▼                                                                       ▼
┌───────────────────────────────┐                                   ┌───────────────────────────────┐
│ Spring Boot Financial Service │                                   │ Spring Boot Notification Svc  │
│         (Port 8086)           │                                   │         (Port 8087)           │
└──────────────┬────────────────┘                                   └──────────────┬────────────────┘
               │                                                                   │
               │                                                                   │
               └───────────────────────┬───────────────────────────────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Supabase PostgreSQL (Shared) │
                       │    Single Source of Truth     │
                       └───────────────────────────────┘
```

---

## Key Invariants & Architectural Rules

1. **Frontend Isolation**: The frontend exclusively communicates with the Rust Core API (`http://localhost:8085/api/v1`). It never directly calls internal Spring Boot or Python ports.
2. **Internal Service Authentication**: Service-to-service REST requests require an `X-Internal-Service-Key` header matching `INTERNAL_SERVICE_AUTH_SECRET`.
3. **Multi-Tenancy Enforcement**: Every request must carry an authenticated `X-Organization-Id` header validated by the caller's JWT `TenantContext`.
4. **Single Source of Truth**: All services connect to the same PostgreSQL instance (`guri24_rms` / Supabase). No separate financial database or notification database is allowed.
5. **Zero Ledger Rollback on Notification Failure**: Outbox and event-driven patterns isolate notification delivery errors from committed financial transactions.
6. **Double-Entry Balance Invariant**: In the financial service, `SUM(debit_kes) == SUM(credit_kes)` for every journal entry. Posted entries are immutable; corrections require explicit reversal journals.
7. **Security Deposit Invariant**: Security deposits must be posted to Liability Account 2100, never to Rental Revenue 4000.
8. **Refund Invariant**: Move-out refunds enforce:
   $$\text{Refundable} = \text{Deposit Held} - \text{Approved Deductions} - \text{Prior Refunds}$$
   and require verified external payout transaction references before issuance.
