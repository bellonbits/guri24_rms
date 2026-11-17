import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, ShieldCheck, Building2, Smartphone, Users, CreditCard, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { ResponsiveTable, StatusBadge } from '../components/ui/Primitives';

export const SettingsPortalPage: React.FC = () => {
  const { currentOrg, currentUserSession, currentUserRole } = useAuth();
  const { state, loadWorkspaceSnapshot } = useRms();
  const location = useLocation();

  const isOrgView = location.pathname.includes('/organization');
  const isUsersView = location.pathname.includes('/users');
  const isBillingView = location.pathname.includes('/billing');
  const isIntegrationsView = location.pathname.includes('/integrations');
  const isGeneralView = !isOrgView && !isUsersView && !isBillingView && !isIntegrationsView;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px', overflowX: 'auto' }}>
        <Link
          to="/app/settings-portal"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isGeneralView ? '#ffffff' : 'transparent',
            color: isGeneralView ? '#0f172a' : '#64748b',
            boxShadow: isGeneralView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          General
        </Link>
        <Link
          to="/app/settings-portal/organization"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isOrgView ? '#ffffff' : 'transparent',
            color: isOrgView ? '#0f172a' : '#64748b',
            boxShadow: isOrgView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Organization Profile
        </Link>
        <Link
          to="/app/settings-portal/users"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isUsersView ? '#ffffff' : 'transparent',
            color: isUsersView ? '#0f172a' : '#64748b',
            boxShadow: isUsersView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Team & RBAC
        </Link>
        <Link
          to="/app/settings-portal/billing"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isBillingView ? '#ffffff' : 'transparent',
            color: isBillingView ? '#0f172a' : '#64748b',
            boxShadow: isBillingView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Subscription & Billing
        </Link>
        <Link
          to="/app/settings-portal/integrations"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            background: isIntegrationsView ? '#ffffff' : 'transparent',
            color: isIntegrationsView ? '#0f172a' : '#64748b',
            boxShadow: isIntegrationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          Integration Services
        </Link>
      </div>

      {/* Main Content Area */}
      {isIntegrationsView ? (
        <section className="surface-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>External Integrations & Provider Readiness</h2>
            <button type="button" className="btn-outline" onClick={loadWorkspaceSnapshot} style={{ fontSize: '0.78rem' }}>
              <RefreshCw size={13} />
              <span>Verify Health</span>
            </button>
          </div>

          <ResponsiveTable
            caption="Integration status across Supabase, Redis, M-Pesa, Resend and MinIO"
            headers={['Service Name', 'Provider / Engine', 'Health Status', 'Latency / Port', 'Target']}
          >
            {state.integrationsStatus.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
                  Live integration probes executing against Docker microservices...
                </td>
              </tr>
            ) : (
              state.integrationsStatus.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.service}</td>
                  <td>{item.provider}</td>
                  <td>
                    <StatusBadge
                      status={item.status}
                      tone={item.status === 'CONNECTED' || item.status === 'ACTIVE' ? 'success' : 'warning'}
                    />
                  </td>
                  <td style={{ color: '#64748b' }}>{item.details || 'Normal (2ms)'}</td>
                  <td style={{ fontSize: '0.78rem' }}>{item.endpoint || 'Internal Docker Mesh'}</td>
                </tr>
              ))
            )}
          </ResponsiveTable>
        </section>
      ) : isUsersView ? (
        <section className="surface-card">
          <h2 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 600 }}>Active User Profile & Permissions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Authenticated Name</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{currentUserSession?.fullName || 'Administrator'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Registered Email</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{currentUserSession?.email || 'admin@guri24.co.ke'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>System Role (Server Authoritative)</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2563eb' }}>{currentUserRole || 'ORGANIZATION_ADMINISTRATOR'}</div>
            </div>
          </div>
        </section>
      ) : isBillingView ? (
        <section className="surface-card">
          <h2 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 600 }}>SaaS Subscription Plan</h2>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge-pill badge-neutral" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                  Enterprise Plan
                </span>
                <h3 style={{ margin: '6px 0 2px 0', fontSize: '1.2rem', fontWeight: 700 }}>
                  Guri24 RMS Enterprise Tier
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  Unlimited managed properties, M-Pesa Daraja STK Push callbacks, and olmOCR processing.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16a34a' }}>KES 12,000 / mo</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Renews on the 1st of every month</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          <section className="surface-card">
            <h2 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 600 }}>Organization Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Company Name:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>County Jurisdiction:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.county}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>KRA PIN:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.kra_pin || 'P051892341K'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Currency:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Timezone:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.timezone}</span>
              </div>
            </div>
          </section>

          <section className="surface-card">
            <h2 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 600 }}>Financial & M-Pesa Policies</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>M-Pesa Paybill / Till:</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>{currentOrg.mpesa_paybill_shortcode || '174379'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Allocation Strategy:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.payment_allocation_strategy || 'FIFO_OLDEST_FIRST'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Late Fee Grace Period:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.late_fee_grace_days || 5} days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748b' }}>Late Fee Percentage:</span>
                <span style={{ fontWeight: 600 }}>{currentOrg.late_fee_percentage || 5}%</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
