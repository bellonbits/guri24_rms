use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use axum::{
    extract::FromRequestParts,
    http::{header, request::Parts, HeaderMap, Request},
    middleware::Next,
    response::Response,
};

use crate::{
    core::{
        errors::{AppError, AppResult},
        tenant_context::TenantContext,
    },
    database::AppState,
};

/// Section 5.7: Decorator Pattern
/// Composable middleware and service decorators for rate limiting, audit tracing, and tenant context extraction.
#[derive(Clone, Default)]
pub struct RateLimiterDecorator {
    buckets: Arc<Mutex<HashMap<String, (u32, Instant)>>>,
    max_requests_per_window: u32,
    window: Duration,
}

impl RateLimiterDecorator {
    pub fn new(max_requests_per_window: u32, window: Duration) -> Self {
        Self {
            buckets: Arc::new(Mutex::new(HashMap::new())),
            max_requests_per_window,
            window,
        }
    }

    pub fn check_rate_limit(&self, key: &str) -> AppResult<()> {
        let mut guard = self.buckets.lock().unwrap_or_else(|e| e.into_inner());
        let now = Instant::now();
        let entry = guard.entry(key.to_string()).or_insert((0, now));

        if now.duration_since(entry.1) >= self.window {
            *entry = (1, now);
            return Ok(());
        }

        if entry.0 >= self.max_requests_per_window {
            return Err(AppError::TooManyRequests(format!(
                "Rate limit exceeded for key '{key}'"
            )));
        }

        entry.0 += 1;
        Ok(())
    }
}

/// Axum extractor that resolves `TenantContext` strictly from the Authorization Bearer JWT.
/// Security Rule #1 & #2: Never trust `organization_id` from client body or query parameters.
#[async_trait::async_trait]
impl FromRequestParts<Arc<AppState>> for TenantContext {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<AppState>,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .ok_or_else(|| {
                AppError::Unauthorized("Missing Authorization Bearer header".to_string())
            })?;

        let token = auth_header.strip_prefix("Bearer ").ok_or_else(|| {
            AppError::Unauthorized("Authorization header must use Bearer scheme".to_string())
        })?;

        let claims = state.token_service.verify_access_token(token)?;

        // Verify active membership in organization
        state
            .repositories
            .organizations
            .verify_active_membership(claims.org_id, claims.sub)?;

        Ok(TenantContext::from_claims(claims))
    }
}

pub async fn security_headers_middleware(
    headers: HeaderMap,
    request: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, AppError> {
    let client_key = headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("local-client");
    tracing::debug!(client = client_key, uri = %request.uri(), method = %request.method(), "Incoming API request");

    let mut response = next.run(request).await;
    let resp_headers = response.headers_mut();
    resp_headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        header::HeaderValue::from_static("nosniff"),
    );
    resp_headers.insert(
        header::X_FRAME_OPTIONS,
        header::HeaderValue::from_static("DENY"),
    );
    resp_headers.insert(
        header::CACHE_CONTROL,
        header::HeaderValue::from_static("no-store"),
    );
    Ok(response)
}
