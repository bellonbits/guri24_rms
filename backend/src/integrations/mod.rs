pub mod ai;
pub mod email;
pub mod mpesa;
pub mod ocr;
pub mod sms;
pub mod storage;

use std::{sync::Arc, time::Duration};

use crate::{
    config::AppConfig,
    core::circuit_breaker::CircuitBreaker,
    integrations::{
        ai::{AIAdapter, OperationalInsightsAiAdapter},
        email::{EmailAdapter, SmtpEmailAdapter},
        mpesa::{MpesaAdapter, SafaricomDarajaAdapter},
        ocr::{ConfigurableOcrProviderAdapter, OcrProvider},
        sms::{AfricasTalkingSmsAdapter, SmsAdapter},
        storage::{PrivateS3StorageAdapter, StorageAdapter},
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
            config.mpesa_callback_url.clone(),
            config.mpesa_callback_hmac_secret.clone(),
            breaker,
        ))
    }
}

pub struct OcrProviderFactory;

impl OcrProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<dyn OcrProvider> {
        let breaker = CircuitBreaker::new("ocr_document_intelligence", 3, Duration::from_secs(30));
        Arc::new(ConfigurableOcrProviderAdapter::new(
            config.ocr_provider.clone(),
            config.ocr_provider_api_key.clone(),
            breaker,
        ))
    }
}

pub struct NotificationProviderFactory;

impl NotificationProviderFactory {
    pub fn create_sms(config: &AppConfig) -> Arc<dyn SmsAdapter> {
        let breaker = CircuitBreaker::new("sms_gateway", 3, Duration::from_secs(20));
        Arc::new(AfricasTalkingSmsAdapter::new(
            config.sms_provider.clone(),
            breaker,
        ))
    }

    pub fn create_email(config: &AppConfig) -> Arc<dyn EmailAdapter> {
        let breaker = CircuitBreaker::new("email_gateway", 3, Duration::from_secs(20));
        Arc::new(SmtpEmailAdapter::new(config.email_provider.clone(), breaker))
    }
}

pub struct StorageProviderFactory;

impl StorageProviderFactory {
    pub fn create(config: &AppConfig) -> Arc<dyn StorageAdapter> {
        Arc::new(PrivateS3StorageAdapter::new(
            config.s3_bucket.clone(),
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
