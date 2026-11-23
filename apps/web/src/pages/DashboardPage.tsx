import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Wrench,
  DollarSign,
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';

export const DashboardPage: React.FC = () => {
  const { currentOrg, currentUserSession } = useAuth();
  const { state } = useRms();
  const navigate = useNavigate();

  // Active View Mode: 'portfolio' (Image 1) or 'smart-home' (Image 2)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'smart-home'>('portfolio');

  // Currency View Mode: USD vs KES
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'KES'>('USD');

  // Currency Formatter
  const fmt = (amountUsd: number, amountKes?: number) => {
    if (currencyMode === 'KES') {
      const val = amountKes !== undefined ? amountKes : amountUsd * 130;
      return `KES ${Math.round(val).toLocaleString()}`;
    }
    return `$${amountUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Quick Stats Time Filter
  const [quickStatsTimeframe, setQuickStatsTimeframe] = useState('Last 5 years');
  const [activeChartPoint, setActiveChartPoint] = useState<{ year: string; income: number; expense: number } | null>({
    year: '2020',
    income: 407778,
    expense: 215400,
  });

  // Search & Filter for My Units
  const [unitSearch, setUnitSearch] = useState('');
  const [unitStatusFilter, setUnitStatusFilter] = useState<'ALL' | 'VACANT' | 'RENTED'>('ALL');

  // Smart Home Controls (Image 2)
  const [isSmartLampOn, setIsSmartLampOn] = useState(true);
  const [isSmartLockLocked, setIsSmartLockLocked] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

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

  // Real Units List matching Image 1
  const unitsData = [
    {
      id: 'unit-1',
      name: 'Riche Luxury Mansion',
      status: 'VACANT',
      address: 'St. Constitution Drive 21, West',
      size: '6x8 m²',
      bedrooms: 4,
      bathrooms: 2,
      image: '/hero-luxury-architecture.jpg',
      priceUsd: 4800,
      priceKes: 624000,
      type: 'Luxury Villa',
    },
    {
      id: 'unit-2',
      name: 'Vista Horizon Residences',
      status: 'RENTED',
      address: 'Independence Boulevard St. 15',
      size: '12x8 m²',
      bedrooms: 4,
      bathrooms: 5,
      image: '/modern-organic-balconies.jpg',
      priceUsd: 3200,
      priceKes: 416000,
      type: 'Penthouse Apartment',
    },
    {
      id: 'unit-3',
      name: 'Coastal Breeze Homes',
      status: 'RENTED',
      address: 'Redwood Road St. 15 Broadway',
      size: '6x6 m²',
      bedrooms: 2,
      bathrooms: 2,
      image: '/featured_nairobi_apartment.jpg',
      priceUsd: 1950,
      priceKes: 253500,
      type: 'Modern Brick Townhouse',
    },
    {
      id: 'unit-4',
      name: 'Urban Obsidian Plaza',
      status: 'RENTED',
      address: 'Ruiru Gateway Avenue 10',
      size: '10x8 m²',
      bedrooms: 3,
      bathrooms: 3,
      image: '/hero-apex-architecture.jpg',
      priceUsd: 2600,
      priceKes: 338000,
      type: 'Commercial & Loft',
    },
    {
      id: 'unit-5',
      name: 'Azure Horizon Villa',
      status: 'VACANT',
      address: 'Coast Marina Boulevard 4',
      size: '15x12 m²',
      bedrooms: 5,
      bathrooms: 5,
      image: '/luxury-pool-villa.jpg',
      priceUsd: 5900,
      priceKes: 767000,
      type: 'Infinity Pool Estate',
    },
    {
      id: 'unit-6',
      name: 'Minimalist Sky Residences',
      status: 'RENTED',
      address: 'Westlands Ring Road 8',
      size: '8x6 m²',
      bedrooms: 2,
      bathrooms: 2,
      image: '/luxury-minimalist-living.jpg',
      priceUsd: 2100,
      priceKes: 273000,
      type: 'Modern Studio Suite',
    },
  ];

  // Filtered Units
  const filteredUnits = useMemo(() => {
    return unitsData.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.address.toLowerCase().includes(unitSearch.toLowerCase());
      const matchStatus =
        unitStatusFilter === 'ALL' || u.status === unitStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [unitsData, unitSearch, unitStatusFilter]);

  // Messages matching Image 1
  const messagesData = {
    agents: [
      {
        id: 1,
        name: 'Sofya Citra',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Hey Emir!, aku punya kabar bagus nih...',
        time: '12.30',
        unread: true,
      },
      {
        id: 2,
        name: 'Haliza Caca',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Iyaa, nanti aku yang proses buat tand...',
        time: '11.40',
        unread: false,
      },
      {
        id: 3,
        name: 'Kim Do Gi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Sorry sir, how about the price we gav...',
        time: '11.03',
        unread: false,
      },
      {
        id: 4,
        name: 'Azizah Salma',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Emir, bisa tolong sediain waktu buat...',
        time: '09.08',
        unread: false,
      },
      {
        id: 5,
        name: 'Nathan Drake',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Haha okay, have a nice day! sans aja',
        time: '08.41',
        unread: false,
      },
    ],
    customers: [
      {
        id: 6,
        name: 'Amina Wanjiku',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Payment ref QKH782910X verified for Unit A-204.',
        time: 'Yesterday',
        unread: true,
      },
      {
        id: 7,
        name: 'Brian Mwangi',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Requested parking tag replacement for P-102.',
        time: '2 days ago',
        unread: false,
      },
      {
        id: 8,
        name: 'Grace Muthoni',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
        text: 'Lease renewal countersigned successfully.',
        time: '3 days ago',
        unread: false,
      },
    ],
  };

  const activeMessages = messagesData[messageCategory];

  // Quick Stats Spline Chart Years
  const splineData = [
    { year: '2018', x: 20, yIncome: 140, yExpense: 110, income: 180500, expense: 95000 },
    { year: '2019', x: 100, yIncome: 80, yExpense: 120, income: 295000, expense: 145000 },
    { year: '2020', x: 190, yIncome: 50, yExpense: 90, income: 407778, expense: 215400 },
    { year: '2021', x: 280, yIncome: 110, yExpense: 85, income: 240000, expense: 190000 },
    { year: '2022', x: 370, yIncome: 30, yExpense: 70, income: 512000, expense: 280000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minHeight: '100%' }}>
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
        {/* Left: Geometric Flower Logo + Breadcrumb + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
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
        </div>

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
            onClick={() => setCurrencyMode(currencyMode === 'USD' ? 'KES' : 'USD')}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            {currencyMode === 'USD' ? '$ USD' : 'KES (KSh)'}
          </button>

          {/* Notification Bell with red badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => showToast('2 unread notifications.')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <Bell size={17} />
            </button>
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #ffffff',
              }}
            />
          </div>

          {/* Message bubble with red badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => showToast('5 agent messages awaiting response.')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <MessageSquare size={17} />
            </button>
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #ffffff',
              }}
            />
          </div>

          {/* User profile avatar and label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
              alt="User"
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                {currentUserSession?.name || 'Emir Abiyyu'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Admin
              </div>
            </div>
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
                    <DollarSign size={14} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Total Revenue
                  </span>
                </div>
                <button
                  onClick={() => showToast('Total Revenue details: $926,293 / KES 120,418,090')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ margin: '18px 0 10px 0' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {fmt(926293)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>+28%</span>
                <span style={{ color: '#64748b' }}>From the last week</span>
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
                    <Wrench size={14} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Maintenance Cost
                  </span>
                </div>
                <button
                  onClick={() => showToast('Maintenance Cost details: $480,097')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div style={{ margin: '18px 0 10px 0' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                  {fmt(480097)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>+15%</span>
                <span style={{ color: '#64748b' }}>From the last week</span>
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

              {/* Interactive Smooth Spline Chart */}
              <div style={{ position: 'relative', width: '100%', height: '110px', margin: '6px 0' }}>
                {/* Floating Tooltip matching Image 1 */}
                {activeChartPoint && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0px',
                      left: '46%',
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
                    <span>Income {fmt(activeChartPoint.income)}</span>
                  </div>
                )}

                <svg viewBox="0 0 390 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="390" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="55" x2="390" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="390" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="0" y1="125" x2="390" y2="125" stroke="#f1f5f9" />

                  {/* Gray Expense Smooth Curve */}
                  <path
                    d="M 20 110 C 60 120, 140 100, 190 90 C 240 80, 270 95, 300 85 C 330 75, 350 80, 370 70"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />

                  {/* Black Income Spline Curve matching Image 1 */}
                  <path
                    d="M 20 140 C 60 80, 140 60, 190 50 C 240 40, 270 120, 310 110 C 340 100, 355 40, 370 30"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Active Tooltip Dot */}
                  <circle cx="190" cy="50" r="4.5" fill="#0f172a" stroke="#ffffff" strokeWidth="2" />

                  {/* Clickable hotspots */}
                  {splineData.map((pt) => (
                    <circle
                      key={pt.year}
                      cx={pt.x}
                      cy={pt.yIncome}
                      r="12"
                      fill="transparent"
                      cursor="pointer"
                      onClick={() => setActiveChartPoint(pt)}
                    />
                  ))}
                </svg>
              </div>

              {/* X-axis years */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>2018</span>
                <span>2019</span>
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
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
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>23</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: '#0f172a', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>Awaiting for repairment</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>12</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: '55%', height: '100%', background: '#0f172a', borderRadius: '4px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>On request</span>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>8</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: '32%', height: '100%', background: '#0f172a', borderRadius: '4px' }} />
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
                    You have 287 active units
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
                  Agents 5
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
                  Customers 3
                </button>
              </div>

              {/* Message List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {activeMessages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => showToast(`Opening chat with ${m.name}...`)}
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
                    <img
                      src={m.avatar}
                      alt={m.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
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
                ))}
              </div>

              <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                You've reached the end of the list.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: SMART RESIDENCE CONSOLE (IMAGE 2)
      ========================================================================== */}
      {activeTab === 'smart-home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Your Home
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Integrated smart IoT controls, biometric access, and environmental consumption monitoring.
              </p>
            </div>

            <button
              onClick={() => setShowAddDeviceModal(true)}
              style={{
                background: '#ff5e13', // Orange CTA matching Image 2
                color: '#ffffff',
                border: 'none',
                borderRadius: '24px',
                padding: '10px 22px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(255, 94, 19, 0.3)',
              }}
            >
              <Plus size={16} />
              <span>Add Device</span>
            </button>
          </div>

          {/* Hero Architectural 3D Render with Interactive Hotspots (Image 2) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              borderRadius: '28px',
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            }}
          >
            <img
              src="/hero-luxury-architecture.jpg"
              alt="Luxury Residence"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Subtle dark gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Smart Lamp Toggle Card matching Image 2 */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '26%',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '14px 18px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                zIndex: 20,
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  Mi LED Smart
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Smart Lamp &bull; {isSmartLampOn ? 'ON' : 'OFF'}
                </div>
              </div>

              {/* Interactive Pill Toggle */}
              <div
                onClick={() => {
                  setIsSmartLampOn(!isSmartLampOn);
                  showToast(`Smart Lamp ${!isSmartLampOn ? 'Turned ON' : 'Turned OFF'}`);
                }}
                style={{
                  width: '46px',
                  height: '26px',
                  borderRadius: '13px',
                  background: isSmartLampOn ? '#0f172a' : '#cbd5e1',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: isSmartLampOn ? '23px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>

            {/* Hotspot 1: Orange Bell Alert matching Image 2 */}
            <div
              onClick={() => showToast('Smart Doorbell: No motion detected in the last 15 mins.')}
              style={{
                position: 'absolute',
                top: '52%',
                left: '30%',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ff5e13', // Orange matching Image 2
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 94, 19, 0.4)',
                zIndex: 20,
              }}
              title="Front Doorbell"
            >
              <Bell size={18} />
            </div>

            {/* Hotspot 2: White Security Camera */}
            <div
              onClick={() => showToast('Security Camera 01: Live 4K stream active.')}
              style={{
                position: 'absolute',
                top: '48%',
                left: '46%',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ffffff',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 20,
              }}
              title="Patio Security Camera"
            >
              <Camera size={16} />
            </div>

            {/* Hotspot 3: Smart Door Lock */}
            <div
              onClick={() => {
                setIsSmartLockLocked(!isSmartLockLocked);
                showToast(`Main Entry Door ${!isSmartLockLocked ? 'LOCKED' : 'UNLOCKED'}`);
              }}
              style={{
                position: 'absolute',
                top: '58%',
                left: '34%',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#ffffff',
                color: isSmartLockLocked ? '#059669' : '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 20,
              }}
              title="Smart Lock"
            >
              <Lock size={16} />
            </div>
          </div>

          {/* Bottom 4 Smart Metric Cards matching Image 2 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Card 1: Connected Devices */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                <Zap size={15} color="#0f172a" />
                <span>Connected Devices</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0 10px 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a' }}>14</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Units</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                <span>↑ 3</span>
                <span>Increased from last month</span>
              </div>
            </div>

            {/* Card 2: Power Consumption */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                <Zap size={15} color="#0f172a" />
                <span>Power Consumption</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0 10px 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a' }}>48kWh</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Today</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef2f2', color: '#dc2626', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                <span>↑ 3kWh</span>
                <span>Increased from yesterday</span>
              </div>
            </div>

            {/* Card 3: Cost Estimate */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                <DollarSign size={15} color="#0f172a" />
                <span>Cost Estimate</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0 10px 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a' }}>{fmt(450, 25000)}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>This Month</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef2f2', color: '#dc2626', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                <span>↑ {fmt(35, 4550)}</span>
                <span>Increased from last month</span>
              </div>
            </div>

            {/* Card 4: Forecast */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '22px',
                padding: '22px 24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                <Thermometer size={15} color="#0f172a" />
                <span>Forecast</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0 10px 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a' }}>24°C</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Today</span>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                <span>↑ 2°C</span>
                <span>Increased from yesterday</span>
              </div>
            </div>
          </div>
        </div>
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

      {/* =========================================================================
          ADD DEVICE MODAL (SMART HOME)
      ========================================================================== */}
      {showAddDeviceModal && (
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
              width: '440px',
              maxWidth: '95vw',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Add Smart Device
              </h3>
              <button onClick={() => setShowAddDeviceModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.45 }}>
              Connect a Zigbee, Matter, or Wi-Fi device to your Unit Flow residential hub.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Device Type</label>
                <select style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}>
                  <option>Smart Lighting (LED / Switch)</option>
                  <option>Biometric Door Lock</option>
                  <option>Security Camera / Doorbell</option>
                  <option>Smart Thermostat & AC</option>
                  <option>Water Leak Sensor</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b' }}>Assigned Room / Unit Location</label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom, Unit A-204"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => setShowAddDeviceModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '9px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddDeviceModal(false);
                    showToast('Smart device paired and synchronized with Unit Flow Hub!');
                  }}
                  style={{ background: '#ff5e13', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Pair Device
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
