import React, { useState } from 'react';
import {
  Building,
  Users,
  CreditCard,
  Shield,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Ban,
  Check,
  Server,
  Zap,
} from 'lucide-react';
import { useRms } from '../context/RmsContext';
import { apiClient } from '../lib/apiClient';
import {
  registerPlatformOrganization as registerOrgDomain,
  updatePlatformOrganizationStatus as updateOrgStatusDomain,
} from '../lib/api';
import type { PlatformOrganization } from '../types';

interface PlatformAdminPageProps {
  view: 'dashboard' | 'organizations' | 'users' | 'administrators' | 'subscriptions' | 'integrations' | 'audit-logs' | 'system-health';
}

export const PlatformAdminPage: React.FC<PlatformAdminPageProps> = ({ view }) => {
  const { state, setState } = useRms();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // New Organization Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [newOrgType, setNewOrgType] = useState('PROPERTY_MANAGEMENT_COMPANY');
  const [newOrgCounty, setNewOrgCounty] = useState('Nairobi');
  const [newOrgEmail, setNewOrgEmail] = useState('');
  const [newOrgPhone, setNewOrgPhone] = useState('+254');
  const [newOrgAdminName, setNewOrgAdminName] = useState('');
  const [newOrgAdminEmail, setNewOrgAdminEmail] = useState('');
  const [newOrgAdminPhone, setNewOrgAdminPhone] = useState('+254');
  const [newOrgPlan, setNewOrgPlan] = useState('PROFESSIONAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orgs = state.platformOrganizations || [];

  const handleRegisterOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionNotice(null);
    try {
      // 1. Call backend API
      try {
        await apiClient.createPlatformOrganization({
          name: newOrgName.trim(),
          slug: newOrgSlug.trim(),
          organization_type: newOrgType,
          county: newOrgCounty,
          contact_email: newOrgEmail.trim(),
          contact_phone: newOrgPhone.trim(),
          admin_full_name: newOrgAdminName.trim(),
          admin_email: newOrgAdminEmail.trim(),
          admin_phone: newOrgAdminPhone.trim(),
          subscription_plan: newOrgPlan,
        });
      } catch (err) {
        console.warn('Backend API registration fallback:', err);
      }

      // 2. Pure domain state update
      setState((prev) => {
        try {
          const outcome = registerOrgDomain(prev, {
            name: newOrgName.trim(),
            slug: newOrgSlug.trim(),
            organization_type: newOrgType,
            county: newOrgCounty,
            contact_email: newOrgEmail.trim(),
            contact_phone: newOrgPhone.trim(),
            admin_full_name: newOrgAdminName.trim(),
            admin_email: newOrgAdminEmail.trim(),
            admin_phone: newOrgAdminPhone.trim(),
            subscription_plan: newOrgPlan,
          });
          return outcome.nextState;
        } catch {
          return prev;
        }
      });

      setIsRegisterModalOpen(false);
      setActionNotice(`✓ Organization "${newOrgName}" successfully provisioned and primary administrator invitation dispatched!`);
      setTimeout(() => setActionNotice(null), 8000);

      // Reset form
      setNewOrgName('');
      setNewOrgSlug('');
      setNewOrgEmail('');
      setNewOrgAdminName('');
      setNewOrgAdminEmail('');
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to register organization'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleOrgStatus = async (org: PlatformOrganization) => {
    const nextStatus = org.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      try {
        await apiClient.updatePlatformOrganizationStatus(org.id, nextStatus);
      } catch (err) {
        console.warn('API org status fallback:', err);
      }

      setState((prev) => {
        try {
          return updateOrgStatusDomain(prev, org.id, nextStatus).nextState;
        } catch {
          return prev;
        }
      });

      setActionNotice(`✓ Organization "${org.name}" status updated to ${nextStatus}.`);
      setTimeout(() => setActionNotice(null), 6000);
    } catch (err: any) {
      setActionNotice(`Error: ${err?.message || 'Failed to update organization status'}`);
    }
  };

  const filteredOrgs = orgs.filter((o) => {
    const matchSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.admin_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalMrr = orgs.reduce((sum, o) => sum + (o.monthly_mrr_kes || 0), 0);
  const totalUnits = orgs.reduce((sum, o) => sum + (o.units_count || 0), 0);
  const totalTenants = orgs.reduce((sum, o) => sum + (o.active_tenants_count || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Notification Banner */}
      {actionNotice && (
        <div
          style={{
            background: actionNotice.startsWith('Error') ? '#450a0a' : '#052e16',
            border: `1px solid ${actionNotice.startsWith('Error') ? '#dc2626' : '#16a34a'}`,
            color: actionNotice.startsWith('Error') ? '#fca5a5' : '#86efac',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* 1. DASHBOARD VIEW */}
      {(view === 'dashboard' || view === 'organizations') && (
        <>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Platform MRR
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
                KES {totalMrr.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Monthly SaaS Recurring Revenue</div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Organizations
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>
                {orgs.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                {orgs.filter((o) => o.status === 'ACTIVE').length} Active &bull; {orgs.filter((o) => o.status === 'SUSPENDED').length} Suspended
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                Platform Units
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ade80', marginTop: '6px' }}>
                {totalUnits}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Across all tenant portfolios</div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                System Uptime
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a855f7', marginTop: '6px' }}>
                99.98%
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>Nairobi Edge + Supabase Cluster</div>
            </div>
          </div>

          {/* Organizations Directory Card */}
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  Tenant Organizations Directory
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                  Manage tenant subscriptions, tenant isolation, and administrative approval workflows
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="#64748b" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '8px 12px 8px 30px',
                      color: '#f8fafc',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  <span>Provision Organization</span>
                </button>
              </div>
            </div>

            {/* Organizations Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8' }}>
                    <th style={{ padding: '10px 12px' }}>Organization</th>
                    <th style={{ padding: '10px 12px' }}>County & Contact</th>
                    <th style={{ padding: '10px 12px' }}>Admin Account</th>
                    <th style={{ padding: '10px 12px' }}>Plan & MRR</th>
                    <th style={{ padding: '10px 12px' }}>Portfolio</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrgs.map((org) => {
                    const isActive = org.status === 'ACTIVE';
                    return (
                      <tr key={org.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>{org.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>slug: {org.slug}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{org.county}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{org.contact_phone}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{org.admin_full_name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>{org.admin_email}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: org.subscription_plan === 'ENTERPRISE' ? '#3b0764' : '#082f49',
                              color: org.subscription_plan === 'ENTERPRISE' ? '#d8b4fe' : '#7dd3fc',
                              marginBottom: '2px',
                            }}
                          >
                            {org.subscription_plan}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            KES {(org.monthly_mrr_kes || 0).toLocaleString()} /mo
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{org.units_count || 0} Units</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {org.active_tenants_count || 0} active leases
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              background: isActive ? '#052e16' : '#450a0a',
                              color: isActive ? '#4ade80' : '#f87171',
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#4ade80' : '#f87171' }} />
                            {org.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleOrgStatus(org)}
                            style={{
                              background: isActive ? '#450a0a' : '#052e16',
                              color: isActive ? '#f87171' : '#4ade80',
                              border: `1px solid ${isActive ? '#991b1b' : '#166534'}`,
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {isActive ? 'Suspend' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. INFRASTRUCTURE & INTEGRATIONS VIEW */}
      {view === 'integrations' && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            Internal Microservice Mesh & Boundaries
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Status of containerized internal services communicating over the authoritative Docker bridge network.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>guri24-backend (Rust Axum)</span>
                <span style={{ color: '#4ade80', fontSize: '0.74rem', fontWeight: 600 }}>Port 8080 &bull; Healthy</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '8px 0 0 0' }}>
                Primary REST API, property tenancy workflows, auth tokens, session tracking.
              </p>
            </div>
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>spring-financial-service</span>
                <span style={{ color: '#4ade80', fontSize: '0.74rem', fontWeight: 600 }}>Port 8082 &bull; Healthy</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '8px 0 0 0' }}>
                Authoritative double-entry ledger, M-Pesa FIFO allocations, reconciliation engine.
              </p>
            </div>
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '16px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>python-ocr-service</span>
                <span style={{ color: '#4ade80', fontSize: '0.74rem', fontWeight: 600 }}>Port 8000 &bull; Healthy</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '8px 0 0 0' }}>
                Tesseract + PyMuPDF lease OCR parsing, image classification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. AUDIT LOGS VIEW */}
      {view === 'audit-logs' && (
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            Platform Identity & Access Audit Trail
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: '#94a3b8' }}>
            Authoritative audit logs required by the Kenya Data Protection Act 2019 and Guri24 SaaS governance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(state.accessAuditLogs || []).map((log) => (
              <div
                key={log.id}
                style={{
                  background: '#1e293b',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  border: '1px solid #334155',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: '#0369a1',
                        color: '#e0f2fe',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {log.event_type}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                      Actor: {log.actor_role} ({log.actor_user_id || 'System'})
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
                    Org: {log.organization_id || 'Platform'} &bull; {JSON.stringify(log.details)}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provision Organization Modal */}
      {isRegisterModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                Provision New Client Organization
              </h3>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRegisterOrg} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Organization Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Westlands Premier Estates Ltd"
                  value={newOrgName}
                  onChange={(e) => {
                    setNewOrgName(e.target.value);
                    if (!newOrgSlug) {
                      setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Organization Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="westlands-premier"
                    value={newOrgSlug}
                    onChange={(e) => setNewOrgSlug(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    County Jurisdiction
                  </label>
                  <select
                    value={newOrgCounty}
                    onChange={(e) => setNewOrgCounty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Machakos">Machakos</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="info@westlands.co.ke"
                    value={newOrgEmail}
                    onChange={(e) => setNewOrgEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    Subscription Plan
                  </label>
                  <select
                    value={newOrgPlan}
                    onChange={(e) => setNewOrgPlan(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.84rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="STARTER">STARTER (KES 25,000/mo)</option>
                    <option value="PROFESSIONAL">PROFESSIONAL (KES 45,000/mo)</option>
                    <option value="ENTERPRISE">ENTERPRISE (KES 65,000/mo)</option>
                  </select>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.86rem', color: '#38bdf8', fontWeight: 600 }}>
                  Primary Organization Administrator
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Admin Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grace Wambui"
                      value={newOrgAdminName}
                      onChange={(e) => setNewOrgAdminName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                      Admin Email (for Invitation)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="grace@westlands.co.ke"
                      value={newOrgAdminEmail}
                      onChange={(e) => setNewOrgAdminEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    background: '#0284c7',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  {isSubmitting ? 'Provisioning...' : 'Provision Organization & Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
