import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND_TOKENS } from './BrandTokens';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Guri24 RMS reconcile M-Pesa rent payments automatically?',
      a: 'Guri24 integrates directly with Safaricom Daraja C2B and STK Push APIs. When a tenant pays via your Paybill or Till number with their unit code as the account reference, our platform receives instant Instant Payment Notifications (IPN), matches the transaction to the active lease invoice, marks it settled, updates the general ledger, and sends an automated SMS/email receipt to the tenant in real time.',
    },
    {
      q: 'Can we manage multiple bank accounts and petty cash simultaneously?',
      a: 'Yes. Guri24 supports multiple financial channels per organization. You can configure multiple commercial bank accounts (e.g. Co-op Bank, Equity Bank, Stanbic, KCB), Paybills, Tills, and physical cash boxes with dedicated ledger account codes in your Chart of Accounts.',
    },
    {
      q: 'Does Guri24 adhere to standard double-entry accounting?',
      a: 'Absolutely. Guri24 is built on an authoritative double-entry accounting core. Every single financial operation (invoice creation, receipt allocation, deposit escrow, maintenance expense disbursement, bank fee) creates balancing debit and credit journal lines, ensuring complete auditability and instant generation of Trial Balances, Balance Sheets, and Income Statements.',
    },
    {
      q: 'How are tenant security deposits handled?',
      a: 'Tenant deposits are treated as balance sheet liabilities (Account 2100: Tenant Deposit Liabilities) rather than operational revenue. They are held in escrow until lease termination, where our exit inspection workflow enables clear deductions for repairs before issuing documented refunds.',
    },
    {
      q: 'What happens if a bank statement contains transactions not linked to an invoice?',
      a: 'Unmatched or unallocated transactions are placed in our Reconciliation Exceptions queue and booked to Account 2200 (Unallocated Receipts). Organization accountants can review, assign to specific tenant accounts, or initiate investigation with one click.',
    },
    {
      q: 'Is my property and financial data secure and isolated?',
      a: 'Yes. Guri24 operates on a hardened multi-tenant architecture where data is partitioned using database row-level security by organization ID. All traffic is encrypted using TLS 1.3, documents and backups use AES-256 encryption at rest, and our practices conform strictly with the Kenya Data Protection Act (KDPA 2019).',
    },
    {
      q: 'Can I import my existing tenant records and rent rolls from Excel?',
      a: 'Yes. Guri24 includes an intuitive Excel / CSV bulk import wizard for estates, buildings, units, tenants, active leases, and opening balances. Our customer support team also provides hands-on migration assistance free of charge.',
    },
    {
      q: 'Can our staff have different access privileges?',
      a: 'Yes. Guri24 features granular Role-Based Access Control (RBAC). You can designate roles such as Organization Admin, Property Manager, Financial Accountant, Caretaker, and Tenant, restricting sensitive financial ledger or bank data to authorized personnel only.',
    },
  ];

  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 54px' }}>
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
            Knowledge Base & FAQ
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '16px',
              lineHeight: 1.15,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '1.1rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.6 }}>
            Everything you need to know about Guri24 RMS, M-Pesa automated reconciliation, general ledger accounting, and data privacy.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '64px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: `1px solid ${isOpen ? BRAND_TOKENS.colors.primaryBlue : BRAND_TOKENS.colors.slateBorder}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen ? '0 4px 16px rgba(0, 87, 252, 0.08)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? BRAND_TOKENS.colors.primaryTint : '#F1F5F9',
                      color: isOpen ? BRAND_TOKENS.colors.primaryBlue : '#64748B',
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
                  <div style={{ padding: '0 28px 24px', color: '#475569', fontSize: '0.98rem', lineHeight: 1.7, borderTop: '1px solid #F8FAFC' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>
            Still have questions about Guri24?
          </h3>
          <p style={{ color: BRAND_TOKENS.colors.slateSubtle, fontSize: '0.95rem', marginBottom: '20px' }}>
            Our technical and property accounting specialists are available to answer any questions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                backgroundColor: BRAND_TOKENS.colors.primaryBlue,
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.92rem',
                textDecoration: 'none',
              }}
            >
              Contact Support Team <ArrowRight size={16} />
            </Link>
            <Link
              to="/resources"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                backgroundColor: BRAND_TOKENS.colors.bgCanvas,
                border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
                color: BRAND_TOKENS.colors.darkNavy,
                fontWeight: 600,
                fontSize: '0.92rem',
                textDecoration: 'none',
              }}
            >
              Explore Documentation & Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
