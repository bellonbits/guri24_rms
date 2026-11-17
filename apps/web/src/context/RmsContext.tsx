import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Property,
  Building,
  Floor,
  Unit,
  Tenant,
  Lease,
  Invoice,
  Payment,
  PropertyExpense,
  MaintenanceRequest,
  Vendor,
  InspectionRecord,
  DocumentItem,
  OcrJobRecord,
  IntegrationStatusItem,
  SubscriptionSummary,
  RmsPlatformState,
  SecurityDepositLedger,
  AssistantConversation,
  AssistantActionConfirmation,
  Account,
  TrialBalanceReport,
  ProfitAndLossReport,
  BalanceSheetReport,
  CashFlowStatement,
  ExecutiveFinancialOverview,
  IncomeCollectionsSummary,
  ArrearsAgingReport,
  DepositLiabilitiesReport,
  PropertyPerformanceSummary,
  TenantAnalyticsReport,
  MaintenanceCostAnalysis,
  ReconciliationBatch,
  ReconciliationException,
  FinancialReportRun,
  FinancialAuditEvent,
  SystemRole,
} from '../types';
import { useAuth } from './AuthContext';
import { apiClient } from '../lib/apiClient';
import {
  createInitialRmsState,
  sanitizeWorkspaceState,
  generateIdempotentInvoice,
  processVerifiedMpesaPayment,
  submitOcrDocumentJob,
  reviewOcrDocumentJob,
  sendAssistantPrompt,
  resolveAssistantConfirmation,
} from '../lib/api';
import { ImportModuleKey } from '../lib/importEngine';

interface RmsContextType {
  state: RmsPlatformState;
  setState: React.Dispatch<React.SetStateAction<RmsPlatformState>>;
  isLoading: boolean;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  loadWorkspaceSnapshot: () => Promise<void>;
  
  // Global Modals State & Handlers
  importWizardModule: ImportModuleKey | null;
  setImportWizardModule: (mod: ImportModuleKey | null) => void;
  bulkGridModule: ImportModuleKey | null;
  setBulkGridModule: (mod: ImportModuleKey | null) => void;
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  isSwitcherModalOpen: boolean;
  setIsSwitcherModalOpen: (open: boolean) => void;
  isMpesaModalOpen: boolean;
  setIsMpesaModalOpen: (open: boolean) => void;
  
  // Common Domain Actions
  createInvoice: (cmd: { leaseId: string; billingMonth: string; amountKes: number }) => void;
  recordPayment: (payment: Payment) => void;
  createMaintenanceTicket: (req: MaintenanceRequest) => void;
  updateMaintenanceStatus: (ticketId: string, status: any) => void;
}

const RmsContext = createContext<RmsContextType | undefined>(undefined);

