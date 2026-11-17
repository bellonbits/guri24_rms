/**
 * GURI24 RMS - Real Backend API Client
 * Communicates directly with the Rust backend running on Axum + Supabase PostgreSQL.
 * No mock data.
 */

import type {
  Organization,
  Property,
  Building,
  Floor,
  Unit,
  Tenant,
  Lease,
  Invoice,
  Payment,
  JournalEntry,
  PropertyExpense,
  MaintenanceRequest,
  Vendor,
  InspectionRecord,
  DocumentItem,
  OcrJobRecord,
  IntegrationStatusItem,
  SubscriptionSummary,
  RmsPlatformState,
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
  Invitation,
  ManagedStaffMember,
  PlatformOrganization,
  AccessAuditLog,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || '/api/v1';

class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('guri24_token');
      this.refreshToken = localStorage.getItem('guri24_refresh_token');
    }
  }

  public setToken(token: string, refreshToken?: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('guri24_token', token);
      if (refreshToken) {
        this.refreshToken = refreshToken;
        localStorage.setItem('guri24_refresh_token', refreshToken);
      }
    }
  }

  public clearToken() {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guri24_token');
      localStorage.removeItem('guri24_refresh_token');
      localStorage.removeItem('guri24_rms_auth_session');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      // If 401 Unauthorized, attempt auto-refresh using refresh_token once
      if (response.status === 401 && !isRetry && this.refreshToken && !this.isRefreshing && !path.includes('/auth/')) {
        this.isRefreshing = true;
        try {
          const refreshUrl = `${API_BASE_URL.replace(/\/$/, '')}/auth/refresh`;
          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this.refreshToken }),
          });
          if (refreshRes.ok) {
            const authData = await refreshRes.json();
            if (authData.access_token) {
              this.setToken(authData.access_token, authData.refresh_token);
              if (typeof window !== 'undefined') {
                try {
                  const stored = localStorage.getItem('guri24_rms_auth_session');
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    parsed.token = authData.access_token;
                    localStorage.setItem('guri24_rms_auth_session', JSON.stringify(parsed));
                  }
                } catch {}
              }
              this.isRefreshing = false;
              return this.request<T>(path, options, true);
            }
          }
        } catch {
          // Refresh failed
        } finally {
          this.isRefreshing = false;
        }

        this.clearToken();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('guri24_auth_expired', { detail: { path } }));
        }
      }

      let errorMessage = `API error ${response.status}: ${response.statusText}`;
      try {
        const text = await response.text();
        try {
          const errorJson = JSON.parse(text);
          if (errorJson && typeof errorJson === 'object') {
            if (errorJson.message) {
              errorMessage = errorJson.code
                ? `[${errorJson.code}] ${errorJson.message}`
                : String(errorJson.message);
            } else if (errorJson.error) {
              errorMessage = String(errorJson.error);
            }
          }
        } catch {
          if (text && text.trim().length > 0) {
            errorMessage = text.trim();
          }
        }
      } catch {
        // Fallback to initial statusText
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // System & Health
  async getHealth(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/health');
  }

  async getIntegrationsStatus(): Promise<IntegrationStatusItem[]> {
    return this.request('/integrations/status');
  }

  // Workspace snapshot persistence (Supabase PostgreSQL)
  async getWorkspaceSnapshot(): Promise<Partial<RmsPlatformState> | null> {
    try {
      const data = await this.request<any>('/workspace/snapshot');
      if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
        return data as Partial<RmsPlatformState>;
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveWorkspaceSnapshot(snapshot: Partial<RmsPlatformState>): Promise<void> {
    await this.request('/workspace/snapshot', {
      method: 'POST',
      body: JSON.stringify(snapshot),
    });
  }

  // Auth & Identity
  async sendOtp(cmd: {
    target: string;
    channel: 'email' | 'sms';
    purpose?: string;
  }): Promise<{ status: string; target: string; channel: string; expires_in_seconds: number }> {
    return this.request('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async verifyOtp(cmd: {
    target: string;
    code: string;
  }): Promise<{ verified: boolean; target: string }> {
    return this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async register(cmd: {
    organization_name: string;
    organization_type: string;
    county: string;
    kra_pin?: string;
    admin_full_name: string;
    admin_email: string;
    admin_phone: string;
    admin_password: string;
  }): Promise<{ access_token: string; refresh_token: string; user: any; organization: Organization }> {
    const res = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async login(cmd: {
    email: string;
    password: string;
    organization_id?: string;
  }): Promise<{ access_token: string; refresh_token: string; user: any; organization: Organization }> {
    const res = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async resetPassword(cmd: {
    email: string;
    otp_code: string;
    new_password: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // Current Organization & Settings
  async getCurrentOrganization(): Promise<Organization> {
    return this.request('/organizations/current');
  }

  async getOrganizationSettings(): Promise<any> {
    return this.request('/organizations/settings');
  }

  async updateOrganizationSettings(settings: any): Promise<any> {
    return this.request('/organizations/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }

  async getCurrentSubscription(): Promise<SubscriptionSummary> {
    return this.request('/subscriptions/current');
  }

  // Properties, Buildings, Floors & Units
  async getProperties(): Promise<Property[]> {
    const res = await this.request<{ items: Property[] } | Property[]>('/properties');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createProperty(cmd: any): Promise<Property> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getBuildings(): Promise<Building[]> {
    const res = await this.request<{ items: Building[] } | Building[]>('/buildings');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createBuilding(cmd: any): Promise<Building> {
    return this.request('/buildings', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getFloors(): Promise<Floor[]> {
    const res = await this.request<{ items: Floor[] } | Floor[]>('/floors');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createFloor(cmd: any): Promise<Floor> {
    return this.request('/floors', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getUnits(): Promise<Unit[]> {
    const res = await this.request<{ items: Unit[] } | Unit[]>('/units');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createUnit(cmd: any): Promise<Unit> {
    return this.request('/units', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // Tenants & Leases
  async getTenants(): Promise<Tenant[]> {
    const res = await this.request<{ items: Tenant[] } | Tenant[]>('/tenants');
    return Array.isArray(res) ? res : res.items || [];
  }

  async registerTenant(cmd: any): Promise<Tenant> {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getLeases(): Promise<Lease[]> {
    const res = await this.request<{ items: Lease[] } | Lease[]>('/leases');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createLease(cmd: any): Promise<Lease> {
    return this.request('/leases', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async activateLease(id: string): Promise<Lease> {
    return this.request(`/leases/${id}/activate`, { method: 'POST' });
  }

  // Invoices & Billing
  async getInvoices(): Promise<Invoice[]> {
    const res = await this.request<{ items: Invoice[] } | Invoice[]>('/invoices');
    return Array.isArray(res) ? res : res.items || [];
  }

  async generateInvoice(cmd: any): Promise<Invoice> {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // Payments & M-Pesa Daraja
  async getPayments(): Promise<Payment[]> {
    const res = await this.request<{ items: Payment[] } | Payment[]>('/payments');
    return Array.isArray(res) ? res : res.items || [];
  }

  async initiateMpesaPayment(cmd: {
    lease_id: string;
    tenant_id: string;
    amount_kes: number;
    phone_number: string;
    account_reference: string;
    idempotency_key: string;
  }): Promise<Payment> {
    return this.request('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async postMpesaCallback(cmd: any): Promise<Payment> {
    return this.request('/payments/mpesa/callback', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // Accounting & Expenses
  async getJournals(): Promise<JournalEntry[]> {
    const res = await this.request<{ items: JournalEntry[] } | JournalEntry[]>('/accounting/journals');
    return Array.isArray(res) ? res : res.items || [];
  }

  async getExpenses(): Promise<PropertyExpense[]> {
    const res = await this.request<{ items: PropertyExpense[] } | PropertyExpense[]>('/accounting/expenses');
    return Array.isArray(res) ? res : res.items || [];
  }

  async recordExpense(cmd: any): Promise<PropertyExpense> {
    return this.request('/accounting/expenses', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // Maintenance & Vendors
  async getMaintenance(): Promise<MaintenanceRequest[]> {
    const res = await this.request<{ items: MaintenanceRequest[] } | MaintenanceRequest[]>('/maintenance');
    return Array.isArray(res) ? res : res.items || [];
  }

  async createMaintenance(cmd: any): Promise<MaintenanceRequest> {
    return this.request('/maintenance', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getVendors(): Promise<Vendor[]> {
    const res = await this.request<{ items: Vendor[] } | Vendor[]>('/vendors');
    return Array.isArray(res) ? res : res.items || [];
  }

  async getInspections(): Promise<InspectionRecord[]> {
    const res = await this.request<{ items: InspectionRecord[] } | InspectionRecord[]>('/inspections');
    return Array.isArray(res) ? res : res.items || [];
  }

  // Documents & OCR
  async getDocuments(): Promise<DocumentItem[]> {
    const res = await this.request<{ items: DocumentItem[] } | DocumentItem[]>('/documents');
    return Array.isArray(res) ? res : res.items || [];
  }

  async getOcrJobs(): Promise<OcrJobRecord[]> {
    const res = await this.request<{ items: OcrJobRecord[] } | OcrJobRecord[]>('/ocr/jobs');
    return Array.isArray(res) ? res : res.items || [];
  }

  async getOcrJob(id: string): Promise<OcrJobRecord> {
    return this.request(`/ocr/jobs/${id}`);
  }

  async submitOcrJob(data: any): Promise<OcrJobRecord> {
    return this.request('/ocr/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async retryOcrJob(id: string): Promise<OcrJobRecord> {
    return this.request(`/ocr/jobs/${id}/retry`, {
      method: 'POST',
    });
  }

  async reviewOcrJob(id: string, cmd: any): Promise<OcrJobRecord> {
    return this.request(`/ocr/jobs/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  // AI Assistant (Groq openai/gpt-oss-120b & qwen/qwen3.8-27b)
  async askAssistant(message: string, conversationId?: string): Promise<{ reply?: string; content?: string; citations?: any[]; tool_calls?: any[] }> {
    const isUuid = !!conversationId && conversationId.length === 36 && conversationId.includes('-');
    return this.request('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: message,
        message,
        conversation_id: isUuid ? conversationId : undefined,
      }),
    });
  }

  // Portfolio Report
  async getPortfolioSummary(): Promise<any> {
    return this.request('/reports/summary');
  }

  // Unified Bulk Import & Data Acquisition
  async getImportTemplate(module: string): Promise<any> {
    return this.request(`/import/templates/${module}`);
  }

  async validateImport(cmd: {
    module: string;
    raw_csv?: string;
    rows?: Record<string, any>[];
    column_mapping?: Record<string, string>;
  }): Promise<any> {
    return this.request('/import/validate', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async commitImport(cmd: {
    module: string;
    rows: Record<string, any>[];
    conflict_strategy?: 'SKIP_DUPLICATES' | 'UPDATE_EXISTING' | 'ABORT_ON_ERROR';
    file_name?: string;
  }): Promise<any> {
    return this.request('/import/commit', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getImportHistory(): Promise<any[]> {
    const res = await this.request<any[]>('/import/history');
    return Array.isArray(res) ? res : [];
  }

  async getImportJob(jobId: string): Promise<any> {
    return this.request(`/import/jobs/${jobId}`);
  }

  async exportImportErrors(errors: any[]): Promise<string> {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/import/export-errors`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
      body: JSON.stringify({ errors }),
    });
    return res.text();
  }

  // Centralized Automated Email Notifications
  async getNotificationSettings(): Promise<NotificationSettings> {
    return this.request<NotificationSettings>('/notifications/settings');
  }

  async updateNotificationSettings(cmd: Partial<NotificationSettings>): Promise<NotificationSettings> {
    return this.request<NotificationSettings>('/notifications/settings', {
      method: 'PATCH',
      body: JSON.stringify(cmd),
    });
  }

  async getNotificationDeliveries(): Promise<NotificationDelivery[]> {
    const res = await this.request<NotificationDelivery[]>('/notifications/deliveries');
    return Array.isArray(res) ? res : [];
  }

  async retryNotificationDelivery(id: string): Promise<NotificationDelivery> {
    return this.request<NotificationDelivery>(`/notifications/deliveries/${id}/retry`, {
      method: 'POST',
    });
  }

  async sendTestNotification(cmd: { recipient_email: string; template_key: string }): Promise<NotificationDelivery> {
    return this.request<NotificationDelivery>('/notifications/test', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getNotificationTemplates(): Promise<NotificationTemplateSummary[]> {
    const res = await this.request<NotificationTemplateSummary[]>('/notifications/templates');
    return Array.isArray(res) ? res : [];
  }

  // --- Analytics & Ledger Workspace Methods ---
  async getFinancialOverview(params?: { property_id?: string; start_date?: string; end_date?: string }): Promise<ExecutiveFinancialOverview> {
    const q = new URLSearchParams();
    if (params?.property_id) q.set('property_id', params.property_id);
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<ExecutiveFinancialOverview>(`/analytics/overview${qs}`);
  }

  async getIncomeCollections(): Promise<IncomeCollectionsSummary> {
    return this.request<IncomeCollectionsSummary>('/analytics/collections');
  }

  async getArrearsAging(params?: { as_of?: string }): Promise<ArrearsAgingReport> {
    const qs = params?.as_of ? `?as_of=${params.as_of}` : '';
    return this.request<ArrearsAgingReport>(`/analytics/arrears${qs}`);
  }

  async getPropertyPerformance(): Promise<PropertyPerformanceSummary[]> {
    return this.request<PropertyPerformanceSummary[]>('/analytics/properties');
  }

  async getTenantAnalytics(): Promise<TenantAnalyticsReport> {
    return this.request<TenantAnalyticsReport>('/analytics/tenants');
  }

  async getMaintenanceAnalytics(): Promise<MaintenanceCostAnalysis> {
    return this.request<MaintenanceCostAnalysis>('/analytics/maintenance');
  }

  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>('/ledger/accounts');
  }

  async reverseJournal(id: string, reason: string): Promise<JournalEntry> {
    return this.request<JournalEntry>(`/ledger/journals/${id}/reverse`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getTrialBalance(params?: { as_of?: string }): Promise<TrialBalanceReport> {
    const qs = params?.as_of ? `?as_of=${params.as_of}` : '';
    return this.request<TrialBalanceReport>(`/ledger/trial-balance${qs}`);
  }

  async getProfitLoss(params?: { start_date?: string; end_date?: string }): Promise<ProfitAndLossReport> {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<ProfitAndLossReport>(`/ledger/profit-loss${qs}`);
  }

  async getBalanceSheet(params?: { as_of?: string }): Promise<BalanceSheetReport> {
    const qs = params?.as_of ? `?as_of=${params.as_of}` : '';
    return this.request<BalanceSheetReport>(`/ledger/balance-sheet${qs}`);
  }

  async getCashFlow(params?: { start_date?: string; end_date?: string }): Promise<CashFlowStatement> {
    const q = new URLSearchParams();
    if (params?.start_date) q.set('start_date', params.start_date);
    if (params?.end_date) q.set('end_date', params.end_date);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return this.request<CashFlowStatement>(`/ledger/cash-flow${qs}`);
  }

  async getReconciliationBatches(): Promise<ReconciliationBatch[]> {
    return this.request<ReconciliationBatch[]>('/reconciliation/batches');
  }

  async importReconciliationStatement(cmd: { source: string; file_name: string; rows: any[] }): Promise<ReconciliationBatch> {
    return this.request<ReconciliationBatch>('/reconciliation/import', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getReconciliationExceptions(): Promise<ReconciliationException[]> {
    return this.request<ReconciliationException[]>('/reconciliation/exceptions');
  }

  async matchReconciliationTransaction(cmd: { statement_transaction_id: string; matched_entity_id: string }): Promise<void> {
    return this.request<void>('/reconciliation/match', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async resolveReconciliationException(id: string, cmd: { action: string }): Promise<void> {
    return this.request<void>(`/reconciliation/exceptions/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getDepositLiabilities(): Promise<DepositLiabilitiesReport> {
    return this.request<DepositLiabilitiesReport>('/deposits/liabilities');
  }

  async getFinancialReportRuns(): Promise<FinancialReportRun[]> {
    return this.request<FinancialReportRun[]>('/reports/runs');
  }

  async generateFinancialReport(cmd: { report_type: string; title: string; period_start: string; period_end: string; property_id?: string }): Promise<FinancialReportRun> {
    return this.request<FinancialReportRun>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getFinancialAuditEvents(params?: { limit?: number }): Promise<FinancialAuditEvent[]> {
    const qs = params?.limit ? `?limit=${params.limit}` : '';
    return this.request<FinancialAuditEvent[]>(`/audit/financial${qs}`);
  }

  // --- User Onboarding, Invitations & Staff Management ---
  async getInvitations(status?: string): Promise<Invitation[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request<Invitation[]>(`/invitations${qs}`);
  }

  async createStaffInvitation(cmd: {
    full_name: string;
    email: string;
    phone: string;
    role: string;
    property_ids: string[];
    additional_permissions?: string[];
    invitation_message?: string;
    expiry_days?: number;
  }): Promise<Invitation> {
    return this.request<Invitation>('/invitations', {
      method: 'POST',
      body: JSON.stringify({ ...cmd, invitation_type: 'STAFF' }),
    });
  }

  async createTenantInvitation(cmd: {
    tenant_id: string;
    email: string;
    phone?: string;
    lease_id?: string;
    property_id?: string;
  }): Promise<Invitation> {
    return this.request<Invitation>('/invitations', {
      method: 'POST',
      body: JSON.stringify({ ...cmd, invitation_type: 'TENANT' }),
    });
  }

  async resendInvitation(invitationId: string): Promise<Invitation> {
    return this.request<Invitation>(`/invitations/${invitationId}/resend`, {
      method: 'POST',
    });
  }

  async revokeInvitation(invitationId: string): Promise<Invitation> {
    return this.request<Invitation>(`/invitations/${invitationId}/revoke`, {
      method: 'POST',
    });
  }

  async verifyInvitationToken(token: string): Promise<{ valid: boolean; invitation?: Invitation; message?: string }> {
    return this.request(`/invitations/verify?token=${encodeURIComponent(token)}`);
  }

  async acceptInvitation(cmd: {
    token: string;
    password?: string;
    full_name?: string;
  }): Promise<{ success: boolean; session?: any; message: string }> {
    return this.request('/invitations/accept', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async getManagedStaff(): Promise<ManagedStaffMember[]> {
    return this.request<ManagedStaffMember[]>('/users');
  }

  async updateStaffStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<any> {
    return this.request(`/users/${userId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async updateStaffPropertyAccess(userId: string, propertyIds: string[]): Promise<any> {
    return this.request(`/users/${userId}/property-access`, {
      method: 'POST',
      body: JSON.stringify({ property_ids: propertyIds }),
    });
  }

  async revokeStaffSessions(userId: string): Promise<any> {
    return this.request(`/users/${userId}/revoke-sessions`, {
      method: 'POST',
    });
  }

  // --- Guri24 Platform Administration ---
  async getPlatformOverview(): Promise<any> {
    return this.request('/platform/overview');
  }

  async getPlatformOrganizations(): Promise<PlatformOrganization[]> {
    return this.request<PlatformOrganization[]>('/platform/organizations');
  }

  async createPlatformOrganization(cmd: {
    name: string;
    slug: string;
    organization_type: string;
    county: string;
    contact_email: string;
    contact_phone: string;
    admin_full_name: string;
    admin_email: string;
    admin_phone: string;
    subscription_plan: string;
  }): Promise<any> {
    return this.request('/platform/organizations', {
      method: 'POST',
      body: JSON.stringify(cmd),
    });
  }

  async updatePlatformOrganizationStatus(orgId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<any> {
    return this.request(`/platform/organizations/${orgId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async getPlatformAuditLogs(): Promise<AccessAuditLog[]> {
    return this.request<AccessAuditLog[]>('/platform/audit-logs');
  }

  async getPlatformSystemHealth(): Promise<any> {
    return this.request('/platform/system-health');
  }
}

export interface NotificationDelivery {
  id: string;
  organization_id: string;
  recipient_email: string;
  recipient_name: string;
  recipient_role: string;
  template_key: string;
  subject: string;
  body_html: string;
  body_text: string;
  status: 'QUEUED' | 'PROCESSING' | 'SENT' | 'DELIVERED' | 'BOUNCED' | 'COMPLAINED' | 'FAILED' | 'SUPPRESSED' | 'CANCELLED';
  provider: string;
  provider_message_id?: string | null;
  error_message?: string | null;
  retry_count: number;
  max_retries: number;
  idempotency_key: string;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
  sent_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  organization_id: string;
  rent_reminder_days_before: number;
  rent_due_date_reminder: boolean;
  overdue_reminder_days: number[];
  lease_expiry_days: number[];
  daily_collection_summary: boolean;
  weekly_operational_report: boolean;
  monthly_financial_report: boolean;
  deposit_liability_summary: boolean;
  staff_escalation_emails: string[];
  timezone: string;
  email_from: string;
  brand_logo_url?: string | null;
  brand_primary_color: string;
  updated_at: string;
}

export interface NotificationTemplateSummary {
  key: string;
  title: string;
  category: string;
  is_mandatory: boolean;
  sample_subject: string;
}

export const apiClient = new ApiClient();
