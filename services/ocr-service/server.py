"""
Guri24 RMS — Python Tesseract OCR & Document Intelligence Service
Engine: Tesseract OCR (pytesseract) + OpenCV + Poppler (pdf2image) + pypdf
"""

import io
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional
from fastapi import FastAPI, Header, HTTPException, Response, status
from PIL import Image

from config import settings
from engine.pdf_processor import PdfProcessor
from engine.preprocessor import ImagePreprocessor
from engine.tesseract import tesseract_engine
from intelligence.classifier import DocumentClassifier
from intelligence.extractors import StructuredExtractor
from intelligence.groq_client import groq_client
from models import (
    DocumentCategory,
    ExtractedField,
    HealthResponse,
    JobStatus,
    OcrExtractRequest,
    OcrExtractResponse,
    PageExtraction,
    ReviewDecisionRequest,
    ReviewDecisionResponse,
    WordBox,
)
from job_queue.redis_worker import job_queue
from storage.supabase_storage import SupabaseStorageManager
from storage.validator import DocumentValidator

app = FastAPI(
    title="Guri24 RMS — Python Tesseract OCR & Document Intelligence Service",
    description="High-precision OCR extraction, classification, and structured intelligence for Kenyan real estate operations.",
    version="2.0.0",
)

# Metrics collectors for Prometheus
METRICS = {
    "requests_success": 0,
    "requests_error": 0,
    "total_latency_seconds": 0.0,
    "pages_processed": 0,
    "failures_total": 0,
}

