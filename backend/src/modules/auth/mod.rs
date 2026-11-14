use std::{
    collections::HashSet,
    sync::{Arc, RwLock},
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        security::{PasswordService, SystemRole, TokenService},
    },
    modules::organizations::{Organization, OrganizationRepository, RegisterOrganizationCommand},
};

#[derive(Debug, Clone, Deserialize)]
pub struct LoginCommand {
    pub email: String,
    pub password: String,
    pub organization_id: Option<Uuid>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RefreshTokenCommand {
    pub refresh_token: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthSessionResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub user_id: Uuid,
    pub full_name: String,
    pub email: String,
    pub organization: Organization,
    pub role: SystemRole,
    pub permissions: Vec<String>,
}

pub struct AuthService {
    org_repo: Arc<dyn OrganizationRepository>,
    token_service: Arc<TokenService>,
    revoked_token_hashes: Arc<RwLock<HashSet<String>>>,
}

impl AuthService {
    pub fn new(org_repo: Arc<dyn OrganizationRepository>, token_service: Arc<TokenService>) -> Self {
        Self {
            org_repo,
            token_service,
            revoked_token_hashes: Arc::new(RwLock::new(HashSet::new())),
        }
    }

    pub fn register_organization(
        &self,
        cmd: RegisterOrganizationCommand,
    ) -> AppResult<AuthSessionResponse> {
        let (org, user, membership) = self.org_repo.create_organization_with_admin(cmd)?;
        let permissions: Vec<String> = membership
            .role
            .default_permissions()
            .into_iter()
            .map(ToString::to_string)
            .collect();

        let access_token = self.token_service.issue_access_token(
            user.id,
            org.id,
            membership.role.clone(),
            Some(permissions.clone()),
        )?;
        let (refresh_token, _) =
            self.token_service
                .issue_refresh_token(user.id, org.id, Uuid::new_v4())?;

        Ok(AuthSessionResponse {
            access_token,
            refresh_token,
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            organization: org,
            role: membership.role,
            permissions,
        })
    }

    pub fn login(&self, cmd: LoginCommand) -> AppResult<AuthSessionResponse> {
        let user = self
            .org_repo
            .find_user_by_email(&cmd.email)?
            .ok_or_else(|| AppError::Unauthorized("Invalid email or password".to_string()))?;

        if !PasswordService::verify_password(&cmd.password, &user.password_hash)? {
            return Err(AppError::Unauthorized(
                "Invalid email or password".to_string(),
            ));
        }

        let memberships = self.org_repo.list_user_memberships(user.id)?;
        if memberships.is_empty() {
            return Err(AppError::Forbidden(
                "User has no active organization memberships".to_string(),
            ));
        }

        let membership = if let Some(target_org_id) = cmd.organization_id {
            memberships
                .into_iter()
                .find(|m| m.organization_id == target_org_id)
                .ok_or_else(|| {
                    AppError::TenantIsolationViolation(
                        "User is not authorized for the requested organization".to_string(),
                    )
                })?
        } else {
            memberships.into_iter().next().unwrap()
        };

        let permissions: Vec<String> = membership
            .role
            .default_permissions()
            .into_iter()
            .map(ToString::to_string)
            .collect();

        let ctx = crate::core::tenant_context::TenantContext {
            user_id: user.id,
            organization_id: membership.organization_id,
            role: membership.role.clone(),
            permissions: permissions.clone(),
        };
        let org = self.org_repo.get_organization(&ctx)?;

        let access_token = self.token_service.issue_access_token(
            user.id,
            org.id,
            membership.role.clone(),
            Some(permissions.clone()),
        )?;
        let (refresh_token, _) =
            self.token_service
                .issue_refresh_token(user.id, org.id, Uuid::new_v4())?;

        Ok(AuthSessionResponse {
            access_token,
            refresh_token,
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            organization: org,
            role: membership.role,
            permissions,
        })
    }

    /// Rotating Refresh Token flow: revokes the presented refresh token hash and issues a new pair
    pub fn rotate_refresh_token(&self, cmd: RefreshTokenCommand) -> AppResult<AuthSessionResponse> {
        let token_hash = TokenService::hash_token(&cmd.refresh_token);
        {
            let mut revoked = self
                .revoked_token_hashes
                .write()
                .unwrap_or_else(|e| e.into_inner());
            if revoked.contains(&token_hash) {
                return Err(AppError::Unauthorized(
                    "Refresh token has already been rotated or revoked".to_string(),
                ));
            }
            revoked.insert(token_hash);
        }

        let claims = self.token_service.verify_refresh_token(&cmd.refresh_token)?;
        let membership = self
            .org_repo
            .verify_active_membership(claims.org_id, claims.sub)?;
        let user = self
            .org_repo
            .find_user_by_id(claims.sub)?
            .ok_or_else(|| AppError::Unauthorized("User no longer exists".to_string()))?;

        let permissions: Vec<String> = membership
            .role
            .default_permissions()
            .into_iter()
            .map(ToString::to_string)
            .collect();
        let ctx = crate::core::tenant_context::TenantContext {
            user_id: user.id,
            organization_id: membership.organization_id,
            role: membership.role.clone(),
            permissions: permissions.clone(),
        };
        let org = self.org_repo.get_organization(&ctx)?;

        let access_token = self.token_service.issue_access_token(
            user.id,
            org.id,
            membership.role.clone(),
            Some(permissions.clone()),
        )?;
        let (new_refresh_token, _) =
            self.token_service
                .issue_refresh_token(user.id, org.id, claims.family_id)?;

        Ok(AuthSessionResponse {
            access_token,
            refresh_token: new_refresh_token,
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            organization: org,
            role: membership.role,
            permissions,
        })
    }

    pub fn revoke_refresh_token(&self, refresh_token: &str) -> AppResult<()> {
        let token_hash = TokenService::hash_token(refresh_token);
        self.revoked_token_hashes
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(token_hash);
        Ok(())
    }
}
