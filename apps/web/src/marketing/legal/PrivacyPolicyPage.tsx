import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Comprehensive data processing notice for Unit Flow property management platform."
      lastUpdated="November 20, 2026"
      version="2.1"
    >
      <h2>1. Introduction & Scope</h2>
      <p>
        Unit Flow Technologies Ltd ("Unit Flow", "we", "our") is dedicated to protecting the privacy of our customer organizations, property administrators, staff users, and tenants. This Privacy Policy details how we collect, process, store, and safeguard personal data within the Unit Flow SaaS platform in compliance with the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and international privacy standards.
      </p>

      <h2>2. Roles of Parties: Controller vs. Processor</h2>
      <p>
        Under applicable data protection law, roles are distinguished as follows:
      </p>
      <ul>
        <li>
          <strong>Unit Flow as Data Controller:</strong> We act as the Data Controller with respect to account registration data, administrative contact information, billing records, and technical telemetry collected directly from customer administrators.
        </li>
        <li>
          <strong>Customer as Data Controller / Unit Flow as Data Processor:</strong> The customer organization (landlord, property manager, or real estate firm) acts as the Data Controller regarding tenant personal information, lease terms, rent billing schedules, and maintenance records uploaded into the platform. Unit Flow acts strictly as a Data Processor executing instructions on the customer's behalf.
        </li>
      </ul>

      <h2>3. Categories of Personal Data Processed</h2>
      <h3>A. Platform Account Data</h3>
      <p>
        When you register an organization or staff account: Name, professional email address, mobile phone number, cryptographic password hash, and assigned role scopes.
      </p>

      <h3>B. Tenant & Lease Data</h3>
      <p>
        Submitted by property managers: Tenant full legal name, Kenyan national ID or passport number, telephone number (normalized 254 MSISDN), emergency contacts, unit lease duration, and rent terms.
      </p>

      <h3>C. Financial & Payment Information</h3>
      <p>
        Rent invoices, M-Pesa transaction reference numbers (MpesaReceiptNumber), payment amounts, commercial bank account numbers for clearing, and Account 2100 tenant security deposit balances.
      </p>

      <h2>4. Purpose and Legal Basis for Processing</h2>
      <p>
        We process personal data on the following lawful bases:
      </p>
      <ul>
        <li><strong>Contractual Performance:</strong> Enabling property operations, rent billing, M-Pesa automated reconciliation, and lease management.</li>
        <li><strong>Legal Compliance:</strong> Meeting statutory accounting obligations, KRA tax reporting requirements, and corporate audits.</li>
        <li><strong>Legitimate Interests:</strong> Securing platform infrastructure, preventing multi-tenant data breaches, and improving software stability.</li>
      </ul>

      <h2>5. Multi-Tenant Data Isolation & Security Measures</h2>
      <p>
        Data submitted to Unit Flow is isolated logically via PostgreSQL row-level security and strict organization context verification. We employ TLS 1.3 encryption in transit, AES-256 encryption at rest, regular automated backups, and rate-limited API firewalls.
      </p>

      <h2>6. Data Subject Rights (KDPA 2019)</h2>
      <p>
        Subject to statutory exceptions, Kenyan data subjects hold rights to:
      </p>
      <ul>
        <li>Right to be informed of how their data is gathered and utilized.</li>
        <li>Right of access to personal records held within the system.</li>
        <li>Right to rectification of false or misleading information.</li>
        <li>Right to erasure of non-statutory records upon lease termination.</li>
      </ul>

      <h2>7. Data Retention & Contact</h2>
      <p>
        Customer financial and ledger entries are retained in accordance with Kenyan tax and accounting standards. For privacy inquiries, contact our Data Protection Office at <a href="mailto:privacy@guri24.com">privacy@guri24.com</a>.
      </p>
    </LegalLayout>
  );
};
