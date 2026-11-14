use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, NaiveDate, Utc};
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        events::{DomainEvent, EventBus},
        tenant_context::TenantContext,
    },
    modules::{
        accounting::{AccountType, AccountingRepository, JournalLine},
        leases::{Lease, LeaseRepository, LeaseStatus},
    },
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum InvoiceStatus {
    Draft,
    Issued,
    PartiallyPaid,
    Paid,
    Overdue,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct InvoiceLineItem {
    pub item_code: String,
    pub description: String,
    pub quantity: Decimal,
    pub unit_price_kes: Decimal,
    pub line_total_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Invoice {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub unit_id: Uuid,
    pub lease_id: Uuid,
    pub tenant_id: Uuid,
    pub invoice_number: String,
    pub billing_period: String, // YYYY-MM
    pub issue_date: NaiveDate,
    pub due_date: NaiveDate,
    pub items: Vec<InvoiceLineItem>,
    pub subtotal_kes: Decimal,
    pub penalty_kes: Decimal,
    pub credit_applied_kes: Decimal,
    pub total_amount_kes: Decimal,
    pub amount_paid_kes: Decimal,
    pub balance_kes: Decimal,
    pub currency: String,
    pub status: InvoiceStatus,
    pub idempotency_key: String,
    pub created_at: DateTime<Utc>,
}

/// Section 5.6: Strategy Pattern - RentCalculationStrategy
pub trait RentCalculationStrategy: Send + Sync {
    fn compute_rent(&self, monthly_rent_kes: Decimal, occupied_days: u32, days_in_month: u32)
        -> Decimal;
}

pub struct FixedMonthlyRentStrategy;

impl RentCalculationStrategy for FixedMonthlyRentStrategy {
    fn compute_rent(
        &self,
        monthly_rent_kes: Decimal,
        _occupied_days: u32,
        _days_in_month: u32,
    ) -> Decimal {
        monthly_rent_kes.round_dp(2)
    }
}

pub struct ProratedDailyRentStrategy;

impl RentCalculationStrategy for ProratedDailyRentStrategy {
    fn compute_rent(
        &self,
        monthly_rent_kes: Decimal,
        occupied_days: u32,
        days_in_month: u32,
    ) -> Decimal {
        if days_in_month == 0 {
            return monthly_rent_kes;
        }
        let ratio = Decimal::from(occupied_days) / Decimal::from(days_in_month);
        (monthly_rent_kes * ratio).round_dp(2)
    }
}

/// Section 5.6: Strategy Pattern - LateFeeStrategy
pub trait LateFeeStrategy: Send + Sync {
    fn compute_late_fee(&self, overdue_balance_kes: Decimal, days_past_due: i64) -> Decimal;
}

pub struct PercentageGracePeriodLateFeeStrategy {
    pub grace_days: i64,
    pub percentage: Decimal,
}

impl LateFeeStrategy for PercentageGracePeriodLateFeeStrategy {
    fn compute_late_fee(&self, overdue_balance_kes: Decimal, days_past_due: i64) -> Decimal {
        if overdue_balance_kes <= Decimal::ZERO || days_past_due <= self.grace_days {
            Decimal::ZERO
        } else {
            ((overdue_balance_kes * self.percentage) / dec!(100)).round_dp(2)
        }
    }
}

/// Section 5.6: Strategy Pattern - InvoiceGenerationStrategy
pub trait InvoiceGenerationStrategy: Send + Sync {
    fn build_line_items(&self, lease: &Lease, billing_period: &str) -> Vec<InvoiceLineItem>;
}

pub struct StandardMonthlyInvoiceStrategy;

impl InvoiceGenerationStrategy for StandardMonthlyInvoiceStrategy {
    fn build_line_items(&self, lease: &Lease, billing_period: &str) -> Vec<InvoiceLineItem> {
        let mut items = vec![InvoiceLineItem {
            item_code: "RENT".to_string(),
            description: format!("Monthly Residential Rent ({billing_period})"),
            quantity: dec!(1.00),
            unit_price_kes: lease.monthly_rent_kes,
            line_total_kes: lease.monthly_rent_kes,
        }];
        for charge in &lease.recurring_charges {
            items.push(InvoiceLineItem {
                item_code: charge.charge_code.clone(),
                description: format!("{} ({billing_period})", charge.description),
                quantity: dec!(1.00),
                unit_price_kes: charge.amount_kes,
                line_total_kes: charge.amount_kes,
            });
        }
        items
    }
}

/// Section 5.9: Builder Pattern - InvoiceBuilder
pub struct InvoiceBuilder {
    organization_id: Option<Uuid>,
    property_id: Option<Uuid>,
    unit_id: Option<Uuid>,
    lease_id: Option<Uuid>,
    tenant_id: Option<Uuid>,
    invoice_number: Option<String>,
    billing_period: Option<String>,
    issue_date: NaiveDate,
    due_date: NaiveDate,
    items: Vec<InvoiceLineItem>,
    penalty_kes: Decimal,
    idempotency_key: Option<String>,
}

impl InvoiceBuilder {
    pub fn new(issue_date: NaiveDate, due_date: NaiveDate) -> Self {
        Self {
            organization_id: None,
            property_id: None,
            unit_id: None,
            lease_id: None,
            tenant_id: None,
            invoice_number: None,
            billing_period: None,
            issue_date,
            due_date,
            items: Vec::new(),
            penalty_kes: Decimal::ZERO,
            idempotency_key: None,
        }
    }

    pub fn from_lease(mut self, lease: &Lease, billing_period: impl Into<String>) -> Self {
        let period = billing_period.into();
        self.organization_id = Some(lease.organization_id);
        self.property_id = Some(lease.property_id);
        self.unit_id = Some(lease.unit_id);
        self.lease_id = Some(lease.id);
        self.tenant_id = Some(lease.primary_tenant_id);
        self.idempotency_key = Some(format!(
            "INV:{}:{}:{}",
            lease.organization_id, lease.id, period
        ));
        self.billing_period = Some(period);
        self
    }

    pub fn invoice_number(mut self, num: impl Into<String>) -> Self {
        self.invoice_number = Some(num.into());
        self
    }

    pub fn items(mut self, items: Vec<InvoiceLineItem>) -> Self {
        self.items = items;
        self
    }

    pub fn build(self) -> AppResult<Invoice> {
        let organization_id = self
            .organization_id
            .ok_or_else(|| AppError::Validation("organization_id is required".to_string()))?;
        let property_id = self
            .property_id
            .ok_or_else(|| AppError::Validation("property_id is required".to_string()))?;
        let unit_id = self
            .unit_id
            .ok_or_else(|| AppError::Validation("unit_id is required".to_string()))?;
        let lease_id = self
            .lease_id
            .ok_or_else(|| AppError::Validation("lease_id is required".to_string()))?;
        let tenant_id = self
            .tenant_id
            .ok_or_else(|| AppError::Validation("tenant_id is required".to_string()))?;
        let billing_period = self
            .billing_period
            .ok_or_else(|| AppError::Validation("billing_period is required".to_string()))?;

        if self.items.is_empty() {
            return Err(AppError::Validation(
                "Invoice must contain at least one line item".to_string(),
            ));
        }

        let subtotal_kes: Decimal = self.items.iter().map(|i| i.line_total_kes).sum();
        let total_amount_kes = subtotal_kes + self.penalty_kes;
        if total_amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Invoice total must be greater than KES 0".to_string(),
            ));
        }

        let idempotency_key = self
            .idempotency_key
            .unwrap_or_else(|| format!("INV:{organization_id}:{lease_id}:{billing_period}"));

        Ok(Invoice {
            id: Uuid::new_v4(),
            organization_id,
            property_id,
            unit_id,
            lease_id,
            tenant_id,
            invoice_number: self
                .invoice_number
                .unwrap_or_else(|| format!("INV-{}", &Uuid::new_v4().to_string()[..8].to_uppercase())),
            billing_period,
            issue_date: self.issue_date,
            due_date: self.due_date,
            items: self.items,
            subtotal_kes,
            penalty_kes: self.penalty_kes,
            credit_applied_kes: Decimal::ZERO,
            total_amount_kes,
            amount_paid_kes: Decimal::ZERO,
            balance_kes: total_amount_kes,
            currency: "KES".to_string(),
            status: InvoiceStatus::Issued,
            idempotency_key,
            created_at: Utc::now(),
        })
    }
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct GenerateInvoiceCommand {
    pub lease_id: Uuid,
    pub billing_period: String, // e.g. "2026-11"
    pub issue_date: NaiveDate,
    pub due_date: NaiveDate,
}

