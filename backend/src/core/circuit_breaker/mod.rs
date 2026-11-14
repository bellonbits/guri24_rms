use std::{
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use serde::Serialize;

use crate::core::errors::{AppError, AppResult};

/// Section 5.8: Circuit Breaker Pattern
/// Protects external integrations (Safaricom M-Pesa Daraja, SMS Gateways, Email, AI).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum CircuitState {
    Closed,
    Open,
    HalfOpen,
}

#[derive(Debug)]
struct CircuitInner {
    state: CircuitState,
    consecutive_failures: u32,
    last_failure_at: Option<Instant>,
    half_open_successes: u32,
}

#[derive(Clone, Debug)]
pub struct CircuitBreaker {
    service_name: String,
    failure_threshold: u32,
    recovery_timeout: Duration,
    inner: Arc<Mutex<CircuitInner>>,
}

impl CircuitBreaker {
    pub fn new(service_name: impl Into<String>, failure_threshold: u32, recovery_timeout: Duration) -> Self {
        Self {
            service_name: service_name.into(),
            failure_threshold: failure_threshold.max(1),
            recovery_timeout,
            inner: Arc::new(Mutex::new(CircuitInner {
                state: CircuitState::Closed,
                consecutive_failures: 0,
                last_failure_at: None,
                half_open_successes: 0,
            })),
        }
    }

    pub fn state(&self) -> CircuitState {
        let mut guard = self.inner.lock().unwrap_or_else(|e| e.into_inner());
        if guard.state == CircuitState::Open {
            if let Some(last_failed) = guard.last_failure_at {
                if last_failed.elapsed() >= self.recovery_timeout {
                    guard.state = CircuitState::HalfOpen;
                    guard.half_open_successes = 0;
                }
            }
        }
        guard.state
    }

    /// Execute an external operation guarded by the circuit breaker.
    /// Does NOT blindly retry payment mutations to prevent duplicate financial transactions.
    pub fn call<T, F>(&self, operation: F) -> AppResult<T>
    where
        F: FnOnce() -> Result<T, String>,
    {
        let current_state = self.state();
        if current_state == CircuitState::Open {
            return Err(AppError::ServiceUnavailable(format!(
                "Circuit breaker for '{}' is OPEN; rejecting request fast to protect system stability",
                self.service_name
            )));
        }

        match operation() {
            Ok(result) => {
                let mut guard = self.inner.lock().unwrap_or_else(|e| e.into_inner());
                match guard.state {
                    CircuitState::HalfOpen => {
                        guard.half_open_successes += 1;
                        guard.state = CircuitState::Closed;
                        guard.consecutive_failures = 0;
                        guard.last_failure_at = None;
                    }
                    _ => {
                        guard.consecutive_failures = 0;
                    }
                }
                Ok(result)
            }
            Err(err) => {
                let mut guard = self.inner.lock().unwrap_or_else(|e| e.into_inner());
                guard.consecutive_failures += 1;
                guard.last_failure_at = Some(Instant::now());
                if guard.state == CircuitState::HalfOpen
                    || guard.consecutive_failures >= self.failure_threshold
                {
                    guard.state = CircuitState::Open;
                }
                Err(AppError::ServiceUnavailable(format!(
                    "External service '{}' failed: {}",
                    self.service_name, err
                )))
            }
        }
    }
}
