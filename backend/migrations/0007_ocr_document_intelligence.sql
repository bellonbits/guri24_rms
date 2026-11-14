-- Migration 0007: OCR and Document Intelligence Pipeline
-- Enforces multi-tenant organization_id isolation and human-in-the-loop review audit trails.

CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL CHECK (version_number >= 1),
    s3_object_key TEXT NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
    sha256_checksum VARCHAR(64) NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, document_id, version_number)
);

CREATE TABLE IF NOT EXISTS document_pages (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL CHECK (page_number >= 1),
    orientation_degrees INTEGER NOT NULL DEFAULT 0,
    width_px INTEGER,
    height_px INTEGER,
    extracted_raw_text TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, document_id, page_number)
);

CREATE TABLE IF NOT EXISTS ocr_jobs (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document_category VARCHAR(64) NOT NULL,
    provider_name VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (
        status IN ('UPLOADED', 'QUEUED', 'PROCESSING', 'NEEDS_REVIEW', 'VERIFIED', 'FAILED')
    ),
    page_count INTEGER NOT NULL DEFAULT 1 CHECK (page_count >= 1 AND page_count <= 100),
    overall_confidence_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    linked_entity_type VARCHAR(64),
    linked_entity_id UUID,
    submitted_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ocr_jobs_org_status ON ocr_jobs(organization_id, status);

CREATE TABLE IF NOT EXISTS ocr_results (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ocr_job_id UUID NOT NULL REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    raw_text TEXT NOT NULL,
    overall_confidence_pct NUMERIC(5, 2) NOT NULL,
    processing_time_ms INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ocr_extracted_fields (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ocr_job_id UUID NOT NULL REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    field_key VARCHAR(64) NOT NULL,
    field_label VARCHAR(120) NOT NULL,
    extracted_value TEXT NOT NULL,
    corrected_value TEXT,
    confidence_pct NUMERIC(5, 2) NOT NULL,
    is_sensitive_pii BOOLEAN NOT NULL DEFAULT FALSE,
    validation_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ocr_fields_job ON ocr_extracted_fields(organization_id, ocr_job_id);

CREATE TABLE IF NOT EXISTS ocr_reviews (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ocr_job_id UUID NOT NULL REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    reviewer_user_id UUID NOT NULL REFERENCES users(id),
    decision VARCHAR(32) NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
    review_notes TEXT,
    field_changes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_processing_events (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    ocr_job_id UUID NOT NULL REFERENCES ocr_jobs(id) ON DELETE CASCADE,
    previous_status VARCHAR(32),
    new_status VARCHAR(32) NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