/// Section 5.1: Repository Pattern - InvoiceRepository
pub trait InvoiceRepository: Send + Sync {
    /// Generates an invoice idempotently for `(organization_id, lease_id, billing_period)`.
    /// Calling it multiple times for the same period returns the existing invoice without duplicating charges or journals!
    fn generate_recurring_invoice(
        &self,
        ctx: &TenantContext,
        cmd: GenerateInvoiceCommand,
    ) -> AppResult<(Invoice, bool)>;
    fn get_invoice(&self, ctx: &TenantContext, invoice_id: Uuid) -> AppResult<Invoice>;
    fn list_invoices(&self, ctx: &TenantContext) -> AppResult<Vec<Invoice>>;
    fn list_outstanding_invoices_for_tenant(
        &self,
        ctx: &TenantContext,
        tenant_id: Uuid,
    ) -> AppResult<Vec<Invoice>>;
    fn apply_payment_to_invoice(
        &self,
        ctx: &TenantContext,
        invoice_id: Uuid,
        amount_kes: Decimal,
    ) -> AppResult<Invoice>;
}

pub struct InMemoryInvoiceRepository {
    invoices: Arc<RwLock<HashMap<Uuid, Invoice>>>,
    lease_repo: Arc<dyn LeaseRepository>,
    accounting_repo: Arc<dyn AccountingRepository>,
    event_bus: EventBus,
}

