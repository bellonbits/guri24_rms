use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Algorithm, Argon2, Params, Version,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::core::errors::{AppError, AppResult};

/// Built-in RBAC roles required by specification Section 7
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SystemRole {
    SaasSuperAdministrator,
    OrganizationAdministrator,
    PropertyOwner,
    PropertyManager,
    Accountant,
    Receptionist,
    MaintenanceOfficer,
    Tenant,
    Vendor,
}

impl SystemRole {
    pub fn default_permissions(&self) -> Vec<&'static str> {
        match self {
            Self::SaasSuperAdministrator | Self::OrganizationAdministrator => vec![
                "properties.view",
                "properties.create",
                "properties.update",
                "properties.manage",
                "units.create",
                "tenants.view",
                "tenants.create",
                "tenants.manage",
                "leases.view",
                "leases.create",
                "leases.manage",
                "leases.approve",
                "invoices.view",
                "invoices.create",
                "payments.view",
                "payments.status.view",
                "payments.initiate",
                "payments.manual_record",
                "payments.allocate",
                "payments.reverse",
                "payments.reconcile",
                "payments.integrations.view",
                "payments.integrations.manage",
                "payments.credentials.manage",
                "finance.accounts.view",
                "finance.accounts.manage",
                "finance.configuration.view",
                "finance.configuration.manage",
                "finance.reconciliation.view",
                "finance.reconciliation.manage",
                "finance.reconciliation.approve",
                "ledger.view",
                "ledger.journals.manage",
                "ledger.journals.approve",
                "refunds.view",
                "refunds.manage",
                "refunds.approve",
                "expenses.create",
                "expenses.view",
                "expenses.approve",
                "accounting.manage",
                "deposits.view",
                "maintenance.view",
                "maintenance.create",
                "maintenance.manage",
                "maintenance.assign",
                "documents.view",
                "documents.upload",
                "ocr.submit",
                "ocr.results.view",
                "ocr.results.edit",
                "ocr.review",
                "ocr.approve",
                "ocr.configuration.view",
                "ocr.configuration.manage",
                "assistant.use",
                "reports.view",
                "reports.export",
                "analytics.property.view",
                "users.manage",
                "organization.users.manage",
                "organization.roles.manage",
                "notifications.view",
                "notifications.manage",
                "notifications.settings",
            ],
            Self::PropertyOwner => vec![
                "properties.view",
                "tenants.view",
                "leases.view",
                "leases.approve",
                "invoices.view",
                "payments.view",
                "payments.status.view",
                "expenses.approve",
                "deposits.view",
                "maintenance.view",
                "documents.view",
                "ocr.review",
                "assistant.use",
                "reports.view",
                "reports.export",
                "analytics.property.view",
                "notifications.view",
            ],
            Self::PropertyManager => vec![
                "properties.view",
                "properties.create",
                "properties.update",
                "properties.manage",
                "units.create",
                "tenants.view",
                "tenants.create",
                "tenants.manage",
                "leases.view",
                "leases.create",
                "leases.manage",
                "leases.approve",
                "invoices.view",
                "invoices.create",
                "payments.view",
                "payments.status.view",
                "deposits.view",
                "maintenance.view",
                "maintenance.create",
                "maintenance.manage",
                "maintenance.assign",
                "documents.view",
                "documents.upload",
                "ocr.submit",
                "ocr.results.view",
                "assistant.use",
                "reports.view",
                "reports.export",
                "analytics.property.view",
                "notifications.view",
            ],
            Self::Accountant => vec![
                "properties.view",
                "tenants.view",
                "leases.view",
                "invoices.view",
                "invoices.create",
                "payments.view",
                "payments.status.view",
                "payments.manual_record",
                "payments.allocate",
                "payments.reconcile",
                "finance.accounts.view",
                "finance.reconciliation.view",
                "finance.reconciliation.manage",
                "ledger.view",
                "refunds.view",
                "refunds.manage",
                "expenses.create",
                "expenses.view",
                "expenses.approve",
                "accounting.manage",
                "deposits.view",
                "documents.view",
                "documents.upload",
                "ocr.results.view",
                "ocr.review",
                "assistant.use",
                "reports.view",
                "reports.export",
                "notifications.view",
            ],
            Self::Receptionist => vec![
                "properties.view",
                "tenants.view",
                "tenants.create",
                "leases.view",
                "leases.create",
                "maintenance.view",
                "documents.view",
                "documents.upload",
                "assistant.use",
            ],
            Self::MaintenanceOfficer | Self::Vendor => {
                vec!["properties.view", "maintenance.view", "maintenance.assign"]
            }
            Self::Tenant => vec![
                "leases.view",
                "invoices.view",
                "payments.view",
                "maintenance.view",
                "documents.view",
                "documents.upload",
                "assistant.use",
            ],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessTokenClaims {
    pub sub: Uuid,
    pub org_id: Uuid,
    pub role: SystemRole,
    pub permissions: Vec<String>,
    pub jti: Uuid,
    pub iat: i64,
    pub exp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshTokenClaims {
    pub sub: Uuid,
    pub org_id: Uuid,
    pub family_id: Uuid,
    pub jti: Uuid,
    pub iat: i64,
    pub exp: i64,
}

pub struct PasswordService;

impl PasswordService {
    /// Hash password using Argon2id with OWASP-recommended parameters
    pub fn hash_password(plain: &str) -> AppResult<String> {
        if plain.len() < 8 {
            return Err(AppError::Validation(
                "Password must be at least 8 characters long".to_string(),
            ));
        }
        let salt = SaltString::generate(&mut OsRng);
        let params = Params::new(19_456, 2, 1, None)
            .map_err(|e| AppError::Internal(format!("Argon2 parameter error: {e}")))?;
        let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);
        argon2
            .hash_password(plain.as_bytes(), &salt)
            .map(|h| h.to_string())
            .map_err(|e| AppError::Internal(format!("Password hashing failed: {e}")))
    }

    pub fn verify_password(plain: &str, password_hash: &str) -> AppResult<bool> {
        let parsed = PasswordHash::new(password_hash)
            .map_err(|_| AppError::Unauthorized("Invalid credentials".to_string()))?;
        Ok(Argon2::default()
            .verify_password(plain.as_bytes(), &parsed)
            .is_ok())
    }
}

pub struct TokenService {
    access_secret: String,
    refresh_secret: String,
    access_expiry_secs: i64,
    refresh_expiry_secs: i64,
}

impl TokenService {
    pub fn new(
        access_secret: String,
        refresh_secret: String,
        access_expiry_secs: i64,
        refresh_expiry_secs: i64,
    ) -> Self {
        Self {
            access_secret,
            refresh_secret,
            access_expiry_secs,
            refresh_expiry_secs,
        }
    }

    pub fn issue_access_token(
        &self,
        user_id: Uuid,
        organization_id: Uuid,
        role: SystemRole,
        custom_permissions: Option<Vec<String>>,
    ) -> AppResult<String> {
        let now = Utc::now();
        let exp = (now + Duration::seconds(self.access_expiry_secs)).timestamp();
        let permissions = custom_permissions.unwrap_or_else(|| {
            role.default_permissions()
                .into_iter()
                .map(ToString::to_string)
                .collect()
        });

        let claims = AccessTokenClaims {
            sub: user_id,
            org_id: organization_id,
            role,
            permissions,
            jti: Uuid::new_v4(),
            iat: now.timestamp(),
            exp,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.access_secret.as_bytes()),
        )
        .map_err(|e| AppError::Internal(format!("Failed to encode access token: {e}")))
    }

    pub fn issue_refresh_token(
        &self,
        user_id: Uuid,
        organization_id: Uuid,
        family_id: Uuid,
    ) -> AppResult<(String, RefreshTokenClaims)> {
        let now = Utc::now();
        let exp = (now + Duration::seconds(self.refresh_expiry_secs)).timestamp();
        let claims = RefreshTokenClaims {
            sub: user_id,
            org_id: organization_id,
            family_id,
            jti: Uuid::new_v4(),
            iat: now.timestamp(),
            exp,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.refresh_secret.as_bytes()),
        )
        .map_err(|e| AppError::Internal(format!("Failed to encode refresh token: {e}")))?;

        Ok((token, claims))
    }

