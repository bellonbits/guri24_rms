import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
} from '../../../components/heroicons';
import { apiClient } from '../../../lib/apiClient';
import type { Invoice, Payment } from '../../../types';

interface StatementsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const StatementsView: React.FC<StatementsViewProps> = ({ onBack, showToast }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [financeError, setFinanceError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState('ALL');

  const loadFinanceData = async () => {
    setIsLoading(true);
    setFinanceError(null);
    try {
      const [invRes, payRes] = await Promise.all([
        apiClient.getInvoices(),
        apiClient.getPayments(),
      ]);
      setInvoices(invRes || []);
      setPayments(payRes || []);
    } catch (err: any) {
      setFinanceError(err?.message || 'Financial information unavailable. Spring Boot finance service may be unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  // Merge authoritative invoices and payments into unified double-entry ledger rows
  const ledgerRows = useMemo(() => {
    const rows: any[] = [];

    // Add Invoices as charges (debits)
    invoices.forEach((inv) => {
      rows.push({
        id: inv.id,
        date: inv.created_at || inv.due_date || 'Undated',
        timestamp: new Date(inv.created_at || inv.due_date || 0).getTime(),
        ref: inv.invoice_number || inv.id,
        type: 'INVOICE',
        description: inv.description || `Rent Invoice for period ${inv.billing_period || ''}`,
        chargeKes: inv.amount || 0,
        creditKes: 0,
        status: inv.status,
      });
    });

    // Add Payments as credits
    payments.forEach((pay) => {
      rows.push({
        id: pay.id,
        date: pay.created_at || 'Undated',
        timestamp: new Date(pay.created_at || 0).getTime(),
        ref: pay.reference || pay.mpesa_receipt_number || pay.id,
        type: 'PAYMENT',
        description: `Verified Payment via ${pay.channel || 'Safaricom C2B'} (Ref: ${pay.reference || pay.mpesa_receipt_number || ''})`,
        chargeKes: 0,
        creditKes: pay.amount || 0,
        status: pay.status,
      });
    });

    // Sort chronologically ascending to calculate running balance
    rows.sort((a, b) => a.timestamp - b.timestamp);

    let runningBalance = 0;
    return rows.map((r) => {
      runningBalance += r.chargeKes - r.creditKes;
      return {
        ...r,
        balanceKes: runningBalance,
      };
    });
  }, [invoices, payments]);

  const filteredRows = useMemo(() => {
    if (filterType === 'INVOICES') return ledgerRows.filter((r) => r.type === 'INVOICE');
    if (filterType === 'PAYMENTS') return ledgerRows.filter((r) => r.type === 'PAYMENT');
    return ledgerRows;
  }, [ledgerRows, filterType]);

  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalPaid = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
  const netBalance = totalBilled - totalPaid;

  const handleExportCsv = () => {
    if (filteredRows.length === 0) {
      if (showToast) showToast('No statement rows available to export.');
      return;
    }
    const headers = 'Date,Reference,Type,Description,Charge (KES),Credit (KES),Running Balance (KES)\n';
    const csvContent =
      headers +
      filteredRows
        .map(
          (r) =>
            `"${r.date}","${r.ref}","${r.type}","${r.description.replace(/"/g, '""')}",${r.chargeKes},${r.creditKes},${r.balanceKes}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rent_statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Statement CSV exported.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Rent Statements & Ledger
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Authoritative double-entry rent ledger from Spring Boot Finance Service.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCsv}
            disabled={filteredRows.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#334155',
              cursor: filteredRows.length === 0 ? 'not-allowed' : 'pointer',
              opacity: filteredRows.length === 0 ? 0.6 : 1,
            }}
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            disabled={filteredRows.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#334155',
              cursor: filteredRows.length === 0 ? 'not-allowed' : 'pointer',
              opacity: filteredRows.length === 0 ? 0.6 : 1,
            }}
          >
            <Printer size={15} /> Print Statement
          </button>
        </div>
      </div>

      {/* Financial Health Banner / Status */}
      {financeError ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AlertCircle size={32} color="#dc2626" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#991b1b' }}>
              Financial information unavailable
            </div>
            <div style={{ fontSize: '0.84rem', color: '#7f1d1d', marginTop: '2px' }}>
              {financeError}
            </div>
          </div>
          <button
            onClick={loadFinanceData}
            style={{ padding: '8px 16px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      ) : (
        /* Summary Metric Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Invoiced Charges</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              KES {totalBilled.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'} posted
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Verified Payments</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a' }}>
              KES {totalPaid.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {payments.length} {payments.length === 1 ? 'payment' : 'payments'} verified
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Outstanding Balance</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: netBalance > 0 ? '#dc2626' : '#059669' }}>
              KES {netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
              {netBalance === 0 ? 'Account fully settled' : 'Unpaid balance outstanding'}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'ALL', label: 'All Transactions' },
          { id: 'INVOICES', label: 'Invoiced Charges Only' },
          { id: 'PAYMENTS', label: 'Verified Payments Only' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: filterType === f.id ? '#0f172a' : '#f1f5f9',
              color: filterType === f.id ? '#ffffff' : '#64748b',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#2563eb' }} />
            <div>Querying authoritative financial ledger...</div>
          </div>
        ) : filteredRows.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <FileText size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto', strokeWidth: 1.5 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: '0 0 4px 0' }}>
              No statement records found
            </h3>
            <p style={{ fontSize: '0.84rem', margin: 0 }}>
              {invoices.length === 0 && payments.length === 0
                ? 'No payment transactions have been recorded for this tenancy yet.'
                : 'No transactions match the selected filter.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '14px 18px' }}>Date</th>
                  <th style={{ padding: '14px 18px' }}>Reference</th>
                  <th style={{ padding: '14px 18px' }}>Transaction Description</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Charge (KES)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Payment (KES)</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Balance (KES)</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 18px', color: '#64748b', whiteSpace: 'nowrap' }}>{row.date}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                      {row.ref}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#334155' }}>{row.description}</td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 600, color: row.chargeKes > 0 ? '#0f172a' : '#94a3b8' }}>
                      {row.chargeKes > 0 ? `KES ${row.chargeKes.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: row.creditKes > 0 ? '#16a34a' : '#94a3b8' }}>
                      {row.creditKes > 0 ? `KES ${row.creditKes.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                      KES {row.balanceKes.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: row.status === 'PAID' || row.status === 'COMPLETED' || row.status === 'SETTLED' ? '#dcfce7' : '#eff6ff',
                          color: row.status === 'PAID' || row.status === 'COMPLETED' || row.status === 'SETTLED' ? '#15803d' : '#2563eb',
                        }}
                      >
                        {row.status || 'POSTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