impl InMemoryInvoiceRepository {
    pub fn new(
        lease_repo: Arc<dyn LeaseRepository>,
        accounting_repo: Arc<dyn AccountingRepository>,
        event_bus: EventBus,
    ) -> Self {
        Self {
            invoices: Arc::new(RwLock::new(HashMap::new())),
            lease_repo,
            accounting_repo,
            event_bus,
        }
    }
}

impl InvoiceRepository for InMemoryInvoiceRepository {
    fn generate_recurring_invoice(
        &self,
        ctx: &TenantContext,
        cmd: GenerateInvoiceCommand,
    ) -> AppResult<(Invoice, bool)> {
        ctx.require_permission("invoices.create")?;
        let lease = self.lease_repo.get_lease(ctx, cmd.lease_id)?;

        if !matches!(lease.status, LeaseStatus::Active | LeaseStatus::Expiring) {
            return Err(AppError::BusinessRule(
                "Recurring invoices can only be generated for Active or Expiring leases"
                    .to_string(),
            ));
        }

        let mut guard = self.invoices.write().unwrap_or_else(|e| e.into_inner());
        // Idempotency check: if an invoice already exists for (organization_id, lease_id, billing_period), return it!
        if let Some(existing) = guard.values().find(|inv| {
            inv.organization_id == ctx.organization_id
                && inv.lease_id == cmd.lease_id
                && inv.billing_period == cmd.billing_period
                && inv.status != InvoiceStatus::Cancelled
        }) {
            return Ok((existing.clone(), false));
        }

        let seq = guard
            .values()
            .filter(|i| i.organization_id == ctx.organization_id)
            .count()
            + 1;

        let strategy = StandardMonthlyInvoiceStrategy;
        let line_items = strategy.build_line_items(&lease, &cmd.billing_period);

        let invoice = InvoiceBuilder::new(cmd.issue_date, cmd.due_date)
            .from_lease(&lease, cmd.billing_period.clone())
            .invoice_number(format!("INV-{}-{seq:04}", cmd.billing_period.replace('-', "")))
            .items(line_items)
            .build()?;

        guard.insert(invoice.id, invoice.clone());
        drop(guard);

        // Post Double-Entry Journal: DR Accounts Receivable (1100) / CR Residential Rental Revenue (4000)
        self.accounting_repo.post_journal_entry(
            ctx.organization_id,
            Some(invoice.property_id),
            "INVOICE_ISSUED",
            invoice.id,
            format!(
                "Invoice {} issued for period {}",
                invoice.invoice_number, invoice.billing_period
            ),
            vec![
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "1100".to_string(),
                    account_name: "Accounts Receivable - Tenants".to_string(),
                    account_type: AccountType::Asset,
                    tenant_id: Some(invoice.tenant_id),
                    lease_id: Some(invoice.lease_id),
                    debit_kes: invoice.total_amount_kes,
                    credit_kes: Decimal::ZERO,
                    memo: format!("Receivable for {}", invoice.invoice_number),
                },
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "4000".to_string(),
                    account_name: "Residential Rental Revenue".to_string(),
                    account_type: AccountType::Revenue,
                    tenant_id: Some(invoice.tenant_id),
                    lease_id: Some(invoice.lease_id),
                    debit_kes: Decimal::ZERO,
                    credit_kes: invoice.total_amount_kes,
                    memo: format!("Rental revenue {}", invoice.billing_period),
                },
            ],
        )?;

        self.event_bus.publish(DomainEvent::InvoiceGenerated {
            organization_id: ctx.organization_id,
            invoice_id: invoice.id,
            lease_id: invoice.lease_id,
            tenant_id: invoice.tenant_id,
            billing_period: invoice.billing_period.clone(),
            total_amount_kes: invoice.total_amount_kes,
        });

        Ok((invoice, true))
    }

    fn get_invoice(&self, ctx: &TenantContext, invoice_id: Uuid) -> AppResult<Invoice> {
        ctx.require_permission("invoices.view")?;
        let inv = self
            .invoices
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&invoice_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Invoice not found".to_string()))?;
        ctx.assert_owns_record(inv.organization_id)?;
        Ok(inv)
    }

    fn list_invoices(&self, ctx: &TenantContext) -> AppResult<Vec<Invoice>> {
        ctx.require_permission("invoices.view")?;
        let mut list: Vec<Invoice> = self
            .invoices
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|i| i.organization_id == ctx.organization_id)
            .cloned()
            .collect();
        list.sort_by_key(|i| i.due_date);
        Ok(list)
    }

    fn list_outstanding_invoices_for_tenant(
        &self,
        ctx: &TenantContext,
        tenant_id: Uuid,
    ) -> AppResult<Vec<Invoice>> {
        let mut list: Vec<Invoice> = self
            .invoices
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|i| {
                i.organization_id == ctx.organization_id
                    && i.tenant_id == tenant_id
                    && i.balance_kes > Decimal::ZERO
                    && matches!(
                        i.status,
                        InvoiceStatus::Issued
                            | InvoiceStatus::PartiallyPaid
                            | InvoiceStatus::Overdue
                    )
            })
            .cloned()
            .collect();
        // Sort oldest due_date first for deterministic FIFO allocation
        list.sort_by(|a, b| {
            a.due_date
                .cmp(&b.due_date)
                .then_with(|| a.created_at.cmp(&b.created_at))
        });
        Ok(list)
    }

    fn apply_payment_to_invoice(
        &self,
        ctx: &TenantContext,
        invoice_id: Uuid,
        amount_kes: Decimal,
    ) -> AppResult<Invoice> {
        if amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Allocated payment amount must be positive".to_string(),
            ));
        }
        let mut guard = self.invoices.write().unwrap_or_else(|e| e.into_inner());
        let inv = guard
            .get_mut(&invoice_id)
            .ok_or_else(|| AppError::NotFound("Invoice not found".to_string()))?;
        ctx.assert_owns_record(inv.organization_id)?;

        if amount_kes > inv.balance_kes {
            return Err(AppError::FinancialIntegrity(
                "Cannot allocate more than the invoice remaining balance".to_string(),
            ));
        }

        inv.amount_paid_kes += amount_kes;
        inv.balance_kes = inv.total_amount_kes - inv.amount_paid_kes - inv.credit_applied_kes;
        inv.status = if inv.balance_kes == Decimal::ZERO {
            InvoiceStatus::Paid
        } else {
            InvoiceStatus::PartiallyPaid
        };

        Ok(inv.clone())
    }
}
