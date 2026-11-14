use crate::core::{circuit_breaker::CircuitBreaker, errors::AppResult};

/// Section 5.10: Adapter Pattern for Kenyan SMS Gateway (Africa's Talking / Onfon)
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
