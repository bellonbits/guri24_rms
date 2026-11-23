import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const AccessibilityPage: React.FC = () => {
  return (
    <LegalLayout
      title="Accessibility Statement"
      subtitle="Our commitment to digital accessibility, inclusive design, and conformance with WCAG 2.1 AA standards."
      lastUpdated="October 24, 2026"
      version="v1.1.0"
    >
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>1. Accessibility Commitment</h2>
        <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '12px' }}>
          Unit Flow is committed to ensuring digital accessibility for people of all abilities. We continuously improve the user experience for everyone and apply relevant accessibility standards across our public portal and core property management applications.
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          Our design tokens and user interfaces aim to satisfy the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA conformance criteria.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>2. Implemented Accessibility Features</h2>
        <ul style={{ paddingLeft: '20px', color: '#475569', lineHeight: 1.7 }}>
          <li style={{ marginBottom: '8px' }}><strong>Semantic HTML:</strong> Use of landmarks, native buttons, table structures, and form labels to provide structured navigation for screen readers.</li>
          <li style={{ marginBottom: '8px' }}><strong>Color Contrast:</strong> Minimum 4.5:1 text contrast ratios against backgrounds for body typography and interactive controls.</li>
          <li style={{ marginBottom: '8px' }}><strong>Keyboard Navigation:</strong> Full keyboard reachability for modals, tables, dropdowns, and cookie consent preferences with visible focus rings.</li>
          <li style={{ marginBottom: '8px' }}><strong>Reduced Motion:</strong> Respect for user system preferences via CSS <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>prefers-reduced-motion</code> across animations and transitions.</li>
          <li style={{ marginBottom: '8px' }}><strong>Responsive Scaling:</strong> Fluid layouts that maintain readability and layout integrity up to 200% browser zoom levels.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#021429', marginBottom: '12px' }}>3. Feedback & Contact</h2>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>
          We welcome your feedback on the accessibility of Unit Flow. If you encounter accessibility barriers on any part of our platform or need materials in an alternative format, please contact our Accessibility Coordinator at{' '}
          <a href="mailto:accessibility@guri24.com" style={{ color: '#0057FC', fontWeight: 600, textDecoration: 'none' }}>
            accessibility@guri24.com
          </a>.
        </p>
      </section>
    </LegalLayout>
  );
};
