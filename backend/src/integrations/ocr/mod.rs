use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};

use crate::core::{
    circuit_breaker::CircuitBreaker,
    errors::{AppError, AppResult},
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OcrDocumentCategory {
    TenantIdentification,
    LeaseAgreement,
    ReceiptOrInvoice,
    PropertyDocument,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrDocument {
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: u64,
    pub page_count: u32,
    pub category: OcrDocumentCategory,
    /// Optional raw text / OCR text payload extracted from PDF or image stream
    pub raw_content_hint: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrExtractedFieldDto {
    pub field_key: String,
    pub field_label: String,
    pub extracted_value: String,
    pub confidence_pct: Decimal,
    pub is_sensitive_pii: bool,
    pub validation_error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OcrResult {
    pub provider_name: String,
    pub cloud_credentials_configured: bool,
    pub raw_text: String,
    pub overall_confidence_pct: Decimal,
    pub fields: Vec<OcrExtractedFieldDto>,
}

/// Section 12: Provider-independent OCR trait (implemented by AllenAiOlmOcrAdapter)
pub trait OcrProvider: Send + Sync {
    fn provider_name(&self) -> &str;
    fn is_cloud_configured(&self) -> bool;
    fn extract(&self, document: &OcrDocument) -> AppResult<OcrResult>;
    fn circuit_breaker(&self) -> &CircuitBreaker;
}

pub struct ConfigurableOcrProviderAdapter {
    provider_name: String,
    api_key_configured: bool,
    breaker: CircuitBreaker,
}

impl ConfigurableOcrProviderAdapter {
    pub fn new(provider_name: String, api_key: Option<String>, breaker: CircuitBreaker) -> Self {
        Self {
            provider_name,
            api_key_configured: api_key.is_some(),
            breaker,
        }
    }
}

impl OcrProvider for ConfigurableOcrProviderAdapter {
    fn provider_name(&self) -> &str {
        &self.provider_name
    }

    fn is_cloud_configured(&self) -> bool {
        self.api_key_configured
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }

    fn extract(&self, document: &OcrDocument) -> AppResult<OcrResult> {
        if document.file_size_bytes == 0 {
            return Err(AppError::Validation(
                "OCR document size must be greater than 0 bytes".to_string(),
            ));
        }
        let raw_text = document.raw_content_hint.clone().unwrap_or_default();
        Ok(OcrResult {
            provider_name: self.provider_name.clone(),
            cloud_credentials_configured: self.api_key_configured,
            raw_text,
            overall_confidence_pct: Decimal::ZERO,
            fields: Vec::new(),
        })
    }
}
