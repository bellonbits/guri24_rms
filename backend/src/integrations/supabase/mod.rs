use std::{
    fs,
    io::Write,
    path::Path,
    process::{Command, Stdio},
};
use chrono::{Duration, Utc};
use hmac::{Hmac, Mac};
use serde::{de::DeserializeOwned, Serialize};
use sha2::Sha256;
use uuid::Uuid;

use crate::{
    core::errors::{AppError, AppResult},
    integrations::storage::{SignedDocumentUrl, StorageAdapter},
};

type HmacSha256 = Hmac<Sha256>;

/// Supabase PostgreSQL & Durable Store Adapter
/// Executes SQL migrations and persists/loads JSONB entity collections into Supabase PostgreSQL (`rms_domain_store`)
/// with a write-through local snapshot file at `/app/data/rms_state.json`.
#[derive(Debug, Clone)]
pub struct SupabasePostgresAdapter {
    pub database_url: String,
    pub data_dir: String,
}

impl SupabasePostgresAdapter {
    pub fn new(database_url: String) -> Self {
        let data_dir = std::env::var("RMS_DATA_DIR").unwrap_or_else(|_| "/app/data".to_string());
        Self {
            database_url,
            data_dir,
        }
    }

    pub fn ensure_schema(&self) {
        let _ = fs::create_dir_all(&self.data_dir);
        let sql = "CREATE TABLE IF NOT EXISTS rms_domain_store (
            collection_key VARCHAR(64) PRIMARY KEY,
            payload JSONB NOT NULL DEFAULT '[]'::jsonb,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );";
        let _ = self.exec_psql(sql);
    }

    fn exec_psql(&self, sql: &str) -> Result<String, String> {
        if self.database_url.is_empty() {
            return Err("SUPABASE_DATABASE_URL is empty".to_string());
        }
        let mut child = Command::new("psql")
            .arg(&self.database_url)
            .arg("-X")
            .arg("-q")
            .arg("-t")
            .arg("-A")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("psql spawn failed: {e}"))?;

        if let Some(mut stdin) = child.stdin.take() {
            let _ = stdin.write_all(sql.as_bytes());
        }

        let output = child
            .wait_with_output()
            .map_err(|e| format!("psql wait failed: {e}"))?;
        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
        }
    }

    pub fn save_collection<T: Serialize>(&self, key: &str, items: &T) {
        if let Ok(json_str) = serde_json::to_string(items) {
            let _ = fs::create_dir_all(&self.data_dir);
            let file_path = Path::new(&self.data_dir).join(format!("{key}.json"));
            let _ = fs::write(file_path, &json_str);

            let escaped = json_str.replace('\'', "''");
            let sql = format!(
                "INSERT INTO rms_domain_store (collection_key, payload, updated_at) \
                 VALUES ('{key}', '{escaped}'::jsonb, NOW()) \
                 ON CONFLICT (collection_key) DO UPDATE \
                 SET payload = EXCLUDED.payload, updated_at = NOW();"
            );
            let _ = self.exec_psql(&sql);
        }
    }

    pub fn load_collection<T: DeserializeOwned>(&self, key: &str) -> Option<T> {
        let sql = format!(
            "SELECT payload::text FROM rms_domain_store WHERE collection_key = '{key}' LIMIT 1;"
        );
        if let Ok(out) = self.exec_psql(&sql) {
            if !out.is_empty() {
                if let Ok(parsed) = serde_json::from_str::<T>(&out) {
                    return Some(parsed);
                }
            }
        }
        let file_path = Path::new(&self.data_dir).join(format!("{key}.json"));
        if let Ok(contents) = fs::read_to_string(file_path) {
            if let Ok(parsed) = serde_json::from_str::<T>(&contents) {
                return Some(parsed);
            }
        }
        None
    }
}

/// Private Supabase Storage Adapter
/// Uses SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET for private bucket objects
/// and short-lived signed URLs, without ever exposing service-role credentials to the browser.
pub struct SupabasePrivateStorageAdapter {
    pub supabase_url: Option<String>,
    pub service_role_key: Option<String>,
    pub bucket: String,
    pub signing_secret: String,
    pub expiry_seconds: u64,
}

impl SupabasePrivateStorageAdapter {
    pub fn new(
        supabase_url: Option<String>,
        service_role_key: Option<String>,
        bucket: String,
        signing_secret: String,
        expiry_seconds: u64,
    ) -> Self {
        Self {
            supabase_url,
            service_role_key,
            bucket,
            signing_secret,
            expiry_seconds: expiry_seconds.clamp(60, 900),
        }
    }
}

impl StorageAdapter for SupabasePrivateStorageAdapter {
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

        let base_host = self
            .supabase_url
            .as_deref()
            .unwrap_or("https://storage.supabase.co");
        let signed_url = format!(
            "{}/storage/v1/object/sign/{}/{}?token={}&expires_in={}",
            base_host.trim_end_matches('/'),
            self.bucket,
            object_key,
            signature,
            self.expiry_seconds
        );

        Ok(SignedDocumentUrl {
            document_id,
            signed_url,
            expires_at,
            expires_in_seconds: self.expiry_seconds,
        })
    }
}
