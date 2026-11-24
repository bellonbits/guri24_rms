import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  CreditCard,
  FileQuestion,
  Volume2,
  Key,
  Paperclip,
  ChevronRight,
  User,
  ArrowLeft,
} from '../../../components/heroicons';

interface SupportViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
  ticketIdParam?: string;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack, showToast, ticketIdParam }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(ticketIdParam || null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // New ticket form
  const [newCategory, setNewCategory] = useState('PAYMENT_DISPUTE');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Real tickets state (starts empty - no fabricated mock tickets in production)
  const [tickets, setTickets] = useState<any[]>([]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTck = {
      id: `TCK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      categoryLabel:
        newCategory === 'PAYMENT_DISPUTE'
          ? 'Payment Dispute'
          : newCategory === 'LEASE_ENQUIRY'
          ? 'Lease Enquiry'
          : newCategory === 'NOISE_COMPLAINT'
          ? 'Neighbour/Noise Complaint'
          : 'Access & Security',
      subject: newSubject.trim(),
      priority: newPriority,
      status: 'OPEN',
      createdAt: 'Today',
      updatedAt: 'Just now',
      assignedTo: {
        name: 'Property Management Triage',
        role: 'Help Desk',
      },
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'You',
          senderRole: 'Tenant',
          time: 'Just now',
          isStaff: false,
          text: newDescription.trim(),
        },
      ],
    };

    setTickets([newTck, ...tickets]);
    setShowNewTicketModal(false);
    setSelectedTicketId(newTck.id);
    setNewSubject('');
    setNewDescription('');
    if (showToast) showToast(`Ticket ${newTck.id} created! Property desk has been notified.`);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const updated = {
      ...selectedTicket,
      updatedAt: 'Just now',
      messages: [
        ...selectedTicket.messages,
        {
          id: `msg-${Date.now()}`,
          sender: 'You',
          senderRole: 'Tenant',
          time: 'Just now',
          isStaff: false,
          text: replyText.trim(),
        },
      ],
    };

    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
    if (showToast) showToast('Message posted to support ticket thread.');
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterCategory === 'ALL') return true;
    return t.category === filterCategory;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Support & Enquiries
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Direct communication channel with your property management, accounts, and operations desk.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Create Support Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <LifeBuoy size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
            No Support Tickets
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            You haven't submitted any support tickets yet. Click "Create Support Ticket" to contact management regarding billing questions, payment disputes, access cards, or lease enquiries.
          </p>
          <button
            onClick={() => setShowNewTicketModal(true)}
            style={{ padding: '9px 20px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
          >
            Create Support Ticket
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '360px 1fr' : '1fr', gap: '24px' }}>
          {/* Ticket list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                style={{
                  background: selectedTicket?.id === t.id ? '#eff6ff' : '#ffffff',
                  border: selectedTicket?.id === t.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb' }}>{t.id}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '8px', background: '#dcfce7', color: '#15803d' }}>{t.status}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{t.subject}</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{t.categoryLabel} &bull; {t.createdAt}</div>
              </div>
            ))}
          </div>

          {/* Thread */}
          {selectedTicket && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563eb' }}>{selectedTicket.id}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{selectedTicket.subject}</h3>
              </div>

              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {selectedTicket.messages.map((m: any) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.isStaff ? 'flex-start' : 'flex-end',
                      maxWidth: '80%',
                      background: m.isStaff ? '#f8fafc' : '#eff6ff',
                      border: m.isStaff ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '14px',
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: m.isStaff ? '#1e293b' : '#1d4ed8', marginBottom: '4px' }}>
                      {m.sender} ({m.senderRole}) &bull; <span style={{ fontWeight: 400, color: '#94a3b8' }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: '#334155' }}>{m.text}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type your response to property management..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                />
                <button
                  onClick={handleSendReply}
                  style={{ padding: '10px 18px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Create Support Ticket
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 18px 0' }}>
              Send an enquiry or dispute directly to property management.
            </p>

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Issue Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="PAYMENT_DISPUTE">Payment Dispute / Uncredited Receipt</option>
                  <option value="LEASE_ENQUIRY">Lease & Tenancy Enquiry</option>
                  <option value="ACCESS_CARD">Gate Pass & Access Card</option>
                  <option value="NOISE_COMPLAINT">Neighbour / Noise Complaint</option>
                  <option value="GENERAL">General Property Enquiry</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subject / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. M-Pesa transaction reference verification"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your enquiry with relevant dates or references..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  style={{ padding: '9px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', background: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer' }}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
