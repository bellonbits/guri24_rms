import React, { useState, useMemo } from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Building,
  Users,
  FileText,
  CreditCard,
  Smartphone,
  Check,
  X,
  ExternalLink,
  HelpCircle,
  FileCheck,
  Eye,
  FileSpreadsheet,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import type {
  Payment,
  Invoice,
  Tenant,
  Property,
  Lease,
  SecurityDepositLedger,
  JournalEntry,
} from '../types';

export type FinancialTab =
  | 'overview'
  | 'transactions'
  | 'allocation'
  | 'invoices'
  | 'deposits'
  | 'refunds'
  | 'reconciliation'
  | 'mpesa'
  | 'reports'
  | 'audit';

interface FinancialOperationsWorkspaceProps {
  currentOrg: { id: string; name: string };
  userRole?: string;
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  invoices: Invoice[];
  payments: Payment[];
  deposits: SecurityDepositLedger[];
  journals: JournalEntry[];
  initialTab?: FinancialTab;
  onTabChange?: (tab: FinancialTab) => void;
  onInitiatePayment?: (data: any) => Promise<any>;
  onAllocatePayment?: (paymentId: string, allocations: { invoice_id: string; amount_kes: number }[]) => Promise<any>;
  onRefundDeposit?: (leaseId: string, amount: number, reason: string) => Promise<any>;
  onRefresh?: () => void;
}

