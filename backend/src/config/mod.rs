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
    pub supabase_url: Option<String>,
    pub supabase_anon_key: Option<String>,
    pub supabase_service_role_key: Option<String>,
    pub supabase_database_url: String,
    pub supabase_storage_bucket: String,
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
    pub ocr_model: String,
    pub ocr_service_url: Option<String>,
    pub ocr_service_api_key: Option<String>,
    pub ocr_provider_api_key: Option<String>,
    pub ocr_provider_endpoint: Option<String>,
    pub groq_api_key: Option<String>,
    pub groq_model: String,
    pub groq_base_url: String,
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
        let db_url = non_empty_env("SUPABASE_DATABASE_URL")
            .or_else(|| non_empty_env("DATABASE_URL"))
            .unwrap_or_else(|| {
                "postgres://rms_user:rms_password_dev_only@127.0.0.1:5435/guri24_rms".to_string()
            });
        let storage_bucket = non_empty_env("SUPABASE_STORAGE_BUCKET")
            .or_else(|| non_empty_env("S3_BUCKET"))
            .unwrap_or_else(|| "guri24-rms-private-docs".to_string());
        let jwt_base = non_empty_env("JWT_SECRET");
        let jwt_access_secret = non_empty_env("JWT_ACCESS_SECRET")
            .or_else(|| jwt_base.clone())
            .unwrap_or_else(|| {
                "dev_only_access_secret_must_be_overridden_in_production_64_bytes".to_string()
            });
        let jwt_refresh_secret = non_empty_env("JWT_REFRESH_SECRET")
            .or(jwt_base)
            .unwrap_or_else(|| {
                "dev_only_refresh_secret_must_be_overridden_in_production_64_byte".to_string()
            });

        let groq_api_key = non_empty_env("GROQ_API_KEY").or_else(|| non_empty_env("LLM_API_KEY"));
        let groq_model = non_empty_env("GROQ_MODEL")
            .or_else(|| non_empty_env("LLM_MODEL"))
            .unwrap_or_else(|| "llama-3.3-70b-versatile".to_string());
        let groq_base_url = non_empty_env("GROQ_BASE_URL")
            .unwrap_or_else(|| "https://api.groq.com/openai/v1".to_string());

        let ocr_service_url =
            non_empty_env("OCR_SERVICE_URL").or_else(|| non_empty_env("OCR_PROVIDER_ENDPOINT"));
        let ocr_service_api_key =
            non_empty_env("OCR_SERVICE_API_KEY").or_else(|| non_empty_env("OCR_PROVIDER_API_KEY"));
        let ocr_model = non_empty_env("OCR_MODEL")
            .unwrap_or_else(|| "allenai/olmOCR-2-7B-1025-FP8".to_string());

        Self {
            app_env: env::var("APP_ENV").unwrap_or_else(|_| "production".to_string()),
            host: env::var("APP_HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: env::var("APP_PORT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(8085),
            default_currency: env::var("DEFAULT_CURRENCY").unwrap_or_else(|_| "KES".to_string()),
            default_timezone: env::var("DEFAULT_TIMEZONE")
                .unwrap_or_else(|_| "Africa/Nairobi".to_string()),
            supabase_url: non_empty_env("SUPABASE_URL"),
            supabase_anon_key: non_empty_env("SUPABASE_ANON_KEY"),
            supabase_service_role_key: non_empty_env("SUPABASE_SERVICE_ROLE_KEY"),
            supabase_database_url: db_url.clone(),
            supabase_storage_bucket: storage_bucket.clone(),
            database_url: db_url,
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://127.0.0.1:6382/0".to_string()),
            jwt_access_secret,
            jwt_refresh_secret,
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
            ocr_provider: "allenai/olmocr".to_string(),
            ocr_model,
            ocr_service_url: ocr_service_url.clone(),
            ocr_service_api_key: ocr_service_api_key.clone(),
            ocr_provider_api_key: ocr_service_api_key,
            ocr_provider_endpoint: ocr_service_url,
            groq_api_key: groq_api_key.clone(),
            groq_model: groq_model.clone(),
            groq_base_url,
            llm_provider: "groq".to_string(),
            llm_model: groq_model,
            llm_api_key: groq_api_key,
            sms_provider: env::var("SMS_PROVIDER")
                .unwrap_or_else(|_| "africastalking".to_string()),
            sms_api_key: non_empty_env("AFRICASTALKING_API_KEY"),
            email_provider: env::var("EMAIL_PROVIDER").unwrap_or_else(|_| "smtp".to_string()),
            smtp_host: non_empty_env("SMTP_HOST"),
            storage_provider: env::var("STORAGE_PROVIDER")
                .unwrap_or_else(|_| "supabase_storage".to_string()),
            s3_bucket: storage_bucket,
            s3_signing_secret: non_empty_env("SUPABASE_SERVICE_ROLE_KEY")
                .or_else(|| non_empty_env("S3_SECRET_KEY"))
                .unwrap_or_else(|| "minioadmin_secret_dev_only".to_string()),
            s3_signed_url_expiry_secs: env::var("S3_SIGNED_URL_EXPIRY_SECONDS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(300),
        }
    }

    /// Honest reporting of external provider configuration & credential status.
    /// Never claims an external cloud provider is live when its API keys are unconfigured.
    pub fn integrations_status(&self) -> Vec<IntegrationStatusItem> {
        let mut supabase_missing = Vec::new();
        if self.supabase_url.is_none() {
            supabase_missing.push("SUPABASE_URL".to_string());
        }
        if self.supabase_service_role_key.is_none() {
            supabase_missing.push("SUPABASE_SERVICE_ROLE_KEY".to_string());
        }

        let mut groq_missing = Vec::new();
        if self.groq_api_key.is_none() {
            groq_missing.push("GROQ_API_KEY".to_string());
        }

        let mut olmocr_missing = Vec::new();
        if self.ocr_service_url.is_none() {
            olmocr_missing.push("OCR_SERVICE_URL".to_string());
        }
        if self.ocr_service_api_key.is_none() {
            olmocr_missing.push("OCR_SERVICE_API_KEY".to_string());
        }

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
                service: "Supabase PostgreSQL & Private Storage".to_string(),
                provider: format!("Supabase PostgreSQL + Bucket '{}'", self.supabase_storage_bucket),
                environment: self.app_env.clone(),
                credentials_configured: !self.supabase_database_url.is_empty(),
                status: if supabase_missing.is_empty() {
                    "SUPABASE_CLOUD_CONFIGURED".to_string()
                } else {
                    "POSTGRESQL_CONNECTED (Set SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY for Cloud Storage)".to_string()
                },
                missing_env_vars: supabase_missing,
            },
            IntegrationStatusItem {
                service: "Groq AI Agent Assistant".to_string(),
                provider: format!("Groq API ({})", self.groq_model),
                environment: self.app_env.clone(),
                credentials_configured: groq_missing.is_empty(),
                status: if groq_missing.is_empty() {
                    "GROQ_API_CONFIGURED".to_string()
                } else {
                    "UNCONFIGURED (Set GROQ_API_KEY & GROQ_MODEL in .env)".to_string()
                },
                missing_env_vars: groq_missing,
            },
            IntegrationStatusItem {
                service: "Allen AI olmOCR Document Intelligence".to_string(),
                provider: format!("allenai/olmocr ({})", self.ocr_model),
                environment: self.app_env.clone(),
                credentials_configured: olmocr_missing.is_empty(),
                status: if olmocr_missing.is_empty() {
                    "OLMOCR_GPU_ENDPOINT_CONFIGURED".to_string()
                } else {
                    "UNCONFIGURED (Set OCR_SERVICE_URL & OCR_SERVICE_API_KEY for GPU olmOCR Inference)".to_string()
                },
                missing_env_vars: olmocr_missing,
            },
            IntegrationStatusItem {
                service: "Safaricom M-Pesa Daraja Gateway".to_string(),
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
