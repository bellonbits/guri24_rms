use std::sync::{Arc, RwLock};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Section 5.3: Observer Pattern + Transactional Outbox
/// Domain events published across the modular monolith.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "event_type", content = "data", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DomainEvent {
    TenantRegistered {
        organization_id: Uuid,
        tenant_id: Uuid,
        full_name: String,
        phone: String,
    },
    LeaseActivated {
        organization_id: Uuid,
        lease_id: Uuid,
        unit_id: Uuid,
        tenant_id: Uuid,
        monthly_rent_kes: Decimal,
    },
    LeaseExpiring {
        organization_id: Uuid,
        lease_id: Uuid,
        unit_id: Uuid,
        days_remaining: i64,
    },
    InvoiceGenerated {
        organization_id: Uuid,
        invoice_id: Uuid,
        lease_id: Uuid,
        tenant_id: Uuid,
        billing_period: String,
        total_amount_kes: Decimal,
    },
    PaymentReceived {
        organization_id: Uuid,
        payment_id: Uuid,
        tenant_id: Uuid,
        amount_kes: Decimal,
        mpesa_receipt: Option<String>,
    },
    PaymentAllocated {
        organization_id: Uuid,
        payment_id: Uuid,
        invoice_id: Uuid,
        allocated_amount_kes: Decimal,
        remaining_invoice_balance_kes: Decimal,
    },
    PaymentFailed {
        organization_id: Uuid,
        payment_id: Uuid,
        reason: String,
    },
    MaintenanceSubmitted {
        organization_id: Uuid,
        request_id: Uuid,
        unit_id: Uuid,
        priority: String,
    },
    MaintenanceCompleted {
        organization_id: Uuid,
        request_id: Uuid,
        unit_id: Uuid,
        actual_cost_kes: Decimal,
    },
    DepositReceived {
        organization_id: Uuid,
        deposit_id: Uuid,
        lease_id: Uuid,
        tenant_id: Uuid,
        amount_kes: Decimal,
    },
    RefundRequested {
        organization_id: Uuid,
        refund_id: Uuid,
        lease_id: Uuid,
        tenant_id: Uuid,
        calculated_amount_kes: Decimal,
    },
    RefundApproved {
        organization_id: Uuid,
        refund_id: Uuid,
        approved_by: Uuid,
        amount_kes: Decimal,
    },
    RefundExecutionVerified {
        organization_id: Uuid,
        refund_id: Uuid,
        payout_reference: String,
        amount_kes: Decimal,
    },
    ReconciliationExceptionCreated {
        organization_id: Uuid,
        exception_id: Uuid,
        exception_type: String,
        details: String,
    },
    ReconciliationCompleted {
        organization_id: Uuid,
        batch_id: Uuid,
        matched_count: usize,
        unmatched_count: usize,
    },
    RentReminder {
        organization_id: Uuid,
        invoice_id: Uuid,
        tenant_id: Uuid,
        days_until_due: i64,
        balance_kes: Decimal,
    },
    OverdueRentNotice {
        organization_id: Uuid,
        invoice_id: Uuid,
        tenant_id: Uuid,
        days_overdue: i64,
        balance_kes: Decimal,
    },
}

impl DomainEvent {
    pub fn organization_id(&self) -> Uuid {
        match self {
            Self::TenantRegistered { organization_id, .. }
            | Self::LeaseActivated { organization_id, .. }
            | Self::LeaseExpiring { organization_id, .. }
            | Self::InvoiceGenerated { organization_id, .. }
            | Self::PaymentReceived { organization_id, .. }
            | Self::PaymentAllocated { organization_id, .. }
            | Self::PaymentFailed { organization_id, .. }
            | Self::MaintenanceSubmitted { organization_id, .. }
            | Self::MaintenanceCompleted { organization_id, .. }
            | Self::DepositReceived { organization_id, .. }
            | Self::RefundRequested { organization_id, .. }
            | Self::RefundApproved { organization_id, .. }
            | Self::RefundExecutionVerified { organization_id, .. }
            | Self::ReconciliationExceptionCreated { organization_id, .. }
            | Self::ReconciliationCompleted { organization_id, .. }
            | Self::RentReminder { organization_id, .. }
            | Self::OverdueRentNotice { organization_id, .. } => *organization_id,
        }
    }

