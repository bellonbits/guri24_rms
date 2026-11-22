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
        events::{DomainEvent, EventBus},
        tenant_context::TenantContext,
    },
    integrations::mpesa::{C2bConfirmationRequest, MpesaAdapter, VerifiedMpesaCallback},
    modules::{
        accounting::{AccountType, AccountingRepository, JournalLine},
        billing::{Invoice, InvoiceRepository},
    },
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PaymentStatus {
    Pending,
    Completed,
    Failed,
    Reversed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentAllocation {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub payment_id: Uuid,
    pub invoice_id: Uuid,
    pub invoice_number: String,
    pub allocated_amount_kes: Decimal,
    pub remaining_invoice_balance_kes: Decimal,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Receipt {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub payment_id: Uuid,
    pub tenant_id: Uuid,
    pub receipt_number: String,
    pub amount_kes: Decimal,
    pub mpesa_receipt_number: Option<String>,
    pub currency: String,
    pub issued_at: DateTime<Utc>,
}

/// Section 5.9: Builder Pattern - ReceiptBuilder
pub struct ReceiptBuilder {
    organization_id: Option<Uuid>,
    payment_id: Option<Uuid>,
    tenant_id: Option<Uuid>,
    receipt_number: Option<String>,
    amount_kes: Option<Decimal>,
    mpesa_receipt_number: Option<String>,
}

impl Default for ReceiptBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl ReceiptBuilder {
    pub fn new() -> Self {
        Self {
            organization_id: None,
            payment_id: None,
            tenant_id: None,
            receipt_number: None,
            amount_kes: None,
            mpesa_receipt_number: None,
        }
    }

    pub fn organization_id(mut self, id: Uuid) -> Self {
        self.organization_id = Some(id);
        self
    }

    pub fn payment_id(mut self, id: Uuid) -> Self {
        self.payment_id = Some(id);
        self
    }

    pub fn tenant_id(mut self, id: Uuid) -> Self {
        self.tenant_id = Some(id);
        self
    }

    pub fn receipt_number(mut self, num: impl Into<String>) -> Self {
        self.receipt_number = Some(num.into());
        self
    }

    pub fn amount_kes(mut self, amount: Decimal) -> Self {
        self.amount_kes = Some(amount);
        self
    }

    pub fn mpesa_receipt(mut self, receipt: Option<String>) -> Self {
        self.mpesa_receipt_number = receipt;
        self
    }

    pub fn build(self) -> AppResult<Receipt> {
        let organization_id = self
            .organization_id
            .ok_or_else(|| AppError::Validation("organization_id is required".to_string()))?;
        let payment_id = self
            .payment_id
            .ok_or_else(|| AppError::Validation("payment_id is required".to_string()))?;
        let tenant_id = self
            .tenant_id
            .ok_or_else(|| AppError::Validation("tenant_id is required".to_string()))?;
        let amount_kes = self
            .amount_kes
            .ok_or_else(|| AppError::Validation("amount_kes is required".to_string()))?;
        if amount_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Receipt amount must be greater than KES 0".to_string(),
            ));
        }

        Ok(Receipt {
            id: Uuid::new_v4(),
            organization_id,
            payment_id,
            tenant_id,
            receipt_number: self
                .receipt_number
                .unwrap_or_else(|| format!("RCT-{}", &Uuid::new_v4().to_string()[..8].to_uppercase())),
            amount_kes,
            mpesa_receipt_number: self.mpesa_receipt_number,
            currency: "KES".to_string(),
            issued_at: Utc::now(),
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub tenant_id: Uuid,
    pub lease_id: Option<Uuid>,
    pub payment_reference: String,
    pub idempotency_key: String,
    pub checkout_request_id: Option<String>,
    pub merchant_request_id: Option<String>,
    pub provider_receipt_number: Option<String>,
    pub payment_method: String,
    pub payer_phone: String,
    pub amount_kes: Decimal,
    pub allocated_amount_kes: Decimal,
    pub unallocated_amount_kes: Decimal,
    pub currency: String,
    pub status: PaymentStatus,
    pub allocations: Vec<PaymentAllocation>,
    pub receipt: Option<Receipt>,
    pub created_at: DateTime<Utc>,
    pub paid_at: Option<DateTime<Utc>>,
}

/// Section 5.6: Strategy Pattern - PaymentAllocationStrategy
/// Determines how an incoming payment is distributed across one or more outstanding invoices.
pub trait PaymentAllocationStrategy: Send + Sync {
    fn plan_allocations(
        &self,
        available_amount_kes: Decimal,
        outstanding_invoices: &[Invoice],
    ) -> Vec<(Uuid, Decimal)>;
}

pub struct FifoOldestFirstAllocationStrategy;

impl PaymentAllocationStrategy for FifoOldestFirstAllocationStrategy {
    fn plan_allocations(
        &self,
        mut available_amount_kes: Decimal,
        outstanding_invoices: &[Invoice],
    ) -> Vec<(Uuid, Decimal)> {
        let mut plan = Vec::new();
        for inv in outstanding_invoices {
            if available_amount_kes <= Decimal::ZERO {
                break;
            }
            if inv.balance_kes <= Decimal::ZERO {
                continue;
            }
            let to_allocate = available_amount_kes.min(inv.balance_kes);
            if to_allocate > Decimal::ZERO {
                plan.push((inv.id, to_allocate));
                available_amount_kes -= to_allocate;
            }
        }
        plan
    }
}

fn deserialize_flexible_uuid<'de, D>(deserializer: D) -> Result<Uuid, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::de::Error;
    let s = String::deserialize(deserializer)?;
    let trimmed = s.trim();
    if trimmed.is_empty() {
        return Err(D::Error::custom("tenant_id cannot be empty"));
    }
    match Uuid::parse_str(trimmed) {
        Ok(u) => Ok(u),
        Err(_) => Ok(Uuid::new_v5(&Uuid::NAMESPACE_OID, trimmed.as_bytes())),
    }
}

fn deserialize_optional_flexible_uuid<'de, D>(deserializer: D) -> Result<Option<Uuid>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let opt = Option::<String>::deserialize(deserializer)?;
    match opt {
        None => Ok(None),
        Some(s) => {
            let trimmed = s.trim();
            if trimmed.is_empty() {
                Ok(None)
            } else {
                match Uuid::parse_str(trimmed) {
                    Ok(u) => Ok(Some(u)),
                    Err(_) => Ok(Some(Uuid::new_v5(&Uuid::NAMESPACE_OID, trimmed.as_bytes()))),
                }
            }
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InitiateMpesaPaymentCommand {
    #[serde(deserialize_with = "deserialize_flexible_uuid")]
    pub tenant_id: Uuid,
    #[serde(default, deserialize_with = "deserialize_optional_flexible_uuid")]
    pub lease_id: Option<Uuid>,
    pub phone_number: String,
    pub amount_kes: Decimal,
    pub account_reference: String,
    pub idempotency_key: String,
}

/// Section 5.1: Repository Pattern - PaymentRepository
pub trait PaymentRepository: Send + Sync {
    /// Processes an authoritative Safaricom Daraja C2B V2 payment confirmation idempotently.
    /// Deduplicates by `TransID` (M-Pesa receipt number) to prevent double allocations or double journal postings.
    /// Resolves tenant & invoices FIFO, creates double-entry journal lines, and issues receipt.
    fn process_c2b_confirmation(
        &self,
        req: C2bConfirmationRequest,
    ) -> AppResult<(Payment, bool)>;

    /// Processes a verified M-Pesa Daraja callback idempotently.
    /// Duplicate callbacks with the same `checkout_request_id` or `mpesa_receipt_number`
    /// return the existing settled payment without duplicating allocations or accounting entries!
    fn process_verified_mpesa_callback(
        &self,
        callback: VerifiedMpesaCallback,
    ) -> AppResult<(Payment, bool)>;

    fn get_payment(&self, ctx: &TenantContext, payment_id: Uuid) -> AppResult<Payment>;
    fn list_payments(&self, ctx: &TenantContext) -> AppResult<Vec<Payment>>;
}

pub struct InMemoryPaymentRepository {
    payments: Arc<RwLock<HashMap<Uuid, Payment>>>,
    invoice_repo: Arc<dyn InvoiceRepository>,
    accounting_repo: Arc<dyn AccountingRepository>,
    mpesa_adapter: Arc<dyn MpesaAdapter>,
    event_bus: EventBus,
}

impl InMemoryPaymentRepository {
    pub fn new(
        invoice_repo: Arc<dyn InvoiceRepository>,
        accounting_repo: Arc<dyn AccountingRepository>,
        mpesa_adapter: Arc<dyn MpesaAdapter>,
        event_bus: EventBus,
    ) -> Self {
        Self {
            payments: Arc::new(RwLock::new(HashMap::new())),
            invoice_repo,
            accounting_repo,
            mpesa_adapter,
            event_bus,
        }
    }
}

impl PaymentRepository for InMemoryPaymentRepository {
    fn process_c2b_confirmation(
        &self,
        req: C2bConfirmationRequest,
    ) -> AppResult<(Payment, bool)> {
        if req.trans_amount <= Decimal::ZERO {
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_REQUEST,
                code: "INVALID_AMOUNT".to_string(),
                message: "C2B payment amount must be greater than KES 0".to_string(),
            });
        }

        let trans_id_clean = req.trans_id.trim().to_uppercase();
        if trans_id_clean.is_empty() {
            return Err(AppError::Structured {
                status: axum::http::StatusCode::BAD_REQUEST,
                code: "INVALID_TRANS_ID".to_string(),
                message: "TransID is required for C2B confirmation".to_string(),
            });
        }

        // Idempotency check: duplicate TransID returns existing payment immediately
        {
            let guard = self.payments.read().unwrap_or_else(|e| e.into_inner());
            if let Some(existing) = guard.values().find(|p| {
                p.provider_receipt_number.as_deref() == Some(trans_id_clean.as_str())
                    && p.status == PaymentStatus::Completed
            }) {
                return Ok((existing.clone(), false));
            }
        }

        let normalized_phone = self
            .mpesa_adapter
            .normalize_kenyan_phone(&req.msisdn)
            .unwrap_or_else(|_| req.msisdn.trim().to_string());

        let bill_ref = req
            .bill_ref_number
            .as_deref()
            .or_else(|| req.invoice_number.as_deref())
            .unwrap_or("")
            .trim();

        // Resolve matching tenant context
        let (org_id, tenant_id, lease_id) = {
            let guard = self.payments.read().unwrap_or_else(|e| e.into_inner());
            if let Some(p) = guard.values().find(|p| {
                (!bill_ref.is_empty() && p.payment_reference.eq_ignore_ascii_case(bill_ref))
                    || p.payer_phone == normalized_phone
            }) {
                (p.organization_id, p.tenant_id, p.lease_id)
            } else if let Some(first_p) = guard.values().next() {
                (first_p.organization_id, first_p.tenant_id, first_p.lease_id)
            } else {
                let default_org = Uuid::new_v5(&Uuid::NAMESPACE_OID, b"guri24_org_production");
                let default_tnt = if !bill_ref.is_empty() {
                    Uuid::new_v5(&Uuid::NAMESPACE_OID, bill_ref.as_bytes())
                } else {
                    Uuid::new_v5(&Uuid::NAMESPACE_OID, normalized_phone.as_bytes())
                };
                (default_org, default_tnt, None)
            }
        };

        let sys_ctx = TenantContext {
            user_id: Uuid::nil(),
            organization_id: org_id,
            role: crate::core::security::SystemRole::OrganizationAdministrator,
            permissions: crate::core::security::SystemRole::OrganizationAdministrator
                .default_permissions()
                .into_iter()
                .map(ToString::to_string)
                .collect(),
        };

        // Plan FIFO allocation across outstanding invoices for tenant
        let outstanding = self
            .invoice_repo
            .list_outstanding_invoices_for_tenant(&sys_ctx, tenant_id)
            .unwrap_or_default();
        let strategy = FifoOldestFirstAllocationStrategy;
        let planned = strategy.plan_allocations(req.trans_amount, &outstanding);

        let mut allocations = Vec::new();
        let mut total_allocated = Decimal::ZERO;

        for (inv_id, alloc_amt) in planned {
            if let Ok(updated_inv) = self.invoice_repo.apply_payment_to_invoice(&sys_ctx, inv_id, alloc_amt) {
                total_allocated += alloc_amt;
                let allocation = PaymentAllocation {
                    id: Uuid::new_v4(),
                    organization_id: org_id,
                    payment_id: Uuid::nil(),
                    invoice_id: inv_id,
                    invoice_number: updated_inv.invoice_number.clone(),
                    allocated_amount_kes: alloc_amt,
                    remaining_invoice_balance_kes: updated_inv.balance_kes,
                    created_at: Utc::now(),
                };
                allocations.push(allocation);

                self.event_bus.publish(DomainEvent::PaymentAllocated {
                    organization_id: org_id,
                    payment_id: Uuid::nil(),
                    invoice_id: inv_id,
                    allocated_amount_kes: alloc_amt,
                    remaining_invoice_balance_kes: updated_inv.balance_kes,
                });
            }
        }

        let unallocated = req.trans_amount - total_allocated;
        let payment_id = Uuid::new_v4();
        for alloc in &mut allocations {
            alloc.payment_id = payment_id;
        }

        let receipt = ReceiptBuilder::new()
            .organization_id(org_id)
            .payment_id(payment_id)
            .tenant_id(tenant_id)
            .receipt_number(format!("RCT-{}", trans_id_clean))
            .amount_kes(req.trans_amount)
            .mpesa_receipt(Some(trans_id_clean.clone()))
            .build()?;

        // Post Double-Entry Journal:
        // DR M-Pesa & Bank Clearing Account (1010) = amount_kes
        // CR Accounts Receivable - Tenants (1100) = total_allocated
        // CR Tenant Advance Prepayments (2200) = unallocated
        let mut journal_lines = vec![JournalLine {
            id: Uuid::new_v4(),
            account_code: "1010".to_string(),
            account_name: "M-Pesa & Bank Clearing Account".to_string(),
            account_type: AccountType::Asset,
            tenant_id: Some(tenant_id),
            lease_id,
            debit_kes: req.trans_amount,
            credit_kes: Decimal::ZERO,
            memo: format!("M-Pesa C2B Paybill receipt {trans_id_clean}"),
        }];

        if total_allocated > Decimal::ZERO {
            journal_lines.push(JournalLine {
                id: Uuid::new_v4(),
                account_code: "1100".to_string(),
                account_name: "Accounts Receivable - Tenants".to_string(),
                account_type: AccountType::Asset,
                tenant_id: Some(tenant_id),
                lease_id,
                debit_kes: Decimal::ZERO,
                credit_kes: total_allocated,
                memo: format!("Allocated to {} invoice(s)", allocations.len()),
            });
        }

        if unallocated > Decimal::ZERO {
            journal_lines.push(JournalLine {
                id: Uuid::new_v4(),
                account_code: "2200".to_string(),
                account_name: "Tenant Advance Prepayments (Liability)".to_string(),
                account_type: AccountType::Liability,
                tenant_id: Some(tenant_id),
                lease_id,
                debit_kes: Decimal::ZERO,
                credit_kes: unallocated,
                memo: "Unallocated advance rent credit".to_string(),
            });
        }

        let _ = self.accounting_repo.post_journal_entry(
            org_id,
            None,
            "PAYMENT_RECEIVED",
            payment_id,
            format!("M-Pesa C2B payment {trans_id_clean} settled"),
            journal_lines,
        );

        let payment = Payment {
            id: payment_id,
            organization_id: org_id,
            tenant_id,
            lease_id,
            payment_reference: format!("PAY-{}", trans_id_clean),
            idempotency_key: trans_id_clean.clone(),
            checkout_request_id: None,
            merchant_request_id: None,
            provider_receipt_number: Some(trans_id_clean.clone()),
            payment_method: "MPESA_C2B".to_string(),
            payer_phone: normalized_phone,
            amount_kes: req.trans_amount,
            allocated_amount_kes: total_allocated,
            unallocated_amount_kes: unallocated,
            currency: "KES".to_string(),
            status: PaymentStatus::Completed,
            allocations,
            receipt: Some(receipt),
            created_at: Utc::now(),
            paid_at: Some(Utc::now()),
        };

        {
            let mut guard = self.payments.write().unwrap_or_else(|e| e.into_inner());
            guard.insert(payment.id, payment.clone());
        }

        self.event_bus.publish(DomainEvent::PaymentReceived {
            organization_id: org_id,
            payment_id,
            tenant_id,
            amount_kes: req.trans_amount,
            mpesa_receipt: Some(trans_id_clean),
        });

        Ok((payment, true))
    }

    fn process_verified_mpesa_callback(
        &self,
        callback: VerifiedMpesaCallback,
    ) -> AppResult<(Payment, bool)> {
        // Locate payment by checkout_request_id or mpesa_receipt_number
        let existing_payment = {
            let guard = self.payments.read().unwrap_or_else(|e| e.into_inner());
            if let Some(ref receipt_no) = callback.mpesa_receipt_number {
                if let Some(already_settled) = guard.values().find(|p| {
                    p.provider_receipt_number.as_deref() == Some(receipt_no.as_str())
                        && p.status == PaymentStatus::Completed
                }) {
                    // Duplicate M-Pesa callback protection: return idempotently without re-allocating!
                    return Ok((already_settled.clone(), false));
                }
            }

            guard
                .values()
                .find(|p| {
                    p.checkout_request_id.as_deref()
                        == Some(callback.checkout_request_id.as_str())
                })
                .cloned()
                .ok_or_else(|| {
                    AppError::NotFound(format!(
                        "No initiated M-Pesa payment found for checkout_request_id '{}'",
                        callback.checkout_request_id
                    ))
                })?
        };

        // If already Completed or Failed, return idempotently
        if existing_payment.status == PaymentStatus::Completed {
            return Ok((existing_payment, false));
        }

        if callback.result_code != 0 {
            let mut guard = self.payments.write().unwrap_or_else(|e| e.into_inner());
            let p = guard.get_mut(&existing_payment.id).unwrap();
            p.status = PaymentStatus::Failed;
            let failed_snapshot = p.clone();
            drop(guard);

            self.event_bus.publish(DomainEvent::PaymentFailed {
                organization_id: failed_snapshot.organization_id,
                payment_id: failed_snapshot.id,
                reason: callback.result_desc,
            });
            return Ok((failed_snapshot, true));
        }

        let sys_ctx = TenantContext {
            user_id: Uuid::nil(),
            organization_id: existing_payment.organization_id,
            role: crate::core::security::SystemRole::OrganizationAdministrator,
            permissions: crate::core::security::SystemRole::OrganizationAdministrator
                .default_permissions()
                .into_iter()
                .map(ToString::to_string)
                .collect(),
        };

        // Plan FIFO allocation across tenant's outstanding invoices
        let outstanding = self
            .invoice_repo
            .list_outstanding_invoices_for_tenant(&sys_ctx, existing_payment.tenant_id)?;
        let strategy = FifoOldestFirstAllocationStrategy;
        let planned = strategy.plan_allocations(existing_payment.amount_kes, &outstanding);

        let mut allocations = Vec::new();
        let mut total_allocated = Decimal::ZERO;

        for (invoice_id, alloc_amt) in planned {
            let updated_inv =
                self.invoice_repo
                    .apply_payment_to_invoice(&sys_ctx, invoice_id, alloc_amt)?;
            total_allocated += alloc_amt;
            let allocation = PaymentAllocation {
                id: Uuid::new_v4(),
                organization_id: existing_payment.organization_id,
                payment_id: existing_payment.id,
                invoice_id,
                invoice_number: updated_inv.invoice_number.clone(),
                allocated_amount_kes: alloc_amt,
                remaining_invoice_balance_kes: updated_inv.balance_kes,
                created_at: Utc::now(),
            };
            allocations.push(allocation);

            self.event_bus.publish(DomainEvent::PaymentAllocated {
                organization_id: existing_payment.organization_id,
                payment_id: existing_payment.id,
                invoice_id,
                allocated_amount_kes: alloc_amt,
                remaining_invoice_balance_kes: updated_inv.balance_kes,
            });
        }

        let unallocated = existing_payment.amount_kes - total_allocated;
        let receipt_no = callback
            .mpesa_receipt_number
            .clone()
            .unwrap_or_else(crate::integrations::mpesa::generate_mpesa_receipt_code);

        let receipt = ReceiptBuilder::new()
            .organization_id(existing_payment.organization_id)
            .payment_id(existing_payment.id)
            .tenant_id(existing_payment.tenant_id)
            .receipt_number(format!("RCT-{}", receipt_no))
            .amount_kes(existing_payment.amount_kes)
            .mpesa_receipt(Some(receipt_no.clone()))
            .build()?;

        // Post Double-Entry Journal:
        // DR M-Pesa & Bank Clearing Account (1010) = amount_kes
        // CR Accounts Receivable - Tenants (1100) = total_allocated
        // CR Tenant Advance Prepayments Liability (2200) = unallocated (if > 0)
        let mut journal_lines = vec![JournalLine {
            id: Uuid::new_v4(),
            account_code: "1010".to_string(),
            account_name: "M-Pesa & Bank Clearing Account".to_string(),
            account_type: AccountType::Asset,
            tenant_id: Some(existing_payment.tenant_id),
            lease_id: existing_payment.lease_id,
            debit_kes: existing_payment.amount_kes,
            credit_kes: Decimal::ZERO,
            memo: format!("M-Pesa receipt {receipt_no}"),
        }];

        if total_allocated > Decimal::ZERO {
            journal_lines.push(JournalLine {
                id: Uuid::new_v4(),
                account_code: "1100".to_string(),
                account_name: "Accounts Receivable - Tenants".to_string(),
                account_type: AccountType::Asset,
                tenant_id: Some(existing_payment.tenant_id),
                lease_id: existing_payment.lease_id,
                debit_kes: Decimal::ZERO,
                credit_kes: total_allocated,
                memo: format!("Allocated to {} invoice(s)", allocations.len()),
            });
        }

        if unallocated > Decimal::ZERO {
            journal_lines.push(JournalLine {
                id: Uuid::new_v4(),
                account_code: "2200".to_string(),
                account_name: "Tenant Advance Prepayments (Liability)".to_string(),
                account_type: AccountType::Liability,
                tenant_id: Some(existing_payment.tenant_id),
                lease_id: existing_payment.lease_id,
                debit_kes: Decimal::ZERO,
                credit_kes: unallocated,
                memo: "Unallocated advance rent credit".to_string(),
            });
        }

        self.accounting_repo.post_journal_entry(
            existing_payment.organization_id,
            None,
            "PAYMENT_RECEIVED",
            existing_payment.id,
            format!(
                "M-Pesa payment {} ({}) settled",
                existing_payment.payment_reference, receipt_no
            ),
            journal_lines,
        )?;

        let mut guard = self.payments.write().unwrap_or_else(|e| e.into_inner());
        let p = guard.get_mut(&existing_payment.id).unwrap();
        p.status = PaymentStatus::Completed;
        p.provider_receipt_number = Some(receipt_no.clone());
        p.allocated_amount_kes = total_allocated;
        p.unallocated_amount_kes = unallocated;
        p.allocations = allocations;
        p.receipt = Some(receipt);
        p.paid_at = Some(Utc::now());
        let settled = p.clone();
        drop(guard);

        self.event_bus.publish(DomainEvent::PaymentReceived {
            organization_id: settled.organization_id,
            payment_id: settled.id,
            tenant_id: settled.tenant_id,
            amount_kes: settled.amount_kes,
            mpesa_receipt: Some(receipt_no),
        });

        Ok((settled, true))
    }

    fn get_payment(&self, ctx: &TenantContext, payment_id: Uuid) -> AppResult<Payment> {
        ctx.require_permission("payments.view")?;
        let payment = self
            .payments
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&payment_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Payment not found".to_string()))?;
        ctx.assert_owns_record(payment.organization_id)?;
        Ok(payment)
    }

    fn list_payments(&self, ctx: &TenantContext) -> AppResult<Vec<Payment>> {
        ctx.require_permission("payments.view")?;
        Ok(self
            .payments
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|p| p.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
