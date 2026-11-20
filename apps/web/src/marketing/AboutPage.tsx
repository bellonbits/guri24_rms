import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Users, Landmark, Award, ArrowRight } from 'lucide-react';
import { BRAND_TOKENS } from './BrandTokens';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ backgroundColor: BRAND_TOKENS.colors.bgCanvas, minHeight: '100vh', padding: '64px 24px 100px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px' }}>
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
            About Guri24 RMS
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: BRAND_TOKENS.colors.darkNavy,
              marginBottom: '20px',
              lineHeight: 1.15,
            }}
          >
            Modernizing Property & Financial Operations Across Africa
          </h1>
          <p style={{ fontSize: '1.15rem', color: BRAND_TOKENS.colors.slateSubtle, lineHeight: 1.7 }}>
            Guri24 was founded with a singular purpose: to replace messy paper receipts, disconnected spreadsheets, and manual M-Pesa reconciliations with an authoritative, enterprise-grade rental and financial management platform.
          </p>
        </div>

        {/* Story Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: `1px solid ${BRAND_TOKENS.colors.slateBorder}`,
            padding: '54px 48px',
            marginBottom: '48px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '16px', letterSpacing: '-0.02em' }}>
                Why We Built Guri24
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '16px', fontSize: '1rem' }}>
                For decades, property management across Kenya and East Africa has operated on manual friction: tenants paying through disparate Paybills, property managers manually keying in M-Pesa codes, bank statements arriving weeks after month-end, and landlords left with zero real-time visibility into their actual Net Operating Income.
              </p>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '1rem' }}>
                We engineered Guri24 RMS to unite property operations and double-entry accounting in one cohesive system. Built with memory-safe Rust services and automated banking connectors, Guri24 guarantees that every shilling billed matches a reconciled bank or M-Pesa ledger entry.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '4px' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Double-Entry General Ledger Invariant</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginBottom: '4px' }}>0 sec</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Instant M-Pesa IPN Reconciliation</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366F1', marginBottom: '4px' }}>KDPA</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Certified Privacy & Data Compliance</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '4px' }}>99.9%</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Platform Availability Target</div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: BRAND_TOKENS.colors.darkNavy, textAlign: 'center', marginBottom: '36px' }}>
            Our Foundational Engineering Principles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: BRAND_TOKENS.colors.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND_TOKENS.colors.primaryBlue, marginBottom: '20px' }}>
                <Landmark size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Zero Guesswork Accounting</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every financial transaction satisfies double-entry debit-credit balance. No ghost balances or fabricated metrics.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', marginBottom: '20px' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Security & Row-Level Isolation</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Data belonging to an organization is cryptographically isolated and strictly partitioned at the PostgreSQL storage layer.
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px', border: `1px solid ${BRAND_TOKENS.colors.slateBorder}` }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: '20px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: BRAND_TOKENS.colors.darkNavy, marginBottom: '8px' }}>Empowering Real People</h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Intuitive software engineered so caretakers, accountants, and busy property directors can collaborate with zero friction.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            backgroundColor: BRAND_TOKENS.colors.darkNavy,
            borderRadius: '24px',
            padding: '54px 48px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Ready to experience institutional-grade property management?
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.6 }}>
            Join forward-thinking property management firms across the region. Start your 14-day free trial today.
          </p>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              borderRadius: '12px',
              backgroundColor: BRAND_TOKENS.colors.primaryBlue,
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            Create Your Organization <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
