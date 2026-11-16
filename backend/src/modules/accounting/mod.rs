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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrialBalanceRow {
    pub account_code: String,
    pub account_name: String,
    pub account_type: AccountType,
    pub debit_kes: Decimal,
    pub credit_kes: Decimal,
    pub net_balance_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrialBalanceReport {
    pub as_of_date: NaiveDate,
    pub accounts: Vec<TrialBalanceRow>,
    pub total_debits_kes: Decimal,
    pub total_credits_kes: Decimal,
    pub is_balanced: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountLineSummary {
    pub account_code: String,
    pub account_name: String,
    pub amount_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProfitAndLossReport {
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub operating_revenue: Vec<AccountLineSummary>,
    pub total_revenue_kes: Decimal,
    pub operating_expenses: Vec<AccountLineSummary>,
    pub total_expenses_kes: Decimal,
    pub net_operating_income_kes: Decimal,
    pub net_profit_loss_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BalanceSheetReport {
    pub as_of_date: NaiveDate,
    pub current_assets: Vec<AccountLineSummary>,
    pub total_assets_kes: Decimal,
    pub liabilities: Vec<AccountLineSummary>,
    pub total_liabilities_kes: Decimal,
    pub equity: Vec<AccountLineSummary>,
    pub total_equity_kes: Decimal,
    pub total_liabilities_and_equity_kes: Decimal,
    pub is_balanced: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CashFlowStatement {
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub operating_inflows_kes: Decimal,
    pub operating_outflows_kes: Decimal,
    pub net_operating_cash_kes: Decimal,
    pub financing_cash_flow_kes: Decimal,
    pub opening_cash_balance_kes: Decimal,
    pub closing_cash_balance_kes: Decimal,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReconciliationBatch {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub statement_source: String, // MPESA_STATEMENT | BANK_STATEMENT
    pub file_name: String,
    pub total_records: usize,
    pub matched_records: usize,
    pub exception_records: usize,
    pub imported_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReconciliationExternalTx {
    pub id: Uuid,
    pub batch_id: Uuid,
    pub transaction_ref: String,
    pub trans_time: DateTime<Utc>,
    pub amount_kes: Decimal,
    pub narrative: String,
    pub sender_name: Option<String>,
    pub sender_phone: Option<String>,
    pub match_status: String, // UNMATCHED | MATCHED | EXCEPTION
    pub matched_entity_id: Option<Uuid>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReconciliationException {
    pub id: Uuid,
    pub batch_id: Uuid,
    pub external_transaction_id: Uuid,
    pub exception_type: String, // AMOUNT_MISMATCH | UNKNOWN_TENANT | DUPLICATE_ENTRY | MISSING_SYSTEM_RECORD
    pub details: String,
    pub status: String, // OPEN | RESOLVED | DISPUTED
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FinancialAuditEvent {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub actor_id: Option<Uuid>,
    pub actor_role: String,
    pub event_type: String,
    pub source_entity_type: String,
    pub source_entity_id: Uuid,
    pub description: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FinancialReportRun {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub report_type: String,
    pub title: String,
    pub period_start: NaiveDate,
    pub period_end: NaiveDate,
    pub property_id: Option<Uuid>,
    pub currency: String,
    pub parameters: serde_json::Value,
    pub summary_data: serde_json::Value,
    pub generated_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

/// Double-Entry Accounting Repository
/// Enforces:
/// 1. Every journal entry has sum(debits) == sum(credits) > 0
/// 2. Posted financial entries are NEVER deleted; only reversed via a reversing entry
/// 3. Security deposits are posted to Liability (2100), NEVER Rental Revenue (4000)
pub trait AccountingRepository: Send + Sync {
    fn ensure_chart_of_accounts(&self, organization_id: Uuid) -> Vec<Account>;
    fn list_accounts(&self, ctx: &TenantContext) -> AppResult<Vec<Account>>;
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
    fn delete_journal_entry(&self, ctx: &TenantContext, entry_id: Uuid) -> AppResult<()>;
    fn list_journal_entries(&self, ctx: &TenantContext) -> AppResult<Vec<JournalEntry>>;
    fn record_expense(
        &self,
        ctx: &TenantContext,
        cmd: RecordExpenseCommand,
    ) -> AppResult<PropertyExpense>;
    fn list_expenses(&self, ctx: &TenantContext) -> AppResult<Vec<PropertyExpense>>;
    fn get_trial_balance(
        &self,
        ctx: &TenantContext,
        as_of: Option<NaiveDate>,
    ) -> AppResult<TrialBalanceReport>;
    fn get_profit_and_loss(
        &self,
        ctx: &TenantContext,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> AppResult<ProfitAndLossReport>;
    fn get_balance_sheet(
        &self,
        ctx: &TenantContext,
        as_of: NaiveDate,
    ) -> AppResult<BalanceSheetReport>;
    fn get_cash_flow(
        &self,
        ctx: &TenantContext,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> AppResult<CashFlowStatement>;
    fn record_audit_event(
        &self,
        ctx: &TenantContext,
        event_type: &str,
        source_entity_type: &str,
        source_entity_id: Uuid,
        description: String,
    ) -> AppResult<FinancialAuditEvent>;
    fn list_audit_events(
        &self,
        ctx: &TenantContext,
        limit: usize,
    ) -> AppResult<Vec<FinancialAuditEvent>>;
    fn list_reconciliation_batches(
        &self,
        ctx: &TenantContext,
    ) -> AppResult<Vec<ReconciliationBatch>>;
    fn list_reconciliation_exceptions(
        &self,
        ctx: &TenantContext,
    ) -> AppResult<Vec<ReconciliationException>>;
    fn create_reconciliation_batch(
        &self,
        ctx: &TenantContext,
        source: &str,
        file_name: &str,
        transactions: Vec<ReconciliationExternalTx>,
    ) -> AppResult<ReconciliationBatch>;
    fn match_reconciliation_transaction(
        &self,
        ctx: &TenantContext,
        tx_id: Uuid,
        matched_id: Uuid,
    ) -> AppResult<()>;
    fn resolve_reconciliation_exception(
        &self,
        ctx: &TenantContext,
        exception_id: Uuid,
        action: &str,
    ) -> AppResult<()>;
    fn list_report_runs(&self, ctx: &TenantContext) -> AppResult<Vec<FinancialReportRun>>;
    fn save_report_run(
        &self,
        ctx: &TenantContext,
        report_type: &str,
        title: &str,
        period_start: NaiveDate,
        period_end: NaiveDate,
        property_id: Option<Uuid>,
        summary_data: serde_json::Value,
    ) -> AppResult<FinancialReportRun>;
}

#[derive(Default)]
pub struct InMemoryAccountingRepository {
    accounts: Arc<RwLock<HashMap<Uuid, Vec<Account>>>>,
    journals: Arc<RwLock<Vec<JournalEntry>>>,
    expenses: Arc<RwLock<Vec<PropertyExpense>>>,
    audit_events: Arc<RwLock<Vec<FinancialAuditEvent>>>,
    reconciliation_batches: Arc<RwLock<Vec<ReconciliationBatch>>>,
    reconciliation_transactions: Arc<RwLock<Vec<ReconciliationExternalTx>>>,
    reconciliation_exceptions: Arc<RwLock<Vec<ReconciliationException>>>,
    report_runs: Arc<RwLock<Vec<FinancialReportRun>>>,
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
                        account_code: "3000".to_string(),
                        name: "Owner's Equity & Retained Earnings".to_string(),
                        account_type: AccountType::Equity,
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
                    Account {
                        id: Uuid::new_v4(),
                        organization_id,
                        account_code: "5100".to_string(),
                        name: "Property Utilities & Operating Expense".to_string(),
                        account_type: AccountType::Expense,
                        normal_balance: "DEBIT".to_string(),
                    },
                ]
            })
            .clone()
    }

    fn list_accounts(&self, ctx: &TenantContext) -> AppResult<Vec<Account>> {
        ctx.require_permission("payments.view")?;
        Ok(self.ensure_chart_of_accounts(ctx.organization_id))
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

        // Also record audit event
        let _ = self.record_audit_event(
            ctx,
            "JOURNAL_REVERSED",
            "JOURNAL_ENTRY",
            original.id,
            format!("Reversed journal entry {} due to: {}", original.entry_number, reason),
        );

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
            category: cmd.category.clone(),
            vendor_name: cmd.vendor_name,
            description: cmd.description.clone(),
            amount_kes: cmd.amount_kes,
            expense_date: cmd.expense_date,
            status: "PAID".to_string(),
            journal_entry_id: journal.id,
            created_at: Utc::now(),
        };
        guard.push(expense.clone());

        let _ = self.record_audit_event(
            ctx,
            "EXPENSE_APPROVED",
            "PROPERTY_EXPENSE",
            expense_id,
            format!("Recorded expense {} ({}) of KES {}", expense.expense_number, cmd.category, cmd.amount_kes),
        );

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

    fn get_trial_balance(
        &self,
        ctx: &TenantContext,
        as_of: Option<NaiveDate>,
    ) -> AppResult<TrialBalanceReport> {
        ctx.require_permission("payments.view")?;
        let accounts = self.ensure_chart_of_accounts(ctx.organization_id);
        let journals = self.journals.read().unwrap_or_else(|e| e.into_inner());

        let effective_date = as_of.unwrap_or_else(|| Utc::now().date_naive());

        let mut debit_totals: HashMap<String, Decimal> = HashMap::new();
        let mut credit_totals: HashMap<String, Decimal> = HashMap::new();

        for j in journals.iter().filter(|j| {
            j.organization_id == ctx.organization_id
                && j.status == "POSTED"
                && j.entry_date <= effective_date
        }) {
            for line in &j.lines {
                *debit_totals.entry(line.account_code.clone()).or_insert(Decimal::ZERO) += line.debit_kes;
                *credit_totals.entry(line.account_code.clone()).or_insert(Decimal::ZERO) += line.credit_kes;
            }
        }

        let mut rows = Vec::new();
        let mut total_debits = Decimal::ZERO;
        let mut total_credits = Decimal::ZERO;

        for acc in accounts {
            let dr = debit_totals.get(&acc.account_code).copied().unwrap_or(Decimal::ZERO);
            let cr = credit_totals.get(&acc.account_code).copied().unwrap_or(Decimal::ZERO);

            let net_balance = match acc.normal_balance.as_str() {
                "DEBIT" => dr - cr,
                _ => cr - dr,
            };

            total_debits += dr;
            total_credits += cr;

            rows.push(TrialBalanceRow {
                account_code: acc.account_code,
                account_name: acc.name,
                account_type: acc.account_type,
                debit_kes: dr,
                credit_kes: cr,
                net_balance_kes: net_balance,
            });
        }

        Ok(TrialBalanceReport {
            as_of_date: effective_date,
            is_balanced: total_debits == total_credits,
            total_debits_kes: total_debits,
            total_credits_kes: total_credits,
            accounts: rows,
        })
    }

    fn get_profit_and_loss(
        &self,
        ctx: &TenantContext,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> AppResult<ProfitAndLossReport> {
        ctx.require_permission("payments.view")?;
        let accounts = self.ensure_chart_of_accounts(ctx.organization_id);
        let journals = self.journals.read().unwrap_or_else(|e| e.into_inner());

        let relevant_journals: Vec<&JournalEntry> = journals
            .iter()
            .filter(|j| {
                j.organization_id == ctx.organization_id
                    && j.status == "POSTED"
                    && j.entry_date >= start_date
                    && j.entry_date <= end_date
            })
            .collect();

        let mut rev_map: HashMap<String, (String, Decimal)> = HashMap::new();
        let mut exp_map: HashMap<String, (String, Decimal)> = HashMap::new();

        for acc in &accounts {
            if acc.account_type == AccountType::Revenue {
                rev_map.insert(acc.account_code.clone(), (acc.name.clone(), Decimal::ZERO));
            } else if acc.account_type == AccountType::Expense {
                exp_map.insert(acc.account_code.clone(), (acc.name.clone(), Decimal::ZERO));
            }
        }

        for j in relevant_journals {
            for line in &j.lines {
                if let Some(entry) = rev_map.get_mut(&line.account_code) {
                    entry.1 += line.credit_kes - line.debit_kes;
                }
                if let Some(entry) = exp_map.get_mut(&line.account_code) {
                    entry.1 += line.debit_kes - line.credit_kes;
                }
            }
        }

        let mut operating_revenue: Vec<AccountLineSummary> = rev_map
            .into_iter()
            .map(|(code, (name, amt))| AccountLineSummary {
                account_code: code,
                account_name: name,
                amount_kes: amt,
            })
            .collect();
        operating_revenue.sort_by(|a, b| a.account_code.cmp(&b.account_code));

        let mut operating_expenses: Vec<AccountLineSummary> = exp_map
            .into_iter()
            .map(|(code, (name, amt))| AccountLineSummary {
                account_code: code,
                account_name: name,
                amount_kes: amt,
            })
            .collect();
        operating_expenses.sort_by(|a, b| a.account_code.cmp(&b.account_code));

        let total_revenue: Decimal = operating_revenue.iter().map(|r| r.amount_kes).sum();
        let total_expenses: Decimal = operating_expenses.iter().map(|e| e.amount_kes).sum();
        let noi = total_revenue - total_expenses;

        Ok(ProfitAndLossReport {
            period_start: start_date,
            period_end: end_date,
            operating_revenue,
            total_revenue_kes: total_revenue,
            operating_expenses,
            total_expenses_kes: total_expenses,
            net_operating_income_kes: noi,
            net_profit_loss_kes: noi,
        })
    }

    fn get_balance_sheet(
        &self,
        ctx: &TenantContext,
        as_of: NaiveDate,
    ) -> AppResult<BalanceSheetReport> {
        ctx.require_permission("payments.view")?;
        let accounts = self.ensure_chart_of_accounts(ctx.organization_id);
        let journals = self.journals.read().unwrap_or_else(|e| e.into_inner());

        let relevant_journals: Vec<&JournalEntry> = journals
            .iter()
            .filter(|j| {
                j.organization_id == ctx.organization_id
                    && j.status == "POSTED"
                    && j.entry_date <= as_of
            })
            .collect();

        let mut asset_map: HashMap<String, (String, Decimal)> = HashMap::new();
        let mut liab_map: HashMap<String, (String, Decimal)> = HashMap::new();
        let mut eq_map: HashMap<String, (String, Decimal)> = HashMap::new();

        let mut cum_rev = Decimal::ZERO;
        let mut cum_exp = Decimal::ZERO;

        for acc in &accounts {
            match acc.account_type {
                AccountType::Asset => {
                    asset_map.insert(acc.account_code.clone(), (acc.name.clone(), Decimal::ZERO));
                }
                AccountType::Liability => {
                    liab_map.insert(acc.account_code.clone(), (acc.name.clone(), Decimal::ZERO));
                }
                AccountType::Equity => {
                    eq_map.insert(acc.account_code.clone(), (acc.name.clone(), Decimal::ZERO));
                }
                _ => {}
            }
        }

        for j in relevant_journals {
            for line in &j.lines {
                match line.account_type {
                    AccountType::Asset => {
                        if let Some(entry) = asset_map.get_mut(&line.account_code) {
                            entry.1 += line.debit_kes - line.credit_kes;
                        }
                    }
                    AccountType::Liability => {
                        if let Some(entry) = liab_map.get_mut(&line.account_code) {
                            entry.1 += line.credit_kes - line.debit_kes;
                        }
                    }
                    AccountType::Equity => {
                        if let Some(entry) = eq_map.get_mut(&line.account_code) {
                            entry.1 += line.credit_kes - line.debit_kes;
                        }
                    }
                    AccountType::Revenue => {
                        cum_rev += line.credit_kes - line.debit_kes;
                    }
                    AccountType::Expense => {
                        cum_exp += line.debit_kes - line.credit_kes;
                    }
                }
            }
        }

        // Net income rolls into Retained Earnings (Equity)
        let retained_net_income = cum_rev - cum_exp;
        let retained_entry = eq_map
            .entry("3000".to_string())
            .or_insert_with(|| ("Owner's Equity & Retained Earnings".to_string(), Decimal::ZERO));
        retained_entry.1 += retained_net_income;

        let mut current_assets: Vec<AccountLineSummary> = asset_map
            .into_iter()
            .map(|(code, (name, amt))| AccountLineSummary {
                account_code: code,
                account_name: name,
                amount_kes: amt,
            })
            .collect();
        current_assets.sort_by(|a, b| a.account_code.cmp(&b.account_code));

        let mut liabilities: Vec<AccountLineSummary> = liab_map
            .into_iter()
            .map(|(code, (name, amt))| AccountLineSummary {
                account_code: code,
                account_name: name,
                amount_kes: amt,
            })
            .collect();
        liabilities.sort_by(|a, b| a.account_code.cmp(&b.account_code));

        let mut equity: Vec<AccountLineSummary> = eq_map
            .into_iter()
            .map(|(code, (name, amt))| AccountLineSummary {
                account_code: code,
                account_name: name,
                amount_kes: amt,
            })
            .collect();
        equity.sort_by(|a, b| a.account_code.cmp(&b.account_code));

        let total_assets: Decimal = current_assets.iter().map(|a| a.amount_kes).sum();
        let total_liabilities: Decimal = liabilities.iter().map(|l| l.amount_kes).sum();
        let total_equity: Decimal = equity.iter().map(|e| e.amount_kes).sum();
        let total_liabilities_and_equity = total_liabilities + total_equity;

        Ok(BalanceSheetReport {
            as_of_date: as_of,
            current_assets,
            total_assets_kes: total_assets,
            liabilities,
            total_liabilities_kes: total_liabilities,
            equity,
            total_equity_kes: total_equity,
            total_liabilities_and_equity_kes: total_liabilities_and_equity,
            is_balanced: total_assets == total_liabilities_and_equity,
        })
    }

    fn get_cash_flow(
        &self,
        ctx: &TenantContext,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> AppResult<CashFlowStatement> {
        ctx.require_permission("payments.view")?;
        let journals = self.journals.read().unwrap_or_else(|e| e.into_inner());

        let mut opening_cash = Decimal::ZERO;
        let mut operating_inflows = Decimal::ZERO;
        let mut operating_outflows = Decimal::ZERO;
        let mut financing_cash = Decimal::ZERO;

        for j in journals.iter().filter(|j| j.organization_id == ctx.organization_id && j.status == "POSTED") {
            if j.entry_date < start_date {
                for line in &j.lines {
                    if line.account_code == "1010" {
                        opening_cash += line.debit_kes - line.credit_kes;
                    }
                }
            } else if j.entry_date <= end_date {
                for line in &j.lines {
                    if line.account_code == "1010" {
                        if line.debit_kes > Decimal::ZERO {
                            // Inflow into cash
                            if j.lines.iter().any(|l| l.account_code == "2100") {
                                financing_cash += line.debit_kes;
                            } else {
                                operating_inflows += line.debit_kes;
                            }
                        }
                        if line.credit_kes > Decimal::ZERO {
                            // Outflow from cash
                            if j.lines.iter().any(|l| l.account_code == "2100") {
                                financing_cash -= line.credit_kes;
                            } else {
                                operating_outflows += line.credit_kes;
                            }
                        }
                    }
                }
            }
        }

        let net_operating = operating_inflows - operating_outflows;
        let closing_cash = opening_cash + net_operating + financing_cash;

        Ok(CashFlowStatement {
            period_start: start_date,
            period_end: end_date,
            operating_inflows_kes: operating_inflows,
            operating_outflows_kes: operating_outflows,
            net_operating_cash_kes: net_operating,
            financing_cash_flow_kes: financing_cash,
            opening_cash_balance_kes: opening_cash,
            closing_cash_balance_kes: closing_cash,
        })
    }

    fn record_audit_event(
        &self,
        ctx: &TenantContext,
        event_type: &str,
        source_entity_type: &str,
        source_entity_id: Uuid,
        description: String,
    ) -> AppResult<FinancialAuditEvent> {
        let mut guard = self.audit_events.write().unwrap_or_else(|e| e.into_inner());
        let event = FinancialAuditEvent {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            actor_id: Some(ctx.user_id),
            actor_role: ctx.roles.first().cloned().unwrap_or_else(|| "ADMIN".to_string()),
            event_type: event_type.to_string(),
            source_entity_type: source_entity_type.to_string(),
            source_entity_id,
            description,
            created_at: Utc::now(),
        };
        guard.push(event.clone());
        Ok(event)
    }

    fn list_audit_events(
        &self,
        ctx: &TenantContext,
        limit: usize,
    ) -> AppResult<Vec<FinancialAuditEvent>> {
        ctx.require_permission("payments.view")?;
        let guard = self.audit_events.read().unwrap_or_else(|e| e.into_inner());
        let mut filtered: Vec<FinancialAuditEvent> = guard
            .iter()
            .filter(|e| e.organization_id == ctx.organization_id)
            .cloned()
            .collect();
        filtered.sort_by(|a, b| b.created_at.cmp(&a.created_at));
        if filtered.len() > limit {
            filtered.truncate(limit);
        }
        Ok(filtered)
    }

    fn list_reconciliation_batches(
        &self,
        ctx: &TenantContext,
    ) -> AppResult<Vec<ReconciliationBatch>> {
        ctx.require_permission("payments.reconcile")?;
        Ok(self
            .reconciliation_batches
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|b| b.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn list_reconciliation_exceptions(
        &self,
        ctx: &TenantContext,
    ) -> AppResult<Vec<ReconciliationException>> {
        ctx.require_permission("payments.reconcile")?;
        let batches = self.list_reconciliation_batches(ctx)?;
        let batch_ids: Vec<Uuid> = batches.iter().map(|b| b.id).collect();
        Ok(self
            .reconciliation_exceptions
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|exc| batch_ids.contains(&exc.batch_id))
            .cloned()
            .collect())
    }

    fn create_reconciliation_batch(
        &self,
        ctx: &TenantContext,
        source: &str,
        file_name: &str,
        transactions: Vec<ReconciliationExternalTx>,
    ) -> AppResult<ReconciliationBatch> {
        ctx.require_permission("payments.reconcile")?;
        let batch_id = Uuid::new_v4();
        let total = transactions.len();
        let matched = transactions
            .iter()
            .filter(|t| t.match_status == "MATCHED")
            .count();
        let exceptions = transactions
            .iter()
            .filter(|t| t.match_status == "EXCEPTION")
            .count();

        let batch = ReconciliationBatch {
            id: batch_id,
            organization_id: ctx.organization_id,
            statement_source: source.to_string(),
            file_name: file_name.to_string(),
            total_records: total,
            matched_records: matched,
            exception_records: exceptions,
            imported_at: Utc::now(),
        };

        {
            let mut b_guard = self
                .reconciliation_batches
                .write()
                .unwrap_or_else(|e| e.into_inner());
            b_guard.push(batch.clone());
        }

        {
            let mut tx_guard = self
                .reconciliation_transactions
                .write()
                .unwrap_or_else(|e| e.into_inner());
            for mut tx in transactions {
                tx.batch_id = batch_id;
                tx_guard.push(tx);
            }
        }

        let _ = self.record_audit_event(
            ctx,
            "RECONCILIATION_BATCH_CREATED",
            "RECONCILIATION_BATCH",
            batch_id,
            format!("Imported statement {} with {} records ({} matched, {} exceptions)", file_name, total, matched, exceptions),
        );

        Ok(batch)
    }

    fn match_reconciliation_transaction(
        &self,
        ctx: &TenantContext,
        tx_id: Uuid,
        matched_id: Uuid,
    ) -> AppResult<()> {
        ctx.require_permission("payments.reconcile")?;
        let mut tx_guard = self
            .reconciliation_transactions
            .write()
            .unwrap_or_else(|e| e.into_inner());
        if let Some(tx) = tx_guard.iter_mut().find(|t| t.id == tx_id) {
            tx.match_status = "MATCHED".to_string();
            tx.matched_entity_id = Some(matched_id);
            let _ = self.record_audit_event(
                ctx,
                "RECONCILIATION_MATCHED",
                "RECONCILIATION_TRANSACTION",
                tx_id,
                format!("Manually matched statement transaction {} to entity {}", tx.transaction_ref, matched_id),
            );
            Ok(())
        } else {
            Err(AppError::NotFound("Statement transaction not found".to_string()))
        }
    }

    fn resolve_reconciliation_exception(
        &self,
        ctx: &TenantContext,
        exception_id: Uuid,
        action: &str,
    ) -> AppResult<()> {
        ctx.require_permission("payments.reconcile")?;
        let mut exc_guard = self
            .reconciliation_exceptions
            .write()
            .unwrap_or_else(|e| e.into_inner());
        if let Some(exc) = exc_guard.iter_mut().find(|e| e.id == exception_id) {
            exc.status = "RESOLVED".to_string();
            let _ = self.record_audit_event(
                ctx,
                "RECONCILIATION_EXCEPTION_RESOLVED",
                "RECONCILIATION_EXCEPTION",
                exception_id,
                format!("Resolved reconciliation exception via action: {}", action),
            );
            Ok(())
        } else {
            Err(AppError::NotFound("Reconciliation exception not found".to_string()))
        }
    }

    fn list_report_runs(&self, ctx: &TenantContext) -> AppResult<Vec<FinancialReportRun>> {
        ctx.require_permission("reports.view")?;
        Ok(self
            .report_runs
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .iter()
            .filter(|r| r.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn save_report_run(
        &self,
        ctx: &TenantContext,
        report_type: &str,
        title: &str,
        period_start: NaiveDate,
        period_end: NaiveDate,
        property_id: Option<Uuid>,
        summary_data: serde_json::Value,
    ) -> AppResult<FinancialReportRun> {
        ctx.require_permission("reports.view")?;
        let mut guard = self.report_runs.write().unwrap_or_else(|e| e.into_inner());
        let run = FinancialReportRun {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            report_type: report_type.to_string(),
            title: title.to_string(),
            period_start,
            period_end,
            property_id,
            currency: "KES".to_string(),
            parameters: serde_json::json!({
                "property_id": property_id,
                "start": period_start,
                "end": period_end
            }),
            summary_data,
            generated_by: Some(ctx.user_id),
            created_at: Utc::now(),
        };
        guard.push(run.clone());

        let _ = self.record_audit_event(
            ctx,
            "REPORT_GENERATED",
            "FINANCIAL_REPORT_RUN",
            run.id,
            format!("Generated {} report: {}", report_type, title),
        );

        Ok(run)
    }
}
