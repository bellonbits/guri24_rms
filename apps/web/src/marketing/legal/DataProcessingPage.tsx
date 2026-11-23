import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const DataProcessingPage: React.FC = () => {
  return (
    <LegalLayout
      title="Data Processing Agreement (DPA)"
      subtitle="Standard contractual clauses and processing terms governing the handling of customer property data."
      lastUpdated="October 24, 2026"
      version="v2.0.0"
    >
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>1. Scope & Status of the Parties</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          This Data Processing Agreement (&quot;DPA&quot;) supplements the Unit Flow Terms of Service. Under Kenya’s Data Protection Act 2019 and relevant regional privacy regulations:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}><strong>The Customer (Organization)</strong> acts as the <em>Data Controller</em> with respect to tenant personal data, lease documents, rent records, and employee information entered into the service.</li>
          <li style={{ marginBottom: '8px' }}><strong>Unit Flow Technologies Ltd</strong> acts as the <em>Data Processor</em>, handling and storing such data solely on behalf of and under the documented instructions of the Customer.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>2. Data Processor Commitments</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          As a Data Processor, Unit Flow covenants and agrees that it shall:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}>Process personal data exclusively to provide, maintain, and support the SaaS platform in accordance with the Controller’s instructions.</li>
          <li style={{ marginBottom: '8px' }}>Ensure all employees, contractors, and engineering personnel with access to data are bound by strict non-disclosure obligations.</li>
          <li style={{ marginBottom: '8px' }}>Implement technical and organizational security controls designed to protect against accidental, unlawful, or unauthorized destruction, loss, alteration, or disclosure.</li>
          <li style={{ marginBottom: '8px' }}>Notify the Controller without undue delay (and no later than 48 hours) upon becoming aware of any confirmed personal data breach affecting Customer records.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>3. Sub-processors</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Unit Flow utilizes vetted third-party sub-processors for infrastructure, cloud hosting, automated transactional messaging, and banking gateway integrations. All sub-processors are bound by data protection obligations equivalent to those set forth herein.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          A current list of sub-processors is available upon request to subscribed organizations, and advance notice will be provided prior to onboarding new material sub-processors.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>4. Audits & Compliance Assistance</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Unit Flow shall make available to the Customer all information reasonably necessary to demonstrate compliance with applicable data protection laws and allow for audits or inspections conducted by the Customer or an independent auditor appointed by the Customer.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>5. Deletion & Return of Data</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Upon termination of subscription services, Unit Flow shall, at the choice of the Customer, return in standard formats (CSV, JSON, PDF) or securely delete all Customer personal data, unless applicable statutory retention requirements mandate retention.
        </p>
      </section>
    </LegalLayout>
  );
};
