import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Video,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
  Search,
  Clock,
  Tag,
  Calendar,
} from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

interface ResourceItem {
  id: string;
  category: 'guides' | 'blog' | 'accounting' | 'legal';
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  tag: string;
  author: { name: string; role: string };
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'passive-income-rental-properties',
    category: 'guides',
    title: 'How to Start Earning Passive Income with Rental Properties',
    excerpt: 'A comprehensive operational blueprint on acquiring, tenanting, and automating multi-unit residential property in Kenya without daily owner intervention.',
    image: '/featured_nairobi_apartment.jpg',
    readTime: '7 min read',
    date: 'April 14, 2026',
    tag: 'Property Investment',
    author: { name: 'Kevin Omondi', role: 'Chief Portfolio Strategist' },
  },
  {
    id: 'common-mistakes-buying-home',
    category: 'guides',
    title: '10 Common Mistakes to Avoid When Buying or Leasing a Home',
    excerpt: 'Critical legal due diligence checklist: title deed searches, sectional properties act compliance, and understanding tenant deposit escrow liabilities.',
    image: '/luxury-pool-villa.jpg',
    readTime: '9 min read',
    date: 'April 10, 2026',
    tag: 'Due Diligence',
    author: { name: 'Faith Wanjiku', role: 'Senior Legal & Conveyance Counsel' },
  },
  {
    id: 'mpesa-c2b-reconciliation-guide',
    category: 'accounting',
    title: 'Complete Guide to Automating M-Pesa C2B Rent Reconciliation in Kenya',
    excerpt: 'Step-by-step blueprint on integrating Safaricom Daraja API Paybill and Till notifications directly with double-entry general ledger accounts.',
    image: '/modern-organic-balconies.jpg',
    readTime: '8 min read',
    date: 'March 28, 2026',
    tag: 'Financial Operations',
    author: { name: 'Brian Koech', role: 'Lead Financial Systems Architect' },
  },
  {
    id: 'kdpa-compliance-for-landlords',
    category: 'legal',
    title: 'Kenya Data Protection Act 2019: Landlord & Property Manager Compliance Manual',
    excerpt: 'How to legally handle tenant national ID copies, phone numbers, and emergency contact KYC records without regulatory penalties under the KDPA.',
    image: '/luxury-minimalist-living.jpg',
    readTime: '11 min read',
    date: 'March 15, 2026',
    tag: 'Legal & Privacy',
    author: { name: 'Faith Wanjiku', role: 'Senior Legal & Conveyance Counsel' },
  },
  {
    id: 'double-entry-accounting-for-real-estate',
    category: 'accounting',
    title: 'Double-Entry Accounting Principles for Commercial & Residential Real Estate',
    excerpt: 'Demystifying why tenant security deposits are liabilities (Account 2100) and how accrual rent invoicing protects asset yield and net operating income.',
    image: '/hero-luxury-architecture.jpg',
    readTime: '9 min read',
    date: 'February 24, 2026',
    tag: 'Accounting Discipline',
    author: { name: 'Brian Koech', role: 'Lead Financial Systems Architect' },
  },
  {
    id: 'future-of-proptech-east-africa',
    category: 'blog',
    title: 'The State of PropTech in East Africa: Beyond Basic Excel Spreadsheets',
    excerpt: 'Why institutional investors and commercial banks now demand immutable digital rent rolls and audited cash collection trails before financing portfolios.',
    image: '/modern-organic-balconies.jpg',
    readTime: '6 min read',
    date: 'February 10, 2026',
    tag: 'Industry Perspectives',
    author: { name: 'Kevin Omondi', role: 'Chief Portfolio Strategist' },
  },
];

export const ResourcesPages: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'guides', label: 'Investment & Operations' },
    { id: 'accounting', label: 'Accounting & Banking' },
    { id: 'legal', label: 'KDPA & Compliance' },
    { id: 'blog', label: 'Industry Perspectives' },
  ];

  const filteredResources = RESOURCES.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: BRAND_TOKENS.fonts.sans,
        color: '#0F172A',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* =========================================================================
          SECTION 1: ROUNDED ARCHITECTURAL HERO CARD
          ========================================================================= */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '12px auto 80px',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            minHeight: '560px',
            backgroundImage: 'url(/hero-apex-architecture.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 46%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '64px 54px',
            boxSizing: 'border-box',
            boxShadow: '0 25px 60px -15px rgba(2, 20, 41, 0.25)',
          }}
        >
          {/* Dark Vignette Overlay on the Left for Readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(2, 20, 41, 0.88) 0%, rgba(2, 20, 41, 0.72) 42%, rgba(2, 20, 41, 0.2) 78%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '16px',
              }}
            >
              <span>08 &bull; PUBLICATIONS &amp; INSIGHTS</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                color: '#FFFFFF',
                marginBottom: '18px',
              }}
            >
              Real Estate &amp; Financial
              <br />
              Intelligence
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
                color: 'rgba(255, 255, 255, 0.90)',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '560px',
              }}
            >
              Actionable blueprints on M-Pesa automated reconciliation, double-entry general ledgers, Kenya Data Protection Act compliance, and asset management.
            </p>

            {/* Search Pill */}
            <div style={{ maxWidth: '460px', position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              />
              <input
                type="text"
                placeholder="Search guides, accounting, legal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px 12px 48px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EDITORIAL MAGAZINE GRID (MATCHING REFERENCE EXACTLY)
          ========================================================================= */}
      <section
        style={{
          padding: '88px 48px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '56px',
            }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  border: activeCategory === c.id ? '1px solid #021429' : '1px solid #E2E8F0',
                  backgroundColor: activeCategory === c.id ? '#021429' : '#FFFFFF',
                  color: activeCategory === c.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '36px',
            }}
            className="editorial-magazine-grid"
          >
            {filteredResources.map((item, idx) => (
              <article
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px -10px rgba(2, 20, 41, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(2, 20, 41, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(2, 20, 41, 0.05)';
                }}
              >
                {/* Photographic Header */}
                <div style={{ position: 'relative', height: '240px', backgroundColor: '#021429', overflow: 'hidden' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(2, 20, 41, 0.75)',
                      backdropFilter: 'blur(10px)',
                      color: '#03D8BF',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      border: '1px solid rgba(3, 216, 191, 0.3)',
                    }}
                  >
                    {item.tag}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#64748B', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {item.date}
                      </span>
                      <span>&bull;</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {item.readTime}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.28rem',
                        fontWeight: 900,
                        color: '#021429',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.35,
                        marginBottom: '12px',
                      }}
                    >
                      {item.title}
                    </h3>

                    <p style={{ color: '#64748B', fontSize: '0.90rem', lineHeight: 1.6, marginBottom: '24px' }}>
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#021429',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                        }}
                      >
                        {item.author.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div style={{ fontSize: '0.80rem', fontWeight: 600, color: '#021429' }}>
                        {item.author.name}
                      </div>
                    </div>

                    <Link
                      to={`/resources/${item.id}`}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FAFBFD',
                        color: '#021429',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Read More articles
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 768px) {
          .editorial-magazine-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
