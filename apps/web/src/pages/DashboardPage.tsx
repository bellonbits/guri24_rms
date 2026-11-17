import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Star,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  MapPin,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { TopKpiRow } from '../components/TopKpiRow';
import { formatKes, formatNairobiDate } from '../lib/formatters';
import { StatusBadge, ResponsiveTable, FeaturedPropertyIllustration } from '../components/ui/Primitives';

export const DashboardPage: React.FC = () => {
  const { currentOrg } = useAuth();
  const { state } = useRms();
  const [selectedMonth, setSelectedMonth] = useState('Nov');

  const orgLeases = useMemo(
    () => state.leases.filter((l) => l.organization_id === currentOrg.id),
    [state.leases, currentOrg.id]
  );
  const orgInvoices = useMemo(
    () => state.invoices.filter((i) => i.organization_id === currentOrg.id),
    [state.invoices, currentOrg.id]
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

  const featuredProperty = orgProperties[0];

  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, idx) => {
      const monthInvs = orgInvoices.filter((inv) => {
        const d = new Date(inv.issue_date);
        return d.getMonth() === idx;
      });
      const rev = monthInvs.reduce((sum, i) => sum + (Number(i.total_amount_kes) || 0), 0);
      return {
        month: m,
        count: monthInvs.length,
        revenueKes: rev,
      };
    });
  }, [orgInvoices]);

  const maxChartCount = useMemo(() => {
    const counts = monthlyChartData.map((d) => d.count);
    return Math.max(5, ...counts);
  }, [monthlyChartData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 4 KPI Summary Cards */}
      <TopKpiRow />

      <div className="dashboard-main-grid">
        {/* LEFT COLUMN */}
        <div className="stack-column">
          {/* Rental Overview Card */}
          <section className="surface-card" aria-labelledby="rental-overview-heading">
            <div className="card-header">
              <div className="card-title-group">
                <BarChart3 size={17} color="#4b5563" aria-hidden="true" />
                <h2 id="rental-overview-heading" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  Rental Overview
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/app/analytics-ledger"
                  className="btn-outline"
                  style={{ minBlockSize: '32px', padding: '4px 11px', fontSize: '0.76rem', textDecoration: 'none' }}
                >
                  <Calendar size={13} aria-hidden="true" />
                  <span>Full Ledger</span>
                  <ChevronRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                }}
              >
                {orgLeases.length}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBlockStart: '2px' }}>
                Active Leases in Portfolio
              </div>
            </div>

            <div className="bar-chart-stage" role="img" aria-label="Monthly lease bookings chart">
              <div className="bar-y-axis" aria-hidden="true">
                <span>{maxChartCount}</span>
                <span>{Math.round(maxChartCount * 0.75)}</span>
                <span>{Math.round(maxChartCount * 0.5)}</span>
                <span>{Math.round(maxChartCount * 0.25)}</span>
                <span>0</span>
              </div>
              <div className="bar-columns">
                {monthlyChartData.map((item) => {
                  const isSelected = item.month === selectedMonth;
                  const hasActivity = monthlyChartData.some((d) => d.count > 0);
                  const heightPct = hasActivity
                    ? Math.max(8, Math.round((item.count / maxChartCount) * 100))
                    : 8;
                  return (
                    <div
                      key={item.month}
                      className="bar-col-wrap"
                      onClick={() => setSelectedMonth(item.month)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.month}: ${item.count} invoices, ${formatKes(item.revenueKes)}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedMonth(item.month);
                        }
                      }}
                    >
                      {isSelected && (
                        <div className="bar-tooltip">
                          {item.count} inv &bull; {formatKes(item.revenueKes)}
                        </div>
                      )}
                      <div
                        className={`bar-pill ${isSelected ? 'bar-pill-active' : ''}`}
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className={`bar-month-label ${isSelected ? 'bar-month-label-active' : ''}`}>
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent Leases & Invoices Table */}
          <section className="surface-card" aria-labelledby="recent-leases-heading">
            <div className="card-header">
              <div className="card-title-group">
                <FileText size={17} color="#4b5563" aria-hidden="true" />
                <h2 id="recent-leases-heading" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  Recent Lease Bookings & Billing
                </h2>
              </div>
              <Link
                to="/app/leases-bookings"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                <span>View all</span>
                <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>

            <ResponsiveTable
              caption="Recent residential leases and monthly rent billing"
              headers={['Tenant', 'Residence & Unit', 'Due Date', 'Status', 'Amount']}
            >
              {orgInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                    No recent billing invoices or rent transactions found for this organization.
                  </td>
                </tr>
              ) : (
                orgInvoices.slice(0, 5).map((inv) => {
                  const tenant = orgTenants.find((t) => t.id === inv.tenant_id);
                  const unit = orgUnits.find((u) => u.id === inv.unit_id);
                  const prop = orgProperties.find((p) => p.id === inv.property_id);
                  const tone =
                    inv.status === 'PAID'
                      ? 'success'
                      : inv.status === 'PARTIALLY_PAID'
                      ? 'warning'
                      : inv.status === 'OVERDUE'
                      ? 'danger'
                      : 'info';
                  const label =
                    inv.status === 'PAID'
                      ? 'Confirmed'
                      : inv.status === 'PARTIALLY_PAID'
                      ? 'Partial'
                      : inv.status === 'OVERDUE'
                      ? 'Pending'
                      : 'Issued';

                  return (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minInlineSize: '165px' }}>
                          <div
                            className="profile-avatar"
                            style={{
                              inlineSize: '32px',
                              blockSize: '32px',
                              fontSize: '0.74rem',
                              background: '#e0e7ff',
                              color: '#1d4ed8',
                            }}
                            aria-hidden="true"
                          >
                            {(tenant?.full_name ?? 'TN')
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div style={{ minInlineSize: 0 }}>
                            <div className="cell-nowrap" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                              {tenant?.full_name ?? 'Registered Tenant'}
                            </div>
                            <div className="cell-nowrap" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {tenant?.email ?? tenant?.phone ?? '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-nowrap" style={{ fontWeight: 600, fontSize: '0.82rem' }}>
                          {prop ? `${prop.name} • ` : ''}Unit {unit?.unit_number ?? '—'}
                        </div>
                        <div className="cell-nowrap" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {unit ? unit.unit_type : 'Residential Unit'}
                        </div>
                      </td>
                      <td className="cell-nowrap">
                        <div style={{ fontWeight: 500, fontSize: '0.8rem' }}>
                          {formatNairobiDate(inv.due_date)}
                        </div>
                      </td>
                      <td className="cell-nowrap">
                        <StatusBadge status={label} tone={tone} />
                      </td>
                      <td className="cell-currency">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span>{formatKes(inv.total_amount_kes)}</span>
                          <Link to={`/app/payments-mpesa/invoices`} style={{ color: '#8e95a2' }}>
                            <ChevronRight size={14} aria-hidden="true" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </ResponsiveTable>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="stack-column">
          {/* Featured Property Card */}
          <section className="surface-card" aria-labelledby="featured-property-heading">
            <div className="card-header">
              <div className="card-title-group">
                <Star size={17} color="#4b5563" aria-hidden="true" />
                <h2 id="featured-property-heading" style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                  Featured Property
                </h2>
              </div>
              <Link to="/app/properties-units" className="btn-icon-only" aria-label="View all properties">
                <MoreVertical size={15} aria-hidden="true" />
              </Link>
            </div>

            <FeaturedPropertyIllustration
              propertyName={featuredProperty?.name || 'Jacaranda Heights Residency'}
              estateLocation={`${featuredProperty?.county || 'Nairobi'}, ${featuredProperty?.estate_zone || 'Westlands'}`}
            />

            <div style={{ marginBlockStart: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {featuredProperty?.name || 'Jacaranda Heights Residency'}
                </h3>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatKes(45000)}/mo
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBlock: '4px 12px' }}>
                {featuredProperty?.county || 'Nairobi'} County &bull; {featuredProperty?.property_type || 'Multi-Unit Complex'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBlockStart: '12px' }}>
              <Link
                to={`/app/properties-units`}
                className="btn-dark"
                style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
              >
                <span>Manage Units</span>
              </Link>
              <Link
                to="/app/leases-bookings"
                className="btn-outline"
                style={{ textDecoration: 'none' }}
              >
                <span>Bookings</span>
              </Link>
            </div>
          </section>

          {/* Quick Operations Matrix */}
          <section className="surface-card">
            <div className="card-header">
              <div className="card-title-group">
                <Activity size={17} color="#4b5563" aria-hidden="true" />
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Quick Operations</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <Link
                to="/app/properties-units"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <Building2 size={18} color="#2563eb" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Units Catalog</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{orgUnits.length} total units</span>
              </Link>

              <Link
                to="/app/tenants"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <Users size={18} color="#16a34a" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Tenants</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{orgTenants.length} registered</span>
              </Link>

              <Link
                to="/app/payments-mpesa"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <CreditCard size={18} color="#0284c7" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>M-Pesa Ledger</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Paybill 174379</span>
              </Link>

              <Link
                to="/app/estates-deposits"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <MapPin size={18} color="#d97706" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Account 2100</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Deposits held</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
