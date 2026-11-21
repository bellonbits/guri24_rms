# Guri24 RMS — Python Tesseract OCR & Document Intelligence Service

## 1. Overview
The Guri24 RMS Document Intelligence service is an enterprise-grade OCR extraction, classification, and validation microservice. It uses **Python Tesseract (`pytesseract`)** as the optical character recognition engine, paired with **OpenCV** for computer vision preprocessing (orientation correction and deskew), **Poppler (`pdf2image`)** for rasterization, and **`pypdf`** for high-speed direct text extraction from digitally generated PDFs.

---

## 2. Core Capabilities

### 2.1 Supported Document Formats
* **PDF** (`application/pdf`)
* **JPEG / JPG** (`image/jpeg`)
* **PNG** (`image/png`)
* **TIFF** (`image/tiff`)
* **WebP** (`image/webp`)

### 2.2 Processing Architecture
* **Direct Digital Extraction First**: For PDFs, `pypdf` extracts embedded text directly. If meaningful digital text exists, rasterization is skipped, improving throughput and reducing CPU load.
* **Hybrid Scanned Page Processing**: Scanned or image-only PDF pages are rasterized at 300 DPI via Poppler and routed through the image enhancement pipeline.
* **Computer Vision Preprocessing**:
  1. *EXIF Orientation Correction*: Adjusts rotation based on smartphone/scanner camera tags.
  2. *Deskewing*: Computes text baseline skew angles using OpenCV `minAreaRect` and rotates the image to make text horizontal.
  3. *Noise Removal & Binarization*: Applies Gaussian smoothing and Otsu's adaptive thresholding for high-contrast character edges.
* **Word-Level Bounding Boxes & Confidence**: Captured using `pytesseract.image_to_data()` with coordinates `(left, top, width, height)` and real confidence estimates.
* **Configurable Language Packs**: Default language is English (`eng`). The engine queries `pytesseract.get_languages()` and only exposes installed language packs.

---

## 3. Document Classification & Intelligence

The service automatically classifies documents into seven official operational categories:

| Document Category | Key Indicators & Patterns | Extracted Structured Entities |
| :--- | :--- | :--- |
| **National Identification** (`national_id`) | Republic of Kenya, Kitambulisho, Serial No, DOB, Sex | `full_name`, `id_number`, `date_of_birth`, `gender` |
| **Rental Agreement** (`rental_agreement`) | Tenancy Agreement, Demised Premises, Monthly Rent | `landlord_name`, `tenant_name`, `property_name`, `unit_number`, `monthly_rent_kes`, `security_deposit_kes`, `lease_start_date` |
| **Payment Receipt** (`payment_receipt`) | Official Receipt, Received From, M-Pesa Receipt | `transaction_reference`, `amount_kes`, `payer_name`, `payment_date` |
| **Bank Statement** (`bank_statement`) | Bank Statement, Account No, Opening/Closing Balance | `account_number` (masked), `opening_balance`, `closing_balance` |
| **M-Pesa Statement** (`mpesa_statement`) | Safaricom M-Pesa Statement, Paid In, Withdrawn | `transaction_reference`, `amount_kes`, `customer_name` |
| **Invoice** (`invoice`) | Tax Invoice, Invoice No, Due Date, Total Payable | `invoice_number`, `total_amount_kes` |
| **Property Document** (`property_document`) | Title Deed, Certificate of Lease, LR No, Proprietor | `lr_number`, `registered_proprietor` |

All extracted fields retain `source_page` references and are marked unverified (`verified: false`, `status: NEEDS_REVIEW`) until reviewed by an authorized staff member.

---

## 4. Financial & Operational Guardrails (Section 7)

> **Important Boundary Rule**:
> OCR is an extraction tool, not an accounting authority.

* The OCR service **NEVER** automatically confirms a tenant payment, posts a journal entry to the general ledger, approves a deposit refund, or activates a lease.
* **Spring Boot** remains the sole financial system of record.
* **Rust** backend services remain the authoritative owner of tenancy and operational records.
* **Zero Fake Data Policy**: If a document contains no text, confidence is reported as `0.0` and fields as `[]`. Synthetic fallback records are strictly prohibited.

---

## 5. API Reference

### Health & Capabilities
`GET /health`
```json
{
  "status": "healthy",
  "service": "guri24-tesseract-ocr-intelligence",
  "engine": "tesseract-ocr",
  "tesseract_installed": true,
  "tesseract_version": "5.5.0",
  "installed_languages": ["eng", "osd"],
  "poppler_installed": true,
  "redis_connected": true,
  "timestamp": "2026-11-21T13:00:00Z"
}
```

### Prometheus Metrics
`GET /metrics`
* `ocr_requests_total{status="success|error"}`
* `ocr_processing_duration_seconds`
* `ocr_pages_processed_total`
* `ocr_queue_depth`
* `ocr_failures_total`
* `ocr_tesseract_languages_count`

### Extraction Request
`POST /v1/ocr/extract`
```json
{
  "file_name": "national_id_mwangi.pdf",
  "mime_type": "application/pdf",
  "file_size_bytes": 1048576,
  "page_count": 1,
  "organization_id": "org-guri24-001",
  "category": "TENANT_IDENTIFICATION",
  "signed_document_url": "https://storage.guri24.co.ke/documents/...",
  "language": "eng"
}
```

### Human-in-the-Loop Review
`POST /v1/ocr/jobs/{job_id}/review`
```json
{
  "decision": "APPROVED",
  "reviewer_user_id": "usr-admin-001",
  "review_notes": "Identity card matches national database",
  "field_corrections": {
    "full_name": "Peter Gatitu Mwangi"
  }
}
```

---

## 6. Docker Deployment

### Build & Run
```bash
# Build Docker image
docker build -t guri24-ocr-service:latest -f Dockerfile .

# Run with environment variables
docker run -d \
  --name guri24-ocr \
  -p 8000:8000 \
  --env-file .env \
  guri24-ocr-service:latest
```

### Verification inside Container
```bash
docker exec -it guri24-ocr tesseract --version
docker exec -it guri24-ocr tesseract --list-langs
docker exec -it guri24-ocr curl -f http://localhost:8000/health
```

---

## 7. Automated Testing
Run the comprehensive test suite with Python 3.11+:
```bash
python -m pytest tests/ -v
```
All 18 automated tests cover image deskewing, PDF digital extraction, document classification across all 7 types, security validation (MIME, size, traversal, magic bytes), PII log masking, and human review workflows.
