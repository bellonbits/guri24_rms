use std::{sync::Arc, time::Duration};

use crate::{
    config::AppConfig,
    core::{
        events::{AuditLogObserver, EventBus, NotificationObserver},
        middleware::RateLimiterDecorator,
        security::TokenService,
    },
    integrations::{
        ai::AIAdapter, email::EmailAdapter, groq::GroqLlmAdapter, mpesa::MpesaAdapter,
        ocr::OcrProvider, sms::SmsAdapter, storage::StorageAdapter,
        supabase::SupabasePostgresAdapter, AIProviderFactory, GroqProviderFactory,
        NotificationProviderFactory, OcrProviderFactory, PaymentProviderFactory,
        StorageProviderFactory,
    },
    modules::{
        accounting::{AccountingRepository, InMemoryAccountingRepository},
        assistant::{AssistantServiceTrait, GroundedAssistantService},
        auth::{AuthService, OtpService},
        billing::{InMemoryInvoiceRepository, InvoiceRepository},
        deposits::{DepositRepository, InMemoryDepositRepository},
        documents::{DocumentRepository, InMemoryDocumentRepository},
        leases::{InMemoryLeaseRepository, LeaseRepository},
        maintenance::{InMemoryMaintenanceRepository, MaintenanceRepository},
        ocr::{InMemoryOcrRepository, OcrRepository},
        operations::{InMemoryOperationsRepository, OperationsRepository},
        organizations::{InMemoryOrganizationRepository, OrganizationRepository},
        payments::{InMemoryPaymentRepository, PaymentRepository},
        properties::{InMemoryPropertyUnitStore, PropertyRepository, UnitRepository},
        tenants::{InMemoryTenantRepository, TenantRepository},
        notifications::{
            AutomatedEmailNotificationObserver, CentralizedNotificationService,
            NotificationServiceTrait,
        },
    },
};

pub struct RepositoryRegistry {
    pub organizations: Arc<dyn OrganizationRepository>,
    pub properties: Arc<dyn PropertyRepository>,
    pub units: Arc<dyn UnitRepository>,
    pub tenants: Arc<dyn TenantRepository>,
    pub leases: Arc<dyn LeaseRepository>,
    pub invoices: Arc<dyn InvoiceRepository>,
    pub payments: Arc<dyn PaymentRepository>,
    pub deposits: Arc<dyn DepositRepository>,
    pub accounting: Arc<dyn AccountingRepository>,
    pub maintenance: Arc<dyn MaintenanceRepository>,
    pub documents: Arc<dyn DocumentRepository>,
    pub ocr: Arc<dyn OcrRepository>,
    pub operations: Arc<dyn OperationsRepository>,
}

/// Section 6: Singleton Pattern
/// Shared application-wide resources managed safely via `Arc<AppState>` without unsafe global mutability.
pub struct AppState {
    pub config: AppConfig,
    pub supabase_pg: SupabasePostgresAdapter,
    pub token_service: Arc<TokenService>,
    pub auth_service: Arc<AuthService>,
    pub otp_service: Arc<OtpService>,
    pub assistant_service: Arc<dyn AssistantServiceTrait>,
    pub notification_service: Arc<dyn NotificationServiceTrait>,
    pub event_bus: EventBus,
    pub audit_observer: Arc<AuditLogObserver>,
    pub notification_observer: Arc<NotificationObserver>,
    pub rate_limiter: RateLimiterDecorator,
    pub mpesa_adapter: Arc<dyn MpesaAdapter>,
    pub ocr_adapter: Arc<dyn OcrProvider>,
    pub groq_adapter: Arc<GroqLlmAdapter>,
    pub sms_adapter: Arc<dyn SmsAdapter>,
    pub email_adapter: Arc<dyn EmailAdapter>,
    pub storage_adapter: Arc<dyn StorageAdapter>,
    pub ai_adapter: Arc<dyn AIAdapter>,
    pub repositories: RepositoryRegistry,
}

