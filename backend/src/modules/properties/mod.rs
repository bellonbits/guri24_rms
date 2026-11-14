use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

use crate::core::{
    errors::{AppError, AppResult},
    tenant_context::TenantContext,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum UnitStatus {
    Vacant,
    Occupied,
    Reserved,
    UnderMaintenance,
    Unavailable,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Property {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub code: String,
    pub name: String,
    pub county: String,
    pub estate_or_area: String,
    pub physical_address: String,
    pub lr_number: Option<String>,
    pub description: Option<String>,
    pub amenities: Vec<String>,
    pub management_commission_pct: Decimal,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Building {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub code: String,
    pub name: String,
    pub total_floors: u16,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Floor {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub floor_number: i16,
    pub label: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Unit {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub floor_id: Uuid,
    pub unit_number: String,
    pub unit_type: String,
    pub bedrooms: u8,
    pub bathrooms: u8,
    pub monthly_rent_kes: Decimal,
    pub deposit_amount_kes: Decimal,
    pub currency: String,
    pub status: UnitStatus,
    pub water_meter_number: Option<String>,
    pub kplc_meter_number: Option<String>,
    pub current_tenant_id: Option<Uuid>,
    pub current_lease_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

// CQRS Commands
#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct CreatePropertyCommand {
    pub code: String,
    pub name: String,
    pub county: String,
    pub estate_or_area: String,
    pub physical_address: String,
    pub lr_number: Option<String>,
    pub description: Option<String>,
    #[serde(default)]
    pub amenities: Vec<String>,
    pub management_commission_pct: Decimal,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct CreateBuildingCommand {
    pub property_id: Uuid,
    pub code: String,
    pub name: String,
    pub total_floors: u16,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct CreateFloorCommand {
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub floor_number: i16,
    pub label: String,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct CreateUnitCommand {
    pub property_id: Uuid,
    pub building_id: Uuid,
    pub floor_id: Uuid,
    pub unit_number: String,
    pub unit_type: String,
    pub bedrooms: u8,
    pub bathrooms: u8,
    pub monthly_rent_kes: Decimal,
    pub deposit_amount_kes: Decimal,
    pub water_meter_number: Option<String>,
    pub kplc_meter_number: Option<String>,
}

/// Section 5.1: Repository Pattern - PropertyRepository & UnitRepository
pub trait PropertyRepository: Send + Sync {
    fn create_property(&self, ctx: &TenantContext, cmd: CreatePropertyCommand) -> AppResult<Property>;
    fn get_property(&self, ctx: &TenantContext, property_id: Uuid) -> AppResult<Property>;
    fn list_properties(&self, ctx: &TenantContext) -> AppResult<Vec<Property>>;
    fn create_building(&self, ctx: &TenantContext, cmd: CreateBuildingCommand) -> AppResult<Building>;
    fn list_buildings(&self, ctx: &TenantContext, property_id: Option<Uuid>) -> AppResult<Vec<Building>>;
    fn create_floor(&self, ctx: &TenantContext, cmd: CreateFloorCommand) -> AppResult<Floor>;
    fn list_floors(&self, ctx: &TenantContext, building_id: Option<Uuid>) -> AppResult<Vec<Floor>>;
}

pub trait UnitRepository: Send + Sync {
    fn create_unit(&self, ctx: &TenantContext, cmd: CreateUnitCommand) -> AppResult<Unit>;
    fn get_unit(&self, ctx: &TenantContext, unit_id: Uuid) -> AppResult<Unit>;
    fn list_units(&self, ctx: &TenantContext, property_id: Option<Uuid>) -> AppResult<Vec<Unit>>;
    fn list_available_units(&self, ctx: &TenantContext) -> AppResult<Vec<Unit>>;
    fn update_unit_occupancy(
        &self,
        ctx: &TenantContext,
        unit_id: Uuid,
        status: UnitStatus,
        tenant_id: Option<Uuid>,
        lease_id: Option<Uuid>,
    ) -> AppResult<Unit>;
}

#[derive(Default)]
pub struct InMemoryPropertyUnitStore {
    properties: Arc<RwLock<HashMap<Uuid, Property>>>,
    buildings: Arc<RwLock<HashMap<Uuid, Building>>>,
    floors: Arc<RwLock<HashMap<Uuid, Floor>>>,
    units: Arc<RwLock<HashMap<Uuid, Unit>>>,
}

impl InMemoryPropertyUnitStore {
    pub fn new() -> Self {
        Self::default()
    }
}

impl PropertyRepository for InMemoryPropertyUnitStore {
    fn create_property(&self, ctx: &TenantContext, cmd: CreatePropertyCommand) -> AppResult<Property> {
        ctx.require_permission("properties.create")?;
        if cmd.name.trim().is_empty() || cmd.code.trim().is_empty() {
            return Err(AppError::Validation(
                "Property code and name are required".to_string(),
            ));
        }
        let mut guard = self.properties.write().unwrap_or_else(|e| e.into_inner());
        if guard
            .values()
            .any(|p| p.organization_id == ctx.organization_id && p.code.eq_ignore_ascii_case(&cmd.code))
        {
            return Err(AppError::Conflict(format!(
                "Property with code '{}' already exists in this organization",
                cmd.code
            )));
        }

        let prop = Property {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            code: cmd.code.trim().to_uppercase(),
            name: cmd.name.trim().to_string(),
            county: cmd.county.trim().to_string(),
            estate_or_area: cmd.estate_or_area.trim().to_string(),
            physical_address: cmd.physical_address.trim().to_string(),
            lr_number: cmd.lr_number,
            description: cmd.description,
            amenities: cmd.amenities,
            management_commission_pct: cmd.management_commission_pct,
            created_at: Utc::now(),
        };
        guard.insert(prop.id, prop.clone());
        Ok(prop)
    }

    fn get_property(&self, ctx: &TenantContext, property_id: Uuid) -> AppResult<Property> {
        ctx.require_permission("properties.view")?;
        let prop = self
            .properties
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&property_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Property not found".to_string()))?;
        ctx.assert_owns_record(prop.organization_id)?;
        Ok(prop)
    }

    fn list_properties(&self, ctx: &TenantContext) -> AppResult<Vec<Property>> {
        ctx.require_permission("properties.view")?;
        Ok(self
            .properties
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|p| p.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }

    fn create_building(&self, ctx: &TenantContext, cmd: CreateBuildingCommand) -> AppResult<Building> {
        ctx.require_permission("properties.create")?;
        let prop = self.get_property(ctx, cmd.property_id)?;
        ctx.assert_owns_record(prop.organization_id)?;

        let mut guard = self.buildings.write().unwrap_or_else(|e| e.into_inner());
        if guard.values().any(|b| {
            b.property_id == cmd.property_id && b.code.eq_ignore_ascii_case(cmd.code.trim())
        }) {
            return Err(AppError::Conflict(format!(
                "Building code '{}' already exists in property",
                cmd.code
            )));
        }

        let building = Building {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            code: cmd.code.trim().to_uppercase(),
            name: cmd.name.trim().to_string(),
            total_floors: cmd.total_floors.max(1),
            created_at: Utc::now(),
        };
        guard.insert(building.id, building.clone());
        Ok(building)
    }

    fn list_buildings(
        &self,
        ctx: &TenantContext,
        property_id: Option<Uuid>,
    ) -> AppResult<Vec<Building>> {
        ctx.require_permission("properties.view")?;
        Ok(self
            .buildings
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|b| {
                b.organization_id == ctx.organization_id
                    && property_id.map_or(true, |pid| b.property_id == pid)
            })
            .cloned()
            .collect())
    }

    fn create_floor(&self, ctx: &TenantContext, cmd: CreateFloorCommand) -> AppResult<Floor> {
        ctx.require_permission("properties.create")?;
        let _prop = self.get_property(ctx, cmd.property_id)?;
        let building = self
            .buildings
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&cmd.building_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Building not found".to_string()))?;
        ctx.assert_owns_record(building.organization_id)?;

        let mut guard = self.floors.write().unwrap_or_else(|e| e.into_inner());
        if guard
            .values()
            .any(|f| f.building_id == cmd.building_id && f.floor_number == cmd.floor_number)
        {
            return Err(AppError::Conflict(format!(
                "Floor {} already exists in this building",
                cmd.floor_number
            )));
        }

        let floor = Floor {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            building_id: cmd.building_id,
            floor_number: cmd.floor_number,
            label: cmd.label.trim().to_string(),
            created_at: Utc::now(),
        };
        guard.insert(floor.id, floor.clone());
        Ok(floor)
    }

    fn list_floors(&self, ctx: &TenantContext, building_id: Option<Uuid>) -> AppResult<Vec<Floor>> {
        ctx.require_permission("properties.view")?;
        Ok(self
            .floors
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|f| {
                f.organization_id == ctx.organization_id
                    && building_id.map_or(true, |bid| f.building_id == bid)
            })
            .cloned()
            .collect())
    }
}

impl UnitRepository for InMemoryPropertyUnitStore {
    fn create_unit(&self, ctx: &TenantContext, cmd: CreateUnitCommand) -> AppResult<Unit> {
        ctx.require_permission("properties.create")?;
        if cmd.monthly_rent_kes <= Decimal::ZERO {
            return Err(AppError::Validation(
                "Monthly rent must be greater than KES 0".to_string(),
            ));
        }
        let prop = self.get_property(ctx, cmd.property_id)?;
        ctx.assert_owns_record(prop.organization_id)?;

        let mut guard = self.units.write().unwrap_or_else(|e| e.into_inner());
        if guard.values().any(|u| {
            u.organization_id == ctx.organization_id
                && u.building_id == cmd.building_id
                && u.unit_number.eq_ignore_ascii_case(cmd.unit_number.trim())
        }) {
            return Err(AppError::Conflict(format!(
                "Unit '{}' already exists in this building",
                cmd.unit_number
            )));
        }

        let unit = Unit {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            property_id: cmd.property_id,
            building_id: cmd.building_id,
            floor_id: cmd.floor_id,
            unit_number: cmd.unit_number.trim().to_uppercase(),
            unit_type: cmd.unit_type,
            bedrooms: cmd.bedrooms,
            bathrooms: cmd.bathrooms.max(1),
            monthly_rent_kes: cmd.monthly_rent_kes,
            deposit_amount_kes: cmd.deposit_amount_kes,
            currency: "KES".to_string(),
            status: UnitStatus::Vacant,
            water_meter_number: cmd.water_meter_number,
            kplc_meter_number: cmd.kplc_meter_number,
            current_tenant_id: None,
            current_lease_id: None,
            created_at: Utc::now(),
        };
        guard.insert(unit.id, unit.clone());
        Ok(unit)
    }

    fn get_unit(&self, ctx: &TenantContext, unit_id: Uuid) -> AppResult<Unit> {
        ctx.require_permission("properties.view")?;
        let unit = self
            .units
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&unit_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Unit not found".to_string()))?;
        ctx.assert_owns_record(unit.organization_id)?;
        Ok(unit)
    }

    fn list_units(&self, ctx: &TenantContext, property_id: Option<Uuid>) -> AppResult<Vec<Unit>> {
        ctx.require_permission("properties.view")?;
        Ok(self
            .units
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|u| {
                u.organization_id == ctx.organization_id
                    && property_id.map_or(true, |pid| u.property_id == pid)
            })
            .cloned()
            .collect())
    }

    fn list_available_units(&self, ctx: &TenantContext) -> AppResult<Vec<Unit>> {
        ctx.require_permission("properties.view")?;
        Ok(self
            .units
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|u| u.organization_id == ctx.organization_id && u.status == UnitStatus::Vacant)
            .cloned()
            .collect())
    }

    fn update_unit_occupancy(
        &self,
        ctx: &TenantContext,
        unit_id: Uuid,
        status: UnitStatus,
        tenant_id: Option<Uuid>,
        lease_id: Option<Uuid>,
    ) -> AppResult<Unit> {
        let mut guard = self.units.write().unwrap_or_else(|e| e.into_inner());
        let unit = guard
            .get_mut(&unit_id)
            .ok_or_else(|| AppError::NotFound("Unit not found".to_string()))?;
        ctx.assert_owns_record(unit.organization_id)?;
        unit.status = status;
        unit.current_tenant_id = tenant_id;
        unit.current_lease_id = lease_id;
        Ok(unit.clone())
    }
}
