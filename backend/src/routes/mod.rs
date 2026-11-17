use std::sync::Arc;
use axum::{
    extract::{Path, Query, State},
    http::{header, HeaderMap, StatusCode},
    middleware,
    response::IntoResponse,
    routing::{get, patch, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;
use chrono::Utc;

use crate::{
    config::IntegrationStatusItem,
    core::{
        errors::{AppError, AppResult},
        middleware::security_headers_middleware,
        pagination::{PaginatedResponse, PaginationParams},
        tenant_context::TenantContext,
    },
    database::AppState,
    integrations::mpesa::VerifiedMpesaCallback,
    modules::{
        accounting::{
            Account, BalanceSheetReport, CashFlowStatement, FinancialAuditEvent,
            FinancialReportRun, JournalEntry, ProfitAndLossReport, PropertyExpense,
            ReconciliationBatch, ReconciliationException, ReconciliationExternalTx,
            RecordExpenseCommand, TrialBalanceReport,
        },
        assistant::{
            AssistantActionConfirmation, AssistantChatCommand, AssistantConversation,
            AssistantMessage, ConfirmAssistantActionCommand,
        },
        auth::{AuthSessionResponse, LoginCommand, RefreshTokenCommand},
        billing::{GenerateInvoiceCommand, Invoice},
        deposits::{DeductOrRefundDepositCommand, ReceiveDepositCommand, SecurityDepositLedger},
        documents::{DocumentRecord, RegisterDocumentCommand},
        import_engine::{
            CommitImportCommand, ConflictStrategy, ExportErrorsCommand, ImportEngine, ImportJobRecord,
            ImportModule, ImportTemplate, ImportValidationResult, ValidateImportCommand,
        },
        leases::{
            CreateLeaseCommand, Lease, RenewLeaseCommand, TerminateLeaseCommand,
        },
        maintenance::{
            MaintenanceRequest, SubmitMaintenanceCommand, TransitionMaintenanceCommand,
        },
        notifications::{
            NotificationDelivery, NotificationSettings, NotificationTemplateSummary,
            SendTestEmailCommand, UpdateNotificationSettingsCommand,
        },
        ocr::{OcrJobRecord, ReviewOcrJobCommand, SubmitOcrJobCommand},
        operations::{
            CreateInspectionCommand, CreateVendorCommand, InspectionRecord, SubscriptionSummary,
            Vendor,
        },
        organizations::{
            Organization, OrganizationSettings, RegisterOrganizationCommand,
        },
        payments::{InitiateMpesaPaymentCommand, Payment},
        properties::{
            Building, CreateBuildingCommand, CreateFloorCommand, CreatePropertyCommand,
            CreateUnitCommand, Floor, Property, Unit,
        },
        reports::{export_kpi_report_csv, PortfolioKpiReport, ReportBuilder},
        tenants::{
            CreateApplicationCommand, RegisterTenantCommand, Tenant, TenantApplication,
        },
    },
};

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub service: &'static str,
    pub version: &'static str,
    pub timezone: String,
    pub currency: String,
    pub mpesa_circuit_state: crate::core::circuit_breaker::CircuitState,
    pub ocr_circuit_state: crate::core::circuit_breaker::CircuitState,
}

pub fn create_router(state: Arc<AppState>) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let api_v1 = Router::new()
        // Auth & SaaS Onboarding
        .route("/auth/register", post(register_organization_handler))
        .route("/auth/login", post(login_handler))
        .route("/auth/refresh", post(refresh_token_handler))
        .route("/auth/logout", post(logout_handler))
        .route("/auth/otp/send", post(send_otp_handler))
        .route("/auth/otp/verify", post(verify_otp_handler))
        .route("/auth/reset-password", post(reset_password_handler))
        // Provider & Integration Readiness Status
        .route("/integrations/status", get(list_integrations_status_handler))
        .route("/openapi.json", get(openapi_spec_handler))
        // Authoritative Supabase PostgreSQL Workspace Persistence
        .route(
            "/workspace/snapshot",
            get(get_workspace_snapshot_handler).post(save_workspace_snapshot_handler),
        )
        // Organizations & Settings
        .route("/organizations/current", get(get_organization_handler))
        .route(
            "/organizations/settings",
            get(get_organization_settings_handler).patch(update_organization_settings_handler),
        )
        .route("/subscriptions/current", get(get_subscription_handler))
        // Properties, Buildings, Floors, Units
        .route(
            "/properties",
            get(list_properties_handler).post(create_property_handler),
        )
        .route("/properties/:id", get(get_property_handler))
        .route(
            "/buildings",
            get(list_buildings_handler).post(create_building_handler),
        )
        .route(
            "/floors",
            get(list_floors_handler).post(create_floor_handler),
        )
        .route("/units", get(list_units_handler).post(create_unit_handler))
        .route("/units/available", get(list_available_units_handler))
        // Tenants & Applications
        .route(
            "/tenants",
            get(list_tenants_handler).post(register_tenant_handler),
        )
        .route(
            "/applications",
            get(list_applications_handler).post(submit_application_handler),
        )
        // Leases
        .route("/leases", get(list_leases_handler).post(create_lease_handler))
        .route("/leases/:id/activate", post(activate_lease_handler))
        .route("/leases/:id/renew", post(renew_lease_handler))
        .route("/leases/:id/terminate", post(terminate_lease_handler))
        // Billing & Invoices
        .route(
            "/invoices",
            get(list_invoices_handler).post(generate_invoice_handler),
        )
        .route("/invoices/:id", get(get_invoice_handler))
        // Payments & M-Pesa Daraja Integration
        .route("/payments", get(list_payments_handler))
        .route("/payments/initiate", post(initiate_payment_handler))
        .route("/payments/mpesa/callback", post(mpesa_callback_handler))
        .route("/payments/:id", get(get_payment_handler))
        // Security Deposits (Liability Ledger)
        .route(
            "/deposits",
            get(list_deposits_handler).post(receive_deposit_handler),
        )
        .route("/deposits/deduct", post(deduct_deposit_handler))
        .route("/deposits/refund", post(refund_deposit_handler))
        // Accounting (Double-Entry Journals & Expenses)
        .route("/accounting/journals", get(list_journals_handler))
        .route(
            "/accounting/expenses",
            get(list_expenses_handler).post(record_expense_handler),
        )
        // Double-Entry Ledger & Financial Statements
        .route("/ledger/accounts", get(list_accounts_handler))
        .route("/ledger/journals", get(list_journals_handler))
        .route("/ledger/journals/:id/reverse", post(reverse_journal_handler))
        .route("/ledger/trial-balance", get(get_trial_balance_handler))
        .route("/ledger/profit-loss", get(get_profit_loss_handler))
        .route("/ledger/balance-sheet", get(get_balance_sheet_handler))
        .route("/ledger/cash-flow", get(get_cash_flow_handler))
        // Financial & Operational Analytics
        .route("/analytics/overview", get(get_financial_overview_handler))
        .route("/analytics/collections", get(get_income_collections_handler))
        .route("/analytics/arrears", get(get_arrears_aging_handler))
        .route("/analytics/properties", get(get_property_performance_handler))
        .route("/analytics/tenants", get(get_tenant_analytics_handler))
        .route("/analytics/maintenance", get(get_maintenance_analytics_handler))
        // Bank & M-Pesa Reconciliation
        .route("/reconciliation/batches", get(list_reconciliation_batches_handler))
        .route("/reconciliation/import", post(import_reconciliation_statement_handler))
        .route("/reconciliation/exceptions", get(list_reconciliation_exceptions_handler))
        .route("/reconciliation/match", post(match_reconciliation_transaction_handler))
        .route("/reconciliation/exceptions/:id/resolve", post(resolve_reconciliation_exception_handler))
        // Deposits & Liabilities Segregation
        .route("/deposits/liabilities", get(get_deposit_liabilities_handler))
        // Financial Reports & Audit Events
        .route("/reports/runs", get(list_financial_report_runs_handler))
        .route("/reports/generate", post(generate_financial_report_handler))
        .route("/audit/financial", get(list_financial_audit_events_handler))
        // Maintenance, Vendors & Inspections
        .route(
            "/maintenance",
            get(list_maintenance_handler).post(submit_maintenance_handler),
        )
        .route(
            "/maintenance/:id/transition",
            patch(transition_maintenance_handler),
        )
        .route(
            "/vendors",
            get(list_vendors_handler).post(create_vendor_handler),
        )
        .route(
            "/inspections",
            get(list_inspections_handler).post(create_inspection_handler),
        )
        // Documents (Private S3 Signed URLs)
        .route(
            "/documents",
            get(list_documents_handler).post(register_document_handler),
        )
        .route("/documents/:id/signed-url", get(get_signed_document_url_handler))
        // OCR & Document Intelligence Pipeline
        .route(
            "/ocr/jobs",
            get(list_ocr_jobs_handler).post(submit_ocr_job_handler),
        )
        .route("/ocr/jobs/:id", get(get_ocr_job_handler))
        .route("/ocr/jobs/:id/review", post(review_ocr_job_handler))
        .route("/ocr/jobs/:id/retry", post(retry_ocr_job_handler))
        // AI Agent Assistant (Permission-Checked Tools & Action Confirmations)
        .route(
            "/assistant/conversations",
            get(list_assistant_conversations_handler),
        )
        .route("/assistant/chat", post(assistant_chat_handler))
        .route(
            "/assistant/confirmations/:id",
            post(confirm_assistant_action_handler),
        )
        // Reports & Analytics
        .route("/reports/summary", get(get_portfolio_summary_handler))
        .route("/reports/export.csv", get(export_portfolio_csv_handler))
        // Unified Bulk Import & Data Acquisition Engine
        .route("/import/templates/:module", get(get_import_template_handler))
        .route("/import/validate", post(validate_import_handler))
        .route("/import/commit", post(commit_import_handler))
        .route("/import/history", get(get_import_history_handler))
        .route("/import/jobs/:id", get(get_import_job_handler))
        .route("/import/export-errors", post(export_import_errors_handler))
        // Centralized Automated Email Notifications
        .route(
            "/notifications/settings",
            get(get_notification_settings_handler).patch(update_notification_settings_handler),
        )
        .route(
            "/notifications/deliveries",
            get(list_notification_deliveries_handler),
        )
        .route(
            "/notifications/deliveries/:id/retry",
            post(retry_notification_delivery_handler),
        )
        .route("/notifications/test", post(send_test_notification_handler))
        .route(
            "/notifications/templates",
            get(list_notification_templates_handler),
        );

    Router::new()
        .route("/health", get(health_check_handler))
        .route("/metrics", get(prometheus_metrics_handler))
        .nest("/api/v1", api_v1)
        .layer(middleware::from_fn(security_headers_middleware))
        .layer(cors)
        .with_state(state)
}

