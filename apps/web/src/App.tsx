import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RmsProvider } from './context/RmsContext';
import { AuthGuard } from './layouts/AuthGuard';
import { AppLayout } from './layouts/AppLayout';

// Dedicated Page Components
import { DashboardPage } from './pages/DashboardPage';
import { LeasesBookingsPage } from './pages/LeasesBookingsPage';
import { PropertiesUnitsPage } from './pages/PropertiesUnitsPage';
import { TenantsPage } from './pages/TenantsPage';
import { PaymentsMpesaPage } from './pages/PaymentsMpesaPage';
import { EstatesDepositsPage } from './pages/EstatesDepositsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { OcrDocumentsPage } from './pages/OcrDocumentsPage';
import { AssistantPage } from './pages/AssistantPage';
import { AnalyticsLedgerPage } from './pages/AnalyticsLedgerPage';
import { AutomatedEmailsPage } from './pages/AutomatedEmailsPage';
import { SettingsPortalPage } from './pages/SettingsPortalPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export type NavSection =
  | 'dashboard'
  | 'leases'
  | 'properties'
  | 'tenants'
  | 'payments'
  | 'locations'
  | 'maintenance'
  | 'ocr'
  | 'assistant'
  | 'analytics'
  | 'notifications'
  | 'settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RmsProvider>
          <Routes>
            {/* Public Authentication Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Root Redirect to /app/dashboard */}
            <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

            {/* Authenticated Application Shell */}
            <Route
              path="/app"
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              {/* Default redirect inside /app */}
              <Route index element={<Navigate to="/app/dashboard" replace />} />

              {/* 1. Dashboard */}
              <Route path="dashboard" element={<DashboardPage />} />

              {/* 2. Leases & Bookings */}
              <Route path="leases-bookings" element={<LeasesBookingsPage />} />
              <Route path="leases-bookings/:id" element={<LeasesBookingsPage />} />
              <Route path="leases-bookings/active" element={<LeasesBookingsPage />} />
              <Route path="leases-bookings/pending" element={<LeasesBookingsPage />} />

              {/* 3. Properties & Units */}
              <Route path="properties-units" element={<PropertiesUnitsPage />} />
              <Route path="properties-units/properties" element={<PropertiesUnitsPage />} />
              <Route path="properties-units/buildings" element={<PropertiesUnitsPage />} />
              <Route path="properties-units/units" element={<PropertiesUnitsPage />} />
              <Route path="properties-units/:id" element={<PropertiesUnitsPage />} />

              {/* 4. Tenants */}
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="tenants/applications" element={<TenantsPage />} />
              <Route path="tenants/:id" element={<TenantsPage />} />

              {/* 5. Payments & M-Pesa */}
              <Route path="payments-mpesa" element={<PaymentsMpesaPage />} />
              <Route path="payments-mpesa/transactions" element={<PaymentsMpesaPage />} />
              <Route path="payments-mpesa/invoices" element={<PaymentsMpesaPage />} />
              <Route path="payments-mpesa/allocations" element={<PaymentsMpesaPage />} />
              <Route path="payments-mpesa/reconciliation" element={<PaymentsMpesaPage />} />
              <Route path="payments-mpesa/:id" element={<PaymentsMpesaPage />} />

              {/* 6. Estates & Deposits */}
              <Route path="estates-deposits" element={<EstatesDepositsPage />} />
              <Route path="estates-deposits/refunds" element={<EstatesDepositsPage />} />
              <Route path="estates-deposits/:id" element={<EstatesDepositsPage />} />

              {/* 7. Maintenance */}
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="maintenance/vendors" element={<MaintenancePage />} />
              <Route path="maintenance/:id" element={<MaintenancePage />} />

              {/* 8. OCR & Documents */}
              <Route path="ocr-documents" element={<OcrDocumentsPage />} />
              <Route path="ocr-documents/documents" element={<OcrDocumentsPage />} />
              <Route path="ocr-documents/processing-jobs" element={<OcrDocumentsPage />} />
              <Route path="ocr-documents/review" element={<OcrDocumentsPage />} />
              <Route path="ocr-documents/review/:id" element={<OcrDocumentsPage />} />

              {/* 9. AI Assistant */}
              <Route path="assistant" element={<AssistantPage />} />

              {/* 10. Analytics & Ledger */}
              <Route path="analytics-ledger" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/general-ledger" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/trial-balance" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/financial-statements" element={<AnalyticsLedgerPage />} />

              {/* 11. Automated Emails */}
              <Route path="automated-emails" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/templates" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/schedules" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/delivery-history" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/settings" element={<AutomatedEmailsPage />} />

              {/* 12. Settings & Portal */}
              <Route path="settings-portal" element={<SettingsPortalPage />} />
              <Route path="settings-portal/organization" element={<SettingsPortalPage />} />
              <Route path="settings-portal/users" element={<SettingsPortalPage />} />
              <Route path="settings-portal/billing" element={<SettingsPortalPage />} />
              <Route path="settings-portal/integrations" element={<SettingsPortalPage />} />
            </Route>

            {/* 404 Unknown Route Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </RmsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
