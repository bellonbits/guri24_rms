import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Wrench,
  DollarSign,
  BanknotesIcon,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Home,
  Bell,
  MessageSquare,
  Shield,
  Lightbulb,
  Lock,
  Camera,
  Plus,
  Zap,
  Thermometer,
  Eye,
  Check,
  X,
  Sparkles,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  LogOut,
  Settings,
  CreditCard,
  Users,
  ExternalLink,
  SolidCheckCircleIcon,
} from '../components/heroicons';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { SmartResidenceCommunity } from '../components/SmartResidenceCommunity';

export const DashboardPage: React.FC = () => {
  const { currentOrg, currentUserSession, logout } = useAuth();
  const { state, setIsSwitcherModalOpen } = useRms();
  const navigate = useNavigate();

  // Active View Mode: 'portfolio' (Image 1) or 'smart-home' (Image 2)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'smart-home'>('portfolio');

  // Currency View Mode: KES by default
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KES'>('KES');

  // Interactive Popovers State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  // Click outside to dismiss popovers
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dashboard-topbar-popover') && !target.closest('.dashboard-topbar-trigger')) {
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  // Currency Formatter: KES as default
  const fmt = (amountUsd: number, amountKes?: number) => {
    if (currencyMode === 'USD') {
      const val = amountUsd !== undefined ? amountUsd : (amountKes || 0) / 130;
      return `$${Math.round(val).toLocaleString()}`;
    }
    const val = amountKes !== undefined ? amountKes : amountUsd * 130;
    return `KES ${Math.round(val).toLocaleString()}`;
  };

  // Quick Stats Time Filter
  const [quickStatsTimeframe, setQuickStatsTimeframe] = useState('2026 Monthly');
  const [activeChartPoint, setActiveChartPoint] = useState<{ label: string; income: number; expense: number } | null>(null);

  // Search & Filter for My Units
  const [unitSearch, setUnitSearch] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState<'ALL' | 'VACANT' | 'RENTED'>('ALL');

  // New Messages tab (Image 1): 'agents' vs 'customers'
  const [messageCategory, setMessageCategory] = useState<'agents' | 'customers'>('agents');

  // Selected Unit Modal
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Units derived strictly from authoritative database records
  const liveUnits = useMemo(() => {
    return (state.units || []).map((u) => {
      const prop = (state.properties || []).find((p) => p.id === u.property_id);
      return {
        id: u.id,
        name: u.unit_number ? `${prop?.name || 'Property'} — Unit ${u.unit_number}` : (prop?.name || 'Unit'),
        unitNumber: u.unit_number,
        status: (u.status === 'OCCUPIED' || u.status === 'RENTED') ? 'RENTED' : 'VACANT',
        address: prop?.address || prop?.location || 'Assigned Residence',
        size: u.square_meters ? `${u.square_meters} m²` : (u.unit_type || 'Standard Suite'),
        bedrooms: u.bedrooms || (u.unit_type?.toLowerCase().includes('bed') ? parseInt(u.unit_type) || 1 : 1),
        bathrooms: u.bathrooms || 1,
        image: prop?.cover_image_url || '/hero-luxury-architecture.jpg',
        priceUsd: Math.round((Number(u.rent_amount) || 0) / 130),
        priceKes: Number(u.rent_amount) || 0,
        type: u.unit_type || 'Residential Unit',
      };
    });
  }, [state.units, state.properties]);

  // Filtered Units
  const filteredUnits = useMemo(() => {
    return liveUnits.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.address.toLowerCase().includes(unitSearch.toLowerCase());
      const matchStatus =
        unitStatusFilter === 'ALL' || u.status === unitStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [liveUnits, unitSearch, unitStatusFilter]);

  // Authoritative Financial & Operational metrics
  const totalRevenueKes = useMemo(() => {
    return (state.payments || []).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  }, [state.payments]);
  const totalRevenueUsd = Math.round(totalRevenueKes / 130);

  const totalMaintenanceKes = useMemo(() => {
    return (state.maintenanceRequests || []).reduce((acc, m) => acc + (Number(m.actual_cost || m.estimated_cost) || 0), 0);
  }, [state.maintenanceRequests]);
  const totalMaintenanceUsd = Math.round(totalMaintenanceKes / 130);

  // Maintenance counts & dynamic bar percentages
  const maintenanceCounts = useMemo(() => {
    const inProgress = (state.maintenanceRequests || []).filter((r) => ['IN_PROGRESS', 'SCHEDULED'].includes(r.status)).length;
    const awaiting = (state.maintenanceRequests || []).filter((r) => ['SUBMITTED', 'TRIAGED', 'APPROVED', 'OPEN'].includes(r.status)).length;
    const onRequest = (state.maintenanceRequests || []).filter((r) => ['PENDING', 'ESTIMATED'].includes(r.status)).length;
    const total = inProgress + awaiting + onRequest;
    return {
      inProgress,
      awaiting,
      onRequest,
      total,
      inProgressPct: total > 0 ? Math.round((inProgress / total) * 100) : 0,
      awaitingPct: total > 0 ? Math.round((awaiting / total) * 100) : 0,
      onRequestPct: total > 0 ? Math.round((onRequest / total) * 100) : 0,
    };
  }, [state.maintenanceRequests]);

  // Messages derived from real communications/maintenance alerts
  const staffMessages = useMemo(() => {
    return [];
  }, []);

  const tenantMessages = useMemo(() => {
    return (state.maintenanceRequests || []).slice(0, 5).map((m, idx) => {
      const name = m.tenant_name || 'Resident';
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        id: `maint-${m.id || idx}`,
        category: 'customers',
        name,
        initials,
        text: `Maintenance Ticket #${(m.id || '').slice(0, 8)}: ${m.title || m.description || 'Request submitted'}`,
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        unread: m.status === 'SUBMITTED' || m.status === 'OPEN',
      };
    });
  }, [state.maintenanceRequests]);

  const activeMessages = messageCategory === 'agents' ? staffMessages : tenantMessages;

  // Real notifications derived strictly from authoritative database state
  const notifications = useMemo(() => {
    const list: { id: string; title: string; subtitle: string; time: string; unread: boolean; to: string }[] = [];

    (state.payments || []).slice(0, 4).forEach((p) => {
      list.push({
        id: `notif-p-${p.id}`,
        title: 'Payment Verified',
        subtitle: `KES ${Number(p.amount || 0).toLocaleString()} via ${p.payment_method || 'M-Pesa'}`,
        time: p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'Recent',
        unread: true,
        to: '/app/payments-mpesa',
      });
    });

    (state.maintenanceRequests || []).slice(0, 4).forEach((m) => {
      list.push({
        id: `notif-m-${m.id}`,
        title: `Maintenance: ${m.title || 'Work Order'}`,
        subtitle: `Status: ${m.status || 'OPEN'} • Unit ${m.unit_number || 'General'}`,
        time: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Recent',
        unread: m.status === 'OPEN' || m.status === 'SUBMITTED',
        to: '/app/maintenance',
      });
    });

    (state.leases || []).slice(0, 3).forEach((l) => {
      list.push({
        id: `notif-l-${l.id}`,
        title: 'Active Lease',
        subtitle: `Lease for unit ${l.unit_number || ''} is in active standing`,
        time: 'Current',
        unread: false,
        to: '/app/leases-bookings',
      });
    });

    return list;
  }, [state.payments, state.maintenanceRequests, state.leases]);

  const unreadNotificationsCount = notifications.filter((n) => !readNotificationIds.includes(n.id) && n.unread).length;
  const unreadMessagesCount = tenantMessages.filter((m) => m.unread).length;

  const hasFinancialActivity = totalRevenueKes > 0 || totalMaintenanceKes > 0;

  // Real resident avatar uploaded by user
  const residentAvatar = useMemo(() => {
    try {
      return localStorage.getItem(`unitflow_resident_avatar_${currentOrg?.id || 'live'}`) || null;
    } catch {
      return null;
    }
  }, [currentOrg?.id]);

  // Quick Stats Spline Chart
  const splineData = [
    { year: 'Q1', x: 20, yIncome: 130, yExpense: 120, income: totalRevenueKes * 0.2, expense: totalMaintenanceKes * 0.2 },
    { year: 'Q2', x: 130, yIncome: 100, yExpense: 110, income: totalRevenueKes * 0.4, expense: totalMaintenanceKes * 0.4 },
    { year: 'Q3', x: 250, yIncome: 70, yExpense: 90, income: totalRevenueKes * 0.7, expense: totalMaintenanceKes * 0.7 },
    { year: 'Q4', x: 370, yIncome: 30, yExpense: 70, income: totalRevenueKes, expense: totalMaintenanceKes },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minHeight: '100%', background: '#ffffff' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '0.86rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TOP BAR & NAVIGATION (MATCHING IMAGE 1 & 2)
      ========================================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Left: Interactive Geometric Flower Logo + Breadcrumb + Title */}
        <button
          type="button"
          onClick={() => {
            const next = activeTab === 'portfolio' ? 'smart-home' : 'portfolio';
            setActiveTab(next);
            showToast(`Switched view to ${next === 'portfolio' ? 'Portfolio Console' : 'Smart Residence'}`);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
          }}
          title={`Click to switch to ${activeTab === 'portfolio' ? 'Smart Residence' : 'Portfolio Console'}`}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: activeTab === 'portfolio' ? '#0f172a' : '#ff5e13',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Flower geometric mark matching Image 1 */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="3" />
              <circle cx="12" cy="19" r="3" />
              <circle cx="5" cy="12" r="3" />
              <circle cx="19" cy="12" r="3" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>&rsaquo;</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            {activeTab === 'portfolio' ? 'Dashboard' : 'Your Home'}
          </h1>
        </button>

        {/* Center / Right Controls: View Switcher, Currency Toggle, Notifications, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* View Mode Toggle: Image 1 vs Image 2 */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              style={{
                background: activeTab === 'portfolio' ? '#0f172a' : 'transparent',
                color: activeTab === 'portfolio' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Portfolio Console
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('smart-home')}
              style={{
                background: activeTab === 'smart-home' ? '#ff5e13' : 'transparent',
                color: activeTab === 'smart-home' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Smart Residence
            </button>
          </div>

          {/* Currency Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = currencyMode === 'KES' ? 'USD' : 'KES';
              setCurrencyMode(next);
              showToast(`Reporting currency set to ${next}`);
            }}
            style={{
              background: currencyMode === 'KES' ? '#0f172a' : '#ffffff',
              color: currencyMode === 'KES' ? '#ffffff' : '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Toggle between KES and USD reporting"
          >
            {currencyMode === 'KES' ? 'KES (Default)' : '$ USD'}
          </button>

          {/* Notification Bell with Functional Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="dashboard-topbar-trigger"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsMessagesOpen(false);
                setIsProfileMenuOpen(false);
              }}
              style={{
                background: isNotificationsOpen ? '#f1f5f9' : '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isNotificationsOpen ? '#0f172a' : '#64748b',
                transition: 'all 0.15s ease',
              }}
              title="Notifications"
            >
              <Bell size={17} />
            </button>
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '2px solid #ffffff',
                }}
              >
                {unreadNotificationsCount}
              </span>
            )}

            {/* Notifications Popover */}
            {isNotificationsOpen && (
              <div
                className="dashboard-topbar-popover"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '320px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                  zIndex: 120,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setReadNotificationIds(notifications.map((n) => n.id));
                        showToast('All notifications marked as read.');
                      }}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.78rem' }}>
                      No new notifications. Everything is up to date.
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const isUnread = !readNotificationIds.includes(n.id) && n.unread;
                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            setReadNotificationIds((prev) => [...prev, n.id]);
                            setIsNotificationsOpen(false);
                            navigate(n.to);
                          }}
                          style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            background: isUnread ? '#f8fafc' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = isUnread ? '#f8fafc' : '#ffffff')}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isUnread ? '#2563eb' : 'transparent', marginTop: '6px', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{n.title}</span>
                              <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{n.time}</span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {n.subtitle}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate('/app/automated-emails');
                    }}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '8px',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    View Notification Settings & Logs &rsaquo;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Bubble with Functional Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="dashboard-topbar-trigger"
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                setIsNotificationsOpen(false);
                setIsProfileMenuOpen(false);
              }}
              style={{
                background: isMessagesOpen ? '#f1f5f9' : '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isMessagesOpen ? '#0f172a' : '#64748b',
                transition: 'all 0.15s ease',
              }}
              title="Messages & Inquiries"
            >
              <MessageSquare size={17} />
            </button>
            {unreadMessagesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '2px solid #ffffff',
                }}
              >
                {unreadMessagesCount}
              </span>
            )}

            {/* Messages Popover */}
            {isMessagesOpen && (
              <div
                className="dashboard-topbar-popover"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '340px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                  zIndex: 120,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>Communications</span>
                    {unreadMessagesCount > 0 && (
                      <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                        {unreadMessagesCount} unread
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Shortcut 1: AI Operations Assistant */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMessagesOpen(false);
                      navigate('/app/ai-assistant');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Sparkles size={18} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a' }}>AI Operations Assistant</div>
                      <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>Draft replies, query ledger, or dispatch vendors</div>
                    </div>
                  </button>

                  {/* Shortcut 2: Smart Residence Feed */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMessagesOpen(false);
                      setActiveTab('smart-home');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Users size={18} color="#0f172a" />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>Smart Residence Community</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Open private residence feed &amp; conversations</div>
                    </div>
                  </button>
                </div>

                {/* Recent Tenant Inquiries List */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Recent Inquiries
                  </div>
                  {tenantMessages.length === 0 ? (
                    <div style={{ padding: '12px 0', textAlign: 'center', color: '#64748b', fontSize: '0.76rem' }}>
                      No active tenant inquiries recorded.
                    </div>
                  ) : (
                    tenantMessages.slice(0, 3).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setIsMessagesOpen(false);
                          navigate('/app/maintenance');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800 }}>
                          {m.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {m.text}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Functional Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="dashboard-topbar-trigger"
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationsOpen(false);
                setIsMessagesOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: isProfileMenuOpen ? '#f1f5f9' : 'transparent',
                border: '1px solid ' + (isProfileMenuOpen ? '#cbd5e1' : 'transparent'),
                borderRadius: '24px',
                padding: '4px 10px 4px 4px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              title="Account &amp; Organization Menu"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}
              >
                {residentAvatar ? (
                  <img
                    src={residentAvatar}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (currentUserSession?.name || currentOrg?.name || 'Admin')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {currentUserSession?.name || currentOrg?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {currentUserSession?.role || 'Admin'}
                </div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {/* Profile Popover Menu */}
            {isProfileMenuOpen && (
              <div
                className="dashboard-topbar-popover"
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  width: '280px',
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                  zIndex: 120,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {/* Org Info */}
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    {currentOrg?.name || 'Unit Flow Organization'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {currentOrg?.county || 'Nairobi'} &bull; {currentOrg?.currency || 'KES'}
                  </div>
                </div>

                {/* Actions */}
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsSwitcherModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Building2 size={16} color="#2563eb" />
                  <span>Switch Organization / Role</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/portal/dashboard');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Home size={16} color="#16a34a" />
                  <span>Tenant Self-Service Portal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/app/properties-units');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <BuildingOffice2Icon size={16} color="#64748b" />
                  <span>Properties &amp; Units</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/app/settings');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Settings size={16} color="#64748b" />
                  <span>System Settings</span>
                </button>

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    background: '#fff1f2',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#dc2626',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={16} color="#dc2626" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MASTER PROPERTY MANAGEMENT DASHBOARD (IMAGE 1)
      ========================================================================== */}
      {activeTab === 'portfolio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Top 4 KPI Grid matching Image 1 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.2fr 2.4fr 1.6fr',
              gap: '18px',
            }}
            className="portfolio-top-grid"
          >
            {/* Card 1: Total Revenue (Pastel Blue #e8f0fe) */}
            <div
              style={{
                background: '#e8f0fe', // Soft pastel blue matching Image 1
                borderRadius: '24px',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(232, 240, 254, 0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f172a',
                    }}
                  >
                    <BanknotesIcon size={16} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Total Revenue
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/app/analytics-ledger')}
                  title="View Accounting Ledger & Financial Analytics"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ margin: '18px 0 10px 0' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {fmt(totalRevenueUsd, totalRevenueKes)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                  {(state.payments || []).length > 0 ? `${(state.payments || []).length} Payments` : 'Live Ledger'}
                </span>
                <span style={{ color: '#64748b' }}>Authoritative records</span>
              </div>
            </div>

            {/* Card 2: Maintenance Cost (Pastel Pink #fce8ef) */}
            <div
              style={{
                background: '#fce8ef', // Soft pastel pink matching Image 1
                borderRadius: '24px',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(252, 232, 239, 0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f172a',
                    }}
                  >
                    <Wrench size={16} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Maintenance Cost
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/app/maintenance')}
                  title="View Maintenance Log & Service Orders"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ margin: '18px 0 10px 0' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {fmt(totalMaintenanceUsd, totalMaintenanceKes)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                  {maintenanceCounts.total > 0 ? `${maintenanceCounts.total} Work Orders` : '0 Active Orders'}
                </span>
                <span style={{ color: '#64748b' }}>From maintenance log</span>
              </div>
            </div>

            {/* Card 3: Quick Stats (Spline Line Chart Card, Center) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '24px',
                padding: '20px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Quick Stats</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.76rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a', fontWeight: 700 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0f172a' }} />
                      Income
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontWeight: 600 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#cbd5e1' }} />
                      Expense
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const next = quickStatsTimeframe === 'Last 5 years' ? '2026 Monthly' : 'Last 5 years';
                    setQuickStatsTimeframe(next);
                    showToast(`Timeframe switched to ${next}`);
                  }}
                >
                  <span>{quickStatsTimeframe}</span>
                  <ChevronDown size={13} />
                </div>
              </div>

              {/* Financial Activity Chart or Honest Empty State */}
              {!hasFinancialActivity ? (
                <div style={{ height: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#f8fafc', borderRadius: '14px', padding: '16px', margin: '6px 0', border: '1px dashed #e2e8f0' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    No financial activity recorded yet
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', maxWidth: '300px' }}>
                    Verified rent collections and maintenance vouchers will populate your financial trend curve in {currencyMode}.
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '110px', margin: '6px 0' }}>
                  {activeChartPoint && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 10,
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f172a' }} />
                      <span>{activeChartPoint.label}: Income {fmt(activeChartPoint.income / 130, activeChartPoint.income)}</span>
                    </div>
                  )}

                  <svg viewBox="0 0 390 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    {/* Grid Lines */}
                    <line x1="0" y1="20" x2="390" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <line x1="0" y1="55" x2="390" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="390" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                    <line x1="0" y1="125" x2="390" y2="125" stroke="#f1f5f9" />

                    {/* Expense Curve */}
                    <path
                      d="M 20 120 C 130 115, 250 95, 370 70"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />

                    {/* Income Curve */}
                    <path
                      d="M 20 130 C 130 100, 250 70, 370 30"
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {splineData.map((pt) => (
                      <circle
                        key={pt.year}
                        cx={pt.x}
                        cy={pt.yIncome}
                        r="5"
                        fill="#0f172a"
                        stroke="#ffffff"
                        strokeWidth="2"
                        cursor="pointer"
                        onClick={() => setActiveChartPoint({ label: pt.year, income: pt.income, expense: pt.expense })}
                      />
                    ))}
                  </svg>
                </div>
              )}

              {/* X-axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>Q1 2026</span>
                <span>Q2 2026</span>
                <span>Q3 2026</span>
                <span>Q4 2026</span>
              </div>
            </div>

            {/* Card 4: Building Condition (Right, matching Image 1) */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '24px',
                padding: '20px 22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Building Condition
                </h3>
                <button
                  onClick={() => navigate('/app/maintenance')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>On repairement progress</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{maintenanceCounts.inProgress}</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${maintenanceCounts.inProgressPct}%`, height: '100%', background: '#0f172a', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>Awaiting for repairment</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{maintenanceCounts.awaiting}</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${maintenanceCounts.awaitingPct}%`, height: '100%', background: '#0f172a', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>On request</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{maintenanceCounts.onRequest}</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: `${maintenanceCounts.onRequestPct}%`, height: '100%', background: '#0f172a', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/maintenance')}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Maintenance Details
              </button>
            </div>
          </div>

          {/* Bottom Main Split: My Units (Left 68%) + New Messages (Right 32%) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.1fr',
              gap: '22px',
            }}
            className="portfolio-bottom-grid"
          >
            {/* Left: My Units Catalog matching Image 1 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    My Units
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {liveUnits.length > 0 ? `You have ${liveUnits.length} active units` : 'No units registered yet'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Search any unit input */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '7px 14px',
                      width: '200px',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search any unit"
                      value={unitSearch}
                      onChange={(e) => setUnitSearch(e.target.value)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '0.8rem',
                        width: '100%',
                        color: '#0f172a',
                      }}
                    />
                    <Search size={14} color="#94a3b8" />
                  </div>

                  {/* Filter button */}
                  <button
                    onClick={() => {
                      const next = unitStatusFilter === 'ALL' ? 'VACANT' : unitStatusFilter === 'VACANT' ? 'RENTED' : 'ALL';
                      setUnitStatusFilter(next);
                      showToast(`Filter: ${next}`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: unitStatusFilter !== 'ALL' ? '#0f172a' : '#ffffff',
                      color: unitStatusFilter !== 'ALL' ? '#ffffff' : '#334155',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '7px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <SlidersHorizontal size={13} />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Units Grid (3 Columns) */}
              {filteredUnits.length === 0 ? (
                <div
                  style={{
                    padding: '48px 24px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px dashed #cbd5e1',
                  }}
                >
                  <BuildingOffice2Icon size={36} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                    No units found
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', maxWidth: '360px', margin: '4px auto 16px auto' }}>
                    {unitSearch ? 'No units match your search query.' : 'Register properties and units in Properties & Units to manage them here.'}
                  </div>
                  <button
                    onClick={() => navigate('/app/properties-units')}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Manage Properties & Units
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '18px',
                  }}
                >
                  {filteredUnits.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUnit(u)}
                      style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '1px solid #f1f5f9',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      {/* Architectural Image */}
                      <div style={{ position: 'relative', width: '100%', height: '144px', background: '#0f172a', overflow: 'hidden' }}>
                        <img
                          src={u.image}
                          alt={u.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Unit metadata */}
                      <div style={{ padding: '14px 14px 16px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                            {u.name}
                          </div>
                          {u.status === 'RENTED' ? (
                            <span
                              style={{
                                background: '#0f172a',
                                color: '#ffffff',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                borderRadius: '20px',
                                padding: '2px 8px',
                                flexShrink: 0,
                              }}
                            >
                              ● Rented
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#ffffff',
                                color: '#64748b',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                borderRadius: '20px',
                                padding: '2px 8px',
                                flexShrink: 0,
                              }}
                            >
                              ○ Vacant
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '4px 0 8px 0' }}>
                          {u.address}
                        </div>

                        <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>
                          {u.size} &bull; {u.bedrooms} Bedrooms &bull; {u.bathrooms} Bathrooms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: New Messages matching Image 1 */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                New Messages
              </h2>

              {/* Agents vs Customers Tabs matching Image 1 */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                <button
                  onClick={() => setMessageCategory('agents')}
                  style={{
                    background: messageCategory === 'agents' ? '#0f172a' : 'transparent',
                    color: messageCategory === 'agents' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Staff Desk {staffMessages.length > 0 ? `(${staffMessages.length})` : ''}
                </button>
                <button
                  onClick={() => setMessageCategory('customers')}
                  style={{
                    background: messageCategory === 'customers' ? '#0f172a' : 'transparent',
                    color: messageCategory === 'customers' ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Tenants {tenantMessages.length > 0 ? `(${tenantMessages.length})` : ''}
                </button>
              </div>

              {/* Message List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, minHeight: '160px', justifyContent: activeMessages.length === 0 ? 'center' : 'flex-start' }}>
                {activeMessages.length === 0 ? (
                  <div
                    style={{
                      padding: '36px 16px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px dashed #e2e8f0',
                      margin: 'auto 0',
                    }}
                  >
                    <ChatBubbleLeftRightIcon size={28} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                      {messageCategory === 'agents' ? 'No staff messages' : 'No tenant inquiries'}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                      {messageCategory === 'agents'
                        ? 'Internal communications with property managers will appear here.'
                        : 'Maintenance requests and messages submitted by residents will appear here.'}
                    </div>
                  </div>
                ) : (
                  activeMessages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        navigate('/app/maintenance');
                        showToast(`Viewing request from ${m.name}`);
                      }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '6px 4px',
                        borderRadius: '10px',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          flexShrink: 0,
                        }}
                      >
                        {m.initials || 'TR'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                            {m.name}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {m.time}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: '0.76rem',
                            color: '#64748b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px',
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                You've reached the end of the list.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SMART RESIDENCE — PRIVATE RESIDENTIAL COMMUNITY (X STYLE)
      ========================================================================== */}
      {activeTab === 'smart-home' && (
        <SmartResidenceCommunity
          onBack={() => setActiveTab('portfolio')}
          showToast={showToast}
        />
      )}

      {/* =========================================================================
          UNIT PREVIEW MODAL
      ========================================================================== */}
      {selectedUnit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '520px',
              maxWidth: '95vw',
              background: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ position: 'relative', height: '220px', background: '#0f172a' }}>
              <img
                src={selectedUnit.image}
                alt={selectedUnit.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedUnit(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0f172a',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedUnit.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {selectedUnit.address}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                    {fmt(selectedUnit.priceUsd, selectedUnit.priceKes)}/mo
                  </div>
                  <span
                    style={{
                      background: selectedUnit.status === 'RENTED' ? '#0f172a' : '#ecfdf5',
                      color: selectedUnit.status === 'RENTED' ? '#ffffff' : '#059669',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      padding: '2px 8px',
                      display: 'inline-block',
                      marginTop: '4px',
                    }}
                  >
                    {selectedUnit.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '20px 0', background: '#f8fafc', padding: '14px', borderRadius: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>AREA</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedUnit.size}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>BEDROOMS</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedUnit.bedrooms} Beds</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>BATHROOMS</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{selectedUnit.bathrooms} Baths</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedUnit(null);
                    navigate('/app/properties-units');
                  }}
                  style={{
                    flex: 1,
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '11px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Manage Unit in Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Grid Styles */}
      <style>{`
        @media (max-width: 1200px) {
          .portfolio-top-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .portfolio-bottom-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .portfolio-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
