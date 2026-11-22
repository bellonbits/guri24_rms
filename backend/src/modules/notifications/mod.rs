use std::sync::{Arc, RwLock};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        events::{DomainEvent, DomainEventObserver},
        tenant_context::TenantContext,
    },
    integrations::email::{
        templates::{
            render_account_approved_email,
            render_deposit_received_template, render_invoice_issued_template,
            render_notification_email_template,
            render_payment_receipt_template, render_refund_verified_template,
        },
        EmailAdapter,
    },
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DeliveryStatus {
    Queued,
    Processing,
    Sent,
    Delivered,
    Bounced,
    Complained,
    Failed,
    Suppressed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationDelivery {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub recipient_email: String,
    pub recipient_name: String,
    pub recipient_role: String,
    pub template_key: String,
    pub subject: String,
    pub body_html: String,
    pub body_text: String,
    pub status: DeliveryStatus,
    pub provider: String,
    pub provider_message_id: Option<String>,
    pub error_message: Option<String>,
    pub retry_count: u32,
    pub max_retries: u32,
    pub idempotency_key: String,
    pub related_entity_type: Option<String>,
    pub related_entity_id: Option<Uuid>,
    pub sent_at: Option<DateTime<Utc>>,
    pub delivered_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationSettings {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub rent_reminder_days_before: i32,
    pub rent_due_date_reminder: bool,
    pub overdue_reminder_days: Vec<i32>,
    pub lease_expiry_days: Vec<i32>,
    pub daily_collection_summary: bool,
    pub weekly_operational_report: bool,
    pub monthly_financial_report: bool,
    pub deposit_liability_summary: bool,
    pub staff_escalation_emails: Vec<String>,
    pub timezone: String,
    pub email_from: String,
    pub brand_logo_url: Option<String>,
    pub brand_primary_color: String,
    pub updated_at: DateTime<Utc>,
}

impl Default for NotificationSettings {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4(),
            organization_id: Uuid::nil(),
            rent_reminder_days_before: 7,
            rent_due_date_reminder: true,
            overdue_reminder_days: vec![3, 7, 14, 30],
            lease_expiry_days: vec![90, 60, 30, 7],
            daily_collection_summary: true,
            weekly_operational_report: true,
            monthly_financial_report: true,
            deposit_liability_summary: true,
            staff_escalation_emails: vec![],
            timezone: "Africa/Nairobi".to_string(),
            email_from: "Guri24 RMS <guri24@aqivo.shop>".to_string(),
            brand_logo_url: None,
            brand_primary_color: "#0f172a".to_string(),
            updated_at: Utc::now(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationTemplateSummary {
    pub key: String,
    pub title: String,
    pub category: String,
    pub is_mandatory: bool,
    pub sample_subject: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateNotificationSettingsCommand {
    pub rent_reminder_days_before: Option<i32>,
    pub rent_due_date_reminder: Option<bool>,
    pub overdue_reminder_days: Option<Vec<i32>>,
    pub lease_expiry_days: Option<Vec<i32>>,
    pub daily_collection_summary: Option<bool>,
    pub staff_escalation_emails: Option<Vec<String>>,
    pub timezone: Option<String>,
    pub email_from: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SendTestEmailCommand {
    pub recipient_email: String,
    pub template_key: String,
}

pub trait NotificationServiceTrait: Send + Sync {
    fn get_settings(&self, ctx: &TenantContext) -> AppResult<NotificationSettings>;
    fn update_settings(
        &self,
        ctx: &TenantContext,
        cmd: UpdateNotificationSettingsCommand,
    ) -> AppResult<NotificationSettings>;
    fn list_deliveries(&self, ctx: &TenantContext) -> AppResult<Vec<NotificationDelivery>>;
    fn retry_delivery(&self, ctx: &TenantContext, delivery_id: Uuid) -> AppResult<NotificationDelivery>;
    fn send_test_email(&self, ctx: &TenantContext, cmd: SendTestEmailCommand) -> AppResult<NotificationDelivery>;
    fn list_templates(&self, ctx: &TenantContext) -> AppResult<Vec<NotificationTemplateSummary>>;
}

pub struct CentralizedNotificationService {
    email_adapter: Arc<dyn EmailAdapter>,
    deliveries: Arc<RwLock<Vec<NotificationDelivery>>>,
    settings: Arc<RwLock<Vec<NotificationSettings>>>,
}

impl CentralizedNotificationService {
    pub fn new(email_adapter: Arc<dyn EmailAdapter>) -> Self {
        Self {
            email_adapter,
            deliveries: Arc::new(RwLock::new(Vec::new())),
            settings: Arc::new(RwLock::new(Vec::new())),
        }
    }

    /// Primary event consumer called by the transactional outbox observer
    pub fn process_domain_event(&self, event: &DomainEvent) -> Result<(), String> {
        let org_id = event.organization_id();
        let now = Utc::now();

        // 1. Resolve notification parameters based on domain event type
        let (template_key, subject, body_html, body_text, recipient_email, recipient_name, recipient_role, idem_key) = match event {
            DomainEvent::PaymentReceived {
                payment_id,
                amount_kes,
                mpesa_receipt,
                ..
            } => {
                let receipt_num = format!("RCT-{}", &payment_id.to_string()[..8].to_uppercase());
                let mpesa_ref = mpesa_receipt.clone().unwrap_or_else(|| "MPESA-OK".to_string());
                let subject = format!("Verified Payment Receipt — {} (KES {})", receipt_num, amount_kes);
                let html = render_payment_receipt_template(
                    "tenant@guri24.co.ke",
                    "Valued Tenant",
                    &amount_kes.to_string(),
                    &receipt_num,
                    &mpesa_ref,
                    "Unit A-201, Jacaranda Heights",
                    &now.format("%d %b %Y, %H:%M").to_string(),
                );
                let text = format!(
                    "Payment Receipt {}: KES {} verified against M-Pesa {}.",
                    receipt_num, amount_kes, mpesa_ref
                );
                (
                    "PAYMENT_VERIFIED",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:pay_rec:{}", payment_id),
                )
            }
            DomainEvent::InvoiceGenerated {
                invoice_id,
                billing_period,
                total_amount_kes,
                ..
            } => {
                let inv_num = format!("INV-{}", &invoice_id.to_string()[..8].to_uppercase());
                let due = now + chrono::Duration::days(5);
                let subject = format!("Rent Invoice {} — {} (KES {})", inv_num, billing_period, total_amount_kes);
                let html = render_invoice_issued_template(
                    "tenant@guri24.co.ke",
                    "Valued Tenant",
                    &inv_num,
                    billing_period,
                    &total_amount_kes.to_string(),
                    &due.format("%d %b %Y").to_string(),
                    "Unit A-201, Jacaranda Heights",
                );
                let text = format!(
                    "Invoice {} for {}: KES {} due on {}.",
                    inv_num, billing_period, total_amount_kes, due.format("%d %b %Y")
                );
                (
                    "INVOICE_ISSUED",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:inv:{}", invoice_id),
                )
            }
            DomainEvent::DepositReceived {
                deposit_id,
                amount_kes,
                ..
            } => {
                let subject = format!("Security Deposit Held in Liability — KES {}", amount_kes);
                let html = render_deposit_received_template(
                    "tenant@guri24.co.ke",
                    "Valued Tenant",
                    &amount_kes.to_string(),
                    "Lease Agreement #LSE-2026-001",
                    "Unit A-201, Jacaranda Heights",
                );
                let text = format!(
                    "Security deposit of KES {} received and recorded under Account 2100 Liability.",
                    amount_kes
                );
                (
                    "DEPOSIT_RECEIVED",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:dep:{}", deposit_id),
                )
            }
            DomainEvent::RefundExecutionVerified {
                refund_id,
                payout_reference,
                amount_kes,
                ..
            } => {
                let subject = format!("Deposit Move-Out Refund Completed — KES {}", amount_kes);
                let html = render_refund_verified_template(
                    "tenant@guri24.co.ke",
                    "Valued Tenant",
                    &amount_kes.to_string(),
                    "M-Pesa B2C Payout",
                    payout_reference,
                    "Unit A-201, Jacaranda Heights",
                );
                let text = format!(
                    "Deposit refund of KES {} disbursed via M-Pesa {}. Account 2100 liability closed.",
                    amount_kes, payout_reference
                );
                (
                    "REFUND_VERIFIED",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:ref_exec:{}", refund_id),
                )
            }
            DomainEvent::RentReminder {
                invoice_id,
                days_until_due,
                balance_kes,
                ..
            } => {
                let subject = format!("Friendly Reminder: Rent Due in {} Days (KES {})", days_until_due, balance_kes);
                let html = render_notification_email_template(
                    "tenant@guri24.co.ke",
                    "Upcoming Rent Payment Reminder",
                    &format!(
                        "This is a friendly reminder that your upcoming rent balance of <strong>KES {}</strong> is due in <strong>{} days</strong>. You can pay seamlessly via M-Pesa Paybill 174379.",
                        balance_kes, days_until_due
                    ),
                    Some("Pay Now"),
                    None,
                );
                let text = format!("Upcoming rent reminder: KES {} due in {} days.", balance_kes, days_until_due);
                (
                    "RENT_REMINDER",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:rent_rem:{}:{}", invoice_id, days_until_due),
                )
            }
            DomainEvent::OverdueRentNotice {
                invoice_id,
                days_overdue,
                balance_kes,
                ..
            } => {
                let subject = format!("Notice of Overdue Rent Balance — KES {} ({} Days Overdue)", balance_kes, days_overdue);
                let html = render_notification_email_template(
                    "tenant@guri24.co.ke",
                    "Overdue Rent Balance Notice",
                    &format!(
                        "Our records indicate an outstanding balance of <strong>KES {}</strong> which is now <strong>{} days overdue</strong>. Please settle immediately or contact management to arrange payment.",
                        balance_kes, days_overdue
                    ),
                    Some("Settle Overdue Balance"),
                    None,
                );
                let text = format!("Overdue rent notice: KES {} is {} days overdue.", balance_kes, days_overdue);
                (
                    "OVERDUE_RENT_NOTICE",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:overdue:{}:{}", invoice_id, days_overdue),
                )
            }
            DomainEvent::ReconciliationExceptionCreated {
                exception_id,
                exception_type,
                details,
                ..
            } => {
                let subject = format!("Staff Alert: Reconciliation Exception [{}]", exception_type);
                let html = render_notification_email_template(
                    "accountant@guri24.co.ke",
                    "Reconciliation Discrepancy Flagged",
                    &format!(
                        "A financial discrepancy requires accountant review: <strong>{}</strong> &bull; {}",
                        exception_type, details
                    ),
                    Some("Review Exception Queue"),
                    None,
                );
                let text = format!("Reconciliation exception [{}]: {}", exception_type, details);
                (
                    "RECONCILIATION_EXCEPTION",
                    subject,
                    html,
                    text,
                    "accountant@guri24.co.ke".to_string(),
                    "Accountant".to_string(),
                    "STAFF",
                    format!("idem:reconcile_exc:{}", exception_id),
                )
            }
            DomainEvent::MaintenanceSubmitted {
                request_id,
                priority,
                ..
            } => {
                let subject = format!("Maintenance Ticket Logged &bull; Priority: {}", priority);
                let html = render_notification_email_template(
                    "tenant@guri24.co.ke",
                    "Maintenance Request Received",
                    &format!(
                        "Your maintenance request has been recorded with priority <strong>{}</strong>. A service technician will be assigned shortly.",
                        priority
                    ),
                    Some("Track Status"),
                    None,
                );
                let text = format!("Maintenance request received (Priority: {}).", priority);
                (
                    "MAINTENANCE_STATUS_CHANGED",
                    subject,
                    html,
                    text,
                    "tenant@guri24.co.ke".to_string(),
                    "Tenant".to_string(),
                    "TENANT",
                    format!("idem:maint:{}", request_id),
                )
            }
            _ => return Ok(()), // Non-notifiable events
        };

        // 2. Duplicate Suppression & Idempotency check
        {
            let store = self.deliveries.read().map_err(|e| e.to_string())?;
            if store.iter().any(|d| d.organization_id == org_id && d.idempotency_key == idem_key) {
                tracing::info!(idempotency_key = %idem_key, "Suppressed duplicate email notification");
                return Ok(());
            }
        }

        // 3. Dispatch via configured Resend Email Adapter
        let mut delivery = NotificationDelivery {
            id: Uuid::new_v4(),
            organization_id: org_id,
            recipient_email: recipient_email.clone(),
            recipient_name,
            recipient_role: recipient_role.to_string(),
            template_key: template_key.to_string(),
            subject: subject.clone(),
            body_html: body_html.clone(),
            body_text,
            status: DeliveryStatus::Queued,
            provider: "RESEND".to_string(),
            provider_message_id: None,
            error_message: None,
            retry_count: 0,
            max_retries: 3,
            idempotency_key: idem_key,
            related_entity_type: None,
            related_entity_id: None,
            sent_at: None,
            delivered_at: None,
            created_at: now,
        };

        match self.email_adapter.send_email(&recipient_email, &subject, &body_html) {
            Ok(msg_id) => {
                delivery.status = DeliveryStatus::Sent;
                delivery.provider_message_id = Some(msg_id);
                delivery.sent_at = Some(Utc::now());
            }
            Err(err) => {
                delivery.status = DeliveryStatus::Failed;
                delivery.error_message = Some(err.to_string());
                delivery.retry_count = 1;
            }
        }

        // 4. Record delivery in audit ledger
        if let Ok(mut store) = self.deliveries.write() {
            store.push(delivery);
        }

        Ok(())
    }
}

impl NotificationServiceTrait for CentralizedNotificationService {
    fn get_settings(&self, ctx: &TenantContext) -> AppResult<NotificationSettings> {
        let store = self.settings.read().map_err(|e| AppError::Internal(e.to_string()))?;
        if let Some(s) = store.iter().find(|s| s.organization_id == ctx.organization_id) {
            Ok(s.clone())
        } else {
            let mut s = NotificationSettings::default();
            s.organization_id = ctx.organization_id;
            Ok(s)
        }
    }

    fn update_settings(
        &self,
        ctx: &TenantContext,
        cmd: UpdateNotificationSettingsCommand,
    ) -> AppResult<NotificationSettings> {
        ctx.require_permission("notifications.settings")?;
        let mut store = self.settings.write().map_err(|e| AppError::Internal(e.to_string()))?;
        let mut settings = if let Some(pos) = store.iter().position(|s| s.organization_id == ctx.organization_id) {
            store.remove(pos)
        } else {
            let mut s = NotificationSettings::default();
            s.organization_id = ctx.organization_id;
            s
        };

        if let Some(r) = cmd.rent_reminder_days_before {
            settings.rent_reminder_days_before = r;
        }
        if let Some(d) = cmd.rent_due_date_reminder {
            settings.rent_due_date_reminder = d;
        }
        if let Some(od) = cmd.overdue_reminder_days {
            settings.overdue_reminder_days = od;
        }
        if let Some(le) = cmd.lease_expiry_days {
            settings.lease_expiry_days = le;
        }
        if let Some(dc) = cmd.daily_collection_summary {
            settings.daily_collection_summary = dc;
        }
        if let Some(se) = cmd.staff_escalation_emails {
            settings.staff_escalation_emails = se;
        }
        if let Some(tz) = cmd.timezone {
            settings.timezone = tz;
        }
        if let Some(ef) = cmd.email_from {
            settings.email_from = ef;
        }
        settings.updated_at = Utc::now();
        store.push(settings.clone());
        Ok(settings)
    }

    fn list_deliveries(&self, ctx: &TenantContext) -> AppResult<Vec<NotificationDelivery>> {
        ctx.require_permission("notifications.view")?;
        let store = self.deliveries.read().map_err(|e| AppError::Internal(e.to_string()))?;
        Ok(store
            .iter()
            .filter(|d| d.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn retry_delivery(&self, ctx: &TenantContext, delivery_id: Uuid) -> AppResult<NotificationDelivery> {
        ctx.require_permission("notifications.manage")?;
        let mut store = self.deliveries.write().map_err(|e| AppError::Internal(e.to_string()))?;
        let item = store
            .iter_mut()
            .find(|d| d.id == delivery_id && d.organization_id == ctx.organization_id)
            .ok_or_else(|| AppError::NotFound("Delivery record not found".to_string()))?;

        if item.status == DeliveryStatus::Sent || item.status == DeliveryStatus::Delivered {
            return Err(AppError::Conflict("Email has already been delivered".to_string()));
        }

        item.retry_count += 1;
        match self.email_adapter.send_email(&item.recipient_email, &item.subject, &item.body_html) {
            Ok(msg_id) => {
                item.status = DeliveryStatus::Sent;
                item.provider_message_id = Some(msg_id);
                item.error_message = None;
                item.sent_at = Some(Utc::now());
            }
            Err(e) => {
                item.status = DeliveryStatus::Failed;
                item.error_message = Some(e.to_string());
            }
        }

        Ok(item.clone())
    }

    fn send_test_email(&self, ctx: &TenantContext, cmd: SendTestEmailCommand) -> AppResult<NotificationDelivery> {
        ctx.require_permission("notifications.manage")?;
        let now = Utc::now();
        let (subject, body_html) = if cmd.template_key == "ACCOUNT_APPROVED" {
            (
                "Your Guri24 RMS account has been approved!".to_string(),
                render_account_approved_email(&cmd.recipient_email, "https://guri24rms.co.ke"),
            )
        } else {
            (
                format!("Test Delivery: [{}] &bull; Guri24 RMS", cmd.template_key),
                render_notification_email_template(
                    &cmd.recipient_email,
                    "Notification Engine Verification Test",
                    "This is an automated test email validating that your configured Resend API integration and transactional outbox are operational in Africa/Nairobi.",
                    Some("Open Guri24 RMS"),
                    None,
                ),
            )
        };

        let mut delivery = NotificationDelivery {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            recipient_email: cmd.recipient_email.clone(),
            recipient_name: "Test Administrator".to_string(),
            recipient_role: "ADMIN".to_string(),
            template_key: cmd.template_key,
            subject: subject.clone(),
            body_html: body_html.clone(),
            body_text: "Automated test notification from Guri24 RMS.".to_string(),
            status: DeliveryStatus::Queued,
            provider: "RESEND".to_string(),
            provider_message_id: None,
            error_message: None,
            retry_count: 0,
            max_retries: 3,
            idempotency_key: format!("test:{}:{}", ctx.organization_id, now.timestamp_millis()),
            related_entity_type: None,
            related_entity_id: None,
            sent_at: None,
            delivered_at: None,
            created_at: now,
        };

        match self.email_adapter.send_email(&cmd.recipient_email, &subject, &body_html) {
            Ok(msg_id) => {
                delivery.status = DeliveryStatus::Sent;
                delivery.provider_message_id = Some(msg_id);
                delivery.sent_at = Some(Utc::now());
            }
            Err(e) => {
                delivery.status = DeliveryStatus::Failed;
                delivery.error_message = Some(e.to_string());
            }
        }

        let mut store = self.deliveries.write().map_err(|e| AppError::Internal(e.to_string()))?;
        store.push(delivery.clone());
        Ok(delivery)
    }

    fn list_templates(&self, _ctx: &TenantContext) -> AppResult<Vec<NotificationTemplateSummary>> {
        Ok(vec![
            NotificationTemplateSummary {
                key: "ACCOUNT_VERIFICATION".to_string(),
                title: "One-Time Account Verification Code".to_string(),
                category: "SYSTEM".to_string(),
                is_mandatory: true,
                sample_subject: "Account verification & access code".to_string(),
            },
            NotificationTemplateSummary {
                key: "INVOICE_ISSUED".to_string(),
                title: "Monthly Rent Invoice".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: true,
                sample_subject: "Rent Invoice INV-2026-001 — November 2026".to_string(),
            },
            NotificationTemplateSummary {
                key: "ACCOUNT_APPROVED".to_string(),
                title: "Account Approved & Welcome Notification".to_string(),
                category: "ONBOARDING".to_string(),
                is_mandatory: true,
                sample_subject: "Hi Filippo, your Guri24 RMS account has been approved!".to_string(),
            },
            NotificationTemplateSummary {
                key: "PAYMENT_VERIFIED".to_string(),
                title: "Verified Rent Payment Receipt".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: true,
                sample_subject: "Verified Payment Receipt — RCT-99201KL (KES 15,000.00)".to_string(),
            },
            NotificationTemplateSummary {
                key: "RENT_REMINDER".to_string(),
                title: "Upcoming Rent Due Reminder".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: false,
                sample_subject: "Friendly Reminder: Rent Due in 7 Days".to_string(),
            },
            NotificationTemplateSummary {
                key: "OVERDUE_RENT_NOTICE".to_string(),
                title: "Notice of Overdue Rent Balance".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: true,
                sample_subject: "Notice of Overdue Rent Balance — KES 15,000.00".to_string(),
            },
            NotificationTemplateSummary {
                key: "DEPOSIT_RECEIVED".to_string(),
                title: "Security Deposit Acknowledgment (Account 2100)".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: true,
                sample_subject: "Security Deposit Held in Liability — KES 35,000.00".to_string(),
            },
            NotificationTemplateSummary {
                key: "REFUND_VERIFIED".to_string(),
                title: "Move-Out Security Deposit Refund Disbursed".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: true,
                sample_subject: "Deposit Move-Out Refund Completed — KES 28,000.00".to_string(),
            },
            NotificationTemplateSummary {
                key: "RECONCILIATION_EXCEPTION".to_string(),
                title: "Staff Alert: Bank/M-Pesa Discrepancy Flagged".to_string(),
                category: "STAFF".to_string(),
                is_mandatory: true,
                sample_subject: "Staff Alert: Reconciliation Exception [AMOUNT_MISMATCH]".to_string(),
            },
            NotificationTemplateSummary {
                key: "MAINTENANCE_STATUS_CHANGED".to_string(),
                title: "Maintenance Ticket Status Update".to_string(),
                category: "TENANT".to_string(),
                is_mandatory: false,
                sample_subject: "Maintenance Ticket Logged &bull; Priority: HIGH".to_string(),
            },
        ])
    }
}

/// Transactional outbox observer hooking into DomainEvent bus
pub struct AutomatedEmailNotificationObserver {
    service: Arc<CentralizedNotificationService>,
}

impl AutomatedEmailNotificationObserver {
    pub fn new(service: Arc<CentralizedNotificationService>) -> Self {
        Self { service }
    }
}

impl DomainEventObserver for AutomatedEmailNotificationObserver {
    fn name(&self) -> &'static str {
        "AutomatedEmailNotificationObserver"
    }

    fn on_event(&self, event: &DomainEvent) -> Result<(), String> {
        self.service.process_domain_event(event)
    }
}
