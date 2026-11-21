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
  ArrowPathIcon,
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
  onSendMessage?: (query: string, convId?: string, attachment?: AssistantAttachment) => Promise<void>;
  onResolveConfirmation?: (confirmationId: string, confirmed: boolean) => Promise<void>;
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
}) => {
  // State
  const [activeConvId, setActiveConvId] = useState<string>(() => {
    return conversations[0]?.id || 'conv-default';
  });
  const [promptInput, setPromptInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [likedMsgIds, setLikedMsgIds] = useState<Record<string, boolean>>({ 'msg-default-assistant': true });
  const [dislikedMsgIds, setDislikedMsgIds] = useState<Record<string, boolean>>({});
  const [selectedModule, setSelectedModule] = useState<'Thinker' | 'Financial Reasoner' | 'Lease Assistant'>('Thinker');
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'Recent' | 'Favorite'>('Recent');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [attachedFile, setAttachedFile] = useState<AssistantAttachment | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Lease & Tenancy Operations': true,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clean Markdown & format response text cleanly without any markdown characters
  const renderCleanContent = (text: string) => {
    if (!text) return null;
    const cleaned = text
      // Strip headers anywhere in string
      .replace(/(^|\n|\r)#{1,6}\s*/g, '$1')
      .replace(/#{1,6}\s*/g, '')
      // Bold, italics, backticks, strikethrough
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      // Break inline joined bullet dashes into clean vertical bullet points
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

  // Carousel images
  const carouselImages = [
    {
      id: 'img-1',
      title: 'Minimalist Perspective A',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-2',
      title: 'Minimalist Bedroom Design',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-3',
      title: 'Forest View Window',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    },
  ];

  // Default initial message exchange matching property operations
  const defaultMessages: AssistantMessage[] = useMemo(() => {
    return [
      {
        id: 'msg-default-user',
        role: 'USER',
        content:
          'Summarize our current portfolio health, occupancy, and collection performance across active estates.',
        citations: [],
        tool_calls: [],
        created_at: new Date().toISOString(),
      },
      {
        id: 'msg-default-assistant',
        role: 'ASSISTANT',
        content:
          'Here is the real-time operational overview for your managed properties. All active units, tenant leases, and M-Pesa ledger allocations are synchronized and verified.',
        citations: [
          {
            record_id: 'rec-portfolio-1',
            record_type: 'PORTFOLIO_SUMMARY',
            reference_code: 'RMS-LEDGER-LIVE',
            summary: 'Live Authoritative Ledger & Reconciled Bank Stream',
          },
        ],
        tool_calls: [],
        created_at: new Date().toISOString(),
      },
    ];
  }, []);

  const displayMessages = useMemo(() => {
    if (activeConversation && activeConversation.messages.length > 0) {
      return activeConversation.messages;
    }
    return defaultMessages;
  }, [activeConversation, defaultMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

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
        ...conversations,
        {
          id: targetConvId,
          title: text.slice(0, 42),
          organization_id: currentOrg.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [userMsg],
        },
      ];
      setActiveConvId(targetConvId);
    }
    onUpdateConversations(updatedConvs);

    try {
      if (onSendMessage) {
        await onSendMessage(text, targetConvId, attachedFile || undefined);
      } else {
        // Fallback local simulated assistant response with real portfolio metrics
        const totalBilled = invoices.reduce((s, i) => s + (i.amount_kes || 0), 0);
        const totalCollected = payments.reduce((s, p) => s + (p.allocated_amount_kes || p.amount_kes || 0), 0);
        const depositsHeld = deposits.reduce((s, d) => s + (d.held_amount_kes || 0), 0);

        const aiMsg: AssistantMessage = {
          id: `msg-${Date.now()}-ast`,
          role: 'ASSISTANT',
          content:
            `I have processed your request regarding ${currentOrg.name}.\n\n` +
            `• Active Properties: ${properties.length} managed location(s)\n` +
            `• Total Billed: KES ${totalBilled.toLocaleString()}\n` +
            `• Total Collected (M-Pesa/Bank): KES ${totalCollected.toLocaleString()}\n` +
            `• Account 2100 Deposits Liability: KES ${depositsHeld.toLocaleString()} held in trust escrow\n\n` +
            `Everything is balanced in the authoritative general ledger. Let me know if you would like me to draft tenant notifications or export the financial run!`,
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

  // Recent / Favorite conversations list
  const conversationListItems = useMemo(() => {
    return [
      { id: 'c1', title: 'Summarize portfolio collections and rent arrears' },
      { id: 'c2', title: 'Which units are currently vacant or up for renewal?' },
      { id: 'c3', title: 'Draft standard 12-month residential tenancy lease' },
      { id: 'c4', title: 'Check M-Pesa Daraja payment reconciliation status' },
      { id: 'c5', title: 'Review pending OCR documents awaiting verification' },
    ];
  }, []);

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
      }}
    >
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
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          {/* Centered Brand Mark: ⁂ aero */}
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

          {/* Right Collapse Toggle Button: > */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              position: 'absolute',
              right: '24px',
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
        </header>

        {/* Message Stream Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px 36px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column' }}>
            {/* User Prompt Bubble */}
            <div
              style={{
                backgroundColor: '#EEF2FF',
                borderRadius: '18px',
                padding: '16px 22px',
                color: '#1E1B4B',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                fontWeight: 400,
                marginBottom: '28px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                maxWidth: '560px',
                alignSelf: 'center',
                textAlign: 'left',
              }}
            >
              {renderCleanContent(displayMessages[0]?.content ||
                'Summarize our current portfolio health, occupancy, and collection performance across active estates.')}
            </div>

            {/* AI Response Block with Visual Carousel & Floating Left Actions */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Floating Vertical Pill Toolbar on the Left */}
              <div
                style={{
                  position: 'absolute',
                  left: '-52px',
                  top: '64px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '8px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E5E7EB',
                  zIndex: 10,
                }}
              >
                {/* ⁂ Sparkle */}
                <button
                  type="button"
                  onClick={() => handleSendMessage('Regenerate and enhance with deep thinking')}
                  title="Deep Think / Regenerate"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0F172A',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>⁂</span>
                </button>

                {/* Copy */}
                <button
                  type="button"
                  onClick={() =>
                    handleCopyMessage(
                      'msg-default-assistant',
                      displayMessages[1]?.content || 'Here is the minimalist bedroom design...'
                    )
                  }
                  title={copiedMsgId ? 'Copied!' : 'Copy to clipboard'}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: copiedMsgId ? '#10B981' : '#64748B',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {copiedMsgId ? (
                    <CheckIcon style={{ width: 15, height: 15 }} />
                  ) : (
                    <DocumentDuplicateIcon style={{ width: 15, height: 15 }} />
                  )}
                </button>

                {/* Thumbs Up */}
                <button
                  type="button"
                  onClick={() => handleToggleLike('msg-default-assistant')}
                  title="Helpful"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: likedMsgIds['msg-default-assistant'] ? '#10B981' : '#94A3B8',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HandThumbUpIcon
                    style={{
                      width: 15,
                      height: 15,
                      fill: likedMsgIds['msg-default-assistant'] ? '#10B981' : 'none',
                    }}
                  />
                </button>

                {/* Thumbs Down */}
                <button
                  type="button"
                  onClick={() => handleToggleDislike('msg-default-assistant')}
                  title="Not helpful"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: dislikedMsgIds['msg-default-assistant'] ? '#EF4444' : '#94A3B8',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HandThumbDownIcon
                    style={{
                      width: 15,
                      height: 15,
                      fill: dislikedMsgIds['msg-default-assistant'] ? '#EF4444' : 'none',
                    }}
                  />
                </button>
              </div>

              {/* 3D Visual Cards Carousel */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  margin: '10px 0 24px',
                  perspective: '900px',
                  width: '100%',
                }}
              >
                {/* Left Card */}
                <div
                  onClick={() => setActiveCarouselIndex(0)}
                  style={{
                    width: '180px',
                    height: '220px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transform: 'scale(0.86) rotateY(18deg)',
                    opacity: activeCarouselIndex === 0 ? 1 : 0.65,
                    cursor: 'pointer',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={carouselImages[0].url}
                    alt={carouselImages[0].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Center Active Card */}
                <div
                  onClick={() => setActiveCarouselIndex(1)}
                  style={{
                    width: '270px',
                    height: '250px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transform: 'scale(1)',
                    zIndex: 4,
                    cursor: 'pointer',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={carouselImages[activeCarouselIndex]?.url || carouselImages[1].url}
                    alt="Active Minimalist Interior"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Right Card */}
                <div
                  onClick={() => setActiveCarouselIndex(2)}
                  style={{
                    width: '180px',
                    height: '220px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transform: 'scale(0.86) rotateY(-18deg)',
                    opacity: activeCarouselIndex === 2 ? 1 : 0.65,
                    cursor: 'pointer',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src={carouselImages[2].url}
                    alt={carouselImages[2].title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Assistant Response Text Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '20px 24px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  maxWidth: '560px',
                  width: '100%',
                  color: '#1F2937',
                  fontSize: '0.90rem',
                  lineHeight: 1.55,
                  textAlign: 'left',
                }}
              >
                {renderCleanContent(displayMessages[1]?.content ||
                  'Here is the real-time operational overview for your managed properties. All active units, tenant leases, and M-Pesa ledger allocations are synchronized and verified.')}

                {/* Grounded Citations Badge */}
                {displayMessages[1]?.citations && displayMessages[1].citations.length > 0 && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.74rem',
                      color: '#64748B',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>Grounded Source:</span>
                    <span>{displayMessages[1].citations[0].summary}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Messages Stream */}
            {displayMessages.slice(2).map((msg) => {
              const isUser = msg.role === 'USER';
              return (
                <div
                  key={msg.id}
                  style={{
                    margin: '18px 0',
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '560px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isUser ? '#EEF2FF' : '#FFFFFF',
                      borderRadius: '18px',
                      padding: '16px 20px',
                      border: isUser ? 'none' : '1px solid #E5E7EB',
                      color: isUser ? '#1E1B4B' : '#1F2937',
                      fontSize: '0.90rem',
                      lineHeight: 1.5,
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    {renderCleanContent(msg.content)}
                  </div>
                </div>
              );
            })}

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
              placeholder="Ask aero anything..."
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
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '10px',
              }}
            >
              Conversations
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

            {/* Conversation Titles List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {conversationListItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSendMessage(item.title)}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px 2px',
                    lineHeight: 1.4,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                >
                  {item.title}
                </button>
              ))}
            </div>
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