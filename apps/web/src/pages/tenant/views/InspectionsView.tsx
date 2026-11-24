import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Download,
  FileText,
  Calendar,
  User,
  Shield,
  Eye,
  Plus,
  X,
  MessageSquare,
} from 'lucide-react';

interface InspectionsViewProps {
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  showToast: (msg: string) => void;
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  propertyName,
  unitNumber,
  tenantName,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'move-in' | 'move-out'>('move-in');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedDisputeItem, setSelectedDisputeItem] = useState('');
  const [disputeText, setDisputeText] = useState('');
  const [isSigned, setIsSigned] = useState(true);

  // 10 Mandated Move-In Checklist Categories
  const [checklist, setChecklist] = useState([
    { id: 'item-1', name: 'Walls and Paint', status: 'Good', condition: 'Freshly painted soft white; no scuffs or nail holes.', photos: 4, disputed: false },
    { id: 'item-2', name: 'Floors and Tiles', status: 'Good', condition: 'Vitrified porcelain tiles clean; grout lines sealed.', photos: 6, disputed: false },
    { id: 'item-3', name: 'Doors and Locks', status: 'Good', condition: 'Main heavy security door lock and 3 bedroom keys tested.', photos: 3, disputed: false },
    { id: 'item-4', name: 'Windows & Latches', status: 'Good', condition: 'All sliding aluminum windows close securely with latches intact.', photos: 4, disputed: false },
    { id: 'item-5', name: 'Electrical Fittings', status: 'Good', condition: 'Sockets, light switches, and circuit breaker panel verified.', photos: 5, disputed: false },
    { id: 'item-6', name: 'Plumbing & Drainage', status: 'Satisfactory', condition: 'Cold and hot water flowing. Kitchen mixer tap noted with mild play.', photos: 4, disputed: false },
    { id: 'item-7', name: 'Kitchen & Cabinets', status: 'Good', condition: 'Granite countertop smooth; all cupboards opening and soft-closing.', photos: 8, disputed: false },
    { id: 'item-8', name: 'Bathroom & Sanitaryware', status: 'Good', condition: 'Shower mixer, ceramic toilet bowl, mirror and vanity in order.', photos: 6, disputed: false },
    { id: 'item-9', name: 'Fixtures & Appliances', status: 'Good', condition: 'Water heater geyser heating properly. Ceiling fan operating.', photos: 3, disputed: false },
    { id: 'item-10', name: 'General Cleanliness', status: 'Good', condition: 'Full professional deep clean completed prior to handover.', photos: 5, disputed: false },
  ]);

  const handleOpenDispute = (itemName: string) => {
    setSelectedDisputeItem(itemName);
    setDisputeText('');
    setShowDisputeModal(true);
  };

  const handleSaveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setChecklist((prev) =>
      prev.map((item) =>
        item.name === selectedDisputeItem ? { ...item, disputed: true, condition: `${item.condition} [Tenant Observation: ${disputeText}]` } : item
      )
    );
    setShowDisputeModal(false);
    showToast(`Observation for "${selectedDisputeItem}" recorded and submitted to Caretaker!`);
  };

  const handleDownloadReport = () => {
    let doc = `MOVE-IN CONDITION & INVENTORY REPORT\n`;
    doc += `=====================================\n`;
    doc += `Premises: ${propertyName} &bull; ${unitNumber}\n`;
    doc += `Tenant: ${tenantName}\n`;
    doc += `Date: 21 June 2023\n`;
    doc += `Inspector: Peter Kariuki (Lead Caretaker)\n\n`;
    checklist.forEach((item, i) => {
      doc += `${i + 1}. ${item.name}: ${item.status}\n   ${item.condition}\n`;
    });
    doc += `\nStatus: Verified and Signed into Tenancy Escrow.\n`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Move_In_Inspection_${unitNumber.replace(/\s+/g, '_')}.txt`;
    link.click();
    showToast('Inspection report downloaded successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Move-in / Move-out Inspections
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
            Documented condition checklists, photographic inventory, observations, and deposit sign-off.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadReport}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '9px 18px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Download size={14} />
          <span>Download Signed Report</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('move-in')}
          style={{
            background: activeTab === 'move-in' ? '#2563eb' : 'transparent',
            color: activeTab === 'move-in' ? '#ffffff' : '#64748b',
            border: 'none',
            borderRadius: '20px',
            padding: '7px 18px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Move-in Handover Inspection (June 2023)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('move-out')}
          style={{
            background: activeTab === 'move-out' ? '#2563eb' : 'transparent',
            color: activeTab === 'move-out' ? '#ffffff' : '#64748b',
            border: 'none',
            borderRadius: '20px',
            padding: '7px 18px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Move-out Exit Inspection (Pending Expiry)
        </button>
      </div>

      {/* Overview Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Demised Unit</span>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '4px' }}>
            {propertyName}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569' }}>{unitNumber}</div>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Inspection Date</span>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '4px' }}>
            21 June 2023
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Handover Protocol</div>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Inspector</span>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '4px' }}>
            Peter Kariuki
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Lead Caretaker (+254 711 223 344)</div>
        </div>

        <div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Report Status</span>
          <div style={{ marginTop: '4px' }}>
            <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.78rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              ✓ Counter-Signed & Locked
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Security Deposit: Account 2100</div>
        </div>
      </div>

      {/* 10-Item Inspection Checklist Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Physical Condition Checklist (10 Items)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Photos Attached: <strong>48 HD Verification Photos</strong>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {checklist.map((item, index) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: item.disputed ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '18px 22px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: '280px' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                      {item.name}
                    </h4>
                    <span
                      style={{
                        background: item.status === 'Good' ? '#ecfdf5' : '#fef3c7',
                        color: item.status === 'Good' ? '#059669' : '#b45309',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '8px',
                      }}
                    >
                      {item.status}
                    </span>
                    {item.disputed && (
                      <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: '8px' }}>
                        Observation Added
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                    {item.condition}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={14} color="#64748b" />
                  <span>{item.photos} photos</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenDispute(item.name)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  Add Observation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observation / Dispute Modal */}
      {showDisputeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '480px',
              maxWidth: '95vw',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Record Observation for {selectedDisputeItem}
              </h3>
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDispute} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>
                Record any existing scuffs, fixture anomalies, or notes for the official inventory to protect your security deposit.
              </p>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Your Observation / Dispute Notes:
                </label>
                <textarea
                  rows={4}
                  required
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder="e.g. Mild scratch observed behind bedroom door during move-in..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.84rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