impl AppState {
    pub fn new(config: AppConfig) -> Arc<Self> {
        let supabase_pg = SupabasePostgresAdapter::new(config.supabase_database_url.clone());
        supabase_pg.ensure_schema();

        let audit_observer = Arc::new(AuditLogObserver::new());
        let notification_observer = Arc::new(NotificationObserver::new());

        let token_service = Arc::new(TokenService::new(
            config.jwt_access_secret.clone(),
            config.jwt_refresh_secret.clone(),
            config.jwt_access_expiry_secs,
            config.jwt_refresh_expiry_secs,
        ));

        let mpesa_adapter = PaymentProviderFactory::create(&config);
        let ocr_adapter = OcrProviderFactory::create(&config);
        let groq_adapter = GroqProviderFactory::create(&config);
        let sms_adapter = NotificationProviderFactory::create_sms(&config);
        let email_adapter = NotificationProviderFactory::create_email(&config);
        let storage_adapter = StorageProviderFactory::create(&config);
        let ai_adapter = AIProviderFactory::create();

        let centralized_notif = Arc::new(CentralizedNotificationService::new(email_adapter.clone()));
        let email_notif_observer = Arc::new(AutomatedEmailNotificationObserver::new(centralized_notif.clone()));
        let notification_service: Arc<dyn NotificationServiceTrait> = centralized_notif;

        let event_bus = EventBus::new(vec![
            audit_observer.clone(),
            notification_observer.clone(),
            email_notif_observer,
        ]);

        let org_repo: Arc<dyn OrganizationRepository> =
            Arc::new(InMemoryOrganizationRepository::new());
        let prop_unit_store = Arc::new(InMemoryPropertyUnitStore::new());
        let prop_repo: Arc<dyn PropertyRepository> = prop_unit_store.clone();
        let unit_repo: Arc<dyn UnitRepository> = prop_unit_store;
        let tenant_repo: Arc<dyn TenantRepository> =
            Arc::new(InMemoryTenantRepository::new(event_bus.clone()));
        let lease_repo: Arc<dyn LeaseRepository> = Arc::new(InMemoryLeaseRepository::new(
            unit_repo.clone(),
            tenant_repo.clone(),
            event_bus.clone(),
        ));
        let accounting_repo: Arc<dyn AccountingRepository> =
            Arc::new(InMemoryAccountingRepository::new());
        let deposit_repo: Arc<dyn DepositRepository> = Arc::new(InMemoryDepositRepository::new(
            lease_repo.clone(),
            accounting_repo.clone(),
        ));
        let invoice_repo: Arc<dyn InvoiceRepository> = Arc::new(InMemoryInvoiceRepository::new(
            lease_repo.clone(),
            accounting_repo.clone(),
            event_bus.clone(),
        ));
        let payment_repo: Arc<dyn PaymentRepository> = Arc::new(InMemoryPaymentRepository::new(
            invoice_repo.clone(),
            accounting_repo.clone(),
            mpesa_adapter.clone(),
            event_bus.clone(),
        ));
        let maintenance_repo: Arc<dyn MaintenanceRepository> =
            Arc::new(InMemoryMaintenanceRepository::new(event_bus.clone()));
        let document_repo: Arc<dyn DocumentRepository> =
            Arc::new(InMemoryDocumentRepository::new(storage_adapter.clone()));
        let ocr_repo: Arc<dyn OcrRepository> =
            Arc::new(InMemoryOcrRepository::new(ocr_adapter.clone()));
        let operations_repo: Arc<dyn OperationsRepository> =
            Arc::new(InMemoryOperationsRepository::new());

        let assistant_service: Arc<dyn AssistantServiceTrait> = Arc::new(
            GroundedAssistantService::new(
                prop_repo.clone(),
                unit_repo.clone(),
                tenant_repo.clone(),
                lease_repo.clone(),
                invoice_repo.clone(),
                payment_repo.clone(),
                deposit_repo.clone(),
                accounting_repo.clone(),
                maintenance_repo.clone(),
                document_repo.clone(),
                ocr_repo.clone(),
            )
            .with_groq(groq_adapter.clone()),
        );

        let auth_service = Arc::new(AuthService::new(org_repo.clone(), token_service.clone()));
        let otp_service = Arc::new(OtpService::new());

        Arc::new(Self {
            config,
            supabase_pg,
            token_service,
            auth_service,
            otp_service,
            assistant_service,
            notification_service,
            event_bus,
            audit_observer,
            notification_observer,
            rate_limiter: RateLimiterDecorator::new(300, Duration::from_secs(60)),
            mpesa_adapter,
            ocr_adapter,
            groq_adapter,
            sms_adapter,
            email_adapter,
            storage_adapter,
            ai_adapter,
            repositories: RepositoryRegistry {
                organizations: org_repo,
                properties: prop_repo,
                units: unit_repo,
                tenants: tenant_repo,
                leases: lease_repo,
                invoices: invoice_repo,
                payments: payment_repo,
                deposits: deposit_repo,
                accounting: accounting_repo,
                maintenance: maintenance_repo,
                documents: document_repo,
                ocr: ocr_repo,
                operations: operations_repo,
            },
        })
    }
}
