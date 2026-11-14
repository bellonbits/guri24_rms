use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    security::{AccessTokenClaims, SystemRole},
};

/// Authenticated Tenant Context resolved strictly from verified JWT and server-side membership.
/// Never trusted from client query/body parameters.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TenantContext {
    pub user_id: Uuid,
    pub organization_id: Uuid,
    pub role: SystemRole,
    pub permissions: Vec<String>,
}

impl TenantContext {
    pub fn from_claims(claims: AccessTokenClaims) -> Self {
        Self {
            user_id: claims.sub,
            organization_id: claims.org_id,
            role: claims.role,
            permissions: claims.permissions,
        }
    }

    /// Enforce that the actor has a specific permission in the current organization context
    pub fn require_permission(&self, permission: &str) -> AppResult<()> {
        if self.role == SystemRole::SaasSuperAdministrator
            || self.permissions.iter().any(|p| p == permission)
        {
            Ok(())
        } else {
            Err(AppError::Forbidden(format!(
                "Missing required permission '{permission}' for role {:?}",
                self.role
            )))
        }
    }

    /// Enforce strict multi-tenant isolation: a record's organization_id must match the authenticated TenantContext
    pub fn assert_owns_record(&self, record_org_id: Uuid) -> AppResult<()> {
        if self.organization_id == record_org_id {
            Ok(())
        } else {
            Err(AppError::TenantIsolationViolation(
                "Cross-organization data access is strictly prohibited".to_string(),
            ))
        }
    }
}
