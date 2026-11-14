use std::sync::Arc;
use axum::{
    extract::{Path, Query, State},
    http::{header, HeaderMap, StatusCode},
    middleware,
    response::IntoResponse,
    routing::{get, patch, post},
    Json, Router,
};
use serde::Serialize;
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

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
        accounting::{JournalEntry, PropertyExpense, RecordExpenseCommand},
        assistant::{
            AssistantActionConfirmation, AssistantChatCommand, AssistantConversation,
            AssistantMessage, ConfirmAssistantActionCommand,
        },
        auth::{AuthSessionResponse, LoginCommand, RefreshTokenCommand},
        billing::{GenerateInvoiceCommand, Invoice},
        deposits::{DeductOrRefundDepositCommand, ReceiveDepositCommand, SecurityDepositLedger},
        documents::{DocumentRecord, RegisterDocumentCommand},
        leases::{
            CreateLeaseCommand, Lease, RenewLeaseCommand, TerminateLeaseCommand,
        },
        maintenance::{
            MaintenanceRequest, SubmitMaintenanceCommand, TransitionMaintenanceCommand,
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
        .route("/reports/export.csv", get(export_portfolio_csv_handler));

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
    Json(cmd): Json<InitiateMpesaPaymentCommand>,
) -> AppResult<(StatusCode, Json<Payment>)> {
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
    Path(id): Path<Uuid>,
) -> AppResult<Json<OcrJobRecord>> {
    let job = state.repositories.ocr.get_job(&ctx, id)?;
    Ok(Json(job))
}

async fn review_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
    Json(cmd): Json<ReviewOcrJobCommand>,
) -> AppResult<Json<OcrJobRecord>> {
    let job = state.repositories.ocr.review_job(&ctx, id, cmd)?;
    Ok(Json(job))
}

async fn retry_ocr_job_handler(
    State(state): State<Arc<AppState>>,
    ctx: TenantContext,
    Path(id): Path<Uuid>,
) -> AppResult<Json<OcrJobRecord>> {
    let job = state.repositories.ocr.retry_job(&ctx, id)?;
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
