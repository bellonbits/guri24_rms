import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Paperclip,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  X,
  Lock,
  Building,
  Users,
  Check,
  FileText,
  ShieldAlert,
  CircleDollarSign,
  Copy,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  CornerDownLeft,
  Wrench,
  Clock,
  Layers,
  FileCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';
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
  onNavigateTab?: (tab: string) => void;
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
  onNavigateTab,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return conversations[0]?.id || 'conv-0001';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    sizeKb: number;
    mimeType: string;
    kind: 'document' | 'audio' | 'image';
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Financial KPIs for the right context panel
  const totalBilled = useMemo(
    () => invoices.reduce((sum, inv) => sum + (Number(inv.total_amount_kes) || 0), 0),
    [invoices]
  );
  const totalCollected = useMemo(
    () => payments.reduce((sum, p) => sum + (Number(p.allocated_amount_kes) || 0), 0),
    [payments]
  );
  const totalArrears = useMemo(
    () => invoices.reduce((sum, inv) => sum + (Number(inv.balance_kes) || 0), 0),
    [invoices]
  );
  const totalDepositsHeld = useMemo(
    () => deposits.reduce((sum, d) => sum + (Number(d.current_liability_balance_kes) || 0), 0),
    [deposits]
  );
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  // Active conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0] || null;
  }, [conversations, activeConvId]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isSending]);

  // New conversation handler
  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: AssistantConversation = {
      id: newId,
      organization_id: currentOrg.id,
      title: 'New Investigation',
      updated_at: new Date().toISOString(),
      messages: [],
    };
    const updated = [newConv, ...conversations];
    onUpdateConversations(updated);
    setActiveConvId(newId);
    setShowMobileSidebar(false);
  };

  // Delete conversation handler
  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    onUpdateConversations(updated);
    if (activeConvId === id) {
      setActiveConvId(updated[0]?.id || '');
    }
    setDeleteConfirmId(null);
  };

  // Rename conversation handler
  const handleSaveRename = (id: string) => {
    if (!editTitleText.trim()) {
      setIsEditingTitle(null);
      return;
    }
    const updated = conversations.map((c) =>
      c.id === id ? { ...c, title: editTitleText.trim(), updated_at: new Date().toISOString() } : c
    );
    onUpdateConversations(updated);
    setIsEditingTitle(null);
  };

  // Copy message text
  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
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
      kind,
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

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}-usr`,
      role: 'USER',
      content,
      attachment,
      citations: [],
      tool_calls: [],
      created_at: new Date().toISOString(),
    };

    // Optimistically update conversation
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
    setPromptInput('');
    setAttachedFile(null);
    setIsSending(true);

    try {
      // Call backend AI assistant chat API
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
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'ASSISTANT',
        content: `Error: Unable to complete request via Groq AI adapter (${err?.message || 'Server error'}). Check backend integration credentials.`,
        citations: [],
        tool_calls: [],
        created_at: new Date().toISOString(),
      };
      const finalConversations = updatedConversations.map((c) =>
        c.id === targetConvId ? { ...c, messages: [...c.messages, errorMsg] } : c
      );
      onUpdateConversations(finalConversations);
    } finally {
      setIsSending(false);
    }
  };

  // Confirm / Reject action handler
  const handleActionConfirm = (confirmationId: string, confirmed: boolean) => {
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

  const quickActionCards = [
    {
      title: 'Summarize Rent Collections',
      desc: 'Verify month-to-date collections vs outstanding arrears',
      prompt: 'Summarize rent collections and outstanding arrears across all properties.',
      icon: <CircleDollarSign size={18} color="#2563eb" />,
    },
    {
      title: 'Vacant Units Inventory',
      desc: 'List vacant apartments ready for tenant onboarding',
      prompt: 'Show all vacant residential units with monthly rent and bedroom counts.',
      icon: <Building size={18} color="#059669" />,
    },
    {
      title: 'Security Deposits Liability',
      desc: 'Audit Account 2100 security deposits held',
      prompt: 'How much security deposit liability is currently held under Account 2100?',
      icon: <ShieldAlert size={18} color="#d97706" />,
    },
    {
      title: 'Expiring Leases (60 Days)',
      desc: 'Identify leases due for renewal or exit inspection',
      prompt: 'List all leases expiring within the next 60 days that require renewal.',
      icon: <FileCheck size={18} color="#7c3aed" />,
    },
    {
      title: 'Log Maintenance Ticket',
      desc: 'Prepare repair draft with plumber or electrician dispatch',
      prompt: 'Create maintenance request draft for plumbing inspection at Jacaranda Heights.',
      icon: <Wrench size={18} color="#ea580c" />,
    },
    {
      title: 'Unallocated Payments',
      desc: 'Find M-Pesa receipts requiring invoice matching',
      prompt: 'Find verified payments that have unallocated amounts waiting for invoice allocation.',
      icon: <RotateCcw size={18} color="#0284c7" />,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 72px)',
        width: '100%',
        background: '#f8fafc',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="application/pdf,image/*,audio/*,.csv,.xlsx,.doc,.docx"
      />

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR: CONVERSATION HISTORY                         */}
      {/* ------------------------------------------------------------- */}
      <aside
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          zIndex: 20,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <button
            type="button"
            onClick={handleNewConversation}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)',
            }}
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>

          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f1f5f9',
              borderRadius: '6px',
              padding: '6px 10px',
              marginTop: '10px',
            }}
          >
            <Search size={14} color="#64748b" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.78rem',
                color: '#0f172a',
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '6px 8px' }}>
            Recent Conversations ({filteredConversations.length})
          </div>

          {filteredConversations.length === 0 ? (
            <div style={{ padding: '16px 8px', textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem' }}>
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversation?.id;
              const isEditing = isEditingTitle === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (!isEditing) {
                      setActiveConvId(conv.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    background: isActive ? '#eff6ff' : 'transparent',
                    border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isEditing ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                      <input
                        type="text"
                        value={editTitleText}
                        onChange={(e) => setEditTitleText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(conv.id);
                          if (e.key === 'Escape') setIsEditingTitle(null);
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          fontSize: '0.8rem',
                          padding: '3px 6px',
                          border: '1px solid #2563eb',
                          borderRadius: '4px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveRename(conv.id)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#16a34a' }}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '6px' }}>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? '#1d4ed8' : '#334155',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {conv.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                        </div>
                      </div>

                      {isActive && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          <button
                            type="button"
                            title="Rename"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditingTitle(conv.id);
                              setEditTitleText(conv.title);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '3px',
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(conv.id);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              padding: '3px',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Organization / User Badge in sidebar footer */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid #f1f5f9',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#2563eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {currentOrg.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#0f172a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentOrg.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{userRole}</div>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. CENTER ARENA: CONVERSATION WORKSPACE                       */}
      {/* ------------------------------------------------------------- */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Top Navbar */}
        <header
          style={{
            height: '52px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#1d4ed8',
              }}
            >
              <Bot size={15} color="#2563eb" />
              <span>Groq Llama 3.3 70B &bull; RMS Intelligence</span>
            </div>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.72rem',
                color: '#16a34a',
                background: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#16a34a',
                }}
              />
              Grounded &bull; RBAC Active
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.74rem',
                color: '#64748b',
              }}
            >
              <Lock size={12} color="#16a34a" />
              <span>Strict Org Isolation</span>
            </div>

            <button
              type="button"
              onClick={() => setShowRightPanel(!showRightPanel)}
              title={showRightPanel ? 'Hide Intelligence Panel' : 'Show Intelligence Panel'}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {showRightPanel ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              <span>{showRightPanel ? 'Hide Context' : 'Context'}</span>
            </button>
          </div>
        </header>

        {/* Conversation Stream or Hero Welcome */}
        <div
          ref={chatScrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {(!activeConversation || activeConversation.messages.length === 0) ? (
            /* Welcome Hero View */
            <div
              style={{
                margin: 'auto 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '780px',
                width: '100%',
                alignSelf: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                <Sparkles size={28} />
              </div>

              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                Guri24 RMS Intelligence Workspace
              </h1>
              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#64748b',
                  margin: '0 0 28px 0',
                  maxWidth: '560px',
                  lineHeight: 1.5,
                }}
              >
                Ask operational questions, analyze real rental ledgers, verify M-Pesa collections, audit Account 2100 security deposits, and draft maintenance requests.
              </p>

              {/* Quick Action Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                  gap: '12px',
                  width: '100%',
                }}
              >
                {quickActionCards.map((card, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendMessage(card.prompt)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ marginTop: '2px' }}>{card.icon}</div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px', lineHeight: 1.35 }}>
                        {card.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Message Thread */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '860px', width: '100%', margin: '0 auto' }}>
              {activeConversation.messages.map((msg) => {
                const isUser = msg.role === 'USER';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignSelf: isUser ? 'flex-end' : 'stretch',
                      maxWidth: isUser ? '85%' : '100%',
                    }}
                  >
                    {/* Header info */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        gap: '8px',
                        marginBottom: '4px',
                        fontSize: '0.74rem',
                        color: '#64748b',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: isUser ? '#0f172a' : '#2563eb' }}>
                        {isUser ? 'Property Admin' : 'Guri24 RMS AI'}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Chat Bubble with STRICT HIGH-CONTRAST COLORS */}
                    {isUser ? (
                      /* USER BUBBLE: Dark navy background with crisp white text */
                      <div
                        style={{
                          background: '#0f172a',
                          color: '#ffffff',
                          padding: '12px 18px',
                          borderRadius: '16px',
                          borderBottomRightRadius: '4px',
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
                        }}
                      >
                        {msg.attachment && (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#1e293b',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.74rem',
                              color: '#93c5fd',
                              marginBottom: '8px',
                            }}
                          >
                            <Paperclip size={12} />
                            <span>{msg.attachment.name}</span>
                          </div>
                        )}
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      </div>
                    ) : (
                      /* ASSISTANT BUBBLE: Clean white card, crisp #0f172a black text, NEVER white text on white! */
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '16px',
                          borderBottomLeftRadius: '4px',
                          padding: '18px 22px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        {/* Tool Execution Chips */}
                        {msg.tool_calls && msg.tool_calls.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                            {msg.tool_calls.map((tool, tIdx) => (
                              <div
                                key={tIdx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  background: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  padding: '3px 8px',
                                  fontSize: '0.72rem',
                                  color: '#334155',
                                }}
                              >
                                <Zap size={11} color="#2563eb" />
                                <span style={{ fontWeight: 600 }}>{tool.tool_name}</span>
                                <span style={{ color: '#16a34a', fontWeight: 700 }}>&bull; OK</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Content text: Explicit readable black text */}
                        <div
                          style={{
                            fontSize: '0.88rem',
                            lineHeight: 1.65,
                            color: '#0f172a',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {msg.content}
                        </div>

                        {/* Citations / Record Badges */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div
                            style={{
                              marginTop: '14px',
                              paddingTop: '12px',
                              borderTop: '1px solid #f1f5f9',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                              alignItems: 'center',
                            }}
                          >
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                              Persisted Sources:
                            </span>
                            {msg.citations.map((cit, cIdx) => (
                              <span
                                key={cIdx}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: '#eff6ff',
                                  border: '1px solid #bfdbfe',
                                  color: '#1d4ed8',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                }}
                              >
                                <span style={{ color: '#2563eb', fontWeight: 700 }}>[{cit.record_type}]</span>
                                <span>{cit.reference_code}: {cit.summary}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Copy button & Actions */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '8px',
                            marginTop: '10px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'transparent',
                              border: 'none',
                              color: copiedMsgId === msg.id ? '#16a34a' : '#64748b',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              padding: '2px 6px',
                            }}
                          >
                            {copiedMsgId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pending Action Confirmation Card */}
              {confirmations
                .filter((c) => c.status === 'PENDING')
                .map((conf) => (
                  <div
                    key={conf.id}
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e', fontWeight: 700, fontSize: '0.84rem' }}>
                      <AlertTriangle size={18} color="#d97706" />
                      <span>Explicit Approval Required Before Executing Mutating Operation</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5 }}>
                      Action: <strong>{conf.action_type}</strong> — {conf.action_summary}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleActionConfirm(conf.id, false)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
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
                          background: '#16a34a',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={14} />
                        <span>Authorize & Execute</span>
                      </button>
                    </div>
                  </div>
                ))}

              {/* Typing / Loading indicator */}
              {isSending && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    width: 'fit-content',
                  }}
                >
                  <Bot size={16} color="#2563eb" />
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Querying live RMS database via Groq LLM...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COMPOSER BAR                                                  */}
        {/* ------------------------------------------------------------- */}
        <div
          style={{
            padding: '14px 24px 18px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Attached file chip */}
            {attachedFile && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  color: '#1d4ed8',
                  width: 'fit-content',
                }}
              >
                <FileText size={13} color="#2563eb" />
                <span>{attachedFile.name} ({attachedFile.sizeKb} KB)</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Input Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '8px 12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}
            >
              <button
                type="button"
                title="Attach Document or Image for OCR"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Paperclip size={18} />
              </button>

              <textarea
                placeholder="Ask anything about properties, leases, arrears, M-Pesa collections, or security deposits..."
                rows={1}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  resize: 'none',
                  lineHeight: 1.45,
                  maxHeight: '120px',
                  fontFamily: 'inherit',
                  padding: '4px 0',
                }}
              />

              <button
                type="button"
                disabled={isSending || (!promptInput.trim() && !attachedFile)}
                onClick={() => handleSendMessage()}
                style={{
                  background: isSending || (!promptInput.trim() && !attachedFile) ? '#cbd5e1' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isSending || (!promptInput.trim() && !attachedFile) ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <Send size={15} />
              </button>
            </div>

            {/* Hint / disclaimer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', padding: '0 4px' }}>
              <span>Enter to send &bull; Shift+Enter for new line</span>
              <span>Grounded in active organization PostgreSQL records</span>
            </div>
          </div>
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. RIGHT PANEL: CONTEXT & INTELLIGENCE                         */}
      {/* ------------------------------------------------------------- */}
      {showRightPanel && (
        <aside
          style={{
            width: '280px',
            background: '#ffffff',
            borderLeft: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflowY: 'auto',
            padding: '16px',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Scope & Organization
            </div>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px',
              }}
            >
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{currentOrg.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                County: {currentOrg.county || 'Nairobi'} &bull; Type: {currentOrg.type || 'ESTATE_MANAGEMENT'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Live Portfolio Financial KPIs
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Collection Rate</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>{collectionRate}%</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Outstanding Arrears</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#dc2626' }}>
                  KES {totalArrears.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Deposits Held (Account 2100)</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2563eb' }}>
                  KES {totalDepositsHeld.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Role-Scoped Tools ({userRole})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.74rem' }}>
              {[
                'get_property_summary',
                'get_unit_availability',
                'get_collection_summary',
                'get_arrears_report',
                'get_deposit_balance',
                'get_expiring_leases',
                'create_maintenance_request',
                'draft_tenant_notification',
              ].map((tool, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: '#f8fafc',
                    color: '#334155',
                  }}
                >
                  <CheckCircle2 size={12} color="#16a34a" />
                  <code>{tool}</code>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0f172a' }}>Delete Conversation?</h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '0.84rem', color: '#64748b' }}>
              Are you sure you want to permanently delete this conversation history? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteConversation(deleteConfirmId)}
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
