use std::{
    io::Write,
    process::{Command, Stdio},
};
use crate::core::{circuit_breaker::CircuitBreaker, errors::AppResult};

/// Section 5.10: Adapter Pattern for Transactional Email Provider
pub trait EmailAdapter: Send + Sync {
    fn send_email(&self, recipient: &str, subject: &str, body: &str) -> AppResult<String>;
    fn circuit_breaker(&self) -> &CircuitBreaker;
}

pub struct ResendEmailAdapter {
    pub api_key: Option<String>,
    pub from_email: String,
    pub breaker: CircuitBreaker,
}

impl ResendEmailAdapter {
    pub fn new(api_key: Option<String>, from_email: String, breaker: CircuitBreaker) -> Self {
        Self {
            api_key,
            from_email,
            breaker,
        }
    }
}

impl EmailAdapter for ResendEmailAdapter {
    fn send_email(&self, recipient: &str, subject: &str, body: &str) -> AppResult<String> {
        let api_key = self.api_key.clone().unwrap_or_default();
        let from_email = if self.from_email.is_empty() {
            "Guri24 RMS <guri24@aqivo.shop>".to_string()
        } else {
            self.from_email.clone()
        };

        self.breaker.call(|| {
            if !recipient.contains('@') {
                return Err("Invalid email address".to_string());
            }

            if api_key.is_empty() {
                // Dry run when API key is pending configuration
                return Ok(format!("RESEND-DRYRUN-{}", uuid::Uuid::new_v4()));
            }

            let payload = serde_json::json!({
                "from": from_email,
                "to": [recipient],
                "subject": subject,
                "html": body,
            });

            let mut child = Command::new("curl")
                .arg("-sS")
                .arg("--max-time")
                .arg("15")
                .arg("-X")
                .arg("POST")
                .arg("https://api.resend.com/emails")
                .arg("-H")
                .arg(format!("Authorization: Bearer {api_key}"))
                .arg("-H")
                .arg("Content-Type: application/json")
                .arg("-d")
                .arg("@-")
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Resend curl spawn failed: {e}"))?;

            if let Some(mut stdin) = child.stdin.take() {
                let _ = stdin.write_all(payload.to_string().as_bytes());
            }

            let out = child.wait_with_output().map_err(|e| format!("Resend wait failed: {e}"))?;
            if !out.status.success() {
                let stderr = String::from_utf8_lossy(&out.stderr);
                return Err(format!("Resend API request failed: {stderr}"));
            }

            let res_json: serde_json::Value = serde_json::from_slice(&out.stdout)
                .map_err(|e| format!("Invalid Resend JSON response: {e}"))?;

            let id = res_json.get("id").and_then(|v| v.as_str()).unwrap_or("resend-ok");
            Ok(id.to_string())
        })
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }
}

pub struct SmtpEmailAdapter {
    pub provider_name: String,
    pub breaker: CircuitBreaker,
}

impl SmtpEmailAdapter {
    pub fn new(provider_name: String, breaker: CircuitBreaker) -> Self {
        Self {
            provider_name,
            breaker,
        }
    }
}

impl EmailAdapter for SmtpEmailAdapter {
    fn send_email(&self, recipient: &str, subject: &str, _body: &str) -> AppResult<String> {
        self.breaker.call(|| {
            if !recipient.contains('@') {
                return Err("Invalid email address".to_string());
            }
            Ok(format!("MSG-{}-{}", self.provider_name, subject.len()))
        })
    }

    fn circuit_breaker(&self) -> &CircuitBreaker {
        &self.breaker
    }
}
