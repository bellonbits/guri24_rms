import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_TOKENS } from './BrandTokens';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'reconciliation', label: 'M-Pesa & Banking' },
    { id: 'accounting', label: 'Double-Entry Ledger' },
    { id: 'security', label: 'KDPA & Security' },
    { id: 'onboarding', label: 'Migration & Leases' },
  ];

  const faqs = [
    {
      category: 'reconciliation',
      q: 'How does Guri24 RMS reconcile M-Pesa rent payments automatically?',
      a: 'Guri24 integrates directly with Safaricom Daraja C2B and STK Push APIs. When a tenant pays via your Paybill or Till number with their unit code as the account reference, our platform receives instant Instant Payment Notifications (IPN), matches the transaction to the active lease invoice, marks it settled, updates the general ledger, and sends an automated SMS/email receipt to the tenant in real time.',
    },
    {
      category: 'reconciliation',
      q: 'Can we manage multiple bank accounts and petty cash simultaneously?',
      a: 'Yes. Guri24 supports multiple financial channels per organization. You can configure multiple commercial bank accounts (e.g. Co-op Bank, Equity Bank, Stanbic, KCB), Paybills, Tills, and physical cash boxes with dedicated ledger account codes in your Chart of Accounts.',
    },
    {
      category: 'accounting',
      q: 'Does Guri24 adhere to standard double-entry accounting?',
      a: 'Absolutely. Guri24 is built on an authoritative double-entry accounting core. Every single financial operation (invoice creation, receipt allocation, deposit escrow, maintenance expense disbursement, bank fee) creates balancing debit and credit journal lines, ensuring complete auditability and instant generation of Trial Balances, Balance Sheets, and Income Statements.',
    },
    {
      category: 'accounting',
      q: 'How are tenant security deposits handled in the ledger?',
      a: 'Tenant deposits are treated as balance sheet liabilities (Account 2100: Tenant Deposit Liabilities) rather than operational revenue. They are held in escrow until lease termination, where our exit inspection workflow enables clear deductions for repairs before issuing documented refunds.',
    },
    {
      category: 'reconciliation',
      q: 'What happens if a bank statement contains transactions not linked to an invoice?',
      a: 'Unmatched or unallocated transactions are placed in our Reconciliation Exceptions queue and booked to Account 2200 (Unallocated Receipts). Organization accountants can review, assign to specific tenant accounts, or initiate investigation with one click.',
    },
    {
      category: 'security',
      q: 'Is my property and financial data secure and isolated?',
      a: 'Yes. Guri24 operates on a hardened multi-tenant architecture where data is partitioned using database row-level security by organization ID. All traffic is encrypted using TLS 1.3, documents and backups use AES-256 encryption at rest, and our practices conform strictly with the Kenya Data Protection Act (KDPA 2019).',
    },
    {
      category: 'onboarding',
      q: 'Can I import my existing tenant records and rent rolls from Excel?',
      a: 'Yes. Guri24 includes an intuitive Excel / CSV bulk import wizard for estates, buildings, units, tenants, active leases, and opening balances. Our customer support team also provides hands-on migration assistance free of charge.',
    },
    {
      category: 'security',
      q: 'Can our staff have different access privileges and permissions?',
      a: 'Yes. Guri24 features granular Role-Based Access Control (RBAC). You can designate roles such as Organization Admin, Property Manager, Financial Accountant, Caretaker, and Tenant, restricting sensitive financial ledger or bank data to authorized personnel only.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
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
          SECTION 1: ARCHITECTURAL HERO BANNER
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '60vh',
          backgroundImage: 'url(/luxury-minimalist-living.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '100px 32px 70px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(2, 20, 41, 0.78) 0%, rgba(2, 20, 41, 0.52) 50%, rgba(2, 20, 41, 0.9) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(50px, 13vw, 175px)',
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: 'rgba(255, 255, 255, 0.08)',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          KNOWLEDGE BASE
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '820px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 18px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '20px',
            }}
          >
            <span style={{ color: '#03D8BF' }}>05</span>
            <span>&bull;</span>
            <span>FAQ &amp; ADVISORY</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4.6vw, 3.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              lineHeight: 1.12,
              marginBottom: '20px',
            }}
          >
            Frequently Asked <span style={{ color: '#B89047' }}>Questions</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.18rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 28px',
            }}
          >
            Everything you need to know about our double-entry general ledger, automated Safaricom Daraja C2B webhooks, and enterprise multi-property workflows.
          </p>

          {/* Search Bar Pill */}
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
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
              placeholder="Search accounting, M-Pesa, security..."
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
      </section>

      {/* =========================================================================
          SECTION 2: ACCORDION LIST
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
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '48px',
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

          {/* Accordion Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isOpen ? '#FAFBFD' : '#FFFFFF',
                    borderRadius: '20px',
                    border: isOpen ? '1px solid #0057FC' : '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 8px 24px -6px rgba(0, 87, 252, 0.1)' : 'none',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '24px 28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      gap: '16px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1.08rem',
                        fontWeight: 800,
                        color: isOpen ? '#0057FC' : '#021429',
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.q}
                    </span>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isOpen ? '#EFF5FF' : '#F1F5F9',
                        color: isOpen ? '#0057FC' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 28px 28px',
                        color: '#475569',
                        fontSize: '0.96rem',
                        lineHeight: 1.65,
                        borderTop: '1px solid rgba(0, 87, 252, 0.1)',
                        paddingTop: '16px',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need help card */}
          <div
            style={{
              marginTop: '56px',
              backgroundColor: '#021429',
              borderRadius: '24px',
              padding: '36px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Have a question not listed here?
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                Our senior client architects are available for direct technical consultations.
              </div>
            </div>
            <Link
              to="/contact?type=consultation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                color: '#021429',
                padding: '10px 22px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
              }}
            >
              <span>Contact Advisory Desk</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