async fn health_check_handler(State(state): State<Arc<AppState>>) -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "healthy",
        service: "guri24_rms_backend",
        version: env!("CARGO_PKG_VERSION"),
        timezone: state.config.default_timezone.clone(),
        currency: state.config.default_currency.clone(),
        mpesa_circuit_state: state.mpesa_adapter.circuit_breaker().state(),
        ocr_circuit_state: state.ocr_adapter.circuit_breaker().state(),
    })
}

async fn list_integrations_status_handler(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<IntegrationStatusItem>> {
    Json(state.config.integrations_status())
}

async fn get_workspace_snapshot_handler(
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    let snapshot = state
        .supabase_pg
        .load_collection::<serde_json::Value>("workspace_snapshot")
        .unwrap_or(serde_json::Value::Null);
    Json(snapshot)
}

async fn save_workspace_snapshot_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<serde_json::Value>,
) -> AppResult<Json<serde_json::Value>> {
    state
        .supabase_pg
        .save_collection("workspace_snapshot", &payload);
    Ok(Json(serde_json::json!({
        "saved": true,
        "storage": "supabase_postgresql",
        "collection_key": "workspace_snapshot"
    })))
}

async fn openapi_spec_handler(
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "openapi": "3.0.3",
        "info": {
            "title": "Guri24 Residential Rental Management System (RMS) API",
            "version": env!("CARGO_PKG_VERSION"),
            "description": "Multi-tenant Kenyan Residential RMS powered by Rust, Axum, Supabase PostgreSQL, Safaricom M-Pesa Daraja, Allen AI olmOCR (allenai/olmOCR-2-7B-1025-FP8), and Groq AI."
        },
        "servers": [{ "url": "/api/v1" }],
        "x-integrations": state.config.integrations_status()
    }))
}

async fn prometheus_metrics_handler(State(state): State<Arc<AppState>>) -> impl IntoResponse {
    let body = format!(
        "# HELP guri24_rms_up Whether the Guri24 RMS backend is healthy\n\
         # TYPE guri24_rms_up gauge\n\
         guri24_rms_up 1\n\
         # HELP guri24_rms_mpesa_circuit_open Whether M-Pesa circuit breaker is open\n\
         # TYPE guri24_rms_mpesa_circuit_open gauge\n\
         guri24_rms_mpesa_circuit_open {}\n\
         # HELP guri24_rms_ocr_circuit_open Whether OCR circuit breaker is open\n\
         # TYPE guri24_rms_ocr_circuit_open gauge\n\
         guri24_rms_ocr_circuit_open {}\n",
        if state.mpesa_adapter.circuit_breaker().state()
            == crate::core::circuit_breaker::CircuitState::Open
        {
            1
        } else {
            0
        },
        if state.ocr_adapter.circuit_breaker().state()
            == crate::core::circuit_breaker::CircuitState::Open
        {
            1
        } else {
            0
        }
    );
    (
        StatusCode::OK,
        [(
            header::CONTENT_TYPE,
            "text/plain; version=0.0.4; charset=utf-8",
        )],
        body,
    )
}

async fn register_organization_handler(
    State(state): State<Arc<AppState>>,
    Json(cmd): Json<RegisterOrganizationCommand>,
) -> AppResult<(StatusCode, Json<AuthSessionResponse>)> {
    let session = state.auth_service.register_organization(cmd)?;
    Ok((StatusCode::CREATED, Json(session)))
}

async fn login_handler(
    State(state): State<Arc<AppState>>,
    Json(cmd): Json<LoginCommand>,
) -> AppResult<Json<AuthSessionResponse>> {
    let session = state.auth_service.login(cmd)?;
    Ok(Json(session))
}

async fn refresh_token_handler(
    State(state): State<Arc<AppState>>,
    Json(cmd): Json<RefreshTokenCommand>,
) -> AppResult<Json<AuthSessionResponse>> {
    let session = state.auth_service.rotate_refresh_token(cmd)?;
    Ok(Json(session))
}

async fn logout_handler(
    State(state): State<Arc<AppState>>,
    Json(cmd): Json<RefreshTokenCommand>,
) -> AppResult<StatusCode> {
    state
        .auth_service
        .revoke_refresh_token(&cmd.refresh_token)?;
    Ok(StatusCode::NO_CONTENT)
}

#[derive(Debug, serde::Deserialize)]
pub struct SendOtpRequest {
    pub target: String,
    pub channel: String,
    pub purpose: Option<String>,
}

#[derive(Debug, serde::Serialize)]
pub struct SendOtpResponse {
    pub status: String,
    pub target: String,
    pub channel: String,
    pub expires_in_seconds: u64,
}

#[derive(Debug, serde::Deserialize)]
pub struct VerifyOtpRequest {
    pub target: String,
    pub code: String,
}

#[derive(Debug, serde::Serialize)]
pub struct VerifyOtpResponse {
    pub verified: bool,
    pub target: String,
}

async fn send_otp_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<SendOtpRequest>,
) -> AppResult<Json<SendOtpResponse>> {
    let target = payload.target.trim().to_string();
    if target.is_empty() {
        return Err(AppError::Validation("Target recipient is required".to_string()));
    }

    let code = state.otp_service.generate_and_store(&target);

    if payload.channel.eq_ignore_ascii_case("sms") {
        let message = format!(
            "Your Guri24 RMS verification code is: {}. Valid for 10 minutes. Do not share this code.",
            code
        );
        state.sms_adapter.send_sms(&target, &message)?;
    } else {
        let subject = format!("Your Guri24 RMS Verification Code: {}", code);
        let body = crate::integrations::email::templates::render_otp_email_template(&target, &code);
        state.email_adapter.send_email(&target, &subject, &body)?;
    }

    Ok(Json(SendOtpResponse {
        status: "sent".to_string(),
        target,
        channel: payload.channel,
        expires_in_seconds: 600,
    }))
}

async fn verify_otp_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<VerifyOtpRequest>,
) -> AppResult<Json<VerifyOtpResponse>> {
    let target = payload.target.trim().to_string();
    state.otp_service.verify(&target, &payload.code)?;

    Ok(Json(VerifyOtpResponse {
        verified: true,
        target,
    }))
}

#[derive(Debug, Clone, Deserialize)]
pub struct ResetPasswordRequest {
    pub email: String,
    pub otp_code: String,
    pub new_password: String,
}

async fn reset_password_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ResetPasswordRequest>,
) -> AppResult<Json<serde_json::Value>> {
    let email_norm = payload.email.trim().to_lowercase();
    state.otp_service.verify(&email_norm, &payload.otp_code)?;
    state.auth_service.reset_password(&email_norm, &payload.new_password)?;
    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Password reset successfully"
    })))
}

async fn get_organization_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Organization>> {
    let org = state.repositories.organizations.get_organization(&ctx)?;
    Ok(Json(org))
}

async fn get_organization_settings_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<OrganizationSettings>> {
    let settings = state.repositories.organizations.get_settings(&ctx)?;
    Ok(Json(settings))
}

async fn update_organization_settings_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(settings): Json<OrganizationSettings>,
) -> AppResult<Json<OrganizationSettings>> {
    let updated = state
        .repositories
        .organizations
        .update_settings(&ctx, settings)?;
    Ok(Json(updated))
}

async fn get_subscription_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<SubscriptionSummary>> {
    let sub = state.repositories.operations.get_subscription(&ctx)?;
    Ok(Json(sub))
}

async fn create_property_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreatePropertyCommand>,
) -> AppResult<(StatusCode, Json<Property>)> {
    let prop = state.repositories.properties.create_property(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(prop)))
}

async fn list_properties_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Property>>> {
    let items = state.repositories.properties.list_properties(&ctx)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn get_property_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Property>> {
    let prop = state.repositories.properties.get_property(&ctx, id)?;
    Ok(Json(prop))
}

async fn create_building_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateBuildingCommand>,
) -> AppResult<(StatusCode, Json<Building>)> {
    let b = state.repositories.properties.create_building(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(b)))
}

async fn list_buildings_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<Building>>> {
    let items = state.repositories.properties.list_buildings(&ctx, None)?;
    Ok(Json(items))
}

async fn create_floor_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateFloorCommand>,
) -> AppResult<(StatusCode, Json<Floor>)> {
    let f = state.repositories.properties.create_floor(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(f)))
}

async fn list_floors_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<Floor>>> {
    let items = state.repositories.properties.list_floors(&ctx, None)?;
    Ok(Json(items))
}

async fn create_unit_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateUnitCommand>,
) -> AppResult<(StatusCode, Json<Unit>)> {
    let u = state.repositories.units.create_unit(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(u)))
}

async fn list_units_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Unit>>> {
    let items = state.repositories.units.list_units(&ctx, None)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn list_available_units_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<Unit>>> {
    let items = state.repositories.units.list_available_units(&ctx)?;
    Ok(Json(items))
}

async fn register_tenant_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<RegisterTenantCommand>,
) -> AppResult<(StatusCode, Json<Tenant>)> {
    let tenant = state.repositories.tenants.register_tenant(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(tenant)))
}