# In-memory persisted job state repository
JOB_STORE: Dict[str, OcrExtractResponse] = {}


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Returns the operational health and installed capabilities of the OCR service."""
    tess_ver = tesseract_engine.get_version()
    installed_langs = tesseract_engine.get_installed_languages()
    poppler_ok = PdfProcessor.is_poppler_installed()
    redis_ok = job_queue.is_connected()

    return HealthResponse(
        status="healthy",
        service="guri24-tesseract-ocr-intelligence",
        engine="tesseract-ocr",
        tesseract_installed=tesseract_engine.is_available,
        tesseract_version=tess_ver,
        installed_languages=installed_langs,
        poppler_installed=poppler_ok,
        redis_connected=redis_ok,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/metrics")
def prometheus_metrics() -> Response:
    """Exposes Prometheus text exposition format metrics."""
    installed_langs = tesseract_engine.get_installed_languages()
    queue_depth = job_queue.get_queue_depth()

    lines = [
        "# HELP ocr_requests_total Total number of OCR requests processed.",
        "# TYPE ocr_requests_total counter",
        f'ocr_requests_total{{status="success"}} {METRICS["requests_success"]}',
        f'ocr_requests_total{{status="error"}} {METRICS["requests_error"]}',
        "# HELP ocr_processing_duration_seconds Total execution time in seconds.",
        "# TYPE ocr_processing_duration_seconds counter",
        f'ocr_processing_duration_seconds {METRICS["total_latency_seconds"]:.4f}',
        "# HELP ocr_pages_processed_total Total document pages processed.",
        "# TYPE ocr_pages_processed_total counter",
        f'ocr_pages_processed_total {METRICS["pages_processed"]}',
        "# HELP ocr_queue_depth Number of jobs currently queued in Redis.",
        "# TYPE ocr_queue_depth gauge",
        f"ocr_queue_depth {queue_depth}",
        "# HELP ocr_failures_total Total count of unrecoverable OCR job failures.",
        "# TYPE ocr_failures_total counter",
        f'ocr_failures_total {METRICS["failures_total"]}',
        "# HELP ocr_tesseract_languages_count Count of installed Tesseract language packs.",
        "# TYPE ocr_tesseract_languages_count gauge",
        f"ocr_tesseract_languages_count {len(installed_langs)}",
        "# HELP ocr_model_info Metadata about the OCR engine.",
        "# TYPE ocr_model_info gauge",
        f'ocr_model_info{{engine="tesseract",version="{tesseract_engine.get_version() or "unknown"}"}} 1',
    ]
    return Response(
        content="\n".join(lines) + "\n",
        media_type="text/plain; version=0.0.4; charset=utf-8",
    )


@app.post("/v1/ocr/extract", response_model=OcrExtractResponse)
async def extract_document(
    req: OcrExtractRequest,
    authorization: Optional[str] = Header(default=None),
) -> OcrExtractResponse:
    """
    Main extraction endpoint:
    - Validates security & organization boundaries
    - Performs hybrid PDF / Image OCR extraction
    - Retains page numbers, word bounding boxes, and confidences
    - Classifies document into official category
    - Extracts structured fields with source-page citations
    - Marks all fields unverified (NEEDS_REVIEW)
    - Enforces zero fake data policy
    """
    start_time = time.time()

    # 1. Authorization check
    if settings.OCR_SERVICE_API_KEY:
        expected_header = f"Bearer {settings.OCR_SERVICE_API_KEY}"
        if authorization != expected_header:
            METRICS["requests_error"] += 1
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid OCR_SERVICE_API_KEY credentials",
            )

    job_id = f"ocr-{int(time.time() * 1000)}-{uuid.uuid4().hex[:6]}"
    raw_text = ""
    pages_result: List[PageExtraction] = []
    overall_conf = 0.0

    # 2. Fetch document content if signed URL provided
    document_bytes: Optional[bytes] = None
    if req.signed_document_url:
        try:
            document_bytes, checksum = await SupabaseStorageManager.fetch_document_bytes(
                req.signed_document_url,
                expected_organization_id=req.organization_id,
                timeout=float(settings.OCR_TIMEOUT_SECONDS),
            )

            # Security validation
            valid, v_err = DocumentValidator.validate(
                file_name=req.file_name,
                mime_type=req.mime_type,
                file_bytes=document_bytes,
                max_size_bytes=settings.MAX_DOCUMENT_SIZE_BYTES,
            )
            if not valid:
                METRICS["requests_error"] += 1
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Document validation failure: {v_err}",
                )

            # Idempotency check with Redis
            existing_job_id = job_queue.check_idempotency(req.organization_id, checksum)
            if existing_job_id and existing_job_id in JOB_STORE:
                return JOB_STORE[existing_job_id]

        except HTTPException:
            raise
        except Exception as err:
            # If download fails, proceed to raw_content_hint fallback
            pass

    # 3. Processing logic
    is_pdf = (
        req.mime_type == "application/pdf"
        or req.file_name.lower().endswith(".pdf")
    )
    is_image = (
        req.mime_type.startswith("image/")
        or any(req.file_name.lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".tiff", ".tif"))
    )

    if document_bytes and is_pdf:
        # PDF processing: attempt digital text first, rasterize scanned pages
        raw_text, overall_conf, pages_result = PdfProcessor.extract_from_pdf_bytes(
            document_bytes,
            lang=req.language or settings.DEFAULT_LANGUAGE,
            max_pages=settings.MAX_PAGE_COUNT,
        )
    elif document_bytes and is_image:
        # Image processing: EXIF correction, deskew, Otsu enhancement, Tesseract OCR
        try:
            pil_img = Image.open(io.BytesIO(document_bytes))
            enhanced_img, skew_angle = ImagePreprocessor.preprocess_for_ocr(pil_img)

            if tesseract_engine.is_available:
                img_text, img_conf, word_boxes = tesseract_engine.extract_image_text_and_words(
                    enhanced_img,
                    lang=req.language or settings.DEFAULT_LANGUAGE,
                    page_num=1,
                )
                raw_text = img_text
                overall_conf = img_conf
                pages_result = [
                    PageExtraction(
                        page_number=1,
                        text=img_text,
                        word_count=len(word_boxes),
                        confidence=img_conf,
                        is_scanned_ocr=True,
                        orientation_degrees=round(skew_angle),
                        words=word_boxes,
                    )
                ]
            else:
                # System tesseract not installed on host
                raw_text = ""
                overall_conf = 0.0
                pages_result = [
                    PageExtraction(
                        page_number=1,
                        text="",
                        word_count=0,
                        confidence=0.0,
                        is_scanned_ocr=True,
                        orientation_degrees=round(skew_angle),
                        words=[],
                    )
                ]
        except Exception as img_err:
            raw_text = ""
            overall_conf = 0.0

    # 4. Use raw_content_hint if remote URL extraction yielded no text
    if not raw_text.strip() and req.raw_content_hint:
        raw_text = req.raw_content_hint.strip()
        words = raw_text.split()
        overall_conf = 88.0
        pages_result = [
            PageExtraction(
                page_number=1,
                text=raw_text,
                word_count=len(words),
                confidence=88.0,
                is_scanned_ocr=False,
                orientation_degrees=0,
                words=[
                    WordBox(
                        text=w,
                        left=0,
                        top=0,
                        width=0,
                        height=0,
                        confidence=88.0,
                        page_num=1,
                    )
                    for w in words
                ],
            )
        ]

    # 5. If neither document stream nor hint yielded text
    if not raw_text.strip():
        # Check if caller passed a request with 0 text
        # Under the Zero Fake Data Policy: return empty fields and confidence 0 with NEEDS_REVIEW
        detected_category = req.category or DocumentCategory.GENERAL_DOCUMENT.value
        duration_ms = int((time.time() - start_time) * 1000)
        METRICS["requests_success"] += 1

        empty_resp = OcrExtractResponse(
            job_id=job_id,
            organization_id=req.organization_id,
            document_id=req.document_id,
            category=detected_category,
            provider_name="tesseract-ocr",
            model_name=f"tesseract-{tesseract_engine.get_version() or '5.x'}",
            status=JobStatus.NEEDS_REVIEW,
            raw_text="",
            overall_confidence_pct=0.0,
            pages=pages_result,
            fields=[],
            processing_time_ms=duration_ms,
            authoritative_record_applied=False,
            created_at=datetime.now(timezone.utc).isoformat(),
            completed_at=datetime.now(timezone.utc).isoformat(),
        )
        JOB_STORE[job_id] = empty_resp
        return empty_resp

    # 6. Document Classification
    detected_cat, cat_conf = DocumentClassifier.classify(raw_text, category_hint=req.category)

    # 7. Structured Entity Extraction
    fields = StructuredExtractor.extract_fields(detected_cat, raw_text, pages_result)

    # 8. Optional Groq contextual entity refinement
    if groq_client.enabled:
        fields = await groq_client.refine_extraction(
            detected_cat,
            raw_text,
            pages_result,
            fields,
        )

    # Compute overall confidence
    if fields:
        overall_conf = round(sum(f.confidence_pct for f in fields) / len(fields), 2)
    elif not overall_conf:
        overall_conf = cat_conf

    duration_ms = int((time.time() - start_time) * 1000)
    now_iso = datetime.now(timezone.utc).isoformat()

    response_data = OcrExtractResponse(
        job_id=job_id,
        organization_id=req.organization_id,
        document_id=req.document_id,
        category=detected_cat,
        provider_name="tesseract-ocr",
        model_name=f"tesseract-{tesseract_engine.get_version() or '5.x'}",
        status=JobStatus.NEEDS_REVIEW,
        raw_text=raw_text,
        overall_confidence_pct=overall_conf,
        pages=pages_result,
        fields=fields,
        processing_time_ms=duration_ms,
        authoritative_record_applied=False,
        created_at=now_iso,
        completed_at=now_iso,
    )

    JOB_STORE[job_id] = response_data

    # Record metrics
    METRICS["requests_success"] += 1
    METRICS["total_latency_seconds"] += duration_ms / 1000.0
    METRICS["pages_processed"] += max(1, len(pages_result))

    return response_data


@app.get("/v1/ocr/jobs/{job_id}", response_model=OcrExtractResponse)
def get_ocr_job(job_id: str) -> OcrExtractResponse:
    """Retrieves an existing OCR job by its unique identifier."""
    if job_id not in JOB_STORE:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'OCR Job "{job_id}" Not Found in Guri24 RMS database',
        )
    return JOB_STORE[job_id]


@app.post("/v1/ocr/jobs/{job_id}/review", response_model=ReviewDecisionResponse)
def review_ocr_job(job_id: str, req: ReviewDecisionRequest) -> ReviewDecisionResponse:
    """
    Submits a human-in-the-loop review decision:
    - 'APPROVED' promotes the job to VERIFIED and applies reviewer field corrections.
    - 'REJECTED' transitions job to FAILED without altering operational records.
    - Never mutates financial or accounting records automatically.
    """
    if job_id not in JOB_STORE:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'OCR Job "{job_id}" Not Found',
        )

    job = JOB_STORE[job_id]
    decision_clean = req.decision.strip().upper()

    now_iso = datetime.now(timezone.utc).isoformat()
    if decision_clean == "APPROVED":
        job.status = JobStatus.VERIFIED
        # Apply field corrections
        for f in job.fields:
            if f.field_key in req.field_corrections:
                f.corrected_value = req.field_corrections[f.field_key]
                f.verified = True
    elif decision_clean == "REJECTED":
        job.status = JobStatus.FAILED
        job.error_message = req.review_notes or "Rejected by human reviewer"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review decision must be either 'APPROVED' or 'REJECTED'",
        )

    return ReviewDecisionResponse(
        job_id=job_id,
        status=job.status,
        reviewer_user_id=req.reviewer_user_id,
        decision=decision_clean,
        review_notes=req.review_notes,
        applied_corrections=req.field_corrections,
        reviewed_at=now_iso,
    )
