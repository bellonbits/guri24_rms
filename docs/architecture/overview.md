# Guri24 RMS — Modular Monolith Architecture & Design Patterns

## 1. Architectural Vision
Guri24 RMS is engineered as a **Modular Monolith** in Rust (`Axum` + `Tokio` + `SQLx` + `PostgreSQL` + `Redis`) paired with a feature-oriented **Vite + React + TypeScript** web application and installable PWA.

Each backend business domain (`organizations`, `auth`, `properties`, `tenants`, `leases`, `billing`, `payments`, `accounting`, `deposits`, `maintenance`, `documents`, `notifications`, `reports`) enforces strict separation between:
- **Domain Entities & State Machines** (`rust_decimal::Decimal` for all money calculations, never `f32`/`f64`).
- **Application Commands & Queries (CQRS)**.
- **Repository Traits & SQLx PostgreSQL Persistence**.
- **Domain Events & Transactional Outbox**.
- **Versioned HTTP Handlers (`/api/v1/*`)**.

---

## 2. Implementation of the 10 Mandatory Design Patterns

| # | Pattern | Purpose in Guri24 RMS | Primary Implementation |
|---|---|---|---|
| **5.1** | **Repository Pattern** | Abstracts persistence behind async traits (`PropertyRepository`, `TenantRepository`, `LeaseRepository`, `InvoiceRepository`, `PaymentRepository`, `AccountingRepository`, `DepositRepository`, `MaintenanceRepository`) with SQLx transaction support. | `backend/src/modules/*/mod.rs` |
| **5.2** | **CQRS Pattern** | Separates state-mutating `Commands` (`CreatePropertyCommand`, `CreateLeaseCommand`, `GenerateInvoiceCommand`, `RecordPaymentCommand`, `ReverseJournalEntryCommand`, `TransitionMaintenanceStatusCommand`) from read-optimized `Queries` (`GetTenantStatementQuery`, `GetArrearsReportQuery`, `GetOccupancyReportQuery`). | `backend/src/modules/*/mod.rs` |
| **5.3** | **Observer + Transactional Outbox** | Persists domain events (`InvoiceGenerated`, `PaymentReceived`, `PaymentAllocated`, `LeaseCreated`, `MaintenanceSubmitted`, `MaintenanceCompleted`) inside the same PostgreSQL transaction (`outbox_events` table) and dispatches them asynchronously to `AccountingProjectionObserver`, `NotificationObserver`, and `AuditLogObserver`. | `backend/src/core/events/mod.rs` |
| **5.4** | **Factory Pattern** | Dynamically instantiates external infrastructure adapters (`PaymentProviderFactory`, `NotificationProviderFactory`, `StorageProviderFactory`, `AIProviderFactory`) from runtime configuration. | `backend/src/integrations/mod.rs` |
| **5.5** | **Singleton Pattern** | Shares a single thread-safe `Arc<AppState>` across Axum workers containing the `PgPool`, `Config`, `InMemoryEventBus`, `RateLimiterDecorator`, and `CircuitBreaker` instances without mutable global variables. | `backend/src/database/mod.rs` |
| **5.6** | **Strategy Pattern** | Pluggable financial algorithms: `RentCalculationStrategy` (`FullMonthRentStrategy`, `DailyProratedRentStrategy`), `LateFeeStrategy` (`PercentageLateFeeStrategy`, `FlatLateFeeStrategy`, `GracePeriodNoFeeStrategy`), `PaymentAllocationStrategy` (`FifoInvoiceAllocationStrategy`), `DepositCalculationStrategy`, and `NotificationDeliveryStrategy`. | `backend/src/modules/billing/mod.rs`, `backend/src/modules/payments/mod.rs`, `backend/src/modules/deposits/mod.rs` |
| **5.7** | **Decorator / Middleware Pattern** | Wraps HTTP routes with security headers, request ID correlation, sliding-window rate limiting (`RateLimiterDecorator`), and JWT `TenantContext` extraction. | `backend/src/core/middleware/mod.rs` |
| **5.8** | **Circuit Breaker Pattern** | Protects M-Pesa Daraja, SMS, Email, and AI calls via a 3-state machine (`Closed` -> `Open` -> `HalfOpen`) so external outages degrade gracefully without crashing core accounting flows. | `backend/src/core/circuit_breaker/mod.rs` |
| **5.9** | **Builder Pattern** | Enforces multi-step invariant validation before constructing `LeaseBuilder`, `InvoiceBuilder`, `ReceiptBuilder`, `ReportBuilder`, and `NotificationBuilder`. | `backend/src/modules/leases/mod.rs`, `backend/src/modules/billing/mod.rs`, `backend/src/modules/payments/mod.rs`, `backend/src/modules/reports/mod.rs` |
| **5.10** | **Adapter Pattern** | Translates Safaricom Daraja STK Push & C2B JSON payloads, Africa's Talking SMS APIs, SMTP/Postmark emails, S3 presigned URLs, and LLM APIs into clean internal Rust traits. | `backend/src/integrations/mpesa/mod.rs`, `backend/src/integrations/sms/mod.rs`, `backend/src/integrations/storage/mod.rs` |

---

## 3. Multi-Tenancy Isolation Model
1. **Shared Database, Shared Schema, Strict `organization_id` Partitioning**: Every business table includes a non-nullable `organization_id UUID NOT NULL REFERENCES organizations(id)` indexed as the leading column in composite indexes.
2. **Zero Client Trust**: `TenantContext` (`backend/src/core/tenant_context/mod.rs`) is extracted exclusively from the verified JWT access token. Any attempt by Organization A to read or mutate Organization B's resources fails with `403 Forbidden` (`AppError::TenantIsolationViolation`).
