use crate::core::{circuit_breaker::CircuitBreaker, errors::AppResult};

/// Section 5.10: Adapter Pattern for Transactional Email Provider
pub trait EmailAdapter: Send + Sync {
    fn send_email(&self, recipient: &str, subject: &str, body: &str) -> AppResult<String>;
    fn circuit_breaker(&self) -> &CircuitBreaker;
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
