import React, { useState } from 'react';
import {
  Paperclip,
  Clock,
  FileText,
  User,
  Sparkles,
  Send,
  X,
  Maximize2,
  FileDown,
  MoreVertical,
  Check,
} from 'lucide-react';

export interface EmailRecipient {
  email: string;
  name?: string;
  avatarBg?: string;
  avatarText?: string;
}

export interface EmailAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'fig' | 'doc' | 'other';
}

export interface EmailTemplateCardProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSend?: (emailData: { to: string[]; subject: string; body: string }) => void;
  initialTo?: EmailRecipient[];
  initialSubject?: string;
  initialBody?: string;
  initialAttachments?: EmailAttachment[];
  title?: string;
  isModal?: boolean;
}

export const EmailTemplateCard: React.FC<EmailTemplateCardProps> = ({
  isOpen = true,
  onClose,
  onSend,
  initialTo = [
    { email: 'hannah@gmail.com', name: 'Hannah', avatarBg: '#ede9fe', avatarText: '#7c3aed' },
    { email: 'alex@gmail.com', name: 'Alex', avatarBg: '#ffedd5', avatarText: '#ea580c' },
  ],
  initialSubject = 'Concept of onboarding flow',
  initialBody = `Hey @hannah,
I've been digging into our onboarding flow and wanted to share a proposal for a new direction. Right now, the experience asks a lot from users before showing them any real value, which might be contributing to early drop-offs.

I've put together a revised flow that simplifies the first steps, guides users more clearly, and helps them reach their first "aha" moment faster. The goal is to improve activation, reduce friction, and better align with what we're seeing in analytics and user feedback.

If you're up for it, I'd love to walk you through the idea and get your thoughts. Let me know a good time.

Best,
Robin`,
  initialAttachments = [
    { name: 'About design', size: '246 kB', type: 'pdf' },
    { name: 'Mobile designs', size: '812 kB', type: 'fig' },
  ],
  title = 'New email',
  isModal = true,
}) => {
  const [recipients, setRecipients] = useState<EmailRecipient[]>(initialTo);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [showToolbar, setShowToolbar] = useState(true);
  const [activeFormat, setActiveFormat] = useState<'bold' | 'italic' | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendClick = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      if (onSend) {
        onSend({
          to: recipients.map((r) => r.email),
          subject,
          body,
        });
      }
      setTimeout(() => {
        setSentSuccess(false);
        if (onClose) onClose();
      }, 900);
    }, 600);
  };

  const cardContent = (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: '#111827',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f3f4f6',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/Guri24 RMS Property Logo.png"
            alt="Guri24 RMS"
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              // Fallback to text if path is different
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Maximize2 size={15} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={17} />
            </button>
          )}
        </div>
      </div>

      {/* "To" Recipient Bar */}
      <div
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f3f4f6',
          fontSize: '0.86rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: '#6b7280', fontWeight: 500, marginRight: '4px' }}>To</span>
          {recipients.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                padding: '3px 10px 3px 4px',
                fontSize: '0.84rem',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: r.avatarBg || '#e0e7ff',
                  color: r.avatarText || '#4338ca',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {r.name ? r.name.charAt(0).toUpperCase() : r.email.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#111827', fontWeight: 500 }}>{r.email}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af', fontSize: '0.8rem' }}>
          <span style={{ cursor: 'pointer' }}>Bc</span>
          <span style={{ cursor: 'pointer' }}>Cc</span>
        </div>
      </div>

      {/* Main Body Area */}
      <div style={{ padding: '24px 24px 16px 24px', flex: 1, position: 'relative' }}>
        {/* Subject Header */}
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          style={{
            width: '100%',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#111827',
            border: 'none',
            outline: 'none',
            marginBottom: '16px',
            fontFamily: 'inherit',
            letterSpacing: '-0.02em',
          }}
        />

        {/* Floating Formatting Pill (Matches the reference design) */}
        {showToolbar && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#111827',
              color: '#e5e7eb',
              padding: '6px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
              marginBottom: '14px',
              userSelect: 'none',
            }}
          >
            <span
              style={{ cursor: 'pointer', fontWeight: 800 }}
              onClick={() => setActiveFormat(activeFormat === 'bold' ? null : 'bold')}
            >
              B
            </span>
            <span
              style={{ cursor: 'pointer', fontStyle: 'italic' }}
              onClick={() => setActiveFormat(activeFormat === 'italic' ? null : 'italic')}
            >
              I
            </span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>U</span>
            <span style={{ color: '#4b5563' }}>|</span>
            <span style={{ cursor: 'pointer', fontSize: '0.9rem' }}>&#8801;</span>
            <span style={{ cursor: 'pointer', fontSize: '0.9rem' }}>&#8801;</span>
            <span style={{ cursor: 'pointer', fontSize: '0.9rem' }}>&#8801;</span>
            <span style={{ color: '#4b5563' }}>|</span>
            <span style={{ cursor: 'pointer' }}>&#128279;</span>
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={9}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            lineHeight: 1.65,
            color: '#374151',
            fontFamily: 'inherit',
            resize: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Attachments Section */}
        {initialAttachments && initialAttachments.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '10px' }}>
              {initialAttachments.length} attachments
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {initialAttachments.map((att, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: '#fafafa',
                    border: '1px solid #f3f4f6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: att.type === 'pdf' ? '#fee2e2' : '#f3e8ff',
                        color: att.type === 'pdf' ? '#ef4444' : '#9333ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                      }}
                    >
                      {att.type.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827' }}>{att.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{att.size}</div>
                    </div>
                  </div>
                  <MoreVertical size={14} color="#9ca3af" style={{ cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f3f4f6',
          backgroundColor: '#fbfbfb',
        }}
      >
        {/* Left Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#9ca3af' }}>
          <button
            type="button"
            title="Attach file"
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
          >
            <Paperclip size={18} />
          </button>
          <button
            type="button"
            title="Schedule send"
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
          >
            <Clock size={18} />
          </button>
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <button
              type="button"
              title="Use template"
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
            >
              <FileText size={18} />
            </button>
            <span
              style={{
                position: 'absolute',
                top: '-26px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#111827',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              Use template
            </span>
          </div>
          <button
            type="button"
            title="Mention contact"
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
          >
            <User size={18} />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#374151',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onClick={() => {
              setBody(
                (prev) =>
                  `${prev}\n\n[AI refined for clarity & tone]: Please feel free to reply directly with any feedback.`
              );
            }}
          >
            <span>Ask AI</span>
            <Sparkles size={14} color="#6366f1" />
          </button>

          <button
            type="button"
            onClick={handleSendClick}
            disabled={isSending || sentSuccess}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: sentSuccess ? '#16a34a' : '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: isSending || sentSuccess ? 'default' : 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span>{sentSuccess ? 'Sent!' : isSending ? 'Sending...' : 'Send'}</span>
            {sentSuccess ? <Check size={14} /> : <Send size={13} />}
          </button>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return cardContent;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {cardContent}
    </div>
  );
};
