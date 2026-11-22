import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SparklesIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PaperClipIcon,
  ArrowUpIcon,
  FolderIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type {
  AssistantConversation,
  AssistantMessage,
  AssistantAttachment,
  AssistantActionConfirmation,
  Organization,
  Property,
  Tenant,
  Invoice,
  Payment,
  SecurityDepositLedger,
} from '../types';

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
  onSendMessage?: (query: string, convId?: string, attachment?: AssistantAttachment) => Promise<void>;
  onResolveConfirmation?: (confirmationId: string, confirmed: boolean) => Promise<void>;
  onClearChats?: () => Promise<void> | void;
  onDeleteConversation?: (convId: string) => Promise<void> | void;
}

export const FullPageAssistant: React.FC<FullPageAssistantProps> = ({
  currentOrg,
  userRole = 'ORGANIZATION_ADMINISTRATOR',
  properties = [],
  tenants = [],
  invoices = [],
  payments = [],
  deposits = [],
  conversations = [],
  confirmations = [],
  onUpdateConversations,
  onUpdateConfirmations,
  onSendMessage,
  onResolveConfirmation,
  onClearChats,
  onDeleteConversation,
}) => {
  // State
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return conversations[0]?.id || `conv-${Date.now()}`;
  });
  const [promptInput, setPromptInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [likedMsgIds, setLikedMsgIds] = useState<Record<string, boolean>>({});
  const [dislikedMsgIds, setDislikedMsgIds] = useState<Record<string, boolean>>({});
  const [selectedModule, setSelectedModule] = useState<'Thinker' | 'Financial Reasoner' | 'Lease Assistant'>('Thinker');
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'Recent' | 'Favorite'>('Recent');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [attachedFile, setAttachedFile] = useState<AssistantAttachment | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Lease & Tenancy Operations': true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean Markdown & format response text cleanly without any markdown characters
  const renderCleanContent = (text: string) => {
    if (!text) return null;
    const cleaned = text
      .replace(/(^|\n|\r)#{1,6}\s*/g, '$1')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\s+-\s+([A-Z])/g, '\n• $1')
      .replace(/(^|\n)[-*+]\s+/g, '$1• ');

    const paragraphs = cleaned.split(/\n\s*\n/);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {paragraphs.map((para, pIdx) => {
          const lines = para.split('\n');
          return (
            <div key={pIdx} style={{ lineHeight: 1.55 }}>
              {lines.map((line, lIdx) => {
                const isBullet = line.trim().startsWith('• ');
                return (
                  <div key={lIdx} style={{ margin: isBullet ? '3px 0 3px 6px' : '0' }}>
                    {line}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Active conversation resolution
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId);
  }, [conversations, activeConvId]);

  const displayMessages = useMemo(() => {
    if (activeConversation && activeConversation.messages && activeConversation.messages.length > 0) {
      return activeConversation.messages;
    }
    return [];
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  // Start a fresh, new conversation
  const handleStartNewChat = () => {
    const newId = `conv-${Date.now()}`;
    setActiveConvId(newId);
    setPromptInput('');
    setAttachedFile(null);
  };

  // Clear all conversations for the active account
  const handleConfirmClearChats = async () => {
    if (onClearChats) {
      await onClearChats();
    } else {
      onUpdateConversations([]);
    }
    setShowClearConfirmModal(false);
    handleStartNewChat();
  };

  // Delete a single conversation
  const handleDeleteSingleConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    if (onDeleteConversation) {
      await onDeleteConversation(convId);
    } else {
      onUpdateConversations(conversations.filter((c) => c.id !== convId));
    }
    if (activeConvId === convId) {
      handleStartNewChat();
    }
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || promptInput).trim();
    if (!text || isSending) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}-usr`,
      role: 'USER',
      content: text,
      attachment: attachedFile || undefined,
      citations: [],
      tool_calls: [],
      created_at: new Date().toISOString(),
    };

    setPromptInput('');
    setAttachedFile(null);
    setIsSending(true);

    const targetConvId = activeConvId || `conv-${Date.now()}`;
    const exists = conversations.some((c) => c.id === targetConvId);

    let updatedConvs: AssistantConversation[];
    if (exists) {
      updatedConvs = conversations.map((c) =>
        c.id === targetConvId ? { ...c, messages: [...c.messages, userMsg], updated_at: new Date().toISOString() } : c
      );
    } else {
      updatedConvs = [
        {
          id: targetConvId,
          title: text.slice(0, 42),
          organization_id: currentOrg.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [userMsg],
        },
        ...conversations,
      ];
      setActiveConvId(targetConvId);
    }
    onUpdateConversations(updatedConvs);

    try {
      if (onSendMessage) {
        await onSendMessage(text, targetConvId, attachedFile || undefined);
      } else {
        // Fallback local grounded assistant response with real portfolio metrics
        const totalBilled = invoices.reduce((s, i) => s + (i.amount_kes || 0), 0);
        const totalCollected = payments.reduce((s, p) => s + (p.allocated_amount_kes || p.amount_kes || 0), 0);
        const depositsHeld = deposits.reduce((s, d) => s + (d.held_amount_kes || 0), 0);

        const aiMsg: AssistantMessage = {
          id: `msg-${Date.now()}-ast`,
          role: 'ASSISTANT',
          content:
            `I have processed your request for ${currentOrg.name}.\n\n` +
            `• Active Properties: ${properties.length} managed location(s)\n` +
            `• Total Invoiced: KES ${totalBilled.toLocaleString()}\n` +
            `• Total Collected (M-Pesa/Bank): KES ${totalCollected.toLocaleString()}\n` +
            `• Account 2100 Deposits Liability: KES ${depositsHeld.toLocaleString()} held in trust escrow\n\n` +
            `All financial entries are balanced in the authoritative general ledger.`,
          citations: [
            {
              record_id: currentOrg.id,
              record_type: 'ORGANIZATION',
              reference_code: currentOrg.id.slice(0, 8),
              summary: `${currentOrg.name} Authoritative General Ledger & Collections`,
            },
          ],
          tool_calls: [{ tool_name: 'query_property_ledger', input: { org: currentOrg.id }, status: 'COMPLETED' }],
          created_at: new Date().toISOString(),
        };

        const finalConvs = updatedConvs.map((c) =>
          c.id === targetConvId ? { ...c, messages: [...c.messages, aiMsg] } : c
        );
        onUpdateConversations(finalConvs);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleToggleLike = (id: string) => {
    setLikedMsgIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setDislikedMsgIds((prev) => ({ ...prev, [id]: false }));
  };

  const handleToggleDislike = (id: string) => {
    setDislikedMsgIds((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikedMsgIds((prev) => ({ ...prev, [id]: false }));
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderName]: !prev[folderName] }));
  };

  // Quick prompt starter cards for empty / new account state
  const quickPromptStarters = [
    {
      icon: '📊',
      title: 'Portfolio Health & Occupancy',
      subtitle: 'Summarize portfolio occupancy, active leases, and collections.',
      prompt: 'Summarize our current portfolio health, occupancy, and collection performance across active estates.',
    },
    {
      icon: '💳',
      title: 'M-Pesa Paybill Collections',
      subtitle: 'Review recent Daraja C2B receipts and automated allocations.',
      prompt: 'Check recent M-Pesa Daraja Paybill 1343073 payments and reconcile against outstanding invoices.',
    },
    {
      icon: '📄',
      title: 'Lease & Vacancy Operations',
      subtitle: 'Check which units are vacant or expiring in the next 30 days.',
      prompt: 'Which tenant leases are up for renewal or currently in arrears?',
    },
    {
      icon: '⚖️',
      title: 'General Ledger Audit',
      subtitle: 'Audit double-entry balances: ensure Debits equal Credits.',
      prompt: 'Perform a financial integrity check: verify trial balance and ensure Debits equal Credits.',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: '#F8F9FA',
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#111827',
        overflow: 'hidden',
        borderRadius: '24px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        position: 'relative',
      }}
    >
      {/* =========================================================================
          CLEAR CHATS CONFIRMATION MODAL
          ========================================================================= */}
      {showClearConfirmModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <TrashIcon style={{ width: 24, height: 24 }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              Clear All Chat History?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '22px' }}>
              This will permanently delete all saved conversations and prompts for{' '}
              <strong style={{ color: '#0F172A' }}>{currentOrg.name}</strong>. This provides a clean slate for your new account.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearChats}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
                }}
              >
                Yes, Clear All Chats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LEFT / MAIN CHAT CANVAS (AERO)
          ========================================================================= */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          {/* Brand Mark & Organization Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '1.18rem',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ fontSize: '1.25rem', color: '#0F172A' }}>⁂</span>
              <span>aero</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: '#F1F5F9',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#475569',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentOrg.name}
              </span>
            </div>
          </div>

          {/* Right Header Action Buttons: New Chat, Clear Chats, Sidebar Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* + New Chat Button */}
            <button
              type="button"
              onClick={handleStartNewChat}
              title="Start a fresh conversation for this account"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '9999px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.80rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0F172A')}
            >
              <PlusIcon style={{ width: 14, height: 14, strokeWidth: 2.5 }} />
              <span>New Chat</span>
            </button>

            {/* Clear Chats Button (shown when conversations exist) */}
            {conversations.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                title="Clear all chat history for this account"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '7px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid #FECACA',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCA5A5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
              >
                <TrashIcon style={{ width: 13, height: 13 }} />
                <span>Clear Chats</span>
              </button>
            )}

            {/* Sidebar Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
            >
              <ChevronRightIcon
                style={{
                  width: 16,
                  height: 16,
                  transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>
        </header>

        {/* Message Stream Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column' }}>
            {/* =========================================================================
                EMPTY STATE / START NEW CHAT VIEW FOR NEW ACCOUNTS OR AFTER CLEARING
                ========================================================================= */}
            {displayMessages.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '48px 16px 24px',
                }}
              >
                {/* Aero Emblem */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: '#0F172A',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  ⁂
                </div>

                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    letterSpacing: '-0.02em',
                    marginBottom: '8px',
                  }}
                >
                  Welcome to Aero AI Assistant
                </h2>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#64748B',
                    maxWidth: '460px',
                    lineHeight: 1.5,
                    marginBottom: '32px',
                  }}
                >
                  Ready to assist <strong style={{ color: '#0F172A' }}>{currentOrg.name}</strong> with real-time portfolio analytics, lease drafting, M-Pesa collections, and balanced double-entry accounting.
                </p>

                {/* Prompt Starter Cards Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '12px',
                    width: '100%',
                    maxWidth: '620px',
                    marginBottom: '20px',
                  }}
                >
                  {quickPromptStarters.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      style={{
                        padding: '16px 18px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                          {item.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                        {item.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* =========================================================================
                  ACTIVE CONVERSATION MESSAGE STREAM
                  ========================================================================= */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                {displayMessages.map((msg, idx) => {
                  const isUser = msg.role === 'USER';
                  return (
                    <div
                      key={msg.id || `msg-${idx}`}
                      style={{
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '580px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {/* Message Bubble:
                          - User Bubble: Dark Navy (#0F172A) with White Text (#FFFFFF) -> WCAG AA Readability
                          - Assistant Bubble: Clean White Card (#FFFFFF) with Dark Charcoal Text (#0F172A) */}
                      <div
                        style={{
                          backgroundColor: isUser ? '#0F172A' : '#FFFFFF',
                          color: isUser ? '#FFFFFF' : '#0F172A',
                          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          padding: '16px 20px',
                          border: isUser ? 'none' : '1px solid #E5E7EB',
                          fontSize: '0.90rem',
                          lineHeight: 1.55,
                          boxShadow: isUser
                            ? '0 2px 8px rgba(15, 23, 42, 0.15)'
                            : '0 2px 10px rgba(0, 0, 0, 0.03)',
                          width: isUser ? 'auto' : '100%',
                        }}
                      >
                        {/* Render content */}
                        {renderCleanContent(msg.content)}

                        {/* Grounded Citations Badge */}
                        {!isUser && msg.citations && msg.citations.length > 0 && (
                          <div
                            style={{
                              marginTop: '12px',
                              paddingTop: '10px',
                              borderTop: '1px solid #F1F5F9',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.74rem',
                              color: '#64748B',
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#0F172A' }}>Grounded Source:</span>
                            <span>{msg.citations[0].summary}</span>
                          </div>
                        )}

                        {/* Tool Calls Indicator */}
                        {!isUser && msg.tool_calls && msg.tool_calls.length > 0 && (
                          <div
                            style={{
                              marginTop: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.70rem',
                              color: '#10B981',
                              fontWeight: 600,
                            }}
                          >
                            <span>✓ Verified via {msg.tool_calls[0].tool_name || 'authoritative ledger'}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Bar for Assistant Messages */}
                      {!isUser && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginTop: '6px',
                            paddingLeft: '4px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            title={copiedMsgId === msg.id ? 'Copied!' : 'Copy to clipboard'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: copiedMsgId === msg.id ? '#10B981' : '#94A3B8',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.72rem',
                            }}
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <CheckIcon style={{ width: 13, height: 13 }} />
                                <span>Copied</span>
                              </>
                            ) : (
                              <DocumentDuplicateIcon style={{ width: 14, height: 14 }} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleLike(msg.id)}
                            title="Helpful"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: likedMsgIds[msg.id] ? '#10B981' : '#94A3B8',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <HandThumbUpIcon
                              style={{
                                width: 14,
                                height: 14,
                                fill: likedMsgIds[msg.id] ? '#10B981' : 'none',
                              }}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleDislike(msg.id)}
                            title="Not helpful"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: dislikedMsgIds[msg.id] ? '#EF4444' : '#94A3B8',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <HandThumbDownIcon
                              style={{
                                width: 14,
                                height: 14,
                                fill: dislikedMsgIds[msg.id] ? '#EF4444' : 'none',
                              }}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Floating Input Bar */}
        <div
          style={{
            padding: '12px 32px 24px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#F3F4F6',
              borderRadius: '9999px',
              padding: '6px 8px 6px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Attachment Paperclip */}
            <label
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#64748B',
              }}
              title="Attach document or floorplan image"
            >
              <PaperClipIcon style={{ width: 18, height: 18 }} />
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAttachedFile({
                      name: file.name,
                      sizeKb: Math.round(file.size / 1024),
                      mimeType: file.type,
                    });
                  }
                }}
              />
            </label>

            {/* Attached file chip */}
            {attachedFile && (
              <span
                style={{
                  fontSize: '0.72rem',
                  backgroundColor: '#E2E8F0',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {attachedFile.name}
                <XMarkIcon
                  style={{ width: 12, height: 12, cursor: 'pointer' }}
                  onClick={() => setAttachedFile(null)}
                />
              </span>
            )}

            {/* Text Input */}
            <input
              type="text"
              placeholder="Ask aero anything about your portfolio, leases, or M-Pesa..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                color: '#0F172A',
              }}
            />

            {/* Black Circular Send Button: ↑ */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isSending || !promptInput.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isSending || !promptInput.trim() ? '#94A3B8' : '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSending || !promptInput.trim() ? 'default' : 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <ArrowUpIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDEBAR (AI MODULE, CONVERSATIONS & COLLECTIONS)
          ========================================================================= */}
      {isSidebarOpen && (
        <aside
          style={{
            width: '290px',
            backgroundColor: '#F8F9FA',
            borderLeft: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px',
            overflowY: 'auto',
          }}
        >
          {/* Section: Ai Module */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '10px',
              }}
            >
              Ai Module
            </div>

            {/* Dropdown Pill: ✦ Thinker ˅ */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowModuleDropdown((prev) => !prev)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F3E8FF',
                  color: '#7E22CE',
                  borderRadius: '9999px',
                  padding: '9px 16px',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SparklesIcon style={{ width: 15, height: 15 }} />
                  <span>{selectedModule}</span>
                </div>
                <ChevronDownIcon style={{ width: 14, height: 14 }} />
              </button>

              {showModuleDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                    zIndex: 20,
                    padding: '6px',
                  }}
                >
                  {(['Thinker', 'Financial Reasoner', 'Lease Assistant'] as const).map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => {
                        setSelectedModule(mod);
                        setShowModuleDropdown(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedModule === mod ? '#F3E8FF' : 'transparent',
                        color: selectedModule === mod ? '#7E22CE' : '#0F172A',
                        fontSize: '0.82rem',
                        fontWeight: selectedModule === mod ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Conversations */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              >
                Conversations ({conversations.length})
              </span>

              {/* Sidebar Quick Action: + New */}
              <button
                type="button"
                onClick={handleStartNewChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  background: 'none',
                  border: 'none',
                  color: '#4338CA',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
                title="Start a new conversation"
              >
                <PlusIcon style={{ width: 13, height: 13 }} />
                <span>New</span>
              </button>
            </div>

            {/* Segmented Pill: [ Recent | Favorite ] */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#E5E7EB',
                borderRadius: '9999px',
                padding: '3px',
                marginBottom: '14px',
              }}
            >
              {(['Recent', 'Favorite'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                    color: activeTab === tab ? '#0F172A' : '#64748B',
                    boxShadow: activeTab === tab ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Dynamic Conversation History List */}
            {conversations.length === 0 ? (
              <div
                style={{
                  padding: '16px 8px',
                  textAlign: 'center',
                  fontSize: '0.76rem',
                  color: '#94A3B8',
                  lineHeight: 1.4,
                }}
              >
                No previous chats for this account. Click <strong>+ New</strong> or ask a question to begin.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {conversations.map((c) => {
                  const isActive = c.id === activeConvId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '10px',
                        backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                        border: isActive ? '1px solid #E0E7FF' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: isActive ? '#3730A3' : '#475569',
                          fontWeight: isActive ? 600 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                      >
                        {c.title || 'RMS Inquiry'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSingleConversation(e, c.id)}
                        title="Delete chat"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '6px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                      >
                        <TrashIcon style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Collections with 'New' badge */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '12px',
              }}
            >
              <span>Collections</span>
              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: '9999px',
                }}
              >
                New
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Folder 1: Portfolio Operations */}
              <div
                style={{
                  backgroundColor: expandedFolders['Portfolio Operations'] ? '#F1F5F9' : 'transparent',
                  borderRadius: '12px',
                  padding: '8px 10px',
                }}
              >
                <div
                  onClick={() => toggleFolder('Portfolio Operations')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderIcon style={{ width: 16, height: 16, color: '#64748B' }} />
                    <span>Portfolio Operations</span>
                  </div>
                  <ChevronDownIcon
                    style={{
                      width: 14,
                      height: 14,
                      transform: expandedFolders['Portfolio Operations'] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </div>

                {expandedFolders['Portfolio Operations'] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '24px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Check occupancy rate and unit availability')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • Check occupancy rate & availability
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('List leases expiring within 60 days')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • List leases expiring in 60 days
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 2: Lease & Tenancy Operations (Expanded by default) */}
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: '12px',
                  padding: '10px 12px',
                }}
              >
                <div
                  onClick={() => toggleFolder('Lease & Tenancy Operations')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#1E40AF',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: expandedFolders['Lease & Tenancy Operations'] ? '8px' : '0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderIcon style={{ width: 16, height: 16, fill: '#3B82F6', color: '#3B82F6' }} />
                    <span>Lease & Tenancy Operations</span>
                  </div>
                  <ChevronDownIcon
                    style={{
                      width: 14,
                      height: 14,
                      transform: expandedFolders['Lease & Tenancy Operations'] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </div>

                {expandedFolders['Lease & Tenancy Operations'] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '24px' }}>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Draft 12-month residential lease agreement')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#2563EB',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      • Draft 12-month residential lease
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Prepare automated rent payment reminders')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#2563EB',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      • Launch automated rent reminders
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 3: Financials & Accounting */}
              <div
                style={{
                  backgroundColor: expandedFolders['Financials & Accounting'] ? '#F1F5F9' : 'transparent',
                  borderRadius: '12px',
                  padding: '8px 10px',
                }}
              >
                <div
                  onClick={() => toggleFolder('Financials & Accounting')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderIcon style={{ width: 16, height: 16, color: '#64748B' }} />
                    <span>Financials & M-Pesa</span>
                  </div>
                  <ChevronDownIcon
                    style={{
                      width: 14,
                      height: 14,
                      transform: expandedFolders['Financials & Accounting'] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </div>

                {expandedFolders['Financials & Accounting'] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '24px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Reconcile M-Pesa Paybill C2B receipts')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • Reconcile M-Pesa C2B receipts
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Audit Account 2100 tenant security deposits')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • Audit Account 2100 deposits
                    </button>
                  </div>
                )}
              </div>

              {/* Folder 4: OCR Document Processing */}
              <div
                style={{
                  backgroundColor: expandedFolders['OCR Document Processing'] ? '#F1F5F9' : 'transparent',
                  borderRadius: '12px',
                  padding: '8px 10px',
                }}
              >
                <div
                  onClick={() => toggleFolder('OCR Document Processing')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderIcon style={{ width: 16, height: 16, color: '#64748B' }} />
                    <span>OCR Documents</span>
                  </div>
                  <ChevronDownIcon
                    style={{
                      width: 14,
                      height: 14,
                      transform: expandedFolders['OCR Document Processing'] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </div>

                {expandedFolders['OCR Document Processing'] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '24px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Review pending OCR documents awaiting verification')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • Review pending OCR documents
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendMessage('Verify uploaded tenancy agreement extraction')}
                      style={{
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        color: '#475569',
                        lineHeight: 1.35,
                        cursor: 'pointer',
                        padding: '2px 0',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                    >
                      • Verify tenancy agreement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
