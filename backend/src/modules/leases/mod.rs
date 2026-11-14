use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        events::{DomainEvent, EventBus},
        tenant_context::TenantContext,
    },
    modules::{
        properties::{UnitRepository, UnitStatus},
        tenants::TenantRepository,
    },
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum LeaseStatus {
    Draft,
    PendingApproval,
    Active,
    Expiring,
    Renewed,
    Terminated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecurringLeaseCharge {
    pub charge_code: String,
    pub description: String,
    pub amount_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lease {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub unit_id: Uuid,
    pub primary_tenant_id: Uuid,
    pub co_tenant_ids: Vec<Uuid>,
    pub lease_number: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub billing_day: u8,
    pub monthly_rent_kes: Decimal,
    pub security_deposit_kes: Decimal,
    pub recurring_charges: Vec<RecurringLeaseCharge>,
    pub currency: String,
    pub status: LeaseStatus,
    pub payment_account_reference: String,
    pub renewed_from_lease_id: Option<Uuid>,
    pub termination_reason: Option<String>,
    pub activated_at: Option<DateTime<Utc>>,
    pub terminated_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

/// Section 5.9: Builder Pattern - LeaseBuilder
/// Enforces required invariants, valid dates, positive monetary amounts, and valid billing days.
pub struct LeaseBuilder {
    organization_id: Option<Uuid>,
    property_id: Option<Uuid>,
    building_id: Option<Uuid>,
    unit_id: Option<Uuid>,
    primary_tenant_id: Option<Uuid>,
    co_tenant_ids: Vec<Uuid>,
    lease_number: Option<String>,
    start_date: Option<NaiveDate>,
    end_date: Option<NaiveDate>,
    billing_day: u8,
    monthly_rent_kes: Option<Decimal>,
    security_deposit_kes: Decimal,
    recurring_charges: Vec<RecurringLeaseCharge>,
    payment_account_reference: Option<String>,
    renewed_from_lease_id: Option<Uuid>,
}

impl Default for LeaseBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl LeaseBuilder {
    pub fn new() -> Self {
        Self {
            organization_id: None,
            property_id: None,
            building_id: None,
            unit_id: None,
            primary_tenant_id: None,
            co_tenant_ids: Vec::new(),
            lease_number: None,
            start_date: None,
            end_date: None,
            billing_day: 5,
            monthly_rent_kes: None,
            security_deposit_kes: Decimal::ZERO,
            recurring_charges: Vec::new(),
            payment_account_reference: None,
            renewed_from_lease_id: None,
        }
    }

    pub fn organization_id(mut self, id: Uuid) -> Self {
        self.organization_id = Some(id);
        self
    }

    pub fn unit_hierarchy(mut self, property_id: Uuid, building_id: Uuid, unit_id: Uuid) -> Self {
        self.property_id = Some(property_id);
        self.building_id = Some(building_id);
        self.unit_id = Some(unit_id);
        self
    }

    pub fn primary_tenant_id(mut self, id: Uuid) -> Self {
        self.primary_tenant_id = Some(id);
        self
    }

    pub fn co_tenants(mut self, ids: Vec<Uuid>) -> Self {
        self.co_tenant_ids = ids;
        self
    }

    pub fn lease_number(mut self, num: impl Into<String>) -> Self {
        self.lease_number = Some(num.into());
        self
    }

    pub fn period(mut self, start_date: NaiveDate, end_date: NaiveDate) -> Self {
        self.start_date = Some(start_date);
        self.end_date = Some(end_date);
        self
    }

    pub fn billing_day(mut self, day: u8) -> Self {
        self.billing_day = day;
        self
    }

    pub fn financials(mut self, monthly_rent_kes: Decimal, security_deposit_kes: Decimal) -> Self {
        self.monthly_rent_kes = Some(monthly_rent_kes);
        self.security_deposit_kes = security_deposit_kes;
        self
    }

    pub fn recurring_charges(mut self, charges: Vec<RecurringLeaseCharge>) -> Self {
        self.recurring_charges = charges;
        self
    }

    pub fn payment_account_reference(mut self, reference: impl Into<String>) -> Self {
        self.payment_account_reference = Some(reference.into());
        self
    }

    pub fn renewed_from(mut self, lease_id: Uuid) -> Self {
        self.renewed_from_lease_id = Some(lease_id);
        self
    }

    pub fn build(self) -> AppResult<Lease> {
        let organization_id = self
            .organization_id
            .ok_or_else(|| AppError::Validation("organization_id is required".to_string()))?;
        let property_id = self
            .property_id
            .ok_or_else(|| AppError::Validation("property_id is required".to_string()))?;
        let building_id = self
            .building_id
            .ok_or_else(|| AppError::Validation("building_id is required".to_string()))?;
        let unit_id = self
            .unit_id
            .ok_or_else(|| AppError::Validation("unit_id is required".to_string()))?;
        let primary_tenant_id = self
            .primary_tenant_id
            .ok_or_else(|| AppError::Validation("primary_tenant_id is required".to_string()))?;
        let start_date = self
            .start_date
            .ok_or_else(|| AppError::Validation("start_date is required".to_string()))?;
        let end_date = self
            .end_date
            .ok_or_else(|| AppError::Validation("end_date is required".to_string()))?;
        if end_date <= start_date {
            return Err(AppError::Validation(
                "Lease end_date must be strictly after start_date".to_string(),
            ));
        }
        if !(1..=28).contains(&self.billing_day) {
            return Err(AppError::Validation(
                "Billing day must be between 1 and 28".to_string(),
            ));
        }
        let monthly_rent_kes = self
            .monthly_rent_kes
            .ok_or_else(|| AppError::Validation("monthly_rent_kes is required".to_string()))?;
        if monthly_rent_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Monthly rent must be greater than KES 0".to_string(),
            ));
        }
        if self.security_deposit_kes < Decimal::ZERO {
            return Err(AppError::Validation(
                "Security deposit cannot be negative".to_string(),
            ));
        }

        let lease_number = self
            .lease_number
            .unwrap_or_else(|| format!("LSE-{}", &Uuid::new_v4().to_string()[..8].to_uppercase()));
        let payment_account_reference = self
            .payment_account_reference
            .unwrap_or_else(|| lease_number.clone());

        Ok(Lease {
            id: Uuid::new_v4(),
            organization_id,
            property_id,
            building_id,
            unit_id,
            primary_tenant_id,
            co_tenant_ids: self.co_tenant_ids,
            lease_number,
            start_date,
            end_date,
            billing_day: self.billing_day,
            monthly_rent_kes,
            security_deposit_kes: self.security_deposit_kes,
            recurring_charges: self.recurring_charges,
            currency: "KES".to_string(),
            status: LeaseStatus::PendingApproval,
            payment_account_reference,
            renewed_from_lease_id: self.renewed_from_lease_id,
            termination_reason: None,
            activated_at: None,
            terminated_at: None,
            created_at: Utc::now(),
        })
    }
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateLeaseCommand {
    pub unit_id: Uuid,
    pub primary_tenant_id: Uuid,
    #[serde(default)]
    pub co_tenant_ids: Vec<Uuid>,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
    pub billing_day: u8,
    pub monthly_rent_kes: Decimal,
    pub security_deposit_kes: Decimal,
    #[serde(default)]
    pub recurring_charges: Vec<RecurringLeaseCharge>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RenewLeaseCommand {
    pub new_start_date: NaiveDate,
    pub new_end_date: NaiveDate,
    pub new_monthly_rent_kes: Decimal,
}

#[derive(Debug, Clone, Deserialize)]
pub struct TerminateLeaseCommand {
    pub reason: String,
}

/// Section 5.1: Repository Pattern - LeaseRepository
pub trait LeaseRepository: Send + Sync {
    fn create_lease(&self, ctx: &TenantContext, cmd: CreateLeaseCommand) -> AppResult<Lease>;
    fn activate_lease(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease>;
    fn mark_lease_expiring(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease>;
    fn renew_lease(
        &self,
        ctx: &TenantContext,
        lease_id: Uuid,
        cmd: RenewLeaseCommand,
    ) -> AppResult<Lease>;
    fn terminate_lease(
        &self,
        ctx: &TenantContext,
        lease_id: Uuid,
        cmd: TerminateLeaseCommand,
    ) -> AppResult<Lease>;
    fn get_lease(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease>;
    fn list_leases(&self, ctx: &TenantContext) -> AppResult<Vec<Lease>>;
}

pub struct InMemoryLeaseRepository {
    leases: Arc<RwLock<HashMap<Uuid, Lease>>>,
    unit_repo: Arc<dyn UnitRepository>,
    tenant_repo: Arc<dyn TenantRepository>,
    event_bus: EventBus,
}

impl InMemoryLeaseRepository {
    pub fn new(
        unit_repo: Arc<dyn UnitRepository>,
        tenant_repo: Arc<dyn TenantRepository>,
        event_bus: EventBus,
    ) -> Self {
        Self {
            leases: Arc::new(RwLock::new(HashMap::new())),
            unit_repo,
            tenant_repo,
            event_bus,
        }
    }
}

impl LeaseRepository for InMemoryLeaseRepository {
    fn create_lease(&self, ctx: &TenantContext, cmd: CreateLeaseCommand) -> AppResult<Lease> {
        ctx.require_permission("leases.create")?;
        let unit = self.unit_repo.get_unit(ctx, cmd.unit_id)?;
        let _tenant = self.tenant_repo.get_tenant(ctx, cmd.primary_tenant_id)?;

        // Check for overlapping active/expiring leases on the same unit
        let guard = self.leases.read().unwrap_or_else(|e| e.into_inner());
        let has_overlap = guard.values().any(|l| {
            l.unit_id == cmd.unit_id
                && matches!(l.status, LeaseStatus::Active | LeaseStatus::Expiring)
                && cmd.start_date <= l.end_date
                && cmd.end_date >= l.start_date
        });
        drop(guard);

        if has_overlap {
            return Err(AppError::BusinessRule(
                "Cannot create overlapping lease for a unit that already has an active lease in that period"
                    .to_string(),
            ));
        }

        let mut all_guard = self.leases.write().unwrap_or_else(|e| e.into_inner());
        let count = all_guard
            .values()
            .filter(|l| l.organization_id == ctx.organization_id)
            .count()
            + 1;

        let lease = LeaseBuilder::new()
            .organization_id(ctx.organization_id)
            .unit_hierarchy(unit.property_id, unit.building_id, unit.id)
            .primary_tenant_id(cmd.primary_tenant_id)
            .co_tenants(cmd.co_tenant_ids)
            .lease_number(format!("LSE-{count:04}"))
            .period(cmd.start_date, cmd.end_date)
            .billing_day(cmd.billing_day)
            .financials(cmd.monthly_rent_kes, cmd.security_deposit_kes)
            .recurring_charges(cmd.recurring_charges)
            .payment_account_reference(format!("RENT-{}", unit.unit_number))
            .build()?;

        all_guard.insert(lease.id, lease.clone());
        drop(all_guard);

        // Reserve unit if currently vacant
        if unit.status == UnitStatus::Vacant {
            self.unit_repo.update_unit_occupancy(
                ctx,
                unit.id,
                UnitStatus::Reserved,
                Some(cmd.primary_tenant_id),
                Some(lease.id),
            )?;
        }

        Ok(lease)
    }

    fn activate_lease(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease> {
        ctx.require_permission("leases.approve")?;
        let mut guard = self.leases.write().unwrap_or_else(|e| e.into_inner());

        let target_unit_id = {
            let lease = guard
                .get(&lease_id)
                .ok_or_else(|| AppError::NotFound("Lease not found".to_string()))?;
            ctx.assert_owns_record(lease.organization_id)?;
            if !matches!(
                lease.status,
                LeaseStatus::Draft | LeaseStatus::PendingApproval
            ) {
                return Err(AppError::BusinessRule(format!(
                    "Only Draft or PendingApproval leases can be activated (current: {:?})",
                    lease.status
                )));
            }
            lease.unit_id
        };

        // Ensure no other lease is currently Active/Expiring on the same unit
        if guard.values().any(|l| {
            l.id != lease_id
                && l.unit_id == target_unit_id
                && matches!(l.status, LeaseStatus::Active | LeaseStatus::Expiring)
        }) {
            return Err(AppError::BusinessRule(
                "Unit already has an active lease; terminate or renew the existing lease first"
                    .to_string(),
            ));
        }

        let lease = guard.get_mut(&lease_id).unwrap();
        lease.status = LeaseStatus::Active;
        lease.activated_at = Some(Utc::now());
        let activated = lease.clone();
        drop(guard);

        self.unit_repo.update_unit_occupancy(
            ctx,
            activated.unit_id,
            UnitStatus::Occupied,
            Some(activated.primary_tenant_id),
            Some(activated.id),
        )?;

        self.event_bus.publish(DomainEvent::LeaseActivated {
            organization_id: ctx.organization_id,
            lease_id: activated.id,
            unit_id: activated.unit_id,
            tenant_id: activated.primary_tenant_id,
            monthly_rent_kes: activated.monthly_rent_kes,
        });

        Ok(activated)
    }

    fn mark_lease_expiring(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease> {
        ctx.require_permission("leases.approve")?;
        let mut guard = self.leases.write().unwrap_or_else(|e| e.into_inner());
        let lease = guard
            .get_mut(&lease_id)
            .ok_or_else(|| AppError::NotFound("Lease not found".to_string()))?;
        ctx.assert_owns_record(lease.organization_id)?;
        if lease.status != LeaseStatus::Active {
            return Err(AppError::BusinessRule(
                "Only Active leases can transition to Expiring".to_string(),
            ));
        }
        lease.status = LeaseStatus::Expiring;
        let updated = lease.clone();
        drop(guard);

        let days_remaining = (updated.end_date - Utc::now().date_naive()).num_days();
        self.event_bus.publish(DomainEvent::LeaseExpiring {
            organization_id: ctx.organization_id,
            lease_id: updated.id,
            unit_id: updated.unit_id,
            days_remaining,
        });

        Ok(updated)
    }

    fn renew_lease(
        &self,
        ctx: &TenantContext,
        lease_id: Uuid,
        cmd: RenewLeaseCommand,
    ) -> AppResult<Lease> {
        ctx.require_permission("leases.approve")?;
        let mut guard = self.leases.write().unwrap_or_else(|e| e.into_inner());
        let existing = guard
            .get(&lease_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Lease not found".to_string()))?;
        ctx.assert_owns_record(existing.organization_id)?;

        if !matches!(existing.status, LeaseStatus::Active | LeaseStatus::Expiring) {
            return Err(AppError::BusinessRule(
                "Only Active or Expiring leases can be renewed".to_string(),
            ));
        }

        let count = guard
            .values()
            .filter(|l| l.organization_id == ctx.organization_id)
            .count()
            + 1;

        let mut renewed = LeaseBuilder::new()
            .organization_id(ctx.organization_id)
            .unit_hierarchy(existing.property_id, existing.building_id, existing.unit_id)
            .primary_tenant_id(existing.primary_tenant_id)
            .co_tenants(existing.co_tenant_ids.clone())
            .lease_number(format!("LSE-{count:04}"))
            .period(cmd.new_start_date, cmd.new_end_date)
            .billing_day(existing.billing_day)
            .financials(cmd.new_monthly_rent_kes, existing.security_deposit_kes)
            .recurring_charges(existing.recurring_charges.clone())
            .payment_account_reference(existing.payment_account_reference.clone())
            .renewed_from(existing.id)
            .build()?;

        renewed.status = LeaseStatus::Active;
        renewed.activated_at = Some(Utc::now());

        if let Some(old) = guard.get_mut(&lease_id) {
            old.status = LeaseStatus::Renewed;
        }
        guard.insert(renewed.id, renewed.clone());
        drop(guard);

        self.unit_repo.update_unit_occupancy(
            ctx,
            renewed.unit_id,
            UnitStatus::Occupied,
            Some(renewed.primary_tenant_id),
            Some(renewed.id),
        )?;

        Ok(renewed)
    }

    fn terminate_lease(
        &self,
        ctx: &TenantContext,
        lease_id: Uuid,
        cmd: TerminateLeaseCommand,
    ) -> AppResult<Lease> {
        ctx.require_permission("leases.approve")?;
        let mut guard = self.leases.write().unwrap_or_else(|e| e.into_inner());
        let lease = guard
            .get_mut(&lease_id)
            .ok_or_else(|| AppError::NotFound("Lease not found".to_string()))?;
        ctx.assert_owns_record(lease.organization_id)?;
        lease.status = LeaseStatus::Terminated;
        lease.terminated_at = Some(Utc::now());
        lease.termination_reason = Some(cmd.reason);
        let terminated = lease.clone();
        drop(guard);

        self.unit_repo.update_unit_occupancy(
            ctx,
            terminated.unit_id,
            UnitStatus::Vacant,
            None,
            None,
        )?;

        Ok(terminated)
    }

    fn get_lease(&self, ctx: &TenantContext, lease_id: Uuid) -> AppResult<Lease> {
        ctx.require_permission("leases.view")?;
        let lease = self
            .leases
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&lease_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Lease not found".to_string()))?;
        ctx.assert_owns_record(lease.organization_id)?;
        Ok(lease)
    }

    fn list_leases(&self, ctx: &TenantContext) -> AppResult<Vec<Lease>> {
        ctx.require_permission("leases.view")?;
        Ok(self
            .leases
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|l| l.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
