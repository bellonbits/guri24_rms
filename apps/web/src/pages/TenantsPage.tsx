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
    () => (state?.tenants || []).filter((t) => t.organization_id === currentOrg.id),
    [state?.tenants, currentOrg.id]
  );
  const orgLeases = useMemo(
    () => (state?.leases || []).filter((l) => l.organization_id === currentOrg.id),
    [state?.leases, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => (state?.units || []).filter((u) => u.organization_id === currentOrg.id),
    [state?.units, currentOrg.id]
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

      {/* Tenant Detail Modal / Inline View matching reference design */}
      {activeDetailTenant && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Header row from reference screenshot */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                Tenant Details
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rent Details :</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {activeTenantLease ? formatKes(activeTenantLease.monthly_rent_kes) + '/month' : '$5000/month'}
                </span>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                  }}
                >
                  Paid
                </span>
              </div>
              <Link to="/app/tenants" className="btn-outline" style={{ textDecoration: 'none', padding: '6px 14px', borderRadius: '8px' }}>
                Close
              </Link>
            </div>
          </div>

          {/* Two-Column Grid matching Screenshot 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '24px' }}>
            {/* LEFT COLUMN: Personal Details, Lease Agreement, Additional Details */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                  alt={activeDetailTenant.full_name}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e2e8f0',
                  }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {activeDetailTenant.full_name}
                  </h3>
                </div>
              </div>

              {/* Personal Details Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Personal Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Contact No. :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{activeDetailTenant.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Emergency No. :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Email Id :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{activeDetailTenant.email || 'courtneyh@gmail.com'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Current Address :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>9865 Aurore Expressway</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Occupation :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9' }} />

              {/* Lease Agreement Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Lease Agreement</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Start Date :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {activeTenantLease?.start_date || '21 June 2023'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ color: '#64748b' }}>Lease document :</span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px',
                      }}
                    >
                      <FileText size={15} color="#ef4444" />
                      <div style={{ lineHeight: 1.1 }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0f172a', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Lease_document_Courtney.pdf
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>20 MB</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>End Date :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {activeTenantLease?.end_date || '21 June 2024'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Payment terms :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Monthly</span>
                  </div>
                </div>
              </div>

              <div style={{ height: '1px', background: '#f1f5f9' }} />

              {/* Additional Details Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Additional Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Guarantor Name :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Alexa Joseph</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Contact No. :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Allotted Parking :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Access Card No. :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>9834Y65</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Occupation :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Maintenance Requests & Payment History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Maintenance Requests Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    Maintenance Requests
                  </h4>
                  <Link to="/app/maintenance" style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                    View All
                  </Link>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Issue Description</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '10px 4px', color: '#0f172a', fontWeight: 500 }}>Leaky faucet in kitchen</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem' }}>
                          Pending
                        </span>
                      </td>
                      <td style={{ padding: '10px 4px', color: '#ef4444', fontWeight: 600 }}>High</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '10px 4px', color: '#0f172a', fontWeight: 500 }}>Broken AC unit in bedroom</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span style={{ background: '#ccfbf1', color: '#0f766e', padding: '2px 6px', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem' }}>
                          In Progress
                        </span>
                      </td>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>Normal</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>23-06-20</td>
                      <td style={{ padding: '10px 4px', color: '#0f172a', fontWeight: 500 }}>Broken garage door opener</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem' }}>
                          Pending
                        </span>
                      </td>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>Normal</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment History Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1f5f9',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    Payment History
                  </h4>
                  <Link to="/app/rent-collection" style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                    View All
                  </Link>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                  <thead>
                    <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Date</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Amount</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Payment Method</th>
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>23-06-2024</td>
                      <td style={{ padding: '10px 4px', fontWeight: 700, color: '#0f172a' }}>$5000</td>
                      <td style={{ padding: '10px 4px', color: '#475569' }}>Online</td>
                      <td style={{ padding: '10px 4px' }}>
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '10px', fontWeight: 600, fontSize: '0.7rem' }}>
                          Overdue
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 4px', color: '#64748b' }}>23-06-2024</td>
                      <td style={{ padding: '10px 4px', fontWeight: 700, color: '#0f172a' }}>$5000</td>
                      <td style={{ padding: '10px 4px', color: '#475569' }}>Check</td>
                      <td style={{ padding: '10px 4px', color: '#10b981', fontWeight: 600 }}>Paid</td>
                    </tr>
                  </tbody>
                </table>
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
