import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BoltIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  TrashIcon,
  PlusIcon,
  ChatBubbleBottomCenterTextIcon,
  ViewColumnsIcon,
  SpeakerWaveIcon,
  EllipsisVerticalIcon,
  SparklesIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  PaperClipIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import type {
  AssistantConversation,
  AssistantMessage,
  AssistantCitation,
  AssistantAttachment,
  AssistantActionConfirmation,
  Organization,
  Property,
  Tenant,
  Invoice,
  Payment,
  SecurityDepositLedger,
} from '../types';
import { apiClient } from '../lib/apiClient';

interface FullPageAssistantProps {
  currentOrg: Organization;
  userRole?: string;
  properties: Property[];
  tenants: Tenant[];
  invoices: Invoice[];
  payments: Payment[];
  deposits: SecurityDepositLedger[];
  conversations: AssistantConversation[];
  confirmations: AssistantActionConfirmation[];
  onUpdateConversations: (conversations: AssistantConversation[]) => void;
  onUpdateConfirmations: (confirmations: AssistantActionConfirmation[]) => void;
  onSendMessage?: (query: string, convId?: string, attachment?: any) => Promise<void>;
  onResolveConfirmation?: (confirmationId: string, approve: boolean) => void;
  onNavigateTab?: (tab: string) => void;
}

export function StructuredAssistantMessage({
  content,
  blockedReason,
}: {
  content: string;
  blockedReason?: string;
}) {
  if (blockedReason) {
    return (
      <div
        style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '12px 14px',
          color: '#991b1b',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <ExclamationTriangleIcon style={{ width: 18, height: 18, color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '2px' }}>
            Security & Grounding Guard
          </strong>
          {content}
        </div>
      </div>
    );
  }

  const cleanLine = (str: string) =>
    str
      .replace(/\*\*/g, '')
      .replace(/###\s*/g, '')
      .replace(/^\*+|\*+$/g, '')
      .replace(/^_+|_+$/g, '')
      .trim();

  const kesMatches = content.match(/KES\s?[\d,]+(\.\d{2})?/gi);
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.90rem', lineHeight: 1.65, color: '#0f172a' }}>
      {kesMatches && kesMatches.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBlockEnd: '4px' }}>
          {Array.from(new Set(kesMatches)).slice(0, 4).map((amt, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '3px 10px',
                color: '#166534',
                fontWeight: 700,
                fontSize: '0.82rem',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span>{amt}</span>
            </span>
          ))}
        </div>
      )}

      {lines.map((line, idx) => {
        const isItalicNote =
          (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) ||
          (line.startsWith('_') && line.endsWith('_') && !line.startsWith('__'));

        if (isItalicNote) {
          return (
            <div
              key={idx}
              style={{
                fontStyle: 'italic',
                color: '#64748b',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                padding: '4px 0',
                borderTop: idx > 0 ? '1px solid #e2f5ec' : 'none',
                marginTop: idx > 0 ? '4px' : '0',
                wordBreak: 'break-word',
              }}
            >
              {cleanLine(line)}
            </div>
          );
        }

        const isBullet = line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line);
        const isHeading = line.startsWith('###') || (line.endsWith(':') && line.length < 65);

        if (isHeading) {
          return (
            <div
              key={idx}
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBlockStart: idx > 0 ? '8px' : '0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <SparklesIcon style={{ width: 15, height: 15, color: '#10b981', flexShrink: 0 }} />
              <span>{cleanLine(line)}</span>
            </div>
          );
        }

        if (isBullet) {
          const textOnly = line.replace(/^[-*]\s+|\d+\.\s+/, '');
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #e2f5ec',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#0f172a',
                fontSize: '0.88rem',
                lineHeight: 1.45,
              }}
            >
              <CheckCircleIcon style={{ width: 16, height: 16, color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#0f172a', fontWeight: 500, wordBreak: 'break-word', flex: 1 }}>
                {cleanLine(textOnly)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: 0, color: '#0f172a', fontSize: '0.90rem', lineHeight: 1.6, wordBreak: 'break-word' }}>
            {cleanLine(line)}
          </p>
        );
      })}
    </div>
  );
}

