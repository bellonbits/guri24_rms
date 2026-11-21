import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Building2, Plus, Search, Filter, Home, Layers, CheckCircle2, ChevronRight, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { formatKes } from '../lib/formatters';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { Property, Unit, UnitStatus } from '../types';

export const PropertiesUnitsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState, setImportWizardModule, setBulkGridModule } = useRms();
  const { id: detailId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

  // New Property form state
  const [propName, setPropName] = useState('');
  const [propCounty, setPropCounty] = useState('Nairobi');
  const [propZone, setPropZone] = useState('Westlands');
  const [propType, setPropType] = useState('MULTI_UNIT_RESIDENTIAL');

  // New Unit form state
  const [unitPropId, setUnitPropId] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [unitType, setUnitType] = useState('TWO_BEDROOM');
  const [unitBedrooms, setUnitBedrooms] = useState(2);
  const [unitRentKes, setUnitRentKes] = useState(40000);

  const isUnitsView = location.pathname.includes('/units');
  const isBuildingsView = location.pathname.includes('/buildings');
  const isPropertiesView = location.pathname.includes('/properties') || (!isUnitsView && !isBuildingsView);

  const orgProperties = useMemo(
    () => (state?.properties || []).filter((p) => p.organization_id === currentOrg.id),
    [state?.properties, currentOrg.id]
  );
  const orgBuildings = useMemo(
    () => (state?.buildings || []).filter((b) => b.organization_id === currentOrg.id),
    [state?.buildings, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => (state?.units || []).filter((u) => u.organization_id === currentOrg.id),
    [state?.units, currentOrg.id]
  );

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return orgProperties;
    const q = searchQuery.toLowerCase();
    return orgProperties.filter(
      (p) => p.name.toLowerCase().includes(q) || p.county.toLowerCase().includes(q)
    );
  }, [orgProperties, searchQuery]);

  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return orgUnits;
    const q = searchQuery.toLowerCase();
    return orgUnits.filter(
      (u) =>
        u.unit_number.toLowerCase().includes(q) ||
        u.unit_type.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
    );
  }, [orgUnits, searchQuery]);

  // Selected item detail view if :id is present
  const detailProperty = useMemo(() => {
    if (!detailId) return null;
    return orgProperties.find((p) => p.id === detailId) || null;
  }, [detailId, orgProperties]);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName.trim()) return;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      organization_id: currentOrg.id,
      name: propName.trim(),
      county: propCounty,
      estate_zone: propZone,
      property_type: propType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      properties: [newProp, ...prev.properties],
    }));

    setPropName('');
    setIsAddPropertyModalOpen(false);
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber.trim() || !unitPropId) return;

    const newUnit: Unit = {
      id: `unt-${Date.now()}`,
      organization_id: currentOrg.id,
      property_id: unitPropId,
      unit_number: unitNumber.trim(),
      unit_type: unitType,
      bedrooms: unitBedrooms,
      bathrooms: 1,
      rent_amount_kes: unitRentKes,
      status: 'VACANT',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      units: [newUnit, ...prev.units],
    }));

    setUnitNumber('');
    setIsAddUnitModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/properties-units/properties"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isPropertiesView ? '#ffffff' : 'transparent',
              color: isPropertiesView ? '#0f172a' : '#64748b',
              boxShadow: isPropertiesView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Properties ({orgProperties.length})
          </Link>
          <Link
            to="/app/properties-units/units"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isUnitsView ? '#ffffff' : 'transparent',
              color: isUnitsView ? '#0f172a' : '#64748b',
              boxShadow: isUnitsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Units ({orgUnits.length})
          </Link>
          <Link
            to="/app/properties-units/buildings"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isBuildingsView ? '#ffffff' : 'transparent',
              color: isBuildingsView ? '#0f172a' : '#64748b',
              boxShadow: isBuildingsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Buildings ({orgBuildings.length})
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {hasPermission('properties.create') && (
            <>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsAddPropertyModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add Property</span>
              </button>
              <button
                type="button"
                className="btn-dark"
                onClick={() => setIsAddUnitModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add Unit</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Property Details Card if :id is provided */}
      {detailProperty && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Property Details #{detailProperty.id}
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                {detailProperty.name}
              </h2>
            </div>
            <Link to="/app/properties-units/properties" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                {detailProperty.county}, {detailProperty.estate_zone}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Units</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2563eb' }}>
                {orgUnits.filter((u) => u.property_id === detailProperty.id).length} units
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Occupancy Rate</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#16a34a' }}>
                {(() => {
                  const pUnits = orgUnits.filter((u) => u.property_id === detailProperty.id);
                  if (pUnits.length === 0) return '100%';
                  const occ = pUnits.filter((u) => u.status === 'OCCUPIED').length;
                  return `${Math.round((occ / pUnits.length) * 100)}%`;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Properties or Units Table */}
      {isUnitsView ? (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search units by number, type, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setBulkGridModule('units')}
            >
              Excel Bulk Edit
            </button>
          </div>

          <ResponsiveTable
            caption="Units list with rent rates, occupancy, and bedrooms"
            headers={['Unit Number', 'Property', 'Type & Bedrooms', 'Rent Rate (KES)', 'Status', 'Actions']}
          >
            {filteredUnits.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No units recorded for this organization yet.
                </td>
              </tr>
            ) : (
              filteredUnits.map((u) => {
                const prop = orgProperties.find((p) => p.id === u.property_id);
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>Unit {u.unit_number}</td>
                    <td>{prop?.name || 'Assigned Property'}</td>
                    <td>{u.unit_type} ({u.bedrooms || 1} Bed)</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>{formatKes(u.rent_amount_kes)}</td>
                    <td>
                      <StatusBadge
                        status={u.status}
                        tone={u.status === 'OCCUPIED' ? 'success' : u.status === 'VACANT' ? 'info' : 'warning'}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ padding: '3px 8px', fontSize: '0.74rem' }}
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            units: prev.units.map((unit) =>
                              unit.id === u.id
                                ? { ...unit, status: unit.status === 'VACANT' ? 'OCCUPIED' : 'VACANT' }
                                : unit
                            ),
                          }));
                        }}
                      >
                        Toggle Vacancy
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </ResponsiveTable>
        </section>
      ) : isBuildingsView ? (
        <section className="surface-card">
          <div style={{ padding: '16px 0' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600 }}>Building Blocks & Wings</h3>
            {orgBuildings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                No separate building blocks registered. Single-structure estate layout active.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {orgBuildings.map((b) => (
                  <div key={b.id} style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{b.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Floors: {b.total_floors || 4}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search properties by name or county..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <ResponsiveTable
            caption="Managed properties, locations, and unit capacities"
            headers={['Property Name', 'Location', 'Property Type', 'Units Capacity', 'Actions']}
          >
            {filteredProperties.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No properties registered under this organization yet.
                </td>
              </tr>
            ) : (
              filteredProperties.map((p) => {
                const pUnits = orgUnits.filter((u) => u.property_id === p.id);
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</td>
                    <td>{p.county}, {p.estate_zone}</td>
                    <td>{p.property_type}</td>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{pUnits.length} units</td>
                    <td>
                      <Link
                        to={`/app/properties-units/${p.id}`}
                        className="btn-outline"
                        style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </ResponsiveTable>
        </section>
      )}

      {/* Add Property Modal */}
      {isAddPropertyModalOpen && (
        <ModalDialog
          isOpen={isAddPropertyModalOpen}
          onClose={() => setIsAddPropertyModalOpen(false)}
          title="Register New Property"
        >
          <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="field-group">
              <label>Property Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Parkview Residences"
                value={propName}
                onChange={(e) => setPropName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>County</label>
                <input
                  type="text"
                  className="form-control"
                  value={propCounty}
                  onChange={(e) => setPropCounty(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>Estate Zone / Suburb</label>
                <input
                  type="text"
                  className="form-control"
                  value={propZone}
                  onChange={(e) => setPropZone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsAddPropertyModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Save Property
              </button>
            </div>
          </form>
        </ModalDialog>
      )}

      {/* Add Unit Modal */}
      {isAddUnitModalOpen && (
        <ModalDialog
          isOpen={isAddUnitModalOpen}
          onClose={() => setIsAddUnitModalOpen(false)}
          title="Add New Residential Unit"
        >
          <form onSubmit={handleAddUnit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="field-group">
              <label>Parent Property</label>
              <select
                className="form-control"
                value={unitPropId}
                onChange={(e) => setUnitPropId(e.target.value)}
                required
              >
                <option value="">-- Choose Property --</option>
                {orgProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.county})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Unit Number / Door</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. A-102"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>Monthly Rent (KES)</label>
                <input
                  type="number"
                  className="form-control"
                  value={unitRentKes}
                  onChange={(e) => setUnitRentKes(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsAddUnitModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Save Unit
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
