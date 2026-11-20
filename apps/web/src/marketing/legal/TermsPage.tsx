import React from 'react';
import { LegalLayout } from '../LegalLayout';

export const TermsPage: React.FC = () => {
  return (
    <LegalLayout
      title="Terms & Conditions of Service"
      subtitle="Standard software-as-a-service agreement governing the use of Guri24 RMS."
      lastUpdated="November 20, 2026"
      version="2.4"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        These Terms and Conditions ("Terms") constitute a legally binding agreement between Guri24 Rental Management Ltd ("Guri24", "we", "us", or "our"), a company incorporated in the Republic of Kenya, and the individual or legal entity ("Customer", "Organization", "you") registering for, accessing, or using the Guri24 Rental Management SaaS Platform.
      </p>

      <h2>2. Definitions & Interpretation</h2>
      <p>
        <strong>"Authorized User"</strong> means any employee, contractor, agent, or property manager designated by the Customer with assigned role permissions within an Organization workspace.
      </p>
      <p>
        <strong>"Customer Data"</strong> means all electronic data, property records, lease terms, tenant information, financial balances, and documents submitted to or generated within the Customer's isolated workspace.
      </p>
      <p>
        <strong>"Service"</strong> means the cloud-hosted Guri24 Residential Management System, including the web portal, APIs, M-Pesa integration connector, and background processing workers.
      </p>

      <h2>3. Account Creation & Organization Registration</h2>
      <p>
        To access the Service, you must register an Organization by providing truthful, accurate, and current information, including legal entity name, administrative contact details, and KRA PIN where applicable. You are solely responsible for maintaining the confidentiality of administrative credentials and session tokens.
      </p>

      <h2>4. Multi-Tenant Organization Isolation & Administrator Responsibilities</h2>
      <p>
        Each Customer receives an isolated organization workspace. Organization Administrators hold sole authority over:
      </p>
      <ul>
        <li>Inviting staff members and scoping their property-level permissions (e.g. Property Manager, Accountant, Caretaker).</li>
        <li>Authorizing financial configurations, commercial bank mappings, and M-Pesa Paybill connections.</li>
        <li>Reviewing and accepting extracted OCR documents before they affect business records.</li>
      </ul>

      <h2>5. Subscription Plans, Fees & Billing</h2>
      <p>
        The Service is offered under subscription tiers (Starter, Growth Professional, Enterprise KE) billed on a monthly or annual cadence in Kenya Shillings (KES). All fees are exclusive of applicable statutory taxes (including VAT where applicable). Invoices are payable upon receipt.
      </p>

      <h2>6. Customer Data Ownership & Intellectual Property</h2>
      <p>
        As between Guri24 and Customer, Customer retains all right, title, and interest in and to all Customer Data. Guri24 acquires no ownership rights over tenant records, leases, or ledger entries. Guri24 retains all intellectual property rights in the software architecture, user interfaces, documentation, and underlying proprietary algorithms.
      </p>

      <h2>7. Financial Integrations & Payment Gateway Disclaimer</h2>
      <p>
        Guri24 facilitates technical communication with payment networks (such as Safaricom Daraja M-Pesa and commercial bank statement parsers). Guri24 is not a bank, deposit-taking institution, or payment processor. Tenant security deposits held under Account 2100 remain the direct fiduciary responsibility of the Customer.
      </p>

      <h2>8. AI Functionality & Limitations</h2>
      <p>
        The Guri24 AI Assistant uses authorized, organization-scoped records to generate summaries and calculations. AI outputs are advisory tools to assist management and do not constitute certified public accounting or legal opinions.
      </p>

      <h2>9. Limitation of Liability & Governing Law</h2>
      <p>
        To the maximum extent permitted by applicable law, in no event shall Guri24 be liable for indirect, incidental, or consequential damages. These Terms shall be governed by and construed in accordance with the substantive laws of the Republic of Kenya.
      </p>
    </LegalLayout>
  );
};
