use chrono::{Duration, Utc};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use uuid::Uuid;

use crate::core::errors::{AppError, AppResult};

type HmacSha256 = Hmac<Sha256>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SignedDocumentUrl {
    pub document_id: Uuid,
    pub signed_url: String,
    pub expires_at: chrono::DateTime<Utc>,
    pub expires_in_seconds: u64,
}

/// Section 5.10 & Section 11: Private S3-Compatible Object Storage Adapter
/// Never exposes public URLs; generates short-lived HMAC-SHA256 pre-signed URLs scoped to organization_id.
pub trait StorageAdapter: Send + Sync {
    fn build_private_object_key(
        &self,
        organization_id: Uuid,
        category: &str,
        file_name: &str,
    ) -> AppResult<String>;

    fn generate_presigned_download_url(
        &self,
        organization_id: Uuid,
        document_id: Uuid,
        object_key: &str,
    ) -> AppResult<SignedDocumentUrl>;
}

pub struct PrivateS3StorageAdapter {
    pub bucket: String,
    pub signing_secret: String,
    pub expiry_seconds: u64,
}

impl PrivateS3StorageAdapter {
    pub fn new(bucket: String, signing_secret: String, expiry_seconds: u64) -> Self {
        Self {
            bucket,
            signing_secret,
            // Enforce short expiration (max 900 seconds = 15 minutes) for private documents
            expiry_seconds: expiry_seconds.clamp(60, 900),
        }
    }
}

impl StorageAdapter for PrivateS3StorageAdapter {
    fn build_private_object_key(
        &self,
        organization_id: Uuid,
        category: &str,
        file_name: &str,
    ) -> AppResult<String> {
        let sanitized: String = file_name
            .chars()
            .filter(|c| c.is_ascii_alphanumeric() || *c == '.' || *c == '-' || *c == '_')
            .collect();
        if sanitized.is_empty() || sanitized.contains("..") {
            return Err(AppError::Validation(
                "Invalid document file name".to_string(),
            ));
        }
        Ok(format!(
            "private/org/{organization_id}/{}/{}/{sanitized}",
            category.to_lowercase(),
            Uuid::new_v4()
        ))
    }

    fn generate_presigned_download_url(
        &self,
        organization_id: Uuid,
        document_id: Uuid,
        object_key: &str,
    ) -> AppResult<SignedDocumentUrl> {
        let expected_prefix = format!("private/org/{organization_id}/");
        if !object_key.starts_with(&expected_prefix) {
            return Err(AppError::TenantIsolationViolation(
                "Cannot sign storage key belonging to another organization".to_string(),
            ));
        }

        let expires_at = Utc::now() + Duration::seconds(self.expiry_seconds as i64);
        let canonical = format!(
            "GET\n{}\n{}\n{}",
            self.bucket,
            object_key,
            expires_at.timestamp()
        );

        let mut mac = HmacSha256::new_from_slice(self.signing_secret.as_bytes())
            .map_err(|e| AppError::Internal(format!("Signing key error: {e}")))?;
        mac.update(canonical.as_bytes());
        let signature = hex::encode(mac.finalize().into_bytes());

        let signed_url = format!(
            "https://s3.af-south-1.amazonaws.com/{}/{}?X-Amz-Expires={}&X-Amz-ExpiresAt={}&X-Amz-Signature={}",
            self.bucket,
            object_key,
            self.expiry_seconds,
            expires_at.timestamp(),
            signature
        );

        Ok(SignedDocumentUrl {
            document_id,
            signed_url,
            expires_at,
            expires_in_seconds: self.expiry_seconds,
        })
    }
}
