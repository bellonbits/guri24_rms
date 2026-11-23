import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const SecurityPage: React.FC = () => {
  return (
    <LegalLayout
      title="Security Architecture & Controls"
      subtitle="Comprehensive overview of infrastructure isolation, encryption standards, row-level security, and audit systems."
      lastUpdated="October 24, 2026"
      version="v2.1.0"
    >
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>1. Defense-in-Depth Architecture</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Unit Flow is engineered with security as a foundational primitive. Our multi-tenant architecture enforces strict logical data isolation, cryptographic protections at rest and in transit, and immutable audit logging across all financial and operational events.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Our application stack combines high-performance Rust core microservices, memory-safe Axum network layers, sandboxed Python OCR workers, and hardened PostgreSQL databases.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>2. Data Encryption Standards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px', marginBottom: '16px' }}>
          <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#021429', marginBottom: '6px' }}>Encryption in Transit</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              All client-to-server and inter-service communications enforce TLS 1.3 with forward secrecy and HSTS headers.
            </p>
          </div>
          <div style={{ border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#021429', marginBottom: '6px' }}>Encryption at Rest</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
              Database tables, object storage (lease agreements, OCR scans), and automated backups are encrypted using AES-256 keys.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>3. Multi-Tenant Logical Isolation</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Every database query within Unit Flow is scoped by an immutable <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>organization_id</code> partition. We enforce database-level row access policies and application context verification to prevent cross-tenant data leakage.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>4. Financial General Ledger Integrity</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Financial transactions within Unit Flow adhere to double-entry accounting invariants (<code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>Debit == Credit</code>). Once written, journal lines and audit log records cannot be silently mutated or retroactively deleted, creating an immutable compliance trail for forensic verification.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>5. Responsible Disclosure Program</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          We welcome vulnerability disclosures from security researchers. If you believe you have discovered a potential security vulnerability in any Unit Flow service, please email our Security Team at{' '}
          <a href="mailto:security@guri24.com" style={{ color: '#0057FC', fontWeight: 600, textDecoration: 'none' }}>
            security@guri24.com
          </a>. We acknowledge receipt within 24 hours and do not pursue legal action against researchers acting in good faith.
        </p>
      </section>
    </LegalLayout>
  );
};
