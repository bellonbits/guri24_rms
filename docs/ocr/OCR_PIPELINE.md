# Module 19 — OCR & Document Intelligence Pipeline (`ocr`)

## Architecture & Provider Adapter
- **Trait & Adapter**: Implemented in `backend/src/integrations/ocr/mod.rs` (`OcrProvider` trait, `ConfigurableOcrProviderAdapter`, and `OcrProviderFactory`).
- **Resilience**: Protected by `CircuitBreaker` and validates document MIME type (`application/pdf`, `image/png`, `image/jpeg`, `image/webp`), file size (`<= 15 MB`), and page count (`<= 50 pages`).
- **Pipeline Lifecycle**: `UPLOADED` → `QUEUED` → `PROCESSING` → `NEEDS_REVIEW` → `VERIFIED` / `FAILED`.
- **Supported Categories**:
  1. `TENANT_IDENTIFICATION` (Kenyan National ID / Passport / KRA PIN)
  2. `LEASE_AGREEMENT` (Property, Unit, Tenant, Monthly Rent, Deposit, Start/End Dates)
  3. `RECEIPT_OR_INVOICE` (Vendor, Receipt/Invoice Number, Date, Total Amount KES)
  4. `PROPERTY_DOCUMENT` (Land Reference LR Number, County, Registered Proprietor)
- **Mandatory Human Verification**: Extracted OCR fields remain staged in `NEEDS_REVIEW` (`authoritative_record_applied = false`) until a user with `ocr.review` permission inspects, optionally corrects, and approves them via `POST /api/v1/ocr/jobs/:id/review`.
