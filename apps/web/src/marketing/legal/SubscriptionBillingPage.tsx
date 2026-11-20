import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const SubscriptionBillingPage: React.FC = () => {
  return (
    <LegalLayout
      title="Subscription & Billing Terms"
      subtitle="Terms governing billing cycles, pricing tiers, unit-based licensing, renewals, and payment processing."
      lastUpdated="October 24, 2026"
      version="v1.1.0"
    >
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>1. Subscription Tiers & Billing Structure</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Guri24 RMS provides subscription-based software access tailored to real estate portfolios. Subscription tiers (Starter, Growth, Scale, and Enterprise) are priced on a predictable monthly or discounted annual cadence, calibrated by managed unit count and enabled enterprise features.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          All active units registered within your organization’s properties count towards your billing tier threshold. Adding properties or units that exceed your contracted tier will prompt an automated notification and prorated tier adjustment.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>2. Currency & Payment Methods</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Subscriptions are billed in Kenya Shillings (KES) or United States Dollars (USD) depending on your primary contracting entity. Supported payment methods include:
        </p>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}>M-Pesa Express and Paybill automated checkout.</li>
          <li style={{ marginBottom: '8px' }}>Visa, MasterCard, and American Express commercial credit/debit cards.</li>
          <li style={{ marginBottom: '8px' }}>Direct Electronic Funds Transfer (EFT / RTGS) for annual Enterprise accounts.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>3. Billing Cycle & Automatic Renewal</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Monthly subscriptions renew automatically on the same day each calendar month. Annual subscriptions renew automatically on the anniversary date unless canceled at least 14 days prior to renewal.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Invoices with valid tax identification are generated immediately upon settlement and accessible in real time from your Organization Settings &gt; Billing portal.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>4. Taxes & Statutory Deductions</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Unless stated otherwise, displayed fees are exclusive of applicable Value Added Tax (VAT), Digital Service Tax (DST), or local withholding taxes where required by statutory authorities. Applicable taxes are itemized clearly on all tax invoices.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>5. Cancellation & Refund Policy</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Organizations may cancel their subscription at any time via the billing settings. Upon cancellation, your access remains active until the end of the current paid billing cycle, after which account features transition to read-only status for data export.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Subscription payments are non-refundable except where required by consumer protection legislation or where service unavailability exceeds agreed SLA commitments.
        </p>
      </section>
    </LegalLayout>
  );
};
