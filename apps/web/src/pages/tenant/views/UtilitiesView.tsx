import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Calendar,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  FileText,
  Download,
  AlertCircle,
  HelpCircle,
  Info,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface UtilitiesViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({ onBack, showToast }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submit' | 'history'>('overview');
  const [selectedMeter, setSelectedMeter] = useState<'water' | 'power'>('water');

  // Submit reading state
  const [readingMeter, setReadingMeter] = useState<'water' | 'power'>('water');
  const [readingValue, setReadingValue] = useState('');
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Meter data
  const meters = {
    water: {
      type: 'Water Meter (Sub-metered)',
      meterNo: 'WTR-A204-7719',
      location: 'Service Duct B, 2nd Floor',
      unit: 'm³',
      previousReading: 142.4,
      currentReading: 153.8,
      consumption: 11.4,
      ratePerUnit: 150, // KES 150 per m3
      baseCharge: 200,
      totalKes: 1910,
      readingDate: '15 Nov 2026',
      verifiedBy: 'John Kariuki (Building Caretaker)',
      status: 'VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
      avgBuildingConsumption: 14.2,
      trend: -19.7, // % lower than average
    },
    power: {
      type: 'Electricity Meter (Kenya Power Postpaid)',
      meterNo: 'KPLC-8902-1145',
      location: 'Ground Floor Meter Room, Bay 4',
      unit: 'kWh',
      previousReading: 2840,
      currentReading: 3012,
      consumption: 172,
      ratePerUnit: 28.5, // KES 28.50 per kWh
      fuelEnergyCharge: 420,
      totalKes: 5322,
      readingDate: '18 Nov 2026',
      verifiedBy: 'Automatic Smart Telemetry (KPLC AMI)',
      status: 'VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1558441719-72f1e680a6c6?auto=format&fit=crop&w=400&q=80',
      avgBuildingConsumption: 195,
      trend: -11.8,
    },
  };

  const history = [
    { period: 'November 2026', waterM3: 11.4, waterKes: 1910, powerKwh: 172, powerKes: 5322, totalKes: 7232, status: 'Billed' },
    { period: 'October 2026', waterM3: 12.8, waterKes: 2120, powerKwh: 185, powerKes: 5692, totalKes: 7812, status: 'Paid' },
    { period: 'September 2026', waterM3: 10.9, waterKes: 1835, powerKwh: 168, powerKes: 5208, totalKes: 7043, status: 'Paid' },
    { period: 'August 2026', waterM3: 13.5, waterKes: 2225, powerKwh: 190, powerKes: 5835, totalKes: 8060, status: 'Paid' },
    { period: 'July 2026', waterM3: 11.1, waterKes: 1865, powerKwh: 164, powerKes: 5094, totalKes: 6959, status: 'Paid' },
    { period: 'June 2026', waterM3: 12.0, waterKes: 2000, powerKwh: 175, powerKes: 5407, totalKes: 7407, status: 'Paid' },
  ];

  const handleSubmitReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingValue) {
      if (showToast) showToast('Please enter the current meter reading value.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPhotoUploaded(false);
      setReadingValue('');
      if (showToast) {
        showToast(`Meter reading ${readingValue} submitted! Our caretaker will verify within 24 hours.`);
      }
      setActiveTab('overview');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>
              Unit Flow Services
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Greenview Luxury Residences · Unit A-204</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#131726', letterSpacing: '-0.02em', margin: 0 }}>
            Utilities & Meter Readings
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Accurate, transparent sub-metered water and electricity tracking with photo verification.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('submit')}
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
            <Camera size={16} />
            Submit Meter Reading
          </button>
          <button
            onClick={() => {
              if (showToast) showToast('Utility summary statement downloaded.');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            Export Statement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Active Meters & Telemetry' },
          { id: 'submit', label: 'Submit Self-Reading' },
          { id: 'history', label: 'Consumption History & Tariffs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Water Meter Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Droplets size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: 0 }}>Water Sub-Meter</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>{meters.water.meterNo}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px' }}>
                VERIFIED
              </span>
            </div>

            {/* Consumption Highlights */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Current Month Consumption</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#131726' }}>
                  {meters.water.consumption} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>m³</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#16a34a' }}>
                <TrendingDown size={14} />
                <span><strong>19.7% lower</strong> than Greenview building average (14.2 m³)</span>
              </div>
            </div>

            {/* Detailed Readings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Previous Reading (15 Oct):</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>{meters.water.previousReading} m³</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Current Reading (15 Nov):</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>{meters.water.currentReading} m³</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Tariff Rate:</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>KES {meters.water.ratePerUnit} / m³</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                <span style={{ fontWeight: 700, color: '#131726' }}>Current Billed Amount:</span>
                <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1rem' }}>KES {meters.water.totalKes.toLocaleString()}</span>
              </div>
            </div>

            {/* Verifier Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '0.75rem', color: '#166534' }}>
              <CheckCircle2 size={15} />
              <span>Inspected & verified by <strong>{meters.water.verifiedBy}</strong> on {meters.water.readingDate}</span>
            </div>
          </div>

          {/* Electricity Meter Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Zap size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: 0 }}>Electricity Meter</h3>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>{meters.power.meterNo}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px' }}>
                VERIFIED
              </span>
            </div>

            {/* Consumption Highlights */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Current Month Usage</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#131726' }}>
                  {meters.power.consumption} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b' }}>kWh</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#16a34a' }}>
                <TrendingDown size={14} />
                <span><strong>11.8% lower</strong> than building average (195 kWh)</span>
              </div>
            </div>

            {/* Detailed Readings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Previous Meter Reading:</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>{meters.power.previousReading} kWh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Current Meter Reading:</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>{meters.power.currentReading} kWh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>KPLC Base Energy Tariff:</span>
                <span style={{ fontWeight: 600, color: '#131726' }}>KES {meters.power.ratePerUnit} / kWh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                <span style={{ fontWeight: 700, color: '#131726' }}>Current Billed Amount:</span>
                <span style={{ fontWeight: 800, color: '#d97706', fontSize: '1rem' }}>KES {meters.power.totalKes.toLocaleString()}</span>
              </div>
            </div>

            {/* Verifier Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '0.75rem', color: '#166534' }}>
              <CheckCircle2 size={15} />
              <span>Automated telemetry reading logged on {meters.power.readingDate}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'submit' && (
        <div style={{ maxWidth: '640px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#131726', margin: '0 0 6px 0' }}>
            Submit Self-Meter Reading
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Take a clear photo of your meter dial and enter the current numerical value. The property manager will review and confirm.
          </p>

          <form onSubmit={handleSubmitReading}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Select Meter Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReadingMeter('water')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: readingMeter === 'water' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: readingMeter === 'water' ? '#eff6ff' : '#ffffff',
                    color: readingMeter === 'water' ? '#2563eb' : '#475569',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Droplets size={16} /> Water Meter
                </button>
                <button
                  type="button"
                  onClick={() => setReadingMeter('power')}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: readingMeter === 'power' ? '2px solid #d97706' : '1px solid #e2e8f0',
                    background: readingMeter === 'power' ? '#fef3c7' : '#ffffff',
                    color: readingMeter === 'power' ? '#d97706' : '#475569',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Zap size={16} /> Electricity Meter
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Current Meter Dial Reading ({readingMeter === 'water' ? 'm³' : 'kWh'})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder={readingMeter === 'water' ? 'e.g. 153.8' : 'e.g. 3012'}
                value={readingValue}
                onChange={(e) => setReadingValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Reading Date
              </label>
              <input
                type="date"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Photo Evidence of Dial
              </label>
              <div
                onClick={() => setPhotoUploaded(!photoUploaded)}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: photoUploaded ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  borderColor: photoUploaded ? '#86efac' : '#cbd5e1',
                }}
              >
                {photoUploaded ? (
                  <div style={{ color: '#16a34a' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>meter_reading_photo.jpg attached</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Click to replace photo</div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b' }}>
                    <Camera size={32} style={{ margin: '0 auto 8px auto', color: '#94a3b8' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#334155' }}>
                      Click to upload or capture photo
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Ensure numbers and meter serial number are readable</div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Submitting Reading...' : 'Submit for Property Manager Verification'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#131726', margin: 0 }}>
                Utility Consumption History
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Monthly itemized water and power consumption for Unit A-204
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '14px 20px' }}>Billing Period</th>
                  <th style={{ padding: '14px 20px' }}>Water (m³)</th>
                  <th style={{ padding: '14px 20px' }}>Water (KES)</th>
                  <th style={{ padding: '14px 20px' }}>Power (kWh)</th>
                  <th style={{ padding: '14px 20px' }}>Power (KES)</th>
                  <th style={{ padding: '14px 20px' }}>Total (KES)</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#131726' }}>{row.period}</td>
                    <td style={{ padding: '14px 20px', color: '#2563eb', fontWeight: 600 }}>{row.waterM3} m³</td>
                    <td style={{ padding: '14px 20px', color: '#334155' }}>KES {row.waterKes.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', color: '#d97706', fontWeight: 600 }}>{row.powerKwh} kWh</td>
                    <td style={{ padding: '14px 20px', color: '#334155' }}>KES {row.powerKes.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#131726' }}>KES {row.totalKes.toLocaleString()}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: row.status === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: row.status === 'Paid' ? '#15803d' : '#b45309',
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
