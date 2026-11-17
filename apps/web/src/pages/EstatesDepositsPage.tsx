import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MapPin, RotateCcw, ShieldCheck, Search, Plus, ChevronRight, AlertTriangle, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { formatKes, formatNairobiDate } from '../lib/formatters';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';

export const EstatesDepositsPage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState } = useRms();
  const { id: detailDepositId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  // Refund Form State
  const [refundLeaseId, setRefundLeaseId] = useState('');
  const [damageDeductionKes, setDamageDeductionKes] = useState(0);
  const [utilityDeductionKes, setUtilityDeductionKes] = useState(0);
  const [refundReason, setRefundReason] = useState('End of tenancy vacating handover');

  const isRefundsView = location.pathname.includes('/refunds');

  const orgDeposits = useMemo(
    () => state.securityDeposits.filter((d) => d.organization_id === currentOrg.id),
    [state.securityDeposits, currentOrg.id]
  );
  const orgTenants = useMemo(
    () => state.tenants.filter((t) => t.organization_id === currentOrg.id),
    [state.tenants, currentOrg.id]
  );
  const orgUnits = useMemo(
    () => state.units.filter((u) => u.organization_id === currentOrg.id),
    [state.units, currentOrg.id]
  );
  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === currentOrg.id),
    [state.leases, currentOrg.id]
  );

  const totalDepositsHeldKes = useMemo(
    () => orgDeposits.reduce((acc, d) => acc + (Number(d.current_liability_balance_kes) || 0), 0),
    [orgDeposits]
  );

  const filteredDeposits = useMemo(() => {
    if (!searchQuery.trim()) return orgDeposits;
    const q = searchQuery.toLowerCase();
    return orgDeposits.filter((d) => {
      const tenant = orgTenants.find((t) => t.id === d.tenant_id);
      return (
        d.id.toLowerCase().includes(q) ||
        (tenant?.full_name && tenant.full_name.toLowerCase().includes(q))
      );
    });
  }, [orgDeposits, searchQuery, orgTenants]);

  // Selected Deposit Details if :id is provided
  const activeDetailDeposit = useMemo(() => {
    if (!detailDepositId) return null;
    return orgDeposits.find((d) => d.id === detailDepositId) || null;
  }, [detailDepositId, orgDeposits]);

  const selectedDepositForRefund = useMemo(() => {
    if (!refundLeaseId) return orgDeposits[0] || null;
    return orgDeposits.find((d) => d.lease_id === refundLeaseId) || null;
  }, [orgDeposits, refundLeaseId]);

  const heldDeposit = selectedDepositForRefund ? Number(selectedDepositForRefund.current_liability_balance_kes) : 0;
  const netRefundKes = Math.max(0, heldDeposit - (Number(damageDeductionKes) + Number(utilityDeductionKes)));

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepositForRefund) return;

    setState((prev) => ({
      ...prev,
      securityDeposits: prev.securityDeposits.map((d) => {
        if (d.id !== selectedDepositForRefund.id) return d;
        const prevRefunded = Number(d.total_refunded_kes) || 0;
        const prevDeductions = Number(d.total_deductions_kes) || 0;
        const newDeductions = prevDeductions + Number(damageDeductionKes) + Number(utilityDeductionKes);
        const newRefunded = prevRefunded + netRefundKes;
        const newBalance = Math.max(0, Number(d.initial_deposit_kes) - newDeductions - newRefunded);

        return {
          ...d,
          total_deductions_kes: newDeductions,
          total_refunded_kes: newRefunded,
          current_liability_balance_kes: newBalance,
          updated_at: new Date().toISOString(),
        };
      }),
    }));

    setIsRefundModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/estates-deposits"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: !isRefundsView ? '#ffffff' : 'transparent',
              color: !isRefundsView ? '#0f172a' : '#64748b',
              boxShadow: !isRefundsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Deposits Held ({orgDeposits.length})
          </Link>
          <Link
            to="/app/estates-deposits/refunds"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isRefundsView ? '#ffffff' : 'transparent',
              color: isRefundsView ? '#0f172a' : '#64748b',
              boxShadow: isRefundsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Refunds & Deductions
          </Link>
        </div>

        {hasPermission('expenses.approve') && (
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsRefundModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} />
            <span>Process Move-Out Refund</span>
          </button>
        )}
      </div>

      {/* Account 2100 Invariant Card */}
      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={24} color="#2563eb" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a' }}>
              Account 2100: Tenant Security Deposit Liabilities
            </div>
            <div style={{ fontSize: '0.76rem', color: '#3b82f6' }}>
              Statutory Kenyan Landlord & Tenant Act: Held in trust, segregated strictly from Rental Revenue (Account 4000).
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#1e3a8a', fontWeight: 600 }}>Total Liability Balance</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d4ed8' }}>
            {formatKes(totalDepositsHeldKes)}
          </div>
        </div>
      </div>

      {/* Deposit Detail Drawer if :id provided */}
      {activeDetailDeposit && (
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
                Deposit Ledger #{activeDetailDeposit.id}
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                {orgTenants.find((t) => t.id === activeDetailDeposit.tenant_id)?.full_name || 'Tenant Deposit'}
              </h2>
            </div>
            <Link to="/app/estates-deposits" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Initial Deposit Received</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
                {formatKes(activeDetailDeposit.initial_deposit_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Liability Held</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2563eb' }}>
                {formatKes(activeDetailDeposit.current_liability_balance_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Deductions</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#dc2626' }}>
                {formatKes(activeDetailDeposit.total_deductions_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Refunded</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' }}>
                {formatKes(activeDetailDeposit.total_refunded_kes)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <section className="surface-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search deposits by tenant name or ledger ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
            />
          </div>
        </div>

        <ResponsiveTable
          caption="Security deposit liability ledgers, refunds, and move-out deductions"
          headers={['Tenant', 'Unit', 'Initial Deposit', 'Deductions', 'Refunded', 'Liability Balance', 'Actions']}
        >
          {filteredDeposits.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                No security deposit records found.
              </td>
            </tr>
          ) : (
            filteredDeposits.map((d) => {
              const tenant = orgTenants.find((t) => t.id === d.tenant_id);
              const lease = orgLeases.find((l) => l.id === d.lease_id);
              const unit = lease ? orgUnits.find((u) => u.id === lease.unit_id) : null;

              return (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>
                      {tenant?.full_name || 'Tenant'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Lease #{d.lease_id.slice(0, 10)}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {unit ? `Unit ${unit.unit_number}` : '—'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{formatKes(d.initial_deposit_kes)}</td>
                  <td style={{ color: '#dc2626', fontWeight: 600 }}>{formatKes(d.total_deductions_kes)}</td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>{formatKes(d.total_refunded_kes)}</td>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>
                    {formatKes(d.current_liability_balance_kes)}
                  </td>
                  <td>
                    <Link
                      to={`/app/estates-deposits/${d.id}`}
                      className="btn-outline"
                      style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                    >
                      Audit
                    </Link>
                  </td>
                </tr>
              );
            })
          )}
        </ResponsiveTable>
      </section>

      {/* Move-out Refund Modal */}
      {isRefundModalOpen && (
        <ModalDialog
          isOpen={isRefundModalOpen}
          onClose={() => setIsRefundModalOpen(false)}
          title="Process Move-Out Deposit Refund"
        >
          <form onSubmit={handleProcessRefund} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="field-group">
              <label>Select Tenant Lease</label>
              <select
                className="form-control"
                value={refundLeaseId}
                onChange={(e) => setRefundLeaseId(e.target.value)}
                required
              >
                <option value="">-- Choose Tenant Deposit --</option>
                {orgDeposits.map((d) => {
                  const t = orgTenants.find((tenant) => tenant.id === d.tenant_id);
                  return (
                    <option key={d.id} value={d.lease_id}>
                      {t?.full_name || 'Tenant'} &bull; Balance: KES {Number(d.current_liability_balance_kes).toLocaleString()}
                    </option>
                  );
                })}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Damage Deductions (KES)</label>
                <input
                  type="number"
                  className="form-control"
                  value={damageDeductionKes}
                  onChange={(e) => setDamageDeductionKes(Number(e.target.value))}
                />
              </div>

              <div className="field-group">
                <label>Utility Arrears (KES)</label>
                <input
                  type="number"
                  className="form-control"
                  value={utilityDeductionKes}
                  onChange={(e) => setUtilityDeductionKes(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                <span>Held Liability:</span>
                <span>KES {heldDeposit.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#dc2626' }}>
                <span>Deductions:</span>
                <span>- KES {(Number(damageDeductionKes) + Number(utilityDeductionKes)).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#16a34a', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                <span>Net Refund to Tenant:</span>
                <span>KES {netRefundKes.toLocaleString()}</span>
              </div>
            </div>

            <div className="field-group">
              <label>Reason / Notes</label>
              <textarea
                className="form-control"
                rows={2}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsRefundModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Authorize & Disburse
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
