import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BookOpen, FileText, Sparkles, HelpCircle, Video, RefreshCw, ArrowRight, Search, Clock, Tag } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

interface ResourceItem {
  id: string;
  category: 'guides' | 'blog' | 'help' | 'tutorials' | 'updates';
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tag: string;
  content?: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: 'mpesa-c2b-reconciliation-guide',
    category: 'guides',
    title: 'Complete Guide to Automating M-Pesa C2B Rent Reconciliation in Kenya',
    excerpt: 'Step-by-step blueprint on integrating Safaricom Daraja API Paybill and Till notifications with double-entry general ledger accounts.',
    readTime: '8 min read',
    date: 'Oct 18, 2026',
    tag: 'Financial Operations',
  },
  {
    id: 'kdpa-compliance-for-landlords',
    category: 'guides',
    title: 'Kenya Data Protection Act 2019: Landlord & Property Manager Compliance Manual',
    excerpt: 'How to legally handle tenant national ID copies, phone numbers, and emergency contact KYC records without regulatory penalties.',
    readTime: '11 min read',
    date: 'Sep 29, 2026',
    tag: 'Legal & Privacy',
  },
  {
    id: 'double-entry-accounting-for-real-estate',
    category: 'guides',
    title: 'Double-Entry Accounting Principles for Commercial & Residential Real Estate',
    excerpt: 'Demystifying why tenant security deposits are liabilities (Account 2100) and how accrual rent invoicing protects asset yield.',
    readTime: '9 min read',
    date: 'Sep 14, 2026',
    tag: 'Accounting',
  },
  {
    id: 'eliminating-rent-delinquency-playbook',
    category: 'blog',
    title: 'How Forward-Thinking Property Firms Reduced Delinquency to Under 2.5%',
    excerpt: 'Operational strategies from top Kenyan property managers on automated SMS reminders, tiered grace periods, and mobile STK push.',
    readTime: '6 min read',
    date: 'Oct 22, 2026',
    tag: 'Industry Insights',
  },
  {
    id: 'future-of-proptech-east-africa',
    category: 'blog',
    title: 'The State of PropTech in East Africa: Beyond Basic Excel Spreadsheets',
    excerpt: 'Why institutional investors and commercial banks now demand immutable digital rent rolls and audited cash collection trails.',
    readTime: '7 min read',
    date: 'Oct 05, 2026',
    tag: 'Technology',
  },
  {
    id: 'video-setting-up-first-property',
    category: 'tutorials',
    title: 'Video Tutorial: Setting Up Your First Property & Bulk Generating Units',
    excerpt: 'A 6-minute visual walkthrough on defining buildings, floors, unit numbering formulas, and custom rental rates in Guri24 RMS.',
    readTime: '6 min watch',
    date: 'Oct 12, 2026',
    tag: 'Getting Started',
  },
  {
    id: 'video-bank-statement-ocr-import',
    category: 'tutorials',
    title: 'Video Tutorial: Importing Multi-Bank Statements & Resolving Exceptions',
    excerpt: 'How to upload Co-op, KCB, or Equity Bank CSV/PDF statements and run automated rule-based reconciliation in under 60 seconds.',
    readTime: '8 min watch',
    date: 'Sep 24, 2026',
    tag: 'Banking',
  },
  {
    id: 'v2-4-release-notes',
    category: 'updates',
    title: 'Guri24 RMS Release v2.4: Instant STK Push & Multi-Bank Segregation',
    excerpt: 'Full changelog of our October 2026 release introducing one-click M-Pesa STK push, improved OCR extraction, and faster trial balance queries.',
    readTime: '4 min read',
    date: 'Oct 24, 2026',
    tag: 'Product Updates',
  },
  {
    id: 'help-how-to-refund-tenant-deposit',
    category: 'help',
    title: 'Help Article: Processing Tenant Deposit Escrow Refunds & Move-Out Deductions',
    excerpt: 'Standard operating procedure for performing unit exit inspections, recording damage deductions, and disbursing net refunds.',
    readTime: '5 min read',
    date: 'Oct 15, 2026',
    tag: 'Help & FAQ',
  },
];

export const ResourcesPages: React.FC = () => {
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Extract category from /resources/:cat
  const subCategory = pathname.split('/resources/')[1] || '';
  const currentCategory = ['guides', 'blog', 'help', 'tutorials', 'updates'].includes(subCategory)
    ? subCategory
    : 'all';

  const filtered = RESOURCES.filter((item) => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesNav = [
    { id: 'all', label: 'All Resources', path: '/resources', icon: BookOpen },
    { id: 'guides', label: 'Guides & Manuals', path: '/resources/guides', icon: FileText },
    { id: 'blog', label: 'Blog & Insights', path: '/resources/blog', icon: Sparkles },
    { id: 'tutorials', label: 'Video Tutorials', path: '/resources/tutorials', icon: Video },
    { id: 'help', label: 'Help Articles', path: '/resources/help', icon: HelpCircle },
    { id: 'updates', label: 'Product Updates', path: '/resources/updates', icon: RefreshCw },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 54px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 16px',
              backgroundColor: BRAND_TOKENS.colors.primaryTint,
              borderRadius: '999px',
              color: BRAND_TOKENS.colors.primaryBlue,
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            Knowledge & Resources Hub
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            Property Operations, Accounting & Engineering Insights
          </h1>
          <p style={{ fontSize: '1.15rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
            Comprehensive documentation, legal playbooks, accounting frameworks, and product tutorials designed for modern real estate managers.
          </p>

          {/* Search Box */}
          <div style={{ marginTop: '32px', maxWidth: '520px', margin: '32px auto 0', position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search guides, tutorials, or accounting topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                fontSize: '0.96rem',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                backgroundColor: '#FFFFFF',
              }}
            />
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '48px' }}>
          {categoriesNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentCategory === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: `1px solid ${isActive ? BRAND_TOKENS.colors.primaryBlue : BRAND_TOKENS.colors.slateBorder}`,
                  backgroundColor: isActive ? BRAND_TOKENS.colors.primaryBlue : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : BRAND_TOKENS.colors.darkNavy,
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 87, 252, 0.15)' : 'none',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Resources Cards Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
            <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle }}>No resources found matching your search criteria.</p>
            <button
              onClick={() => setSearchQuery('')}
              style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '10px', backgroundColor: BRAND_TOKENS.colors.primaryBlue, color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {filtered.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: BRAND_TOKENS.colors.primaryBlue, backgroundColor: BRAND_TOKENS.colors.primaryTint, padding: '3px 10px', borderRadius: '999px' }}>
                      <Tag size={12} /> {item.tag}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748B' }}>
                      <Clock size={13} /> {item.readTime}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '10px', lineHeight: 1.35 }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    {item.excerpt}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{item.date}</span>
                  <Link
                    to={`/resources/${item.category}#${item.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: BRAND_TOKENS.colors.primaryBlue,
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                    }}
                  >
                    Read Resource <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
