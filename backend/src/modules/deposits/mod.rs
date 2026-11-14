use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        tenant_context::TenantContext,
    },
    modules::{
        accounting::{AccountType, AccountingRepository, JournalLine},
        leases::LeaseRepository,
    },
};

/// Section 5.6: Strategy Pattern - DepositCalculationStrategy
pub trait DepositCalculationStrategy: Send + Sync {
    fn calculate_required_deposit(&self, monthly_rent_kes: Decimal) -> Decimal;
}

pub struct MonthsMultiplierDepositStrategy {
    pub months: Decimal,
}

impl DepositCalculationStrategy for MonthsMultiplierDepositStrategy {
    fn calculate_required_deposit(&self, monthly_rent_kes: Decimal) -> Decimal {
        (monthly_rent_kes * self.months).round_dp(2)
    }
}

pub struct FixedDepositStrategy {
    pub fixed_amount_kes: Decimal,
}

impl DepositCalculationStrategy for FixedDepositStrategy {
    fn calculate_required_deposit(&self, _monthly_rent_kes: Decimal) -> Decimal {
        self.fixed_amount_kes.round_dp(2)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityDepositLedger {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub lease_id: Uuid,
    pub tenant_id: Uuid,
    pub unit_id: Uuid,
    pub required_amount_kes: Decimal,
    pub received_amount_kes: Decimal,
    pub deducted_amount_kes: Decimal,
    pub refunded_amount_kes: Decimal,
    pub current_liability_balance_kes: Decimal,
    pub currency: String,
    pub status: String,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ReceiveDepositCommand {
    pub lease_id: Uuid,
    pub amount_kes: Decimal,
    pub payment_reference: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct DeductOrRefundDepositCommand {
    pub lease_id: Uuid,
    pub amount_kes: Decimal,
    pub reason: String,
}

/// Section 9.4: Security Deposits Repository
/// Treats deposits strictly as Tenant Liabilities (Account 2100) and NEVER as Rental Revenue (Account 4000).
pub trait DepositRepository: Send + Sync {
    fn receive_deposit(
        &self,
        ctx: &TenantContext,
        cmd: ReceiveDepositCommand,
    ) -> AppResult<SecurityDepositLedger>;
    fn deduct_from_deposit(
        &self,
        ctx: &TenantContext,
        cmd: DeductOrRefundDepositCommand,
    ) -> AppResult<SecurityDepositLedger>;
    fn refund_deposit(
        &self,
        ctx: &TenantContext,
        cmd: DeductOrRefundDepositCommand,
    ) -> AppResult<SecurityDepositLedger>;
    fn list_deposits(&self, ctx: &TenantContext) -> AppResult<Vec<SecurityDepositLedger>>;
}

pub struct InMemoryDepositRepository {
    deposits: Arc<RwLock<HashMap<Uuid, SecurityDepositLedger>>>,
    lease_repo: Arc<dyn LeaseRepository>,
    accounting_repo: Arc<dyn AccountingRepository>,
}

impl InMemoryDepositRepository {
    pub fn new(
        lease_repo: Arc<dyn LeaseRepository>,
        accounting_repo: Arc<dyn AccountingRepository>,
    ) -> Self {
        Self {
            deposits: Arc::new(RwLock::new(HashMap::new())),
            lease_repo,
            accounting_repo,
        }
    }
}

impl DepositRepository for InMemoryDepositRepository {
    fn receive_deposit(
        &self,
        ctx: &TenantContext,
        cmd: ReceiveDepositCommand,
    ) -> AppResult<SecurityDepositLedger> {
        ctx.require_permission("payments.reconcile")?;
        if cmd.amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Security deposit amount must be greater than KES 0".to_string(),
            ));
        }
        let lease = self.lease_repo.get_lease(ctx, cmd.lease_id)?;

        let mut guard = self.deposits.write().unwrap_or_else(|e| e.into_inner());
        let ledger = guard
            .entry(lease.id)
            .or_insert_with(|| SecurityDepositLedger {
                id: Uuid::new_v4(),
                organization_id: ctx.organization_id,
                lease_id: lease.id,
                tenant_id: lease.primary_tenant_id,
                unit_id: lease.unit_id,
                required_amount_kes: lease.security_deposit_kes,
                received_amount_kes: Decimal::ZERO,
                deducted_amount_kes: Decimal::ZERO,
                refunded_amount_kes: Decimal::ZERO,
                current_liability_balance_kes: Decimal::ZERO,
                currency: "KES".to_string(),
                status: "PENDING".to_string(),
                updated_at: Utc::now(),
            });

        ledger.received_amount_kes += cmd.amount_kes;
        ledger.current_liability_balance_kes =
            ledger.received_amount_kes - ledger.deducted_amount_kes - ledger.refunded_amount_kes;
        ledger.status = "HELD".to_string();
        ledger.updated_at = Utc::now();
        let snapshot = ledger.clone();
        drop(guard);

        // Post Double-Entry Journal: DR Cash (1010) / CR Tenant Security Deposits Held Liability (2100)
        // NEVER credits Rental Revenue (4000)!
        self.accounting_repo.post_journal_entry(
            ctx.organization_id,
            Some(lease.property_id),
            "DEPOSIT_RECEIVED",
            snapshot.id,
            format!(
                "Security deposit received for lease {} ({})",
                lease.lease_number, cmd.payment_reference
            ),
            vec![
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "1010".to_string(),
                    account_name: "M-Pesa & Bank Clearing Account".to_string(),
                    account_type: AccountType::Asset,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: cmd.amount_kes,
                    credit_kes: Decimal::ZERO,
                    memo: format!("Security deposit receipt {}", cmd.payment_reference),
                },
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "2100".to_string(),
                    account_name: "Tenant Security Deposits Held (Liability)".to_string(),
                    account_type: AccountType::Liability,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: Decimal::ZERO,
                    credit_kes: cmd.amount_kes,
                    memo: "Liability held on behalf of tenant".to_string(),
                },
            ],
        )?;

