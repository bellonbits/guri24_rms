use std::{
    io::Write,
    process::{Command, Stdio},
};
use chrono::Utc;
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

fn base64_encode(input: &[u8]) -> String {
    const CHARSET: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::new();
    let mut i = 0;
    while i < input.len() {
        let b0 = input[i];
        let b1 = if i + 1 < input.len() { input[i + 1] } else { 0 };
        let b2 = if i + 2 < input.len() { input[i + 2] } else { 0 };

        out.push(CHARSET[(b0 >> 2) as usize] as char);
        out.push(CHARSET[(((b0 & 3) << 4) | (b1 >> 4)) as usize] as char);
        if i + 1 < input.len() {
            out.push(CHARSET[(((b1 & 15) << 2) | (b2 >> 6)) as usize] as char);
        } else {
            out.push('=');
        }
        if i + 2 < input.len() {
            out.push(CHARSET[(b2 & 63) as usize] as char);
        } else {
            out.push('=');
        }
        i += 3;
    }
    out
}

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
    pub consumer_key: Option<String>,
    pub consumer_secret: Option<String>,
    pub passkey: Option<String>,
    pub callback_url: String,
    pub callback_hmac_secret: String,
    pub breaker: CircuitBreaker,
}

impl SafaricomDarajaAdapter {
    pub fn new(
        base_url: String,
        shortcode: String,
        consumer_key: Option<String>,
        consumer_secret: Option<String>,
        passkey: Option<String>,
        callback_url: String,
        callback_hmac_secret: String,
        breaker: CircuitBreaker,
    ) -> Self {
        Self {
            base_url,
            shortcode,
            consumer_key,
            consumer_secret,
            passkey,
            callback_url,
            callback_hmac_secret,
            breaker,
        }
    }

    fn execute_real_daraja_stk_push(
        &self,
        consumer_key: &str,
        consumer_secret: &str,
        msisdn: &str,
        request: &StkPushRequest,
    ) -> Result<StkPushInitiationResult, String> {
        // 1. Fetch OAuth access token from Safaricom Daraja
        let oauth_url = format!("{}/oauth/v1/generate?grant_type=client_credentials", self.base_url.trim_end_matches('/'));
        let auth_header = format!("Basic {}", base64_encode(format!("{consumer_key}:{consumer_secret}").as_bytes()));

        let oauth_out = Command::new("curl")
            .arg("-sS")
            .arg("--max-time")
            .arg("15")
            .arg("-X")
            .arg("GET")
            .arg(&oauth_url)
            .arg("-H")
            .arg(format!("Authorization: {auth_header}"))
            .output()
            .map_err(|e| format!("Daraja OAuth curl spawn error: {e}"))?;

        if !oauth_out.status.success() {
            let stderr = String::from_utf8_lossy(&oauth_out.stderr);
            return Err(format!("Daraja OAuth connection failed: {stderr}"));
        }

        let oauth_json: serde_json::Value = serde_json::from_slice(&oauth_out.stdout)
            .map_err(|e| format!("Invalid Daraja OAuth JSON: {e}"))?;

        let access_token = oauth_json
            .get("access_token")
            .and_then(|v| v.as_str())
            .ok_or_else(|| {
                let err_desc = oauth_json.get("errorMessage").and_then(|v| v.as_str()).unwrap_or("Unknown OAuth error");
                format!("Failed to retrieve Daraja access token: {err_desc}")
            })?;

        // 2. Prepare STK Push payload
        let timestamp = Utc::now().format("%Y%m%d%H%M%S").to_string();
        let passkey = self.passkey.as_deref().unwrap_or("bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");
        let password = base64_encode(format!("{}{}{}", self.shortcode, passkey, timestamp).as_bytes());

        let amount_int = request.amount_kes.to_string().split('.').next().unwrap_or("1").parse::<u64>().unwrap_or(1);

        let stk_url = format!("{}/mpesa/stkpush/v1/processrequest", self.base_url.trim_end_matches('/'));
        let payload = serde_json::json!({
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount_int,
            "PartyA": msisdn,
            "PartyB": self.shortcode,
            "PhoneNumber": msisdn,
            "CallBackURL": self.callback_url,
            "AccountReference": request.account_reference,
            "TransactionDesc": request.transaction_desc
        });
        let body_str = payload.to_string();

        let mut child = Command::new("curl")
            .arg("-sS")
            .arg("--max-time")
            .arg("20")
            .arg("-X")
            .arg("POST")
            .arg(&stk_url)
            .arg("-H")
            .arg("Content-Type: application/json")
            .arg("-H")
            .arg(format!("Authorization: Bearer {access_token}"))
            .arg("-d")
            .arg("@-")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| format!("Daraja STK push curl spawn error: {e}"))?;

        if let Some(mut stdin) = child.stdin.take() {
            let _ = stdin.write_all(body_str.as_bytes());
        }

        let stk_out = child.wait_with_output().map_err(|e| format!("Daraja STK push wait error: {e}"))?;
        if !stk_out.status.success() {
            let stderr = String::from_utf8_lossy(&stk_out.stderr);
            return Err(format!("Daraja STK push request failed: {stderr}"));
        }

        let res_json: serde_json::Value = serde_json::from_slice(&stk_out.stdout)
            .map_err(|e| format!("Invalid Daraja STK push response JSON: {e}"))?;

        let response_code = res_json.get("ResponseCode").and_then(|v| v.as_str()).unwrap_or("-1").to_string();
        if response_code == "0" {
            Ok(StkPushInitiationResult {
                merchant_request_id: res_json.get("MerchantRequestID").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                checkout_request_id: res_json.get("CheckoutRequestID").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                customer_message: res_json.get("CustomerMessage").and_then(|v| v.as_str()).unwrap_or("Request accepted for processing").to_string(),
                response_code,
            })
        } else {
            let desc = res_json.get("ResponseDescription")
                .or_else(|| res_json.get("errorMessage"))
                .and_then(|v| v.as_str())
                .unwrap_or("Daraja STK push rejected");
            Err(format!("Daraja STK Push Error: {desc}"))
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

        self.breaker.call(|| {
            if let (Some(ck), Some(cs)) = (&self.consumer_key, &self.consumer_secret) {
                if !ck.is_empty() && !cs.is_empty() {
                    return self.execute_real_daraja_stk_push(ck, cs, &msisdn, request);
                }
            }

            Err("Safaricom Daraja credentials (Consumer Key, Consumer Secret, and Passkey) must be configured in Settings & Portal to initiate live STK push".to_string())
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
