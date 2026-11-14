use std::sync::RwLock;
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    tenant_context::TenantContext,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Vendor {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub vendor_code: String,
    pub company_name: String,
    pub trade_category: String,
    pub contact_person: String,
    pub phone: String,
    pub email: Option<String>,
    pub kra_pin: Option<String>,
    pub rating: Decimal,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateVendorCommand {
    pub vendor_code: String,
    pub company_name: String,
    pub trade_category: String,
    pub contact_person: String,
    pub phone: String,
    pub email: Option<String>,
    pub kra_pin: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InspectionRecord {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub unit_id: Uuid,
    pub lease_id: Option<Uuid>,
    pub inspection_type: String,
    pub scheduled_date: NaiveDate,
    pub inspector_name: String,
    pub status: String,
    pub overall_condition: String,
    pub recommended_deposit_deduction_kes: Decimal,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateInspectionCommand {
    pub property_id: Uuid,
    pub unit_id: Uuid,
    pub lease_id: Option<Uuid>,
    pub inspection_type: String,
    pub scheduled_date: NaiveDate,
    pub inspector_name: String,
    pub overall_condition: String,
    pub recommended_deposit_deduction_kes: Decimal,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubscriptionSummary {
    pub organization_id: Uuid,
    pub plan_code: String,
    pub plan_name: String,
    pub monthly_price_kes: Decimal,
    pub status: String,
    pub max_units: u32,
    pub max_ocr_pages_per_month: u32,
    pub max_ai_queries_per_month: u32,
}

pub trait OperationsRepository: Send + Sync {
    fn create_vendor(&self, ctx: &TenantContext, cmd: CreateVendorCommand) -> AppResult<Vendor>;
    fn list_vendors(&self, ctx: &TenantContext) -> AppResult<Vec<Vendor>>;
    fn create_inspection(
        &self,
        ctx: &TenantContext,
        cmd: CreateInspectionCommand,
    ) -> AppResult<InspectionRecord>;
    fn list_inspections(&self, ctx: &TenantContext) -> AppResult<Vec<InspectionRecord>>;
    fn get_subscription(&self, ctx: &TenantContext) -> AppResult<SubscriptionSummary>;
}

pub struct InMemoryOperationsRepository {
    vendors: RwLock<Vec<Vendor>>,
    inspections: RwLock<Vec<InspectionRecord>>,
}

impl InMemoryOperationsRepository {
    pub fn new() -> Self {
        Self {
            vendors: RwLock::new(Vec::new()),
            inspections: RwLock::new(Vec::new()),
        }
    }
}

impl Default for InMemoryOperationsRepository {
    fn default() -> Self {
        Self::new()
    }
}

impl OperationsRepository for InMemoryOperationsRepository {
    fn create_vendor(&self, ctx: &TenantContext, cmd: CreateVendorCommand) -> AppResult<Vendor> {
        ctx.require_permission("maintenance.assign")?;
        if cmd.company_name.trim().is_empty() {
            return Err(AppError::Validation(
                "Vendor company_name is required".to_string(),
            ));
        }
        let v = Vendor {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            vendor_code: cmd.vendor_code.trim().to_uppercase(),
            company_name: cmd.company_name.trim().to_string(),
            trade_category: cmd.trade_category,
            contact_person: cmd.contact_person,
            phone: cmd.phone,
            email: cmd.email,
            kra_pin: cmd.kra_pin,
            rating: Decimal::new(500, 2),
            status: "ACTIVE".to_string(),
            created_at: Utc::now(),
        };
        self.vendors.write().unwrap().push(v.clone());
        Ok(v)
    }

    fn list_vendors(&self, ctx: &TenantContext) -> AppResult<Vec<Vendor>> {
        ctx.require_permission("maintenance.view")?;
        let store = self.vendors.read().unwrap();
        Ok(store
            .iter()
            .filter(|v| v.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn create_inspection(
        &self,
        ctx: &TenantContext,
        cmd: CreateInspectionCommand,
    ) -> AppResult<InspectionRecord> {
        ctx.require_permission("properties.update")?;
        let rec = InspectionRecord {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            unit_id: cmd.unit_id,
            lease_id: cmd.lease_id,
            inspection_type: cmd.inspection_type,
            scheduled_date: cmd.scheduled_date,
            inspector_name: cmd.inspector_name,
            status: "COMPLETED".to_string(),
            overall_condition: cmd.overall_condition,
            recommended_deposit_deduction_kes: cmd.recommended_deposit_deduction_kes.round_dp(2),
            notes: cmd.notes,
            created_at: Utc::now(),
        };
        self.inspections.write().unwrap().push(rec.clone());
        Ok(rec)
    }

    fn list_inspections(&self, ctx: &TenantContext) -> AppResult<Vec<InspectionRecord>> {
        ctx.require_permission("properties.view")?;
        let store = self.inspections.read().unwrap();
        Ok(store
            .iter()
            .filter(|i| i.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn get_subscription(&self, ctx: &TenantContext) -> AppResult<SubscriptionSummary> {
        ctx.require_permission("properties.view")?;
        Ok(SubscriptionSummary {
            organization_id: ctx.organization_id,
            plan_code: "ENTERPRISE_KENYA".to_string(),
            plan_name: "Guri24 Enterprise Estates Plan".to_string(),
            monthly_price_kes: Decimal::new(1490000, 2),
            status: "ACTIVE".to_string(),
            max_units: 500,
            max_ocr_pages_per_month: 2000,
            max_ai_queries_per_month: 5000,
        })
    }
}
