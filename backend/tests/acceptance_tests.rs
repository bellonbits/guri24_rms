use chrono::NaiveDate;
use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use uuid::Uuid;

use guri24_rms_backend::{
    config::AppConfig,
    core::{
        errors::AppError,
        security::SystemRole,
        tenant_context::TenantContext,
    },
    database::AppState,
    integrations::mpesa::VerifiedMpesaCallback,
    modules::{
        accounting::{AccountType, JournalLine},
        billing::{GenerateInvoiceCommand, InvoiceStatus},
        deposits::ReceiveDepositCommand,
        leases::{
            CreateLeaseCommand, LeaseStatus, RecurringLeaseCharge, RenewLeaseCommand,
        },
        maintenance::{
            MaintenanceStatus, SubmitMaintenanceCommand, TransitionMaintenanceCommand,
        },
        organizations::RegisterOrganizationCommand,
        payments::{InitiateMpesaPaymentCommand, PaymentStatus},
        properties::{
            CreateBuildingCommand, CreateFloorCommand, CreatePropertyCommand, CreateUnitCommand,
            UnitStatus,
        },
        reports::ReportBuilder,
        tenants::RegisterTenantCommand,
    },
};

fn build_test_org_ctx(state: &AppState, name: &str, email: &str, phone: &str) -> TenantContext {
    let session = state
        .auth_service
        .register_organization(RegisterOrganizationCommand {
            organization_name: name.to_string(),
            organization_type: "PROPERTY_MANAGEMENT_COMPANY".to_string(),
            county: "Nairobi".to_string(),
            kra_pin: Some("P051234567X".to_string()),
            admin_full_name: format!("{name} Admin"),
            admin_email: email.to_string(),
            admin_phone: phone.to_string(),
            admin_password: "StrongPassword#2026".to_string(),
        })
        .expect("Organization registration should succeed");

    TenantContext {
        user_id: session.user_id,
        organization_id: session.organization.id,
        role: session.role,
        permissions: session.permissions,
    }
}

#[test]
fn acceptance_1_to_4_end_to_end_workflow_and_tenant_isolation() {
    let state = AppState::new(AppConfig::from_env());

    let org_a = build_test_org_ctx(&state, "Kilimani Crest Estates", "admin@kilimani.co.ke", "0712345678");
    let org_b = build_test_org_ctx(&state, "Westlands Heights Ltd", "admin@westlands.co.ke", "0722987654");

    // Scenario 2: Organization A creates Property -> Building -> Floor -> Unit
    let prop_a = state
        .repositories
        .properties
        .create_property(
            &org_a,
            CreatePropertyCommand {
                code: "KIL-01".to_string(),
                name: "Kilimani Jacaranda Court".to_string(),
                county: "Nairobi".to_string(),
                estate_or_area: "Kilimani".to_string(),
                physical_address: "Argwings Kodhek Rd, Plot 42".to_string(),
                lr_number: Some("LR 209/11421".to_string()),
                description: Some("Modern residential apartments".to_string()),
                amenities: vec!["Borehole".to_string(), "Solar Water Heating".to_string()],
                management_commission_pct: dec!(7.50),
            },
        )
        .unwrap();

    // Scenario 1: Organization B cannot access Organization A's property
    let cross_tenant_res = state.repositories.properties.get_property(&org_b, prop_a.id);
    assert!(matches!(
        cross_tenant_res,
        Err(AppError::TenantIsolationViolation(_))
    ));

    let building_a = state
        .repositories
        .properties
        .create_building(
            &org_a,
            CreateBuildingCommand {
                property_id: prop_a.id,
                code: "BLK-A".to_string(),
                name: "Block A (Acacia)".to_string(),
                total_floors: 5,
            },
        )
        .unwrap();

    let floor_1 = state
        .repositories
        .properties
        .create_floor(
            &org_a,
            CreateFloorCommand {
                property_id: prop_a.id,
                building_id: building_a.id,
                floor_number: 1,
                label: "1st Floor".to_string(),
            },
        )
        .unwrap();

    let unit_a101 = state
        .repositories
        .units
        .create_unit(
            &org_a,
            CreateUnitCommand {
                property_id: prop_a.id,
                building_id: building_a.id,
                floor_id: floor_1.id,
                unit_number: "A-101".to_string(),
                unit_type: "TWO_BEDROOM".to_string(),
                bedrooms: 2,
                bathrooms: 2,
                monthly_rent_kes: dec!(15000.00),
                deposit_amount_kes: dec!(15000.00),
                water_meter_number: Some("WM-101".to_string()),
                kplc_meter_number: Some("KPLC-14290011".to_string()),
            },
        )
        .unwrap();
    assert_eq!(unit_a101.status, UnitStatus::Vacant);

    // Scenario 3: Register Tenant & assign to available unit via Lease
    let tenant = state
        .repositories
        .tenants
        .register_tenant(
            &org_a,
            RegisterTenantCommand {
                full_name: "Wanjiku Mwangi".to_string(),
                phone: "0722111222".to_string(),
                email: Some("wanjiku@example.co.ke".to_string()),
                national_id_number: Some("31245678".to_string()),
                emergency_contact_name: Some("Kamau Mwangi".to_string()),
                emergency_contact_phone: Some("0733111222".to_string()),
            },
        )
        .unwrap();
    assert_eq!(tenant.national_id_masked.as_deref(), Some("****5678"));

    let lease = state
        .repositories
        .leases
        .create_lease(
            &org_a,
            CreateLeaseCommand {
                unit_id: unit_a101.id,
                primary_tenant_id: tenant.id,
                co_tenant_ids: vec![],
                start_date: NaiveDate::from_ymd_opt(2026, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2026, 12, 31).unwrap(),
                billing_day: 5,
                monthly_rent_kes: dec!(15000.00),
                security_deposit_kes: dec!(15000.00),
                recurring_charges: vec![],
            },
        )
        .unwrap();
    assert_eq!(lease.status, LeaseStatus::PendingApproval);

    // Scenario 4: Activate lease -> unit becomes OCCUPIED
    let activated_lease = state
        .repositories
        .leases
        .activate_lease(&org_a, lease.id)
        .unwrap();
    assert_eq!(activated_lease.status, LeaseStatus::Active);

    let updated_unit = state.repositories.units.get_unit(&org_a, unit_a101.id).unwrap();
    assert_eq!(updated_unit.status, UnitStatus::Occupied);
    assert_eq!(updated_unit.current_tenant_id, Some(tenant.id));
}

