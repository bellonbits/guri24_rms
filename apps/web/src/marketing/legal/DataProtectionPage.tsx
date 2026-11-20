import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const DataProtectionPage: React.FC = () => {
  return (
    <LegalLayout
      title="Data Protection & Privacy Architecture"
      subtitle="Operational compliance with the Kenya Data Protection Act 2019 (Office of the Data Protection Commissioner)."
      lastUpdated="November 20, 2026"
      version="1.8"
    >
      <h2>1. The Kenya Data Protection Act, 2019 (KDPA)</h2>
      <p>
        The Kenya Data Protection Act 2019 sets the national standard for lawful processing of personal data in Kenya. Guri24 RMS is engineered from the ground up to respect data minimization, purpose limitation, integrity, and confidentiality principles.
      </p>

      <h2>2. Customer vs. Guri24 Responsibilities</h2>
      <ul>
        <li>
          <strong>Customer Responsibilities:</strong> As property managers and landlords collecting tenant personal data (identification documents, mobile numbers, employment records), you are responsible for obtaining appropriate tenant consent and providing lawful notice of lease collection terms.
        </li>
        <li>
          <strong>Guri24 Responsibilities:</strong> We provide technical safeguards to prevent unauthorized access, cross-tenant exposure, data corruption, or transmission leaks. We never monetize or sell tenant data to third-party data brokers.
        </li>
      </ul>

      <h2>3. Technical Safeguards & Subprocessors</h2>
      <p>
        Guri24 uses audited cloud infrastructure to deliver real-time resilience:
      </p>
      <ul>
        <li><strong>Database Engine:</strong> Supabase PostgreSQL with cryptographic row-level security and tenant context assertions.</li>
        <li><strong>Communications Gateways:</strong> Safaricom Daraja API for authenticated M-Pesa STK push and webhook callbacks.</li>
        <li><strong>Document Intelligence:</strong> Isolated Python OCR processing queue that requires explicit human manager verification before records are committed.</li>
      </ul>

      <h2>4. Data Access & Deletion Requests</h2>
      <p>
        Tenants wishing to exercise access, correction, or deletion rights should submit inquiries directly to their property management organization. Organization administrators can execute tenant data exports directly from the Guri24 platform.
      </p>
    </LegalLayout>
  );
};