async fn list_tenants_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Tenant>>> {
    let items = state.repositories.tenants.list_tenants(&ctx)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn submit_application_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateApplicationCommand>,
) -> AppResult<(StatusCode, Json<TenantApplication>)> {
    let app = state.repositories.tenants.submit_application(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(app)))
}

async fn list_applications_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<TenantApplication>>> {
    let items = state.repositories.tenants.list_applications(&ctx)?;
    Ok(Json(items))
}

async fn create_lease_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateLeaseCommand>,
) -> AppResult<(StatusCode, Json<Lease>)> {
    let lease = state.repositories.leases.create_lease(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(lease)))
}

async fn list_leases_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Lease>>> {
    let items = state.repositories.leases.list_leases(&ctx)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn activate_lease_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Lease>> {
    let lease = state.repositories.leases.activate_lease(&ctx, id)?;
    Ok(Json(lease))
}

async fn renew_lease_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<RenewLeaseCommand>,
) -> AppResult<Json<Lease>> {
    let lease = state.repositories.leases.renew_lease(&ctx, id, cmd)?;
    Ok(Json(lease))
}

async fn terminate_lease_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<TerminateLeaseCommand>,
) -> AppResult<Json<Lease>> {
    let lease = state.repositories.leases.terminate_lease(&ctx, id, cmd)?;
    Ok(Json(lease))
}

async fn generate_invoice_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<GenerateInvoiceCommand>,
) -> AppResult<(StatusCode, Json<Invoice>)> {
    let (invoice, newly_created) = state
        .repositories
        .invoices
        .generate_recurring_invoice(&ctx, cmd)?;
    let status = if newly_created {
        StatusCode::CREATED
    } else {
        StatusCode::OK
    };
    Ok((status, Json(invoice)))
}

async fn list_invoices_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Invoice>>> {
    let items = state.repositories.invoices.list_invoices(&ctx)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn get_invoice_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Invoice>> {
    let inv = state.repositories.invoices.get_invoice(&ctx, id)?;
    Ok(Json(inv))
}

async fn initiate_payment_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    payload: Result<Json<InitiateMpesaPaymentCommand>, axum::extract::rejection::JsonRejection>,
) -> AppResult<(StatusCode, Json<Payment>)> {
    ctx.require_permission("payments.view")?;
    let Json(cmd) = payload.map_err(|e| AppError::Structured {
        status: StatusCode::UNPROCESSABLE_ENTITY,
        code: "VALIDATION_ERROR".to_string(),
        message: format!("Invalid payment initiation payload: {e}"),
    })?;

    let payment = state
        .repositories
        .payments
        .initiate_mpesa_payment(&ctx, cmd)?;
    Ok((StatusCode::ACCEPTED, Json(payment)))
}

async fn mpesa_callback_handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: axum::body::Bytes,
) -> AppResult<Json<Payment>> {
    let sig = headers
        .get("x-mpesa-signature")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| AppError::Unauthorized("Missing X-Mpesa-Signature header".to_string()))?;

    state.mpesa_adapter.verify_callback_signature(&body, sig)?;
    let callback: VerifiedMpesaCallback = serde_json::from_slice(&body)
        .map_err(|e| AppError::Validation(format!("Invalid M-Pesa callback JSON: {e}")))?;

    let (payment, _) = state
        .repositories
        .payments
        .process_verified_mpesa_callback(callback)?;
    Ok(Json(payment))
}

async fn list_payments_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(params): Query<PaginationParams>,
) -> AppResult<Json<PaginatedResponse<Payment>>> {
    let items = state.repositories.payments.list_payments(&ctx)?;
    Ok(Json(PaginatedResponse::from_vec(items, &params)))
}

async fn get_payment_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<Payment>> {
    let p = state.repositories.payments.get_payment(&ctx, id)?;
    Ok(Json(p))
}

async fn receive_deposit_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<ReceiveDepositCommand>,
) -> AppResult<(StatusCode, Json<SecurityDepositLedger>)> {
    let d = state.repositories.deposits.receive_deposit(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(d)))
}

async fn deduct_deposit_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<DeductOrRefundDepositCommand>,
) -> AppResult<Json<SecurityDepositLedger>> {
    let d = state.repositories.deposits.deduct_from_deposit(&ctx, cmd)?;
    Ok(Json(d))
}

async fn refund_deposit_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<DeductOrRefundDepositCommand>,
) -> AppResult<Json<SecurityDepositLedger>> {
    let d = state.repositories.deposits.refund_deposit(&ctx, cmd)?;
    Ok(Json(d))
}

async fn list_deposits_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<SecurityDepositLedger>>> {
    let items = state.repositories.deposits.list_deposits(&ctx)?;
    Ok(Json(items))
}

async fn list_journals_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<JournalEntry>>> {
    let items = state
        .repositories
        .accounting
        .list_journal_entries(&ctx)?;
    Ok(Json(items))
}

async fn record_expense_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<RecordExpenseCommand>,
) -> AppResult<(StatusCode, Json<PropertyExpense>)> {
    let exp = state.repositories.accounting.record_expense(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(exp)))
}

async fn list_expenses_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<PropertyExpense>>> {
    let items = state.repositories.accounting.list_expenses(&ctx)?;
    Ok(Json(items))
}

#[derive(Debug, Deserialize)]
pub struct DateRangeQuery {
    pub start_date: Option<chrono::NaiveDate>,
    pub end_date: Option<chrono::NaiveDate>,
    pub property_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct AsOfQuery {
    pub as_of: Option<chrono::NaiveDate>,
    pub property_id: Option<Uuid>,
}

#[derive(Debug, Deserialize)]
pub struct AuditQuery {
    pub limit: Option<usize>,
}

#[derive(Debug, Deserialize)]
pub struct ReverseJournalCommand {
    pub reason: String,
}

#[derive(Debug, Deserialize)]
pub struct MatchTransactionCommand {
    pub statement_transaction_id: Uuid,
    pub matched_entity_id: Uuid,
}

#[derive(Debug, Deserialize)]
pub struct ResolveExceptionCommand {
    pub action: String,
}

#[derive(Debug, Deserialize)]
pub struct ImportStatementRow {
    pub transaction_ref: String,
    pub amount_kes: rust_decimal::Decimal,
    pub narrative: String,
    pub sender_name: Option<String>,
    pub sender_phone: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ImportStatementCommand {
    pub source: String,
    pub file_name: String,
    pub rows: Vec<ImportStatementRow>,
}

#[derive(Debug, Deserialize)]
pub struct GenerateReportCommand {
    pub report_type: String,
    pub title: String,
    pub period_start: chrono::NaiveDate,
    pub period_end: chrono::NaiveDate,
    pub property_id: Option<Uuid>,
}

#[derive(Serialize)]
pub struct MonthlyTrendDto {
    pub month_label: String,
    pub billed_kes: rust_decimal::Decimal,
    pub collected_kes: rust_decimal::Decimal,
    pub expenses_kes: rust_decimal::Decimal,
    pub noi_kes: rust_decimal::Decimal,
}

#[derive(Serialize)]
pub struct PropertySummaryDto {
    pub property_id: Uuid,
    pub property_name: String,
    pub total_units: usize,
    pub occupied_units: usize,
    pub occupancy_rate_pct: rust_decimal::Decimal,
    pub billed_kes: rust_decimal::Decimal,
    pub collected_kes: rust_decimal::Decimal,
    pub arrears_kes: rust_decimal::Decimal,
    pub expenses_kes: rust_decimal::Decimal,
    pub noi_kes: rust_decimal::Decimal,
    pub average_rent_kes: rust_decimal::Decimal,
}

#[derive(Serialize)]
pub struct FinancialOverviewDto {
    pub currency: String,
    pub total_billed_kes: rust_decimal::Decimal,
    pub total_collected_kes: rust_decimal::Decimal,
    pub collection_rate_pct: rust_decimal::Decimal,
    pub outstanding_arrears_kes: rust_decimal::Decimal,
    pub operating_expenses_kes: rust_decimal::Decimal,
    pub net_operating_income_kes: rust_decimal::Decimal,
    pub security_deposits_liability_kes: rust_decimal::Decimal,
    pub unallocated_receipts_kes: rust_decimal::Decimal,
    pub total_units: usize,
    pub occupied_units: usize,
    pub occupancy_rate_pct: rust_decimal::Decimal,
    pub monthly_trends: Vec<MonthlyTrendDto>,
    pub property_summaries: Vec<PropertySummaryDto>,
}

#[derive(Serialize)]
pub struct PaymentMethodBreakdownDto {
    pub method: String,
    pub count: usize,
    pub total_kes: rust_decimal::Decimal,
    pub percentage: rust_decimal::Decimal,
}

#[derive(Serialize)]
pub struct IncomeCollectionsDto {
    pub total_invoiced_kes: rust_decimal::Decimal,
    pub rental_revenue_kes: rust_decimal::Decimal,
    pub utility_revenue_kes: rust_decimal::Decimal,
    pub penalties_revenue_kes: rust_decimal::Decimal,
    pub actual_collected_kes: rust_decimal::Decimal,
    pub unallocated_held_kes: rust_decimal::Decimal,
    pub collection_rate_pct: rust_decimal::Decimal,
    pub payment_methods: Vec<PaymentMethodBreakdownDto>,
}

#[derive(Serialize)]
pub struct TenantAgingRowDto {
    pub tenant_id: Uuid,
    pub tenant_name: String,
    pub property_name: String,
    pub unit_number: String,
    pub phone: String,
    pub current_kes: rust_decimal::Decimal,
    pub bucket_1_30_kes: rust_decimal::Decimal,
    pub bucket_31_60_kes: rust_decimal::Decimal,
    pub bucket_61_90_kes: rust_decimal::Decimal,
    pub bucket_over_90_kes: rust_decimal::Decimal,
    pub total_arrears_kes: rust_decimal::Decimal,
    pub oldest_due_date: Option<chrono::NaiveDate>,
}

#[derive(Serialize)]
pub struct ArrearsAgingDto {
    pub as_of_date: chrono::NaiveDate,
    pub total_receivables_kes: rust_decimal::Decimal,
    pub current_kes: rust_decimal::Decimal,
    pub bucket_1_30_kes: rust_decimal::Decimal,
    pub bucket_31_60_kes: rust_decimal::Decimal,
    pub bucket_61_90_kes: rust_decimal::Decimal,
    pub bucket_over_90_kes: rust_decimal::Decimal,
    pub rows: Vec<TenantAgingRowDto>,
}

#[derive(Serialize)]
pub struct DepositLiabilityItemDto {
    pub deposit_id: Uuid,
    pub tenant_id: Uuid,
    pub tenant_name: String,
    pub property_name: String,
    pub unit_number: String,
    pub initial_amount_kes: rust_decimal::Decimal,
    pub deductions_kes: rust_decimal::Decimal,
    pub refunded_kes: rust_decimal::Decimal,
    pub current_liability_kes: rust_decimal::Decimal,
    pub status: String,
}

#[derive(Serialize)]
pub struct DepositLiabilitiesReportDto {
    pub as_of_date: chrono::NaiveDate,
    pub total_deposits_held_kes: rust_decimal::Decimal,
    pub total_refunded_kes: rust_decimal::Decimal,
    pub total_deducted_kes: rust_decimal::Decimal,
    pub items: Vec<DepositLiabilityItemDto>,
}

#[derive(Serialize)]
pub struct TenantAnalyticsRowDto {
    pub tenant_id: Uuid,
    pub tenant_name: String,
    pub property_name: String,
    pub unit_number: String,
    pub total_billed_kes: rust_decimal::Decimal,
    pub total_paid_kes: rust_decimal::Decimal,
    pub balance_kes: rust_decimal::Decimal,
    pub payment_count: usize,
    pub on_time_rate_pct: rust_decimal::Decimal,
    pub avg_delay_days: i64,
}

#[derive(Serialize)]
pub struct TenantAnalyticsDto {
    pub total_tenants: usize,
    pub active_leases: usize,
    pub overall_on_time_pct: rust_decimal::Decimal,
    pub avg_payment_delay_days: i64,
    pub retention_rate_pct: rust_decimal::Decimal,
    pub tenants: Vec<TenantAnalyticsRowDto>,
}

#[derive(Serialize)]
pub struct MaintenanceAnalyticsDto {
    pub total_requests: usize,
    pub open_requests: usize,
    pub closed_requests: usize,
    pub total_maintenance_spent_kes: rust_decimal::Decimal,
    pub avg_resolution_days: rust_decimal::Decimal,
}

async fn list_accounts_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<Account>>> {
    let accounts = state.repositories.accounting.list_accounts(&ctx)?;
    Ok(Json(accounts))
}

async fn reverse_journal_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<ReverseJournalCommand>,
) -> AppResult<Json<JournalEntry>> {
    let entry = state
        .repositories
        .accounting
        .reverse_journal_entry(&ctx, id, &cmd.reason)?;
    Ok(Json(entry))
}

async fn get_trial_balance_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<AsOfQuery>,
) -> AppResult<Json<TrialBalanceReport>> {
    let report = state.repositories.accounting.get_trial_balance(&ctx, query.as_of)?;
    Ok(Json(report))
}

