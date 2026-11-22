use std::{
    io::Write,
    process::{Command, Stdio},
};
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

/// Safaricom Daraja C2B V2 Register URL Payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bRegisterUrlRequest {
    #[serde(rename = "ShortCode")]
    pub short_code: String,
    #[serde(rename = "ResponseType")]
    pub response_type: String,
    #[serde(rename = "ConfirmationURL")]
    pub confirmation_url: String,
    #[serde(rename = "ValidationURL")]
    pub validation_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bRegisterUrlResult {
    pub response_code: String,
    pub response_description: String,
    pub conversation_id: Option<String>,
}

/// Safaricom Daraja C2B Validation Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bValidationRequest {
    #[serde(rename = "TransactionType", default)]
    pub transaction_type: Option<String>,
    #[serde(rename = "TransID")]
    pub trans_id: String,
    #[serde(rename = "TransTime", default)]
    pub trans_time: Option<String>,
    #[serde(rename = "TransAmount")]
    pub trans_amount: Decimal,
    #[serde(rename = "BusinessShortCode", default)]
    pub business_short_code: Option<String>,
    #[serde(rename = "BillRefNumber", default)]
    pub bill_ref_number: Option<String>,
    #[serde(rename = "InvoiceNumber", default)]
    pub invoice_number: Option<String>,
    #[serde(rename = "OrgAccountBalance", default)]
    pub org_account_balance: Option<String>,
    #[serde(rename = "ThirdPartyTransID", default)]
    pub third_party_trans_id: Option<String>,
    #[serde(rename = "MSISDN")]
    pub msisdn: String,
    #[serde(rename = "FirstName", default)]
    pub first_name: Option<String>,
    #[serde(rename = "MiddleName", default)]
    pub middle_name: Option<String>,
    #[serde(rename = "LastName", default)]
    pub last_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bValidationResponse {
    #[serde(rename = "ResultCode")]
    pub result_code: i32,
    #[serde(rename = "ResultDesc")]
    pub result_desc: String,
}

