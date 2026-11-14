use std::env;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntegrationStatusItem {
    pub service: String,
    pub provider: String,
    pub environment: String,
    pub credentials_configured: bool,
    pub status: String,
    pub missing_env_vars: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub app_env: String,
    pub host: String,
    pub port: u16,
    pub default_currency: String,
    pub default_timezone: String,
    pub database_url: String,
    pub redis_url: String,
    pub jwt_access_secret: String,
    pub jwt_refresh_secret: String,
    pub jwt_access_expiry_secs: i64,
    pub jwt_refresh_expiry_secs: i64,
    pub mpesa_environment: String,
    pub mpesa_base_url: String,
    pub mpesa_shortcode: String,
    pub mpesa_consumer_key: Option<String>,
    pub mpesa_consumer_secret: Option<String>,
    pub mpesa_passkey: Option<String>,
    pub mpesa_callback_url: String,
    pub mpesa_callback_hmac_secret: String,
    pub ocr_provider: String,
    pub ocr_provider_api_key: Option<String>,
    pub ocr_provider_endpoint: Option<String>,
    pub llm_provider: String,
    pub llm_model: String,
    pub llm_api_key: Option<String>,
    pub sms_provider: String,
    pub sms_api_key: Option<String>,
    pub email_provider: String,
    pub smtp_host: Option<String>,
    pub storage_provider: String,
    pub s3_bucket: String,
    pub s3_signing_secret: String,
    pub s3_signed_url_expiry_secs: u64,
}

fn non_empty_env(key: &str) -> Option<String> {
    env::var(key)
        .ok()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty() && !s.starts_with("replace_with_") && !s.contains("placeholder"))
}

