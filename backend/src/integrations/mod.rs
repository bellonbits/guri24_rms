pub mod ai;
pub mod email;
pub mod groq;
pub mod mpesa;
pub mod ocr;
pub mod olmocr;
pub mod sms;
pub mod storage;
pub mod supabase;

use std::{sync::Arc, time::Duration};

use crate::{
    config::AppConfig,
    core::circuit_breaker::CircuitBreaker,
    integrations::{
        ai::{AIAdapter, OperationalInsightsAiAdapter},
        email::{EmailAdapter, ResendEmailAdapter, SmtpEmailAdapter},
        groq::GroqLlmAdapter,
        mpesa::{MpesaAdapter, SafaricomDarajaAdapter},
        ocr::OcrProvider,
        olmocr::AllenAiOlmOcrAdapter,
        sms::{AfricasTalkingSmsAdapter, OpenSmsAdapter, SmsAdapter},
        storage::StorageAdapter,
        supabase::SupabasePrivateStorageAdapter,
    },
};

/// Section 6: Factory Pattern
/// Factories for interchangeable infrastructure adapters selected via configuration.
pub struct PaymentProviderFactory;

impl PaymentProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<dyn MpesaAdapter> {
        let breaker = CircuitBreaker::new("safaricom_daraja_mpesa", 3, Duration::from_secs(30));
        Arc::new(SafaricomDarajaAdapter::new(
            config.mpesa_base_url.clone(),
            config.mpesa_shortcode.clone(),
            config.mpesa_consumer_key.clone(),
            config.mpesa_consumer_secret.clone(),
            config.mpesa_c2b_confirmation_url.clone(),
            config.mpesa_c2b_validation_url.clone(),
            config.mpesa_c2b_response_type.clone(),
            config.mpesa_callback_hmac_secret.clone(),
            breaker,
        ))
    }
}

pub struct OcrProviderFactory;

impl OcrProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<dyn OcrProvider> {
        let breaker = CircuitBreaker::new("allenai_olmocr_service", 3, Duration::from_secs(30));
        Arc::new(AllenAiOlmOcrAdapter::new(
            config.ocr_model.clone(),
            config.ocr_service_url.clone(),
            config.ocr_service_api_key.clone(),
            breaker,
        ))
    }
}

pub struct GroqProviderFactory;

impl GroqProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<GroqLlmAdapter> {
        let breaker = CircuitBreaker::new("groq_llm_api", 3, Duration::from_secs(30));
        Arc::new(GroqLlmAdapter::new(
            config.groq_base_url.clone(),
            config.groq_model.clone(),
            config.groq_api_key.clone(),
            breaker,
        ))
    }
}

pub struct NotificationProviderFactory;

impl NotificationProviderFactory {
    pub fn create_sms(config: &AppConfig) -> Arc<dyn SmsAdapter> {
        let breaker = CircuitBreaker::new("sms_gateway", 3, Duration::from_secs(20));
        if config.sms_provider.eq_ignore_ascii_case("opensms") || config.opensms_api_token.is_some() {
            Arc::new(OpenSmsAdapter::new(
                config.opensms_api_endpoint.clone(),
                config.opensms_api_token.clone().unwrap_or_default(),
                config.opensms_sender_id.clone(),
                breaker,
            ))
        } else {
            Arc::new(AfricasTalkingSmsAdapter::new(
                config.sms_provider.clone(),
                breaker,
            ))
        }
    }

    pub fn create_email(config: &AppConfig) -> Arc<dyn EmailAdapter> {
        let breaker = CircuitBreaker::new("email_gateway", 3, Duration::from_secs(20));
        if config.email_provider.eq_ignore_ascii_case("resend") || config.resend_api_key.is_some() {
            Arc::new(ResendEmailAdapter::new(
                config.resend_api_key.clone(),
                config.resend_from_email.clone().unwrap_or_else(|| "Guri24 RMS <guri24@aqivo.shop>".to_string()),
                breaker,
            ))
        } else {
            Arc::new(SmtpEmailAdapter::new(config.email_provider.clone(), breaker))
        }
    }
}

pub struct StorageProviderFactory;

impl StorageProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<dyn StorageAdapter> {
        Arc::new(SupabasePrivateStorageAdapter::new(
            config.supabase_url.clone(),
            config.supabase_service_role_key.clone(),
            config.supabase_storage_bucket.clone(),
            config.s3_signing_secret.clone(),
            config.s3_signed_url_expiry_secs,
        ))
    }
}

pub struct AIProviderFactory;

impl AIProviderFactory {
    pub fn create() -> Arc<dyn AIAdapter> {
        let breaker = CircuitBreaker::new("ai_insights_provider", 3, Duration::from_secs(30));
        Arc::new(OperationalInsightsAiAdapter::new(breaker))
    }
}
