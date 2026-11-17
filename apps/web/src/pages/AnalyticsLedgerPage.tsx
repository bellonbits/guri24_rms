import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { AnalyticsLedgerWorkspace, AnalyticsWorkspaceTab, StatementSubTab } from '../components/AnalyticsLedgerWorkspace';
import { TopKpiRow } from '../components/TopKpiRow';

export const AnalyticsLedgerPage: React.FC = () => {
  const { currentOrg, currentUserRole } = useAuth();
  const { state, setState } = useRms();
  const location = useLocation();

  const { targetTab, statementSubTab } = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/general-ledger')) {
      return { targetTab: 'ledger' as AnalyticsWorkspaceTab, statementSubTab: 'pnl' as StatementSubTab };
    }
    if (path.includes('/trial-balance')) {
      return { targetTab: 'statements' as AnalyticsWorkspaceTab, statementSubTab: 'trial_balance' as StatementSubTab };
    }
    if (path.includes('/financial-statements')) {
      return { targetTab: 'statements' as AnalyticsWorkspaceTab, statementSubTab: 'pnl' as StatementSubTab };
    }
    return { targetTab: 'overview' as AnalyticsWorkspaceTab, statementSubTab: 'pnl' as StatementSubTab };
  }, [location.pathname]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TopKpiRow />
      <AnalyticsLedgerWorkspace
        currentOrg={currentOrg}
        userRole={currentUserRole || 'ACCOUNTANT'}
        properties={state?.properties || []}
        tenants={state?.tenants || []}
        leases={state?.leases || []}
        units={state?.units || []}
        invoices={state?.invoices || []}
        payments={state?.payments || []}
        expenses={state?.expenses || []}
        journals={state?.journals || state?.journalEntries || []}
        deposits={state?.deposits || state?.securityDeposits || []}
        maintenance={state?.maintenance || state?.maintenanceRequests || []}
        initialTab={targetTab}
        initialStatementSubTab={statementSubTab}
        onReverseJournal={(journal) => {
          const revId = `rev-${Date.now()}`;
          const reversedLines = journal.lines.map((l) => ({
            ...l,
            id: `revl-${Date.now()}-${Math.random()}`,
            entry_type: (l.entry_type === 'DEBIT' ? 'CREDIT' : 'DEBIT') as any,
            description: `REVERSAL: ${l.description}`,
          }));

          const reversalEntry = {
            ...journal,
            id: revId,
            reference: `REV-${journal.reference || journal.id}`,
            description: `Authorized reversal of ${journal.description}`,
            is_reversal: true,
            reversal_of_id: journal.id,
            lines: reversedLines,
            posted_at: new Date().toISOString(),
          };

          setState((prev) => ({
            ...prev,
            journalEntries: [reversalEntry, ...prev.journalEntries],
          }));
        }}
      />
    </div>
  );
};