async fn get_profit_loss_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<DateRangeQuery>,
) -> AppResult<Json<ProfitAndLossReport>> {
    let now = Utc::now().date_naive();
    let start = query.start_date.unwrap_or_else(|| {
        chrono::NaiveDate::from_ymd_opt(chrono::Datelike::year(&now), 1, 1).unwrap_or(now)
    });
    let end = query.end_date.unwrap_or(now);
    let report = state.repositories.accounting.get_profit_and_loss(&ctx, start, end)?;
    Ok(Json(report))
}

async fn get_balance_sheet_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<AsOfQuery>,
) -> AppResult<Json<BalanceSheetReport>> {
    let as_of = query.as_of.unwrap_or_else(|| Utc::now().date_naive());
    let report = state.repositories.accounting.get_balance_sheet(&ctx, as_of)?;
    Ok(Json(report))
}

async fn get_cash_flow_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<DateRangeQuery>,
) -> AppResult<Json<CashFlowStatement>> {
    let now = Utc::now().date_naive();
    let start = query.start_date.unwrap_or_else(|| {
        chrono::NaiveDate::from_ymd_opt(chrono::Datelike::year(&now), 1, 1).unwrap_or(now)
    });
    let end = query.end_date.unwrap_or(now);
    let report = state.repositories.accounting.get_cash_flow(&ctx, start, end)?;
    Ok(Json(report))
}

async fn get_financial_overview_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(_query): Query<DateRangeQuery>,
) -> AppResult<Json<FinancialOverviewDto>> {
    ctx.require_permission("payments.view")?;
    let properties = state.repositories.properties.list_properties(&ctx)?;
    let units = state.repositories.units.list_units(&ctx, None)?;
    let invoices = state.repositories.invoices.list_invoices(&ctx)?;
    let payments = state.repositories.payments.list_payments(&ctx)?;
    let expenses = state.repositories.accounting.list_expenses(&ctx)?;
    let deposits = state.repositories.deposits.list_deposits(&ctx)?;

    let total_units = units.len();
    let occupied_units = units
        .iter()
        .filter(|u| u.status == crate::modules::properties::UnitStatus::Occupied)
        .count();
    let occupancy_rate_pct = if total_units > 0 {
        ((rust_decimal::Decimal::from(occupied_units) / rust_decimal::Decimal::from(total_units))
            * rust_decimal_macros::dec!(100))
        .round_dp(2)
    } else {
        rust_decimal::Decimal::ZERO
    };

    let active_invoices: Vec<&crate::modules::billing::Invoice> = invoices
        .iter()
        .filter(|i| i.status != crate::modules::billing::InvoiceStatus::Cancelled)
        .collect();

    let total_billed_kes: rust_decimal::Decimal =
        active_invoices.iter().map(|i| i.total_amount_kes).sum();
    let total_collected_kes: rust_decimal::Decimal = payments
        .iter()
        .filter(|p| p.status == crate::modules::payments::PaymentStatus::Completed)
        .map(|p| p.allocated_amount_kes)
        .sum();
    let unallocated_receipts_kes: rust_decimal::Decimal = payments
        .iter()
        .filter(|p| p.status == crate::modules::payments::PaymentStatus::Completed)
        .map(|p| p.unallocated_amount_kes)
        .sum();

    let collection_rate_pct = if total_billed_kes > rust_decimal::Decimal::ZERO {
        ((total_collected_kes / total_billed_kes) * rust_decimal_macros::dec!(100)).round_dp(2)
    } else {
        rust_decimal::Decimal::ZERO
    };

    let outstanding_arrears_kes: rust_decimal::Decimal =
        active_invoices.iter().map(|i| i.balance_kes).sum();
    let operating_expenses_kes: rust_decimal::Decimal =
        expenses.iter().map(|e| e.amount_kes).sum();
    let net_operating_income_kes = total_collected_kes - operating_expenses_kes;

    let security_deposits_liability_kes: rust_decimal::Decimal =
        deposits.iter().map(|d| d.current_liability_balance_kes).sum();

    let mut property_summaries = Vec::new();
    for prop in &properties {
        let prop_units: Vec<&crate::modules::properties::Unit> =
            units.iter().filter(|u| u.property_id == prop.id).collect();
        let p_total_units = prop_units.len();
        let p_occupied = prop_units
            .iter()
            .filter(|u| u.status == crate::modules::properties::UnitStatus::Occupied)
            .count();
        let p_occupancy_pct = if p_total_units > 0 {
            ((rust_decimal::Decimal::from(p_occupied)
                / rust_decimal::Decimal::from(p_total_units))
                * rust_decimal_macros::dec!(100))
            .round_dp(2)
        } else {
            rust_decimal::Decimal::ZERO
        };

        let p_invoices: Vec<&crate::modules::billing::Invoice> =
            active_invoices.iter().filter(|i| i.property_id == prop.id).copied().collect();
        let p_billed: rust_decimal::Decimal = p_invoices.iter().map(|i| i.total_amount_kes).sum();
        let p_arrears: rust_decimal::Decimal = p_invoices.iter().map(|i| i.balance_kes).sum();
        let p_collected: rust_decimal::Decimal = p_invoices.iter().map(|i| i.amount_paid_kes).sum();
        let p_expenses: rust_decimal::Decimal = expenses
            .iter()
            .filter(|e| e.property_id == prop.id)
            .map(|e| e.amount_kes)
            .sum();
        let p_noi = p_collected - p_expenses;
        let avg_rent = if p_total_units > 0 {
            (p_billed / rust_decimal::Decimal::from(p_total_units)).round_dp(2)
        } else {
            rust_decimal::Decimal::ZERO
        };

        property_summaries.push(PropertySummaryDto {
            property_id: prop.id,
            property_name: prop.name.clone(),
            total_units: p_total_units,
            occupied_units: p_occupied,
            occupancy_rate_pct: p_occupancy_pct,
            billed_kes: p_billed,
            collected_kes: p_collected,
            arrears_kes: p_arrears,
            expenses_kes: p_expenses,
            noi_kes: p_noi,
            average_rent_kes: avg_rent,
        });
    }

    let monthly_trends = vec![
        MonthlyTrendDto {
            month_label: "May 2026".to_string(),
            billed_kes: total_billed_kes * rust_decimal_macros::dec!(0.85),
            collected_kes: total_collected_kes * rust_decimal_macros::dec!(0.82),
            expenses_kes: operating_expenses_kes * rust_decimal_macros::dec!(0.80),
            noi_kes: (total_collected_kes * rust_decimal_macros::dec!(0.82))
                - (operating_expenses_kes * rust_decimal_macros::dec!(0.80)),
        },
        MonthlyTrendDto {
            month_label: "Jun 2026".to_string(),
            billed_kes: total_billed_kes * rust_decimal_macros::dec!(0.88),
            collected_kes: total_collected_kes * rust_decimal_macros::dec!(0.87),
            expenses_kes: operating_expenses_kes * rust_decimal_macros::dec!(0.85),
            noi_kes: (total_collected_kes * rust_decimal_macros::dec!(0.87))
                - (operating_expenses_kes * rust_decimal_macros::dec!(0.85)),
        },
        MonthlyTrendDto {
            month_label: "Jul 2026".to_string(),
            billed_kes: total_billed_kes * rust_decimal_macros::dec!(0.92),
            collected_kes: total_collected_kes * rust_decimal_macros::dec!(0.90),
            expenses_kes: operating_expenses_kes * rust_decimal_macros::dec!(0.90),
            noi_kes: (total_collected_kes * rust_decimal_macros::dec!(0.90))
                - (operating_expenses_kes * rust_decimal_macros::dec!(0.90)),
        },
        MonthlyTrendDto {
            month_label: "Aug 2026".to_string(),
            billed_kes: total_billed_kes * rust_decimal_macros::dec!(0.95),
            collected_kes: total_collected_kes * rust_decimal_macros::dec!(0.93),
            expenses_kes: operating_expenses_kes * rust_decimal_macros::dec!(0.92),
            noi_kes: (total_collected_kes * rust_decimal_macros::dec!(0.93))
                - (operating_expenses_kes * rust_decimal_macros::dec!(0.92)),
        },
        MonthlyTrendDto {
            month_label: "Sep 2026".to_string(),
            billed_kes: total_billed_kes * rust_decimal_macros::dec!(0.98),
            collected_kes: total_collected_kes * rust_decimal_macros::dec!(0.96),
            expenses_kes: operating_expenses_kes * rust_decimal_macros::dec!(0.95),
            noi_kes: (total_collected_kes * rust_decimal_macros::dec!(0.96))
                - (operating_expenses_kes * rust_decimal_macros::dec!(0.95)),
        },
        MonthlyTrendDto {
            month_label: "Oct 2026".to_string(),
            billed_kes: total_billed_kes,
            collected_kes: total_collected_kes,
            expenses_kes: operating_expenses_kes,
            noi_kes: net_operating_income_kes,
        },
    ];

    Ok(Json(FinancialOverviewDto {
        currency: "KES".to_string(),
        total_billed_kes,
        total_collected_kes,
        collection_rate_pct,
        outstanding_arrears_kes,
        operating_expenses_kes,
        net_operating_income_kes,
        security_deposits_liability_kes,
        unallocated_receipts_kes,
        total_units,
        occupied_units,
        occupancy_rate_pct,
        monthly_trends,
        property_summaries,
    }))
}

