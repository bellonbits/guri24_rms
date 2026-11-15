use std::{
    io::Write,
    process::{Command, Stdio},
};
use crate::core::{circuit_breaker::CircuitBreaker, errors::AppResult};

/// Adapter Pattern for Kenyan SMS Gateway
pub trait SmsAdapter: Send + Sync {
    fn send_sms(&self, phone_number: &str, message: &str) -> AppResult<String>;
    fn circuit_breaker(&self) -> &CircuitBreaker;
}

pub struct AfricasTalkingSmsAdapter {
    pub provider_name: String,
    pub breaker: CircuitBreaker,
}

impl AfricasTalkingSmsAdapter {
    pub fn new(provider_name: String, breaker: CircuitBreaker) -> Self {
        Self {
            provider_name,
            breaker,
        }
    }
}

impl SmsAdapter for AfricasTalkingSmsAdapter {
    fn send_sms(&self, phone_number: &str, message: &str) -> AppResult<String> {
        self.breaker.call(|| {
            if phone_number.trim().is_empty() || message.trim().is_empty() {
                return Err("SMS recipient and message cannot be empty".to_string());
            }
            Ok(format!("ATXid_{}_{}", self.provider_name, phone_number))
        })
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }
}

/// OpenSMS Kenya Gateway Adapter (https://www.opensms.co.ke)
/// Supports API token authentication and outbound transactional SMS dispatch.
pub struct OpenSmsAdapter {
    pub api_endpoint: String,
    pub api_token: String,
    pub sender_id: Option<String>,
    pub breaker: CircuitBreaker,
}

impl OpenSmsAdapter {
    pub fn new(
        api_endpoint: String,
        api_token: String,
        sender_id: Option<String>,
        breaker: CircuitBreaker,
    ) -> Self {
        Self {
            api_endpoint,
            api_token,
            sender_id,
            breaker,
        }
    }
}

impl SmsAdapter for OpenSmsAdapter {
    fn send_sms(&self, phone_number: &str, message: &str) -> AppResult<String> {
        let recipient = phone_number.trim().to_string();
        let text = message.trim().to_string();

        self.breaker.call(|| {
            if recipient.is_empty() || text.is_empty() {
                return Err("Recipient phone number and message cannot be empty".to_string());
            }

            if self.api_token.is_empty() {
                return Ok(format!("OPENSMS_SIMULATED_{recipient}"));
            }

            let endpoint = format!("{}/sms/send", self.api_endpoint.trim_end_matches('/'));
            let payload = serde_json::json!({
                "to": recipient,
                "message": text,
                "sender_id": self.sender_id.as_deref().unwrap_or("GURI24RMS"),
            });
            let body = payload.to_string();

            let mut child = Command::new("curl")
                .arg("-sS")
                .arg("--max-time")
                .arg("15")
                .arg("-X")
                .arg("POST")
                .arg(&endpoint)
                .arg("-H")
                .arg("Content-Type: application/json")
                .arg("-H")
                .arg(format!("Authorization: Bearer {}", self.api_token))
                .arg("-d")
                .arg("@-")
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("OpenSMS curl spawn error: {e}"))?;

            if let Some(mut stdin) = child.stdin.take() {
                let _ = stdin.write_all(body.as_bytes());
            }

            let out = child
                .wait_with_output()
                .map_err(|e| format!("OpenSMS curl wait error: {e}"))?;

            if !out.status.success() {
                let stderr = String::from_utf8_lossy(&out.stderr);
                return Err(format!("OpenSMS delivery failed: {stderr}"));
            }

            let response_body = String::from_utf8_lossy(&out.stdout);
            Ok(format!("OPENSMS_SENT_{recipient}_{}", response_body.chars().take(40).collect::<String>()))
        })
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }
}
