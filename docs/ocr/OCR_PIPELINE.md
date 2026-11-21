# Module 19 — OCR & Document Intelligence Pipeline (`ocr`)

## 1. Engine & Technology Stack
- **Engine**: Python Tesseract (`pytesseract`) + Tesseract OCR System Engine (5.x).
- **Computer Vision & Preprocessing**: OpenCV (`opencv-python-headless`) for EXIF orientation correction and baseline deskew (`minAreaRect`), Gaussian noise reduction, and Otsu's adaptive binarization.
- **PDF Extraction**: `pypdf` for direct digital PDF extraction; `pdf2image` (Poppler) for high-resolution 300 DPI rasterization of scanned pages.
- **Word Data**: Captured via `pytesseract.image_to_data()` providing bounding box coordinates `(left, top, width, height)` and word-level confidence estimates.
- **Microservice Framework**: FastAPI on Python 3.11+, fully containerized with Docker.

---

## 2. Document Categories & Intelligence
1. `TENANT_IDENTIFICATION` / `national_id` (Kenyan National ID, Alien Card, Passport)
2. `LEASE_AGREEMENT` / `rental_agreement` (Property, Unit, Landlord, Tenant, Monthly Rent, Deposit, Dates)
3. `RECEIPT_OR_INVOICE` / `payment_receipt` (Transaction Reference, Amount KES, Payer, Payment Date)
4. `BANK_STATEMENT` (Masked Account Number, Opening/Closing Balance, Statement Period)
5. `MPESA_STATEMENT` (Safaricom Transaction Code, Inflow/Outflow, Customer Name)
6. `INVOICE` (Invoice Number, Due Date, Total Amount Due KES)
7. `PROPERTY_DOCUMENT` (Land Reference LR Number, Registered Proprietor, County)

---

## 3. Strict Financial & Operational Boundaries
- **No Automatic Accounting Mutations**: OCR is an extraction tool, not an accounting authority. It never posts journal entries to the general ledger, confirms tenant payments, approves refunds, or activates leases.
- **Spring Boot Ownership**: Spring Boot remains the sole financial system of record.
- **Rust Ownership**: Rust remains the owner of property, tenancy, and operational records.
- **Human-in-the-Loop Review**: Extracted OCR fields remain staged in `NEEDS_REVIEW` (`authoritative_record_applied = false`) until an authorized staff member inspects, corrects, and approves the job via `POST /v1/ocr/jobs/:id/review` or the `/app/ocr-documents/review/:id` UI.
- **Zero Fake Data Policy**: Documents without text yield `confidence: 0.0` and `fields: []`. Mock or sample records are strictly prohibited.

---

## 4. Pipeline Lifecycle States
`UPLOADED` → `QUEUED` → `PROCESSING` → `NEEDS_REVIEW` → `VERIFIED` (or `FAILED` / `CANCELLED`).
All state transitions record real timestamps, error messages, and retry counters.