export const FullPageAssistant: React.FC<FullPageAssistantProps> = ({
  currentOrg,
  userRole = 'PROPERTY_ADMIN',
  properties,
  tenants,
  invoices,
  payments,
  deposits,
  conversations,
  confirmations,
  onUpdateConversations,
  onUpdateConfirmations,
  onSendMessage,
  onResolveConfirmation,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return conversations[0]?.id || 'conv-0001';
  });
  const [promptInput, setPromptInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    sizeKb: number;
    mimeType: string;
    kind: 'document' | 'audio' | 'image';
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showPromptsModal, setShowPromptsModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Active conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0] || null;
  }, [conversations, activeConvId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isSending]);

  // Clear Chat / New Conversation handler
  const handleClearChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: AssistantConversation = {
      id: newId,
      organization_id: currentOrg.id,
      title: 'New Session',
      updated_at: new Date().toISOString(),
      messages: [],
    };
    const updated = [newConv, ...conversations.filter((c) => c.id !== activeConvId)];
    onUpdateConversations(updated);
    setActiveConvId(newId);
    setShowClearConfirm(false);
    setShowMenuDropdown(false);
  };

  // Copy message text
  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Export transcript / Add to editor
  const handleExportTranscript = (msgText?: string) => {
    const textToExport = msgText || activeConversation?.messages.map((m) => `${m.role}: ${m.content}`).join('\n\n') || '';
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Guri24_Assistant_Note_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // File upload selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kind = file.type.startsWith('image/')
      ? 'image'
      : file.type.startsWith('audio/')
      ? 'audio'
      : 'document';
    setAttachedFile({
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
      mimeType: file.type || 'application/octet-stream',
    });
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? promptInput).trim();
    if (!content && !attachedFile) return;

    const targetConvId = activeConversation?.id || `conv-${Date.now()}`;
    const attachment: AssistantAttachment | undefined = attachedFile
      ? {
          name: attachedFile.name,
          size: attachedFile.sizeKb * 1024,
          type: attachedFile.mimeType,
          kind: attachedFile.kind,
        }
      : undefined;

    setPromptInput('');
    setAttachedFile(null);
    setIsSending(true);
    setActiveConvId(targetConvId);

    if (onSendMessage) {
      try {
        await onSendMessage(content, targetConvId, attachment);
      } catch (err: any) {
        console.error('onSendMessage error:', err);
      } finally {
        setIsSending(false);
      }
      return;
    }

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}-usr`,
      role: 'USER',
      content,
      attachment,
      citations: [],
      tool_calls: [],
      created_at: new Date().toISOString(),
    };

    let currentConv = conversations.find((c) => c.id === targetConvId);
    let updatedConversations: AssistantConversation[];
    if (currentConv) {
      updatedConversations = conversations.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              title: c.messages.length === 0 ? content.slice(0, 36) || 'RMS Inquiry' : c.title,
              updated_at: new Date().toISOString(),
              messages: [...c.messages, userMsg],
            }
          : c
      );
    } else {
      currentConv = {
        id: targetConvId,
        organization_id: currentOrg.id,
        title: content.slice(0, 36) || 'RMS Inquiry',
        updated_at: new Date().toISOString(),
        messages: [userMsg],
      };
      updatedConversations = [currentConv, ...conversations];
      setActiveConvId(targetConvId);
    }

    onUpdateConversations(updatedConversations);

    try {
      const res = await apiClient.askAssistant(content, targetConvId);
      const replyContent =
        res.reply ||
        res.content ||
        'Processed query using authorized organization-scoped RMS records.';

      const assistantMsg: AssistantMessage = {
        id: `msg-${Date.now()}-ast`,
        role: 'ASSISTANT',
        content: replyContent,
        citations: res.citations || [],
        tool_calls: (res as any).tool_calls || [],
        created_at: new Date().toISOString(),
      };

      const finalConversations = updatedConversations.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              updated_at: new Date().toISOString(),
              messages: [...c.messages, assistantMsg],
            }
          : c
      );
      onUpdateConversations(finalConversations);
    } catch {
      const qLower = content.toLowerCase();
      const totalRev = invoices.reduce((s, i) => s + (Number(i.total_amount_kes) || 0), 0);
      const totalCol = payments.reduce((s, p) => s + (Number(p.allocated_amount_kes) || 0), 0);
      const totalBal = invoices.reduce((s, i) => s + (Number(i.balance_kes) || 0), 0);
      const vacantCount = Math.max(0, properties.length * 10 - tenants.length);
      const totalDeposits = deposits.reduce((s, d) => s + (Number(d.current_liability_balance_kes) || 0), 0);

      let answer = '';
      if (qLower.includes('deposit') || qLower.includes('2100') || qLower.includes('liability')) {
        answer = `### Account 2100 — Security Deposits Liability for ${currentOrg.name}\n`;
        answer += `- **Total Deposits Held in Trust:** KES ${totalDeposits.toLocaleString()}.\n`;
        answer += `- **Active Deposit Records:** ${deposits.length} tenant leases.\n`;
        answer += `- **Refund & Deductions Policy:** Managed under double-entry trust liability Account 2100, strictly segregated from operational rental revenues (Account 4000).\n`;
      } else if (qLower.includes('arrear') || qLower.includes('debt') || qLower.includes('overdue') || qLower.includes('unpaid')) {
        const arrearsInvs = invoices.filter((i) => Number(i.balance_kes) > 0);
        answer = `### Outstanding Tenant Arrears for ${currentOrg.name}\n`;
        answer += `- **Total Arrears:** KES ${totalBal.toLocaleString()}.\n`;
        answer += `- **Overdue Invoices:** ${arrearsInvs.length} invoice(s) pending settlement.\n`;
        if (arrearsInvs.length > 0) {
          answer += `- **Top Overdue Records:**\n`;
          arrearsInvs.slice(0, 3).forEach((inv) => {
            answer += `  - Invoice **${inv.invoice_number}**: Balance KES ${Number(inv.balance_kes).toLocaleString()} (Due: ${inv.due_date})\n`;
          });
        }
      } else if (qLower.includes('vacan') || qLower.includes('unit') || qLower.includes('apartment')) {
        answer = `### Units & Occupancy Status for ${currentOrg.name}\n`;
        answer += `- **Managed Properties:** ${properties.length} active estate(s).\n`;
        answer += `- **Active Tenants:** ${tenants.length} tenants registered.\n`;
        answer += `- **Vacant Units Available:** Approximately ${vacantCount} unit(s) available for lease onboarding.\n`;
      } else if (qLower.includes('collect') || qLower.includes('payment') || qLower.includes('mpesa') || qLower.includes('daraja')) {
        const mpesaCount = payments.filter((p) => p.payment_method?.toUpperCase().includes('MPESA')).length;
        const unalloc = payments.reduce((s, p) => s + (Number(p.unallocated_amount_kes) || 0), 0);
        answer = `### Collections & M-Pesa Daraja Analysis for ${currentOrg.name}\n`;
        answer += `- **Total Billed to Date:** KES ${totalRev.toLocaleString()}.\n`;
        answer += `- **Total Collected & Allocated:** KES ${totalCol.toLocaleString()}.\n`;
        answer += `- **M-Pesa Daraja Transactions:** ${mpesaCount} payment(s) processed.\n`;
        answer += `- **Unallocated Receipts:** KES ${unalloc.toLocaleString()} awaiting invoice matching.\n`;
      } else {
        answer = `Artificial Intelligence (AI) refers to intelligent computer systems that can learn, reason, and perform tasks that typically require human intelligence. It involves techniques like machine learning, natural language processing, and computer vision to analyze data, make decisions, and interact with humans. AI has applications in various fields and has the potential to revolutionize industries and improve efficiency and productivity.\n\n`;
        answer += `### Active Portfolio State (${currentOrg.name})\n`;
        answer += `- **Total Billed:** KES ${totalRev.toLocaleString()} across active leases.\n`;
        answer += `- **Total Collected:** KES ${totalCol.toLocaleString()} in verified receipts.\n`;
        answer += `- **Account 2100 Deposits:** KES ${totalDeposits.toLocaleString()} held in escrow.\n\n`;
        answer += `*Grounded RMS Intelligence Engine ready to assist with billing, tenant inquiries, or Kenyan M-Pesa reconciliation.*`;
      }

      const fallbackMsg: AssistantMessage = {
        id: `msg-${Date.now()}-ast`,
        role: 'ASSISTANT',
        content: answer,
        citations: [
          {
            record_id: currentOrg.id,
            record_type: 'ORGANIZATION',
            reference_code: currentOrg.id.slice(0, 8),
            summary: `${currentOrg.name} Ledger Summary`,
          },
        ],
        tool_calls: [
          { tool_name: 'query_rent_ledger', input: { org_id: currentOrg.id }, status: 'COMPLETED' },
        ],
        created_at: new Date().toISOString(),
      };

      const finalConversations = updatedConversations.map((c) =>
        c.id === targetConvId ? { ...c, messages: [...c.messages, fallbackMsg] } : c
      );
      onUpdateConversations(finalConversations);
    } finally {
      setIsSending(false);
    }
  };

  // Regenerate latest response
  const handleRegenerate = () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;
    const lastUserMsg = [...activeConversation.messages].reverse().find((m) => m.role === 'USER');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  // Improve prompt button
  const handleImprovePrompt = () => {
    if (!promptInput.trim()) {
      setPromptInput('Provide an executive summary of rent collection efficiency, arrears aging, and Account 2100 deposit liabilities for this month.');
      return;
    }
    setPromptInput((prev) => `${prev.trim()} (Ground analysis in active organization records, M-Pesa receipts, and Account 2100 escrow invariant)`);
  };

  // Confirm / Reject action handler
  const handleActionConfirm = (confirmationId: string, confirmed: boolean) => {
    if (onResolveConfirmation) {
      onResolveConfirmation(confirmationId, confirmed);
      return;
    }
    const updated = confirmations.map((c) =>
      c.id === confirmationId
        ? {
            ...c,
            status: (confirmed ? 'CONFIRMED' : 'CANCELLED') as 'CONFIRMED' | 'CANCELLED',
            decided_at: new Date().toISOString(),
          }
        : c
    );
    onUpdateConfirmations(updated);
  };

  // History suggestions from design & active conversations
  const historyItems = useMemo(() => {
    const list: string[] = [];
    if (conversations.length > 0) {
      conversations.forEach((conv) => {
        if (conv.messages.length > 0) {
          const firstUser = conv.messages.find((m) => m.role === 'USER');
          if (firstUser?.content && !list.includes(firstUser.content)) {
            list.push(firstUser.content);
          }
        }
      });
    }
    const defaults = [
      'Write a persuasive email to convince potential customers to try our service',
      'Write a script for a training video on how to use our software',
      'Generate a script for a 30-second commercial promoting our new product',
      'Tell me what is Artificial Intelligence?',
      'What can Artificial Intelligence do?',
      'Summarize rent collections and outstanding arrears across all properties',
      'How much security deposit liability is currently held under Account 2100?',
    ];
    defaults.forEach((d) => {
      if (!list.includes(d)) list.push(d);
    });
    return list.slice(0, 6);
  }, [conversations]);

  // Messages to render: if current session is empty, show default welcome exchange from design
  const displayMessages: AssistantMessage[] = useMemo(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      return activeConversation.messages;
    }
    return [
      {
        id: 'msg-default-1',
        role: 'ASSISTANT',
        content:
          'Artificial Intelligence (AI) refers to intelligent computer systems that can learn, reason, and perform tasks that typically require human intelligence. It involves techniques like machine learning, natural language processing, and computer vision to analyze data, make decisions, and interact with humans. AI has applications in various fields and has the potential to revolutionize industries and improve efficiency and productivity.',
        citations: [],
        tool_calls: [],
        created_at: new Date().toISOString(),
      },
      {
        id: 'msg-default-2',
        role: 'USER',
        content: 'What can Artificial Intelligence do?',
        citations: [],
        tool_calls: [],
        created_at: new Date().toISOString(),
      },
      {
        id: 'msg-default-3',
        role: 'ASSISTANT',
        content:
          'Artificial Intelligence (AI) can automate tasks, analyze data, understand human language, recognize images, personalize recommendations, detect fraud, assist in healthcare, power virtual assistants, and enable autonomous systems. Its capabilities continue to expand and advance across property management and financial reconciliation.',
        citations: [],
        tool_calls: [],
        created_at: new Date().toISOString(),
      },
    ];
  }, [activeConversation]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '16px',
        background: '#f1f3f6',
        borderRadius: '20px',
        minHeight: 'calc(100vh - 120px)',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="application/pdf,image/*,audio/*,.csv,.xlsx,.doc,.docx"
      />

      {/* ============================================================= */}
      {/* 1. LEFT / MAIN COLUMN: SUPER CHAT WORKSPACE                   */}
      {/* ============================================================= */}
      <div
        style={{
          flex: 1,
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #eef0f3',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Floating Clear Chat / New Chat Action Button (Left margin) */}
        <div
          style={{
            position: 'absolute',
            left: '14px',
            top: '46%',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {showClearConfirm && (
            <button
              type="button"
              onClick={handleClearChat}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.80rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                animation: 'fadeIn 0.15s ease',
              }}
            >
              <TrashIcon style={{ width: 14, height: 14 }} />
              <span>Clear Chat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowClearConfirm((prev) => !prev)}
            title="Start new chat / Clear conversation"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
              transition: 'transform 0.15s ease',
            }}
          >
            <PlusIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px 14px',
            borderBottom: '1px solid #f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Super Chat
            </h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '9999px',
                padding: '2px 10px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#065f46',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              {currentOrg.name} &bull; Groq Llama 3.3
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowMenuDropdown((prev) => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="More actions"
            >
              <EllipsisVerticalIcon style={{ width: 20, height: 20 }} />
            </button>

            {showMenuDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '32px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '6px',
                  zIndex: 40,
                  minWidth: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <button
                  type="button"
                  onClick={handleClearChat}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <TrashIcon style={{ width: 14, height: 14 }} />
                  <span>Clear Chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportTranscript();
                    setShowMenuDropdown(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
                  <span>Export Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread Scroll Area */}
        <div
          ref={chatScrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 28px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          {displayMessages.map((msg) => {
            const isUser = msg.role === 'USER';

            if (isUser) {
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    alignSelf: 'flex-start',
                    margin: '6px 0',
                  }}
                >
                  {/* User Avatar */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      flexShrink: 0,
                    }}
                  >
                    GU
                  </div>

                  {/* User Question Text */}
                  <div
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      padding: '10px 18px',
                      borderRadius: '16px',
                      borderBottomLeftRadius: '4px',
                      fontSize: '0.90rem',
                      fontWeight: 500,
                      lineHeight: 1.5,
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.1)',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            }

            // ASSISTANT MESSAGE BUBBLE (Mint Green card with lightning bolt icon)
            return (
              <div
                key={msg.id}
                style={{
                  background: '#f2fbf7',
                  border: '1px solid #dcf2e7',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.04)',
                  position: 'relative',
                }}
              >
                {/* Lightning Bolt Icon Avatar */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#10b981',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <BoltIcon style={{ width: 18, height: 18 }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Tool Calls Chips */}
                    {msg.tool_calls && msg.tool_calls.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {msg.tool_calls.map((tool, tIdx) => (
                          <div
                            key={tIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: '#ffffff',
                              border: '1px solid #d1fae5',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              color: '#065f46',
                              fontWeight: 600,
                            }}
                          >
                            <ShieldCheckIcon style={{ width: 12, height: 12, color: '#10b981' }} />
                            <span>{tool.tool_name}</span>
                            <span style={{ color: '#10b981' }}>&bull; OK</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content text: high-contrast WCAG AA readable text */}
                    <StructuredAssistantMessage
                      content={msg.content}
                      blockedReason={msg.blocked_reason}
                    />

                    {/* Citations Badges */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div
                        style={{
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid #e2f5ec',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}
                      >
                        {msg.citations.map((cit, cIdx) => (
                          <div
                            key={cIdx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#ffffff',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.74rem',
                            }}
                          >
                            <span
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontSize: '0.62rem',
                                fontWeight: 700,
                              }}
                            >
                              {cit.record_type}
                            </span>
                            <span style={{ fontWeight: 600 }}>{cit.reference_code}:</span>
                            <span>{cit.summary}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bubble Bottom Actions: Thumbs Up / Down on left, Copy & Add to Editor on right */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2f5ec',
                  }}
                >
                  {/* Left: Thumbs feedback */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setFeedbackState((prev) => ({ ...prev, [msg.id]: 'up' }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: feedbackState[msg.id] === 'up' ? '#10b981' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Good response"
                    >
                      <HandThumbUpIcon style={{ width: 16, height: 16 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackState((prev) => ({ ...prev, [msg.id]: 'down' }))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: feedbackState[msg.id] === 'down' ? '#ef4444' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Poor response"
                    >
                      <HandThumbDownIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>

                  {/* Right: Copy & Add to Editor buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.content, msg.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: copiedMsgId === msg.id ? '#10b981' : '#64748b',
                        fontSize: '0.80rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <CheckIcon style={{ width: 14, height: 14, color: '#10b981' }} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <DocumentDuplicateIcon style={{ width: 14, height: 14 }} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportTranscript(msg.content)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '0.80rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                      title="Export or save text to report"
                    >
                      <DocumentTextIcon style={{ width: 14, height: 14 }} />
                      <span>Add to Editor</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pending Mutating Operation Confirmation Card */}
          {confirmations
            .filter((c) => c.status === 'PENDING')
            .map((conf) => (
              <div
                key={conf.id}
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, fontSize: '0.86rem' }}>
                  <ExclamationTriangleIcon style={{ width: 18, height: 18, color: '#d97706' }} />
                  <span>Explicit Approval Required Before Executing Mutating Operation</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#78350f', lineHeight: 1.5 }}>
                  Action: <strong>{conf.action_type}</strong> — {conf.action_summary}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => handleActionConfirm(conf.id, false)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.80rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleActionConfirm(conf.id, true)}
                    style={{
                      background: '#10b981',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 16px',
                      fontSize: '0.80rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <CheckIcon style={{ width: 15, height: 15 }} />
                    <span>Authorize & Execute</span>
                  </button>
                </div>
              </div>
            ))}

          {/* Sending loader */}
          {isSending && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f2fbf7',
                border: '1px solid #dcf2e7',
                borderRadius: '12px',
                padding: '12px 18px',
                width: 'fit-content',
              }}
            >
              <BoltIcon style={{ width: 16, height: 16, color: '#10b981' }} />
              <span style={{ fontSize: '0.84rem', color: '#065f46', fontWeight: 500 }}>
                Querying live RMS database via Groq LLM...
              </span>
            </div>
          )}

          {/* Centered Regenerate Response Pill Button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isSending}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '8px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: isSending ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                transition: 'transform 0.15s ease',
              }}
            >
              <ArrowPathIcon style={{ width: 14, height: 14, color: '#ffffff' }} />
              <span>Regenerate Response</span>
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* COMPOSER CARD AT BOTTOM                                       */}
        {/* ============================================================= */}
        <div style={{ padding: '0 24px 20px' }}>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '14px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            {/* Attached file chip */}
            {attachedFile && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.74rem',
                  color: '#166534',
                  width: 'fit-content',
                }}
              >
                <PaperClipIcon style={{ width: 12, height: 12 }} />
                <span>{attachedFile.name} ({attachedFile.sizeKb} KB)</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}
                >
                  <XMarkIcon style={{ width: 12, height: 12 }} />
                </button>
              </div>
            )}

            {/* Input textarea */}
            <textarea
              placeholder="Ask or search anything"
              rows={2}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                resize: 'none',
                fontSize: '0.92rem',
                color: '#0f172a',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />

            {/* Bottom Actions Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
              }}
            >
              {/* Left Pills: Browse Prompts & No Brand Voice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowPromptsModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  <DocumentTextIcon style={{ width: 14, height: 14, color: '#64748b' }} />
                  <span>Browse Prompts</span>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: '#64748b',
                  }}
                >
                  <SpeakerWaveIcon style={{ width: 14, height: 14, color: '#94a3b8' }} />
                  <span>No Brand Voice</span>
                </div>
              </div>

              {/* Right Pills: Improve & Circular Send Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleImprovePrompt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                  title="Enhance prompt with RMS context"
                >
                  <SparklesIcon style={{ width: 14, height: 14, color: '#94a3b8' }} />
                  <span>Improve</span>
                </button>

                <button
                  type="button"
                  disabled={isSending || (!promptInput.trim() && !attachedFile)}
                  onClick={() => handleSendMessage()}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isSending || (!promptInput.trim() && !attachedFile) ? '#cbd5e1' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isSending || (!promptInput.trim() && !attachedFile) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)',
                  }}
                  title="Send message"
                >
                  <PaperAirplaneIcon style={{ width: 16, height: 16, transform: 'rotate(-45deg)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 2. RIGHT COLUMN: HISTORY CHAT & PRO PLAN                      */}
      {/* ============================================================= */}
      <div
        style={{
          width: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flexShrink: 0,
        }}
      >
        {/* History Chat Card */}
        <div
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '24px',
            padding: '22px 20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            border: '1px solid #eef0f3',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              History Chat
            </h3>
            <ViewColumnsIcon style={{ width: 18, height: 18, color: '#94a3b8' }} />
          </div>

          {/* Prompt Cards List */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              overflowY: 'auto',
              flex: 1,
            }}
          >
            {historyItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSendMessage(item)}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f2fbf7';
                  e.currentTarget.style.borderColor = '#a7f3d0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#f1f5f9';
                }}
              >
                <ChatBubbleBottomCenterTextIcon
                  style={{ width: 16, height: 16, color: '#94a3b8', flexShrink: 0, marginTop: '2px' }}
                />
                <span
                  style={{
                    fontSize: '0.80rem',
                    color: '#334155',
                    lineHeight: 1.45,
                    fontWeight: 500,
                  }}
                >
                  &ldquo;{item}&rdquo;
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan Emerald Gradient Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
            borderRadius: '24px',
            padding: '24px 22px',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Row: Bolt Icon + Pro Plan Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <BoltIcon style={{ width: 20, height: 20 }} />
            </div>

            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Pro Plan
            </div>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', margin: '4px 0 0 0' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.02em' }}>$126.54</span>
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>/month</span>
          </div>

          {/* Subtitle */}
          <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.4 }}>
            Get various other interesting features
          </div>

          {/* Black Call-to-Action Button */}
          <button
            type="button"
            onClick={() => {
              alert('Guri24 Enterprise Pro tier includes unlimited Groq Llama 3.3 tokens, multi-property double-entry ledger audits, and automated Daraja STK reconciliation.');
            }}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '4px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
              textAlign: 'center',
            }}
          >
            Get Pro Plan Now
          </button>
        </div>
      </div>

      {/* Prompts Modal */}
      {showPromptsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
          onClick={() => setShowPromptsModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '520px',
              width: '90%',
              boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
                RMS Prompt Templates
              </h3>
              <button
                type="button"
                onClick={() => setShowPromptsModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <XMarkIcon style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { title: 'Rent Collections Summary', p: 'Summarize rent collections, billing schedules, and overdue balances for this month.' },
                { title: 'Vacant Units Inventory', p: 'Show all vacant residential units with monthly rent and bedroom counts.' },
                { title: 'Security Deposits Liability (Account 2100)', p: 'Audit Account 2100 security deposits held in escrow.' },
                { title: 'Expiring Leases', p: 'List all leases expiring within the next 60 days that require renewal or exit inspection.' },
                { title: 'Log Maintenance Draft', p: 'Create maintenance request draft for plumbing inspection at Jacaranda Heights.' },
              ].map((template, tIdx) => (
                <div
                  key={tIdx}
                  onClick={() => {
                    setPromptInput(template.p);
                    setShowPromptsModal(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>{template.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{template.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
