import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { animate } from 'animejs';
import {
  Building2,
  Users,
  CreditCard,
  FileCheck2,
  Wrench,
  BarChart3,
  Sparkles,
  ScanText,
  PieChart,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Check,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  Lock,
  TrendingUp,
  FileText,
  BadgeCheck,
  ChevronDown,
  Globe,
  DollarSign,
  Briefcase,
  HelpCircle,
  Landmark,
  Building,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    units: '25-100 units',
    role: 'Property Manager',
  });

  // Anime.js SVG Integrations Path animation & floating clouds
  const integrationsSvgRef = useRef<SVGSVGElement>(null);
  const cloudLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle Anime.js floating clouds animation
    if (cloudLayerRef.current) {
      try {
        const clouds = cloudLayerRef.current.querySelectorAll('.ethereal-cloud');
        if (clouds.length > 0) {
          animate(clouds, {
            translateY: [-10, 10],
            translateX: [-6, 6],
            duration: 6000,
            ease: 'inOutSine',
            alternate: true,
            loop: true,
            delay: (el: any, i: number) => i * 400,
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    // Anime.js glowing SVG pulses for integration nodes
    if (integrationsSvgRef.current) {
      try {
        const lines = integrationsSvgRef.current.querySelectorAll('.pulse-line');
        if (lines.length > 0) {
          animate(lines, {
            strokeDashoffset: [40, 0],
            duration: 2400,
            ease: 'linear',
            loop: true,
          });
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, []);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setDemoModalOpen(false);
      setDemoForm({ name: '', email: '', phone: '', units: '25-100 units', role: 'Property Manager' });
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF5FF] via-[#F8FAFC] to-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* =========================================================================
          ANIMATED ETHEREAL CLOUD BACKDROP (MATCHING REFERENCE IMAGE)
      ========================================================================== */}
      <div ref={cloudLayerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Top Radial Heavenly Light Source */}
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-blue-200/50 via-sky-100/30 to-transparent blur-3xl rounded-full" />

        {/* Soft Organic Ethereal Clouds on Left */}
        <div className="ethereal-cloud absolute top-4 -left-20 w-[420px] h-[280px] bg-gradient-to-tr from-white/90 via-sky-50/70 to-transparent rounded-full blur-2xl opacity-80" />
        <div className="ethereal-cloud absolute top-36 -left-12 w-[340px] h-[220px] bg-white/80 rounded-full blur-3xl opacity-75" />

        {/* Soft Organic Ethereal Clouds on Right */}
        <div className="ethereal-cloud absolute top-6 -right-20 w-[450px] h-[300px] bg-gradient-to-tl from-white/90 via-sky-50/70 to-transparent rounded-full blur-2xl opacity-80" />
        <div className="ethereal-cloud absolute top-40 -right-10 w-[360px] h-[240px] bg-white/80 rounded-full blur-3xl opacity-75" />
      </div>

      {/* =========================================================================
          SECTION 1: FLOATING PILL NAVIGATION (MATCHING REFERENCE IMAGE)
      ========================================================================== */}
      <header className="sticky top-4 z-50 w-full px-4 sm:px-8 max-w-7xl mx-auto">
        <nav
          aria-label="Main Navigation"
          className="bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_24px_rgba(37,99,235,0.06)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
              {/* Modern geometric icon mark matching Relink reference */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8L10 14L4 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L18 10L12 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Guri<span className="text-blue-600">24</span>
            </span>
          </Link>

          {/* Center Pill Menu for Desktop */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#hero" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Home</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-slate-900 transition-colors">Solutions</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#why-guri24" className="hover:text-slate-900 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Kenya Market / Language Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-full text-xs font-semibold text-slate-700 border border-slate-200/50">
              <span className="text-sm leading-none">🇰🇪</span>
              <span>EN</span>
            </div>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 transition-colors"
            >
              Log in
            </Link>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md shadow-blue-500/25 transition-all inline-flex items-center gap-1.5"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-blue-600 rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 bg-white/95 backdrop-blur-lg border border-slate-200 rounded-2xl p-5 shadow-xl flex flex-col gap-3"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">Home</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">Features</a>
              <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">Solutions</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">How It Works</a>
              <a href="#why-guri24" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">About Us</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-800 font-medium">Contact</a>
              <hr className="border-slate-100 my-1" />
              <Link to="/login" className="py-2 text-center text-slate-700 font-medium">Log in</Link>
              <Link to="/signup" className="py-2.5 text-center bg-blue-600 text-white rounded-full font-semibold shadow-md">Get Started</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =========================================================================
          SECTION 2: HERO SECTION (EXACT TYPOGRAPHY & LAYERED 3D DASHBOARD MOCKUP)
      ========================================================================== */}
      <section id="hero" className="relative pt-12 pb-24 px-4 sm:px-6 max-w-7xl mx-auto z-10 text-center">
        {/* Small Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          SMART PROPERTY MANAGEMENT PLATFORM
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] max-w-4xl mx-auto"
        >
          Manage Properties. <br className="hidden sm:inline" />
          Simplify Rentals. <span className="text-blue-600">Grow Your Business.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Take control of your rental properties with one intelligent platform. Manage tenants, leases, rent collection, maintenance and financial records without the complexity of scattered spreadsheets and paperwork.
        </motion.p>

        {/* Hero Dual CTAs matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-7 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDemoModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm sm:text-base px-6 py-3 rounded-full shadow-md transition-all inline-flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Book a Demo
          </motion.button>
        </motion.div>

        {/* Supporting text */}
        <p className="mt-4 text-xs font-medium text-slate-500">
          Everything you need to manage your properties, tenants and rental operations in one place.
        </p>

        {/* =====================================================================
            LAYERED 3D DASHBOARD PREVIEW (EXACT PERSPECTIVE AS IN REFERENCE IMAGE)
        ====================================================================== */}
        <div className="mt-14 relative max-w-5xl mx-auto perspective-1000">
          {/* Background Tilted Preview Card Peaking Behind to Left */}
          <div
            className="hidden lg:block absolute -top-6 -left-10 w-[780px] h-[480px] bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/70 shadow-xl opacity-60 pointer-events-none transform -rotate-2 scale-95 z-0"
            aria-hidden="true"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <div className="text-xs font-semibold text-slate-400">Tenant Directory & Unit Index</div>
            </div>
          </div>

          {/* Main Foreground Dashboard Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18)] overflow-hidden text-left z-10"
          >
            {/* Dashboard Sleek Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <div className="h-4 w-px bg-slate-700 mx-1" />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                    G
                  </div>
                  <span className="text-xs font-semibold tracking-wide text-slate-200">Guri24 Rental Workspace</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Daraja C2B V2: 1343073 (Active)
                </span>
                <span className="text-slate-400">Peter Gatitu Mwangi</span>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="grid grid-cols-12 bg-slate-50/50">
              {/* Mini Sidebar */}
              <div className="hidden md:block col-span-3 bg-white border-r border-slate-200/80 p-4 space-y-1">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation</div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Portfolio Overview
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Properties & Units
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
                  <Users className="w-4 h-4 text-slate-400" />
                  Tenant Directory
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  Rent & C2B Ledger
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
                  <Wrench className="w-4 h-4 text-slate-400" />
                  Maintenance (3 Open)
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-xs">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  AI Assistant
                </div>

                <div className="pt-6 px-3">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100">
                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">C2B Paybill</div>
                    <div className="font-mono text-xs font-bold text-slate-800 mt-0.5">Short Code: 1343073</div>
                    <div className="text-[11px] text-slate-500 mt-1">Instant invoice allocation</div>
                  </div>
                </div>
              </div>

              {/* Main Content Pane */}
              <div className="col-span-12 md:col-span-9 p-5 sm:p-7 space-y-6">
                {/* Top Greeting & Operational Quick Metrics */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Good morning, Peter!</h2>
                    <p className="text-xs text-slate-500">You have 12 verified payments settling today across 4 properties.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Reconciliation Synced
                    </span>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-medium text-slate-500">Total Properties</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">4</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">54 total units</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-medium text-slate-500">Occupied Units</div>
                    <div className="text-xl font-bold text-blue-600 mt-0.5">51 <span className="text-xs font-normal text-slate-500">(94.4%)</span></div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">3 vacant available</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-medium text-slate-500">Collected Rent</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">KES 240k</div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">+14% this month</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-[11px] font-medium text-slate-500">Arrears</div>
                    <div className="text-xl font-bold text-amber-600 mt-0.5">KES 10k</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">1 tenant pending</div>
                  </div>
                </div>

                {/* Chart & Mini Widget Cluster matching Reference */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* High Contrast Bar Chart (Exact style as Reference: Prominent Blue Bar) */}
                  <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Rent Collection Overview</div>
                        <div className="text-[11px] text-slate-400">January 2026 – May 2026 (Monthly Invoiced vs Collected)</div>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        KES 250,000 Total
                      </div>
                    </div>

                    {/* Styled Bar Columns matching Relink Screenshot */}
                    <div className="h-40 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                      {[
                        { month: 'Jan', height: '55%', active: false, val: '180k' },
                        { month: 'Feb', height: '65%', active: false, val: '210k' },
                        { month: 'Mar', height: '60%', active: false, val: '195k' },
                        { month: 'Apr', height: '85%', active: false, val: '230k' },
                        { month: 'May (Now)', height: '94%', active: true, val: 'KES 240,000' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip on Active/Hover */}
                          <div
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap transition-opacity ${
                              item.active
                                ? 'bg-blue-600 text-white opacity-100 shadow-md'
                                : 'bg-slate-800 text-white opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {item.val}
                          </div>
                          {/* Bar */}
                          <div
                            style={{ height: item.height }}
                            className={`w-full max-w-[42px] rounded-t-xl transition-all ${
                              item.active
                                ? 'bg-blue-600 shadow-lg shadow-blue-500/40'
                                : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                          />
                          <span className={`text-[11px] font-medium ${item.active ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                            {item.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Status Dial & Recent Activity */}
                  <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Operational Health</div>
                      <div className="text-[11px] text-slate-400">Automated Daraja C2B Activity</div>

                      <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Collection Rate</span>
                          <span className="font-bold text-emerald-600">96.0%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-2 rounded-full w-[96%]" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recent Transactions</div>
                        <div className="text-xs flex items-center justify-between py-1 border-b border-slate-100">
                          <div>
                            <div className="font-semibold text-slate-800">Apt 4B - Rent</div>
                            <div className="text-[10px] text-slate-400">M-Pesa: QK49182390</div>
                          </div>
                          <span className="font-bold text-emerald-600">+25,000</span>
                        </div>
                        <div className="text-xs flex items-center justify-between py-1">
                          <div>
                            <div className="font-semibold text-slate-800">Unit 2A - Partial</div>
                            <div className="text-[10px] text-slate-400">M-Pesa: QK49182391</div>
                          </div>
                          <span className="font-bold text-emerald-600">+15,000</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/app/dashboard"
                      className="mt-4 w-full py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      Open Live Dashboard
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TRUST / AUDIENCE SECTION (BUILT FOR THE PEOPLE WHO MANAGE PROPERTIES)
      ========================================================================== */}
      <section className="py-14 border-y border-slate-200/60 bg-white/70 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Built for the People Who Manage Properties
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
            Guri24 brings property owners, managers, accountants and tenants together through a connected property management experience.
          </p>

          {/* 5 Audience Badges / Logos matching reference clean logo strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {[
              { label: 'Property Owners', icon: Building2 },
              { label: 'Property Managers', icon: Users },
              { label: 'Real Estate Companies', icon: Briefcase },
              { label: 'Landlords', icon: Landmark },
              { label: 'Residential Estates', icon: Building },
            ].map((aud, idx) => (
              <div
                key={idx}
                className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700"
              >
                <aud.icon className="w-4 h-4 text-blue-600" />
                {aud.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "WHY GURI24?" - 3 CARDS MATCHING REFERENCE MIDDLE SECTION
          (Card 1: Light, Card 2: ELECTRIC BLUE HERO GRADIENT, Card 3: Light)
      ========================================================================== */}
      <section id="why-guri24" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            WHY GURI24
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Property Management, Made Simpler.
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Spend less time managing scattered records and more time growing your property business.
          </p>
        </div>

        {/* 3-Card Grid Matching The Middle Row of the Reference Screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1 (Light Card): One Connected Platform */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">One Connected Platform</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manage properties, tenants, leases, payments and maintenance from a central workspace.
              </p>
            </div>

            {/* Embedded Mini Visual Widget */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                <span>Insights Portfolio Growth</span>
                <span className="font-bold text-slate-800">54 Units</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-16 pt-2 border-b border-slate-200/60 pb-1">
                <div className="w-4 bg-slate-200 rounded-t h-[40%]" />
                <div className="w-4 bg-slate-200 rounded-t h-[55%]" />
                <div className="w-4 bg-slate-200 rounded-t h-[70%]" />
                <div className="w-4 bg-blue-600 rounded-t h-[95%]" />
                <div className="w-4 bg-slate-200 rounded-t h-[80%]" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Properties Active</span>
                <span className="font-bold text-blue-600">94.4% Occupied</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 (ELECTRIC BLUE HERO GRADIENT CARD): Better Financial Visibility */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-7 shadow-xl shadow-blue-500/25 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mb-5">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Better Financial Visibility</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Know what has been invoiced, collected, allocated and remains outstanding with automated C2B reconciliation.
              </p>
            </div>

            {/* Embedded White/Glass Mini Analytics Widget */}
            <div className="relative z-10 mt-8 p-4 bg-white/95 text-slate-900 rounded-2xl shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold">
                <span>Rent & Revenue Analysis</span>
                <span className="text-blue-600 font-bold">2026 Q2</span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                KES 452,000
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                100% Reconciled via Daraja C2B V2
              </div>
            </div>

            {/* Ambient Background Glow inside the card */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

          {/* Card 3 (Light Card): Organized Tenant Records */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Organized Tenant Records</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Keep tenant information, tenancy documents and communication records accessible to authorized staff.
              </p>
            </div>

            {/* Embedded Mini Visual Widget */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Tenancy Verification</span>
                <span className="text-emerald-600 font-bold">Active</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                    JM
                  </div>
                  <span className="font-semibold text-slate-800">John Mwangi</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                  Verified
                </span>
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                Instant SMS/Email lease receipts
              </div>
            </div>
          </motion.div>
        </div>

        {/* 2 Additional Pillars: Smarter Operations & Secure Access */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Smarter Operations</h4>
              <p className="text-sm text-slate-600 mt-1">
                Use automation, reminders and AI-assisted insights to support everyday property management.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Secure Access</h4>
              <p className="text-sm text-slate-600 mt-1">
                Give owners, managers, accountants and tenants access to the information and tools relevant to their responsibilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURES SECTION (ALL 9 CORE CAPABILITIES IN MODERN BENTO GRID)
      ========================================================================== */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            FEATURES & CAPABILITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Manage Your Properties
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Powerful property management tools designed to simplify everyday rental operations and give you better control of your business.
          </p>
        </div>

        {/* 9 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Building2,
              title: 'Property & Unit Management',
              desc: 'Organize your entire property portfolio in one place. Manage buildings, apartments, units, occupancy, property details and rental information.',
            },
            {
              icon: Users,
              title: 'Tenant Management',
              desc: 'Maintain organized tenant profiles, contact information, identification documents, emergency contacts, lease details and tenancy history.',
            },
            {
              icon: CreditCard,
              title: 'Rent Collection & Payments',
              desc: 'Track rent invoices, payment records, outstanding balances and collection performance. Support M-Pesa Paybill/Till C2B and configured bank payment workflows.',
              highlight: 'Safaricom C2B 1343073',
            },
            {
              icon: FileCheck2,
              title: 'Lease & Booking Management',
              desc: 'Create and manage tenancy agreements, lease periods, renewals, bookings, rent terms and important expiry dates.',
            },
            {
              icon: Wrench,
              title: 'Maintenance Management',
              desc: 'Receive maintenance requests, assign technicians, monitor progress, manage expenses and keep property maintenance records organized.',
            },
            {
              icon: Landmark,
              title: 'Financial Management',
              desc: 'Get a clearer view of rental income, outstanding invoices, deposits, expenses and financial reports through connected financial management.',
            },
            {
              icon: ScanText,
              title: 'OCR & Document Intelligence',
              desc: 'Extract information from uploaded tenancy agreements, invoices, receipts and other documents. Review and approve extracted information before it is submitted to the relevant system.',
            },
            {
              icon: Sparkles,
              title: 'AI Property Assistant',
              desc: 'Get assistance understanding property operations, identifying important trends and interpreting authorized business information with AI-powered insights.',
            },
            {
              icon: BarChart3,
              title: 'Analytics & Reports',
              desc: 'Understand occupancy, rent collection, arrears, property performance and operational trends through interactive dashboards and reports.',
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  {feat.highlight && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      {feat.highlight}
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                <span>Explore capability</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SEAMLESS INTEGRATIONS (CONNECTED NODES MATCHING REFERENCE MIDDLE-RIGHT)
      ========================================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 bg-gradient-to-b from-white to-blue-50/40 rounded-3xl border border-slate-200/80 my-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">CONNECTIVITY</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Seamless Integrations</h2>
          <p className="mt-3 text-sm text-slate-600">
            Automate collections and reconciliations through Kenya's leading financial networks.
          </p>
        </div>

        {/* Integration Hub Visual Diagram */}
        <div className="relative max-w-3xl mx-auto py-8">
          <svg
            ref={integrationsSvgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 240"
            fill="none"
          >
            <path className="pulse-line" d="M 120 40 Q 250 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
            <path className="pulse-line" d="M 200 40 Q 260 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
            <path className="pulse-line" d="M 400 40 Q 340 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
            <path className="pulse-line" d="M 480 40 Q 350 80 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
            <path className="pulse-line" d="M 160 200 Q 240 160 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
            <path className="pulse-line" d="M 440 200 Q 360 160 300 120" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6"/>
          </svg>

          {/* Top Row Providers */}
          <div className="flex justify-around items-center mb-16 relative z-10 px-4">
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Safaricom Daraja C2B V2 (1343073)
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              KCB Bank
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              Equity Bank
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              Co-operative Bank
            </div>
          </div>

          {/* Central Hub Node */}
          <div className="flex justify-center relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-white">
              <div className="font-extrabold text-sm">Guri24</div>
              <div className="text-[10px] text-blue-100">Ledger Hub</div>
            </div>
          </div>

          {/* Bottom Row Providers */}
          <div className="flex justify-around items-center mt-16 relative z-10 px-12">
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              KRA iTax (Withholding Tax 7.5%)
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              Standard Chartered
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOW IT WORKS (3 SIMPLE STEPS)
      ========================================================================== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            GET STARTED
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get Started in 3 Simple Steps
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Set up your organization and start managing your rental operations from one workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Set Up Your Organization',
              desc: 'Create your Guri24 organization, configure your business details and invite your team.',
            },
            {
              step: '02',
              title: 'Add Properties & Tenants',
              desc: 'Register your buildings, units, tenants, leases and rental information.',
            },
            {
              step: '03',
              title: 'Manage Everything in One Place',
              desc: 'Track rent collection, manage maintenance, organize documents and monitor property performance.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden"
            >
              <div className="text-4xl font-black text-blue-100 mb-4">{item.step}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DASHBOARD / PRODUCT SHOWCASE
      ========================================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">COMPLETE VISIBILITY</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Your Entire Property Portfolio at a Glance</h2>
          <p className="mt-3 text-sm text-slate-600">
            Live operational intelligence across every aspect of your tenancy lifecycle.
          </p>
        </div>

        {/* 8 Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-10">
          {[
            'Occupancy',
            'Rent Invoices',
            'Collected Payments',
            'Outstanding Balances',
            'Maintenance Tickets',
            'Tenancy Documents',
            'Financial Summaries',
            'Team Activity',
          ].map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-md shadow-blue-500/25 transition-all"
        >
          Explore Guri24
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* =========================================================================
          SECTION 8: SOLUTIONS (FOR LANDLORDS, MANAGERS, REAL ESTATE, TENANTS)
      ========================================================================== */}
      <section id="solutions" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            TAILORED WORKSPACES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Solutions Tailored to How You Operate
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Dedicated capabilities designed for every stakeholder in the property ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'For Landlords',
              desc: 'Keep track of rental income, expenses, occupancy and property performance without administrative stress.',
            },
            {
              title: 'For Property Managers',
              desc: 'Manage multiple buildings, units, tenant requests, rent collection and team tasks in one connected system.',
            },
            {
              title: 'For Real Estate Companies',
              desc: 'Oversee property portfolios, staff assignments, business records and operational analytics from a central platform.',
            },
            {
              title: 'For Tenants',
              desc: 'Access tenancy details, view invoices, verify payment records and submit maintenance requests with ease.',
            },
          ].map((sol, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{sol.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{sol.desc}</p>
              </div>
              <Link to="/signup" className="mt-6 text-xs font-semibold text-blue-600 inline-flex items-center gap-1">
                Learn more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: RESULTS / BUSINESS BENEFITS
      ========================================================================== */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { metric: '40%', label: 'Faster Processing', sub: 'Automated invoice allocation' },
            { metric: '3×', label: 'Higher Team Alignment', sub: 'Centralized tenant records' },
            { metric: '100%', label: 'Audit Readiness', sub: 'Immutable double-entry ledger' },
            { metric: '10k+', label: 'Active Units Supported', sub: 'Engineered for high scale' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">{stat.metric}</div>
              <div className="text-sm font-bold text-slate-900 mt-2">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CTA BANNER (ROYAL BLUE CONTAINER MATCHING REFERENCE)
      ========================================================================== */}
      <section id="contact" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-500/25">
          {/* Subtle Cloud Texture overlay in banner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Take Control of Your Properties?
            </h2>
            <p className="mt-4 text-sm sm:text-base text-blue-100">
              Join property managers, landlords and real estate companies using Guri24 to simplify operations and grow their business.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="bg-white hover:bg-slate-50 text-blue-700 font-bold px-7 py-3 rounded-full shadow-lg transition-all"
              >
                Get Started
              </Link>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="bg-blue-800/80 hover:bg-blue-800 text-white font-medium px-6 py-3 rounded-full border border-blue-400/40 transition-all"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: FOOTER (MATCHING SPECIFICATION EXACTLY)
      ========================================================================== */}
      <footer className="bg-white border-t border-slate-200 py-16 px-4 sm:px-6 relative z-10 text-sm text-slate-600">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                Guri<span className="text-blue-600">24</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Smart property management platform for rental properties, tenants, leases, automated C2B payments and financial records.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div>
            <div className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Platform</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-blue-600">Property Management</a></li>
              <li><a href="#features" className="hover:text-blue-600">Tenant Directory</a></li>
              <li><a href="#features" className="hover:text-blue-600">Rent Collection & C2B</a></li>
              <li><a href="#features" className="hover:text-blue-600">Maintenance Tickets</a></li>
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <div className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Company</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#why-guri24" className="hover:text-blue-600">About Us</a></li>
              <li><a href="#solutions" className="hover:text-blue-600">Solutions</a></li>
              <li><a href="#contact" className="hover:text-blue-600">Contact Sales</a></li>
              <li><Link to="/app/dashboard" className="hover:text-blue-600">Client Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <div className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Legal & Security</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/legal/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              <li><Link to="/legal/data-protection" className="hover:text-blue-600">Kenya DPA Compliance</Link></li>
              <li><span className="text-slate-400">Short Code: 1343073</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 Guri24 Rental Management Ltd. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Built for Kenyan Property Managers</span>
            <span>Daraja C2B V2 Powered</span>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE "BOOK A DEMO" MODAL (FRAMER MOTION ANIMATED)
      ========================================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {demoSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Demo Scheduled!</h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Our team will reach out at <span className="font-semibold text-slate-800">{demoForm.email}</span> within 2 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <h3 id="modal-title" className="text-xl font-extrabold text-slate-900">
                      Book a Guri24 Walkthrough
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      See how our C2B V2 payment reconciliation and portfolio tools can automate your rentals.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Peter Gatitu"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
                      <input
                        type="email"
                        required
                        placeholder="peter@company.com"
                        value={demoForm.email}
                        onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="0712 345 678"
                        value={demoForm.phone}
                        onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio Size</label>
                      <select
                        value={demoForm.units}
                        onChange={(e) => setDemoForm({ ...demoForm, units: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option>1-24 units</option>
                        <option>25-100 units</option>
                        <option>101-500 units</option>
                        <option>500+ units</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role</label>
                      <select
                        value={demoForm.role}
                        onChange={(e) => setDemoForm({ ...demoForm, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option>Property Manager</option>
                        <option>Property Owner / Landlord</option>
                        <option>Real Estate Executive</option>
                        <option>Accountant</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all"
                  >
                    Confirm Demo Booking
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
