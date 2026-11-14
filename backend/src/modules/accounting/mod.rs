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
    tenant_context::TenantContext,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AccountType {
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub account_code: String,
    pub name: String,
    pub account_type: AccountType,
    pub normal_balance: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalLine {
    pub id: Uuid,
    pub account_code: String,
    pub account_name: String,
    pub account_type: AccountType,
    pub tenant_id: Option<Uuid>,
    pub lease_id: Option<Uuid>,
    pub debit_kes: Decimal,
    pub credit_kes: Decimal,
    pub memo: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalEntry {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Option<Uuid>,
    pub entry_number: String,
    pub entry_date: NaiveDate,
    pub source_event_type: String,
    pub source_entity_id: Uuid,
    pub description: String,
    pub status: String, // POSTED | REVERSED
    pub reversal_of_entry_id: Option<Uuid>,
    pub total_debit_kes: Decimal,
    pub total_credit_kes: Decimal,
    pub currency: String,
    pub lines: Vec<JournalLine>,
    pub posted_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PropertyExpense {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub unit_id: Option<Uuid>,
    pub expense_number: String,
    pub category: String,
    pub vendor_name: Option<String>,
    pub description: String,
    pub amount_kes: Decimal,
    pub expense_date: NaiveDate,
    pub status: String,
    pub journal_entry_id: Uuid,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RecordExpenseCommand {
    pub property_id: Uuid,
    pub unit_id: Option<Uuid>,
    pub category: String,
    pub vendor_name: Option<String>,
    pub description: String,
    pub amount_kes: Decimal,
    pub expense_date: NaiveDate,
}

/// Section 5.1 & Section 9.5: Double-Entry Accounting Repository
/// Enforces:
/// 1. Every journal entry has sum(debits) == sum(credits) > 0
/// 2. Posted financial entries are NEVER deleted; only reversed via a reversing entry
/// 3. Security deposits are posted to Liability (2100), NEVER Rental Revenue (4000)
pub trait AccountingRepository: Send + Sync {
    fn ensure_chart_of_accounts(&self, organization_id: Uuid) -> Vec<Account>;
    fn post_journal_entry(
        &self,
        organization_id: Uuid,
        property_id: Option<Uuid>,
        source_event_type: &str,
        source_entity_id: Uuid,
        description: String,
        lines: Vec<JournalLine>,
    ) -> AppResult<JournalEntry>;
    fn reverse_journal_entry(
        &self,
        ctx: &TenantContext,
        entry_id: Uuid,
        reason: &str,
    ) -> AppResult<JournalEntry>;
    fn delete_journal_entry(&self, _ctx: &TenantContext, _entry_id: Uuid) -> AppResult<()>;
    fn list_journal_entries(&self, ctx: &TenantContext) -> AppResult<Vec<JournalEntry>>;
    fn record_expense(
        &self,
        ctx: &TenantContext,
        cmd: RecordExpenseCommand,
    ) -> AppResult<PropertyExpense>;
    fn list_expenses(&self, ctx: &TenantContext) -> AppResult<Vec<PropertyExpense>>;
}

#[derive(Default)]
pub struct InMemoryAccountingRepository {
    accounts: Arc<RwLock<HashMap<Uuid, Vec<Account>>>>,
    journals: Arc<RwLock<Vec<JournalEntry>>>,
    expenses: Arc<RwLock<Vec<PropertyExpense>>>,
}

impl InMemoryAccountingRepository {
    pub fn new() -> Self {
        Self::default()
    }
}

impl AccountingRepository for InMemoryAccountingRepository {
    fn ensure_chart_of_accounts(&self, organization_id: Uuid) -> Vec<Account> {
        let mut guard = self.accounts.write().unwrap_or_else(|e| e.into_inner());
        guard
            .entry(organization_id)
            .or_insert_with(|| {
                vec![
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "1010".to_string(),
                        name: "M-Pesa & Bank Clearing Account".to_string(),
                        account_type: AccountType::Asset,
                        normal_balance: "DEBIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "1100".to_string(),
                        name: "Accounts Receivable - Tenants".to_string(),
                        account_type: AccountType::Asset,
                        normal_balance: "DEBIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "2100".to_string(),
                        name: "Tenant Security Deposits Held (Liability)".to_string(),
                        account_type: AccountType::Liability,
                        normal_balance: "CREDIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "2200".to_string(),
                        name: "Tenant Advance Prepayments (Liability)".to_string(),
                        account_type: AccountType::Liability,
                        normal_balance: "CREDIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "4000".to_string(),
                        name: "Residential Rental Revenue".to_string(),
                        account_type: AccountType::Revenue,
                        normal_balance: "CREDIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "4100".to_string(),
                        name: "Utility & Service Charge Recovery".to_string(),
                        account_type: AccountType::Revenue,
                        normal_balance: "CREDIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "4200".to_string(),
                        name: "Late Payment Penalty Revenue".to_string(),
                        account_type: AccountType::Revenue,
                        normal_balance: "CREDIT".to_string(),
                    },
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "5000".to_string(),
                        name: "Property Maintenance & Repairs Expense".to_string(),
                        account_type: AccountType::Expense,
                        normal_balance: "DEBIT".to_string(),
                    },
                ]
            })
            .clone()
    }

    fn post_journal_entry(
        &self,
        organization_id: Uuid,
        property_id: Option<Uuid>,
        source_event_type: &str,
        source_entity_id: Uuid,
        description: String,
        lines: Vec<JournalLine>,
    ) -> AppResult<JournalEntry> {
        let _ = self.ensure_chart_of_accounts(organization_id);
        if lines.len() < 2 {
            return Err(AppError::FinancialIntegrity(
                "A double-entry journal must contain at least two lines".to_string(),
            ));
        }

        let mut total_debit = Decimal::ZERO;
        let mut total_credit = Decimal::ZERO;

        for line in &lines {
            if line.debit_kes < Decimal::ZERO || line.credit_kes < Decimal::ZERO {
                return Err(AppError::FinancialIntegrity(
                    "Journal line debit and credit amounts cannot be negative".to_string(),
                ));
            }
            if (line.debit_kes > Decimal::ZERO && line.credit_kes > Decimal::ZERO)
                || (line.debit_kes == Decimal::ZERO && line.credit_kes == Decimal::ZERO)
            {
                return Err(AppError::FinancialIntegrity(
                    "Each journal line must have either a positive debit OR a positive credit"
                        .to_string(),
                ));
            }
            total_debit += line.debit_kes;
            total_credit += line.credit_kes;
        }

        if total_debit != total_credit || total_debit <= Decimal::ZERO {
            return Err(AppError::FinancialIntegrity(format!(
                "Unbalanced journal entry rejected: total_debit ({total_debit}) != total_credit ({total_credit})"
            )));
        }

        let mut guard = self.journals.write().unwrap_or_else(|e| e.into_inner());
        let seq = guard
            .iter()
            .filter(|j| j.organization_id == organization_id)
            .count()
            + 1;

        let entry = JournalEntry {
            id: Uuid::new_v4(),
            organization_id,
            property_id,
            entry_number: format!("JRN-{seq:05}"),
            entry_date: Utc::now().date_naive(),
            source_event_type: source_event_type.to_string(),
            source_entity_id,
            description,
            status: "POSTED".to_string(),
            reversal_of_entry_id: None,
            total_debit_kes: total_debit,
            total_credit_kes: total_credit,
            currency: "KES".to_string(),
            lines,
            posted_at: Utc::now(),
        };

        guard.push(entry.clone());
        Ok(entry)
    }

    fn reverse_journal_entry(
        &self,
        ctx: &TenantContext,
        entry_id: Uuid,
        reason: &str,
    ) -> AppResult<JournalEntry> {
        ctx.require_permission("payments.reconcile")?;
        let mut guard = self.journals.write().unwrap_or_else(|e| e.into_inner());
        let original = guard
            .iter()
            .find(|j| j.id == entry_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Journal entry not found".to_string()))?;
        ctx.assert_owns_record(original.organization_id)?;

        if original.status == "REVERSED" {
            return Err(AppError::BusinessRule(
                "Journal entry has already been reversed".to_string(),
            ));
        }

        let reversed_lines: Vec<JournalLine> = original
            .lines
            .iter()
            .map(|l| JournalLine {
                id: Uuid::new_v4(),
                account_code: l.account_code.clone(),
                account_name: l.account_name.clone(),
                account_type: l.account_type,
                tenant_id: l.tenant_id,
                lease_id: l.lease_id,
                debit_kes: l.credit_kes,
                credit_kes: l.debit_kes,
                memo: format!("Reversal of {}: {}", original.entry_number, reason),
            })
            .collect();

        if let Some(orig_mut) = guard.iter_mut().find(|j| j.id == entry_id) {
            orig_mut.status = "REVERSED".to_string();
        }

        let seq = guard
            .iter()
            .filter(|j| j.organization_id == ctx.organization_id)
            .count()
            + 1;

        let reversal_entry = JournalEntry {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: original.property_id,
            entry_number: format!("JRN-{seq:05}"),
            entry_date: Utc::now().date_naive(),
            source_event_type: "REVERSAL".to_string(),
            source_entity_id: original.id,
            description: format!("Reversal of {}: {}", original.entry_number, reason),
            status: "POSTED".to_string(),
            reversal_of_entry_id: Some(original.id),
            total_debit_kes: original.total_debit_kes,
            total_credit_kes: original.total_credit_kes,
            currency: "KES".to_string(),
            lines: reversed_lines,
            posted_at: Utc::now(),
        };

        guard.push(reversal_entry.clone());
        Ok(reversal_entry)
    }

    fn delete_journal_entry(&self, _ctx: &TenantContext, _entry_id: Uuid) -> AppResult<()> {
        Err(AppError::FinancialIntegrity(
            "Posted financial records are immutable and cannot be deleted. Use reverse_journal_entry instead."
                .to_string(),
        ))
    }

    fn list_journal_entries(&self, ctx: &TenantContext) -> AppResult<Vec<JournalEntry>> {
        ctx.require_permission("payments.view")?;
        Ok(self
            .journals
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|j| j.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn record_expense(
        &self,
        ctx: &TenantContext,
        cmd: RecordExpenseCommand,
    ) -> AppResult<PropertyExpense> {
        ctx.require_permission("expenses.approve")?;
        if cmd.amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Expense amount must be greater than KES 0".to_string(),
            ));
        }

        let expense_id = Uuid::new_v4();
        let journal = self.post_journal_entry(
            ctx.organization_id,
            Some(cmd.property_id),
            "EXPENSE_APPROVED",
            expense_id,
            format!("Expense ({}): {}", cmd.category, cmd.description),
            vec![
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "5000".to_string(),
                    account_name: "Property Maintenance & Repairs Expense".to_string(),
                    account_type: AccountType::Expense,
                    tenant_id: None,
                    lease_id: None,
                    debit_kes: cmd.amount_kes,
                    credit_kes: Decimal::ZERO,
                    memo: cmd.description.clone(),
                },
                JournalLine {
                    id: Uuid::new_v4(),
                    account_code: "1010".to_string(),
                    account_name: "M-Pesa & Bank Clearing Account".to_string(),
                    account_type: AccountType::Asset,
                    tenant_id: None,
                    lease_id: None,
                    debit_kes: Decimal::ZERO,
                    credit_kes: cmd.amount_kes,
                    memo: format!("Disbursement for {}", cmd.description),
                },
            ],
        )?;

        let mut guard = self.expenses.write().unwrap_or_else(|e| e.into_inner());
        let seq = guard
            .iter()
            .filter(|e| e.organization_id == ctx.organization_id)
            .count()
            + 1;

        let expense = PropertyExpense {
            id: expense_id,
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            unit_id: cmd.unit_id,
            expense_number: format!("EXP-{seq:04}"),
            category: cmd.category,
            vendor_name: cmd.vendor_name,
            description: cmd.description,
            amount_kes: cmd.amount_kes,
            expense_date: cmd.expense_date,
            status: "PAID".to_string(),
            journal_entry_id: journal.id,
            created_at: Utc::now(),
        };
        guard.push(expense.clone());
        Ok(expense)
    }

    fn list_expenses(&self, ctx: &TenantContext) -> AppResult<Vec<PropertyExpense>> {
        ctx.require_permission("payments.view")?;
        Ok(self
            .expenses
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|e| e.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
