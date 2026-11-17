import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Users, Plus, Search, Filter, Phone, Mail, ChevronRight, CheckCircle2, ShieldCheck, UserCheck, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { maskNationalId, normalizeKenyanPhone, formatKes } from '../lib/formatters';
import { Tenant } from '../types';

export const TenantsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState } = useRms();
  const { id: detailTenantId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');

  const isApplicationsView = location.pathname.includes('/applications');

  const orgTenants = useMemo(
    () => state.tenants.filter((t) => t.organization_id === currentOrg.id),
    [state.tenants, currentOrg.id]
  );
  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === currentOrg.id),
    [state.leases, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => state.units.filter((u) => u.organization_id === currentOrg.id),
    [state.units, currentOrg.id]
  );

  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim()) return orgTenants;
    const q = searchQuery.toLowerCase();
    return orgTenants.filter(
      (t) =>
        t.full_name.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.id_number && t.id_number.includes(q))
    );
  }, [orgTenants, searchQuery]);

  // Selected Tenant Details if :id is provided
  const activeDetailTenant = useMemo(() => {
    if (!detailTenantId) return null;
    return orgTenants.find((t) => t.id === detailTenantId) || null;
  }, [detailTenantId, orgTenants]);

  const activeTenantLease = useMemo(() => {
    if (!activeDetailTenant) return null;
    return orgLeases.find((l) => l.tenant_id === activeDetailTenant.id && l.status === 'ACTIVE');
  }, [activeDetailTenant, orgLeases]);

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const newTenant: Tenant = {
      id: `ten-${Date.now()}`,
      organization_id: currentOrg.id,
      full_name: fullName.trim(),
      phone: normalizeKenyanPhone(phone.trim()),
      email: email.trim() || undefined,
      id_number: nationalId.trim() || undefined,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      tenants: [newTenant, ...prev.tenants],
    }));

    setFullName('');
    setPhone('');
    setEmail('');
    setNationalId('');
    setIsAddTenantModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/tenants"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: !isApplicationsView ? '#ffffff' : 'transparent',
              color: !isApplicationsView ? '#0f172a' : '#64748b',
              boxShadow: !isApplicationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Registered Tenants ({orgTenants.length})
          </Link>
          <Link
            to="/app/tenants/applications"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isApplicationsView ? '#ffffff' : 'transparent',
              color: isApplicationsView ? '#0f172a' : '#64748b',
              boxShadow: isApplicationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Prospective Applications (0)
          </Link>
        </div>

        {hasPermission('tenants.create') && (
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsAddTenantModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add Tenant</span>
          </button>
        )}
      </div>

      {/* Tenant Detail Banner if :id provided */}
      {activeDetailTenant && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                className="profile-avatar"
                style={{ inlineSize: '42px', blockSize: '42px', fontSize: '0.95rem' }}
              >
                {activeDetailTenant.full_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                  {activeDetailTenant.full_name}
                </h2>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Tenant ID: {activeDetailTenant.id} &bull; Kenyan MSISDN: {activeDetailTenant.phone}
                </div>
              </div>
            </div>
            <Link to="/app/tenants" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>National ID (Kenyan Law)</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                {activeDetailTenant.id_number ? maskNationalId(activeDetailTenant.id_number) : 'Not Provided'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Lease</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: activeTenantLease ? '#16a34a' : '#94a3b8' }}>
                {activeTenantLease ? `Unit ${orgUnits.find((u) => u.id === activeTenantLease.unit_id)?.unit_number || '—'}` : 'No Active Lease'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly Commitment</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                {activeTenantLease ? formatKes(activeTenantLease.monthly_rent_kes) : 'KES 0.00'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      {isApplicationsView ? (
        <section className="surface-card" style={{ textAlign: 'center', padding: '48px 16px' }}>
          <UserCheck size={36} color="#94a3b8" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#0f172a' }}>No Pending Applications</h3>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
            All tenant onboarding applications have been verified and processed into active leases.
          </p>
        </section>
      ) : (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search tenants by full name, phone (+254), or ID number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <ResponsiveTable
            caption="Registered tenant records, contact details, and lease allocations"
            headers={['Tenant Name', 'Kenyan Phone (MSISDN)', 'Email Address', 'National ID', 'Active Unit', 'Actions']}
          >
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No tenants found in this organization. Click "Add Tenant" to onboard a new resident.
                </td>
              </tr>
            ) : (
              filteredTenants.map((t) => {
                const lease = orgLeases.find((l) => l.tenant_id === t.id && l.status === 'ACTIVE');
                const unit = lease ? orgUnits.find((u) => u.id === lease.unit_id) : null;

                return (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          className="profile-avatar"
                          style={{ inlineSize: '32px', blockSize: '32px', fontSize: '0.74rem' }}
                        >
                          {t.full_name.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.full_name}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: '0.82rem' }}>{t.phone}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{t.email || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                      {t.id_number ? maskNationalId(t.id_number) : '—'}
                    </td>
                    <td>
                      {unit ? (
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>Unit {unit.unit_number}</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>No Unit</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/app/tenants/${t.id}`}
                        className="btn-outline"
                        style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                      >
                        Profile
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </ResponsiveTable>
        </section>
      )}

      {/* Add Tenant Modal */}
      {isAddTenantModalOpen && (
        <ModalDialog
          isOpen={isAddTenantModalOpen}
          onClose={() => setIsAddTenantModalOpen(false)}
          title="Onboard New Kenyan Tenant"
        >
          <form onSubmit={handleAddTenant} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="field-group">
              <label>Full Legal Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Wanjiku Kamau"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Phone Number (M-Pesa 254...)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0712345678 or +254..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tenant@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="field-group">
              <label>Kenyan National ID / Passport</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 12345678"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsAddTenantModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Save Tenant Record
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
