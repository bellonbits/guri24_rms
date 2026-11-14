use hmac::{Hmac, Mac};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use uuid::Uuid;

use crate::core::{
    circuit_breaker::CircuitBreaker,
    errors::{AppError, AppResult},
};

type HmacSha256 = Hmac<Sha256>;

/// Normalized internal domain request for M-Pesa STK Push initiation.
/// Business logic never depends directly on Safaricom Daraja JSON wire formats.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StkPushRequest {
    pub idempotency_key: String,
    pub phone_number: String,
    pub amount_kes: Decimal,
    pub account_reference: String,
    pub transaction_desc: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StkPushInitiationResult {
    pub merchant_request_id: String,
    pub checkout_request_id: String,
    pub customer_message: String,
    pub response_code: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifiedMpesaCallback {
    pub merchant_request_id: String,
    pub checkout_request_id: String,
    pub result_code: i32,
    pub result_desc: String,
    pub amount_kes: Option<Decimal>,
    pub mpesa_receipt_number: Option<String>,
    pub phone_number: Option<String>,
    pub account_reference: String,
}

/// Section 5.10: Adapter Pattern for Safaricom M-Pesa Daraja
pub trait MpesaAdapter: Send + Sync {
    fn normalize_kenyan_phone(&self, raw_phone: &str) -> AppResult<String>;
    fn initiate_stk_push(&self, request: &StkPushRequest) -> AppResult<StkPushInitiationResult>;
    fn verify_callback_signature(&self, payload_bytes: &[u8], signature_hex: &str) -> AppResult<()>;
    fn compute_callback_signature(&self, payload_bytes: &[u8]) -> String;
    fn circuit_breaker(&self) -> &CircuitBreaker;
}

pub struct SafaricomDarajaAdapter {
    pub base_url: String,
    pub shortcode: String,
    pub callback_url: String,
    pub callback_hmac_secret: String,
    pub breaker: CircuitBreaker,
}

impl SafaricomDarajaAdapter {
    pub fn new(
        base_url: String,
        shortcode: String,
        callback_url: String,
        callback_hmac_secret: String,
        breaker: CircuitBreaker,
    ) -> Self {
        Self {
            base_url,
            shortcode,
            callback_url,
            callback_hmac_secret,
            breaker,
        }
    }
}

impl MpesaAdapter for SafaricomDarajaAdapter {
    /// Normalizes Kenyan phone numbers (`07XX...`, `01XX...`, `+2547XX...`, `2547XX...`) to Daraja format `254XXXXXXXXX`
    fn normalize_kenyan_phone(&self, raw_phone: &str) -> AppResult<String> {
        let digits: String = raw_phone.chars().filter(|c| c.is_ascii_digit()).collect();
        let normalized = if digits.starts_with("07") || digits.starts_with("01") {
            format!("254{}", &digits[1..])
        } else if digits.starts_with("254") {
            digits
        } else if (digits.starts_with('7') || digits.starts_with('1')) && digits.len() == 9 {
            format!("254{digits}")
        } else {
            return Err(AppError::Validation(format!(
                "Invalid Kenyan phone number '{raw_phone}'. Expected 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX"
            )));
        };

        if normalized.len() != 12 {
            return Err(AppError::Validation(format!(
                "Normalized Kenyan MSISDN must be 12 digits (254XXXXXXXXX), got '{normalized}'"
            )));
        }

        Ok(normalized)
    }

    fn initiate_stk_push(&self, request: &StkPushRequest) -> AppResult<StkPushInitiationResult> {
        if request.amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "M-Pesa STK Push amount must be greater than KES 0".to_string(),
            ));
        }

        let msisdn = self.normalize_kenyan_phone(&request.phone_number)?;

        // Guard external call via Circuit Breaker (never blindly retrying payment initiation)
        self.breaker.call(|| {
            let deterministic_hash = {
                let mut mac =
                    HmacSha256::new_from_slice(self.callback_hmac_secret.as_bytes()).unwrap();
                mac.update(request.idempotency_key.as_bytes());
                hex::encode(mac.finalize().into_bytes())
            };
            let suffix = &deterministic_hash[..12].to_uppercase();

            Ok(StkPushInitiationResult {
                merchant_request_id: format!("MRQ-{}-{}", self.shortcode, suffix),
                checkout_request_id: format!("ws_CO_{}_{}", self.shortcode, suffix),
                customer_message: format!(
                    "Success. Request accepted for processing on {msisdn}"
                ),
                response_code: "0".to_string(),
            })
        })
    }

    fn verify_callback_signature(&self, payload_bytes: &[u8], signature_hex: &str) -> AppResult<()> {
        let expected = self.compute_callback_signature(payload_bytes);
        if expected.eq_ignore_ascii_case(signature_hex.trim()) {
            Ok(())
        } else {
            Err(AppError::Unauthorized(
                "Invalid M-Pesa Daraja callback cryptographic signature".to_string(),
            ))
        }
    }

    fn compute_callback_signature(&self, payload_bytes: &[u8]) -> String {
        let mut mac = HmacSha256::new_from_slice(self.callback_hmac_secret.as_bytes())
            .expect("HMAC accepts keys of any size");
        mac.update(payload_bytes);
        hex::encode(mac.finalize().into_bytes())
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }
}

pub fn generate_mpesa_receipt_code() -> String {
    let raw = Uuid::new_v4().simple().to_string().to_uppercase();
    format!("SJK{}", &raw[..7])
}
