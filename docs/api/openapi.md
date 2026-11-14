# Guri24 RMS — Versioned REST API (`/api/v1`) Specification

## 1. Base URL & Headers
- **Base Prefix**: `/api/v1`
- **Authentication**: `Authorization: Bearer <jwt_access_token>`
- **Idempotency**: Mutating financial endpoints (`POST /api/v1/invoices/generate`, `POST /api/v1/payments`, `POST /api/v1/payments/mpesa/stk-push`) require `Idempotency-Key: <uuid>`.
- **Pagination**: `GET` list endpoints accept `?page=1&per_page=25&sort_by=created_at&sort_dir=desc` and return `{ data, meta: { page, per_page, total_items, total_pages } }`.

---

## 2. Core Endpoints

| Method | Path | Role Permission | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Liveness & readiness check |
| `GET` | `/metrics` | Public (Internal scrape) | Prometheus metrics exposition |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & issue JWT + rotating refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Rotate refresh token and issue new access token |
| `POST` | `/api/v1/organizations` | `SuperAdmin` | Onboard new landlord / property management company |
| `GET/POST` | `/api/v1/properties` | `properties:read` / `properties:write` | List or create residential properties |
| `GET/POST` | `/api/v1/buildings` | `properties:read` / `properties:write` | List or create buildings inside a property |
| `GET/POST` | `/api/v1/units` | `units:read` / `units:write` | List or create rental units |
| `GET/POST` | `/api/v1/tenants` | `tenants:read` / `tenants:write` | List or register tenants (normalizes `254XXXXXXXXX` MSISDN) |
| `GET/POST` | `/api/v1/leases` | `leases:read` / `leases:write` | List or activate leases via `LeaseBuilder` |
| `POST` | `/api/v1/invoices/generate` | `billing:write` | Idempotently generate monthly/recurring invoices |
| `POST` | `/api/v1/payments` | `payments:write` | Record & FIFO-allocate payment across open invoices |
| `POST` | `/api/v1/payments/mpesa/stk-push` | `payments:write` / `portal:self` | Trigger Safaricom Daraja STK Push |
| `POST` | `/api/v1/payments/mpesa/callback` | Webhook (HMAC verified) | Idempotent Daraja STK/C2B callback processor |
| `GET` | `/api/v1/accounting/journal-entries` | `accounting:read` | Inspect immutable double-entry ledger |
| `POST` | `/api/v1/accounting/journal-entries/:id/reverse` | `accounting:write` | Post a contra-entry reversal |
| `POST` | `/api/v1/maintenance/:id/transition` | `maintenance:write` | Advance maintenance request through 8-stage workflow |
| `GET` | `/api/v1/documents/:id/download` | `documents:read` | Generate 15-minute presigned S3 download URL |
| `GET` | `/api/v1/reports/executive-summary` | `reports:read` | Generate executive KPI, occupancy & arrears report |
