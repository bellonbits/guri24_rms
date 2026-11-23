import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const AcceptableUsePage: React.FC = () => {
  return (
    <LegalLayout
      title="Acceptable Use Policy (AUP)"
      subtitle="Rules and standards governing the fair, lawful, and secure usage of the Unit Flow SaaS platform."
      lastUpdated="October 24, 2026"
      version="v1.2.0"
    >
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>1. Purpose & Scope</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          This Acceptable Use Policy (&quot;AUP&quot;) outlines prohibited behaviors and standards of conduct when utilizing the Unit Flow Property Management System (&quot;Unit Flow&quot;), including our web applications, APIs, mobile interfaces, payment reconciliation pipes, automated messaging services, and document OCR systems.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Compliance with this AUP is mandatory for all subscribed organizations, landlords, property managers, tenants, estate personnel, and system administrators. Violations may result in suspension or permanent termination of access.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>2. Lawful Property & Financial Operations</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Unit Flow is strictly reserved for legitimate real estate and property operations. You agree not to use the platform for:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}>Facilitating illegal lease agreements, extortion, predatory rent collection, or unauthorized sub-leasing schemes.</li>
          <li style={{ marginBottom: '8px' }}>Laundering funds through bank or M-Pesa accounts, falsifying financial records, or manipulating double-entry audit journals.</li>
          <li style={{ marginBottom: '8px' }}>Uploading forged identity documents, fraudulent land title deeds, or fabricated bank confirmation statements to OCR pipelines.</li>
          <li style={{ marginBottom: '8px' }}>Evading lawful tax obligations under the Kenya Revenue Authority (KRA) or relevant national tax jurisdictions.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>3. Automated Messaging, SMS & Email Standards</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Unit Flow provides automated notification and invoice transmission capabilities. When using these systems:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}>You must only send messages to active tenants, applicants, or vendors who have provided informed consent or have an ongoing contractual relationship.</li>
          <li style={{ marginBottom: '8px' }}>Sending spam, unsolicited promotional material, political messaging, or deceptive notices is strictly prohibited.</li>
          <li style={{ marginBottom: '8px' }}>Harassment, abusive language, or threatening eviction notices outside the statutory frameworks of local tenancy legislation is a material violation of this policy.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>4. System Integrity & Security Prohibitions</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          You shall not attempt to compromise the security, availability, or architectural boundaries of Unit Flow. Specifically, you may not:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}>Attempt to bypass multi-tenant database row-level security or access records belonging to another organization.</li>
          <li style={{ marginBottom: '8px' }}>Conduct automated vulnerability scanning, load testing, or denial-of-service (DoS) simulations without prior written authorization from Unit Flow Security.</li>
          <li style={{ marginBottom: '8px' }}>Reverse-engineer, decompile, or extract the source code of our Rust services, Python OCR extractors, or proprietary AI models.</li>
          <li style={{ marginBottom: '8px' }}>Share administrative credentials across unauthorized individuals or deploy automated scraping scrapers against public endpoints.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>5. Reporting Violations & Enforcement</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          If you identify or suspect an abuse of our systems or services, please report it immediately to our Trust & Safety team at{' '}
          <a href="mailto:abuse@guri24.com" style={{ color: '#0057FC', fontWeight: 600, textDecoration: 'none' }}>
            abuse@guri24.com
          </a>. We investigate all credible reports promptly and take necessary corrective measures including immediate suspension and legal referral where warranted.
        </p>
      </section>
    </LegalLayout>
  );
};
