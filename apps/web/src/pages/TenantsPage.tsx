import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  FileText,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Clock,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  Calendar,
  Building,
  Home,
  Briefcase,
  MapPin,
  CreditCard,
  FileCheck,
} from 'lucide-react';
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
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [activeApplicationTab, setActiveApplicationTab] = useState<'app' | 'history' | 'docs' | 'notes'>('app');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');

  const isApplicationsView = location.pathname.includes('/applications');

  // Ensure default demo tenants include Courtney Henry if not yet present
  const orgTenants = useMemo(() => {
    const raw = (state?.tenants || []).filter((t) => t.organization_id === currentOrg.id);
    const hasCourtney = raw.some((t) => t.full_name.toLowerCase().includes('courtney'));
    if (!hasCourtney) {
      const courtneyTenant: Tenant = {
        id: 'ten-courtney-henry',
        organization_id: currentOrg.id,
        full_name: 'Courtney Henry',
        phone: '+44 9999 999 999',
        email: 'courtneyh@gmail.com',
        id_number: '9834Y65',
        status: 'ACTIVE',
        created_at: '2024-06-21T10:00:00Z',
        updated_at: '2024-06-21T10:00:00Z',
      };
      return [courtneyTenant, ...raw];
    }
    return raw;
  }, [state?.tenants, currentOrg.id]);

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
    setActionSuccessMessage(`Tenant ${newTenant.full_name} successfully added.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleApproveApplication = () => {
    const approvedTenant: Tenant = {
      id: 'ten-courtney-henry',
      organization_id: currentOrg.id,
      full_name: 'Courtney Henry',
      phone: '+44 9999 999 999',
      email: 'courtneyh@gmail.com',
      id_number: '9834Y65',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setState((prev) => {
      const exists = prev.tenants.some((t) => t.id === approvedTenant.id);
      return {
        ...prev,
        tenants: exists ? prev.tenants : [approvedTenant, ...prev.tenants],
      };
    });

    setActionSuccessMessage('Application approved! Courtney Henry has been enrolled into registered active leases.');
    setTimeout(() => {
      setActionSuccessMessage(null);
      navigate('/app/tenants/ten-courtney-henry');
    }, 1500);
  };

  const handleRejectApplication = () => {
    setActionSuccessMessage('Application rejected and archived. The applicant has been notified.');
    setTimeout(() => {
      setActionSuccessMessage(null);
      navigate('/app/tenants');
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: '12px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#065f46' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Header & Sub-Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <Link
            to="/app/tenants"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: !isApplicationsView ? '#ffffff' : 'transparent',
              color: !isApplicationsView ? '#0f172a' : '#64748b',
              boxShadow: !isApplicationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Registered Tenants ({orgTenants.length})
          </Link>
          <Link
            to="/app/tenants/applications"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isApplicationsView ? '#ffffff' : 'transparent',
              color: isApplicationsView ? '#0f172a' : '#64748b',
              boxShadow: isApplicationsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Prospective Applications (1)
          </Link>
        </div>

        {hasPermission('tenants.create') && !isApplicationsView && (
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsAddTenantModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px' }}
          >
            <Plus size={15} />
            <span>Add Tenant</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. PROSPECTIVE APPLICATION VIEW (IMAGE 1 DESIGN)                         */}
      {/* ========================================================================= */}
      {isApplicationsView && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link
                to="/app/tenants"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  background: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#64748b' }}>
                <Users size={14} />
                <span>Tenants</span>
                <span>/</span>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>Tenant Details</span>
              </div>
            </div>

            {/* Action Buttons: Reject & Proceed Application */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={handleRejectApplication}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '8px',
                }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleApproveApplication}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '9px 20px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>Proceed Application</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Tenant Details</h2>

          {/* Two-Column Grid matching Image 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 320px) minmax(0, 1fr)', gap: '24px' }}>
            {/* Left Card: Personal Details */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                alt="Courtney Henry"
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #f8fafc',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  marginBottom: '14px',
                }}
              />
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Courtney Henry
              </h3>

              <div style={{ width: '100%', height: '1px', background: '#f1f5f9', marginBottom: '18px' }} />

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Personal Details
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b' }}>Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b' }}>Email Id :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>courtneyh@gmail.com</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b' }}>Occupation :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>Sr. UX/UI Designer</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b' }}>Emergency Contact No. :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>+44 9999 999 999</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#64748b' }}>Current Address :</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', maxWidth: '170px' }}>
                    9865 Aurore Expressway
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Tabs & Application Data */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              {/* Tab Navigation matching Image 1 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '12px',
                  marginBottom: '24px',
                  overflowX: 'auto',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveApplicationTab('app')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '0.88rem',
                    fontWeight: activeApplicationTab === 'app' ? 700 : 500,
                    color: activeApplicationTab === 'app' ? '#2563eb' : '#64748b',
                    borderBottom: activeApplicationTab === 'app' ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Application Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveApplicationTab('history')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '0.88rem',
                    fontWeight: activeApplicationTab === 'history' ? 700 : 500,
                    color: activeApplicationTab === 'history' ? '#2563eb' : '#64748b',
                    borderBottom: activeApplicationTab === 'history' ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Rental History <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>02</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveApplicationTab('docs')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '0.88rem',
                    fontWeight: activeApplicationTab === 'docs' ? 700 : 500,
                    color: activeApplicationTab === 'docs' ? '#2563eb' : '#64748b',
                    borderBottom: activeApplicationTab === 'docs' ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Documents <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>03</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveApplicationTab('notes')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '0.88rem',
                    fontWeight: activeApplicationTab === 'notes' ? 700 : 500,
                    color: activeApplicationTab === 'notes' ? '#2563eb' : '#64748b',
                    borderBottom: activeApplicationTab === 'notes' ? '2px solid #2563eb' : '2px solid transparent',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Notes & Comments
                </button>
              </div>

              {/* Tab 1: Application Details */}
              {activeApplicationTab === 'app' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px 48px',
                    fontSize: '0.86rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Application Date :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>23 June 2024</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>No. of Occupants :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Desired Move-in Date :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>01 July 2024</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Pet(s) :</span>
                    <span style={{ fontWeight: 600, color: '#64748b' }}>--</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Desired Lease Term :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>2 Years</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Car(s) :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>02</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Marital Status :</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>Married</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '12px' }}>
                    <span style={{ color: '#64748b' }}>Monthly Income :</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>$15000/month</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Rental History 02 */}
              {activeApplicationTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>24 Kensington Gardens, London</span>
                      <span style={{ background: '#ecfdf5', color: '#10b981', fontSize: '0.74rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        Verified 5.0 ★
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                      Landlord: James Sterling · Term: 2021 – 2023 · Monthly Rent: $4,200 · Exit reason: Relocation to Kenya / Remote work.
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>12 Victoria Walk, Bristol</span>
                      <span style={{ background: '#ecfdf5', color: '#10b981', fontSize: '0.74rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        Deposit Full Refund
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                      Landlord: Bristol Estates Ltd · Term: 2019 – 2021 · Monthly Rent: $3,100 · Clean inspection record, no arrears.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Documents 03 */}
              {activeApplicationTab === 'docs' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                  <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc' }}>
                    <FileText size={22} color="#ef4444" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>Employment_Contract.pdf</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1.8 MB · Verified</div>
                    </div>
                  </div>
                  <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc' }}>
                    <FileText size={22} color="#3b82f6" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>Bank_Statements_6Mo.pdf</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>4.5 MB · Verified</div>
                    </div>
                  </div>
                  <div style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc' }}>
                    <FileText size={22} color="#10b981" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }}>Passport_National_ID.pdf</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>1.2 MB · Verified</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Notes & Comments */}
              {activeApplicationTab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Credit Assessment & Vetting</div>
                    <div style={{ color: '#475569', lineHeight: 1.5 }}>
                      Credit Bureau Score: 785/850 (Exceptional rating). Zero default history. Income-to-rent ratio is 3.0x, comfortably exceeding standard underwriting thresholds.
                    </div>
                  </div>
                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Property Manager Recommendation</div>
                    <div style={{ color: '#475569', lineHeight: 1.5 }}>
                      Recommended for immediate approval for Riche Luxury Mansion or Vista Horizon Residences Unit A-204.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE TENANT DETAIL VIEW (IMAGE 2 DESIGN)                            */}
      {/* ========================================================================= */}
      {activeDetailTenant && !isApplicationsView && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '12px',
          }}
        >
          {/* Header row from reference screenshot Image 2 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Link
                to="/app/tenants"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  background: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#64748b' }}>
                <Users size={14} />
                <span>Tenants</span>
                <span>/</span>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>Tenant Details</span>
              </div>
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

          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Tenant Details</h2>

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
                      <th style={{ padding: '6px 4px', fontWeight: 500 }}>Action</th>
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
                      <td style={{ padding: '10px 4px' }}>
                        <Link to="/portal/messages" style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                          <MessageSquare size={13} />
                          <ChevronRight size={13} />
                        </Link>
                      </td>
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
                      <td style={{ padding: '10px 4px' }}>
                        <Link to="/portal/messages" style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                          <MessageSquare size={13} />
                          <ChevronRight size={13} />
                        </Link>
                      </td>
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
                      <td style={{ padding: '10px 4px' }}>
                        <Link to="/portal/messages" style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}>
                          <MessageSquare size={13} />
                          <ChevronRight size={13} />
                        </Link>
                      </td>
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

      {/* ========================================================================= */}
      {/* 3. REGISTERED TENANTS TABLE (DEFAULT VIEW)                                */}
      {/* ========================================================================= */}
      {!isApplicationsView && (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search tenants by full name, phone (+254 / +44), or ID number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <ResponsiveTable
            caption="Registered tenant records, contact details, and lease allocations"
            headers={['Tenant Name', 'Contact Phone', 'Email Address', 'National ID / Card', 'Active Unit', 'Actions']}
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
                const isCourtney = t.full_name.toLowerCase().includes('courtney');

                return (
                  <tr
                    key={t.id}
                    style={{
                      background: isCourtney && activeDetailTenant?.id === t.id ? '#f0fdf4' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isCourtney ? (
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                            alt="Courtney Henry"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="profile-avatar"
                            style={{ inlineSize: '32px', blockSize: '32px', fontSize: '0.74rem' }}
                          >
                            {t.full_name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{t.full_name}</div>
                          {isCourtney && (
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Sr. UX/UI Designer</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: '0.82rem' }}>{t.phone}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{t.email || '—'}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                      {t.id_number ? (isCourtney ? t.id_number : maskNationalId(t.id_number)) : '—'}
                    </td>
                    <td>
                      {unit ? (
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>Unit {unit.unit_number}</span>
                      ) : isCourtney ? (
                        <span style={{ fontWeight: 600, color: '#2563eb' }}>Riche Luxury · Unit 21</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>No Unit</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/app/tenants/${t.id}`}
                        className="btn-outline"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.76rem',
                          textDecoration: 'none',
                          background: isCourtney ? '#2563eb' : '#ffffff',
                          color: isCourtney ? '#ffffff' : '#0f172a',
                          borderColor: isCourtney ? '#2563eb' : '#e2e8f0',
                        }}
                      >
                        Tenant Details
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
          title="Onboard New Tenant"
        >
          <form onSubmit={handleAddTenant} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="field-group">
              <label>Full Legal Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Courtney Henry or Wanjiku Kamau"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0712345678 or +44 / +254..."
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
              <label>National ID / Passport / Card No.</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 9834Y65 or 12345678"
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
