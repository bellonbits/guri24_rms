import React, { useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { FinancialOperationsWorkspace, FinancialTab } from '../components/FinancialOperationsWorkspace';
import { processVerifiedMpesaPayment } from '../lib/api';
import { apiClient } from '../lib/apiClient';
import { formatKes, formatNairobiDate } from '../lib/formatters';

export const PaymentsMpesaPage: React.FC = () => {
  const { currentOrg, currentUserRole } = useAuth();
  const { state, setState, loadWorkspaceSnapshot } = useRms();
  const location = useLocation();
  const navigate = useNavigate();
  const { id: detailTxId } = useParams<{ id?: string }>();

  // Map sub-route to FinancialOperationsWorkspace tab
  const currentTab: FinancialTab = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/transactions')) return 'transactions';
    if (path.includes('/invoices')) return 'invoices';
    if (path.includes('/allocations')) return 'allocation';
    if (path.includes('/reconciliation')) return 'reconciliation';
    if (path.includes('/deposits')) return 'deposits';
    if (path.includes('/refunds')) return 'refunds';
    return 'overview';
  }, [location.pathname]);

  const handleTabChange = (tab: FinancialTab) => {
    switch (tab) {
      case 'transactions':
        navigate('/app/payments-mpesa/transactions');
        break;
      case 'invoices':
        navigate('/app/payments-mpesa/invoices');
        break;
      case 'allocation':
        navigate('/app/payments-mpesa/allocations');
        break;
      case 'reconciliation':
        navigate('/app/payments-mpesa/reconciliation');
        break;
      default:
        navigate('/app/payments-mpesa');
        break;
    }
  };

  // Transaction details if :id is provided
  const detailPayment = useMemo(() => {
    if (!detailTxId) return null;
    return state.payments.find((p) => p.id === detailTxId) || null;
  }, [detailTxId, state.payments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Transaction Details Banner if route is /app/payments-mpesa/:id */}
      {detailPayment && (
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
                M-Pesa / Bank Transaction Details
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                {detailPayment.mpesa_receipt_number || detailPayment.transaction_reference}
              </h2>
            </div>
            <Link to="/app/payments-mpesa/transactions" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Amount Paid</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#16a34a' }}>
                {formatKes(detailPayment.amount_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Allocated to Invoices</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2563eb' }}>
                {formatKes(detailPayment.allocated_amount_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unallocated Balance</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: Number(detailPayment.unallocated_amount_kes) > 0 ? '#ea580c' : '#64748b' }}>
                {formatKes(detailPayment.unallocated_amount_kes)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Payment Method</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                {detailPayment.payment_method}
              </div>
            </div>
          </div>
        </div>
      )}

      <FinancialOperationsWorkspace
        currentOrg={currentOrg}
        userRole={currentUserRole || 'PROPERTY_ADMIN'}
        properties={state?.properties || []}
        tenants={state?.tenants || []}
        leases={state?.leases || []}
        invoices={state?.invoices || []}
        payments={state?.payments || []}
        deposits={state?.deposits || state?.securityDeposits || []}
        journals={state?.journals || state?.journalEntries || []}
        initialTab={currentTab}
        onTabChange={handleTabChange}
        onAllocatePayment={async (paymentId, allocations) => {
          setState((prev) => {
            const nextPays = prev.payments.map((p) => {
              if (p.id !== paymentId) return p;
              const newlyAllocated = allocations.reduce((s, a) => s + a.amount_kes, 0);
              const prevAlloc = Number(p.allocated_amount_kes) || 0;
              const newAllocTotal = prevAlloc + newlyAllocated;
              const unalloc = Math.max(0, Number(p.amount_kes) - newAllocTotal);
              return {
                ...p,
                allocated_amount_kes: newAllocTotal,
                unallocated_amount_kes: unalloc,
                allocations: [...p.allocations, ...allocations.map((a) => ({
                  id: `alc-${Date.now()}`,
                  invoice_id: a.invoice_id,
                  amount_kes: a.amount_kes,
                  allocated_at: new Date().toISOString(),
                }))],
              };
            });

            const nextInvs = prev.invoices.map((inv) => {
              const match = allocations.find((a) => a.invoice_id === inv.id);
              if (!match) return inv;
              const newPaid = (Number(inv.paid_amount_kes) || 0) + match.amount_kes;
              const total = Number(inv.total_amount_kes);
              const newBal = Math.max(0, total - newPaid);
              const newStatus = newBal <= 0 ? 'PAID' : 'PARTIALLY_PAID';
              return {
                ...inv,
                paid_amount_kes: newPaid,
                balance_kes: newBal,
                status: newStatus as any,
              };
            });

            return {
              ...prev,
              payments: nextPays,
              invoices: nextInvs,
            };
          });
        }}
        onRefresh={loadWorkspaceSnapshot}
      />
    </div>
  );
};
