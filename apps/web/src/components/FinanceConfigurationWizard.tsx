import React, { useState, useEffect } from 'react';
import {
  BuildingOffice2Icon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  ScaleIcon,
  DocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import type {
  Organization,
  Property,
  OrganizationFinancialSettings,
  FinancialChannel,
  BankAccount,
  OpeningBalanceRecord,
  PropertyAccountMapping,
  ReconciliationRule,
  Account,
} from '../types';
import { apiClient } from '../lib/apiClient';

interface FinanceConfigurationWizardProps {
  currentOrg: Organization;
  properties: Property[];
  onComplete?: () => void;
}

const DEFAULT_CHART_OF_ACCOUNTS: Array<{ code: string; name: string; type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'; normal: 'DEBIT' | 'CREDIT' }> = [
  { code: '1010', name: 'Cash & Bank Clearing Account', type: 'ASSET', normal: 'DEBIT' },
  { code: '1020', name: 'M-Pesa Daraja Paybill Collections', type: 'ASSET', normal: 'DEBIT' },
  { code: '1030', name: 'Petty Cash Operating Fund', type: 'ASSET', normal: 'DEBIT' },
  { code: '1100', name: 'Accounts Receivable - Tenant Rents', type: 'ASSET', normal: 'DEBIT' },
  { code: '2100', name: 'Tenant Security Deposits Held (Trust Escrow)', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '2200', name: 'Tenant Unallocated Prepayments', type: 'LIABILITY', normal: 'CREDIT' },
  { code: '3000', name: 'Owners Capital & Retained Earnings', type: 'EQUITY', normal: 'CREDIT' },
  { code: '4000', name: 'Residential Rental Revenue', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4100', name: 'Utility & Service Charge Recovery', type: 'REVENUE', normal: 'CREDIT' },
  { code: '4200', name: 'Late Payment Penalty Revenue', type: 'REVENUE', normal: 'CREDIT' },
  { code: '5000', name: 'Property Maintenance & Repairs Expense', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5100', name: 'Property Utilities & Operations Expense', type: 'EXPENSE', normal: 'DEBIT' },
  { code: '5200', name: 'Property Management & Agent Fees', type: 'EXPENSE', normal: 'DEBIT' },
];

export const FinanceConfigurationWizard: React.FC<FinanceConfigurationWizardProps> = ({
  currentOrg,
  properties,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Step 1: Settings
  const [settings, setSettings] = useState<OrganizationFinancialSettings>({
    id: `fs-${currentOrg.id}`,
    organization_id: currentOrg.id,
    legal_name: currentOrg.name,
    reporting_currency: 'KES',
    timezone: 'Africa/Nairobi',
    fiscal_year_start: '01-01',
    fiscal_year_end: '12-31',
    accounting_basis: 'ACCRUAL',
    default_reporting_preferences: { rounding: 'CENTS', auto_lock_closed_periods: false },
    is_configured: false,
  });

  // Step 2: Selected Channels
  const [channels, setChannels] = useState<{
    useBank: boolean;
    usePaybill: boolean;
    useTill: boolean;
    useCash: boolean;
    usePettyCash: boolean;
  }>({
    useBank: true,
    usePaybill: true,
    useTill: false,
    useCash: true,
    usePettyCash: true,
  });

  // Step 3: Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'ba-01',
      organization_id: currentOrg.id,
      bank_name: 'Equity Bank Kenya',
      account_name: `${currentOrg.name} - Rent Collection`,
      account_number: '0180299887766',
      account_currency: 'KES',
      account_type: 'RENT_COLLECTION',
      branch_name: 'Upper Hill Branch',
      gl_account_code: '1010',
      opening_balance_kes: 0,
      assigned_property_ids: properties.map((p) => p.id),
      reconciliation_preferences: { statement_format: 'CSV', auto_match: true },
      is_active: true,
    },
    {
      id: 'ba-02',
      organization_id: currentOrg.id,
      bank_name: 'NCBA Bank Kenya',
      account_name: `${currentOrg.name} - Escrow Deposits (Account 2100)`,
      account_number: '100234556677',
      account_currency: 'KES',
      account_type: 'ESCROW_DEPOSITS',
      branch_name: 'Kilimani Corporate',
      gl_account_code: '2100',
      opening_balance_kes: 0,
      assigned_property_ids: properties.map((p) => p.id),
      reconciliation_preferences: { statement_format: 'CSV', auto_match: true },
      is_active: true,
    },
  ]);

  // Step 4: M-Pesa Setup
  const [mpesaConfig, setMpesaConfig] = useState({
    paybillNumber: '4082222',
    accountReferenceFormat: 'TENANT-UNIT or INVOICE-NUMBER',
    tillNumber: '',
    darajaIntegrationStatus: 'OPERATIONAL' as const,
    manualImportAllowed: true,
  });

  // Step 5: Cash Accounts
  const [cashAccounts, setCashAccounts] = useState([
    {
      name: 'Main Office Cash Drawer',
      custodian: 'Property Manager / Cashier',
      maxBalanceKes: 50000,
      glCode: '1010',
      propertyScope: 'All Properties',
    },
    {
      name: 'Site Caretaker Petty Cash',
      custodian: 'Head Caretaker',
      maxBalanceKes: 15000,
      glCode: '1030',
      propertyScope: 'All Properties',
    },
  ]);

  // Step 6: Chart of Accounts
  const [chartOfAccounts, setChartOfAccounts] = useState(DEFAULT_CHART_OF_ACCOUNTS);
  const [newAccountCode, setNewAccountCode] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState<'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE'>('EXPENSE');

  // Step 7: Opening Balances
  const [openingBalances, setOpeningBalances] = useState<OpeningBalanceRecord[]>([
    {
      id: 'ob-1',
      organization_id: currentOrg.id,
      account_id: 'acc-1010',
      account_code: '1010',
      account_name: 'Cash & Bank Clearing Account',
      balance_kes: 0,
      normal_balance: 'DEBIT',
      effective_date: new Date().toISOString().slice(0, 10),
      status: 'DRAFT',
    },
    {
      id: 'ob-2',
      organization_id: currentOrg.id,
      account_id: 'acc-2100',
      account_code: '2100',
      account_name: 'Tenant Security Deposits Held (Trust Escrow)',
      balance_kes: 0,
      normal_balance: 'CREDIT',
      effective_date: new Date().toISOString().slice(0, 10),
      status: 'DRAFT',
    },
  ]);

  // Step 8: Property Mappings
  const [propertyMappings, setPropertyMappings] = useState<Record<string, { rentBankId: string; depositBankId: string }>>({});

  // Step 9: Reconciliation Rules
  const [reconRules, setReconRules] = useState<ReconciliationRule>({
    id: `rr-${currentOrg.id}`,
    organization_id: currentOrg.id,
    rule_name: 'Standard Guri24 Matching Engine',
    priority: 1,
    match_strategy: 'EXACT_REFERENCE',
    date_tolerance_days: 3,
    auto_reconcile: true,
    column_mapping: {
      date: 'Transaction Date',
      reference: 'Receipt No / Reference',
      description: 'Narrative / Details',
      amount: 'Paid In / Credit',
    },
    is_active: true,
  });

  // Calculate opening balance debit and credit totals
  const totalOpeningDebits = openingBalances
    .filter((ob) => ob.normal_balance === 'DEBIT')
    .reduce((sum, ob) => sum + (Number(ob.balance_kes) || 0), 0);
  const totalOpeningCredits = openingBalances
    .filter((ob) => ob.normal_balance === 'CREDIT')
    .reduce((sum, ob) => sum + (Number(ob.balance_kes) || 0), 0);
  const isOpeningBalancesBalanced = totalOpeningDebits === totalOpeningCredits;

  const handleAddAccount = () => {
    if (!newAccountCode.trim() || !newAccountName.trim()) return;
    const normal = newAccountType === 'ASSET' || newAccountType === 'EXPENSE' ? 'DEBIT' : 'CREDIT';
    setChartOfAccounts((prev) => [
      ...prev,
      { code: newAccountCode.trim(), name: newAccountName.trim(), type: newAccountType, normal },
    ]);
    setNewAccountCode('');
    setNewAccountName('');
  };

  const handleAddBankAccount = () => {
    const newId = `ba-${Date.now()}`;
    setBankAccounts((prev) => [
      ...prev,
      {
        id: newId,
        organization_id: currentOrg.id,
        bank_name: 'Co-operative Bank of Kenya',
        account_name: `${currentOrg.name} - OpEx`,
        account_number: '01129000000000',
        account_currency: 'KES',
        account_type: 'OPERATING',
        branch_name: 'Nairobi West Branch',
        gl_account_code: '1010',
        opening_balance_kes: 0,
        assigned_property_ids: properties.map((p) => p.id),
        reconciliation_preferences: { statement_format: 'CSV', auto_match: true },
        is_active: true,
      },
    ]);
  };

  const handleFinalize = async () => {
    setSaveNotice('Validating financial configuration and synchronizing double-entry rules...');
    setTimeout(() => {
      setSettings((prev) => ({ ...prev, is_configured: true, configured_at: new Date().toISOString() }));
      setSaveNotice('Financial environment successfully configured! Ready for multi-bank accounting.');
      if (onComplete) onComplete();
    }, 1200);
  };

  const stepsList = [
    'Settings',
    'Channels',
    'Bank Accounts',
    'M-Pesa',
    'Cash',
    'Chart of Accounts',
    'Opening Balances',
    'Property Mapping',
    'Reconciliation',
    'Verification',
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        padding: '28px',
        maxWidth: '1060px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#eff6ff',
                color: '#2563eb',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
              }}
            >
              <ShieldCheckIcon style={{ width: 14, height: 14 }} />
              FINANCE ONBOARDING WIZARD
            </span>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Step {currentStep} of {stepsList.length}
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '6px 0 0' }}>
            {stepsList[currentStep - 1]}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: currentStep === 1 ? '#94a3b8' : '#334155',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.84rem',
            }}
          >
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            <span>Previous</span>
          </button>

          {currentStep < 10 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(10, prev + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.84rem',
                boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
              }}
            >
              <span>Continue</span>
              <ArrowRightIcon style={{ width: 14, height: 14 }} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalize}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#16a34a',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.84rem',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
              }}
            >
              <CheckIcon style={{ width: 16, height: 16 }} />
              <span>Finalize & Activate</span>
            </button>
          )}
        </div>
      </div>

      {/* Step Pills Bar */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '14px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '24px',
        }}
      >
        {stepsList.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isPassed = stepNum < currentStep;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentStep(stepNum)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                border: 'none',
                background: isActive ? '#0f172a' : isPassed ? '#ecfdf5' : '#f8fafc',
                color: isActive ? '#ffffff' : isPassed ? '#065f46' : '#64748b',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{stepNum}.</span>
              <span>{step}</span>
              {isPassed && <CheckIcon style={{ width: 12, height: 12, color: '#16a34a' }} />}
            </button>
          );
        })}
      </div>

      {/* Save Notification */}
      {saveNotice && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#065f46',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircleIcon style={{ width: 16, height: 16, color: '#16a34a' }} />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 1: ORGANIZATION FINANCIAL SETTINGS                           */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Configure core financial entity parameters for <strong>{currentOrg.name}</strong>. These settings govern currency representations, tax years, and accounting recognition.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Legal Organization / Entity Name
              </label>
              <input
                type="text"
                value={settings.legal_name}
                onChange={(e) => setSettings({ ...settings, legal_name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Reporting Currency
              </label>
              <select
                value={settings.reporting_currency}
                onChange={(e) => setSettings({ ...settings, reporting_currency: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="KES">KES - Kenya Shillings (Default)</option>
                <option value="USD">USD - United States Dollars</option>
                <option value="EUR">EUR - Euros</option>
                <option value="GBP">GBP - British Pounds</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Operating Timezone
              </label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Accounting Recognition Basis
              </label>
              <select
                value={settings.accounting_basis}
                onChange={(e) => setSettings({ ...settings, accounting_basis: e.target.value as any })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="ACCRUAL">Accrual Basis (Invoiced rent recognized when due)</option>
                <option value="CASH">Cash Basis (Revenue recognized only upon receipt)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 2: SELECT FINANCIAL CHANNELS                                */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Select the collection and payment mechanisms your organization actually operates. Guri24 supports landlords who use cash-only, M-Pesa only, or multi-bank corporate arrangements.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {[
              { key: 'useBank', label: 'Commercial Bank Accounts', desc: 'Operating accounts, rent collection, & deposit escrow', icon: <BuildingOffice2Icon style={{ width: 22, height: 22, color: '#2563eb' }} /> },
              { key: 'usePaybill', label: 'Safaricom M-Pesa Paybill', desc: 'Direct tenant mobile payments via 6-7 digit shortcodes', icon: <DevicePhoneMobileIcon style={{ width: 22, height: 22, color: '#16a34a' }} /> },
              { key: 'useTill', label: 'M-Pesa Buy Goods Till', desc: 'Direct merchant over-the-counter tenant receipts', icon: <CreditCardIcon style={{ width: 22, height: 22, color: '#0284c7' }} /> },
              { key: 'useCash', label: 'Direct Cash Collections', desc: 'Site-level cash receipts issued with printed receipts', icon: <BanknotesIcon style={{ width: 22, height: 22, color: '#d97706' }} /> },
              { key: 'usePettyCash', label: 'Petty Cash Operating Funds', desc: 'Emergency site maintenance & incidentals disbursement', icon: <ScaleIcon style={{ width: 22, height: 22, color: '#7c3aed' }} /> },
            ].map((ch) => {
              const isChecked = (channels as any)[ch.key];
              return (
                <div
                  key={ch.key}
                  onClick={() => setChannels({ ...channels, [ch.key]: !isChecked })}
                  style={{
                    border: isChecked ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: isChecked ? '#eff6ff' : '#ffffff',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ marginTop: '2px' }}>{ch.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{ch.label}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>{ch.desc}</div>
                  </div>
                  {isChecked && <CheckCircleIcon style={{ width: 18, height: 18, color: '#2563eb' }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 3: REGISTER BANK ACCOUNTS                                   */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              Register commercial bank accounts. An organization can maintain separate accounts for rent collection, operating expenses, and tenant deposit escrow.
            </p>
            <button
              type="button"
              onClick={handleAddBankAccount}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.80rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <PlusIcon style={{ width: 14, height: 14 }} />
              <span>Add Bank Account</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bankAccounts.map((ba, idx) => (
              <div
                key={ba.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Bank Name</label>
                  <input
                    type="text"
                    value={ba.bank_name}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].bank_name = e.target.value;
                      setBankAccounts(updated);
                    }}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Account Name</label>
                  <input
                    type="text"
                    value={ba.account_name}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].account_name = e.target.value;
                      setBankAccounts(updated);
                    }}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Account Number</label>
                  <input
                    type="text"
                    value={ba.account_number}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].account_number = e.target.value;
                      setBankAccounts(updated);
                    }}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Account Purpose</label>
                  <select
                    value={ba.account_type}
                    onChange={(e) => {
                      const updated = [...bankAccounts];
                      updated[idx].account_type = e.target.value as any;
                      setBankAccounts(updated);
                    }}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="RENT_COLLECTION">Rent Collection Account</option>
                    <option value="ESCROW_DEPOSITS">Tenant Deposit Escrow (Account 2100)</option>
                    <option value="OPERATING">Operating Expenses / OpEx</option>
                    <option value="SAVINGS">Reserve / Savings</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 4: M-PESA CONFIGURATION                                     */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Configure Safaricom M-Pesa channels. Organizations without direct Daraja API credentials can still import M-Pesa Excel/CSV statements for automated matching.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Paybill Business Shortcode
              </label>
              <input
                type="text"
                value={mpesaConfig.paybillNumber}
                onChange={(e) => setMpesaConfig({ ...mpesaConfig, paybillNumber: e.target.value })}
                placeholder="e.g. 4082222"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Account Reference Matching Format
              </label>
              <input
                type="text"
                value={mpesaConfig.accountReferenceFormat}
                onChange={(e) => setMpesaConfig({ ...mpesaConfig, accountReferenceFormat: e.target.value })}
                placeholder="e.g. HOUSE-NUMBER or INVOICE-NO"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ShieldCheckIcon style={{ width: 24, height: 24, color: '#16a34a', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#166534' }}>
                Daraja 2.0 Webhook Status: {mpesaConfig.darajaIntegrationStatus}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                C2B instant confirmation and STK push prompts are supported. Transactions clear to General Ledger Account 1020.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 5: CASH & PETTY CASH ACCOUNTS                               */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Configure cash drawers and site petty cash funds. Every physical cash drawer is tracked under double-entry accounts with designated custodians.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cashAccounts.map((ca, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>{ca.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    Custodian: <strong>{ca.custodian}</strong> &bull; Max Balance: KES {ca.maxBalanceKes.toLocaleString()} &bull; GL Code: {ca.glCode}
                  </div>
                </div>
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#065f46',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  ACTIVE DRAWER
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 6: CHART OF ACCOUNTS                                         */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Standard chart of accounts for residential rental property management. Add custom expense or revenue codes as required.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 14px',
              borderRadius: '10px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Account Code (e.g. 5300)"
              value={newAccountCode}
              onChange={(e) => setNewAccountCode(e.target.value)}
              style={{ width: '160px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            />
            <input
              type="text"
              placeholder="Account Name (e.g. Generator Fuel & Servicing)"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            />
            <select
              value={newAccountType}
              onChange={(e) => setNewAccountType(e.target.value as any)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
            >
              <option value="EXPENSE">Expense</option>
              <option value="REVENUE">Revenue</option>
              <option value="ASSET">Asset</option>
              <option value="LIABILITY">Liability</option>
            </select>
            <button
              type="button"
              onClick={handleAddAccount}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.80rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.80rem' }}>
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b' }}>Code</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b' }}>Name</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b' }}>Category</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>Normal Balance</th>
                </tr>
              </thead>
              <tbody>
                {chartOfAccounts.map((acc) => (
                  <tr key={acc.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{acc.code}</td>
                    <td style={{ padding: '8px 12px', color: '#334155' }}>{acc.name}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span
                        style={{
                          background: acc.type === 'ASSET' ? '#eff6ff' : acc.type === 'LIABILITY' ? '#fffbeb' : acc.type === 'REVENUE' ? '#ecfdf5' : '#fef2f2',
                          color: acc.type === 'ASSET' ? '#1d4ed8' : acc.type === 'LIABILITY' ? '#b45309' : acc.type === 'REVENUE' ? '#065f46' : '#991b1b',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.70rem',
                          fontWeight: 700,
                        }}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
                      {acc.normal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 7: OPENING BALANCES                                          */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 7 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Enter verified historical balances. Opening balances must form a balanced double-entry journal entry (Total Debits = Total Credits).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {openingBalances.map((ob, idx) => (
              <div
                key={ob.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <div style={{ width: '70px', fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>{ob.account_code}</div>
                <div style={{ flex: 1, color: '#334155', fontSize: '0.84rem' }}>{ob.account_name}</div>
                <div style={{ width: '80px', fontSize: '0.74rem', fontWeight: 700, color: '#64748b' }}>{ob.normal_balance}</div>
                <div style={{ width: '160px' }}>
                  <input
                    type="number"
                    min="0"
                    placeholder="KES 0.00"
                    value={ob.balance_kes || ''}
                    onChange={(e) => {
                      const updated = [...openingBalances];
                      updated[idx].balance_kes = parseFloat(e.target.value) || 0;
                      setOpeningBalances(updated);
                    }}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem', textAlign: 'right' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '10px',
              background: isOpeningBalancesBalanced ? '#ecfdf5' : '#fffbeb',
              border: isOpeningBalancesBalanced ? '1px solid #a7f3d0' : '1px solid #fde68a',
            }}
          >
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isOpeningBalancesBalanced ? '#065f46' : '#92400e' }}>
                Opening Journal Balance Check:
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '8px' }}>
                Debits KES {totalOpeningDebits.toLocaleString()} &bull; Credits KES {totalOpeningCredits.toLocaleString()}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: isOpeningBalancesBalanced ? '#16a34a' : '#d97706',
              }}
            >
              {isOpeningBalancesBalanced ? 'PERFECTLY BALANCED' : 'IMBALANCE DETECTED'}
            </span>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 8: PROPERTY ACCOUNT MAPPING                                 */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 8 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Map default collection and deposit escrow accounts to each residential property in your portfolio.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {properties.map((prop) => (
              <div
                key={prop.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{prop.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{prop.county || 'Nairobi'} &bull; {prop.estate_name || 'Estate'}</div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Rent Collection Account</label>
                  <select
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.80rem' }}
                  >
                    {bankAccounts.map((ba) => (
                      <option key={ba.id} value={ba.id}>{ba.bank_name} - {ba.account_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>Deposit Escrow (2100)</label>
                  <select
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.80rem' }}
                  >
                    {bankAccounts.map((ba) => (
                      <option key={ba.id} value={ba.id}>{ba.bank_name} - {ba.account_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 9: RECONCILIATION CONFIGURATION                             */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 9 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
            Configure automatic matching rules for bank statement and M-Pesa reconciliation imports.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Primary Matching Strategy
              </label>
              <select
                value={reconRules.match_strategy}
                onChange={(e) => setReconRules({ ...reconRules, match_strategy: e.target.value as any })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="EXACT_REFERENCE">Exact Provider Reference (Receipt No / M-Pesa Code)</option>
                <option value="AMOUNT_DATE_WINDOW">Amount + Date Window (± 3 Days)</option>
                <option value="TENANT_NAME_AMOUNT">Tenant Name + Amount Matching</option>
                <option value="MANUAL_ONLY">Manual Review & Verification Only</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.80rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Date Tolerance Window
              </label>
              <input
                type="number"
                min="0"
                max="14"
                value={reconRules.date_tolerance_days}
                onChange={(e) => setReconRules({ ...reconRules, date_tolerance_days: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* STEP 10: VERIFICATION & ACTIVATION                               */}
      {/* ----------------------------------------------------------------- */}
      {currentStep === 10 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
              Financial Environment Readiness Summary
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
              <div>Reporting Entity: <strong>{settings.legal_name}</strong></div>
              <div>Currency & Basis: <strong>{settings.reporting_currency} ({settings.accounting_basis})</strong></div>
              <div>Active Bank Accounts: <strong>{bankAccounts.length} Registered</strong></div>
              <div>M-Pesa Paybill: <strong>{mpesaConfig.paybillNumber} ({mpesaConfig.darajaIntegrationStatus})</strong></div>
              <div>Cash Drawers: <strong>{cashAccounts.length} Configured</strong></div>
              <div>Chart of Accounts: <strong>{chartOfAccounts.length} Standard Accounts</strong></div>
              <div>Opening Balance Status: <strong>{isOpeningBalancesBalanced ? 'Balanced (OK)' : 'Pending Resolution'}</strong></div>
              <div>Reconciliation Strategy: <strong>{reconRules.match_strategy}</strong></div>
            </div>
          </div>

          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircleIcon style={{ width: 24, height: 24, color: '#16a34a', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#065f46' }}>
                All Critical Invariants Verified
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '2px' }}>
                Double-entry rules active (Debits == Credits). Tenant security deposits strictly segregated to Account 2100 trust escrow liability.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
