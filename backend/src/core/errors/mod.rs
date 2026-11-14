use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Authentication required: {0}")]
    Unauthorized(String),

    #[error("Access denied: {0}")]
    Forbidden(String),

    #[error("Cross-tenant access violation: {0}")]
    TenantIsolationViolation(String),

    #[error("Resource not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Conflict or duplicate resource: {0}")]
    Conflict(String),

    #[error("Business rule violation: {0}")]
    BusinessRule(String),

    #[error("Financial integrity violation: {0}")]
    FinancialIntegrity(String),

    #[error("External service unavailable (Circuit Breaker Open): {0}")]
    ServiceUnavailable(String),

    #[error("Rate limit exceeded: {0}")]
    TooManyRequests(String),

    #[error("Internal server error: {0}")]
    Internal(String),
}

#[derive(Debug, Serialize)]
pub struct ApiErrorResponse {
    pub code: String,
    pub message: String,
    pub status: u16,
}

impl AppError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            Self::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            Self::Forbidden(_) | Self::TenantIsolationViolation(_) => StatusCode::FORBIDDEN,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::Validation(_) => StatusCode::BAD_REQUEST,
            Self::Conflict(_) => StatusCode::CONFLICT,
            Self::BusinessRule(_) | Self::FinancialIntegrity(_) => StatusCode::UNPROCESSABLE_ENTITY,
            Self::ServiceUnavailable(_) => StatusCode::SERVICE_UNAVAILABLE,
            Self::TooManyRequests(_) => StatusCode::TOO_MANY_REQUESTS,
            Self::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    pub fn error_code(&self) -> &'static str {
        match self {
            Self::Unauthorized(_) => "AUTH_UNAUTHORIZED",
            Self::Forbidden(_) => "AUTH_FORBIDDEN",
            Self::TenantIsolationViolation(_) => "TENANT_ISOLATION_VIOLATION",
            Self::NotFound(_) => "RESOURCE_NOT_FOUND",
            Self::Validation(_) => "VALIDATION_ERROR",
            Self::Conflict(_) => "RESOURCE_CONFLICT",
            Self::BusinessRule(_) => "BUSINESS_RULE_VIOLATION",
            Self::FinancialIntegrity(_) => "FINANCIAL_INTEGRITY_VIOLATION",
            Self::ServiceUnavailable(_) => "EXTERNAL_SERVICE_CIRCUIT_OPEN",
            Self::TooManyRequests(_) => "RATE_LIMIT_EXCEEDED",
            Self::Internal(_) => "INTERNAL_SERVER_ERROR",
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = self.status_code();
        let body = Json(ApiErrorResponse {
            code: self.error_code().to_string(),
            message: self.to_string(),
            status: status.as_u16(),
        });
        (status, body).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
