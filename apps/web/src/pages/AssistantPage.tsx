import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { FullPageAssistant } from '../components/FullPageAssistant';
import { sendAssistantPrompt, resolveAssistantConfirmation } from '../lib/api';

export const AssistantPage: React.FC = () => {
  const { currentOrg, currentUserRole } = useAuth();
  const { state, setState } = useRms();

  return (
    <div style={{ margin: '-14px -14px -36px', height: 'calc(100vh - 110px)' }}>
      <FullPageAssistant
        currentOrg={currentOrg}
        userRole={currentUserRole || 'ORGANIZATION_ADMINISTRATOR'}
        properties={state.properties}
        tenants={state.tenants}
        invoices={state.invoices}
        payments={state.payments}
        deposits={state.securityDeposits}
        conversations={state.conversations}
        confirmations={state.confirmations}
        onUpdateConversations={(convs) => {
          setState((prev) => ({ ...prev, conversations: convs }));
        }}
        onUpdateConfirmations={(confs) => {
          setState((prev) => ({ ...prev, confirmations: confs }));
        }}
        onSendMessage={async (query, convId, attachment) => {
          const res = await sendAssistantPrompt(
            state,
            query,
            convId,
            currentUserRole || 'ORGANIZATION_ADMINISTRATOR',
            attachment
          );
          setState((prev) => ({
            ...prev,
            conversations: res.conversations,
            confirmations: res.confirmations,
          }));
        }}
        onResolveConfirmation={(confId, approve) => {
          const res = resolveAssistantConfirmation(state, confId, approve);
          setState((prev) => ({
            ...prev,
            ...res.state,
          }));
        }}
      />
    </div>
  );
};