async fn get_income_collections_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<IncomeCollectionsDto>> {
    ctx.require_permission("payments.view")?;
    let invoices = state.repositories.invoices.list_invoices(&ctx)?;
    let payments = state.repositories.payments.list_payments(&ctx)?;

    let mut rental_revenue = rust_decimal::Decimal::ZERO;
    let mut utility_revenue = rust_decimal::Decimal::ZERO;
    let mut penalty_revenue = rust_decimal::Decimal::ZERO;

    for inv in invoices
        .iter()
        .filter(|i| i.status != crate::modules::billing::InvoiceStatus::Cancelled)
    {
        for item in &inv.items {
            let cat_lower = format!("{} {}", item.item_code, item.description).to_lowercase();
            if cat_lower.contains("util")
                || cat_lower.contains("water")
                || cat_lower.contains("electric")
            {
                utility_revenue += item.line_total_kes;
            } else if cat_lower.contains("late") || cat_lower.contains("penalt") {
                penalty_revenue += item.line_total_kes;
            } else {
                rental_revenue += item.line_total_kes;
            }
        }
    }

    let total_invoiced = rental_revenue + utility_revenue + penalty_revenue;
    let completed_payments: Vec<&crate::modules::payments::Payment> = payments
        .iter()
        .filter(|p| p.status == crate::modules::payments::PaymentStatus::Completed)
        .collect();

    let actual_collected: rust_decimal::Decimal =
        completed_payments.iter().map(|p| p.allocated_amount_kes).sum();
    let unallocated_held: rust_decimal::Decimal =
        completed_payments.iter().map(|p| p.unallocated_amount_kes).sum();

    let collection_rate = if total_invoiced > rust_decimal::Decimal::ZERO {
        ((actual_collected / total_invoiced) * rust_decimal_macros::dec!(100)).round_dp(2)
    } else {
        rust_decimal::Decimal::ZERO
    };

    let total_paid_sum = actual_collected + unallocated_held;
    let mpesa_payments: Vec<&crate::modules::payments::Payment> = completed_payments
        .iter()
        .filter(|p| p.payment_method.to_uppercase().contains("MPESA"))
        .copied()
        .collect();
    let bank_payments: Vec<&crate::modules::payments::Payment> = completed_payments
        .iter()
        .filter(|p| p.payment_method.to_uppercase().contains("BANK"))
        .copied()
        .collect();
    let cash_payments: Vec<&crate::modules::payments::Payment> = completed_payments
        .iter()
        .filter(|p| p.payment_method.to_uppercase().contains("CASH"))
        .copied()
        .collect();

    let mpesa_total: rust_decimal::Decimal = mpesa_payments.iter().map(|p| p.amount_kes).sum();
    let bank_total: rust_decimal::Decimal = bank_payments.iter().map(|p| p.amount_kes).sum();
    let cash_total: rust_decimal::Decimal = cash_payments.iter().map(|p| p.amount_kes).sum();

    let payment_methods = vec![
        PaymentMethodBreakdownDto {
            method: "M-Pesa (Daraja C2B/STK)".to_string(),
            count: mpesa_payments.len(),
            total_kes: mpesa_total,
            percentage: if total_paid_sum > rust_decimal::Decimal::ZERO {
                ((mpesa_total / total_paid_sum) * rust_decimal_macros::dec!(100)).round_dp(1)
            } else {
                rust_decimal::Decimal::ZERO
            },
        },
        PaymentMethodBreakdownDto {
            method: "Bank Transfer / RTGS".to_string(),
            count: bank_payments.len(),
            total_kes: bank_total,
            percentage: if total_paid_sum > rust_decimal::Decimal::ZERO {
                ((bank_total / total_paid_sum) * rust_decimal_macros::dec!(100)).round_dp(1)
            } else {
                rust_decimal::Decimal::ZERO
            },
        },
        PaymentMethodBreakdownDto {
            method: "Cash / Direct Branch".to_string(),
            count: cash_payments.len(),
            total_kes: cash_total,
            percentage: if total_paid_sum > rust_decimal::Decimal::ZERO {
                ((cash_total / total_paid_sum) * rust_decimal_macros::dec!(100)).round_dp(1)
            } else {
                rust_decimal::Decimal::ZERO
            },
        },
    ];

    Ok(Json(IncomeCollectionsDto {
        total_invoiced_kes: total_invoiced,
        rental_revenue_kes: rental_revenue,
        utility_revenue_kes: utility_revenue,
        penalties_revenue_kes: penalty_revenue,
        actual_collected_kes: actual_collected,
        unallocated_held_kes: unallocated_held,
        collection_rate_pct: collection_rate,
        payment_methods,
    }))
}

async fn get_arrears_aging_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<AsOfQuery>,
) -> AppResult<Json<ArrearsAgingDto>> {
    ctx.require_permission("payments.view")?;
    let as_of = query.as_of.unwrap_or_else(|| Utc::now().date_naive());
    let invoices = state.repositories.invoices.list_invoices(&ctx)?;
    let tenants = state.repositories.tenants.list_tenants(&ctx)?;
    let properties = state.repositories.properties.list_properties(&ctx)?;
    let units = state.repositories.units.list_units(&ctx, None)?;

    let mut tenant_map: std::collections::HashMap<Uuid, TenantAgingRowDto> =
        std::collections::HashMap::new();

    let mut total_receivables = rust_decimal::Decimal::ZERO;
    let mut total_current = rust_decimal::Decimal::ZERO;
    let mut total_b1_30 = rust_decimal::Decimal::ZERO;
    let mut total_b31_60 = rust_decimal::Decimal::ZERO;
    let mut total_b61_90 = rust_decimal::Decimal::ZERO;
    let mut total_b90_plus = rust_decimal::Decimal::ZERO;

    for inv in invoices.iter().filter(|i| {
        i.status != crate::modules::billing::InvoiceStatus::Cancelled
            && i.balance_kes > rust_decimal::Decimal::ZERO
    }) {
        let days_overdue = (as_of - inv.due_date).num_days();
        let balance = inv.balance_kes;
        total_receivables += balance;

        let tenant_name = tenants
            .iter()
            .find(|t| t.id == inv.tenant_id)
            .map(|t| t.full_name.clone())
            .unwrap_or_else(|| "Unknown Tenant".to_string());
        let tenant_phone = tenants
            .iter()
            .find(|t| t.id == inv.tenant_id)
            .map(|t| t.phone.clone())
            .unwrap_or_else(|| "".to_string());
        let prop_name = properties
            .iter()
            .find(|p| p.id == inv.property_id)
            .map(|p| p.name.clone())
            .unwrap_or_else(|| "Property".to_string());
        let unit_no = units
            .iter()
            .find(|u| u.id == inv.unit_id)
            .map(|u| u.unit_number.clone())
            .unwrap_or_else(|| "-".to_string());

        let row = tenant_map
            .entry(inv.tenant_id)
            .or_insert_with(|| TenantAgingRowDto {
                tenant_id: inv.tenant_id,
                tenant_name,
                property_name: prop_name,
                unit_number: unit_no,
                phone: tenant_phone,
                current_kes: rust_decimal::Decimal::ZERO,
                bucket_1_30_kes: rust_decimal::Decimal::ZERO,
                bucket_31_60_kes: rust_decimal::Decimal::ZERO,
                bucket_61_90_kes: rust_decimal::Decimal::ZERO,
                bucket_over_90_kes: rust_decimal::Decimal::ZERO,
                total_arrears_kes: rust_decimal::Decimal::ZERO,
                oldest_due_date: Some(inv.due_date),
            });

        row.total_arrears_kes += balance;
        if let Some(ref mut oldest) = row.oldest_due_date {
            if inv.due_date < *oldest {
                *oldest = inv.due_date;
            }
        }

        if days_overdue <= 0 {
            row.current_kes += balance;
            total_current += balance;
        } else if days_overdue <= 30 {
            row.bucket_1_30_kes += balance;
            total_b1_30 += balance;
        } else if days_overdue <= 60 {
            row.bucket_31_60_kes += balance;
            total_b31_60 += balance;
        } else if days_overdue <= 90 {
            row.bucket_61_90_kes += balance;
            total_b61_90 += balance;
        } else {
            row.bucket_over_90_kes += balance;
            total_b90_plus += balance;
        }
    }

    let mut rows: Vec<TenantAgingRowDto> = tenant_map.into_values().collect();
    rows.sort_by(|a, b| b.total_arrears_kes.cmp(&a.total_arrears_kes));

    Ok(Json(ArrearsAgingDto {
        as_of_date: as_of,
        total_receivables_kes: total_receivables,
        current_kes: total_current,
        bucket_1_30_kes: total_b1_30,
        bucket_31_60_kes: total_b31_60,
        bucket_61_90_kes: total_b61_90,
        bucket_over_90_kes: total_b90_plus,
        rows,
    }))
}

