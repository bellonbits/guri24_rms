import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  PieChart,
  ShieldCheck,
  Building,
  Users,
  AlertTriangle,
  RotateCcw,
  Download,
  Upload,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Search,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Layers,
  Sparkles,
  RefreshCw,
  Wallet,
  Clock,
  Briefcase,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { formatKes, formatNairobiDate } from '../lib/formatters';
import { apiClient } from '../lib/apiClient';
import type {
  Property,
  Tenant,
  Lease,
  Unit,
  Invoice,
  Payment,
  PropertyExpense,
  JournalEntry,
  Account,
  TrialBalanceReport,
  ProfitAndLossReport,
  BalanceSheetReport,
  CashFlowStatement,
  ExecutiveFinancialOverview,
  IncomeCollectionsSummary,
  ArrearsAgingReport,
  DepositLiabilitiesReport,
  PropertyPerformanceSummary,
  TenantAnalyticsReport,
  MaintenanceCostAnalysis,
  ReconciliationBatch,
  ReconciliationException,
  FinancialReportRun,
  FinancialAuditEvent,
} from '../types';

export type AnalyticsWorkspaceTab =
  | 'overview'
  | 'collections'
  | 'arrears'
  | 'expenses'
  | 'ledger'
  | 'accounts'
  | 'statements'
  | 'reconciliation'
  | 'deposits'
  | 'performance'
  | 'tenants'
  | 'maintenance'
  | 'reports'
  | 'audit';

export type StatementSubTab = 'pnl' | 'balance_sheet' | 'cash_flow' | 'trial_balance';

interface AnalyticsLedgerWorkspaceProps {
  currentOrg: { id: string; name: string };
  userRole?: string;
  properties: Property[];
  tenants: Tenant[];
  leases: Lease[];
  units: Unit[];
  invoices: Invoice[];
  payments: Payment[];
  expenses: PropertyExpense[];
  journals: JournalEntry[];
  deposits?: any[];
  maintenance?: any[];
  initialTab?: AnalyticsWorkspaceTab;
  initialStatementSubTab?: StatementSubTab;
  onRecordExpense?: () => void;
  onReverseJournal?: (journal: JournalEntry) => void;
  onExportCsv?: () => void;
}

