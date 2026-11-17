import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Calendar, Plus, Search, Filter, ChevronRight, CheckCircle2, AlertCircle, Clock, FileText, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { formatKes, formatNairobiDate } from '../lib/formatters';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { Lease, LeaseStatus } from '../types';

export const LeasesBookingsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState } = useRms();
  const { id: detailLeaseId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Lease Form State
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [monthlyRentKes, setMonthlyRentKes] = useState(35000);
  const [depositAmountKes, setDepositAmountKes] = useState(35000);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === currentOrg.id),
    [state.leases, currentOrg.id]
  );
  const orgTenants = useMemo(
    () => state.tenants.filter((t) => t.organization_id === currentOrg.id),
    [state.tenants, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => state.units.filter((u) => u.organization_id === currentOrg.id),
    [state.units, currentOrg.id]
  );
  const orgProperties = useMemo(
    () => state.properties.filter((p) => p.organization_id === currentOrg.id),
    [state.properties, currentOrg.id]
  );

  // Sub-path filter based on URL (/active or /pending)
  const isPendingView = location.pathname.includes('/pending');
  const isActiveView = location.pathname.includes('/active');

  const filteredLeases = useMemo(() => {
    return orgLeases.filter((l) => {
      if (isActiveView && l.status !== 'ACTIVE') return false;
      if (isPendingView && l.status !== 'PENDING_APPROVAL' && l.status !== 'DRAFT') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const tenant = orgTenants.find((t) => t.id === l.tenant_id);
      const unit = orgUnits.find((u) => u.id === l.unit_id);
      return (
        l.id.toLowerCase().includes(q) ||
        (tenant?.full_name && tenant.full_name.toLowerCase().includes(q)) ||
        (unit?.unit_number && unit.unit_number.toLowerCase().includes(q))
      );
    });
  }, [orgLeases, isActiveView, isPendingView, searchQuery, orgTenants, orgUnits]);

  // Selected lease detail view if :id is provided
  const activeDetailLease = useMemo(() => {
    if (!detailLeaseId) return null;
    return orgLeases.find((l) => l.id === detailLeaseId) || null;
  }, [detailLeaseId, orgLeases]);

  const handleCreateLease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId || !selectedTenantId) return;

    const newLease: Lease = {
      id: `lse-${Date.now()}`,
      organization_id: currentOrg.id,
      property_id: orgUnits.find((u) => u.id === selectedUnitId)?.property_id || '',
      unit_id: selectedUnitId,
      tenant_id: selectedTenantId,
      start_date: startDate,
      end_date: endDate,
      monthly_rent_kes: monthlyRentKes,
      security_deposit_kes: depositAmountKes,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      leases: [newLease, ...prev.leases],
      units: prev.units.map((u) => (u.id === selectedUnitId ? { ...u, status: 'OCCUPIED' } : u)),
    }));

    setIsCreateModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/leases-bookings"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: !isActiveView && !isPendingView ? '#ffffff' : 'transparent',
              color: !isActiveView && !isPendingView ? '#0f172a' : '#64748b',
              boxShadow: !isActiveView && !isPendingView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            All Leases ({orgLeases.length})
          </Link>
          <Link
            to="/app/leases-bookings/active"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isActiveView ? '#ffffff' : 'transparent',
              color: isActiveView ? '#0f172a' : '#64748b',
              boxShadow: isActiveView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Active ({orgLeases.filter((l) => l.status === 'ACTIVE').length})
          </Link>
          <Link
            to="/app/leases-bookings/pending"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isPendingView ? '#ffffff' : 'transparent',
              color: isPendingView ? '#0f172a' : '#64748b',
              boxShadow: isPendingView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Pending Approval ({orgLeases.filter((l) => l.status === 'PENDING_APPROVAL' || l.status === 'DRAFT').length})
          </Link>
        </div>

        {hasPermission('leases.create') && (
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Create New Lease</span>
          </button>
        )}
      </div>

      {/* Detail Drawer / Modal if route is /app/leases-bookings/:id */}
      {activeDetailLease && (
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
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Lease Record #{activeDetailLease.id}
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.2rem', fontWeight: 700 }}>
                {orgTenants.find((t) => t.id === activeDetailLease.tenant_id)?.full_name || 'Tenant Lease'}
              </h2>
            </div>
            <Link to="/app/leases-bookings" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close Detail
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Unit</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                Unit {orgUnits.find((u) => u.id === activeDetailLease.unit_id)?.unit_number || '—'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly Rent</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#16a34a' }}>
                {formatKes(activeDetailLease.monthly_rent_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Security Deposit Held</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2563eb' }}>
                {formatKes(activeDetailLease.security_deposit_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lease Duration</div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>
                {formatNairobiDate(activeDetailLease.start_date)} &rarr; {formatNairobiDate(activeDetailLease.end_date)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <section className="surface-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by tenant name, unit number, or lease ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <ResponsiveTable
          caption="Lease contracts, terms, monthly rent and statuses"
          headers={['Tenant', 'Property & Unit', 'Duration', 'Monthly Rent', 'Deposit', 'Status', 'Actions']}
        >
          {filteredLeases.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                No lease agreements found matching current filter criteria.
              </td>
            </tr>
          ) : (
            filteredLeases.map((lease) => {
              const tenant = orgTenants.find((t) => t.id === lease.tenant_id);
              const unit = orgUnits.find((u) => u.id === lease.unit_id);
              const prop = orgProperties.find((p) => p.id === lease.property_id);

              return (
                <tr key={lease.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        className="profile-avatar"
                        style={{ inlineSize: '32px', blockSize: '32px', fontSize: '0.74rem' }}
                      >
                        {(tenant?.full_name || 'TN').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                          {tenant?.full_name || 'Registered Tenant'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {tenant?.phone || tenant?.email || '—'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                      {prop?.name || 'Property'} &bull; Unit {unit?.unit_number || '—'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {unit?.unit_type || 'Residential'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {formatNairobiDate(lease.start_date)} &bull; {formatNairobiDate(lease.end_date)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    {formatKes(lease.monthly_rent_kes)}
                  </td>
                  <td style={{ fontWeight: 600, color: '#2563eb' }}>
                    {formatKes(lease.security_deposit_kes)}
                  </td>
                  <td>
                    <StatusBadge
                      status={lease.status}
                      tone={lease.status === 'ACTIVE' ? 'success' : lease.status === 'PENDING_APPROVAL' ? 'warning' : 'neutral'}
                    />
                  </td>
                  <td>
                    <Link
                      to={`/app/leases-bookings/${lease.id}`}
                      className="btn-outline"
                      style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </ResponsiveTable>
      </section>

      {/* Create Lease Modal */}
      {isCreateModalOpen && (
        <ModalDialog
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Lease Agreement"
        >
          <form onSubmit={handleCreateLease} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="field-group">
              <label>Select Unit</label>
              <select
                className="form-control"
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                required
              >
                <option value="">-- Choose Vacant Unit --</option>
                {orgUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unit_number} ({u.status}) &bull; KES {Number(u.rent_amount_kes).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Select Tenant</label>
              <select
                className="form-control"
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(e.target.value)}
                required
              >
                <option value="">-- Choose Tenant --</option>
                {orgTenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name} ({t.phone})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Monthly Rent (KES)</label>
                <input
                  type="number"
                  className="form-control"
                  value={monthlyRentKes}
                  onChange={(e) => setMonthlyRentKes(Number(e.target.value))}
                  required
                />
              </div>

              <div className="field-group">
                <label>Security Deposit (Account 2100)</label>
                <input
                  type="number"
                  className="form-control"
                  value={depositAmountKes}
                  onChange={(e) => setDepositAmountKes(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Activate Lease
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
