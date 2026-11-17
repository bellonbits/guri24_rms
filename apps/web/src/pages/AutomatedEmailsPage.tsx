import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationSettingsWorkspace } from '../components/NotificationSettingsWorkspace';

export const AutomatedEmailsPage: React.FC = () => {
  const { currentOrg, currentUserRole } = useAuth();
  const location = useLocation();

  const targetTab = useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('/schedules')) return 'schedules';
    if (path.includes('/delivery-history') || path.includes('/deliveries')) return 'deliveries';
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/settings')) return 'overview';
    return 'templates';
  }, [location.pathname]);

  return (
    <NotificationSettingsWorkspace
      currentOrg={currentOrg}
      userRole={currentUserRole || 'ORGANIZATION_ADMINISTRATOR'}
      initialTab={targetTab}
    />
  );
};
