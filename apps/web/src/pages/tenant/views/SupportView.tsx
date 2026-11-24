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
} from 'lucide-react';

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

  // Sample tickets
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-2026-0182',
      category: 'PAYMENT_DISPUTE',
      categoryLabel: 'Payment Dispute',
      subject: 'Clarification on October Service Charge Ledger Entry',
      priority: 'HIGH',
      status: 'RESOLVED',
      createdAt: '18 Nov 2026',
      updatedAt: '19 Nov 2026',
      assignedTo: {
        name: 'Sarah Nduta',
        role: 'Property Accounts Officer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      },
      messages: [
        {
          id: 'm1',
          sender: 'Courtney Henry',
          senderRole: 'Tenant',
          time: '18 Nov 2026, 10:15 AM',
          isStaff: false,
          text: 'Hi, I noticed a service charge line item of KES 2,500 that appeared twice on 18 Oct statement. Could you please confirm if this was reconciled with my M-Pesa transaction QKH782910X?',
        },
        {
          id: 'm2',
          sender: 'Sarah Nduta',
          senderRole: 'Property Accounts Officer',
          time: '18 Nov 2026, 02:40 PM',
          isStaff: true,
          text: 'Hello Courtney. Thank you for flagging this. I have inspected the double-entry ledger in our Spring Boot Finance Service. The second charge was an unposted pending batch that has now been reversed (Credit Note CN-2026-088). Your outstanding balance is exactly KES 0.00.',
        },
        {
          id: 'm3',
          sender: 'Courtney Henry',
          senderRole: 'Tenant',
          time: '19 Nov 2026, 09:05 AM',
          isStaff: false,
          text: 'Thank you Sarah, verified and confirmed on my portal statements!',
        },
      ],
    },
    {
      id: 'TCK-2026-0204',
      category: 'ACCESS_CARD',
      categoryLabel: 'Access & Security',
      subject: 'Request for additional biometric vehicle RFID sticker for Unit A-204',
      priority: 'NORMAL',
      status: 'IN_PROGRESS',
      createdAt: '21 Nov 2026',
      updatedAt: '22 Nov 2026',
      assignedTo: {
        name: 'David Omondi',
        role: 'Head of Estate Security',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      },
      messages: [
        {
          id: 'm1',
          sender: 'Courtney Henry',
          senderRole: 'Tenant',
          time: '21 Nov 2026, 11:30 AM',
          isStaff: false,
          text: 'Good day. We recently registered a second vehicle (KDF 892M) for our allocated parking bay #02. Please issue an RFID gate tag.',
        },
        {
          id: 'm2',
          sender: 'David Omondi',
          senderRole: 'Head of Estate Security',
          time: '22 Nov 2026, 08:30 AM',
          isStaff: true,
          text: 'Good morning Courtney. Your RFID sticker is ready for pickup at the main guardhouse gatehouse. Please have your tenant ID ready when signing.',
        },
      ],
    },
    {
      id: 'TCK-2026-0215',
      category: 'LEASE_ENQUIRY',
      categoryLabel: 'Lease & Tenancy',
      subject: 'Early renewal terms for 2027 lease commitment',
      priority: 'NORMAL',
      status: 'OPEN',
      createdAt: '23 Nov 2026',
      updatedAt: '23 Nov 2026',
      assignedTo: {
        name: 'Alex Muthomi',
        role: 'Senior Portfolio Manager',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      },
      messages: [
        {
          id: 'm1',
          sender: 'Courtney Henry',
          senderRole: 'Tenant',
          time: '23 Nov 2026, 09:00 AM',
          isStaff: false,
          text: 'Hello Alex, our lease expires in June 2027. We would like to lock in our current rate of KES 50,000 for an additional 24 months. Please advise on contract drafting.',
        },
      ],
    },
  ]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTck = {
      id: `TCK-2026-0${tickets.length + 220}`,
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
        name: 'Help Desk Triage',
        role: 'Operations Desk',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      },
      messages: [
        {
          id: 'm-init',
          sender: 'Courtney Henry',
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
          sender: 'Courtney Henry',
          senderRole: 'Tenant',
          time: 'Just now',
          isStaff: false,
          text: replyText.trim(),
        },
      ],
    };

    setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    setReplyText('');
    if (showToast) showToast('Message posted to support thread.');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>
              Tenant Assistance
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Unit Flow Help Desk</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131726', letterSpacing: '-0.02em', margin: 0 }}>
            Support & Enquiries
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Direct communication channel with your property management, accounts, and security team.
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
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          }}
        >
          <Plus size={16} />
          Create Support Ticket
        </button>
      </div>

      {/* Main Grid: Ticket List & Detail Thread */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedTicket ? '380px 1fr' : '1fr', gap: '24px' }}>
        {/* Ticket List Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'ALL', label: 'All Tickets' },
              { id: 'PAYMENT_DISPUTE', label: 'Payments' },
              { id: 'ACCESS_CARD', label: 'Access' },
              { id: 'LEASE_ENQUIRY', label: 'Lease' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: filterCategory === f.id ? '#131726' : '#f1f5f9',
                  color: filterCategory === f.id ? '#ffffff' : '#64748b',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredTickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                style={{
                  background: isSelected ? '#f8faff' : '#ffffff',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', fontFamily: 'monospace' }}>
                    {t.id}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background:
                        t.status === 'RESOLVED'
                          ? '#dcfce7'
                          : t.status === 'IN_PROGRESS'
                          ? '#e0e7ff'
                          : '#fef3c7',
                      color:
                        t.status === 'RESOLVED'
                          ? '#15803d'
                          : t.status === 'IN_PROGRESS'
                          ? '#4338ca'
                          : '#b45309',
                    }}
                  >
                    {t.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#131726', marginBottom: '6px', lineHeight: 1.3 }}>
                  {t.subject}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>{t.categoryLabel}</span>
                  <span>{t.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Ticket Thread */}
        {selectedTicket ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              height: '700px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {/* Thread Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                    {selectedTicket.id}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>•</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedTicket.categoryLabel}</span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#131726', margin: 0 }}>
                  {selectedTicket.subject}
                </h2>
              </div>

              {/* Staff Assigned */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={selectedTicket.assignedTo.avatar}
                  alt={selectedTicket.assignedTo.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#131726' }}>
                    {selectedTicket.assignedTo.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {selectedTicket.assignedTo.role}
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Log */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isStaff ? 'flex-start' : 'flex-end',
                    maxWidth: '80%',
                    background: msg.isStaff ? '#f8fafc' : '#eff6ff',
                    border: msg.isStaff ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '12px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: msg.isStaff ? '#1e293b' : '#1d4ed8' }}>
                      {msg.sender} <span style={{ fontWeight: 400, color: '#64748b' }}>({msg.senderRole})</span>
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Type your response to support staff..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
                <button
                  onClick={handleSendReply}
                  style={{
                    padding: '12px 20px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Send size={15} /> Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
              color: '#94a3b8',
              textAlign: 'center',
            }}
          >
            <LifeBuoy size={48} style={{ marginBottom: '12px', strokeWidth: 1.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', margin: '0 0 6px 0' }}>
              No Ticket Selected
            </h3>
            <p style={{ fontSize: '0.84rem', maxWidth: '360px', margin: 0 }}>
              Select a ticket from the list on the left to review updates, or click "Create Support Ticket" to report a new issue.
            </p>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0' }}>
              Create Support Ticket
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
              Send an enquiry or dispute directly to the responsible property manager.
            </p>

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Issue Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                >
                  <option value="PAYMENT_DISPUTE">Payment Dispute / Uncredited Receipt</option>
                  <option value="LEASE_ENQUIRY">Lease & Tenancy Enquiry</option>
                  <option value="ACCESS_CARD">Gate Pass & Access Card</option>
                  <option value="NOISE_COMPLAINT">Neighbour / Noise Complaint</option>
                  <option value="GENERAL">General Property Enquiry</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Priority Level
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: newPriority === p ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: newPriority === p ? '#eff6ff' : '#ffffff',
                        color: newPriority === p ? '#2563eb' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Subject / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. M-Pesa reference not showing on ledger"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Detailed Description & Reference Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue with dates, transaction codes, or unit details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  style={{
                    padding: '10px 18px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
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