#[test]
fn acceptance_5_to_11_billing_idempotency_partial_payments_mpesa_and_accounting() {
    let state = AppState::new(AppConfig::from_env());
    let org = build_test_org_ctx(&state, "Nyali Palms Properties", "finance@nyalipalms.co.ke", "0711000999");

    let prop = state
        .repositories
        .properties
        .create_property(
            &org,
            CreatePropertyCommand {
                code: "NYL-01".to_string(),
                name: "Nyali Palms".to_string(),
                county: "Mombasa".to_string(),
                estate_or_area: "Nyali".to_string(),
                physical_address: "Links Road".to_string(),
                lr_number: None,
                description: None,
                amenities: vec![],
                management_commission_pct: dec!(8.00),
            },
        )
        .unwrap();
    let bld = state
        .repositories
        .properties
        .create_building(
            &org,
            CreateBuildingCommand {
                property_id: prop.id,
                code: "B1".to_string(),
                name: "Palm Tower".to_string(),
                total_floors: 4,
            },
        )
        .unwrap();
    let flr = state
        .repositories
        .properties
        .create_floor(
            &org,
            CreateFloorCommand {
                property_id: prop.id,
                building_id: bld.id,
                floor_number: 1,
                label: "Ground".to_string(),
            },
        )
        .unwrap();
    let unit = state
        .repositories
        .units
        .create_unit(
            &org,
            CreateUnitCommand {
                property_id: prop.id,
                building_id: bld.id,
                floor_id: flr.id,
                unit_number: "G-01".to_string(),
                unit_type: "TWO_BEDROOM".to_string(),
                bedrooms: 2,
                bathrooms: 2,
                monthly_rent_kes: dec!(15000.00),
                deposit_amount_kes: dec!(15000.00),
                water_meter_number: None,
                kplc_meter_number: None,
            },
        )
        .unwrap();
    let tenant = state
        .repositories
        .tenants
        .register_tenant(
            &org,
            RegisterTenantCommand {
                full_name: "Otieno Odhiambo".to_string(),
                phone: "0712999888".to_string(),
                email: None,
                national_id_number: Some("28991122".to_string()),
                emergency_contact_name: None,
                emergency_contact_phone: None,
            },
        )
        .unwrap();

    let lease = state
        .repositories
        .leases
        .create_lease(
            &org,
            CreateLeaseCommand {
                unit_id: unit.id,
                primary_tenant_id: tenant.id,
                co_tenant_ids: vec![],
                start_date: NaiveDate::from_ymd_opt(2026, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2026, 12, 31).unwrap(),
                billing_day: 5,
                monthly_rent_kes: dec!(15000.00),
                security_deposit_kes: dec!(15000.00),
                recurring_charges: vec![],
            },
        )
        .unwrap();
    state
        .repositories
        .leases
        .activate_lease(&org, lease.id)
        .unwrap();

    // Scenario 5: Recurring invoices are generated exactly once per billing period (Idempotent)
    let (inv_oct_1, created_1) = state
        .repositories
        .invoices
        .generate_recurring_invoice(
            &org,
            GenerateInvoiceCommand {
                lease_id: lease.id,
                billing_period: "2026-10".to_string(),
                issue_date: NaiveDate::from_ymd_opt(2026, 10, 1).unwrap(),
                due_date: NaiveDate::from_ymd_opt(2026, 10, 5).unwrap(),
            },
        )
        .unwrap();
    assert!(created_1);

    let (inv_oct_2, created_2) = state
        .repositories
        .invoices
        .generate_recurring_invoice(
            &org,
            GenerateInvoiceCommand {
                lease_id: lease.id,
                billing_period: "2026-10".to_string(),
                issue_date: NaiveDate::from_ymd_opt(2026, 10, 1).unwrap(),
                due_date: NaiveDate::from_ymd_opt(2026, 10, 5).unwrap(),
            },
        )
        .unwrap();
    assert!(!created_2);
    assert_eq!(inv_oct_1.id, inv_oct_2.id);

    // Scenario 6 & 11: Partial payment of KSh 10,000 against KSh 15,000 rent invoice -> balance KSh 5,000
    // Also simulate notification failure to verify Scenario 11 (failed notifications never reverse financial transactions)
    state.notification_observer.set_simulate_failure(true);

    let initiated = state
        .repositories
        .payments
        .initiate_mpesa_payment(
            &org,
            InitiateMpesaPaymentCommand {
                tenant_id: tenant.id,
                lease_id: Some(lease.id),
                phone_number: "0712999888".to_string(),
                amount_kes: dec!(10000.00),
                account_reference: "RENT-G-01".to_string(),
                idempotency_key: "MPESA-KEY-001".to_string(),
            },
        )
        .unwrap();
    assert_eq!(initiated.status, PaymentStatus::Pending);

    let callback_payload = VerifiedMpesaCallback {
        merchant_request_id: initiated.merchant_request_id.clone().unwrap(),
        checkout_request_id: initiated.checkout_request_id.clone().unwrap(),
        result_code: 0,
        result_desc: "The service request is processed successfully.".to_string(),
        amount_kes: Some(dec!(10000.00)),
        mpesa_receipt_number: Some("SJK10000AA".to_string()),
        phone_number: Some("254712999888".to_string()),
        account_reference: "RENT-G-01".to_string(),
    };

    let (settled_payment, first_settlement) = state
        .repositories
        .payments
        .process_verified_mpesa_callback(callback_payload.clone())
        .unwrap();
    assert!(first_settlement);
    assert_eq!(settled_payment.status, PaymentStatus::Completed);
    assert_eq!(settled_payment.allocated_amount_kes, dec!(10000.00));

    let updated_oct_inv = state
        .repositories
        .invoices
        .get_invoice(&org, inv_oct_1.id)
        .unwrap();
    assert_eq!(updated_oct_inv.status, InvoiceStatus::PartiallyPaid);
    assert_eq!(updated_oct_inv.amount_paid_kes, dec!(10000.00));
    assert_eq!(updated_oct_inv.balance_kes, dec!(5000.00));

    state.notification_observer.set_simulate_failure(false);

    // Scenario 7: Duplicate M-Pesa callbacks do not create duplicate payments or double-allocate
    let (dup_payment, second_settlement) = state
        .repositories
        .payments
        .process_verified_mpesa_callback(callback_payload)
        .unwrap();
    assert!(!second_settlement);
    assert_eq!(dup_payment.id, settled_payment.id);
    let oct_inv_after_dup = state
        .repositories
        .invoices
        .get_invoice(&org, inv_oct_1.id)
        .unwrap();
    assert_eq!(oct_inv_after_dup.balance_kes, dec!(5000.00));

    // Scenario 8: Payment allocation correctly handles multiple invoices (KSh 5,000 Oct balance + KSh 15,000 Nov invoice)
    let (inv_nov, _) = state
        .repositories
        .invoices
        .generate_recurring_invoice(
            &org,
            GenerateInvoiceCommand {
                lease_id: lease.id,
                billing_period: "2026-11".to_string(),
                issue_date: NaiveDate::from_ymd_opt(2026, 11, 1).unwrap(),
                due_date: NaiveDate::from_ymd_opt(2026, 11, 5).unwrap(),
            },
        )
        .unwrap();

    let multi_pay_init = state
        .repositories
        .payments
        .initiate_mpesa_payment(
            &org,
            InitiateMpesaPaymentCommand {
                tenant_id: tenant.id,
                lease_id: Some(lease.id),
                phone_number: "0712999888".to_string(),
                amount_kes: dec!(20000.00),
                account_reference: "RENT-G-01".to_string(),
                idempotency_key: "MPESA-KEY-002".to_string(),
            },
        )
        .unwrap();

    let (multi_settled, _) = state
        .repositories
        .payments
        .process_verified_mpesa_callback(VerifiedMpesaCallback {
            merchant_request_id: multi_pay_init.merchant_request_id.unwrap(),
            checkout_request_id: multi_pay_init.checkout_request_id.unwrap(),
            result_code: 0,
            result_desc: "Success".to_string(),
            amount_kes: Some(dec!(20000.00)),
            mpesa_receipt_number: Some("SJK20000BB".to_string()),
            phone_number: Some("254712999888".to_string()),
            account_reference: "RENT-G-01".to_string(),
        })
        .unwrap();
    assert_eq!(multi_settled.allocations.len(), 2);
    assert_eq!(
        state
            .repositories
            .invoices
            .get_invoice(&org, inv_oct_1.id)
            .unwrap()
            .status,
        InvoiceStatus::Paid
    );
    assert_eq!(
        state
            .repositories
            .invoices
            .get_invoice(&org, inv_nov.id)
            .unwrap()
            .status,
        InvoiceStatus::Paid
    );

    // Scenario 9: Security deposits do not become rental revenue
    let dep = state
        .repositories
        .deposits
        .receive_deposit(
            &org,
            ReceiveDepositCommand {
                lease_id: lease.id,
                amount_kes: dec!(15000.00),
                payment_reference: "SJKDEP001".to_string(),
            },
        )
        .unwrap();
    assert_eq!(dep.current_liability_balance_kes, dec!(15000.00));

    let report = ReportBuilder::new(org.organization_id)
        .with_inventory(
            state.repositories.properties.list_properties(&org).unwrap(),
            state.repositories.properties.list_buildings(&org, None).unwrap(),
            state.repositories.units.list_units(&org, None).unwrap(),
        )
        .with_financials(
            state.repositories.invoices.list_invoices(&org).unwrap(),
            state.repositories.payments.list_payments(&org).unwrap(),
            state.repositories.accounting.list_expenses(&org).unwrap(),
            state.repositories.deposits.list_deposits(&org).unwrap(),
        )
        .build();

    // Expected revenue is strictly Oct (15,000) + Nov (15,000) = 30,000; deposit (15,000) is in liability!
    assert_eq!(report.expected_rental_revenue_kes, dec!(30000.00));
    assert_eq!(report.actual_rental_collections_kes, dec!(30000.00));
    assert_eq!(report.security_deposits_liability_kes, dec!(15000.00));

    // Scenario 10: Financial transactions maintain double-entry integrity & immutability
    let journals = state
        .repositories
        .accounting
        .list_journal_entries(&org)
        .unwrap();
    assert!(!journals.is_empty());
    for entry in &journals {
        let sum_dr: Decimal = entry.lines.iter().map(|l| l.debit_kes).sum();
        let sum_cr: Decimal = entry.lines.iter().map(|l| l.credit_kes).sum();
        assert_eq!(sum_dr, sum_cr);
        assert_eq!(sum_dr, entry.total_debit_kes);
    }

    // Attempt to post an unbalanced entry must fail
    let unbalanced_res = state.repositories.accounting.post_journal_entry(
        org.organization_id,
        None,
        "TEST",
        Uuid::new_v4(),
        "Unbalanced entry".to_string(),
        vec![
            JournalLine {
                id: Uuid::new_v4(),
                account_code: "1010".to_string(),
                account_name: "Cash".to_string(),
                account_type: AccountType::Asset,
                tenant_id: None,
                lease_id: None,
                debit_kes: dec!(1000.00),
                credit_kes: Decimal::ZERO,
                memo: "dr".to_string(),
            },
            JournalLine {
                id: Uuid::new_v4(),
                account_code: "4000".to_string(),
                account_name: "Revenue".to_string(),
                account_type: AccountType::Revenue,
                tenant_id: None,
                lease_id: None,
                debit_kes: Decimal::ZERO,
                credit_kes: dec!(900.00),
                memo: "cr".to_string(),
            },
        ],
    );
    assert!(matches!(
        unbalanced_res,
        Err(AppError::FinancialIntegrity(_))
    ));

    // Attempt to delete a posted journal entry must fail
    let delete_res = state
        .repositories
        .accounting
        .delete_journal_entry(&org, journals[0].id);
    assert!(matches!(delete_res, Err(AppError::FinancialIntegrity(_))));
}