    pub fn verify_access_token(&self, token: &str) -> AppResult<AccessTokenClaims> {
        decode::<AccessTokenClaims>(
            token,
            &DecodingKey::from_secret(self.access_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| AppError::Unauthorized(format!("Invalid or expired access token: {e}")))
    }

    pub fn verify_refresh_token(&self, token: &str) -> AppResult<RefreshTokenClaims> {
        decode::<RefreshTokenClaims>(
            token,
            &DecodingKey::from_secret(self.refresh_secret.as_bytes()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .map_err(|e| AppError::Unauthorized(format!("Invalid or expired refresh token: {e}")))
    }

    pub fn hash_token(raw_token: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(raw_token.as_bytes());
        hex::encode(hasher.finalize())
    }
}

/// Mask and hash Kenyan National ID / Passport per Data Protection Act 2019
pub fn mask_and_hash_national_id(raw_id: &str, org_id: Uuid) -> (String, String) {
    let trimmed = raw_id.trim();
    let visible_suffix: String = trimmed
        .chars()
        .rev()
        .take(4)
        .collect::<Vec<_>>()
        .into_iter()
        .rev()
        .collect();
    let masked = format!("****{visible_suffix}");

    let mut hasher = Sha256::new();
    hasher.update(org_id.as_bytes());
    hasher.update(b":");
    hasher.update(trimmed.as_bytes());
    let hash = hex::encode(hasher.finalize());
    (masked, hash)
}
