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
    pub mpesa_c2b_confirmation_url: String,
    pub mpesa_c2b_validation_url: String,
    pub mpesa_c2b_response_type: String,
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
    pub vision_model: String,
    pub llm_provider: String,
    pub llm_model: String,
    pub llm_api_key: Option<String>,
    pub sms_provider: String,
    pub sms_api_key: Option<String>,
    pub opensms_api_endpoint: String,
    pub opensms_api_token: Option<String>,
    pub opensms_sender_id: Option<String>,
    pub email_provider: String,
    pub smtp_host: Option<String>,
    pub resend_api_key: Option<String>,
    pub resend_from_email: Option<String>,
    pub cloudinary_url: Option<String>,
    pub storage_provider: String,
    pub s3_bucket: String,
    pub s3_signing_secret: String,
    pub s3_signed_url_expiry_secs: u64,
    pub financial_service_url: Option<String>,
    pub notification_service_url: Option<String>,
    pub internal_service_auth_secret: String,
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

        let groq_api_key = non_empty_env("GROQ_API_KEY")
            .or_else(|| non_empty_env("LLM_API_KEY"));
        let groq_model = non_empty_env("GROQ_MODEL")
            .or_else(|| non_empty_env("LLM_MODEL"))
            .unwrap_or_else(|| "openai/gpt-oss-120b".to_string());
        let groq_base_url = non_empty_env("GROQ_BASE_URL")
            .unwrap_or_else(|| "https://api.groq.com/openai/v1".to_string());
        let vision_model = non_empty_env("VISION_MODEL")
            .unwrap_or_else(|| "qwen/qwen3.8-27b".to_string());

        let opensms_api_endpoint = non_empty_env("OPENSMS_API_ENDPOINT")
            .or_else(|| non_empty_env("OPENSMS_API_URL"))
            .unwrap_or_else(|| "https://www.opensms.co.ke/api/v3".to_string());
        let opensms_api_token = non_empty_env("OPENSMS_API_TOKEN");
        let opensms_sender_id = non_empty_env("OPENSMS_SENDER_ID")
            .or_else(|| Some("OPENSMS".to_string()));

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
                .unwrap_or(86_400),
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
            mpesa_c2b_confirmation_url: env::var("MPESA_C2B_CONFIRMATION_URL").unwrap_or_else(|_| {
                "http://143.198.30.249:8088/api/v1/payments/c2b/confirmation".to_string()
            }),
            mpesa_c2b_validation_url: env::var("MPESA_C2B_VALIDATION_URL").unwrap_or_else(|_| {
                "http://143.198.30.249:8088/api/v1/payments/c2b/validation".to_string()
            }),
            mpesa_c2b_response_type: env::var("MPESA_C2B_RESPONSE_TYPE").unwrap_or_else(|_| "Completed".to_string()),
            mpesa_callback_url: env::var("MPESA_CALLBACK_URL").unwrap_or_else(|_| {
                "http://143.198.30.249:8088/api/v1/payments/c2b/confirmation".to_string()
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
            vision_model,
            llm_provider: "groq".to_string(),
            llm_model: groq_model,
            llm_api_key: groq_api_key,
            sms_provider: env::var("SMS_PROVIDER").unwrap_or_else(|_| "opensms".to_string()),
            sms_api_key: non_empty_env("AFRICASTALKING_API_KEY"),
            opensms_api_endpoint,
            opensms_api_token,
            opensms_sender_id,
            email_provider: env::var("EMAIL_PROVIDER").unwrap_or_else(|_| "resend".to_string()),
            smtp_host: non_empty_env("SMTP_HOST"),
            resend_api_key: non_empty_env("RESEND_API_KEY"),
            resend_from_email: non_empty_env("RESEND_FROM_EMAIL")
                .or_else(|| non_empty_env("EMAIL_FROM"))
                .or_else(|| Some("Guri24 RMS <guri24@aqivo.shop>".to_string())),
            cloudinary_url: non_empty_env("CLOUDINARY_URL"),
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
            financial_service_url: non_empty_env("FINANCIAL_SERVICE_URL"),
            notification_service_url: non_empty_env("NOTIFICATION_SERVICE_URL"),
            internal_service_auth_secret: env::var("INTERNAL_SERVICE_AUTH_SECRET")
                .unwrap_or_else(|_| "guri24_internal_mesh_secret_key_2026".to_string()),
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

        let mut sms_missing = Vec::new();
        let is_opensms = self.sms_provider.eq_ignore_ascii_case("opensms");
        if is_opensms {
            if self.opensms_api_token.is_none() {
                sms_missing.push("OPENSMS_API_TOKEN".to_string());
            }
        } else if self.sms_api_key.is_none() {
            sms_missing.push("AFRICASTALKING_API_KEY".to_string());
        }

        let is_resend = self.email_provider.eq_ignore_ascii_case("resend") || self.resend_api_key.is_some();
        let mut email_missing = Vec::new();
        if is_resend {
            if self.resend_api_key.is_none() {
                email_missing.push("RESEND_API_KEY".to_string());
            }
        } else if self.smtp_host.is_none() {
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
                service: "Groq AI Agent & Vision Assistant".to_string(),
                provider: format!("Groq API (AI: {}, Vision: {})", self.groq_model, self.vision_model),
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
                    "PORTAL_CONFIGURABLE (Manage via Settings or Set MPESA_* Keys)".to_string()
                },
                missing_env_vars: mpesa_missing,
            },
            IntegrationStatusItem {
                service: "Transactional SMS Gateway".to_string(),
                provider: if is_opensms {
                    "OpenSMS Kenya (https://www.opensms.co.ke)".to_string()
                } else {
                    self.sms_provider.clone()
                },
                environment: self.app_env.clone(),
                credentials_configured: sms_missing.is_empty(),
                status: if sms_missing.is_empty() {
                    if is_opensms {
                        "OPENSMS_KENYA_CONFIGURED".to_string()
                    } else {
                        "CONFIGURED".to_string()
                    }
                } else {
                    "UNCONFIGURED (Outbox Queuing Active)".to_string()
                },
                missing_env_vars: sms_missing,
            },
            IntegrationStatusItem {
                service: "Transactional Email & Verification".to_string(),
                provider: if is_resend {
                    "Resend API (https://resend.com)".to_string()
                } else {
                    format!("SMTP ({})", self.email_provider)
                },
                environment: self.app_env.clone(),
                credentials_configured: email_missing.is_empty(),
                status: if email_missing.is_empty() {
                    if is_resend {
                        "RESEND_CONFIGURED".to_string()
                    } else {
                        "CONFIGURED".to_string()
                    }
                } else {
                    "UNCONFIGURED (Outbox Queuing Active)".to_string()
                },
                missing_env_vars: email_missing,
            },
            IntegrationStatusItem {
                service: "Cloudinary CDN Image Storage".to_string(),
                provider: "Cloudinary Media Cloud API".to_string(),
                environment: self.app_env.clone(),
                credentials_configured: self.cloudinary_url.is_some(),
                status: if self.cloudinary_url.is_some() {
                    "CLOUDINARY_CONFIGURED".to_string()
                } else {
                    "UNCONFIGURED (Set CLOUDINARY_URL in .env)".to_string()
                },
                missing_env_vars: if self.cloudinary_url.is_none() {
                    vec!["CLOUDINARY_URL".to_string()]
                } else {
                    Vec::new()
                },
            },
            IntegrationStatusItem {
                service: "Enterprise Financial Service".to_string(),
                provider: "Spring Boot 3.3 (Double-Entry GL & M-Pesa Allocations)".to_string(),
                environment: self.app_env.clone(),
                credentials_configured: true,
                status: if self.financial_service_url.is_some() {
                    format!("ACTIVE ({})", self.financial_service_url.as_ref().unwrap())
                } else {
                    "STANDALONE_FALLBACK (Rust Core GL Active)".to_string()
                },
                missing_env_vars: Vec::new(),
            },
            IntegrationStatusItem {
                service: "Enterprise Notification Service".to_string(),
                provider: "Spring Boot 3.3 (Resend API & Scheduled Reminders)".to_string(),
                environment: self.app_env.clone(),
                credentials_configured: true,
                status: if self.notification_service_url.is_some() {
                    format!("ACTIVE ({})", self.notification_service_url.as_ref().unwrap())
                } else {
                    "STANDALONE_FALLBACK (Rust Outbox Active)".to_string()
                },
                missing_env_vars: Vec::new(),
            },
        ]
    }
}