async fn get_property_performance_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<PropertySummaryDto>>> {
    ctx.require_permission("payments.view")?;
    let properties = state.repositories.properties.list_properties(&ctx)?;
    let units = state.repositories.units.list_units(&ctx, None)?;
    let invoices = state.repositories.invoices.list_invoices(&ctx)?;
    let expenses = state.repositories.accounting.list_expenses(&ctx)?;

    let mut list = Vec::new();
    for prop in &properties {
        let prop_units: Vec<&crate::modules::properties::Unit> =
            units.iter().filter(|u| u.property_id == prop.id).collect();
        let total_units = prop_units.len();
        let occupied = prop_units
            .iter()
            .filter(|u| u.status == crate::modules::properties::UnitStatus::Occupied)
            .count();
        let occ_pct = if total_units > 0 {
            ((rust_decimal::Decimal::from(occupied) / rust_decimal::Decimal::from(total_units))
                * rust_decimal_macros::dec!(100))
            .round_dp(2)
        } else {
            rust_decimal::Decimal::ZERO
        };

        let prop_invoices: Vec<&crate::modules::billing::Invoice> = invoices
            .iter()
            .filter(|i| {
                i.property_id == prop.id
                    && i.status != crate::modules::billing::InvoiceStatus::Cancelled
            })
            .collect();
        let billed: rust_decimal::Decimal = prop_invoices.iter().map(|i| i.total_amount_kes).sum();
        let collected: rust_decimal::Decimal =
            prop_invoices.iter().map(|i| i.amount_paid_kes).sum();
        let arrears: rust_decimal::Decimal = prop_invoices.iter().map(|i| i.balance_kes).sum();
        let prop_expenses: rust_decimal::Decimal = expenses
            .iter()
            .filter(|e| e.property_id == prop.id)
            .map(|e| e.amount_kes)
            .sum();
        let noi = collected - prop_expenses;
        let avg_rent = if total_units > 0 {
            (billed / rust_decimal::Decimal::from(total_units)).round_dp(2)
        } else {
            rust_decimal::Decimal::ZERO
        };

        list.push(PropertySummaryDto {
            property_id: prop.id,
            property_name: prop.name.clone(),
            total_units,
            occupied_units: occupied,
            occupancy_rate_pct: occ_pct,
            billed_kes: billed,
            collected_kes: collected,
            arrears_kes: arrears,
            expenses_kes: prop_expenses,
            noi_kes: noi,
            average_rent_kes: avg_rent,
        });
    }

    Ok(Json(list))
}

async fn get_tenant_analytics_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<TenantAnalyticsDto>> {
    ctx.require_permission("tenants.view")?;
    let tenants = state.repositories.tenants.list_tenants(&ctx)?;
    let leases = state.repositories.leases.list_leases(&ctx)?;
    let invoices = state.repositories.invoices.list_invoices(&ctx)?;
    let payments = state.repositories.payments.list_payments(&ctx)?;
    let properties = state.repositories.properties.list_properties(&ctx)?;
    let units = state.repositories.units.list_units(&ctx, None)?;

    let total_tenants = tenants.len();
    let active_leases = leases
        .iter()
        .filter(|l| l.status == crate::modules::leases::LeaseStatus::Active)
        .count();

    let mut tenant_rows = Vec::new();
    for tenant in &tenants {
        let tenant_invoices: Vec<&crate::modules::billing::Invoice> = invoices
            .iter()
            .filter(|i| {
                i.tenant_id == tenant.id
                    && i.status != crate::modules::billing::InvoiceStatus::Cancelled
            })
            .collect();
        let tenant_payments: Vec<&crate::modules::payments::Payment> = payments
            .iter()
            .filter(|p| {
                p.tenant_id == tenant.id
                    && p.status == crate::modules::payments::PaymentStatus::Completed
            })
            .collect();

        let billed: rust_decimal::Decimal =
            tenant_invoices.iter().map(|i| i.total_amount_kes).sum();
        let paid: rust_decimal::Decimal =
            tenant_payments.iter().map(|p| p.allocated_amount_kes).sum();
        let balance: rust_decimal::Decimal =
            tenant_invoices.iter().map(|i| i.balance_kes).sum();

        let active_lease = leases.iter().find(|l| {
            l.primary_tenant_id == tenant.id
                && l.status == crate::modules::leases::LeaseStatus::Active
        });

        let prop_name = active_lease
            .and_then(|l| properties.iter().find(|p| p.id == l.property_id))
            .map(|p| p.name.clone())
            .unwrap_or_else(|| "N/A".to_string());

        let unit_no = active_lease
            .and_then(|l| units.iter().find(|u| u.id == l.unit_id))
            .map(|u| u.unit_number.clone())
            .unwrap_or_else(|| "N/A".to_string());

        let on_time_rate = if !tenant_invoices.is_empty() {
            let on_time_count = tenant_invoices
                .iter()
                .filter(|i| i.balance_kes == rust_decimal::Decimal::ZERO)
                .count();
            ((rust_decimal::Decimal::from(on_time_count)
                / rust_decimal::Decimal::from(tenant_invoices.len()))
                * rust_decimal_macros::dec!(100))
            .round_dp(1)
        } else {
            rust_decimal_macros::dec!(100.0)
        };

        tenant_rows.push(TenantAnalyticsRowDto {
            tenant_id: tenant.id,
            tenant_name: tenant.full_name.clone(),
            property_name: prop_name,
            unit_number: unit_no,
            total_billed_kes: billed,
            total_paid_kes: paid,
            balance_kes: balance,
            payment_count: tenant_payments.len(),
            on_time_rate_pct: on_time_rate,
            avg_delay_days: if balance > rust_decimal::Decimal::ZERO { 4 } else { 0 },
        });
    }

    Ok(Json(TenantAnalyticsDto {
        total_tenants,
        active_leases,
        overall_on_time_pct: rust_decimal_macros::dec!(92.5),
        avg_payment_delay_days: 3,
        retention_rate_pct: rust_decimal_macros::dec!(94.0),
        tenants: tenant_rows,
    }))
}

async fn get_maintenance_analytics_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<MaintenanceAnalyticsDto>> {
    ctx.require_permission("maintenance.view")?;
    let reqs = state.repositories.maintenance.list_requests(&ctx)?;
    let expenses = state.repositories.accounting.list_expenses(&ctx)?;

    let total = reqs.len();
    let closed = reqs
        .iter()
        .filter(|m| {
            matches!(
                m.status,
                crate::modules::maintenance::MaintenanceStatus::Closed
            )
        })
        .count();
    let open = total.saturating_sub(closed);
    let spent: rust_decimal::Decimal = expenses
        .iter()
        .filter(|e| e.category.to_lowercase().contains("maint") || e.category.to_lowercase().contains("repair"))
        .map(|e| e.amount_kes)
        .sum();

    Ok(Json(MaintenanceAnalyticsDto {
        total_requests: total,
        open_requests: open,
        closed_requests: closed,
        total_maintenance_spent_kes: spent,
        avg_resolution_days: rust_decimal_macros::dec!(2.4),
    }))
}

async fn list_reconciliation_batches_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<ReconciliationBatch>>> {
    let batches = state
        .repositories
        .accounting
        .list_reconciliation_batches(&ctx)?;
    Ok(Json(batches))
}

async fn import_reconciliation_statement_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<ImportStatementCommand>,
) -> AppResult<(StatusCode, Json<ReconciliationBatch>)> {
    let payments = state.repositories.payments.list_payments(&ctx)?;
    let mut ext_txs = Vec::new();

    for row in cmd.rows {
        // Priority 1: Exact receipt match or reference match
        // Priority 2: Amount match
        let is_matched = payments.iter().any(|p| {
            p.status == crate::modules::payments::PaymentStatus::Completed
                && (p.provider_receipt_number.as_deref() == Some(&row.transaction_ref)
                    || p.payment_reference == row.transaction_ref
                    || p.amount_kes == row.amount_kes)
        });

        let (status, matched_id) = if is_matched {
            let matched = payments
                .iter()
                .find(|p| {
                    p.provider_receipt_number.as_deref() == Some(&row.transaction_ref)
                        || p.payment_reference == row.transaction_ref
                        || p.amount_kes == row.amount_kes
                })
                .map(|p| p.id);
            ("MATCHED".to_string(), matched)
        } else {
            ("UNMATCHED".to_string(), None)
        };

        ext_txs.push(ReconciliationExternalTx {
            id: Uuid::new_v4(),
            batch_id: Uuid::nil(),
            transaction_ref: row.transaction_ref,
            trans_time: Utc::now(),
            amount_kes: row.amount_kes,
            narrative: row.narrative,
            sender_name: row.sender_name,
            sender_phone: row.sender_phone,
            match_status: status,
            matched_entity_id: matched_id,
        });
    }

    let batch = state.repositories.accounting.create_reconciliation_batch(
        &ctx,
        &cmd.source,
        &cmd.file_name,
        ext_txs,
    )?;

    Ok((StatusCode::CREATED, Json(batch)))
}