export const RmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUserSession, currentOrg } = useAuth();
  const [state, setState] = useState<RmsPlatformState>(() => createInitialRmsState());
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Modals
  const [importWizardModule, setImportWizardModule] = useState<ImportModuleKey | null>(null);
  const [bulkGridModule, setBulkGridModule] = useState<ImportModuleKey | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);

  const announce = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  const loadWorkspaceSnapshot = useCallback(async () => {
    setIsLoading(true);
    try {
      const [integrationsRes, snapshotRes] = await Promise.allSettled([
        apiClient.getIntegrationsStatus(),
        apiClient.getWorkspaceSnapshot(),
      ]);

      const liveIntegrations = integrationsRes.status === 'fulfilled' ? integrationsRes.value : [];
      const snapshot = snapshotRes.status === 'fulfilled' ? snapshotRes.value : null;

      if (snapshot && snapshot.organizations && snapshot.organizations.length > 0) {
        const sanitized = sanitizeWorkspaceState(snapshot);
        setState((prev) => ({
          ...prev,
          ...sanitized,
          currentOrganizationId:
            currentUserSession?.organizationId || sanitized.currentOrganizationId || prev.currentOrganizationId,
          integrationsStatus:
            liveIntegrations.length > 0 ? liveIntegrations : sanitized.integrationsStatus || [],
        }));
        apiClient.saveWorkspaceSnapshot(sanitized).catch(() => {});
      } else {
        const [propsRes, unitsRes, leasesRes, invsRes, paysRes] = await Promise.allSettled([
          apiClient.getProperties(),
          apiClient.getUnits(),
          apiClient.getLeases(),
          apiClient.getInvoices(),
          apiClient.getPayments(),
        ]);

        const liveProps = propsRes.status === 'fulfilled' ? propsRes.value : [];
        const liveUnits = unitsRes.status === 'fulfilled' ? unitsRes.value : [];
        const liveLeases = leasesRes.status === 'fulfilled' ? leasesRes.value : [];
        const liveInvs = invsRes.status === 'fulfilled' ? invsRes.value : [];
        const livePays = paysRes.status === 'fulfilled' ? paysRes.value : [];

        setState((prev) => ({
          ...prev,
          currentOrganizationId: currentUserSession?.organizationId || currentOrg.id,
          properties: liveProps.length > 0 ? liveProps : prev.properties,
          units: liveUnits.length > 0 ? liveUnits : prev.units,
          leases: liveLeases.length > 0 ? liveLeases : prev.leases,
          invoices: liveInvs.length > 0 ? liveInvs : prev.invoices,
          payments: livePays.length > 0 ? livePays : prev.payments,
          integrationsStatus: liveIntegrations,
        }));
      }
    } catch (err) {
      console.warn('Backend snapshot fetch:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserSession, currentOrg]);

  useEffect(() => {
    if (currentUserSession?.token) {
      loadWorkspaceSnapshot();
    }
  }, [currentUserSession?.token, loadWorkspaceSnapshot]);

  const createInvoice = useCallback(
    (cmd: { leaseId: string; billingMonth: string; amountKes: number }) => {
      const targetLease = state.leases.find((l) => l.id === cmd.leaseId);
      if (!targetLease) return;
      const inv = generateIdempotentInvoice(
        state,
        cmd.leaseId,
        targetLease.unit_id,
        targetLease.tenant_id,
        cmd.billingMonth,
        cmd.amountKes
      );
      setState((prev) => ({
        ...prev,
        invoices: [...prev.invoices, inv],
      }));
      announce(`Invoice ${inv.invoice_number} created successfully.`);
    },
    [state, announce]
  );

  const recordPayment = useCallback(
    (payment: Payment) => {
      setState((prev) => ({
        ...prev,
        payments: [payment, ...prev.payments],
      }));
      announce(`Payment ${payment.transaction_reference} recorded.`);
    },
    [announce]
  );

  const createMaintenanceTicket = useCallback(
    (req: MaintenanceRequest) => {
      setState((prev) => ({
        ...prev,
        maintenanceRequests: [req, ...prev.maintenanceRequests],
      }));
      announce(`Maintenance request #${req.ticket_number || req.id.slice(0, 8)} logged.`);
    },
    [announce]
  );

  const updateMaintenanceStatus = useCallback(
    (ticketId: string, status: any) => {
      setState((prev) => ({
        ...prev,
        maintenanceRequests: prev.maintenanceRequests.map((r) =>
          r.id === ticketId ? { ...r, status, updated_at: new Date().toISOString() } : r
        ),
      }));
      announce(`Ticket status updated to ${status}.`);
    },
    [announce]
  );

  const value = useMemo(
    () => ({
      state,
      setState,
      isLoading,
      toastMessage,
      setToastMessage,
      loadWorkspaceSnapshot,
      importWizardModule,
      setImportWizardModule,
      bulkGridModule,
      setBulkGridModule,
      isScannerOpen,
      setIsScannerOpen,
      isSwitcherModalOpen,
      setIsSwitcherModalOpen,
      isMpesaModalOpen,
      setIsMpesaModalOpen,
      createInvoice,
      recordPayment,
      createMaintenanceTicket,
      updateMaintenanceStatus,
    }),
    [
      state,
      isLoading,
      toastMessage,
      loadWorkspaceSnapshot,
      importWizardModule,
      bulkGridModule,
      isScannerOpen,
      isSwitcherModalOpen,
      isMpesaModalOpen,
      createInvoice,
      recordPayment,
      createMaintenanceTicket,
      updateMaintenanceStatus,
    ]
  );

  return <RmsContext.Provider value={value}>{children}</RmsContext.Provider>;
};

export const useRms = () => {
  const context = useContext(RmsContext);
  if (!context) {
    throw new Error('useRms must be used within an RmsProvider');
  }
  return context;
};
