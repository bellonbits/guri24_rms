use rust_decimal::Decimal;
use rust_decimal_macros::dec;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::{
    core::{errors::AppResult, tenant_context::TenantContext},
    modules::{
        accounting::PropertyExpense,
        billing::{Invoice, InvoiceStatus},
        deposits::SecurityDepositLedger,
        maintenance::{MaintenanceRequest, MaintenanceStatus},
        payments::{Payment, PaymentStatus},
        properties::{Building, Property, Unit, UnitStatus},
    },
};

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct PortfolioKpiReport {
    pub organization_id: Uuid,
    pub currency: String,
    pub total_properties: usize,
    pub total_buildings: usize,
    pub total_units: usize,
    pub occupied_units: usize,
    pub vacant_units: usize,
    pub reserved_units: usize,
    pub occupancy_rate_pct: Decimal,
    pub expected_rental_revenue_kes: Decimal,
    pub actual_rental_collections_kes: Decimal,
    pub collection_rate_pct: Decimal,
    pub outstanding_arrears_kes: Decimal,
    pub overdue_invoices_count: usize,
    pub revenue_per_unit_kes: Decimal,
    pub maintenance_expenditure_kes: Decimal,
    pub open_maintenance_requests: usize,
    pub security_deposits_liability_kes: Decimal,
    pub net_operating_income_kes: Decimal,
}

/// Section 5.9: Builder Pattern - ReportBuilder
/// Computes reconciled operational and financial KPIs directly from underlying domain records.
pub struct ReportBuilder {
    organization_id: Uuid,
    properties: Vec<Property>,
    buildings: Vec<Building>,
    units: Vec<Unit>,
    invoices: Vec<Invoice>,
    payments: Vec<Payment>,
    expenses: Vec<PropertyExpense>,
    deposits: Vec<SecurityDepositLedger>,
    maintenance: Vec<MaintenanceRequest>,
}

impl ReportBuilder {
    pub fn new(organization_id: Uuid) -> Self {
        Self {
            organization_id,
            properties: Vec::new(),
            buildings: Vec::new(),
            units: Vec::new(),
            invoices: Vec::new(),
            payments: Vec::new(),
            expenses: Vec::new(),
            deposits: Vec::new(),
            maintenance: Vec::new(),
        }
    }

    pub fn with_inventory(
        mut self,
        properties: Vec<Property>,
        buildings: Vec<Building>,
        units: Vec<Unit>,
    ) -> Self {
        self.properties = properties;
        self.buildings = buildings;
        self.units = units;
        self
    }

    pub fn with_financials(
        mut self,
        invoices: Vec<Invoice>,
        payments: Vec<Payment>,
        expenses: Vec<PropertyExpense>,
        deposits: Vec<SecurityDepositLedger>,
    ) -> Self {
        self.invoices = invoices;
        self.payments = payments;
        self.expenses = expenses;
        self.deposits = deposits;
        self
    }

    pub fn with_maintenance(mut self, maintenance: Vec<MaintenanceRequest>) -> Self {
        self.maintenance = maintenance;
        self
    }

    pub fn build(self) -> PortfolioKpiReport {
        let total_properties = self.properties.len();
        let total_buildings = self.buildings.len();
        let total_units = self.units.len();
        let occupied_units = self
            .units
            .iter()
            .filter(|u| u.status == UnitStatus::Occupied)
            .count();
        let vacant_units = self
            .units
            .iter()
            .filter(|u| u.status == UnitStatus::Vacant)
            .count();
        let reserved_units = self
            .units
            .iter()
            .filter(|u| u.status == UnitStatus::Reserved)
            .count();

        let occupancy_rate_pct = if total_units > 0 {
            ((Decimal::from(occupied_units) / Decimal::from(total_units)) * dec!(100)).round_dp(2)
        } else {
            Decimal::ZERO
        };

        let active_invoices: Vec<&Invoice> = self
            .invoices
            .iter()
            .filter(|i| i.status != InvoiceStatus::Cancelled)
            .collect();

        let expected_rental_revenue_kes: Decimal =
            active_invoices.iter().map(|i| i.total_amount_kes).sum();

        let actual_rental_collections_kes: Decimal = self
            .payments
            .iter()
            .filter(|p| p.status == PaymentStatus::Completed)
            .map(|p| p.allocated_amount_kes)
            .sum();

        let collection_rate_pct = if expected_rental_revenue_kes > Decimal::ZERO {
            ((actual_rental_collections_kes / expected_rental_revenue_kes) * dec!(100)).round_dp(2)
        } else {
            Decimal::ZERO
        };

        let outstanding_arrears_kes: Decimal = active_invoices.iter().map(|i| i.balance_kes).sum();
        let overdue_invoices_count = active_invoices
            .iter()
            .filter(|i| i.balance_kes > Decimal::ZERO)
            .count();

        let revenue_per_unit_kes = if total_units > 0 {
            (actual_rental_collections_kes / Decimal::from(total_units)).round_dp(2)
        } else {
            Decimal::ZERO
        };

        let maintenance_expenditure_kes: Decimal =
            self.expenses.iter().map(|e| e.amount_kes).sum();

        let open_maintenance_requests = self
            .maintenance
            .iter()
            .filter(|m| {
                !matches!(
                    m.status,
                    MaintenanceStatus::Closed | MaintenanceStatus::Rejected
                )
            })
            .count();

        // Security deposits are held as liabilities and excluded from Net Operating Income!
        let security_deposits_liability_kes: Decimal = self
            .deposits
            .iter()
            .map(|d| d.current_liability_balance_kes)
            .sum();

        let net_operating_income_kes = actual_rental_collections_kes - maintenance_expenditure_kes;

        PortfolioKpiReport {
            organization_id: self.organization_id,
            currency: "KES".to_string(),
            total_properties,
            total_buildings,
            total_units,
            occupied_units,
            vacant_units,
            reserved_units,
            occupancy_rate_pct,
            expected_rental_revenue_kes,
            actual_rental_collections_kes,
            collection_rate_pct,
            outstanding_arrears_kes,
            overdue_invoices_count,
            revenue_per_unit_kes,
            maintenance_expenditure_kes,
            open_maintenance_requests,
            security_deposits_liability_kes,
            net_operating_income_kes,
        }
    }
}

pub fn export_kpi_report_csv(ctx: &TenantContext, report: &PortfolioKpiReport) -> AppResult<String> {
    ctx.require_permission("reports.export")?;
    let csv = format!(
        "metric,value,currency\n\
         total_properties,{},COUNT\n\
         total_buildings,{},COUNT\n\
         total_units,{},COUNT\n\
         occupied_units,{},COUNT\n\
         vacant_units,{},COUNT\n\
         occupancy_rate_pct,{},PERCENT\n\
         expected_rental_revenue,{},KES\n\
         actual_rental_collections,{},KES\n\
         collection_rate_pct,{},PERCENT\n\
         outstanding_arrears,{},KES\n\
         maintenance_expenditure,{},KES\n\
         security_deposits_liability,{},KES\n\
         net_operating_income,{},KES\n",
        report.total_properties,
        report.total_buildings,
        report.total_units,
        report.occupied_units,
        report.vacant_units,
        report.occupancy_rate_pct,
        report.expected_rental_revenue_kes,
        report.actual_rental_collections_kes,
        report.collection_rate_pct,
        report.outstanding_arrears_kes,
        report.maintenance_expenditure_kes,
        report.security_deposits_liability_kes,
        report.net_operating_income_kes,
    );
    Ok(csv)
}