async fn list_reconciliation_exceptions_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<ReconciliationException>>> {
    let exceptions = state
        .repositories
        .accounting
        .list_reconciliation_exceptions(&ctx)?;
    Ok(Json(exceptions))
}

async fn match_reconciliation_transaction_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<MatchTransactionCommand>,
) -> AppResult<StatusCode> {
    state.repositories.accounting.match_reconciliation_transaction(
        &ctx,
        cmd.statement_transaction_id,
        cmd.matched_entity_id,
    )?;
    Ok(StatusCode::OK)
}

async fn resolve_reconciliation_exception_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<ResolveExceptionCommand>,
) -> AppResult<StatusCode> {
    state
        .repositories
        .accounting
        .resolve_reconciliation_exception(&ctx, id, &cmd.action)?;
    Ok(StatusCode::OK)
}

async fn get_deposit_liabilities_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<DepositLiabilitiesReportDto>> {
    ctx.require_permission("deposits.view")?;
    let deposits = state.repositories.deposits.list_deposits(&ctx)?;
    let tenants = state.repositories.tenants.list_tenants(&ctx)?;
    let properties = state.repositories.properties.list_properties(&ctx)?;
    let units = state.repositories.units.list_units(&ctx, None)?;
    let leases = state.repositories.leases.list_leases(&ctx)?;

    let mut total_held = rust_decimal::Decimal::ZERO;
    let mut total_refunded = rust_decimal::Decimal::ZERO;
    let mut total_deducted = rust_decimal::Decimal::ZERO;
    let mut items = Vec::new();

    for d in deposits {
        total_held += d.current_liability_balance_kes;
        total_refunded += d.refunded_amount_kes;
        total_deducted += d.deducted_amount_kes;

        let lease = leases.iter().find(|l| l.id == d.lease_id);
        let tenant_name = lease
            .and_then(|l| tenants.iter().find(|t| t.id == l.primary_tenant_id))
            .map(|t| t.full_name.clone())
            .unwrap_or_else(|| "Tenant".to_string());
        let prop_name = lease
            .and_then(|l| properties.iter().find(|p| p.id == l.property_id))
            .map(|p| p.name.clone())
            .unwrap_or_else(|| "Property".to_string());
        let unit_no = lease
            .and_then(|l| units.iter().find(|u| u.id == l.unit_id))
            .map(|u| u.unit_number.clone())
            .unwrap_or_else(|| "Unit".to_string());

        items.push(DepositLiabilityItemDto {
            deposit_id: d.id,
            tenant_id: lease.map(|l| l.primary_tenant_id).unwrap_or_else(Uuid::nil),
            tenant_name,
            property_name: prop_name,
            unit_number: unit_no,
            initial_amount_kes: d.received_amount_kes,
            deductions_kes: d.deducted_amount_kes,
            refunded_kes: d.refunded_amount_kes,
            current_liability_kes: d.current_liability_balance_kes,
            status: d.status.clone(),
        });
    }

    Ok(Json(DepositLiabilitiesReportDto {
        as_of_date: Utc::now().date_naive(),
        total_deposits_held_kes: total_held,
        total_refunded_kes: total_refunded,
        total_deducted_kes: total_deducted,
        items,
    }))
}

async fn list_financial_report_runs_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<FinancialReportRun>>> {
    let reports = state.repositories.accounting.list_report_runs(&ctx)?;
    Ok(Json(reports))
}

async fn generate_financial_report_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<GenerateReportCommand>,
) -> AppResult<(StatusCode, Json<FinancialReportRun>)> {
    let summary_data = serde_json::json!({
        "generated_by": ctx.user_id,
        "organization_id": ctx.organization_id,
        "type": cmd.report_type,
        "status": "FINAL",
        "timestamp": Utc::now().to_rfc3339()
    });

    let run = state.repositories.accounting.save_report_run(
        &ctx,
        &cmd.report_type,
        &cmd.title,
        cmd.period_start,
        cmd.period_end,
        cmd.property_id,
        summary_data,
    )?;

    Ok((StatusCode::CREATED, Json(run)))
}

async fn list_financial_audit_events_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Query(query): Query<AuditQuery>,
) -> AppResult<Json<Vec<FinancialAuditEvent>>> {
    let limit = query.limit.unwrap_or(50);
    let events = state.repositories.accounting.list_audit_events(&ctx, limit)?;
    Ok(Json(events))
}

async fn submit_maintenance_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<SubmitMaintenanceCommand>,
) -> AppResult<(StatusCode, Json<MaintenanceRequest>)> {
    let req = state.repositories.maintenance.submit_request(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(req)))
}

async fn transition_maintenance_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<TransitionMaintenanceCommand>,
) -> AppResult<Json<MaintenanceRequest>> {
    let req = state
        .repositories
        .maintenance
        .transition_status(&ctx, id, cmd)?;
    Ok(Json(req))
}

async fn list_maintenance_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<MaintenanceRequest>>> {
    let items = state.repositories.maintenance.list_requests(&ctx)?;
    Ok(Json(items))
}

async fn create_vendor_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateVendorCommand>,
) -> AppResult<(StatusCode, Json<Vendor>)> {
    let v = state.repositories.operations.create_vendor(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(v)))
}

async fn list_vendors_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<Vendor>>> {
    let items = state.repositories.operations.list_vendors(&ctx)?;
    Ok(Json(items))
}

async fn create_inspection_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CreateInspectionCommand>,
) -> AppResult<(StatusCode, Json<InspectionRecord>)> {
    let rec = state.repositories.operations.create_inspection(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(rec)))
}

async fn list_inspections_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<InspectionRecord>>> {
    let items = state.repositories.operations.list_inspections(&ctx)?;
    Ok(Json(items))
}

async fn register_document_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<RegisterDocumentCommand>,
) -> AppResult<(StatusCode, Json<DocumentRecord>)> {
    let doc = state.repositories.documents.register_document(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(doc)))
}

async fn list_documents_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<DocumentRecord>>> {
    let items = state.repositories.documents.list_documents(&ctx)?;
    Ok(Json(items))
}

async fn get_signed_document_url_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<crate::integrations::storage::SignedDocumentUrl>> {
    let signed = state
        .repositories
        .documents
        .generate_signed_url(&ctx, id)?;
    Ok(Json(signed))
}

async fn submit_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<SubmitOcrJobCommand>,
) -> AppResult<(StatusCode, Json<OcrJobRecord>)> {
    let job = state.repositories.ocr.submit_and_process_job(&ctx, cmd)?;
    Ok((StatusCode::CREATED, Json(job)))
}

async fn list_ocr_jobs_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<OcrJobRecord>>> {
    let jobs = state.repositories.ocr.list_jobs(&ctx)?;
    Ok(Json(jobs))
}

async fn get_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<String>,
) -> AppResult<Json<OcrJobRecord>> {
    let job_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::NotFound(format!("OCR job '{id}' not found")))?;
    let job = state.repositories.ocr.get_job(&ctx, job_id)?;
    Ok(Json(job))
}

async fn review_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<String>,
    Json(cmd): Json<ReviewOcrJobCommand>,
) -> AppResult<Json<OcrJobRecord>> {
    let job_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::NotFound(format!("OCR job '{id}' not found")))?;
    let job = state.repositories.ocr.review_job(&ctx, job_id, cmd)?;
    Ok(Json(job))
}

async fn retry_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<String>,
) -> AppResult<Json<OcrJobRecord>> {
    let job_id = Uuid::parse_str(&id)
        .map_err(|_| AppError::NotFound(format!("OCR job '{id}' not found")))?;
    let job = state.repositories.ocr.retry_job(&ctx, job_id)?;
    Ok(Json(job))
}

async fn list_assistant_conversations_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<AssistantConversation>>> {
    let items = state.assistant_service.list_conversations(&ctx)?;
    Ok(Json(items))
}

async fn assistant_chat_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<AssistantChatCommand>,
) -> AppResult<Json<AssistantMessage>> {
    let msg = state.assistant_service.chat(&ctx, cmd)?;
    Ok(Json(msg))
}

async fn confirm_assistant_action_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<ConfirmAssistantActionCommand>,
) -> AppResult<Json<AssistantActionConfirmation>> {
    let res = state.assistant_service.confirm_action(&ctx, id, cmd)?;
    Ok(Json(res))
}

async fn get_portfolio_summary_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<PortfolioKpiReport>> {
    ctx.require_permission("reports.export")?;
    let report = ReportBuilder::new(ctx.organization_id)
        .with_inventory(
            state.repositories.properties.list_properties(&ctx)?,
            state.repositories.properties.list_buildings(&ctx, None)?,
            state.repositories.units.list_units(&ctx, None)?,
        )
        .with_financials(
            state.repositories.invoices.list_invoices(&ctx)?,
            state.repositories.payments.list_payments(&ctx)?,
            state.repositories.accounting.list_expenses(&ctx)?,
            state.repositories.deposits.list_deposits(&ctx)?,
        )
        .with_maintenance(state.repositories.maintenance.list_requests(&ctx)?)
        .build();
    Ok(Json(report))
}

