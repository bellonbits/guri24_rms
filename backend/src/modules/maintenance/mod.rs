use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    events::{DomainEvent, EventBus},
    tenant_context::TenantContext,
};

/// Section 10: Maintenance Workflow Statuses
/// Submitted -> Reviewed -> Approved -> Assigned -> InProgress -> Completed -> Verified -> Closed (or Rejected)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum MaintenanceStatus {
    Submitted,
    Reviewed,
    Approved,
    Rejected,
    Assigned,
    InProgress,
    Completed,
    Verified,
    Closed,
}

impl MaintenanceStatus {
    pub fn can_transition_to(&self, next: Self) -> bool {
        matches!(
            (self, next),
            (Self::Submitted, Self::Reviewed)
                | (Self::Reviewed, Self::Approved)
                | (Self::Reviewed, Self::Rejected)
                | (Self::Approved, Self::Assigned)
                | (Self::Assigned, Self::InProgress)
                | (Self::InProgress, Self::Completed)
                | (Self::Completed, Self::Verified)
                | (Self::Verified, Self::Closed)
        )
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkOrder {
    pub id: Uuid,
    pub work_order_number: String,
    pub maintenance_request_id: Uuid,
    pub assigned_vendor_name: Option<String>,
    pub assigned_officer_name: Option<String>,
    pub instructions: String,
    pub approved_budget_kes: Decimal,
    pub actual_cost_kes: Decimal,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MaintenanceRequest {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub unit_id: Uuid,
    pub tenant_id: Option<Uuid>,
    pub request_number: String,
    pub category: String,
    pub priority: String,
    pub title: String,
    pub description: String,
    pub status: MaintenanceStatus,
    pub estimated_cost_kes: Decimal,
    pub actual_cost_kes: Decimal,
    pub work_order: Option<WorkOrder>,
    pub completion_notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SubmitMaintenanceCommand {
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub unit_id: Uuid,
    pub tenant_id: Option<Uuid>,
    pub category: String,
    pub priority: String,
    pub title: String,
    pub description: String,
    pub estimated_cost_kes: Decimal,
}

#[derive(Debug, Clone, Deserialize)]
pub struct TransitionMaintenanceCommand {
    pub next_status: MaintenanceStatus,
    pub assigned_vendor_name: Option<String>,
    pub assigned_officer_name: Option<String>,
    pub instructions: Option<String>,
    pub actual_cost_kes: Option<Decimal>,
    pub completion_notes: Option<String>,
}

/// Section 5.1: Repository Pattern - MaintenanceRepository
pub trait MaintenanceRepository: Send + Sync {
    fn submit_request(
        &self,
        ctx: &TenantContext,
        cmd: SubmitMaintenanceCommand,
    ) -> AppResult<MaintenanceRequest>;
    fn transition_status(
        &self,
        ctx: &TenantContext,
        request_id: Uuid,
        cmd: TransitionMaintenanceCommand,
    ) -> AppResult<MaintenanceRequest>;
    fn get_request(&self, ctx: &TenantContext, request_id: Uuid) -> AppResult<MaintenanceRequest>;
    fn list_requests(&self, ctx: &TenantContext) -> AppResult<Vec<MaintenanceRequest>>;
}

pub struct InMemoryMaintenanceRepository {
    requests: Arc<RwLock<HashMap<Uuid, MaintenanceRequest>>>,
    event_bus: EventBus,
}

impl InMemoryMaintenanceRepository {
    pub fn new(event_bus: EventBus) -> Self {
        Self {
            requests: Arc::new(RwLock::new(HashMap::new())),
            event_bus,
        }
    }
}

impl MaintenanceRepository for InMemoryMaintenanceRepository {
    fn submit_request(
        &self,
        ctx: &TenantContext,
        cmd: SubmitMaintenanceCommand,
    ) -> AppResult<MaintenanceRequest> {
        ctx.require_permission("maintenance.view")?;
        if cmd.title.trim().is_empty() || cmd.description.trim().is_empty() {
            return Err(AppError::Validation(
                "Maintenance request title and description are required".to_string(),
            ));
        }

        let mut guard = self.requests.write().unwrap_or_else(|e| e.into_inner());
        let seq = guard
            .values()
            .filter(|r| r.organization_id == ctx.organization_id)
            .count()
            + 1;

        let now = Utc::now();
        let req = MaintenanceRequest {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            building_id: cmd.building_id,
            unit_id: cmd.unit_id,
            tenant_id: cmd.tenant_id,
            request_number: format!("MNT-{seq:04}"),
            category: cmd.category,
            priority: cmd.priority.clone(),
            title: cmd.title,
            description: cmd.description,
            status: MaintenanceStatus::Submitted,
            estimated_cost_kes: cmd.estimated_cost_kes.max(Decimal::ZERO),
            actual_cost_kes: Decimal::ZERO,
            work_order: None,
            completion_notes: None,
            created_at: now,
            updated_at: now,
        };
        guard.insert(req.id, req.clone());
        drop(guard);

        self.event_bus.publish(DomainEvent::MaintenanceSubmitted {
            organization_id: ctx.organization_id,
            request_id: req.id,
            unit_id: req.unit_id,
            priority: cmd.priority,
        });

        Ok(req)
    }

    fn transition_status(
        &self,
        ctx: &TenantContext,
        request_id: Uuid,
        cmd: TransitionMaintenanceCommand,
    ) -> AppResult<MaintenanceRequest> {
        ctx.require_permission("maintenance.assign")?;
        let mut guard = self.requests.write().unwrap_or_else(|e| e.into_inner());
        let req = guard
            .get_mut(&request_id)
            .ok_or_else(|| AppError::NotFound("Maintenance request not found".to_string()))?;
        ctx.assert_owns_record(req.organization_id)?;

        if !req.status.can_transition_to(cmd.next_status) {
            return Err(AppError::BusinessRule(format!(
                "Invalid maintenance status transition from {:?} to {:?}",
                req.status, cmd.next_status
            )));
        }

        req.status = cmd.next_status;
        req.updated_at = Utc::now();

        if cmd.next_status == MaintenanceStatus::Assigned && req.work_order.is_none() {
            req.work_order = Some(WorkOrder {
                id: Uuid::new_v4(),
                work_order_number: format!("WO-{}", &req.request_number[4..]),
                maintenance_request_id: req.id,
                assigned_vendor_name: cmd.assigned_vendor_name,
                assigned_officer_name: cmd.assigned_officer_name,
                instructions: cmd
                    .instructions
                    .unwrap_or_else(|| "Inspect and resolve reported issue".to_string()),
                approved_budget_kes: req.estimated_cost_kes,
                actual_cost_kes: Decimal::ZERO,
                created_at: Utc::now(),
            });
        }

        if let Some(cost) = cmd.actual_cost_kes {
            req.actual_cost_kes = cost;
            if let Some(ref mut wo) = req.work_order {
                wo.actual_cost_kes = cost;
            }
        }

        if let Some(notes) = cmd.completion_notes {
            req.completion_notes = Some(notes);
        }

        let updated = req.clone();
        drop(guard);

        if cmd.next_status == MaintenanceStatus::Completed {
            self.event_bus.publish(DomainEvent::MaintenanceCompleted {
                organization_id: ctx.organization_id,
                request_id: updated.id,
                unit_id: updated.unit_id,
                actual_cost_kes: updated.actual_cost_kes,
            });
        }

        Ok(updated)
    }

    fn get_request(&self, ctx: &TenantContext, request_id: Uuid) -> AppResult<MaintenanceRequest> {
        ctx.require_permission("maintenance.view")?;
        let req = self
            .requests
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&request_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Maintenance request not found".to_string()))?;
        ctx.assert_owns_record(req.organization_id)?;
        Ok(req)
    }

    fn list_requests(&self, ctx: &TenantContext) -> AppResult<Vec<MaintenanceRequest>> {
        ctx.require_permission("maintenance.view")?;
        Ok(self
            .requests
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|r| r.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
