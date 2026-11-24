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
} from '../../../components/heroicons';

interface UtilitiesViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({ onBack, showToast }) => {
  // Check if sub-metering services are configured for this unit
  // In production, when the organization hasn't configured sub-meters, show an honest empty state.
  const [hasSubMeters, setHasSubMeters] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [meterType, setMeterType] = useState('WATER');
  const [readingValue, setReadingValue] = useState('');
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readingValue) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setShowSubmitModal(false);
      setReadingValue('');
      if (showToast) {
        showToast(`Meter reading ${readingValue} submitted! Property management will verify before billing.`);
      }
    }, 700);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Utilities & Services
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Transparent tracking of sub-metered water, power consumption, and service charges.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
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
          <Camera size={16} /> Submit Meter Reading
        </button>
      </div>

      {!hasSubMeters ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '640px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <Zap size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
            No Sub-Metered Services Configured
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            No active sub-meters have been assigned to your unit by property management. For units with post-paid sub-meters or token tracking, verified meter readings and tariffs will display here.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowSubmitModal(true)}
              style={{ padding: '9px 18px', background: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
            >
              Submit Self-Reading
            </button>
          </div>
        </div>
      ) : null}

      {/* Modal */}
      {showSubmitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Submit Meter Reading
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 18px 0' }}>
              Enter your current numerical dial reading. The building caretaker will verify before billing.
            </p>

            <form onSubmit={handleSubmitReading}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Utility Meter
                </label>
                <select
                  value={meterType}
                  onChange={(e) => setMeterType(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                >
                  <option value="WATER">Water Sub-Meter (m³)</option>
                  <option value="POWER">Electricity Meter (kWh)</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Current Dial Reading Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 153.8"
                  value={readingValue}
                  onChange={(e) => setReadingValue(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Reading Date
                </label>
                <input
                  type="date"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  style={{ padding: '9px 16px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '9px 20px', background: '#2563eb', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, color: '#ffffff', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Reading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