        Ok(snapshot)
    }

    fn deduct_from_deposit(
        &self,
        ctx: &TenantContext,
        cmd: DeductOrRefundDepositCommand,
    ) -> AppResult<SecurityDepositLedger> {
        ctx.require_permission("payments.reconcile")?;
        let lease = self.lease_repo.get_lease(ctx, cmd.lease_id)?;
        let mut guard = self.deposits.write().unwrap_or_else(|e| e.into_inner());
        let ledger = guard.get_mut(&cmd.lease_id).ok_or_else(|| {
            AppError::NotFound("Security deposit ledger not found for lease".to_string())
        })?;
        ctx.assert_owns_record(ledger.organization_id)?;

        if cmd.amount_kes <= Decimal::ZERO || cmd.amount_kes > ledger.current_liability_balance_kes
        {
            return Err(AppError::BusinessRule(
                "Deduction amount cannot exceed the current held deposit balance".to_string(),
            ));
        }

        ledger.deducted_amount_kes += cmd.amount_kes;
        ledger.current_liability_balance_kes =
            ledger.received_amount_kes - ledger.deducted_amount_kes - ledger.refunded_amount_kes;
        ledger.status = "PARTIALLY_DEDUCTED".to_string();
        ledger.updated_at = Utc::now();
        let snapshot = ledger.clone();
        drop(guard);

        // Post Double-Entry: DR Tenant Deposit Liability (2100) / CR Maintenance Recovery (4100)
        self.accounting_repo.post_journal_entry(
            ctx.organization_id,
            Some(lease.property_id),
            "DEPOSIT_DEDUCTION",
            snapshot.id,
            format!("Deposit deduction for {}: {}", lease.lease_number, cmd.reason),
            vec![
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "2100".to_string(),
                    account_name: "Tenant Security Deposits Held (Liability)".to_string(),
                    account_type: AccountType::Liability,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: cmd.amount_kes,
                    credit_kes: Decimal::ZERO,
                    memo: cmd.reason.clone(),
                },
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "4100".to_string(),
                    account_name: "Utility & Service Charge Recovery".to_string(),
                    account_type: AccountType::Revenue,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: Decimal::ZERO,
                    credit_kes: cmd.amount_kes,
                    memo: format!("Damage/repair offset: {}", cmd.reason),
                },
            ],
        )?;

        Ok(snapshot)
    }

    fn refund_deposit(
        &self,
        ctx: &TenantContext,
        cmd: DeductOrRefundDepositCommand,
    ) -> AppResult<SecurityDepositLedger> {
        ctx.require_permission("payments.reconcile")?;
        let lease = self.lease_repo.get_lease(ctx, cmd.lease_id)?;
        let mut guard = self.deposits.write().unwrap_or_else(|e| e.into_inner());
        let ledger = guard.get_mut(&cmd.lease_id).ok_or_else(|| {
            AppError::NotFound("Security deposit ledger not found for lease".to_string())
        })?;
        ctx.assert_owns_record(ledger.organization_id)?;

        if cmd.amount_kes <= Decimal::ZERO || cmd.amount_kes > ledger.current_liability_balance_kes
        {
            return Err(AppError::BusinessRule(
                "Refund amount cannot exceed the current held deposit liability balance".to_string(),
            ));
        }

        ledger.refunded_amount_kes += cmd.amount_kes;
        ledger.current_liability_balance_kes =
            ledger.received_amount_kes - ledger.deducted_amount_kes - ledger.refunded_amount_kes;
        ledger.status = if ledger.current_liability_balance_kes == Decimal::ZERO {
            "REFUNDED".to_string()
        } else {
            "HELD".to_string()
        };
        ledger.updated_at = Utc::now();
        let snapshot = ledger.clone();
        drop(guard);

        // Post Double-Entry: DR Tenant Security Deposit Liability (2100) / CR Cash (1010)
        self.accounting_repo.post_journal_entry(
            ctx.organization_id,
            Some(lease.property_id),
            "DEPOSIT_REFUNDED",
            snapshot.id,
            format!("Deposit refund for {}: {}", lease.lease_number, cmd.reason),
            vec![
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "2100".to_string(),
                    account_name: "Tenant Security Deposits Held (Liability)".to_string(),
                    account_type: AccountType::Liability,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: cmd.amount_kes,
                    credit_kes: Decimal::ZERO,
                    memo: cmd.reason.clone(),
                },
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "1010".to_string(),
                    account_name: "M-Pesa & Bank Clearing Account".to_string(),
                    account_type: AccountType::Asset,
                    tenant_id: Some(lease.primary_tenant_id),
                    lease_id: Some(lease.id),
                    debit_kes: Decimal::ZERO,
                    credit_kes: cmd.amount_kes,
                    memo: "Deposit refund disbursement".to_string(),
                },
            ],
        )?;

        Ok(snapshot)
    }

    fn list_deposits(&self, ctx: &TenantContext) -> AppResult<Vec<SecurityDepositLedger>> {
        ctx.require_permission("payments.view")?;
        Ok(self
            .deposits
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|d| d.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
