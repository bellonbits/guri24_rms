use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    security::{PasswordService, SystemRole},
    tenant_context::TenantContext,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Organization {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub organization_type: String,
    pub kra_pin: Option<String>,
    pub contact_email: String,
    pub contact_phone: String,
    pub county: String,
    pub currency: String,
    pub timezone: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrganizationSettings {
    pub organization_id: Uuid,
    pub rent_calculation_strategy: String,
    pub late_fee_strategy: String,
    pub late_fee_grace_days: u32,
    pub late_fee_percentage: Decimal,
    pub late_fee_flat_kes: Decimal,
    pub payment_allocation_strategy: String,
    pub deposit_calculation_strategy: String,
    pub default_deposit_months: Decimal,
    pub default_billing_day: u8,
    pub mpesa_paybill_shortcode: Option<String>,
    pub mpesa_consumer_key: Option<String>,
    pub mpesa_consumer_secret: Option<String>,
    pub mpesa_passkey: Option<String>,
    pub mpesa_callback_url: Option<String>,
    pub sms_notifications_enabled: bool,
    pub email_notifications_enabled: bool,
}

impl OrganizationSettings {
    pub fn default_for(organization_id: Uuid) -> Self {
        Self {
            organization_id,
            rent_calculation_strategy: "FIXED_MONTHLY".to_string(),
            late_fee_strategy: "PERCENTAGE_GRACE_PERIOD".to_string(),
            late_fee_grace_days: 5,
            late_fee_percentage: dec!(5.00),
            late_fee_flat_kes: dec!(0.00),
            payment_allocation_strategy: "FIFO_OLDEST_FIRST".to_string(),
            deposit_calculation_strategy: "MONTHS_MULTIPLIER".to_string(),
            default_deposit_months: dec!(1.00),
            default_billing_day: 5,
            mpesa_paybill_shortcode: Some("4098123".to_string()),
            mpesa_consumer_key: None,
            mpesa_consumer_secret: None,
            mpesa_passkey: None,
            mpesa_callback_url: None,
            sms_notifications_enabled: true,
            email_notifications_enabled: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserRecord {
    pub id: Uuid,
    pub email: String,
    pub phone: String,
    pub full_name: String,
    pub password_hash: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrganizationMembership {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub user_id: Uuid,
    pub role: SystemRole,
    pub is_active: bool,
    pub joined_at: DateTime<Utc>,
}

/// CQRS Command: Register Organization and Owner User
#[derive(Debug, Clone, Deserialize)]
pub struct RegisterOrganizationCommand {
    pub organization_name: String,
    pub organization_type: String,
    pub county: String,
    pub kra_pin: Option<String>,
    pub admin_full_name: String,
    pub admin_email: String,
    pub admin_phone: String,
    pub admin_password: String,
}

/// Section 5.1: Repository Pattern - OrganizationRepository
pub trait OrganizationRepository: Send + Sync {
    fn create_organization_with_admin(
        &self,
        cmd: RegisterOrganizationCommand,
    ) -> AppResult<(Organization, UserRecord, OrganizationMembership)>;
    fn get_organization(&self, ctx: &TenantContext) -> AppResult<Organization>;
    fn get_settings(&self, ctx: &TenantContext) -> AppResult<OrganizationSettings>;
    fn update_settings(
        &self,
        ctx: &TenantContext,
        settings: OrganizationSettings,
    ) -> AppResult<OrganizationSettings>;
    fn find_user_by_email(&self, email: &str) -> AppResult<Option<UserRecord>>;
    fn find_user_by_id(&self, user_id: Uuid) -> AppResult<Option<UserRecord>>;
    fn list_user_memberships(&self, user_id: Uuid) -> AppResult<Vec<OrganizationMembership>>;
    fn verify_active_membership(&self, org_id: Uuid, user_id: Uuid) -> AppResult<OrganizationMembership>;
    fn add_member(
        &self,
        ctx: &TenantContext,
        full_name: String,
        email: String,
        phone: String,
        password: String,
        role: SystemRole,
    ) -> AppResult<(UserRecord, OrganizationMembership)>;
}

#[derive(Default)]
pub struct InMemoryOrganizationRepository {
    organizations: Arc<RwLock<HashMap<Uuid, Organization>>>,
    settings: Arc<RwLock<HashMap<Uuid, OrganizationSettings>>>,
    users: Arc<RwLock<HashMap<Uuid, UserRecord>>>,
    memberships: Arc<RwLock<Vec<OrganizationMembership>>>,
}

impl InMemoryOrganizationRepository {
    pub fn new() -> Self {
        Self::default()
    }
}

impl OrganizationRepository for InMemoryOrganizationRepository {
    fn create_organization_with_admin(
        &self,
        cmd: RegisterOrganizationCommand,
    ) -> AppResult<(Organization, UserRecord, OrganizationMembership)> {
        if cmd.organization_name.trim().is_empty() {
            return Err(AppError::Validation(
                "Organization name is required".to_string(),
            ));
        }
        let email_norm = cmd.admin_email.trim().to_lowercase();
        if !email_norm.contains('@') {
            return Err(AppError::Validation("Valid admin email is required".to_string()));
        }

        let password_hash = PasswordService::hash_password(&cmd.admin_password)?;
        let now = Utc::now();
        let org_id = Uuid::new_v4();
        let slug = cmd
            .organization_name
            .to_lowercase()
            .chars()
            .map(|c| if c.is_ascii_alphanumeric() { c } else { '-' })
            .collect::<String>();

        let org = Organization {
            id: org_id,
            name: cmd.organization_name.trim().to_string(),
            slug: format!("{}-{}", slug.trim_matches('-'), &org_id.to_string()[..6]),
            organization_type: cmd.organization_type,
            kra_pin: cmd.kra_pin,
            contact_email: email_norm.clone(),
            contact_phone: cmd.admin_phone.trim().to_string(),
            county: cmd.county,
            currency: "KES".to_string(),
            timezone: "Africa/Nairobi".to_string(),
            status: "ACTIVE".to_string(),
            created_at: now,
        };

        let mut users_guard = self.users.write().unwrap_or_else(|e| e.into_inner());
        let user = if let Some(existing) = users_guard.values().find(|u| u.email == email_norm) {
            existing.clone()
        } else {
            let new_user = UserRecord {
                id: Uuid::new_v4(),
                email: email_norm,
                phone: cmd.admin_phone.trim().to_string(),
                full_name: cmd.admin_full_name.trim().to_string(),
                password_hash,
                is_active: true,
                created_at: now,
            };
            users_guard.insert(new_user.id, new_user.clone());
            new_user
        };

        let membership = OrganizationMembership {
            id: Uuid::new_v4(),
            organization_id: org_id,
            user_id: user.id,
            role: SystemRole::OrganizationAdministrator,
            is_active: true,
            joined_at: now,
        };

        self.organizations
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(org_id, org.clone());
        self.settings
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(org_id, OrganizationSettings::default_for(org_id));
        self.memberships
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .push(membership.clone());

        Ok((org, user, membership))
    }

    fn get_organization(&self, ctx: &TenantContext) -> AppResult<Organization> {
        self.organizations
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&ctx.organization_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Organization not found".to_string()))
    }

    fn get_settings(&self, ctx: &TenantContext) -> AppResult<OrganizationSettings> {
        self.settings
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&ctx.organization_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Organization settings not found".to_string()))
    }

    fn update_settings(
        &self,
        ctx: &TenantContext,
        mut settings: OrganizationSettings,
    ) -> AppResult<OrganizationSettings> {
        ctx.require_permission("users.manage")?;
        settings.organization_id = ctx.organization_id;
        self.settings
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(ctx.organization_id, settings.clone());
        Ok(settings)
    }

    fn find_user_by_email(&self, email: &str) -> AppResult<Option<UserRecord>> {
        let norm = email.trim().to_lowercase();
        Ok(self
            .users
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .find(|u| u.email == norm)
            .cloned())
    }

    fn find_user_by_id(&self, user_id: Uuid) -> AppResult<Option<UserRecord>> {
        Ok(self
            .users
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&user_id)
            .cloned())
    }

    fn list_user_memberships(&self, user_id: Uuid) -> AppResult<Vec<OrganizationMembership>> {
        Ok(self
            .memberships
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|m| m.user_id == user_id && m.is_active)
            .cloned()
            .collect())
    }

    fn verify_active_membership(
        &self,
        org_id: Uuid,
        user_id: Uuid,
    ) -> AppResult<OrganizationMembership> {
        self.memberships
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .find(|m| m.organization_id == org_id && m.user_id == user_id && m.is_active)
            .cloned()
            .ok_or_else(|| {
                AppError::TenantIsolationViolation(
                    "User does not have an active membership in the requested organization"
                        .to_string(),
                )
            })
    }

    fn add_member(
        &self,
        ctx: &TenantContext,
        full_name: String,
        email: String,
        phone: String,
        password: String,
        role: SystemRole,
    ) -> AppResult<(UserRecord, OrganizationMembership)> {
        ctx.require_permission("users.manage")?;
        let password_hash = PasswordService::hash_password(&password)?;
        let norm_email = email.trim().to_lowercase();
        let now = Utc::now();

        let mut users_guard = self.users.write().unwrap_or_else(|e| e.into_inner());
        let user = if let Some(existing) = users_guard.values().find(|u| u.email == norm_email) {
            existing.clone()
        } else {
            let u = UserRecord {
                id: Uuid::new_v4(),
                email: norm_email,
                phone,
                full_name,
                password_hash,
                is_active: true,
                created_at: now,
            };
            users_guard.insert(u.id, u.clone());
            u
        };

        let membership = OrganizationMembership {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            user_id: user.id,
            role,
            is_active: true,
            joined_at: now,
        };
        self.memberships
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .push(membership.clone());

        Ok((user, membership))
    }
}
