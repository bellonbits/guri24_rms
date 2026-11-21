from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class JobStatus(str, Enum):
    UPLOADED = "UPLOADED"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    NEEDS_REVIEW = "NEEDS_REVIEW"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class DocumentCategory(str, Enum):
    NATIONAL_ID = "national_id"
    RENTAL_AGREEMENT = "rental_agreement"
    PAYMENT_RECEIPT = "payment_receipt"
    BANK_STATEMENT = "bank_statement"
    MPESA_STATEMENT = "mpesa_statement"
    INVOICE = "invoice"
    PROPERTY_DOCUMENT = "property_document"
    # Legacy / alias compatibility
    TENANT_IDENTIFICATION = "TENANT_IDENTIFICATION"
    LEASE_AGREEMENT = "LEASE_AGREEMENT"
    RECEIPT_OR_INVOICE = "RECEIPT_OR_INVOICE"
    GENERAL_DOCUMENT = "GENERAL_DOCUMENT"


class WordBox(BaseModel):
    text: str
    left: int
    top: int
    width: int
    height: int
    confidence: float
    page_num: int


class PageExtraction(BaseModel):
    page_number: int
    text: str
    word_count: int
    confidence: float
    is_scanned_ocr: bool
    orientation_degrees: int = 0
    words: List[WordBox] = Field(default_factory=list)


class ExtractedField(BaseModel):
    field_key: str
    field_label: str
    extracted_value: str
    confidence_pct: float
    source_page: int = 1
    is_sensitive_pii: bool = False
    verified: bool = False
    corrected_value: Optional[str] = None
    validation_error: Optional[str] = None


class OcrExtractRequest(BaseModel):
    file_name: str
    mime_type: str
    file_size_bytes: int
    page_count: int = 1
    category: Optional[str] = None
    organization_id: str = "org-guri24-001"
    document_id: Optional[str] = None
    signed_document_url: Optional[str] = None
    raw_content_hint: Optional[str] = None
    language: str = "eng"


class OcrExtractResponse(BaseModel):
    job_id: str
    organization_id: str
    document_id: Optional[str] = None
    category: str
    provider_name: str = "tesseract-ocr"
    model_name: str = "tesseract-5.x"
    status: JobStatus
    raw_text: str
    overall_confidence_pct: float
    pages: List[PageExtraction] = Field(default_factory=list)
    fields: List[ExtractedField] = Field(default_factory=list)
    processing_time_ms: int = 0
    error_message: Optional[str] = None
    authoritative_record_applied: bool = False
    created_at: str
    completed_at: Optional[str] = None


class ReviewDecisionRequest(BaseModel):
    decision: str  # "APPROVED" or "REJECTED"
    reviewer_user_id: str
    review_notes: Optional[str] = None
    field_corrections: Dict[str, str] = Field(default_factory=dict)


class ReviewDecisionResponse(BaseModel):
    job_id: str
    status: JobStatus
    reviewer_user_id: str
    decision: str
    review_notes: Optional[str] = None
    applied_corrections: Dict[str, str] = Field(default_factory=dict)
    reviewed_at: str


class HealthResponse(BaseModel):
    status: str
    service: str
    engine: str
    tesseract_installed: bool
    tesseract_version: Optional[str] = None
    installed_languages: List[str] = Field(default_factory=list)
    poppler_installed: bool
    redis_connected: bool
    timestamp: str