/// Safaricom Daraja C2B Confirmation Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bConfirmationRequest {
    #[serde(rename = "TransactionType", default)]
    pub transaction_type: Option<String>,
    #[serde(rename = "TransID")]
    pub trans_id: String,
    #[serde(rename = "TransTime", default)]
    pub trans_time: Option<String>,
    #[serde(rename = "TransAmount")]
    pub trans_amount: Decimal,
    #[serde(rename = "BusinessShortCode", default)]
    pub business_short_code: Option<String>,
    #[serde(rename = "BillRefNumber", default)]
    pub bill_ref_number: Option<String>,
    #[serde(rename = "InvoiceNumber", default)]
    pub invoice_number: Option<String>,
    #[serde(rename = "OrgAccountBalance", default)]
    pub org_account_balance: Option<String>,
    #[serde(rename = "ThirdPartyTransID", default)]
    pub third_party_trans_id: Option<String>,
    #[serde(rename = "MSISDN")]
    pub msisdn: String,
    #[serde(rename = "FirstName", default)]
    pub first_name: Option<String>,
    #[serde(rename = "MiddleName", default)]
    pub middle_name: Option<String>,
    #[serde(rename = "LastName", default)]
    pub last_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct C2bConfirmationResponse {
    #[serde(rename = "ResultCode")]
    pub result_code: i32,
    #[serde(rename = "ResultDesc")]
    pub result_desc: String,
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

/// Section 5.10: Adapter Pattern for Safaricom M-Pesa Daraja C2B V2
pub trait MpesaAdapter: Send + Sync {
    fn normalize_kenyan_phone(&self, raw_phone: &str) -> AppResult<String>;
    fn fetch_oauth_token(&self, consumer_key: &str, consumer_secret: &str) -> AppResult<String>;
    fn register_c2b_urls(
        &self,
        consumer_key: &str,
        consumer_secret: &str,
        req: &C2bRegisterUrlRequest,
    ) -> AppResult<C2bRegisterUrlResult>;
    fn verify_callback_signature(&self, payload_bytes: &[u8], signature_hex: &str) -> AppResult<()>;
    fn compute_callback_signature(&self, payload_bytes: &[u8]) -> String;
    fn circuit_breaker(&self) -> &CircuitBreaker;
}

pub struct SafaricomDarajaAdapter {
    pub base_url: String,
    pub shortcode: String,
    pub consumer_key: Option<String>,
    pub consumer_secret: Option<String>,
    pub confirmation_url: String,
    pub validation_url: String,
    pub response_type: String,
    pub callback_hmac_secret: String,
    pub breaker: CircuitBreaker,
}

impl SafaricomDarajaAdapter {
    pub fn new(
        base_url: String,
        shortcode: String,
        consumer_key: Option<String>,
        consumer_secret: Option<String>,
        confirmation_url: String,
        validation_url: String,
        response_type: String,
        callback_hmac_secret: String,
        breaker: CircuitBreaker,
    ) -> Self {
        Self {
            base_url,
            shortcode,
            consumer_key,
            consumer_secret,
            confirmation_url,
            validation_url,
            response_type,
            callback_hmac_secret,
            breaker,
        }
    }
}

impl MpesaAdapter for SafaricomDarajaAdapter {
    /// Normalizes Kenyan phone numbers (`07XX...`, `01XX...`, `+2547XX...`, `2547XX...`) to Daraja format `254XXXXXXXXX`
    fn normalize_kenyan_phone(&self, raw_phone: &str) -> AppResult<String> {
        let digits: String = raw_phone.chars().filter(|c| c.is_ascii_digit()).collect();
        let normalized = if (digits.starts_with("07") || digits.starts_with("01")) && digits.len() == 10 {
            format!("254{}", &digits[1..])
        } else if digits.starts_with("254") && digits.len() == 12 {
            digits
        } else if (digits.starts_with('7') || digits.starts_with('1')) && digits.len() == 9 {
            format!("254{digits}")
        } else {
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_REQUEST,
                code: "INVALID_PHONE_NUMBER".to_string(),
                message: format!(
                    "Invalid Kenyan phone number '{raw_phone}'. Expected 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX (12 digits)."
                ),
            });
        };

        if normalized.len() != 12 {
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_REQUEST,
                code: "INVALID_PHONE_NUMBER".to_string(),
                message: format!(
                    "Normalized Kenyan MSISDN must be 12 digits (254XXXXXXXXX), got '{normalized}'"
                ),
            });
        }

        Ok(normalized)
    }

    fn fetch_oauth_token(&self, consumer_key: &str, consumer_secret: &str) -> AppResult<String> {
        let oauth_url = format!(
            "{}/oauth/v1/generate?grant_type=client_credentials",
            self.base_url.trim_end_matches('/')
        );
        let auth_header = format!(
            "Basic {}",
            base64_encode(format!("{consumer_key}:{consumer_secret}").as_bytes())
        );

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
            .map_err(|e| AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_CONNECTION_ERROR".to_string(),
                message: format!("Daraja OAuth curl spawn error: {e}"),
            })?;

        if !oauth_out.status.success() {
            let stderr = String::from_utf8_lossy(&oauth_out.stderr);
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_AUTHENTICATION_FAILED".to_string(),
                message: format!("Daraja OAuth connection failed: {stderr}"),
            });
        }

        let oauth_json: serde_json::Value = serde_json::from_slice(&oauth_out.stdout)
            .map_err(|e| AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_AUTHENTICATION_FAILED".to_string(),
                message: format!("Invalid Daraja OAuth JSON response: {e}"),
            })?;

        let access_token = oauth_json
            .get("access_token")
            .and_then(|v| v.as_str())
            .ok_or_else(|| {
                let err_desc = oauth_json
                    .get("errorMessage")
                    .and_then(|v| v.as_str())
                    .unwrap_or("Invalid consumer credentials");
                AppError::Structured {
                    status: axum::http::StatusCode::BAD_GATEWAY,
                    code: "DARAJA_AUTHENTICATION_FAILED".to_string(),
                    message: format!("Failed to retrieve Daraja access token: {err_desc}"),
                }
            })?;

        Ok(access_token.to_string())
    }

    fn register_c2b_urls(
        &self,
        consumer_key: &str,
        consumer_secret: &str,
        req: &C2bRegisterUrlRequest,
    ) -> AppResult<C2bRegisterUrlResult> {
        let access_token = self.fetch_oauth_token(consumer_key, consumer_secret)?;
        let register_url = format!(
            "{}/mpesa/c2b/v2/registerurl",
            self.base_url.trim_end_matches('/')
        );

        let payload = serde_json::json!({
            "ShortCode": req.short_code,
            "ResponseType": req.response_type,
            "ConfirmationURL": req.confirmation_url,
            "ValidationURL": req.validation_url
        });
        let body_str = payload.to_string();

        let mut child = Command::new("curl")
            .arg("-sS")
            .arg("--max-time")
            .arg("20")
            .arg("-X")
            .arg("POST")
            .arg(&register_url)
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
            .map_err(|e| AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_CONNECTION_ERROR".to_string(),
                message: format!("Daraja C2B register URL curl spawn error: {e}"),
            })?;

        if let Some(mut stdin) = child.stdin.take() {
            let _ = stdin.write_all(body_str.as_bytes());
        }

        let out = child.wait_with_output().map_err(|e| AppError::Structured {
            status: axum::http::StatusCode::BAD_GATEWAY,
            code: "DARAJA_CONNECTION_ERROR".to_string(),
            message: format!("Daraja C2B register URL wait error: {e}"),
        })?;

        if !out.status.success() {
            let stderr = String::from_utf8_lossy(&out.stderr);
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_CONNECTION_ERROR".to_string(),
                message: format!("Daraja C2B register URL request failed: {stderr}"),
            });
        }

        let res_json: serde_json::Value = serde_json::from_slice(&out.stdout).map_err(|e| {
            AppError::Structured {
                status: axum::http::StatusCode::BAD_GATEWAY,
                code: "DARAJA_VALIDATION_FAILED".to_string(),
                message: format!("Invalid Daraja register URL response JSON: {e}"),
            }
        })?;

        let response_code = res_json
            .get("ResponseCode")
            .and_then(|v| v.as_str())
            .or_else(|| res_json.get("responseCode").and_then(|v| v.as_str()))
            .unwrap_or("0")
            .to_string();

        let response_desc = res_json
            .get("ResponseDescription")
            .or_else(|| res_json.get("responseDescription"))
            .or_else(|| res_json.get("errorMessage"))
            .and_then(|v| v.as_str())
            .unwrap_or("Success")
            .to_string();

        let conversation_id = res_json
            .get("OriginatorCoversationID")
            .or_else(|| res_json.get("ConversationID"))
            .and_then(|v| v.as_str())
            .map(ToString::to_string);

        Ok(C2bRegisterUrlResult {
            response_code,
            response_description: response_desc,
            conversation_id,
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
