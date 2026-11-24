import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Building,
  Info,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

interface AnnouncementsViewProps {
  propertyName: string;
  unitNumber: string;
  showToast: (msg: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({
  propertyName,
  unitNumber,
  showToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [announcements, setAnnouncements] = useState([
    {
      id: 'ann-01',
      title: 'Scheduled Water Borehole Pump Maintenance',
      category: 'Water Interruption',
      categoryColor: '#0284c7',
      categoryBg: '#e0f2fe',
      priority: 'Urgent',
      date: '22 Nov 2026',
      expiryDate: '25 Nov 2026',
      publisher: 'Greenview Property Operations & Facilities',
      target: 'Block A & Block B Residents',
      read: false,
      message:
        'Please be advised that the main borehole extraction pump will undergo scheduled annual descaling on Tuesday, 24 Nov from 10:00 AM to 1:00 PM. High-capacity gravity reserve rooftop tanks will maintain steady flow throughout the servicing period. No disruption to normal household taps is expected.',
    },
    {
      id: 'ann-02',
      title: 'KPLC Standby Diesel Generator Load-Testing',
      category: 'Scheduled Maintenance',
      categoryColor: '#ea580c',
      categoryBg: '#ffedd5',
      priority: 'Normal',
      date: '18 Nov 2026',
      expiryDate: '30 Nov 2026',
      publisher: 'Lead Caretaker & Technical Team',
      target: 'Entire Estate Community',
      read: true,
      message:
        'The 150 kVA Perkins backup generator will be load-tested for 15 minutes this Thursday at 11:30 AM. Elevators will operate seamlessly via UPS invertors during the transfer simulation.',
    },
    {
      id: 'ann-03',
      title: 'New Biometric Visitor Logging & Gate Access Rules',
      category: 'Security Notice',
      categoryColor: '#dc2626',
      categoryBg: '#fee2e2',
      priority: 'Important',
      date: '10 Nov 2026',
      expiryDate: '31 Dec 2026',
      publisher: 'Estate Security Committee & Apex Guarding',
      target: 'All Registered Residents',
      read: true,
      message:
        'All courier deliveries and visiting cabs must obtain a numerical visitor clearance pass from the main security gate. Food delivery riders (UberEats/Glovo) are permitted to drop orders at the reception concierge foyer.',
    },
    {
      id: 'ann-04',
      title: 'Quarterly Resident Owners & Tenants Consultative Forum',
      category: 'Estate Meeting',
      categoryColor: '#9333ea',
      categoryBg: '#f3e8ff',
      priority: 'Notice',
      date: '05 Nov 2026',
      expiryDate: '15 Dec 2026',
      publisher: 'Greenview Property Holdings Ltd',
      target: 'Clubhouse Pavilion',
      read: true,
      message:
        'The Q4 consultative session will take place at the Resident Clubhouse on Saturday, 6 Dec at 10:00 AM. Agenda includes solar array installation review, swimming pool heating upgrades, and landscaping enhancements.',
    },
  ]);

  const handleToggleRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchCat = selectedCategory === 'ALL' || a.category === selectedCategory;
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [announcements, selectedCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Estate Announcements & Notices
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
            Official notices targeted to {propertyName} ({unitNumber}) regarding facility servicing, security and estate bylaws.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
            showToast('All announcements marked as read.');
          }}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Category:</span>
          {(['ALL', 'Water Interruption', 'Scheduled Maintenance', 'Security Notice', 'Estate Meeting'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#2563eb' : '#f8fafc',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#2563eb' : '#cbd5e1',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '6px 12px',
          }}
        >
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '160px' }}
          />
        </div>
      </div>

      {/* Announcements Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            style={{
              background: '#ffffff',
              border: !ann.read ? '2px solid #2563eb' : '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: ann.categoryBg,
                    color: ann.categoryColor,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '10px',
                  }}
                >
                  {ann.category}
                </span>

                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {ann.title}
                </h3>

                {!ann.read && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: '#94a3b8' }}>
                <span>Published: {ann.date}</span>
                <span>&bull;</span>
                <span>Valid until: {ann.expiryDate}</span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.55 }}>
              {ann.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.76rem', color: '#64748b' }}>
              <span>Issued by: <strong>{ann.publisher}</strong> &bull; Scope: {ann.target}</span>
              <button
                type="button"
                onClick={() => handleToggleRead(ann.id)}
                style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
              >
                {ann.read ? 'Mark as Unread' : 'Mark as Read'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
