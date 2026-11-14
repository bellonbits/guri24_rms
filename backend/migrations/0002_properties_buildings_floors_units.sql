-- =============================================================================
-- Migration 0002: Properties, Buildings, Floors, Units & Ownership
-- =============================================================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(180) NOT NULL,
    county VARCHAR(80) NOT NULL,
    sub_county VARCHAR(80),
    estate_or_area VARCHAR(120) NOT NULL,
    physical_address TEXT NOT NULL,
    lr_number VARCHAR(64), -- Kenyan Land Reference / Title number
    description TEXT,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    photos JSONB NOT NULL DEFAULT '[]'::jsonb,
    management_commission_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (management_commission_pct >= 0 AND management_commission_pct <= 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

CREATE TABLE property_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(180) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    kra_pin VARCHAR(32),
    payout_bank_name VARCHAR(120),
    payout_account_number VARCHAR(64),
    payout_mpesa_phone VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ownership_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES property_owners(id) ON DELETE CASCADE,
    ownership_percentage NUMERIC(5, 2) NOT NULL CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (property_id, owner_id, effective_from)
);

CREATE TABLE property_managers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (property_id, user_id)
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(120) NOT NULL,
    total_floors SMALLINT NOT NULL DEFAULT 1 CHECK (total_floors >= 1),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (property_id, code)
);

CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number SMALLINT NOT NULL,
    label VARCHAR(64) NOT NULL, -- e.g. "Ground Floor", "1st Floor"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (building_id, floor_number)
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    unit_number VARCHAR(32) NOT NULL,
    unit_type VARCHAR(64) NOT NULL DEFAULT 'TWO_BEDROOM' CHECK (unit_type IN ('BEDSITTER', 'STUDIO', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'FOUR_BEDROOM', 'MAISONETTE', 'PENTHOUSE')),
    bedrooms SMALLINT NOT NULL DEFAULT 1 CHECK (bedrooms >= 0),
    bathrooms SMALLINT NOT NULL DEFAULT 1 CHECK (bathrooms >= 1),
    size_sq_meters NUMERIC(10, 2),
    monthly_rent_kes NUMERIC(14, 2) NOT NULL CHECK (monthly_rent_kes > 0),
    deposit_amount_kes NUMERIC(14, 2) NOT NULL CHECK (deposit_amount_kes >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'KES',
    status VARCHAR(32) NOT NULL DEFAULT 'VACANT' CHECK (status IN ('VACANT', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE', 'UNAVAILABLE')),
    water_meter_number VARCHAR(64),
    kplc_meter_number VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, building_id, unit_number)
);

CREATE TABLE unit_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    amenity_name VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (unit_id, amenity_name)
);

CREATE TABLE unit_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL,
    caption VARCHAR(180),
    display_order SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_org ON properties(organization_id);
CREATE INDEX idx_buildings_property ON buildings(organization_id, property_id);
CREATE INDEX idx_floors_building ON floors(organization_id, building_id);
CREATE INDEX idx_units_org_status ON units(organization_id, status);
CREATE INDEX idx_units_property ON units(organization_id, property_id);
