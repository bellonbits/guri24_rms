# Guri24 RMS — Security Architecture & Kenya Data Protection Act (2019) Compliance

## 1. Authentication & Session Security
- **Password Hashing**: `Argon2id` with random salt per credential (`backend/src/core/security/mod.rs`).
- **Token Lifecycle**: Short-lived signed JWT access tokens (`15 minutes`) paired with SHA-256 hashed rotating refresh tokens (`refresh_tokens` table) with revocation (`revoked_at`) and replacement tracking (`replaced_by_id`).

## 2. Multi-Tenant Data Isolation
- Every query and command receives `TenantContext` extracted from the verified JWT token—never from client request bodies or query strings.
- Cross-tenant access attempts return HTTP `403 Forbidden` and write an immutable entry to `audit_logs`.

## 3. Kenya Data Protection Act (2019) Controls
- **National ID & Passport Protection**: Kenyan National ID numbers are hashed with SHA-256 (`national_id_hash`) for exact-match lookup and masked (`****5678`) in standard UI views (`mask_national_id` in `backend/src/core/security/mod.rs`).
- **Private Document Storage**: Lease agreements, National ID scans, and inspection photos are stored in private S3-compatible buckets under `organizations/{org_id}/documents/{doc_id}/{filename}` and accessed only via short-lived (`900s`) HMAC-signed URLs (`backend/src/integrations/storage/mod.rs`).
- **M-Pesa Webhook Authenticity**: Safaricom Daraja callbacks are verified using HMAC-SHA256 signature verification (`SafaricomDarajaAdapter::verify_callback_signature`) and deduplicated on `checkout_request_id` and `mpesa_receipt_number`.