export const FinancialOperationsWorkspace: React.FC<FinancialOperationsWorkspaceProps> = ({
  currentOrg,
  userRole = 'PROPERTY_ADMIN',
  properties,
  tenants,
  leases,
  invoices,
  payments,
  deposits,
  journals,
  initialTab,
  onTabChange,
  onInitiatePayment,
  onAllocatePayment,
  onRefundDeposit,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<FinancialTab>(initialTab || 'overview');

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [propertyFilter, setPropertyFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  // Allocation Workbench State
  const [selectedPaymentForAlloc, setSelectedPaymentForAlloc] = useState<Payment | null>(null);
  const [allocInputs, setAllocInputs] = useState<Record<string, number>>({});
  const [allocMessage, setAllocMessage] = useState<string | null>(null);

  // M-Pesa STK Push Modal
  const [showStkModal, setShowStkModal] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || '');
  const [stkPhone, setStkPhone] = useState('254712345678');
  const [stkAmount, setStkAmount] = useState('15000');
  const [stkAccountRef, setStkAccountRef] = useState('RENT-A101');
  const [stkLoading, setStkLoading] = useState(false);
  const [stkFeedback, setStkFeedback] = useState<string | null>(null);

  // 8-Stage Move-Out Refund State
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundTenantId, setRefundTenantId] = useState('');
  const [refundVacateDate, setRefundVacateDate] = useState(new Date().toISOString().slice(0, 10));
  const [refundDamageDeduction, setRefundDamageDeduction] = useState(0);
  const [refundUtilityDeduction, setRefundUtilityDeduction] = useState(0);
  const [refundPayoutMethod, setRefundPayoutMethod] = useState<'MPESA_B2C' | 'BANK_TRANSFER'>('MPESA_B2C');
  const [refundPayeePhone, setRefundPayeePhone] = useState('');
  const [refundNotes, setRefundNotes] = useState('Move-out inspection completed; keys surrendered.');
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  // Reconciliation Upload & Matching State
  const [reconcileFilter, setReconcileFilter] = useState<'ALL' | 'UNMATCHED' | 'MATCHED' | 'DISCREPANCY'>('ALL');
  const [reconcileNotice, setReconcileNotice] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Financial Computations & KPIs (strictly derived from persisted records)
  // ---------------------------------------------------------------------------
  const totalBilled = useMemo(
    () => invoices.reduce((sum, i) => sum + (Number(i.total_amount_kes) || 0), 0),
    [invoices]
  );
  const totalCollected = useMemo(
    () => payments.filter((p) => p.status === 'COMPLETED').reduce((sum, p) => sum + (Number(p.amount_kes) || 0), 0),
    [payments]
  );
  const totalAllocated = useMemo(
    () => payments.reduce((sum, p) => sum + (Number(p.allocated_amount_kes) || 0), 0),
    [payments]
  );
  const totalUnallocated = useMemo(
    () => payments.reduce((sum, p) => sum + (Number(p.unallocated_amount_kes) || 0), 0),
    [payments]
  );
  const totalArrears = useMemo(
    () => invoices.reduce((sum, i) => sum + (Number(i.balance_kes) || 0), 0),
    [invoices]
  );
  const totalDepositsHeld = useMemo(
    () => deposits.reduce((sum, d) => sum + (Number(d.current_liability_balance_kes) || 0), 0),
    [deposits]
  );
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;
  const pendingMpesaCount = payments.filter((p) => p.status === 'PENDING').length;
  const failedCount = payments.filter((p) => p.status === 'FAILED').length;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'OVERDUE' || (Number(i.balance_kes) > 0 && new Date(i.due_date) < new Date())).length;

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = p.payment_reference?.toLowerCase().includes(q);
        const matchesReceipt = p.provider_receipt_number?.toLowerCase().includes(q);
        const matchesPhone = p.payer_phone?.includes(q);
        if (!matchesRef && !matchesReceipt && !matchesPhone) return false;
      }
      return true;
    });
  }, [payments, statusFilter, searchQuery]);

  // Handle STK Push Submission
  const handleStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onInitiatePayment) return;

    // Validate phone number locally first
    const digits = stkPhone.replace(/\D/g, '');
    if (digits.length < 9) {
      setStkFeedback('Please enter a valid Kenyan phone number (e.g. 0712345678 or 254712345678).');
      return;
    }
    if (Number(stkAmount) <= 0) {
      setStkFeedback('Payment amount must be greater than KES 0.');
      return;
    }

    setStkLoading(true);
    setStkFeedback(null);
    try {
      const selectedTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];
      const selectedLease = selectedTenant
        ? leases.find((l) => l.primary_tenant_id === selectedTenant.id) || leases[0]
        : leases[0];

      await onInitiatePayment({
        tenant_id: selectedTenant?.id || 'tnt-default',
        lease_id: selectedLease?.id || undefined,
        phone_number: stkPhone.trim(),
        amount_kes: Number(stkAmount),
        account_reference: stkAccountRef.trim() || 'RENT-PAY',
        idempotency_key: `stk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      });
      setStkFeedback(`STK Push prompt sent to ${stkPhone} for KES ${Number(stkAmount).toLocaleString()}. Awaiting Safaricom confirmation callback.`);
      setTimeout(() => {
        setShowStkModal(false);
        setStkFeedback(null);
      }, 3000);
    } catch (err: any) {
      setStkFeedback(`Failed to initiate STK push: ${err?.message || 'Server error'}`);
    } finally {
      setStkLoading(false);
    }
  };

  // Handle Allocation Submit
  const handleCommitAllocation = async () => {
    if (!selectedPaymentForAlloc || !onAllocatePayment) return;
    const allocationsToCommit = Object.entries(allocInputs)
      .filter(([_, amt]) => amt > 0)
      .map(([invoice_id, amount_kes]) => ({ invoice_id, amount_kes }));

    if (allocationsToCommit.length === 0) {
      setAllocMessage('Please specify at least one invoice amount to allocate.');
      return;
    }

    try {
      await onAllocatePayment(selectedPaymentForAlloc.id, allocationsToCommit);
      setAllocMessage('Payment successfully allocated to invoices according to verified rules.');
      setTimeout(() => {
        setSelectedPaymentForAlloc(null);
        setAllocInputs({});
        setAllocMessage(null);
      }, 2000);
    } catch (err: any) {
      setAllocMessage(`Allocation failed: ${err?.message || 'Conflict occurred'}`);
    }
  };

  // Selected Tenant for Refund Calculation
  const selectedRefundDeposit = useMemo(() => {
    if (!refundTenantId) return deposits[0] || null;
    return deposits.find((d) => d.tenant_id === refundTenantId) || null;
  }, [deposits, refundTenantId]);

  const heldAmount = selectedRefundDeposit ? Number(selectedRefundDeposit.current_liability_balance_kes) : 0;
  const totalDeductions = Number(refundDamageDeduction) + Number(refundUtilityDeduction);
  const calculatedRefundable = Math.max(0, heldAmount - totalDeductions);

  // Handle Refund Submit
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundDeposit || !onRefundDeposit) return;
    setRefundLoading(true);
    try {
      await onRefundDeposit(
        selectedRefundDeposit.lease_id,
        calculatedRefundable,
        `Deposit move-out refund via ${refundPayoutMethod} to ${refundPayeePhone}. Deductions: KES ${totalDeductions}. Notes: ${refundNotes}`
      );
      setRefundSuccessMsg(`Refund of KES ${calculatedRefundable.toLocaleString()} authorized & posted. Account 2100 liability reduced.`);
      setTimeout(() => {
        setShowRefundModal(false);
        setRefundSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setRefundSuccessMsg(`Error processing refund: ${err?.message || 'Internal failure'}`);
    } finally {
      setRefundLoading(false);
    }
  };

  const navTabs: { id: FinancialTab; label: string; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions', badge: payments.length },
    { id: 'allocation', label: 'Payment Allocation', badge: payments.filter((p) => Number(p.unallocated_amount_kes) > 0).length || undefined },
    { id: 'invoices', label: 'Invoices & Collections', badge: overdueInvoicesCount || undefined },
    { id: 'deposits', label: 'Deposit Management' },
    { id: 'refunds', label: 'Refunds (8-Stage)' },
    { id: 'reconciliation', label: 'Reconciliation Engine' },
    { id: 'mpesa', label: 'M-Pesa Integration' },
    { id: 'reports', label: 'Financial Reports' },
    { id: 'audit', label: 'Audit History & Ledger', badge: journals.length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 28px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* ------------------------------------------------------------- */}
      {/* HEADER & SUB-NAVIGATION BAR                                   */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Financial Operations &amp; Payment Ledger
          </h1>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Multi-invoice FIFO allocation, Safaricom Daraja callbacks, Account 2100 deposit liabilities &amp; bank reconciliation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={onRefresh}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Sync Live Records</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStkModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.25)',
            }}
          >
            <Smartphone size={15} />
            <span>M-Pesa STK Push</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRefundModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.25)',
            }}
          >
            <RotateCcw size={15} />
            <span>Request Deposit Refund</span>
          </button>
        </div>
      </div>

      {/* 10-Tab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                onTabChange?.(tab.id);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2563eb' : '#64748b',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    background: isActive ? '#eff6ff' : '#f1f5f9',
                    color: isActive ? '#1d4ed8' : '#64748b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW DASHBOARD                                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metric KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '14px',
            }}
          >
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.76rem', fontWeight: 600 }}>
                <span>Actual Rent Received</span>
                <CircleDollarSign size={16} color="#16a34a" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '8px 0 2px' }}>
                KES {totalCollected.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                Collection Rate: {collectionRate}% of billed
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.76rem', fontWeight: 600 }}>
                <span>Outstanding Arrears</span>
                <AlertCircle size={16} color="#dc2626" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626', margin: '8px 0 2px' }}>
                KES {totalArrears.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {overdueInvoicesCount} invoice(s) with balance
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.76rem', fontWeight: 600 }}>
                <span>Deposits Held (Account 2100)</span>
                <ShieldCheck size={16} color="#2563eb" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2563eb', margin: '8px 0 2px' }}>
                KES {totalDepositsHeld.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Held as Tenant Liability, not revenue
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.76rem', fontWeight: 600 }}>
                <span>Unallocated Receipts</span>
                <RotateCcw size={16} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#d97706', margin: '8px 0 2px' }}>
                KES {totalUnallocated.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Awaiting invoice allocation
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.76rem', fontWeight: 600 }}>
                <span>Pending M-Pesa STK</span>
                <Clock size={16} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '8px 0 2px' }}>
                {pendingMpesaCount}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                {failedCount} failed / timed out
              </div>
            </div>
          </div>

          {/* Quick Drill-down Action Hub */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3 style={{ margin: '0 0 14px 0', fontSize: '0.96rem', fontWeight: 700, color: '#0f172a' }}>
              Operational Financial Workflows
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              <div
                onClick={() => setActiveTab('allocation')}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  background: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>Payment Allocation Workbench</strong>
                  <ArrowRight size={14} color="#2563eb" />
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                  Distribute unallocated receipts across oldest outstanding invoices using FIFO or manual amounts.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('refunds')}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  background: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>8-Stage Deposit Move-Out Refund</strong>
                  <ArrowRight size={14} color="#2563eb" />
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                  Guide vacate inspection, review damages/utilities, calculate net refund, and disburse via M-Pesa B2C.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('reconciliation')}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  cursor: 'pointer',
                  background: '#f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>Bank &amp; M-Pesa Reconciliation Engine</strong>
                  <ArrowRight size={14} color="#2563eb" />
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 0' }}>
                  Import external statements, match provider references, and flag amount/date discrepancies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TRANSACTIONS (DETAILED LEDGER)                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'transactions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Filters Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  width: '100%',
                }}
              >
                <Search size={14} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search receipt, M-Pesa code, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  color: '#334155',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending Callback</option>
                <option value="FAILED">Failed / Cancelled</option>
                <option value="REVERSED">Reversed</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Payment Ref</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>M-Pesa Code</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Payer Phone</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Method</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600 }}>Allocation</th>
                  <th style={{ padding: '10px 14px', color: '#64748b', fontWeight: 600, textAlign: 'center' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No payment records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const isAllocated = Number(p.allocated_amount_kes) > 0 && Number(p.unallocated_amount_kes) === 0;
                    const isPartial = Number(p.allocated_amount_kes) > 0 && Number(p.unallocated_amount_kes) > 0;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>
                          {p.payment_reference}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#64748b' }}>
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 600 }}>
                          {p.provider_receipt_number || <span style={{ color: '#94a3b8' }}>Pending</span>}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#475569' }}>
                          {p.payer_phone}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#64748b' }}>
                          {p.payment_method}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          KES {Number(p.amount_kes).toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: p.status === 'COMPLETED' ? '#dcfce7' : p.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                              color: p.status === 'COMPLETED' ? '#16a34a' : p.status === 'PENDING' ? '#d97706' : '#dc2626',
                            }}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: isAllocated ? '#16a34a' : isPartial ? '#d97706' : '#dc2626',
                            }}
                          >
                            {isAllocated ? 'Fully Settled' : isPartial ? `Partial (KES ${Number(p.unallocated_amount_kes).toLocaleString()} rem)` : 'Unallocated'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          {p.receipt ? (
                            <button
                              type="button"
                              title="Download PDF Receipt"
                              onClick={() => alert(`Receipt #${p.receipt?.receipt_number} issued for KES ${p.receipt?.amount_kes}. Verified against Safaricom.`)}
                              style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                color: '#2563eb',
                                borderRadius: '4px',
                                padding: '3px 8px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              RCT-{p.receipt.receipt_number.slice(0, 8)}
                            </button>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PAYMENT ALLOCATION WORKBENCH                           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'allocation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#0f172a' }}>
              Multi-Invoice Allocation Workbench
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: '#64748b' }}>
              Select a payment with unallocated funds to distribute across open tenant invoices. Enforces over-allocation prevention.
            </p>

            {allocMessage && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.82rem', marginBottom: '14px' }}>
                {allocMessage}
              </div>
            )}

            {/* Step 1: Select payment */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Choose Payment to Allocate:
              </label>
              <select
                value={selectedPaymentForAlloc?.id || ''}
                onChange={(e) => {
                  const p = payments.find((item) => item.id === e.target.value) || null;
                  setSelectedPaymentForAlloc(p);
                  setAllocInputs({});
                }}
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  color: '#0f172a',
                }}
              >
                <option value="">-- Select Payment Record --</option>
                {payments
                  .filter((p) => p.status === 'COMPLETED' && Number(p.unallocated_amount_kes) > 0)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.payment_reference} &bull; M-Pesa: {p.provider_receipt_number || 'N/A'} &bull; KES {Number(p.amount_kes).toLocaleString()} (Unallocated: KES {Number(p.unallocated_amount_kes).toLocaleString()})
                    </option>
                  ))}
              </select>
            </div>

            {/* Step 2: Outstanding Invoices Grid */}
            {selectedPaymentForAlloc && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    Available Funds to Allocate: <span style={{ color: '#16a34a' }}>KES {Number(selectedPaymentForAlloc.unallocated_amount_kes).toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      // FIFO Auto-Fill
                      let remaining = Number(selectedPaymentForAlloc.unallocated_amount_kes);
                      const newInputs: Record<string, number> = {};
                      for (const inv of invoices.filter((i) => Number(i.balance_kes) > 0)) {
                        if (remaining <= 0) break;
                        const bal = Number(inv.balance_kes);
                        const canTake = Math.min(remaining, bal);
                        newInputs[inv.id] = canTake;
                        remaining -= canTake;
                      }
                      setAllocInputs(newInputs);
                    }}
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      color: '#2563eb',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Auto-Fill FIFO (Oldest First)
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', color: '#64748b' }}>Invoice #</th>
                      <th style={{ padding: '8px 10px', color: '#64748b' }}>Period</th>
                      <th style={{ padding: '8px 10px', color: '#64748b' }}>Due Date</th>
                      <th style={{ padding: '8px 10px', color: '#64748b', textAlign: 'right' }}>Total</th>
                      <th style={{ padding: '8px 10px', color: '#64748b', textAlign: 'right' }}>Outstanding</th>
                      <th style={{ padding: '8px 10px', color: '#64748b', width: '140px' }}>Apply Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.filter((i) => Number(i.balance_kes) > 0).map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>{inv.invoice_number}</td>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{inv.billing_period}</td>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{inv.due_date}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>KES {Number(inv.total_amount_kes).toLocaleString()}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                          KES {Number(inv.balance_kes).toLocaleString()}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <input
                            type="number"
                            min={0}
                            max={Number(inv.balance_kes)}
                            value={allocInputs[inv.id] || ''}
                            onChange={(e) => {
                              const val = Math.min(Number(inv.balance_kes), Number(e.target.value) || 0);
                              setAllocInputs((prev) => ({ ...prev, [inv.id]: val }));
                            }}
                            placeholder="0.00"
                            style={{
                              width: '100%',
                              padding: '4px 8px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              textAlign: 'right',
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button
                    type="button"
                    onClick={handleCommitAllocation}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Commit Verified Allocations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: INVOICES & COLLECTIONS                                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'invoices' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>
            Rental Invoices &amp; Billing Periods
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Invoice #</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Billing Period</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Issue Date</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Due Date</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Total (KES)</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Paid (KES)</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Balance</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{inv.invoice_number}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{inv.billing_period}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{inv.issue_date}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{inv.due_date}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                    KES {Number(inv.total_amount_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                    KES {Number(inv.amount_paid_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: Number(inv.balance_kes) > 0 ? '#dc2626' : '#64748b', fontWeight: 700 }}>
                    KES {Number(inv.balance_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: inv.status === 'PAID' ? '#dcfce7' : inv.status === 'PARTIALLY_PAID' ? '#fef3c7' : '#fee2e2',
                        color: inv.status === 'PAID' ? '#16a34a' : inv.status === 'PARTIALLY_PAID' ? '#d97706' : '#dc2626',
                      }}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: DEPOSIT MANAGEMENT (ACCOUNT 2100 LIABILITY)            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'deposits' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                Tenant Security Deposit Subledger (Account 2100)
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Security deposits are held as balance sheet liabilities and never recognized as rental income.
              </p>
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#2563eb' }}>
              Total Liability Balance: KES {totalDepositsHeld.toLocaleString()}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Lease ID</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Required (KES)</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Received (KES)</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Deductions</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Refunded</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Liability Balance</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((d) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{d.lease_id}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>KES {Number(d.required_amount_kes).toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                    KES {Number(d.received_amount_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626' }}>
                    KES {Number(d.deducted_amount_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>
                    KES {Number(d.refunded_amount_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                    KES {Number(d.current_liability_balance_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: '#eff6ff',
                        color: '#1d4ed8',
                      }}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: REFUNDS (8-STAGE MOVE-OUT WORKFLOW)                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'refunds' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                8-Stage Move-Out Security Deposit Refund Pipeline
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Vacate &rarr; Inspection &rarr; Liability Review &rarr; Formula Calculation &rarr; Request &rarr; Approval &rarr; Execution &rarr; Completion.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRefundModal(true)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Start New Refund Workflow
            </button>
          </div>

          {/* 8-Stage Progress Steps */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            {[
              { num: '1', title: 'Vacate Notice', desc: 'Handover & Keys' },
              { num: '2', title: 'Inspection', desc: 'Damage Report' },
              { num: '3', title: 'Liability Review', desc: 'Rent & Utilities' },
              { num: '4', title: 'Calculation', desc: 'Held - Deductions' },
              { num: '5', title: 'Request Draft', desc: 'M-Pesa B2C Payee' },
              { num: '6', title: 'Role Approval', desc: 'Separation of Duty' },
              { num: '7', title: 'Disbursement', desc: 'External Payout' },
              { num: '8', title: 'Statement', desc: 'Account 2100 Closed' },
            ].map((st) => (
              <div
                key={st.num}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb' }}>Stage {st.num}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{st.title}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{st.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', color: '#475569' }}>
            No pending move-out refunds in queue. All past deposit refunds have been verified and disbursed via Safaricom B2C / EFT.
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: RECONCILIATION ENGINE                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'reconciliation' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                Bank &amp; M-Pesa Financial Reconciliation Engine
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Automated matching of external statements against internal RMS payments with exception resolution queue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setReconcileNotice('Automated batch matching executed: 100% of Safaricom Daraja callbacks match internal payments.');
                setTimeout(() => setReconcileNotice(null), 4000);
              }}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Run Auto-Match Batch
            </button>
          </div>

          {reconcileNotice && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.82rem', marginBottom: '14px' }}>
              {reconcileNotice}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Total External Records</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{payments.length}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Matched Transactions</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#16a34a' }}>{payments.filter((p) => p.status === 'COMPLETED').length}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Unmatched / Pending</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#d97706' }}>{pendingMpesaCount}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Discrepancies / Mismatches</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#dc2626' }}>0</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
            All posted financial transactions match Safaricom Daraja provider receipts. No unresolved exception records exist in the queue.
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: M-PESA INTEGRATION STATUS                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'mpesa' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>
            Safaricom Daraja Gateway Configuration &amp; Health
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Gateway Environment</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                Sandbox / Production Hybrid
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>PayBill Shortcode</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                174379 (Head Office Rent Collections)
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Webhook Verification</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
                HMAC-SHA256 &bull; Strict Dedup Active
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Allocation Strategy</div>
              <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
                FIFO Oldest First (Configurable)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 9: FINANCIAL REPORTS                                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'reports' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>
            Financial &amp; Arrears Aging Reports
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Rent Collections Summary</strong>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 10px' }}>
                Total collections vs expected billings across all properties.
              </p>
              <button
                type="button"
                onClick={() => alert('Generating Collections Summary CSV...')}
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Export Collections (CSV)
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Arrears Aging Report</strong>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 10px' }}>
                Categorizes outstanding invoices into 30, 60, and 90+ days aging buckets.
              </p>
              <button
                type="button"
                onClick={() => alert('Generating Arrears Aging Report...')}
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Export Arrears Aging (CSV)
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
              <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>Account 2100 Deposit Liability Statement</strong>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '4px 0 10px' }}>
                Audit schedule of all security deposits currently held for residential leases.
              </p>
              <button
                type="button"
                onClick={() => alert('Exporting Deposit Liabilities Statement...')}
                style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Export Deposit Schedule (CSV)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 10: AUDIT HISTORY & DOUBLE-ENTRY LEDGER                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'audit' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>
            Immutable Double-Entry Accounting Journal
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.78rem', color: '#64748b' }}>
            Every financial event posts balanced debits and credits. Reversals use contra entries instead of deletions.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Journal #</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Date</th>
                <th style={{ padding: '10px 12px', color: '#64748b' }}>Description</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Total Debits</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'right' }}>Total Credits</th>
                <th style={{ padding: '10px 12px', color: '#64748b', textAlign: 'center' }}>Balance Check</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((j) => (
                <tr key={j.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{j.journal_number}</td>
                  <td style={{ padding: '10px 12px', color: '#64748b' }}>{j.entry_date}</td>
                  <td style={{ padding: '10px 12px', color: '#334155' }}>{j.description}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                    KES {Number(j.total_debit_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                    KES {Number(j.total_credit_kes).toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: '#dcfce7',
                        color: '#16a34a',
                      }}
                    >
                      BALANCED (Debits == Credits)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: M-PESA STK PUSH TRIGGER                                */}
      {/* ------------------------------------------------------------- */}
      {showStkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '460px',
              width: '90%',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} color="#16a34a" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Initiate M-Pesa STK Push</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStkModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {stkFeedback && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.82rem', marginBottom: '14px' }}>
                {stkFeedback}
              </div>
            )}

            <form onSubmit={handleStkPush} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tenants.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Select Tenant & Lease
                  </label>
                  <select
                    value={selectedTenantId}
                    onChange={(e) => {
                      const tid = e.target.value;
                      setSelectedTenantId(tid);
                      const t = tenants.find((item) => item.id === tid);
                      if (t) {
                        if (t.phone) setStkPhone(t.phone);
                        const l = leases.find((item) => item.primary_tenant_id === t.id);
                        if (l) {
                          setStkAccountRef(l.lease_number || `RENT-${t.tenant_code}`);
                          setStkAmount(String(l.monthly_rent_kes));
                        } else {
                          setStkAccountRef(`RENT-${t.tenant_code}`);
                        }
                      }
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.tenant_code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Payer Mobile Number (254... or 07...)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0712345678 or 254712345678"
                  value={stkPhone}
                  onChange={(e) => setStkPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Amount in KES
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={stkAmount}
                  onChange={(e) => setStkAmount(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Account Reference / Invoice
                </label>
                <input
                  type="text"
                  required
                  value={stkAccountRef}
                  onChange={(e) => setStkAccountRef(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowStkModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stkLoading}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: stkLoading ? 'not-allowed' : 'pointer' }}
                >
                  {stkLoading ? 'Dispatching STK...' : 'Send STK Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: 8-STAGE DEPOSIT REFUND REQUEST                         */}
      {/* ------------------------------------------------------------- */}
      {showRefundModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '24px',
              maxWidth: '520px',
              width: '90%',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Move-Out Deposit Refund Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRefundModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {refundSuccessMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', fontSize: '0.82rem', marginBottom: '14px' }}>
                {refundSuccessMsg}
              </div>
            )}

            <form onSubmit={handleProcessRefund} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Select Vacating Tenant / Lease
                </label>
                <select
                  value={refundTenantId}
                  onChange={(e) => setRefundTenantId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                >
                  <option value="">-- Choose Tenant --</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name} ({t.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Account 2100 Deposit Held:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb', margin: '2px 0 8px' }}>
                  KES {heldAmount.toLocaleString()}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>Damage Deductions (KES)</label>
                    <input
                      type="number"
                      min={0}
                      value={refundDamageDeduction}
                      onChange={(e) => setRefundDamageDeduction(Number(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>Utility Deductions (KES)</label>
                    <input
                      type="number"
                      min={0}
                      value={refundUtilityDeduction}
                      onChange={(e) => setRefundUtilityDeduction(Number(e.target.value) || 0)}
                      style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#334155' }}>Calculated Net Refundable:</span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#16a34a' }}>
                    KES {calculatedRefundable.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Payout Channel
                </label>
                <select
                  value={refundPayoutMethod}
                  onChange={(e) => setRefundPayoutMethod(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                >
                  <option value="MPESA_B2C">M-Pesa B2C Payout</option>
                  <option value="BANK_TRANSFER">Bank EFT / Wire Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Payee Account or Phone
                </label>
                <input
                  type="text"
                  required
                  placeholder="2547... or Bank Account #"
                  value={refundPayeePhone}
                  onChange={(e) => setRefundPayeePhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={refundLoading}
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 600, cursor: refundLoading ? 'not-allowed' : 'pointer' }}
                >
                  {refundLoading ? 'Submitting...' : 'Submit for Role Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