#[test]
fn acceptance_12_13_14_maintenance_transitions_lease_renewal_and_rbac() {
    let state = AppState::new(AppConfig::from_env());
    let org = build_test_org_ctx(&state, "Lavington Gardens", "ops@lavington.co.ke", "0733444555");

    let prop = state
        .repositories
        .properties
        .create_property(
            &org,
            CreatePropertyCommand {
                code: "LAV-01".to_string(),
                name: "Lavington Court".to_string(),
                county: "Nairobi".to_string(),
                estate_or_area: "Lavington".to_string(),
                physical_address: "James Gichuru Rd".to_string(),
                lr_number: None,
                description: None,
                amenities: vec![],
                management_commission_pct: dec!(10.0),
            },
        )
        .unwrap();
    let bld = state
        .repositories
        .properties
        .create_building(
            &org,
            CreateBuildingCommand {
                property_id: prop.id,
                code: "BLK-1".to_string(),
                name: "Block 1".to_string(),
                total_floors: 3,
            },
        )
        .unwrap();
    let flr = state
        .repositories
        .properties
        .create_floor(
            &org,
            CreateFloorCommand {
                property_id: prop.id,
                building_id: bld.id,
                floor_number: 2,
                label: "2nd Floor".to_string(),
            },
        )
        .unwrap();
    let unit = state
        .repositories
        .units
        .create_unit(
            &org,
            CreateUnitCommand {
                property_id: prop.id,
                building_id: bld.id,
                floor_id: flr.id,
                unit_number: "2B".to_string(),
                unit_type: "THREE_BEDROOM".to_string(),
                bedrooms: 3,
                bathrooms: 3,
                monthly_rent_kes: dec!(45000.00),
                deposit_amount_kes: dec!(45000.00),
                water_meter_number: None,
                kplc_meter_number: None,
            },
        )
        .unwrap();
    let tenant = state
        .repositories
        .tenants
        .register_tenant(
            &org,
            RegisterTenantCommand {
                full_name: "Amina Hassan".to_string(),
                phone: "0700112233".to_string(),
                email: None,
                national_id_number: None,
                emergency_contact_name: None,
                emergency_contact_phone: None,
            },
        )
        .unwrap();

    // Scenario 12: Maintenance requests follow valid status transitions
    // Submitted -> Reviewed -> Approved -> Assigned -> InProgress -> Completed -> Verified -> Closed
    let mnt = state
        .repositories
        .maintenance
        .submit_request(
            &org,
            SubmitMaintenanceCommand {
                property_id: prop.id,
                building_id: bld.id,
                unit_id: unit.id,
                tenant_id: Some(tenant.id),
                category: "PLUMBING".to_string(),
                priority: "HIGH".to_string(),
                title: "Kitchen sink pipe leak".to_string(),
                description: "P-trap under kitchen sink is leaking".to_string(),
                estimated_cost_kes: dec!(2500.00),
            },
        )
        .unwrap();
    assert_eq!(mnt.status, MaintenanceStatus::Submitted);

    // Invalid jump directly from Submitted -> Completed must fail
    let invalid_jump = state.repositories.maintenance.transition_status(
        &org,
        mnt.id,
        TransitionMaintenanceCommand {
            next_status: MaintenanceStatus::Completed,
            assigned_vendor_name: None,
            assigned_officer_name: None,
            instructions: None,
            actual_cost_kes: None,
            completion_notes: None,
        },
    );
    assert!(matches!(invalid_jump, Err(AppError::BusinessRule(_))));

    for step in [
        MaintenanceStatus::Reviewed,
        MaintenanceStatus::Approved,
        MaintenanceStatus::Assigned,
        MaintenanceStatus::InProgress,
        MaintenanceStatus::Completed,
        MaintenanceStatus::Verified,
        MaintenanceStatus::Closed,
    ] {
        let updated = state
            .repositories
            .maintenance
            .transition_status(
                &org,
                mnt.id,
                TransitionMaintenanceCommand {
                    next_status: step,
                    assigned_vendor_name: Some("Nairobi Rapid Plumbers Ltd".to_string()),
                    assigned_officer_name: Some("Peter Njoroge".to_string()),
                    instructions: Some("Replace P-trap and seal joints".to_string()),
                    actual_cost_kes: Some(dec!(2200.00)),
                    completion_notes: Some("Replaced P-trap and tested for 15 mins".to_string()),
                },
            )
            .unwrap();
        assert_eq!(updated.status, step);
    }

    // Scenario 13: Lease expiry and renewal are recorded correctly
    let lease = state
        .repositories
        .leases
        .create_lease(
            &org,
            CreateLeaseCommand {
                unit_id: unit.id,
                primary_tenant_id: tenant.id,
                co_tenant_ids: vec![],
                start_date: NaiveDate::from_ymd_opt(2026, 1, 1).unwrap(),
                end_date: NaiveDate::from_ymd_opt(2026, 12, 31).unwrap(),
                billing_day: 5,
                monthly_rent_kes: dec!(45000.00),
                security_deposit_kes: dec!(45000.00),
                recurring_charges: vec![RecurringLeaseCharge {
                    charge_code: "GARBAGE".to_string(),
                    description: "Garbage Collection".to_string(),
                    amount_kes: dec!(500.00),
                }],
            },
        )
        .unwrap();
    state
        .repositories
        .leases
        .activate_lease(&org, lease.id)
        .unwrap();
    let expiring = state
        .repositories
        .leases
        .mark_lease_expiring(&org, lease.id)
        .unwrap();
    assert_eq!(expiring.status, LeaseStatus::Expiring);

    let renewed = state
        .repositories
        .leases
        .renew_lease(
            &org,
            lease.id,
            RenewLeaseCommand {
                new_start_date: NaiveDate::from_ymd_opt(2027, 1, 1).unwrap(),
                new_end_date: NaiveDate::from_ymd_opt(2027, 12, 31).unwrap(),
                new_monthly_rent_kes: dec!(48000.00),
            },
        )
        .unwrap();
    assert_eq!(renewed.status, LeaseStatus::Active);
    assert_eq!(renewed.renewed_from_lease_id, Some(lease.id));
    assert_eq!(
        state
            .repositories
            .leases
            .get_lease(&org, lease.id)
            .unwrap()
            .status,
        LeaseStatus::Renewed
    );

    // Scenario 14: Unauthorized users (e.g. Tenant role) cannot perform restricted operations
    let tenant_role_ctx = TenantContext {
        user_id: Uuid::new_v4(),
        organization_id: org.organization_id,
        role: SystemRole::Tenant,
        permissions: SystemRole::Tenant
            .default_permissions()
            .into_iter()
            .map(ToString::to_string)
            .collect(),
    };

    let unauthorized_create_prop = state.repositories.properties.create_property(
        &tenant_role_ctx,
        CreatePropertyCommand {
            code: "HACK-01".to_string(),
            name: "Unauthorized Property".to_string(),
            county: "Nairobi".to_string(),
            estate_or_area: "CBD".to_string(),
            physical_address: "Moi Ave".to_string(),
            lr_number: None,
            description: None,
            amenities: vec![],
            management_commission_pct: dec!(5.0),
        },
    );
    assert!(matches!(unauthorized_create_prop, Err(AppError::Forbidden(_))));
}