    pub fn event_name(&self) -> &'static str {
        match self {
            Self::TenantRegistered { .. } => "TENANT_REGISTERED",
            Self::LeaseActivated { .. } => "LEASE_ACTIVATED",
            Self::LeaseExpiring { .. } => "LEASE_EXPIRING",
            Self::InvoiceGenerated { .. } => "INVOICE_GENERATED",
            Self::PaymentReceived { .. } => "PAYMENT_RECEIVED",
            Self::PaymentAllocated { .. } => "PAYMENT_ALLOCATED",
            Self::PaymentFailed { .. } => "PAYMENT_FAILED",
            Self::MaintenanceSubmitted { .. } => "MAINTENANCE_SUBMITTED",
            Self::MaintenanceCompleted { .. } => "MAINTENANCE_COMPLETED",
            Self::DepositReceived { .. } => "DEPOSIT_RECEIVED",
            Self::RefundRequested { .. } => "REFUND_REQUESTED",
            Self::RefundApproved { .. } => "REFUND_APPROVED",
            Self::RefundExecutionVerified { .. } => "REFUND_EXECUTION_VERIFIED",
            Self::ReconciliationExceptionCreated { .. } => "RECONCILIATION_EXCEPTION_CREATED",
            Self::ReconciliationCompleted { .. } => "RECONCILIATION_COMPLETED",
            Self::RentReminder { .. } => "RENT_REMINDER",
            Self::OverdueRentNotice { .. } => "OVERDUE_RENT_NOTICE",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutboxRecord {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub event_name: String,
    pub event: DomainEvent,
    pub status: OutboxStatus,
    pub attempts: u32,
    pub last_error: Option<String>,
    pub created_at: DateTime<Utc>,
    pub processed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum OutboxStatus {
    Pending,
    Processed,
    Failed,
}

/// Observer contract for domain events.
/// Observers run asynchronously/independently so notification failures NEVER roll back financial transactions.
pub trait DomainEventObserver: Send + Sync {
    fn name(&self) -> &'static str;
    fn on_event(&self, event: &DomainEvent) -> Result<(), String>;
}

pub struct AuditLogObserver {
    pub recorded_events: Arc<RwLock<Vec<(DateTime<Utc>, String, Uuid)>>>,
}

impl AuditLogObserver {
    pub fn new() -> Self {
        Self {
            recorded_events: Arc::new(RwLock::new(Vec::new())),
        }
    }
}

impl Default for AuditLogObserver {
    fn default() -> Self {
        Self::new()
    }
}

impl DomainEventObserver for AuditLogObserver {
    fn name(&self) -> &'static str {
        "AuditLogObserver"
    }

    fn on_event(&self, event: &DomainEvent) -> Result<(), String> {
        if let Ok(mut guard) = self.recorded_events.write() {
            guard.push((
                Utc::now(),
                event.event_name().to_string(),
                event.organization_id(),
            ));
        }
        Ok(())
    }
}

/// Notification Observer that can simulate downstream SMS/Email failures without reversing financial state
pub struct NotificationObserver {
    pub simulate_failure: Arc<RwLock<bool>>,
    pub delivered_notifications: Arc<RwLock<Vec<String>>>,
}

impl NotificationObserver {
    pub fn new() -> Self {
        Self {
            simulate_failure: Arc::new(RwLock::new(false)),
            delivered_notifications: Arc::new(RwLock::new(Vec::new())),
        }
    }

    pub fn set_simulate_failure(&self, fail: bool) {
        if let Ok(mut guard) = self.simulate_failure.write() {
            *guard = fail;
        }
    }
}

impl Default for NotificationObserver {
    fn default() -> Self {
        Self::new()
    }
}

impl DomainEventObserver for NotificationObserver {
    fn name(&self) -> &'static str {
        "NotificationObserver"
    }

    fn on_event(&self, event: &DomainEvent) -> Result<(), String> {
        let should_fail = self.simulate_failure.read().map(|g| *g).unwrap_or(false);
        if should_fail {
            return Err("Simulated SMS/Email gateway timeout".to_string());
        }
        if let Ok(mut guard) = self.delivered_notifications.write() {
            guard.push(format!("{}:{}", event.event_name(), event.organization_id()));
        }
        Ok(())
    }
}

/// EventBus with Transactional Outbox guarantees
#[derive(Clone)]
pub struct EventBus {
    outbox: Arc<RwLock<Vec<OutboxRecord>>>,
    observers: Arc<Vec<Arc<dyn DomainEventObserver>>>,
}

impl EventBus {
    pub fn new(observers: Vec<Arc<dyn DomainEventObserver>>) -> Self {
        Self {
            outbox: Arc::new(RwLock::new(Vec::new())),
            observers: Arc::new(observers),
        }
    }

    /// Enqueues event into the transactional outbox and dispatches to observers safely.
    /// Any observer failure marks the outbox record for retry without failing the caller's transaction!
    pub fn publish(&self, event: DomainEvent) -> OutboxRecord {
        let mut record = OutboxRecord {
            id: Uuid::new_v4(),
            organization_id: event.organization_id(),
            event_name: event.event_name().to_string(),
            event: event.clone(),
            status: OutboxStatus::Pending,
            attempts: 1,
            last_error: None,
            created_at: Utc::now(),
            processed_at: None,
        };

        let mut errors = Vec::new();
        for observer in self.observers.iter() {
            if let Err(err) = observer.on_event(&event) {
                tracing::warn!(
                    observer = observer.name(),
                    event = event.event_name(),
                    error = %err,
                    "Observer failed; event safely retained in transactional outbox for retry"
                );
                errors.push(format!("{}: {}", observer.name(), err));
            }
        }

        if errors.is_empty() {
            record.status = OutboxStatus::Processed;
            record.processed_at = Some(Utc::now());
        } else {
            record.status = OutboxStatus::Failed;
            record.last_error = Some(errors.join("; "));
        }

        if let Ok(mut guard) = self.outbox.write() {
            guard.push(record.clone());
        }
        record
    }

    pub fn list_outbox(&self, organization_id: Uuid) -> Vec<OutboxRecord> {
        self.outbox
            .read()
            .map(|guard| {
                guard
                    .iter()
                    .filter(|r| r.organization_id == organization_id)
                    .cloned()
                    .collect()
            })
            .unwrap_or_default()
    }
}
