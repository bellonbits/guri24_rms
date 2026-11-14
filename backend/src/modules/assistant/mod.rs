use std::sync::{Arc, RwLock};
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
        accounting::AccountingRepository,
        billing::InvoiceRepository,
        deposits::DepositRepository,
        documents::DocumentRepository,
        leases::LeaseRepository,
        maintenance::{MaintenanceRepository, SubmitMaintenanceCommand},
        ocr::OcrRepository,
        payments::PaymentRepository,
        properties::{PropertyRepository, UnitRepository, UnitStatus},
        tenants::TenantRepository,
    },
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssistantCitation {
    pub record_type: String,
    pub record_code: String,
    pub summary: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssistantToolCallRecord {
    pub id: Uuid,
    pub tool_name: String,
    pub required_permission: String,
    pub authorized: bool,
    pub result_summary: String,
    pub executed_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ConfirmationStatus {
    Pending,
    Confirmed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssistantActionConfirmation {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub conversation_id: Uuid,
    pub requested_by_user_id: Uuid,
    pub action_type: String,
    pub action_summary: String,
    pub status: ConfirmationStatus,
    pub created_at: DateTime<Utc>,
    pub decided_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssistantMessage {
    pub id: Uuid,
    pub sender_role: String,
    pub content: String,
    pub tool_calls: Vec<AssistantToolCallRecord>,
    pub citations: Vec<AssistantCitation>,
    pub pending_confirmation: Option<AssistantActionConfirmation>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssistantConversation {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub messages: Vec<AssistantMessage>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AssistantChatCommand {
    pub conversation_id: Option<Uuid>,
    pub prompt: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ConfirmAssistantActionCommand {
    pub confirm: bool,
}

pub trait AssistantServiceTrait: Send + Sync {
    fn chat(
        &self,
        ctx: &TenantContext,
        cmd: AssistantChatCommand,
    ) -> AppResult<AssistantMessage>;
    fn confirm_action(
        &self,
        ctx: &TenantContext,
        confirmation_id: Uuid,
        cmd: ConfirmAssistantActionCommand,
    ) -> AppResult<AssistantActionConfirmation>;
    fn list_conversations(&self, ctx: &TenantContext) -> AppResult<Vec<AssistantConversation>>;
}

pub struct GroundedAssistantService {
    properties: Arc<dyn PropertyRepository>,
    units: Arc<dyn UnitRepository>,
    tenants: Arc<dyn TenantRepository>,
    leases: Arc<dyn LeaseRepository>,
    invoices: Arc<dyn InvoiceRepository>,
    payments: Arc<dyn PaymentRepository>,
    deposits: Arc<dyn DepositRepository>,
    accounting: Arc<dyn AccountingRepository>,
    maintenance: Arc<dyn MaintenanceRepository>,
    documents: Arc<dyn DocumentRepository>,
    ocr: Arc<dyn OcrRepository>,
    conversations: RwLock<Vec<AssistantConversation>>,
    confirmations: RwLock<Vec<AssistantActionConfirmation>>,
}

impl GroundedAssistantService {
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        properties: Arc<dyn PropertyRepository>,
        units: Arc<dyn UnitRepository>,
        tenants: Arc<dyn TenantRepository>,
        leases: Arc<dyn LeaseRepository>,
        invoices: Arc<dyn InvoiceRepository>,
        payments: Arc<dyn PaymentRepository>,
        deposits: Arc<dyn DepositRepository>,
        accounting: Arc<dyn AccountingRepository>,
        maintenance: Arc<dyn MaintenanceRepository>,
        documents: Arc<dyn DocumentRepository>,
        ocr: Arc<dyn OcrRepository>,
    ) -> Self {
        Self {
            properties,
            units,
            tenants,
            leases,
            invoices,
            payments,
            deposits,
            accounting,
            maintenance,
            documents,
            ocr,
            conversations: RwLock::new(Vec::new()),
            confirmations: RwLock::new(Vec::new()),
        }
    }

    /// Section 12: Protect against prompt injection, SQL injection attempts, or instruction hijacking
    fn guard_prompt_safety(prompt: &str) -> AppResult<()> {
        let lower = prompt.to_lowercase();
        let forbidden_patterns = [
            "ignore previous instructions",
            "ignore all instructions",
            "system prompt",
            "drop table",
            "delete from",
            "bypass rbac",
            "bypass tenant isolation",
        ];
        for pat in forbidden_patterns {
            if lower.contains(pat) {
                return Err(AppError::Forbidden(format!(
                    "Prompt safety guard blocked disallowed instruction pattern: '{pat}'"
                )));
            }
        }
        Ok(())
    }
}

impl AssistantServiceTrait for GroundedAssistantService {
    fn chat(
        &self,
        ctx: &TenantContext,
        cmd: AssistantChatCommand,
    ) -> AppResult<AssistantMessage> {
        ctx.require_permission("assistant.use")?;
        Self::guard_prompt_safety(&cmd.prompt)?;

        let q = cmd.prompt.trim().to_lowercase();
        let now = Utc::now();
        let conv_id = cmd.conversation_id.unwrap_or_else(Uuid::new_v4);

        let mut tool_calls = Vec::new();
        let mut citations = Vec::new();
        let mut pending_confirmation = None;
        let response_text: String;

        if q.contains("create maintenance") || q.contains("submit maintenance") || q.contains("log repair") {
            ctx.require_permission("maintenance.view")?;
            let confirmation = AssistantActionConfirmation {
                id: Uuid::new_v4(),
                organization_id: ctx.organization_id,
                conversation_id: conv_id,
                requested_by_user_id: ctx.user_id,
                action_type: "create_maintenance_request".to_string(),
                action_summary: "Create maintenance ticket for inspection/repair in active organization".to_string(),
                status: ConfirmationStatus::Pending,
                created_at: now,
                decided_at: None,
            };
            self.confirmations.write().unwrap().push(confirmation.clone());
            pending_confirmation = Some(confirmation.clone());

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "create_maintenance_request".to_string(),
                required_permission: "maintenance.view".to_string(),
                authorized: true,
                result_summary: "Prepared maintenance ticket draft; awaiting explicit user confirmation".to_string(),
                executed_at: now,
            });

            response_text = format!(
                "I have prepared action confirmation `{}` to create a maintenance request. Please confirm before any record is created.",
                confirmation.id
            );
        } else if q.contains("draft") && (q.contains("reminder") || q.contains("notification")) {
            ctx.require_permission("tenants.view")?;
            let confirmation = AssistantActionConfirmation {
                id: Uuid::new_v4(),
                organization_id: ctx.organization_id,
                conversation_id: conv_id,
                requested_by_user_id: ctx.user_id,
                action_type: "draft_tenant_notification".to_string(),
                action_summary: "Send SMS/Email rent balance reminder to tenants with arrears".to_string(),
                status: ConfirmationStatus::Pending,
                created_at: now,
                decided_at: None,
            };
            self.confirmations.write().unwrap().push(confirmation.clone());
            pending_confirmation = Some(confirmation.clone());

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "draft_tenant_notification".to_string(),
                required_permission: "tenants.view".to_string(),
                authorized: true,
                result_summary: "Drafted SMS/Email reminder; awaiting explicit confirmation before external dispatch".to_string(),
                executed_at: now,
            });

            response_text = "I have drafted the tenant rent reminder notification. Because sending external communications requires explicit approval, please confirm the action below.".to_string();
        } else if q.contains("collected") || q.contains("collection") || q.contains("revenue") || q.contains("financial") {
            ctx.require_permission("payments.view")?;
            ctx.require_permission("invoices.view")?;

            let invoices = self.invoices.list_invoices(ctx)?;
            let payments = self.payments.list_payments(ctx)?;
            let deposits = self.deposits.list_deposits(ctx)?;
            let expenses = self.accounting.list_expenses(ctx)?;

            let total_billed: Decimal = invoices.iter().map(|i| i.total_amount_kes).sum();
            let total_collected: Decimal = payments.iter().map(|p| p.allocated_amount_kes).sum();
            let total_arrears: Decimal = invoices.iter().map(|i| i.balance_kes).sum();
            let total_deposits: Decimal = deposits.iter().map(|d| d.current_liability_balance_kes).sum();
            let total_expenses: Decimal = expenses.iter().map(|e| e.amount_kes).sum();

            for p in payments.iter().take(5) {
                citations.push(AssistantCitation {
                    record_type: "Payment".to_string(),
                    record_code: p.receipt_number.clone(),
                    summary: format!("KES {} (M-Pesa {})", p.amount_kes, p.mpesa_receipt_number.clone().unwrap_or_default()),
                });
            }
            for inv in invoices.iter().take(5) {
                citations.push(AssistantCitation {
                    record_type: "Invoice".to_string(),
                    record_code: inv.invoice_number.clone(),
                    summary: format!("Total KES {}, Balance KES {}", inv.total_amount_kes, inv.balance_kes),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "get_collection_summary".to_string(),
                required_permission: "payments.view".to_string(),
                authorized: true,
                result_summary: format!(
                    "Queried {} invoices and {} verified payments for organization",
                    invoices.len(),
                    payments.len()
                ),
                executed_at: now,
            });

            response_text = format!(
                "Based on live persisted RMS records for your organization: Total Billed Rent is KES {}, Actual Verified Collections are KES {} across {} payment(s), Outstanding Arrears are KES {}, Property Operating Expenses are KES {}, and Security Deposits Held in Liability (Account 2100) are KES {}.",
                total_billed,
                total_collected,
                payments.len(),
                total_arrears,
                total_expenses,
                total_deposits
            );
        } else if q.contains("arrears") || q.contains("outstanding") || q.contains("overdue") || q.contains("unpaid") {
            ctx.require_permission("invoices.view")?;
            let invoices = self.invoices.list_invoices(ctx)?;
            let tenants = self.tenants.list_tenants(ctx)?;

            let unpaid: Vec<_> = invoices.iter().filter(|i| i.balance_kes > Decimal::ZERO).collect();
            let total_arrears: Decimal = unpaid.iter().map(|i| i.balance_kes).sum();

            for inv in &unpaid {
                let tenant_name = tenants
                    .iter()
                    .find(|t| t.id == inv.tenant_id)
                    .map(|t| t.full_name.as_str())
                    .unwrap_or("Tenant");
                citations.push(AssistantCitation {
                    record_type: "Invoice".to_string(),
                    record_code: inv.invoice_number.clone(),
                    summary: format!("{tenant_name}: Balance KES {} (Period {})", inv.balance_kes, inv.billing_period),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "get_arrears_report".to_string(),
                required_permission: "invoices.view".to_string(),
                authorized: true,
                result_summary: format!("Found {} invoice(s) with outstanding balance totaling KES {}", unpaid.len(), total_arrears),
                executed_at: now,
            });

            if unpaid.is_empty() {
                response_text = "All issued invoices in your organization are fully settled (KES 0.00 outstanding arrears).".to_string();
            } else {
                response_text = format!(
                    "There are {} invoice(s) with an outstanding balance totaling KES {}. See the cited invoice records below for exact balances.",
                    unpaid.len(),
                    total_arrears
                );
            }
        } else if q.contains("vacant") || q.contains("available") || q.contains("unit") {
            ctx.require_permission("properties.view")?;
            let units = self.units.list_units(ctx, None)?;
            let vacant: Vec<_> = units
                .iter()
                .filter(|u| u.status == UnitStatus::Vacant)
                .collect();

            for u in &vacant {
                citations.push(AssistantCitation {
                    record_type: "Unit".to_string(),
                    record_code: u.unit_number.clone(),
                    summary: format!("Vacant — Rent KES {}/month ({} BR)", u.monthly_rent_kes, u.bedrooms),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "get_unit_availability".to_string(),
                required_permission: "properties.view".to_string(),
                authorized: true,
                result_summary: format!("Found {} vacant available unit(s) out of {} total units", vacant.len(), units.len()),
                executed_at: now,
            });

            response_text = format!(
                "Your portfolio currently has {} vacant available unit(s) out of {} total residential unit(s).",
                vacant.len(),
                units.len()
            );
        } else if q.contains("maintenance") || q.contains("repair") || q.contains("work order") {
            ctx.require_permission("maintenance.view")?;
            let requests = self.maintenance.list_requests(ctx)?;
            for r in &requests {
                citations.push(AssistantCitation {
                    record_type: "MaintenanceRequest".to_string(),
                    record_code: r.request_number.clone(),
                    summary: format!("{} ({:?}) — Est. KES {}", r.title, r.status, r.estimated_cost_kes),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "get_maintenance_requests".to_string(),
                required_permission: "maintenance.view".to_string(),
                authorized: true,
                result_summary: format!("Retrieved {} maintenance request(s)", requests.len()),
                executed_at: now,
            });

            response_text = format!(
                "There are {} maintenance request(s) recorded for your organization.",
                requests.len()
            );
        } else if q.contains("ocr") || q.contains("document") || q.contains("extract") {
            ctx.require_permission("documents.view")?;
            let docs = self.documents.list_documents(ctx)?;
            let ocr_jobs = self.ocr.list_jobs(ctx)?;

            for job in &ocr_jobs {
                citations.push(AssistantCitation {
                    record_type: "OcrJob".to_string(),
                    record_code: job.file_name.clone(),
                    summary: format!("Status {:?} — Confidence {}%", job.status, job.overall_confidence_pct),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "search_documents".to_string(),
                required_permission: "documents.view".to_string(),
                authorized: true,
                result_summary: format!("Found {} stored document(s) and {} OCR extraction job(s)", docs.len(), ocr_jobs.len()),
                executed_at: now,
            });

            response_text = format!(
                "Your organization has {} private S3 document(s) and {} OCR extraction job(s). Remember that OCR outputs in NEEDS_REVIEW status require human verification before becoming authoritative.",
                docs.len(),
                ocr_jobs.len()
            );
        } else {
            ctx.require_permission("properties.view")?;
            let props = self.properties.list_properties(ctx)?;
            let units = self.units.list_units(ctx, None)?;
            let leases = self.leases.list_leases(ctx)?;

            for p in &props {
                citations.push(AssistantCitation {
                    record_type: "Property".to_string(),
                    record_code: p.code.clone(),
                    summary: format!("{} ({}, {})", p.name, p.estate_or_area, p.county),
                });
            }

            tool_calls.push(AssistantToolCallRecord {
                id: Uuid::new_v4(),
                tool_name: "get_property_summary".to_string(),
                required_permission: "properties.view".to_string(),
                authorized: true,
                result_summary: format!(
                    "Summarized {} properties, {} units, and {} leases",
                    props.len(),
                    units.len(),
                    leases.len()
                ),
                executed_at: now,
            });

            response_text = format!(
                "Your organization currently manages {} residential property/properties, {} unit(s), and {} lease agreement(s). Ask me about rent collections, tenant arrears, vacant units, expiring leases, maintenance tickets, or OCR document extractions.",
                props.len(),
                units.len(),
                leases.len()
            );
        }

        let assistant_msg = AssistantMessage {
            id: Uuid::new_v4(),
            sender_role: "ASSISTANT".to_string(),
            content: response_text,
            tool_calls,
            citations,
            pending_confirmation,
            created_at: now,
        };

        let mut conv_store = self.conversations.write().unwrap();
        if let Some(conv) = conv_store
            .iter_mut()
            .find(|c| c.id == conv_id && c.organization_id == ctx.organization_id)
        {
            conv.messages.push(AssistantMessage {
                id: Uuid::new_v4(),
                sender_role: "USER".to_string(),
                content: cmd.prompt,
                tool_calls: vec![],
                citations: vec![],
                pending_confirmation: None,
                created_at: now,
            });
            conv.messages.push(assistant_msg.clone());
            conv.updated_at = now;
        } else {
            conv_store.push(AssistantConversation {
                id: conv_id,
                organization_id: ctx.organization_id,
                user_id: ctx.user_id,
                title: cmd.prompt.chars().take(60).collect(),
                messages: vec![
                    AssistantMessage {
                        id: Uuid::new_v4(),
                        sender_role: "USER".to_string(),
                        content: cmd.prompt,
                        tool_calls: vec![],
                        citations: vec![],
                        pending_confirmation: None,
                        created_at: now,
                    },
                    assistant_msg.clone(),
                ],
                created_at: now,
                updated_at: now,
            });
        }

        Ok(assistant_msg)
    }

    fn confirm_action(
        &self,
        ctx: &TenantContext,
        confirmation_id: Uuid,
        cmd: ConfirmAssistantActionCommand,
    ) -> AppResult<AssistantActionConfirmation> {
        ctx.require_permission("assistant.use")?;
        let mut store = self.confirmations.write().unwrap();
        let item = store
            .iter_mut()
            .find(|c| c.id == confirmation_id)
            .ok_or_else(|| AppError::NotFound("Action confirmation not found".to_string()))?;

        ctx.assert_owns_record(item.organization_id)?;

        if item.status != ConfirmationStatus::Pending {
            return Err(AppError::Conflict(
                "Action confirmation has already been decided".to_string(),
            ));
        }

        if cmd.confirm {
            if item.action_type == "create_maintenance_request" {
                let units = self.units.list_units(ctx, None)?;
                if let Some(first_unit) = units.first() {
                    let _ = self.maintenance.submit_request(
                        ctx,
                        SubmitMaintenanceCommand {
                            property_id: first_unit.property_id,
                            building_id: first_unit.building_id,
                            unit_id: first_unit.id,
                            tenant_id: None,
                            category: "GENERAL_INSPECTION".to_string(),
                            priority: "MEDIUM".to_string(),
                            title: "AI Assistant Scheduled Unit Inspection".to_string(),
                            description: item.action_summary.clone(),
                            estimated_cost_kes: Decimal::new(250000, 2),
                        },
                    )?;
                }
            }
            item.status = ConfirmationStatus::Confirmed;
        } else {
            item.status = ConfirmationStatus::Cancelled;
        }
        item.decided_at = Some(Utc::now());
        Ok(item.clone())
    }

    fn list_conversations(&self, ctx: &TenantContext) -> AppResult<Vec<AssistantConversation>> {
        ctx.require_permission("assistant.use")?;
        let store = self.conversations.read().unwrap();
        Ok(store
            .iter()
            .filter(|c| c.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
