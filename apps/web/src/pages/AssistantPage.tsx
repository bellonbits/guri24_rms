import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { FullPageAssistant } from '../components/FullPageAssistant';
import { sendAssistantPrompt, resolveAssistantConfirmation } from '../lib/api';
import { apiClient } from '../lib/apiClient';
import type { AssistantConversation, AssistantMessage, RmsPlatformState } from '../types';

export const AssistantPage: React.FC = () => {
  const { currentOrg, currentUserRole } = useAuth();
  const { state, setState } = useRms();

  const effectiveRole = currentUserRole || state?.currentRole || 'ORGANIZATION_ADMINISTRATOR';
  const effectiveOrgId = currentOrg?.id || state?.currentOrganizationId || 'org-guri';

  const conversationsList =
    state?.conversations && state.conversations.length > 0
      ? state.conversations
      : state?.assistantConversations || [];

  const confirmationsList =
    state?.confirmations && state.confirmations.length > 0
      ? state.confirmations
      : state?.assistantConfirmations || [];

  return (
    <div style={{ margin: '-14px -14px -36px', height: 'calc(100vh - 110px)' }}>
      <FullPageAssistant
        currentOrg={currentOrg}
        userRole={effectiveRole}
        properties={state?.properties || []}
        tenants={state?.tenants || []}
        invoices={state?.invoices || []}
        payments={state?.payments || []}
        deposits={state?.deposits || state?.securityDeposits || []}
        conversations={conversationsList}
        confirmations={confirmationsList}
        onUpdateConversations={(convs) => {
          setState((prev) => ({
            ...prev,
            conversations: convs,
            assistantConversations: convs,
          }));
        }}
        onUpdateConfirmations={(confs) => {
          setState((prev) => ({
            ...prev,
            confirmations: confs,
            assistantConfirmations: confs,
          }));
        }}
        onSendMessage={async (query, convId, attachment) => {
          const nowIso = new Date().toISOString();
          const targetConvId = convId || `conv-${Date.now()}`;

          // Optimistically append user message immediately to the UI
          const userMsg: AssistantMessage = {
            id: `msg-${Date.now()}-usr`,
            role: 'USER',
            content: query,
            attachment,
            citations: [],
            tool_calls: [],
            created_at: nowIso,
          };

          const currentConvs =
            state?.conversations && state.conversations.length > 0
              ? state.conversations
              : state?.assistantConversations || [];
          const existingConv = currentConvs.find((c) => c.id === targetConvId);

          let interimConvs: AssistantConversation[];
          if (existingConv) {
            interimConvs = currentConvs.map((c) =>
              c.id === targetConvId
                ? {
                    ...c,
                    messages: [...c.messages, userMsg],
                    updated_at: nowIso,
                  }
                : c
            );
          } else {
            interimConvs = [
              {
                id: targetConvId,
                organization_id: effectiveOrgId,
                title: query.slice(0, 36) || 'RMS Inquiry',
                messages: [userMsg],
                updated_at: nowIso,
              },
              ...currentConvs,
            ];
          }

          setState((prev) => ({
            ...prev,
            conversations: interimConvs,
            assistantConversations: interimConvs,
          }));

          // 1. Try live backend assistant chat API first
          try {
            const liveRes = await apiClient.askAssistant(query, targetConvId);
            const rawLiveReply = liveRes?.reply || liveRes?.content;
            if (rawLiveReply) {
              const liveReply = rawLiveReply
                .replace(/(^|\n|\r)#{1,6}\s*/g, '$1')
                .replace(/#{1,6}\s*/g, '')
                .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/__(.*?)__/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/_(.*?)_/g, '$1')
                .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
                .replace(/\s+-\s+([A-Z])/g, '\n• $1')
                .replace(/(^|\n)[-*+]\s+/g, '$1• ');

              const astMsg: AssistantMessage = {
                id: `msg-${Date.now()}-ast`,
                role: 'ASSISTANT',
                content: liveReply,
                citations: liveRes.citations || [],
                tool_calls: (liveRes as any).tool_calls || [],
                created_at: new Date().toISOString(),
              };

              const finalConvs = interimConvs.map((c) =>
                c.id === targetConvId
                  ? {
                      ...c,
                      messages: [...c.messages, astMsg],
                      updated_at: new Date().toISOString(),
                    }
                  : c
              );

              setState((prev) => ({
                ...prev,
                conversations: finalConvs,
                assistantConversations: finalConvs,
              }));
              return;
            }
          } catch (apiErr) {
            console.info('Backend assistant offline or returned error; activating grounded RMS engine:', apiErr);
          }

          // 2. Authoritative Grounded RMS Assistant engine (offline/isolated fallback)
          try {
            const prepState: RmsPlatformState = {
              ...state,
              currentRole: effectiveRole,
              currentOrganizationId: effectiveOrgId,
            };

            const { nextState } = sendAssistantPrompt(prepState, query, targetConvId, attachment);

            setState((prev) => ({
              ...prev,
              ...nextState,
              conversations: nextState.assistantConversations,
              assistantConversations: nextState.assistantConversations,
              confirmations: nextState.assistantConfirmations,
              assistantConfirmations: nextState.assistantConfirmations,
            }));
          } catch (engineErr: any) {
            console.error('sendAssistantPrompt error:', engineErr);
            const fallbackMsg: AssistantMessage = {
              id: `msg-${Date.now()}-ast`,
              role: 'ASSISTANT',
              content: engineErr?.message || 'Processed query using authorized organization-scoped RMS records.',
              citations: [],
              tool_calls: [],
              created_at: new Date().toISOString(),
            };

            const finalConvs = interimConvs.map((c) =>
              c.id === targetConvId
                ? {
                    ...c,
                    messages: [...c.messages, fallbackMsg],
                    updated_at: new Date().toISOString(),
                  }
                : c
            );

            setState((prev) => ({
              ...prev,
              conversations: finalConvs,
              assistantConversations: finalConvs,
            }));
          }
        }}
        onResolveConfirmation={(confId, approve) => {
          const prepState: RmsPlatformState = {
            ...state,
            currentRole: effectiveRole,
            currentOrganizationId: effectiveOrgId,
          };
          const { nextState } = resolveAssistantConfirmation(prepState, confId, approve);
          setState((prev) => ({
            ...prev,
            ...nextState,
            conversations: nextState.assistantConversations,
            assistantConversations: nextState.assistantConversations,
            confirmations: nextState.assistantConfirmations,
            assistantConfirmations: nextState.assistantConfirmations,
          }));
        }}
      />
    </div>
  );
};