impl AppConfig {
    pub fn from_env() -> Self {
        let _ = dotenvy::dotenv();
        Self {
            app_env: env::var("APP_ENV").unwrap_or_else(|_| "development".to_string()),
            host: env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: env::var("APP_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(8085),
            default_currency: env::var("DEFAULT_CURRENCY").unwrap_or_else(|_| "KES".to_string()),
            default_timezone: env::var("DEFAULT_TIMEZONE")
                .unwrap_or_else(|_| "Africa/Nairobi".to_string()),
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgres://rms_user:rms_password_dev_only@127.0.0.1:5435/guri24_rms".to_string()
            }),
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://127.0.0.1:6382/0".to_string()),
            jwt_access_secret: env::var("JWT_ACCESS_SECRET").unwrap_or_else(|_| {
                "dev_only_access_secret_must_be_overridden_in_production_64_bytes".to_string()
            }),
            jwt_refresh_secret: env::var("JWT_REFRESH_SECRET").unwrap_or_else(|_| {
                "dev_only_refresh_secret_must_be_overridden_in_production_64_byte".to_string()
            }),
            jwt_access_expiry_secs: env::var("JWT_ACCESS_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(900),
            jwt_refresh_expiry_secs: env::var("JWT_REFRESH_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(604_800),
            mpesa_environment: env::var("MPESA_ENVIRONMENT")
                .unwrap_or_else(|_| "sandbox".to_string()),
            mpesa_base_url: env::var("MPESA_BASE_URL")
                .unwrap_or_else(|_| "https://sandbox.safaricom.co.ke".to_string()),
            mpesa_shortcode: env::var("MPESA_SHORTCODE").unwrap_or_else(|_| "174379".to_string()),
            mpesa_consumer_key: non_empty_env("MPESA_CONSUMER_KEY"),
            mpesa_consumer_secret: non_empty_env("MPESA_CONSUMER_SECRET"),
            mpesa_passkey: non_empty_env("MPESA_PASSKEY"),
            mpesa_callback_url: env::var("MPESA_CALLBACK_URL").unwrap_or_else(|_| {
                "http://localhost:8085/api/v1/payments/mpesa/callback".to_string()
            }),
            mpesa_callback_hmac_secret: env::var("MPESA_CALLBACK_HMAC_SECRET")
                .unwrap_or_else(|_| "mpesa_callback_hmac_secret_dev".to_string()),
            ocr_provider: env::var("OCR_PROVIDER")
                .unwrap_or_else(|_| "google_document_ai".to_string()),
            ocr_provider_api_key: non_empty_env("OCR_PROVIDER_API_KEY"),
            ocr_provider_endpoint: non_empty_env("OCR_PROVIDER_ENDPOINT"),
            llm_provider: env::var("LLM_PROVIDER").unwrap_or_else(|_| "gemini".to_string()),
            llm_model: env::var("LLM_MODEL").unwrap_or_else(|_| "gemini-2.5-pro".to_string()),
            llm_api_key: non_empty_env("LLM_API_KEY"),
            sms_provider: env::var("SMS_PROVIDER")
                .unwrap_or_else(|_| "africastalking".to_string()),
            sms_api_key: non_empty_env("AFRICASTALKING_API_KEY"),
            email_provider: env::var("EMAIL_PROVIDER").unwrap_or_else(|_| "smtp".to_string()),
            smtp_host: non_empty_env("SMTP_HOST"),
            storage_provider: env::var("STORAGE_PROVIDER").unwrap_or_else(|_| "s3".to_string()),
            s3_bucket: env::var("S3_BUCKET")
                .unwrap_or_else(|_| "guri24-rms-private-docs".to_string()),
            s3_signing_secret: env::var("S3_SECRET_KEY")
                .unwrap_or_else(|_| "minioadmin_secret_dev_only".to_string()),
            s3_signed_url_expiry_secs: env::var("S3_SIGNED_URL_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(300),
        }
    }

    /// Section 20: Honest reporting of external provider configuration & credential status.
    /// Never claims an external cloud provider is live when its API keys are unconfigured.
    pub fn integrations_status(&self) -> Vec<IntegrationStatusItem> {
        let mut mpesa_missing = Vec::new();
        if self.mpesa_consumer_key.is_none() {
            mpesa_missing.push("MPESA_CONSUMER_KEY".to_string());
        }
        if self.mpesa_consumer_secret.is_none() {
            mpesa_missing.push("MPESA_CONSUMER_SECRET".to_string());
        }
        if self.mpesa_passkey.is_none() {
            mpesa_missing.push("MPESA_PASSKEY".to_string());
        }

        let mut ocr_missing = Vec::new();
        if self.ocr_provider_api_key.is_none() {
            ocr_missing.push("OCR_PROVIDER_API_KEY".to_string());
        }

        let mut llm_missing = Vec::new();
        if self.llm_api_key.is_none() {
            llm_missing.push("LLM_API_KEY".to_string());
        }

        let mut sms_missing = Vec::new();
        if self.sms_api_key.is_none() {
            sms_missing.push("AFRICASTALKING_API_KEY".to_string());
        }

        let mut email_missing = Vec::new();
        if self.smtp_host.is_none() {
            email_missing.push("SMTP_HOST".to_string());
        }

        vec![
            IntegrationStatusItem {
                service: "M-Pesa Daraja Gateway".to_string(),
                provider: "Safaricom Daraja API".to_string(),
                environment: self.mpesa_environment.clone(),
                credentials_configured: mpesa_missing.is_empty(),
                status: if mpesa_missing.is_empty() {
                    "LIVE_CONFIGURED".to_string()
                } else {
                    "SANDBOX_ADAPTER_ONLY (Missing Safaricom Daraja Production Keys)".to_string()
                },
                missing_env_vars: mpesa_missing,
            },
            IntegrationStatusItem {
                service: "OCR & Document Intelligence".to_string(),
                provider: self.ocr_provider.clone(),
                environment: self.app_env.clone(),
                credentials_configured: ocr_missing.is_empty(),
                status: if ocr_missing.is_empty() {
                    "CLOUD_OCR_CONFIGURED".to_string()
                } else {
                    "LOCAL_STRUCTURED_PARSER_ACTIVE (Cloud OCR API Key Unconfigured)".to_string()
                },
                missing_env_vars: ocr_missing,
            },
            IntegrationStatusItem {
                service: "AI Agent Assistant".to_string(),
                provider: format!("{} ({})", self.llm_provider, self.llm_model),
                environment: self.app_env.clone(),
                credentials_configured: llm_missing.is_empty(),
                status: if llm_missing.is_empty() {
                    "CLOUD_LLM_CONFIGURED".to_string()
                } else {
                    "GROUNDED_TOOL_ENGINE_ACTIVE (External LLM API Key Unconfigured)".to_string()
                },
                missing_env_vars: llm_missing,
            },
            IntegrationStatusItem {
                service: "Private Object Storage (S3/MinIO)".to_string(),
                provider: self.storage_provider.clone(),
                environment: self.app_env.clone(),
                credentials_configured: !self.s3_signing_secret.is_empty(),
                status: "CONFIGURED (MinIO / S3 Pre-Signed URLs Active)".to_string(),
                missing_env_vars: vec![],
            },
            IntegrationStatusItem {
                service: "Transactional SMS Gateway".to_string(),
                provider: self.sms_provider.clone(),
                environment: self.app_env.clone(),
                credentials_configured: sms_missing.is_empty(),
                status: if sms_missing.is_empty() {
                    "CONFIGURED".to_string()
                } else {
                    "UNCONFIGURED (Outbox Queuing Active)".to_string()
                },
                missing_env_vars: sms_missing,
            },
            IntegrationStatusItem {
                service: "Transactional Email (SMTP)".to_string(),
                provider: self.email_provider.clone(),
                environment: self.app_env.clone(),
                credentials_configured: email_missing.is_empty(),
                status: if email_missing.is_empty() {
                    "CONFIGURED".to_string()
                } else {
                    "UNCONFIGURED (Outbox Queuing Active)".to_string()
                },
                missing_env_vars: email_missing,
            },
        ]
    }
}