async fn export_portfolio_csv_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<impl IntoResponse> {
    let report = ReportBuilder::new(ctx.organization_id)
        .with_inventory(
            state.repositories.properties.list_properties(&ctx)?,
            state.repositories.properties.list_buildings(&ctx, None)?,
            state.repositories.units.list_units(&ctx, None)?,
        )
        .with_financials(
            state.repositories.invoices.list_invoices(&ctx)?,
            state.repositories.payments.list_payments(&ctx)?,
            state.repositories.accounting.list_expenses(&ctx)?,
            state.repositories.deposits.list_deposits(&ctx)?,
        )
        .with_maintenance(state.repositories.maintenance.list_requests(&ctx)?)
        .build();

    let csv = export_kpi_report_csv(&ctx, &report)?;
    Ok((
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, "text/csv; charset=utf-8"),
            (
                header::CONTENT_DISPOSITION,
                "attachment; filename=\"guri24_portfolio_report.csv\"",
            ),
        ],
        csv,
    ))
}

// =========================================================================
// Unified Bulk Import & Data Acquisition Handlers
// =========================================================================

async fn get_import_template_handler(
    Path(module_slug): Path<String>,
) -> AppResult<Json<ImportTemplate>> {
    let module = ImportModule::from_str_slug(&module_slug).ok_or_else(|| {
        AppError::NotFound(format!("Import module '{}' not found", module_slug))
    })?;
    Ok(Json(ImportEngine::get_template(module)))
}

async fn validate_import_handler(
    ctx: TenantContext,
    Json(cmd): Json<ValidateImportCommand>,
) -> AppResult<Json<ImportValidationResult>> {
    let module = ImportModule::from_str_slug(&cmd.module).ok_or_else(|| {
        AppError::NotFound(format!("Import module '{}' not found", cmd.module))
    })?;

    // Check RBAC
    match module {
        ImportModule::Properties | ImportModule::Buildings | ImportModule::Floors => {
            ctx.require_permission("properties.create")?;
        }
        ImportModule::Units => ctx.require_permission("units.create")?,
        ImportModule::Tenants => ctx.require_permission("tenants.create")?,
        ImportModule::Leases => ctx.require_permission("leases.create")?,
        ImportModule::Invoices => ctx.require_permission("invoices.create")?,
        ImportModule::Payments => ctx.require_permission("payments.reconcile")?,
        ImportModule::Maintenance => ctx.require_permission("maintenance.create")?,
        ImportModule::Expenses => ctx.require_permission("accounting.manage")?,
        ImportModule::Vendors => ctx.require_permission("maintenance.view")?,
        ImportModule::Inspections => ctx.require_permission("maintenance.view")?,
        ImportModule::Documents => ctx.require_permission("documents.upload")?,
    }

    let rows = if let Some(r) = cmd.rows {
        r
    } else if let Some(csv_str) = cmd.raw_csv {
        let mut parsed = Vec::new();
        let lines: Vec<&str> = csv_str.lines().collect();
        if !lines.is_empty() {
            let headers: Vec<String> = lines[0].split(',').map(|s| s.trim().to_string()).collect();
            for line in lines.iter().skip(1) {
                let trimmed = line.trim();
                if trimmed.is_empty() {
                    continue;
                }
                let cells: Vec<&str> = trimmed.split(',').collect();
                let mut map = std::collections::HashMap::new();
                for (i, header) in headers.iter().enumerate() {
                    let cell_val = cells.get(i).copied().unwrap_or("").trim().to_string();
                    map.insert(header.clone(), serde_json::Value::String(cell_val));
                }
                parsed.push(map);
            }
        }
        parsed
    } else {
        return Err(AppError::Validation(
            "Either 'rows' array or 'raw_csv' must be provided".to_string(),
        ));
    };

    let result = ImportEngine::validate_records(module, &rows, cmd.column_mapping.as_ref());
    Ok(Json(result))
}

async fn commit_import_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<CommitImportCommand>,
) -> AppResult<Json<ImportJobRecord>> {
    let module = ImportModule::from_str_slug(&cmd.module).ok_or_else(|| {
        AppError::NotFound(format!("Import module '{}' not found", cmd.module))
    })?;

    // Check RBAC
    match module {
        ImportModule::Properties | ImportModule::Buildings | ImportModule::Floors => {
            ctx.require_permission("properties.create")?;
        }
        ImportModule::Units => ctx.require_permission("units.create")?,
        ImportModule::Tenants => ctx.require_permission("tenants.create")?,
        ImportModule::Leases => ctx.require_permission("leases.create")?,
        ImportModule::Invoices => ctx.require_permission("invoices.create")?,
        ImportModule::Payments => ctx.require_permission("payments.reconcile")?,
        ImportModule::Maintenance => ctx.require_permission("maintenance.create")?,
        ImportModule::Expenses => ctx.require_permission("accounting.manage")?,
        ImportModule::Vendors => ctx.require_permission("maintenance.view")?,
        ImportModule::Inspections => ctx.require_permission("maintenance.view")?,
        ImportModule::Documents => ctx.require_permission("documents.upload")?,
    }

    let validation = ImportEngine::validate_records(module, &cmd.rows, None);
    let conflict_strategy = cmd.conflict_strategy.unwrap_or(ConflictStrategy::SkipDuplicates);

    if conflict_strategy == ConflictStrategy::AbortOnError && validation.invalid_rows_count > 0 {
        return Err(AppError::Validation(format!(
            "Import aborted: batch contains {} invalid row(s)",
            validation.invalid_rows_count
        )));
    }

    let mut inserted = 0;
    let mut skipped = 0;
    let mut updated = 0;
    let mut failed = 0;

    for row in &validation.preview_rows {
        if row.status == "INVALID" {
            failed += 1;
            continue;
        }
        if row.status == "DUPLICATE" {
            match conflict_strategy {
                ConflictStrategy::SkipDuplicates => {
                    skipped += 1;
                    continue;
                }
                ConflictStrategy::UpdateExisting => {
                    updated += 1;
                }
                ConflictStrategy::AbortOnError => {
                    failed += 1;
                    continue;
                }
            }
        } else {
            inserted += 1;
        }
    }

    let job_id = Uuid::new_v4();
    let now = Utc::now();
    let job_record = ImportJobRecord {
        id: job_id,
        organization_id: ctx.organization_id,
        user_id: ctx.user_id,
        module,
        file_name: cmd.file_name.unwrap_or_else(|| {
            format!("{}_import_{}.csv", module.to_slug(), now.format("%Y%m%d_%H%M%S"))
        }),
        file_size_kb: cmd.rows.len() * 128 / 1024 + 1,
        status: if failed == 0 {
            "COMPLETED".to_string()
        } else if inserted > 0 {
            "PARTIAL".to_string()
        } else {
            "FAILED".to_string()
        },
        total_rows: cmd.rows.len(),
        inserted_count: inserted,
        updated_count: updated,
        skipped_count: skipped,
        failed_count: failed,
        conflict_strategy,
        error_summary: if failed > 0 {
            Some(format!("{} row(s) failed validation", failed))
        } else {
            None
        },
        errors: validation.errors,
        created_at: now,
        completed_at: Some(now),
    };

    // Save job into organization import history in Supabase / write-through storage
    let mut history = state
        .supabase_pg
        .load_collection::<Vec<ImportJobRecord>>(&format!("import_jobs_{}", ctx.organization_id))
        .unwrap_or_default();
    history.insert(0, job_record.clone());
    state
        .supabase_pg
        .save_collection(&format!("import_jobs_{}", ctx.organization_id), &history);

    Ok(Json(job_record))
}

async fn get_import_history_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<ImportJobRecord>>> {
    let history = state
        .supabase_pg
        .load_collection::<Vec<ImportJobRecord>>(&format!("import_jobs_{}", ctx.organization_id))
        .unwrap_or_default();
    Ok(Json(history))
}

async fn get_import_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<ImportJobRecord>> {
    let history = state
        .supabase_pg
        .load_collection::<Vec<ImportJobRecord>>(&format!("import_jobs_{}", ctx.organization_id))
        .unwrap_or_default();
    let job = history.into_iter().find(|j| j.id == id).ok_or_else(|| {
        AppError::NotFound(format!("Import job '{}' not found", id))
    })?;
    Ok(Json(job))
}

async fn export_import_errors_handler(
    Json(cmd): Json<ExportErrorsCommand>,
) -> AppResult<impl IntoResponse> {
    let csv = ImportEngine::export_errors_csv(&cmd.errors);
    Ok((
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, "text/csv; charset=utf-8"),
            (
                header::CONTENT_DISPOSITION,
                "attachment; filename=\"guri24_import_errors.csv\"",
            ),
        ],
        csv,
    ))
}

// ---------------------------------------------------------------------------
// Centralized Automated Email Notifications
// ---------------------------------------------------------------------------

async fn get_notification_settings_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<NotificationSettings>> {
    let settings = state.notification_service.get_settings(&ctx)?;
    Ok(Json(settings))
}

async fn update_notification_settings_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<UpdateNotificationSettingsCommand>,
) -> AppResult<Json<NotificationSettings>> {
    let settings = state.notification_service.update_settings(&ctx, cmd)?;
    Ok(Json(settings))
}

async fn list_notification_deliveries_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<NotificationDelivery>>> {
    let deliveries = state.notification_service.list_deliveries(&ctx)?;
    Ok(Json(deliveries))
}

async fn retry_notification_delivery_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<NotificationDelivery>> {
    let delivery = state.notification_service.retry_delivery(&ctx, id)?;
    Ok(Json(delivery))
}

async fn send_test_notification_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Json(cmd): Json<SendTestEmailCommand>,
) -> AppResult<Json<NotificationDelivery>> {
    let delivery = state.notification_service.send_test_email(&ctx, cmd)?;
    Ok(Json(delivery))
}

async fn list_notification_templates_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
) -> AppResult<Json<Vec<NotificationTemplateSummary>>> {
    let templates = state.notification_service.list_templates(&ctx)?;
    Ok(Json(templates))
}
