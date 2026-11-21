import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RmsProvider } from './context/RmsContext';
import { AuthGuard } from './layouts/AuthGuard';
import { AppLayout } from './layouts/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

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
import { AcceptInvitationPage } from './pages/AcceptInvitationPage';
import { PlatformLayout } from './layouts/PlatformLayout';
import { PlatformAdminPage } from './pages/PlatformAdminPage';

// Marketing SaaS Architecture
import { MarketingLayout } from './marketing/MarketingLayout';
import { HomePage as MarketingHomePage } from './marketing/HomePage';
import { AboutPage } from './marketing/AboutPage';
import { PricingPage } from './marketing/PricingPage';
import { ContactPage } from './marketing/ContactPage';
import { HowItWorksPage } from './marketing/HowItWorksPage';
import { FaqPage } from './marketing/FaqPage';
import { SolutionsPages } from './marketing/SolutionsPages';
import { FeaturesHubPage, FeatureDetailPage } from './marketing/FeaturesPages';
import { ResourcesPages } from './marketing/ResourcesPages';
import { SupportPages, CustomErrorPage } from './marketing/SupportPages';
import { RegisterPage, ForgotPasswordPage, OnboardingPage } from './marketing/AuthPages';

// Legal & Compliance Architecture
import { LegalOverviewPage } from './marketing/legal/LegalOverviewPage';
import { TermsPage } from './marketing/legal/TermsPage';
import { PrivacyPolicyPage } from './marketing/legal/PrivacyPolicyPage';
import { CookiePolicyPage } from './marketing/legal/CookiePolicyPage';
import { DataProtectionPage } from './marketing/legal/DataProtectionPage';
import { AcceptableUsePage } from './marketing/legal/AcceptableUsePage';
import { SubscriptionBillingPage } from './marketing/legal/SubscriptionBillingPage';
import { DataProcessingPage } from './marketing/legal/DataProcessingPage';
import { SecurityPage } from './marketing/legal/SecurityPage';
import { AccessibilityPage } from './marketing/legal/AccessibilityPage';

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
          <ErrorBoundary fallbackTitle="An application error occurred">
            <Routes>
            {/* Public Marketing SaaS Platform Experience */}
            <Route path="/" element={<MarketingLayout><MarketingHomePage /></MarketingLayout>} />
            <Route path="/home" element={<MarketingLayout><MarketingHomePage /></MarketingLayout>} />
            <Route path="/about" element={<MarketingLayout><AboutPage /></MarketingLayout>} />
            <Route path="/pricing" element={<MarketingLayout><PricingPage /></MarketingLayout>} />
            <Route path="/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
            <Route path="/how-it-works" element={<MarketingLayout><HowItWorksPage /></MarketingLayout>} />
            <Route path="/faq" element={<MarketingLayout><FaqPage /></MarketingLayout>} />

            {/* Solutions Routes */}
            <Route path="/solutions" element={<MarketingLayout><SolutionsPages /></MarketingLayout>} />
            <Route path="/solutions/landlords" element={<MarketingLayout><SolutionsPages /></MarketingLayout>} />
            <Route path="/solutions/property-managers" element={<MarketingLayout><SolutionsPages /></MarketingLayout>} />
            <Route path="/solutions/real-estate-companies" element={<MarketingLayout><SolutionsPages /></MarketingLayout>} />
            <Route path="/solutions/estate-managers" element={<MarketingLayout><SolutionsPages /></MarketingLayout>} />

            {/* Features Hub & 14 Dedicated Feature Routes */}
            <Route path="/features" element={<MarketingLayout><FeaturesHubPage /></MarketingLayout>} />
            <Route path="/features/:slug" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/property-management" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/units-and-estates" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/tenant-management" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/leases-and-bookings" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/rent-collection" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/mpesa-and-payments" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/bank-and-cash-management" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/financial-management" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/maintenance" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/documents-and-ocr" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/analytics-and-reporting" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/ai-assistant" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/tenant-portal" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />
            <Route path="/features/notifications" element={<MarketingLayout><FeatureDetailPage /></MarketingLayout>} />

            {/* Resources Routes */}
            <Route path="/resources" element={<MarketingLayout><ResourcesPages /></MarketingLayout>} />
            <Route path="/resources/:category" element={<MarketingLayout><ResourcesPages /></MarketingLayout>} />

            {/* Legal & Compliance Architecture */}
            <Route path="/legal" element={<MarketingLayout><LegalOverviewPage /></MarketingLayout>} />
            <Route path="/legal/terms" element={<MarketingLayout><TermsPage /></MarketingLayout>} />
            <Route path="/legal/privacy" element={<MarketingLayout><PrivacyPolicyPage /></MarketingLayout>} />
            <Route path="/legal/cookies" element={<MarketingLayout><CookiePolicyPage /></MarketingLayout>} />
            <Route path="/legal/data-protection" element={<MarketingLayout><DataProtectionPage /></MarketingLayout>} />
            <Route path="/legal/acceptable-use" element={<MarketingLayout><AcceptableUsePage /></MarketingLayout>} />
            <Route path="/legal/subscription-and-billing" element={<MarketingLayout><SubscriptionBillingPage /></MarketingLayout>} />
            <Route path="/legal/data-processing" element={<MarketingLayout><DataProcessingPage /></MarketingLayout>} />
            <Route path="/security" element={<MarketingLayout><SecurityPage /></MarketingLayout>} />
            <Route path="/accessibility" element={<MarketingLayout><AccessibilityPage /></MarketingLayout>} />

            {/* Support, Status & Sitemap */}
            <Route path="/support" element={<MarketingLayout><SupportPages /></MarketingLayout>} />
            <Route path="/support/contact" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
            <Route path="/support/report-issue" element={<MarketingLayout><ContactPage /></MarketingLayout>} />
            <Route path="/status" element={<MarketingLayout><SupportPages /></MarketingLayout>} />
            <Route path="/sitemap" element={<MarketingLayout><SupportPages /></MarketingLayout>} />

            {/* Error Pages */}
            <Route path="/403" element={<CustomErrorPage code="403" />} />
            <Route path="/500" element={<CustomErrorPage code="500" />} />
            <Route path="/maintenance" element={<CustomErrorPage code="maintenance" />} />

            {/* Public Authentication & Onboarding Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<ForgotPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
            <Route path="/accept-invitation/:token" element={<AcceptInvitationPage />} />

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

              {/* 10. Analytics & Ledger (Complete Nested Financial Management Subpages) */}
              <Route path="analytics-ledger" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/overview" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/accounts" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/collections" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/receivables" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/arrears" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/expenses" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/deposits" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/general-ledger" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/journals" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/trial-balance" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/income-statement" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/balance-sheet" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/cash-flow" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/reconciliation" element={<AnalyticsLedgerPage />} />
              <Route path="analytics-ledger/audit-trail" element={<AnalyticsLedgerPage />} />

              {/* 11. Automated Emails */}
              <Route path="automated-emails" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/templates" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/schedules" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/delivery-history" element={<AutomatedEmailsPage />} />
              <Route path="automated-emails/settings" element={<AutomatedEmailsPage />} />

              {/* 12. Settings & Portal */}
              <Route path="settings-portal" element={<SettingsPortalPage />} />
              <Route path="settings-portal/organization" element={<SettingsPortalPage />} />
              <Route path="settings-portal/finance-configuration" element={<SettingsPortalPage />} />
              <Route path="settings-portal/users" element={<SettingsPortalPage />} />
              <Route path="settings-portal/roles-permissions" element={<SettingsPortalPage />} />
              <Route path="settings-portal/billing" element={<SettingsPortalPage />} />
              <Route path="settings-portal/integrations" element={<SettingsPortalPage />} />
            </Route>

            {/* 13. Guri24 Platform Administration (Multi-Tenant Super-Admin Shell) */}
            <Route
              path="/platform"
              element={
                <AuthGuard>
                  <PlatformLayout />
                </AuthGuard>
              }
            >
              <Route index element={<Navigate to="/platform/dashboard" replace />} />
              <Route path="dashboard" element={<PlatformAdminPage view="dashboard" />} />
              <Route path="organizations" element={<PlatformAdminPage view="organizations" />} />
              <Route path="organizations/:id" element={<PlatformAdminPage view="organizations" />} />
              <Route path="users" element={<PlatformAdminPage view="users" />} />
              <Route path="administrators" element={<PlatformAdminPage view="administrators" />} />
              <Route path="subscriptions" element={<PlatformAdminPage view="subscriptions" />} />
              <Route path="integrations" element={<PlatformAdminPage view="integrations" />} />
              <Route path="audit-logs" element={<PlatformAdminPage view="audit-logs" />} />
              <Route path="system-health" element={<PlatformAdminPage view="system-health" />} />
            </Route>

            {/* 404 Unknown Route Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </RmsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
