use std::sync::Arc;
use chrono::NaiveDate;

use crate::{
    core::{errors::AppResult, tenant_context::TenantContext},
    database::AppState,
    modules::{
        billing::{GenerateInvoiceCommand, Invoice},
        leases::LeaseStatus,
    },
};

/// Background Worker Jobs (Recurring Invoice Schedule & Lease Expiry Scanner)
pub struct BackgroundJobRunner {
    state: Arc<AppState>,
}

impl BackgroundJobRunner {
    pub fn new(state: Arc<AppState>) -> Self {
        Self { state }
    }

    /// Idempotently generates monthly rent invoices for all active leases in an organization
    pub fn run_monthly_billing_cycle(
        &self,
        ctx: &TenantContext,
        billing_period: &str,
        issue_date: NaiveDate,
        due_date: NaiveDate,
    ) -> AppResult<Vec<Invoice>> {
        let leases = self.state.repositories.leases.list_leases(ctx)?;
        let mut newly_generated = Vec::new();

        for lease in leases {
            if matches!(lease.status, LeaseStatus::Active | LeaseStatus::Expiring) {
                let (inv, created) = self.state.repositories.invoices.generate_recurring_invoice(
                    ctx,
                    GenerateInvoiceCommand {
                        lease_id: lease.id,
                        billing_period: billing_period.to_string(),
                        issue_date,
                        due_date,
                    },
                )?;
                if created {
                    newly_generated.push(inv);
                }
            }
        }
        Ok(newly_generated)
    }
}
