use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    events::{DomainEvent, EventBus},
    security::mask_and_hash_national_id,
    tenant_context::TenantContext,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tenant {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub tenant_code: String,
    pub full_name: String,
    pub phone: String,
    pub email: Option<String>,
    pub national_id_masked: Option<String>,
    #[serde(skip_serializing)]
    pub national_id_hash: Option<String>,
    pub emergency_contact_name: Option<String>,
    pub emergency_contact_phone: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TenantApplication {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub unit_id: Uuid,
    pub tenant_id: Uuid,
    pub proposed_move_in_date: NaiveDate,
    pub monthly_income_kes: Option<Decimal>,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

/// CQRS Command: Register Tenant (Phone-first onboarding for the Kenyan market)
#[derive(Debug, Clone, Deserialize)]
pub struct RegisterTenantCommand {
    pub full_name: String,
    pub phone: String,
    pub email: Option<String>,
    pub national_id_number: Option<String>,
    pub emergency_contact_name: Option<String>,
    pub emergency_contact_phone: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateApplicationCommand {
    pub property_id: Uuid,
    pub unit_id: Uuid,
    pub tenant_id: Uuid,
    pub proposed_move_in_date: NaiveDate,
    pub monthly_income_kes: Option<Decimal>,
}

/// Section 5.1: Repository Pattern - TenantRepository
pub trait TenantRepository: Send + Sync {
    fn register_tenant(&self, ctx: &TenantContext, cmd: RegisterTenantCommand) -> AppResult<Tenant>;
    fn get_tenant(&self, ctx: &TenantContext, tenant_id: Uuid) -> AppResult<Tenant>;
    fn list_tenants(&self, ctx: &TenantContext) -> AppResult<Vec<Tenant>>;
    fn submit_application(
        &self,
        ctx: &TenantContext,
        cmd: CreateApplicationCommand,
    ) -> AppResult<TenantApplication>;
    fn list_applications(&self, ctx: &TenantContext) -> AppResult<Vec<TenantApplication>>;
}

pub struct InMemoryTenantRepository {
    tenants: Arc<RwLock<HashMap<Uuid, Tenant>>>,
    applications: Arc<RwLock<HashMap<Uuid, TenantApplication>>>,
    event_bus: EventBus,
}

impl InMemoryTenantRepository {
    pub fn new(event_bus: EventBus) -> Self {
        Self {
            tenants: Arc::new(RwLock::new(HashMap::new())),
            applications: Arc::new(RwLock::new(HashMap::new())),
            event_bus,
        }
    }
}

impl TenantRepository for InMemoryTenantRepository {
    fn register_tenant(&self, ctx: &TenantContext, cmd: RegisterTenantCommand) -> AppResult<Tenant> {
        ctx.require_permission("tenants.create")?;
        if cmd.full_name.trim().is_empty() || cmd.phone.trim().is_empty() {
            return Err(AppError::Validation(
                "Tenant full name and Kenyan phone number are required".to_string(),
            ));
        }

        let mut guard = self.tenants.write().unwrap_or_else(|e| e.into_inner());
        if guard
            .values()
            .any(|t| t.organization_id == ctx.organization_id && t.phone == cmd.phone.trim())
        {
            return Err(AppError::Conflict(format!(
                "A tenant with phone '{}' is already registered in this organization",
                cmd.phone
            )));
        }

        let (national_id_masked, national_id_hash) = match cmd.national_id_number.as_deref() {
            Some(raw) if !raw.trim().is_empty() => {
                let (masked, hash) = mask_and_hash_national_id(raw, ctx.organization_id);
                (Some(masked), Some(hash))
            }
            _ => (None, None),
        };

        let org_tenant_count = guard
            .values()
            .filter(|t| t.organization_id == ctx.organization_id)
            .count()
            + 1;

        let tenant = Tenant {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            tenant_code: format!("TNT-{org_tenant_count:04}"),
            full_name: cmd.full_name.trim().to_string(),
            phone: cmd.phone.trim().to_string(),
            email: cmd.email,
            national_id_masked,
            national_id_hash,
            emergency_contact_name: cmd.emergency_contact_name,
            emergency_contact_phone: cmd.emergency_contact_phone,
            status: "ACTIVE".to_string(),
            created_at: Utc::now(),
        };

        guard.insert(tenant.id, tenant.clone());
        drop(guard);

        self.event_bus.publish(DomainEvent::TenantRegistered {
            organization_id: ctx.organization_id,
            tenant_id: tenant.id,
            full_name: tenant.full_name.clone(),
            phone: tenant.phone.clone(),
        });

        Ok(tenant)
    }

    fn get_tenant(&self, ctx: &TenantContext, tenant_id: Uuid) -> AppResult<Tenant> {
        ctx.require_permission("tenants.view")?;
        let tenant = self
            .tenants
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&tenant_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Tenant not found".to_string()))?;
        ctx.assert_owns_record(tenant.organization_id)?;
        Ok(tenant)
    }

    fn list_tenants(&self, ctx: &TenantContext) -> AppResult<Vec<Tenant>> {
        ctx.require_permission("tenants.view")?;
        Ok(self
            .tenants
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|t| t.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn submit_application(
        &self,
        ctx: &TenantContext,
        cmd: CreateApplicationCommand,
    ) -> AppResult<TenantApplication> {
        ctx.require_permission("tenants.create")?;
        let _tenant = self.get_tenant(ctx, cmd.tenant_id)?;
        let app = TenantApplication {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            unit_id: cmd.unit_id,
            tenant_id: cmd.tenant_id,
            proposed_move_in_date: cmd.proposed_move_in_date,
            monthly_income_kes: cmd.monthly_income_kes,
            status: "APPROVED".to_string(),
            created_at: Utc::now(),
        };
        self.applications
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(app.id, app.clone());
        Ok(app)
    }

    fn list_applications(&self, ctx: &TenantContext) -> AppResult<Vec<TenantApplication>> {
        ctx.require_permission("tenants.view")?;
        Ok(self
            .applications
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|a| a.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