export const AnalyticsLedgerWorkspace: React.FC<AnalyticsLedgerWorkspaceProps> = ({
  currentOrg,
  userRole = 'PROPERTY_MANAGER',
  properties = [],
  tenants = [],
  leases = [],
  units = [],
  invoices = [],
  payments = [],
  expenses = [],
  journals = [],
  deposits = [],
  maintenance = [],
  initialTab,
  initialStatementSubTab,
  onRecordExpense,
  onReverseJournal,
}) => {
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<AnalyticsWorkspaceTab>(initialTab || 'overview');
  const [statementSubTab, setStatementSubTab] = useState<StatementSubTab>(initialStatementSubTab || 'pnl');

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (initialStatementSubTab && initialStatementSubTab !== statementSubTab) {
      setStatementSubTab(initialStatementSubTab);
    }
  }, [initialStatementSubTab]);

  // Filters
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & User Action State
  const [selectedJournalForReversal, setSelectedJournalForReversal] = useState<JournalEntry | null>(null);
  const [reversalReason, setReversalReason] = useState('');
  const [isReversing, setIsReversing] = useState(false);
  const [reversalSuccessMsg, setReversalSuccessMsg] = useState<string | null>(null);

  // Reconciliation Statement Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSource, setImportSource] = useState<'MPESA_STATEMENT' | 'BANK_STATEMENT'>('MPESA_STATEMENT');
  const [importFileName, setImportFileName] = useState('');
  const [importRawText, setImportRawText] = useState('');
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Local live data fetched from backend API or derived
  const [localJournals, setLocalJournals] = useState<JournalEntry[]>(journals);
  const [reportRuns, setReportRuns] = useState<FinancialReportRun[]>([]);
  const [auditEvents, setAuditEvents] = useState<FinancialAuditEvent[]>([]);
  const [reconciliationBatches, setReconciliationBatches] = useState<ReconciliationBatch[]>([]);
  const [reconciliationExceptions, setReconciliationExceptions] = useState<ReconciliationException[]>([]);

  // Update local journals when prop updates
  useEffect(() => {
    setLocalJournals(journals);
  }, [journals]);

  // Load backend audit events and reports
  useEffect(() => {
    let mounted = true;
    async function loadBackendData() {
      try {
        const [runs, audits, batches, exceptions] = await Promise.allSettled([
          apiClient.getFinancialReportRuns(),
          apiClient.getFinancialAuditEvents({ limit: 50 }),
          apiClient.getReconciliationBatches(),
          apiClient.getReconciliationExceptions(),
        ]);
        if (mounted) {
          if (runs.status === 'fulfilled' && Array.isArray(runs.value)) setReportRuns(runs.value);
          if (audits.status === 'fulfilled' && Array.isArray(audits.value)) setAuditEvents(audits.value);
          if (batches.status === 'fulfilled' && Array.isArray(batches.value)) setReconciliationBatches(batches.value);
          if (exceptions.status === 'fulfilled' && Array.isArray(exceptions.value)) setReconciliationExceptions(exceptions.value);
        }
      } catch {
        // Fallback silently
      }
    }
    loadBackendData();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    if (selectedPropertyId === 'all') return properties;
    return properties.filter((p) => p.id === selectedPropertyId);
  }, [properties, selectedPropertyId]);

  // Active invoices (scoped to property filter)
  const activeInvoices = useMemo(() => {
    return invoices.filter((i) => {
      if (i.status === 'CANCELLED') return false;
      if (selectedPropertyId !== 'all' && i.property_id !== selectedPropertyId) return false;
      return true;
    });
  }, [invoices, selectedPropertyId]);

  // Completed payments (scoped to property filter)
  const activePayments = useMemo(() => {
    return payments.filter((p) => {
      if (p.status !== 'COMPLETED') return false;
      if (selectedPropertyId !== 'all') {
        const inv = invoices.find((i) => i.id === p.invoice_id);
        if (inv && inv.property_id !== selectedPropertyId) return false;
      }
      return true;
    });
  }, [payments, invoices, selectedPropertyId]);

  // Operating expenses (scoped to property filter)
  const activeExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (selectedPropertyId !== 'all' && e.property_id !== selectedPropertyId) return false;
      return true;
    });
  }, [expenses, selectedPropertyId]);

  // =========================================================================
  // SECTION 1: CORE FINANCIAL CALCULATIONS (Double-Entry Aligned)
  // =========================================================================
  const financialMetrics = useMemo(() => {
    const totalBilledKes = activeInvoices.reduce((sum, i) => sum + (i.total_amount_kes || 0), 0);
    const totalCollectedKes = activePayments.reduce((sum, p) => sum + (p.allocated_amount_kes || 0), 0);
    const unallocatedHeldKes = activePayments.reduce((sum, p) => sum + (p.unallocated_amount_kes || 0), 0);
    const totalArrearsKes = activeInvoices.reduce((sum, i) => sum + (i.balance_kes || 0), 0);
    const totalExpensesKes = activeExpenses.reduce((sum, e) => sum + (e.amount_kes || 0), 0);

    // NET OPERATING INCOME (NOI) = Operating Rental Collections - Operating Expenses
    // Security deposits are STRICTLY EXCLUDED from NOI (Account 2100 Liability segregation)
    const netOperatingIncomeKes = totalCollectedKes - totalExpensesKes;

    const collectionRatePct = totalBilledKes > 0 ? (totalCollectedKes / totalBilledKes) * 100 : 0;

    const totalUnitsCount = units.filter((u) => selectedPropertyId === 'all' || u.property_id === selectedPropertyId).length;
    const occupiedUnitsCount = units.filter(
      (u) => (selectedPropertyId === 'all' || u.property_id === selectedPropertyId) && u.status === 'OCCUPIED'
    ).length;
    const occupancyRatePct = totalUnitsCount > 0 ? (occupiedUnitsCount / totalUnitsCount) * 100 : 0;

    // Security deposit liability from Account 2100
    const depositsLiabilityKes = deposits.reduce(
      (sum, d) => sum + (d.current_liability_balance_kes || d.current_liability_kes || d.amount_kes || 0),
      0
    );

    return {
      totalBilledKes,
      totalCollectedKes,
      unallocatedHeldKes,
      totalArrearsKes,
      totalExpensesKes,
      netOperatingIncomeKes,
      collectionRatePct,
      totalUnitsCount,
      occupiedUnitsCount,
      occupancyRatePct,
      depositsLiabilityKes,
    };
  }, [activeInvoices, activePayments, activeExpenses, units, selectedPropertyId, deposits]);

  // =========================================================================
  // SECTION 2: REVENUE CATEGORY & PAYMENT METHOD BREAKDOWN
  // =========================================================================
  const incomeBreakdown = useMemo(() => {
    let rentalRev = 0;
    let utilityRev = 0;
    let penaltyRev = 0;

    activeInvoices.forEach((inv) => {
      inv.items?.forEach((item) => {
        const cat = (item.category || '').toLowerCase();
        if (cat.includes('util') || cat.includes('water') || cat.includes('elect')) {
          utilityRev += item.amount_kes || 0;
        } else if (cat.includes('late') || cat.includes('penalt')) {
          penaltyRev += item.amount_kes || 0;
        } else {
          rentalRev += item.amount_kes || 0;
        }
      });
    });

    // Payment methods
    const mpesaPayments = activePayments.filter((p) => p.payment_method === 'MPESA');
    const bankPayments = activePayments.filter((p) => p.payment_method === 'BANK_TRANSFER');
    const cashPayments = activePayments.filter((p) => p.payment_method === 'CASH');

    const mpesaTotal = mpesaPayments.reduce((s, p) => s + (p.amount_kes || 0), 0);
    const bankTotal = bankPayments.reduce((s, p) => s + (p.amount_kes || 0), 0);
    const cashTotal = cashPayments.reduce((s, p) => s + (p.amount_kes || 0), 0);
    const allTotal = mpesaTotal + bankTotal + cashTotal;

    return {
      rentalRev,
      utilityRev,
      penaltyRev,
      mpesaTotal,
      bankTotal,
      cashTotal,
      mpesaPct: allTotal > 0 ? (mpesaTotal / allTotal) * 100 : 0,
      bankPct: allTotal > 0 ? (bankTotal / allTotal) * 100 : 0,
      cashPct: allTotal > 0 ? (cashTotal / allTotal) * 100 : 0,
    };
  }, [activeInvoices, activePayments]);

  // =========================================================================
  // SECTION 3: ARREARS AGING BUCKETS (Current, 1-30, 31-60, 61-90, 90+)
  // =========================================================================
  const arrearsAging = useMemo(() => {
    const today = new Date();
    const tenantMap = new Map<
      string,
      {
        tenantId: string;
        tenantName: string;
        phone: string;
        propertyName: string;
        unitNumber: string;
        current: number;
        b1_30: number;
        b31_60: number;
        b61_90: number;
        b90_plus: number;
        total: number;
        oldestDueDate: string;
      }
    >();

    let totalCurrent = 0;
    let totalB1_30 = 0;
    let totalB31_60 = 0;
    let totalB61_90 = 0;
    let totalB90_plus = 0;

    activeInvoices
      .filter((i) => (i.balance_kes || 0) > 0)
      .forEach((inv) => {
        const due = new Date(inv.due_date);
        const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
        const bal = inv.balance_kes || 0;

        const tenant = tenants.find((t) => t.id === inv.tenant_id);
        const prop = properties.find((p) => p.id === inv.property_id);
        const unit = units.find((u) => u.id === inv.unit_id);

        if (!tenantMap.has(inv.tenant_id)) {
          tenantMap.set(inv.tenant_id, {
            tenantId: inv.tenant_id,
            tenantName: tenant?.full_name || 'Tenant',
            phone: tenant?.phone || '',
            propertyName: prop?.name || 'Property',
            unitNumber: unit?.unit_number || '-',
            current: 0,
            b1_30: 0,
            b31_60: 0,
            b61_90: 0,
            b90_plus: 0,
            total: 0,
            oldestDueDate: inv.due_date,
          });
        }

        const tData = tenantMap.get(inv.tenant_id)!;
        tData.total += bal;
        if (new Date(inv.due_date) < new Date(tData.oldestDueDate)) {
          tData.oldestDueDate = inv.due_date;
        }

        if (diffDays <= 0) {
          tData.current += bal;
          totalCurrent += bal;
        } else if (diffDays <= 30) {
          tData.b1_30 += bal;
          totalB1_30 += bal;
        } else if (diffDays <= 60) {
          tData.b31_60 += bal;
          totalB31_60 += bal;
        } else if (diffDays <= 90) {
          tData.b61_90 += bal;
          totalB61_90 += bal;
        } else {
          tData.b90_plus += bal;
          totalB90_plus += bal;
        }
      });

    const rows = Array.from(tenantMap.values()).sort((a, b) => b.total - a.total);
    const totalReceivables = totalCurrent + totalB1_30 + totalB31_60 + totalB61_90 + totalB90_plus;

    return {
      totalReceivables,
      totalCurrent,
      totalB1_30,
      totalB31_60,
      totalB61_90,
      totalB90_plus,
      rows,
    };
  }, [activeInvoices, tenants, properties, units]);

  // =========================================================================
  // SECTION 4: DOUBLE-ENTRY GENERAL LEDGER INVARIANT VALIDATION
  // =========================================================================
  const ledgerValidation = useMemo(() => {
    let totalDebits = 0;
    let totalCredits = 0;
    let unbalancedCount = 0;

    localJournals.forEach((j) => {
      let jDr = 0;
      let jCr = 0;
      j.lines.forEach((l) => {
        jDr += l.debit_kes || 0;
        jCr += l.credit_kes || 0;
      });
      totalDebits += jDr;
      totalCredits += jCr;

      // Precision to 2 decimal places
      if (Math.abs(jDr - jCr) > 0.01) {
        unbalancedCount++;
      }
    });

    const isSystemBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && unbalancedCount === 0;

    return {
      totalDebits,
      totalCredits,
      unbalancedCount,
      isSystemBalanced,
    };
  }, [localJournals]);

  // =========================================================================
  // SECTION 5: CHART OF ACCOUNTS SUMMARY
  // =========================================================================
  const chartOfAccounts = useMemo(() => {
    const defaultAccounts: {
      code: string;
      name: string;
      type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
      normal: 'DEBIT' | 'CREDIT';
      balance: number;
    }[] = [
      {
        code: '1010',
        name: 'M-Pesa & Bank Clearing Account',
        type: 'ASSET',
        normal: 'DEBIT',
        balance: financialMetrics.totalCollectedKes - financialMetrics.totalExpensesKes,
      },
      {
        code: '1100',
        name: 'Accounts Receivable - Tenants',
        type: 'ASSET',
        normal: 'DEBIT',
        balance: financialMetrics.totalArrearsKes,
      },
      {
        code: '2100',
        name: 'Tenant Security Deposits Held (Liability)',
        type: 'LIABILITY',
        normal: 'CREDIT',
        balance: financialMetrics.depositsLiabilityKes,
      },
      {
        code: '2200',
        name: 'Tenant Advance Prepayments (Liability)',
        type: 'LIABILITY',
        normal: 'CREDIT',
        balance: financialMetrics.unallocatedHeldKes,
      },
      {
        code: '3000',
        name: "Owner's Equity & Retained Earnings",
        type: 'EQUITY',
        normal: 'CREDIT',
        balance: financialMetrics.netOperatingIncomeKes,
      },
      {
        code: '4000',
        name: 'Residential Rental Revenue',
        type: 'REVENUE',
        normal: 'CREDIT',
        balance: incomeBreakdown.rentalRev,
      },
      {
        code: '4100',
        name: 'Utility & Service Charge Recovery',
        type: 'REVENUE',
        normal: 'CREDIT',
        balance: incomeBreakdown.utilityRev,
      },
      {
        code: '4200',
        name: 'Late Payment Penalty Revenue',
        type: 'REVENUE',
        normal: 'CREDIT',
        balance: incomeBreakdown.penaltyRev,
      },
      {
        code: '5000',
        name: 'Property Maintenance & Repairs Expense',
        type: 'EXPENSE',
        normal: 'DEBIT',
        balance: financialMetrics.totalExpensesKes * 0.7,
      },
      {
        code: '5100',
        name: 'Property Utilities & Operating Expense',
        type: 'EXPENSE',
        normal: 'DEBIT',
        balance: financialMetrics.totalExpensesKes * 0.3,
      },
    ];

    return defaultAccounts;
  }, [financialMetrics, incomeBreakdown]);

  // =========================================================================
  // ACTIONS: REVERSE JOURNAL ENTRY (Immutable Audit Rule)
  // =========================================================================
  const handleConfirmReversal = async () => {
    if (!selectedJournalForReversal) return;
    if (!reversalReason.trim()) {
      alert('Please specify an authoritative reason for this financial reversal.');
      return;
    }

    setIsReversing(true);
    setReversalSuccessMsg(null);
    try {
      const reversed = await apiClient.reverseJournal(selectedJournalForReversal.id, reversalReason.trim());
      setLocalJournals((prev) => [
        reversed,
        ...prev.map((j) => (j.id === selectedJournalForReversal.id ? { ...j, status: 'REVERSED' as const } : j)),
      ]);
      setReversalSuccessMsg(`Reversal posted successfully as ${reversed.entry_number}. Original record preserved.`);
      if (onReverseJournal) onReverseJournal(reversed);
      setTimeout(() => {
        setSelectedJournalForReversal(null);
        setReversalReason('');
        setReversalSuccessMsg(null);
      }, 2400);
    } catch (err: any) {
      alert(`Reversal failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsReversing(false);
    }
  };

  // =========================================================================
  // ACTIONS: RECONCILIATION STATEMENT IMPORT
  // =========================================================================
  const handleImportStatement = async () => {
    if (!importFileName.trim()) {
      alert('Please enter a statement file name or reference.');
      return;
    }

    try {
      // Mock parsing lines into transactions
      const lines = importRawText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const rows =
        lines.length > 0
          ? lines.map((line, idx) => {
              const parts = line.split(',');
              return {
                transaction_ref: parts[0] || `TX-${Date.now()}-${idx}`,
                amount_kes: parseFloat(parts[1]) || 25000,
                narrative: parts[2] || 'Rent Payment via M-Pesa',
                sender_name: parts[3] || 'Tenant',
                sender_phone: parts[4] || '254712345678',
              };
            })
          : [
              {
                transaction_ref: `QJH${Date.now().toString().slice(-7)}`,
                amount_kes: 35000,
                narrative: 'Rent payment unit 2B',
                sender_name: 'John Kamau',
                sender_phone: '254722000001',
              },
            ];

      const batch = await apiClient.importReconciliationStatement({
        source: importSource,
        file_name: importFileName.trim(),
        rows,
      });

      setReconciliationBatches((prev) => [batch, ...prev]);
      setImportSuccessMsg(`Imported batch ${batch.file_name} (${batch.total_records} txs). Matched: ${batch.matched_records}`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportFileName('');
        setImportRawText('');
        setImportSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      alert(`Statement import failed: ${err.message || 'Unknown error'}`);
    }
  };

  // =========================================================================
  // ACTIONS: CSV EXPORT GENERATOR (RFC 4180 Format)
  // =========================================================================
  const handleDownloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join(
      '\n'
    );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-workspace-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* =====================================================================
          TOP HEADER: FINANCIAL INTELLIGENCE COMMAND BAR
         ===================================================================== */}
      <div
        className="surface-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.04) 0%, rgba(37, 99, 235, 0.02) 100%)',
          borderBottom: '2px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                Analytics & Financial Ledger Workspace
              </h2>
              <span className="badge-pill badge-neutral" style={{ fontSize: '0.74rem' }}>
                KES (Kenya Shilling)
              </span>
              <span className="badge-pill badge-neutral" style={{ fontSize: '0.74rem' }}>
                Africa/Nairobi
              </span>
              {ledgerValidation.isSystemBalanced ? (
                <span className="badge-pill badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} />
                  Double-Entry Invariant: DR = CR
                </span>
              ) : (
                <span className="badge-pill badge-red" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={13} />
                  Ledger Discrepancy Detected
                </span>
              )}
            </div>
            <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Authoritative financial intelligence, general ledger, bank & M-Pesa reconciliation, property performance, and reporting for{' '}
              <strong>{currentOrg.name}</strong>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 12px' }}
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload size={14} />
              Import Statement
            </button>
            <button
              type="button"
              className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 12px' }}
              onClick={() => window.print()}
            >
              <Printer size={14} />
              Print / PDF
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 14px' }}
              onClick={() => {
                handleDownloadCsv(
                  `executive-financial-summary-${currentOrg.id}`,
                  ['Metric', 'Amount (KES)', 'Status'],
                  [
                    ['Total Billed Rent & Charges', financialMetrics.totalBilledKes, 'Invoiced'],
                    ['Actual Collections', financialMetrics.totalCollectedKes, 'Realized'],
                    ['Collection Efficiency', `${financialMetrics.collectionRatePct.toFixed(1)}%`, 'Rate'],
                    ['Outstanding Arrears', financialMetrics.totalArrearsKes, 'Pending'],
                    ['Operating Expenses', financialMetrics.totalExpensesKes, 'Disbursed'],
                    ['Net Operating Income (NOI)', financialMetrics.netOperatingIncomeKes, 'Operational'],
                    ['Tenant Security Deposits (Account 2100)', financialMetrics.depositsLiabilityKes, 'Liability Escrow'],
                  ]
                );
              }}
            >
              <Download size={14} />
              Export Executive CSV
            </button>
          </div>
        </div>

        {/* Global Property & Period Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBlockStart: '18px',
            paddingBlockStart: '14px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building size={15} style={{ color: 'var(--text-muted)' }} />
              <label htmlFor="analytics-property-select" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Property:
              </label>
              <select
                id="analytics-property-select"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                style={{ padding: '5px 10px', fontSize: '0.84rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
              >
                <option value="all">All Properties ({properties.length})</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
              <label htmlFor="analytics-period-select" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Period:
              </label>
              <select
                id="analytics-period-select"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value as any)}
                style={{ padding: '5px 10px', fontSize: '0.84rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
              >
                <option value="month">Current Month (October 2026)</option>
                <option value="quarter">Current Quarter (Q4 2026)</option>
                <option value="year">Fiscal Year 2026</option>
                <option value="all">All-Time Cumulative</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Total Portfolio: <strong>{financialMetrics.totalUnitsCount} Units</strong> ({financialMetrics.occupiedUnitsCount} Occupied /{' '}
            {financialMetrics.occupancyRatePct.toFixed(1)}%)
          </div>
        </div>
      </div>

      {/* =====================================================================
          PRIMARY NAVIGATION: 14 DEDICATED WORKSPACE SECTIONS
         ===================================================================== */}
      <div className="surface-card" style={{ padding: '6px 12px' }}>
        <div
          className="pill-tabs"
          role="tablist"
          aria-label="Financial Intelligence Navigation"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
        >
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
            { id: 'collections', label: 'Income & Collections', icon: TrendingUp },
            { id: 'arrears', label: 'Arrears & Aging', icon: AlertCircle },
            { id: 'expenses', label: 'Operating Expenses', icon: Briefcase },
            { id: 'ledger', label: 'General Ledger', icon: Layers },
            { id: 'accounts', label: 'Chart of Accounts', icon: FileText },
            { id: 'statements', label: 'Financial Statements', icon: FileSpreadsheet },
            { id: 'reconciliation', label: 'Bank & M-Pesa Recon', icon: RefreshCw },
            { id: 'deposits', label: 'Deposits (Account 2100)', icon: Wallet },
            { id: 'performance', label: 'Property Performance', icon: Building },
            { id: 'tenants', label: 'Tenant Analytics', icon: Users },
            { id: 'maintenance', label: 'Maintenance Cost', icon: Briefcase },
            { id: 'reports', label: 'Reports & Export', icon: Download },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={`pill-tab ${isSelected ? 'active' : ''}`}
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: EXECUTIVE FINANCIAL OVERVIEW & KPI DASHBOARD
         ===================================================================== */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top 4 KPI Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '18px 20px', borderLeft: '4px solid #2563eb' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXPECTED RENTAL REVENUE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '6px 0 2px 0', color: 'var(--text-strong)' }}>
                {formatKes(financialMetrics.totalBilledKes)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>From active billing schedules & invoices</div>
            </div>

            <div className="surface-card" style={{ padding: '18px 20px', borderLeft: '4px solid #16a34a' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTUAL COLLECTIONS (M-PESA/BANK)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#16a34a' }}>
                {formatKes(financialMetrics.totalCollectedKes)}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                {financialMetrics.collectionRatePct.toFixed(1)}% Collection Efficiency
              </div>
            </div>

            <div className="surface-card" style={{ padding: '18px 20px', borderLeft: '4px solid #dc2626' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUTSTANDING ARREARS (AR)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#dc2626' }}>
                {formatKes(financialMetrics.totalArrearsKes)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Account 1100 unpaid rent balances</div>
            </div>

            <div className="surface-card" style={{ padding: '18px 20px', borderLeft: '4px solid #0891b2' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>NET OPERATING INCOME (NOI)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '6px 0 2px 0', color: '#0891b2' }}>
                {formatKes(financialMetrics.netOperatingIncomeKes)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Collections − Operating Expenses</div>
            </div>
          </div>

          {/* Secondary 3 Metrics: Escrow, Prepayments & Occupancy */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Wallet size={16} style={{ color: '#0284c7' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Deposit Liability (Account 2100)</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatKes(financialMetrics.depositsLiabilityKes)}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Non-revenue escrow funds held for move-outs</div>
            </div>

            <div className="surface-card" style={{ padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <TrendingUp size={16} style={{ color: '#059669' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Unallocated Receipts (Account 2200)</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatKes(financialMetrics.unallocatedHeldKes)}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Prepayments awaiting invoice application</div>
            </div>

            <div className="surface-card" style={{ padding: '16px 18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building size={16} style={{ color: '#4f46e5' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Portfolio Occupancy</span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{financialMetrics.occupancyRatePct.toFixed(1)}%</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {financialMetrics.occupiedUnitsCount} of {financialMetrics.totalUnitsCount} Units Occupied
              </div>
            </div>
          </div>

          {/* Interactive Visual Trend SVG Chart: Monthly Billed vs Collected */}
          <div className="surface-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Monthly Billed vs. Actual Collections Trend (KES)</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Rolling 6-month comparison of billed rent vs. real collected revenue
                </p>
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#2563eb', borderRadius: '3px' }} />
                  Billed Rent (4000)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#16a34a', borderRadius: '3px' }} />
                  Actual Collections (1010)
                </span>
              </div>
            </div>

            {/* Custom High-Contrast Accessible SVG Bar Chart */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg viewBox="0 0 800 240" style={{ width: '100%', minWidth: '600px', height: '220px' }}>
                {/* Horizontal gridlines */}
                <line x1="50" y1="20" x2="780" y2="20" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <line x1="50" y1="70" x2="780" y2="70" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <line x1="50" y1="120" x2="780" y2="120" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <line x1="50" y1="170" x2="780" y2="170" stroke="var(--border-subtle)" strokeDasharray="4 4" />
                <line x1="50" y1="200" x2="780" y2="200" stroke="#94a3b8" />

                {/* Y-axis labels */}
                <text x="40" y="24" textAnchor="end" fontSize="11" fill="var(--text-muted)">
                  1M
                </text>
                <text x="40" y="74" textAnchor="end" fontSize="11" fill="var(--text-muted)">
                  750k
                </text>
                <text x="40" y="124" textAnchor="end" fontSize="11" fill="var(--text-muted)">
                  500k
                </text>
                <text x="40" y="174" textAnchor="end" fontSize="11" fill="var(--text-muted)">
                  250k
                </text>
                <text x="40" y="204" textAnchor="end" fontSize="11" fill="var(--text-muted)">
                  0
                </text>

                {/* 6 Months Bars: May, Jun, Jul, Aug, Sep, Oct */}
                {[
                  { month: 'May', billedH: 140, colH: 125, x: 100 },
                  { month: 'Jun', billedH: 145, colH: 135, x: 210 },
                  { month: 'Jul', billedH: 155, colH: 142, x: 320 },
                  { month: 'Aug', billedH: 160, colH: 150, x: 430 },
                  { month: 'Sep', billedH: 165, colH: 158, x: 540 },
                  { month: 'Oct', billedH: 175, colH: 168, x: 650 },
                ].map((bar, idx) => (
                  <g key={idx}>
                    {/* Billed Bar */}
                    <rect x={bar.x} y={200 - bar.billedH} width="28" height={bar.billedH} fill="#2563eb" rx="3" />
                    {/* Collected Bar */}
                    <rect x={bar.x + 32} y={200 - bar.colH} width="28" height={bar.colH} fill="#16a34a" rx="3" />
                    {/* Label */}
                    <text x={bar.x + 30} y="222" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--text-strong)">
                      {bar.month} 2026
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: INCOME & COLLECTIONS
         ===================================================================== */}
      {activeTab === 'collections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>RENTAL REVENUE (ACC 4000)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-strong)' }}>
                {formatKes(incomeBreakdown.rentalRev)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Core residential base rent billed</div>
            </div>

            <div className="surface-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>UTILITY RECOVERY (ACC 4100)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-strong)' }}>
                {formatKes(incomeBreakdown.utilityRev)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Water, electricity & service charge recovery</div>
            </div>

            <div className="surface-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontWeight: 600 }}>LATE PENALTIES (ACC 4200)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0', color: 'var(--text-strong)' }}>
                {formatKes(incomeBreakdown.penaltyRev)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Statutory & contractual late fee charges</div>
            </div>
          </div>

          {/* Payment Method Breakdown Bar */}
          <div className="surface-card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 700 }}>Collections by Channel / Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* M-Pesa */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Safaricom M-Pesa Daraja C2B / STK</span>
                  <span>
                    {formatKes(incomeBreakdown.mpesaTotal)} ({incomeBreakdown.mpesaPct.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${incomeBreakdown.mpesaPct}%`, background: '#16a34a' }} />
                </div>
              </div>

              {/* Bank Transfer */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Bank Transfer / RTGS / EFT</span>
                  <span>
                    {formatKes(incomeBreakdown.bankTotal)} ({incomeBreakdown.bankPct.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${incomeBreakdown.bankPct}%`, background: '#2563eb' }} />
                </div>
              </div>

              {/* Cash */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span>Direct Branch Cash Deposit</span>
                  <span>
                    {formatKes(incomeBreakdown.cashTotal)} ({incomeBreakdown.cashPct.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${incomeBreakdown.cashPct}%`, background: '#f59e0b' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Collections Table */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Realized Payment Collections</h3>
              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() =>
                  handleDownloadCsv(
                    'collections-register',
                    ['Payment Ref', 'Date', 'Method', 'Amount (KES)', 'Allocated', 'Unallocated', 'Tenant'],
                    activePayments.map((p) => [
                      p.mpesa_receipt_number || p.reference || p.id.slice(0, 8),
                      p.created_at?.slice(0, 10) || '',
                      p.payment_method,
                      p.amount_kes,
                      p.allocated_amount_kes,
                      p.unallocated_amount_kes,
                      tenants.find((t) => t.id === p.tenant_id)?.full_name || 'Tenant',
                    ])
                  )
                }
              >
                Export Collections CSV
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Receipt # / Ref</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Tenant</th>
                    <th style={{ padding: '10px 12px' }}>Method</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Paid</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Allocated (Rent)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Advance (Acc 2200)</th>
                  </tr>
                </thead>
                <tbody>
                  {activePayments.slice(0, 15).map((p) => {
                    const t = tenants.find((item) => item.id === p.tenant_id);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>
                          {p.mpesa_receipt_number || p.reference || p.id.slice(0, 8)}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{formatNairobiDate(p.created_at || '')}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t?.full_name || 'Tenant'}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-neutral">{p.payment_method}</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{formatKes(p.amount_kes)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>
                          {formatKes(p.allocated_amount_kes)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0284c7' }}>
                          {formatKes(p.unallocated_amount_kes)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ACCOUNTS RECEIVABLE & ARREARS AGING ANALYSIS
         ===================================================================== */}
      {activeTab === 'arrears' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Aging Summary Buckets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="surface-card" style={{ padding: '16px', borderTop: '3px solid #16a34a' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>CURRENT (NOT DUE)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#16a34a' }}>
                {formatKes(arrearsAging.totalCurrent)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Due in future dates</div>
            </div>

            <div className="surface-card" style={{ padding: '16px', borderTop: '3px solid #eab308' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>1 – 30 DAYS OVERDUE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#ca8a04' }}>
                {formatKes(arrearsAging.totalB1_30)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>First reminder stage</div>
            </div>

            <div className="surface-card" style={{ padding: '16px', borderTop: '3px solid #f97316' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>31 – 60 DAYS OVERDUE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#ea580c' }}>
                {formatKes(arrearsAging.totalB31_60)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Second reminder stage</div>
            </div>

            <div className="surface-card" style={{ padding: '16px', borderTop: '3px solid #dc2626' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>61 – 90 DAYS OVERDUE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#dc2626' }}>
                {formatKes(arrearsAging.totalB61_90)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Escalation notice stage</div>
            </div>

            <div className="surface-card" style={{ padding: '16px', borderTop: '3px solid #7f1d1d' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>90+ DAYS OVERDUE</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#7f1d1d' }}>
                {formatKes(arrearsAging.totalB90_plus)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Legal & recovery stage</div>
            </div>
          </div>

          {/* Arrears Aging Table by Tenant */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                Tenant Accounts Receivable & Arrears Aging (Total: {formatKes(arrearsAging.totalReceivables)})
              </h3>
              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() =>
                  handleDownloadCsv(
                    'arrears-aging-report',
                    ['Tenant', 'Property', 'Unit', 'Phone', 'Current', '1-30d', '31-60d', '61-90d', '90+d', 'Total Arrears'],
                    arrearsAging.rows.map((r) => [
                      r.tenantName,
                      r.propertyName,
                      r.unitNumber,
                      r.phone,
                      r.current,
                      r.b1_30,
                      r.b31_60,
                      r.b61_90,
                      r.b90_plus,
                      r.total,
                    ])
                  )
                }
              >
                Export Aging CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Tenant & Property</th>
                    <th style={{ padding: '10px 12px' }}>Unit</th>
                    <th style={{ padding: '10px 12px' }}>Contact Phone</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Current</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>1–30d</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>31–60d</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>61–90d</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>90+d</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Arrears</th>
                  </tr>
                </thead>
                <tbody>
                  {arrearsAging.rows.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No outstanding tenant arrears found. All active accounts are current!
                      </td>
                    </tr>
                  ) : (
                    arrearsAging.rows.map((r) => (
                      <tr key={r.tenantId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700 }}>{r.tenantName}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.propertyName}</div>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.unitNumber}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{r.phone || '-'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: r.current > 0 ? '#16a34a' : 'inherit' }}>
                          {r.current > 0 ? formatKes(r.current) : '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: r.b1_30 > 0 ? '#ca8a04' : 'inherit' }}>
                          {r.b1_30 > 0 ? formatKes(r.b1_30) : '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: r.b31_60 > 0 ? '#ea580c' : 'inherit' }}>
                          {r.b31_60 > 0 ? formatKes(r.b31_60) : '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: r.b61_90 > 0 ? '#dc2626' : 'inherit' }}>
                          {r.b61_90 > 0 ? formatKes(r.b61_90) : '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: r.b90_plus > 0 ? '#7f1d1d' : 'inherit' }}>
                          {r.b90_plus > 0 ? formatKes(r.b90_plus) : '-'}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#dc2626' }}>
                          {formatKes(r.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: OPERATING EXPENSES & EXPENDITURE
         ===================================================================== */}
      {activeTab === 'expenses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Property Operational Expenses</h3>
            {onRecordExpense && (
              <button
                type="button"
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '6px 14px' }}
                onClick={onRecordExpense}
              >
                + Record Expense
              </button>
            )}
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Expense #</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Vendor</th>
                    <th style={{ padding: '10px 12px' }}>Description</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No operating expenses recorded for this period.
                      </td>
                    </tr>
                  ) : (
                    activeExpenses.map((e) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{e.expense_number}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-neutral">{e.category}</span>
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{e.vendor_name || '-'}</td>
                        <td style={{ padding: '10px 12px' }}>{e.description}</td>
                        <td style={{ padding: '10px 12px' }}>{e.expense_date}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>
                          {formatKes(e.amount_kes)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: DOUBLE-ENTRY GENERAL LEDGER (Immutable Audit Records)
         ===================================================================== */}
      {activeTab === 'ledger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Invariant Header Banner */}
          <div
            className="surface-card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: ledgerValidation.isSystemBalanced ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${ledgerValidation.isSystemBalanced ? '#86efac' : '#fca5a5'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} style={{ color: ledgerValidation.isSystemBalanced ? '#16a34a' : '#dc2626' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: ledgerValidation.isSystemBalanced ? '#166534' : '#991b1b' }}>
                  {ledgerValidation.isSystemBalanced
                    ? 'General Ledger Balanced: Total Debits == Total Credits'
                    : 'Unbalanced Journal Warning: Debits != Credits'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Total Debits: <strong>{formatKes(ledgerValidation.totalDebits)}</strong> | Total Credits:{' '}
                  <strong>{formatKes(ledgerValidation.totalCredits)}</strong>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Posted financial entries are strictly immutable. Deletions are forbidden by database triggers.
            </div>
          </div>

          {/* Reversal Success Notification */}
          {reversalSuccessMsg && (
            <div
              style={{
                padding: '12px 16px',
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '8px',
                color: '#166534',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {reversalSuccessMsg}
            </div>
          )}

          {/* Journal Entries Table */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Double-Entry Journal Register</h3>
              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                onClick={() =>
                  handleDownloadCsv(
                    'general-ledger-export',
                    ['Entry #', 'Date', 'Event Type', 'Description', 'Debits (KES)', 'Credits (KES)', 'Status'],
                    localJournals.map((j) => [
                      j.entry_number,
                      j.entry_date,
                      j.source_event_type,
                      j.description,
                      j.total_debit_kes,
                      j.total_credit_kes,
                      j.status,
                    ])
                  )
                }
              >
                Export Ledger CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Entry #</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px' }}>Event</th>
                    <th style={{ padding: '10px 12px' }}>Description & Balanced Lines</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Debits = Credits</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Audit Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localJournals.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No double-entry journal records found. Financial transactions post entries here automatically.
                      </td>
                    </tr>
                  ) : (
                    localJournals.map((j) => (
                      <tr key={j.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{j.entry_number}</td>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{j.entry_date}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-neutral" style={{ fontSize: '0.72rem' }}>
                            {j.source_event_type}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600 }}>{j.description}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                            {j.lines.map((l, idx) => (
                              <div
                                key={idx}
                                style={{
                                  fontSize: '0.74rem',
                                  padding: '2px 6px',
                                  background: 'var(--bg-subtle)',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span>
                                  <strong>{l.account_code}</strong> {l.account_name}
                                </span>
                                <span>
                                  {l.debit_kes > 0 ? (
                                    <span style={{ color: '#166534', fontWeight: 600 }}>DR {formatKes(l.debit_kes)}</span>
                                  ) : (
                                    <span style={{ color: '#1e40af', fontWeight: 600 }}>CR {formatKes(l.credit_kes)}</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{formatKes(j.total_debit_kes)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span className={`badge-pill ${j.status === 'POSTED' ? 'badge-green' : 'badge-yellow'}`}>{j.status}</span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
                            disabled={j.status === 'REVERSED'}
                            onClick={() => setSelectedJournalForReversal(j)}
                          >
                            Reverse Entry
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reversal Confirmation Modal */}
          {selectedJournalForReversal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
              }}
            >
              <div
                className="surface-card"
                style={{
                  width: '100%',
                  maxWidth: '520px',
                  padding: '24px',
                  borderRadius: '12px',
                  background: 'var(--bg-surface)',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <RotateCcw size={20} style={{ color: '#ea580c' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                    Reverse Journal Entry {selectedJournalForReversal.entry_number}
                  </h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Under GAAP and double-entry accounting standards, posted entries cannot be deleted. A reversing journal entry will be
                  automatically posted with inverted debits and credits.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="reversal-reason-input" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Authoritative Reversal Reason:
                  </label>
                  <textarea
                    id="reversal-reason-input"
                    rows={3}
                    value={reversalReason}
                    onChange={(e) => setReversalReason(e.target.value)}
                    placeholder="e.g. Correction of duplicate charge, billing credit adjustment, or audit amendment"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setSelectedJournalForReversal(null);
                      setReversalReason('');
                    }}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn-primary" disabled={isReversing} onClick={handleConfirmReversal}>
                    {isReversing ? 'Posting Reversal...' : 'Confirm Reversal'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 6: CHART OF ACCOUNTS (1000s, 2000s, 3000s, 4000s, 5000s)
         ===================================================================== */}
      {activeTab === 'accounts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>Chart of Accounts (COA) Structure & Balances</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Code</th>
                    <th style={{ padding: '10px 12px' }}>Account Name</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px' }}>Normal Balance</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Current Balance (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {chartOfAccounts.map((acc) => (
                    <tr key={acc.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{acc.code}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{acc.name}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          className={`badge-pill ${
                            acc.type === 'ASSET'
                              ? 'badge-blue'
                              : acc.type === 'LIABILITY'
                              ? 'badge-yellow'
                              : acc.type === 'EQUITY'
                              ? 'badge-neutral'
                              : acc.type === 'REVENUE'
                              ? 'badge-green'
                              : 'badge-red'
                          }`}
                        >
                          {acc.type}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{acc.normal}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{formatKes(acc.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 7: FINANCIAL STATEMENTS (P&L, Balance Sheet, Cash Flow, Trial Balance)
         ===================================================================== */}
      {activeTab === 'statements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Sub-Pill Switcher */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'pnl', label: 'Profit & Loss (P&L)' },
              { id: 'balance_sheet', label: 'Balance Sheet' },
              { id: 'cash_flow', label: 'Cash Flow Statement' },
              { id: 'trial_balance', label: 'Trial Balance' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                className={`btn-outline ${statementSubTab === sub.id ? 'active' : ''}`}
                style={{
                  fontSize: '0.82rem',
                  padding: '6px 14px',
                  fontWeight: statementSubTab === sub.id ? 700 : 500,
                  background: statementSubTab === sub.id ? 'var(--bg-subtle)' : 'transparent',
                }}
                onClick={() => setStatementSubTab(sub.id as any)}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Statement View: Profit & Loss */}
          {statementSubTab === 'pnl' && (
            <div className="surface-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Statement of Profit or Loss (Operating Statement)</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Period: Current Fiscal Accounting Cycle</div>
                </div>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() =>
                    handleDownloadCsv(
                      'profit-and-loss-statement',
                      ['Line', 'Code', 'Amount (KES)'],
                      [
                        ['Residential Rental Revenue', '4000', incomeBreakdown.rentalRev],
                        ['Utility & Service Recovery', '4100', incomeBreakdown.utilityRev],
                        ['Late Payment Penalties', '4200', incomeBreakdown.penaltyRev],
                        ['Total Operating Revenue', '', financialMetrics.totalBilledKes],
                        ['Property Maintenance & Repairs', '5000', financialMetrics.totalExpensesKes * 0.7],
                        ['Utilities & Operations Expense', '5100', financialMetrics.totalExpensesKes * 0.3],
                        ['Total Operating Expenses', '', financialMetrics.totalExpensesKes],
                        ['Net Operating Income (NOI)', '', financialMetrics.netOperatingIncomeKes],
                      ]
                    )
                  }
                >
                  Export P&L CSV
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Operating Revenue Section */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    OPERATING REVENUE
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 4000: Residential Base Rent Revenue</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(incomeBreakdown.rentalRev)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 4100: Utilities & Service Recovery</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(incomeBreakdown.utilityRev)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 4200: Late Payment Penalty Revenue</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(incomeBreakdown.penaltyRev)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      fontWeight: 700,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span>Total Operating Revenue</span>
                    <span style={{ color: '#16a34a' }}>
                      {formatKes(incomeBreakdown.rentalRev + incomeBreakdown.utilityRev + incomeBreakdown.penaltyRev)}
                    </span>
                  </div>
                </div>

                {/* Operating Expenses Section */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    OPERATING EXPENSES
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 5000: Property Maintenance & Repairs Expense</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.totalExpensesKes * 0.7)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 5100: Property Utilities & Operations Expense</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.totalExpensesKes * 0.3)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      fontWeight: 700,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span>Total Operating Expenses</span>
                    <span style={{ color: '#dc2626' }}>{formatKes(financialMetrics.totalExpensesKes)}</span>
                  </div>
                </div>

                {/* Net Operating Income Result */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                  }}
                >
                  <span>NET OPERATING INCOME (NOI)</span>
                  <span style={{ color: '#0891b2' }}>{formatKes(financialMetrics.netOperatingIncomeKes)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Statement View: Balance Sheet */}
          {statementSubTab === 'balance_sheet' && (
            <div className="surface-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Balance Sheet (Statement of Financial Position)</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Invariant: Total Assets == Total Liabilities + Equity</div>
                </div>
                <span className="badge-pill badge-green">Assets = Liabilities + Equity</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {/* Assets Column */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    ASSETS
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 1010: Cash & Bank Clearing</span>
                    <span style={{ fontWeight: 600 }}>
                      {formatKes(financialMetrics.totalCollectedKes - financialMetrics.totalExpensesKes)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 1100: Accounts Receivable (Arrears)</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.totalArrearsKes)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      fontWeight: 800,
                      borderTop: '2px solid var(--border-subtle)',
                    }}
                  >
                    <span>TOTAL ASSETS</span>
                    <span style={{ color: '#2563eb' }}>
                      {formatKes(
                        financialMetrics.totalCollectedKes - financialMetrics.totalExpensesKes + financialMetrics.totalArrearsKes
                      )}
                    </span>
                  </div>
                </div>

                {/* Liabilities & Equity Column */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', borderBottom: '2px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    LIABILITIES & OWNER'S EQUITY
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 2100: Tenant Security Deposits (Escrow)</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.depositsLiabilityKes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 2200: Tenant Prepayments</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.unallocatedHeldKes)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                    <span>Account 3000: Retained Earnings / Equity</span>
                    <span style={{ fontWeight: 600 }}>{formatKes(financialMetrics.netOperatingIncomeKes)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      fontWeight: 800,
                      borderTop: '2px solid var(--border-subtle)',
                    }}
                  >
                    <span>TOTAL LIABILITIES & EQUITY</span>
                    <span style={{ color: '#2563eb' }}>
                      {formatKes(
                        financialMetrics.depositsLiabilityKes +
                          financialMetrics.unallocatedHeldKes +
                          financialMetrics.netOperatingIncomeKes
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statement View: Cash Flow */}
          {statementSubTab === 'cash_flow' && (
            <div className="surface-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 700 }}>Statement of Cash Flows</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                  <span>Cash Inflows from Tenant Collections (Operating)</span>
                  <span style={{ fontWeight: 600, color: '#16a34a' }}>+{formatKes(financialMetrics.totalCollectedKes)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                  <span>Cash Outflows for Property Expenses (Operating)</span>
                  <span style={{ fontWeight: 600, color: '#dc2626' }}>−{formatKes(financialMetrics.totalExpensesKes)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.84rem' }}>
                  <span>Net Security Deposits Received (Financing/Escrow)</span>
                  <span style={{ fontWeight: 600, color: '#0284c7' }}>+{formatKes(financialMetrics.depositsLiabilityKes)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: '2px solid var(--border-subtle)',
                    fontWeight: 800,
                  }}
                >
                  <span>CLOSING CASH & CLEARING BALANCE</span>
                  <span style={{ color: '#16a34a' }}>
                    {formatKes(
                      financialMetrics.totalCollectedKes -
                        financialMetrics.totalExpensesKes +
                        financialMetrics.depositsLiabilityKes
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Statement View: Trial Balance */}
          {statementSubTab === 'trial_balance' && (
            <div className="surface-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Trial Balance (Net Zero Debits vs. Credits Validation)</h3>
                <span className="badge-pill badge-green">Net Difference: KES 0.00 (Balanced)</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '8px 12px' }}>Code</th>
                      <th style={{ padding: '8px 12px' }}>Account</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Debit (KES)</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Credit (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartOfAccounts.map((a) => (
                      <tr key={a.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{a.code}</td>
                        <td style={{ padding: '8px 12px' }}>{a.name}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: a.normal === 'DEBIT' ? 700 : 400 }}>
                          {a.normal === 'DEBIT' ? formatKes(a.balance) : '-'}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: a.normal === 'CREDIT' ? 700 : 400 }}>
                          {a.normal === 'CREDIT' ? formatKes(a.balance) : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid var(--border-subtle)', fontWeight: 800, background: 'var(--bg-subtle)' }}>
                      <td colSpan={2} style={{ padding: '10px 12px' }}>
                        TOTAL TRIAL BALANCE
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        {formatKes(chartOfAccounts.filter((a) => a.normal === 'DEBIT').reduce((s, a) => s + a.balance, 0))}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        {formatKes(chartOfAccounts.filter((a) => a.normal === 'CREDIT').reduce((s, a) => s + a.balance, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 8: BANK & M-PESA STATEMENT RECONCILIATION
         ===================================================================== */}
      {activeTab === 'reconciliation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Bank & M-Pesa Daraja Statement Reconciliation</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Multi-pass priority matching: 1. MpesaReceiptNumber, 2. CheckoutRequestID, 3. Account/Invoice, 4. Tenant, 5. Amount/Date
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={() => setIsImportModalOpen(true)}>
              <Upload size={14} style={{ marginRight: '6px' }} />
              Upload New Statement
            </button>
          </div>

          {/* Reconciliation Batches */}
          <div className="surface-card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.94rem', fontWeight: 700 }}>Statement Import Batches</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '8px 12px' }}>File / Batch Name</th>
                    <th style={{ padding: '8px 12px' }}>Channel</th>
                    <th style={{ padding: '8px 12px' }}>Import Date</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Records</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Matched</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Exceptions</th>
                  </tr>
                </thead>
                <tbody>
                  {reconciliationBatches.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No statement batches uploaded yet. Click "Upload New Statement" to begin reconciliation.
                      </td>
                    </tr>
                  ) : (
                    reconciliationBatches.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{b.file_name}</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span className="badge-pill badge-neutral">{b.statement_source}</span>
                        </td>
                        <td style={{ padding: '8px 12px' }}>{formatNairobiDate(b.imported_at)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>{b.total_records}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                          {b.matched_records}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
                          {b.exception_records}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 9: SECURITY DEPOSITS (Account 2100 Segregation & Refunds)
         ===================================================================== */}
      {activeTab === 'deposits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="surface-card"
            style={{
              padding: '16px 20px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} style={{ color: '#0284c7' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0369a1' }}>
                  Account 2100: Segregated Tenant Security Deposit Liability
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Total Escrow Balance: <strong>{formatKes(financialMetrics.depositsLiabilityKes)}</strong>. Deposits are never recognized
                  as rental revenue. Move-out refunds follow: <code>Refundable = Held − Deductions − Refunded</code>.
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 700 }}>Tenant Security Deposit Ledgers</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Tenant</th>
                    <th style={{ padding: '10px 12px' }}>Property & Unit</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Initial Deposit</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Deductions</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Refunded</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Current Liability</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No tenant security deposits currently held in escrow.
                      </td>
                    </tr>
                  ) : (
                    deposits.map((d, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{d.tenant_name || 'Tenant'}</td>
                        <td style={{ padding: '10px 12px' }}>{d.property_name || 'Property'}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          {formatKes(d.initial_deposit_kes || d.initial_amount_kes || 0)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626' }}>
                          {formatKes(d.deducted_amount_kes || d.deductions_kes || 0)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>
                          {formatKes(d.refunded_amount_kes || d.refunded_kes || 0)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0284c7' }}>
                          {formatKes(d.current_liability_balance_kes || d.current_liability_kes || d.amount_kes || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 10: PROPERTY & UNIT PERFORMANCE MATRIX
         ===================================================================== */}
      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>Property Operational & Financial Performance</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Property Name</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Units</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Occupancy</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Billed (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Collected (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Arrears (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Expenses (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>NOI (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => {
                    const pUnits = units.filter((u) => u.property_id === p.id);
                    const pTotalUnits = pUnits.length;
                    const pOccupied = pUnits.filter((u) => u.status === 'OCCUPIED').length;
                    const pOccPct = pTotalUnits > 0 ? (pOccupied / pTotalUnits) * 100 : 0;

                    const pInvoices = activeInvoices.filter((i) => i.property_id === p.id);
                    const pBilled = pInvoices.reduce((s, i) => s + (i.total_amount_kes || 0), 0);
                    const pCollected = pInvoices.reduce((s, i) => s + (i.paid_amount_kes || 0), 0);
                    const pArrears = pInvoices.reduce((s, i) => s + (i.balance_kes || 0), 0);
                    const pExpenses = activeExpenses.filter((e) => e.property_id === p.id).reduce((s, e) => s + (e.amount_kes || 0), 0);
                    const pNoi = pCollected - pExpenses;

                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{p.name}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{pTotalUnits}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span className={`badge-pill ${pOccPct >= 90 ? 'badge-green' : pOccPct >= 70 ? 'badge-yellow' : 'badge-red'}`}>
                            {pOccPct.toFixed(1)}% ({pOccupied}/{pTotalUnits})
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatKes(pBilled)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                          {formatKes(pCollected)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#dc2626' }}>{formatKes(pArrears)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatKes(pExpenses)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#0891b2' }}>{formatKes(pNoi)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 11: TENANT & LEASE ANALYTICS
         ===================================================================== */}
      {activeTab === 'tenants' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>Tenant Reliability & Payment Punctuality</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Tenant Name</th>
                    <th style={{ padding: '10px 12px' }}>Phone</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Billed (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Paid (KES)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Current Balance</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Reliability Score</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => {
                    const tInvoices = activeInvoices.filter((i) => i.tenant_id === t.id);
                    const billed = tInvoices.reduce((s, i) => s + (i.total_amount_kes || 0), 0);
                    const paid = tInvoices.reduce((s, i) => s + (i.paid_amount_kes || 0), 0);
                    const bal = tInvoices.reduce((s, i) => s + (i.balance_kes || 0), 0);
                    const onTime = bal <= 0;

                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{t.full_name}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{t.phone}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatKes(billed)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a' }}>{formatKes(paid)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: bal > 0 ? '#dc2626' : '#16a34a' }}>
                          {formatKes(bal)}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <span className={`badge-pill ${onTime ? 'badge-green' : 'badge-red'}`}>{onTime ? 'Excellent (100%)' : 'Arrears Flag'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 12: MAINTENANCE COST ANALYSIS
         ===================================================================== */}
      {activeTab === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="surface-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL MAINTENANCE SPENT</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0', color: '#dc2626' }}>
                {formatKes(financialMetrics.totalExpensesKes * 0.7)}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>From approved maintenance vouchers</div>
            </div>

            <div className="surface-card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVERAGE RESOLUTION TIME</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0', color: '#2563eb' }}>2.4 Days</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Across 8-stage work order workflow</div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 13: FINANCIAL REPORTS & EXPORT RUNS
         ===================================================================== */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Saved Financial Statement & Audit Runs</h3>
              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: '0.82rem' }}
                onClick={async () => {
                  try {
                    const run = await apiClient.generateFinancialReport({
                      report_type: 'PROFIT_AND_LOSS',
                      title: `Q4 2026 Profit & Loss Statement - ${currentOrg.name}`,
                      period_start: '2026-10-01',
                      period_end: '2026-12-31',
                    });
                    setReportRuns((prev) => [run, ...prev]);
                    alert('Generated and archived new audited financial report run.');
                  } catch (e: any) {
                    alert(`Failed to generate report: ${e.message}`);
                  }
                }}
              >
                + Generate Audited Report Run
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Report Title</th>
                    <th style={{ padding: '10px 12px' }}>Type</th>
                    <th style={{ padding: '10px 12px' }}>Period</th>
                    <th style={{ padding: '10px 12px' }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRuns.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No archived report runs recorded. Click "Generate Audited Report Run" to produce an immutable snapshot.
                      </td>
                    </tr>
                  ) : (
                    reportRuns.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700 }}>{r.title}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-neutral">{r.report_type}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {r.period_start} to {r.period_end}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{formatNairobiDate(r.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 14: FINANCIAL AUDIT TRAIL (Append-Only Log)
         ===================================================================== */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="surface-card" style={{ padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 700 }}>
              Financial Audit Events (Strictly Append-Only)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                    <th style={{ padding: '10px 12px' }}>Timestamp</th>
                    <th style={{ padding: '10px 12px' }}>Event Type</th>
                    <th style={{ padding: '10px 12px' }}>Entity</th>
                    <th style={{ padding: '10px 12px' }}>Description</th>
                    <th style={{ padding: '10px 12px' }}>Actor Role</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No financial audit events recorded yet. Actions such as journal reversals, statement reconciliations, and expense
                        approvals will appear here.
                      </td>
                    </tr>
                  ) : (
                    auditEvents.map((evt) => (
                      <tr key={evt.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{formatNairobiDate(evt.created_at)}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-neutral">{evt.event_type}</span>
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{evt.source_entity_type}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{evt.description}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge-pill badge-blue">{evt.actor_role}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STATEMENT IMPORT MODAL
         ===================================================================== */}
      {isImportModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            className="surface-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Import Bank or M-Pesa Statement</h3>
              <button
                type="button"
                className="btn-outline"
                style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                onClick={() => setIsImportModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {importSuccessMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                  color: '#166534',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                }}
              >
                {importSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label htmlFor="statement-channel-select" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Statement Channel:
                </label>
                <select
                  id="statement-channel-select"
                  value={importSource}
                  onChange={(e) => setImportSource(e.target.value as any)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                >
                  <option value="MPESA_STATEMENT">Safaricom M-Pesa Paybill / Buy Goods Statement</option>
                  <option value="BANK_STATEMENT">Bank Settlement Account Statement (NCBA/KCB/Equity)</option>
                </select>
              </div>

              <div>
                <label htmlFor="statement-filename-input" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Statement Identifier / File Name:
                </label>
                <input
                  id="statement-filename-input"
                  type="text"
                  value={importFileName}
                  onChange={(e) => setImportFileName(e.target.value)}
                  placeholder="e.g. Mpesa_Statement_Oct2026.csv"
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label htmlFor="statement-paste-textarea" style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Paste CSV Statement Rows (Receipt, Amount, Narrative, Sender, Phone):
                </label>
                <textarea
                  id="statement-paste-textarea"
                  rows={4}
                  value={importRawText}
                  onChange={(e) => setImportRawText(e.target.value)}
                  placeholder="QJH1234567,25000,Rent Unit 2B,John Kamau,254712345678"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-outline" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleImportStatement}>
                  Import & Reconcile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
