use std::{collections::HashMap, sync::{Arc, RwLock}};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        tenant_context::TenantContext,
    },
    integrations::ocr::{OcrDocument, OcrDocumentCategory, OcrProvider},
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OcrJobStatus {
    Uploaded,
    Queued,
    Processing,
    NeedsReview,
    Verified,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrFieldRecord {
    pub id: Uuid,
    pub field_key: String,
    pub field_label: String,
    pub extracted_value: String,
    pub corrected_value: Option<String>,
    pub confidence_pct: Decimal,
    pub is_sensitive_pii: bool,
    pub validation_error: Option<String>,
}

impl OcrFieldRecord {
    pub fn effective_value(&self) -> &str {
        self.corrected_value
            .as_deref()
            .unwrap_or(&self.extracted_value)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrReviewAudit {
    pub id: Uuid,
    pub reviewer_user_id: Uuid,
    pub decision: String,
    pub review_notes: Option<String>,
    pub field_changes: HashMap<String, String>,
    pub reviewed_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrJobRecord {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub document_id: Uuid,
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: u64,
    pub page_count: u32,
    pub category: OcrDocumentCategory,
    pub provider_name: String,
    pub cloud_credentials_configured: bool,
    pub status: OcrJobStatus,
    pub status_history: Vec<OcrJobStatus>,
    pub raw_text: String,
    pub overall_confidence_pct: Decimal,
    pub fields: Vec<OcrFieldRecord>,
    pub review: Option<OcrReviewAudit>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SubmitOcrJobCommand {
    pub document_id: Option<Uuid>,
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: u64,
    pub page_count: u32,
    pub category: OcrDocumentCategory,
    pub raw_content_hint: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ReviewOcrJobCommand {
    pub approve: bool,
    pub field_corrections: HashMap<String, String>,
    pub review_notes: Option<String>,
}

pub trait OcrRepository: Send + Sync {
    fn submit_and_process_job(
        &self,
        ctx: &TenantContext,
        cmd: SubmitOcrJobCommand,
    ) -> AppResult<OcrJobRecord>;
    fn review_job(
        &self,
        ctx: &TenantContext,
        job_id: Uuid,
        cmd: ReviewOcrJobCommand,
    ) -> AppResult<OcrJobRecord>;
    fn retry_job(&self, ctx: &TenantContext, job_id: Uuid) -> AppResult<OcrJobRecord>;
    fn get_job(&self, ctx: &TenantContext, job_id: Uuid) -> AppResult<OcrJobRecord>;
    fn list_jobs(&self, ctx: &TenantContext) -> AppResult<Vec<OcrJobRecord>>;
}

pub struct InMemoryOcrRepository {
    provider: Arc<dyn OcrProvider>,
    jobs: RwLock<Vec<OcrJobRecord>>,
}

impl InMemoryOcrRepository {
    pub fn new(provider: Arc<dyn OcrProvider>) -> Self {
        Self {
            provider,
            jobs: RwLock::new(Vec::new()),
        }
    }
}

impl OcrRepository for InMemoryOcrRepository {
    fn submit_and_process_job(
        &self,
        ctx: &TenantContext,
        cmd: SubmitOcrJobCommand,
    ) -> AppResult<OcrJobRecord> {
        ctx.require_permission("documents.upload")?;

        let doc = OcrDocument {
            file_name: cmd.file_name.clone(),
            mime_type: cmd.mime_type.clone(),
            file_size_bytes: cmd.file_size_bytes,
            page_count: cmd.page_count,
            category: cmd.category.clone(),
            raw_content_hint: cmd.raw_content_hint.clone(),
        };

        // Pipeline transitions: Uploaded -> Queued -> Processing -> NeedsReview (never auto-Verified!)
        let extraction = self.provider.extract(&doc)?;
        let now = Utc::now();

        let fields = extraction
            .fields
            .into_iter()
            .map(|f| OcrFieldRecord {
                id: Uuid::new_v4(),
                field_key: f.field_key,
                field_label: f.field_label,
                extracted_value: f.extracted_value,
                corrected_value: None,
                confidence_pct: f.confidence_pct,
                is_sensitive_pii: f.is_sensitive_pii,
                validation_error: f.validation_error,
            })
            .collect();

        let job = OcrJobRecord {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            document_id: cmd.document_id.unwrap_or_else(Uuid::new_v4),
            file_name: cmd.file_name,
            mime_type: cmd.mime_type,
            file_size_bytes: cmd.file_size_bytes,
            page_count: cmd.page_count,
            category: cmd.category,
            provider_name: extraction.provider_name,
            cloud_credentials_configured: extraction.cloud_credentials_configured,
            status: OcrJobStatus::NeedsReview,
            status_history: vec![
                OcrJobStatus::Uploaded,
                OcrJobStatus::Queued,
                OcrJobStatus::Processing,
                OcrJobStatus::NeedsReview,
            ],
            raw_text: extraction.raw_text,
            overall_confidence_pct: extraction.overall_confidence_pct,
            fields,
            review: None,
            created_at: now,
            updated_at: now,
        };

        self.jobs.write().unwrap().push(job.clone());
        Ok(job)
    }

    fn review_job(
        &self,
        ctx: &TenantContext,
        job_id: Uuid,
        cmd: ReviewOcrJobCommand,
    ) -> AppResult<OcrJobRecord> {
        ctx.require_permission("ocr.review")?;

        let mut store = self.jobs.write().unwrap();
        let job = store
            .iter_mut()
            .find(|j| j.id == job_id)
            .ok_or_else(|| AppError::NotFound("OCR job not found".to_string()))?;

        ctx.assert_owns_record(job.organization_id)?;

        if job.status != OcrJobStatus::NeedsReview && job.status != OcrJobStatus::Failed {
            return Err(AppError::Conflict(format!(
                "OCR job in status {:?} cannot be reviewed again",
                job.status
            )));
        }

        for field in &mut job.fields {
            if let Some(corrected) = cmd.field_corrections.get(&field.field_key) {
                field.corrected_value = Some(corrected.trim().to_string());
                field.validation_error = None;
            }
        }

        // If approving, ensure no field still has an unresolved validation error
        if cmd.approve {
            if let Some(err_field) = job.fields.iter().find(|f| f.validation_error.is_some()) {
                return Err(AppError::Validation(format!(
                    "Cannot approve OCR job while field '{}' has validation error: {}",
                    err_field.field_key,
                    err_field.validation_error.as_deref().unwrap_or("Invalid value")
                )));
            }
            job.status = OcrJobStatus::Verified;
            job.status_history.push(OcrJobStatus::Verified);
        } else {
            job.status = OcrJobStatus::Failed;
            job.status_history.push(OcrJobStatus::Failed);
        }

        let now = Utc::now();
        job.review = Some(OcrReviewAudit {
            id: Uuid::new_v4(),
            reviewer_user_id: ctx.user_id,
            decision: if cmd.approve {
                "APPROVED".to_string()
            } else {
                "REJECTED".to_string()
            },
            review_notes: cmd.review_notes,
            field_changes: cmd.field_corrections,
            reviewed_at: now,
        });
        job.updated_at = now;

        Ok(job.clone())
    }

    fn retry_job(&self, ctx: &TenantContext, job_id: Uuid) -> AppResult<OcrJobRecord> {
        ctx.require_permission("ocr.review")?;
        let mut store = self.jobs.write().unwrap();
        let job = store
            .iter_mut()
            .find(|j| j.id == job_id)
            .ok_or_else(|| AppError::NotFound("OCR job not found".to_string()))?;

        ctx.assert_owns_record(job.organization_id)?;
        job.status = OcrJobStatus::NeedsReview;
        job.status_history.push(OcrJobStatus::Queued);
        job.status_history.push(OcrJobStatus::Processing);
        job.status_history.push(OcrJobStatus::NeedsReview);
        job.updated_at = Utc::now();
        Ok(job.clone())
    }

    fn get_job(&self, ctx: &TenantContext, job_id: Uuid) -> AppResult<OcrJobRecord> {
        ctx.require_permission("documents.view")?;
        let store = self.jobs.read().unwrap();
        let job = store
            .iter()
            .find(|j| j.id == job_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("OCR job not found".to_string()))?;
        ctx.assert_owns_record(job.organization_id)?;
        Ok(job)
    }

    fn list_jobs(&self, ctx: &TenantContext) -> AppResult<Vec<OcrJobRecord>> {
        ctx.require_permission("documents.view")?;
        let store = self.jobs.read().unwrap();
        Ok(store
            .iter()
            .filter(|j| j.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
