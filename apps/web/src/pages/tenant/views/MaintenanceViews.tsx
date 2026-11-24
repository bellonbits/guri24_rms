import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Camera,
  Upload,
  User,
  Phone,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface MaintenanceViewsProps {
  mode: 'new' | 'detail';
  requestId?: string;
  onBack?: () => void;
  showToast?: (msg: string) => void;
  onNavigateDetail?: (id: string) => void;
}

export const MaintenanceViews: React.FC<MaintenanceViewsProps> = ({
  mode,
  requestId = 'REQ-2026-0089',
  onBack,
  showToast,
  onNavigateDetail,
}) => {
  // New Request Form State
  const [category, setCategory] = useState('PLUMBING');
  const [location, setLocation] = useState('Kitchen');
  const [priority, setPriority] = useState('NORMAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preferredAccess, setPreferredAccess] = useState('Morning (8am - 12pm)');
  const [permissionToEnter, setPermissionToEnter] = useState(true);
  const [petOnPremises, setPetOnPremises] = useState(false);
  const [petDetails, setPetDetails] = useState('');
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail View State
  const [ticketStage, setTicketStage] = useState(3); // 0=Submitted, 1=Triage, 2=Assigned, 3=In Progress, 4=Completed
  const [tenantRating, setTenantRating] = useState(5);
  const [tenantFeedback, setTenantFeedback] = useState('');
  const [isSignedOff, setIsSignedOff] = useState(false);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      if (showToast) showToast('Please provide an issue title and description.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newId = `REQ-2026-0${Math.floor(Math.random() * 800 + 100)}`;
      if (showToast) {
        showToast(`Request ${newId} submitted! Caretaker will contact you within SLA.`);
      }
      if (onNavigateDetail) {
        onNavigateDetail(newId);
      } else if (onBack) {
        onBack();
      }
    }, 1000);
  };

  const handleSignOff = () => {
    setIsSignedOff(true);
    setTicketStage(4);
    if (showToast) {
      showToast('Thank you! Resolution signed off and feedback recorded.');
    }
  };

  if (mode === 'new') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Back navigation */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            marginBottom: '16px',
          }}
        >
          <ArrowLeft size={16} /> Back to Maintenance List
        </button>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '12px' }}>
              Unit Flow Facilities
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#131726', margin: '8px 0 4px 0', letterSpacing: '-0.02em' }}>
              Submit Maintenance Request
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              Report a defect or maintenance issue for Unit A-204. Our triage team will assign a verified technician.
            </p>
          </div>

          <form onSubmit={handleCreateRequest}>
            {/* Category selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Issue Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'PLUMBING', label: 'Plumbing' },
                  { id: 'ELECTRICAL', label: 'Electrical' },
                  { id: 'APPLIANCE', label: 'Appliance' },
                  { id: 'CARPENTRY', label: 'Carpentry' },
                  { id: 'LOCKSMITH', label: 'Lock & Door' },
                  { id: 'PEST_CONTROL', label: 'Pest Control' },
                  { id: 'HVAC', label: 'Ventilation' },
                  { id: 'OTHER', label: 'Other Issue' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: category === cat.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: category === cat.id ? '#eff6ff' : '#ffffff',
                      color: category === cat.id ? '#2563eb' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location in unit */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Location in Unit
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="Kitchen">Kitchen</option>
                <option value="Master Bedroom">Master Bedroom</option>
                <option value="Bedroom 2">Bedroom 2</option>
                <option value="Master Bathroom">Master Bathroom</option>
                <option value="Guest Bathroom">Guest Bathroom</option>
                <option value="Living Room">Living Room</option>
                <option value="Balcony">Balcony & Patio</option>
                <option value="Parking Bay">Parking Bay #02</option>
              </select>
            </div>

            {/* Priority */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Urgency & Priority
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { id: 'LOW', label: 'Low', desc: 'Non-urgent' },
                  { id: 'NORMAL', label: 'Normal', desc: 'Standard 48hr' },
                  { id: 'HIGH', label: 'High', desc: 'Urgent 24hr' },
                  { id: 'EMERGENCY', label: 'Emergency', desc: 'Flood/Spark' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '2px solid #ef4444'
                            : '2px solid #2563eb'
                          : '1px solid #e2e8f0',
                      background:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '#fef2f2'
                            : '#eff6ff'
                          : '#ffffff',
                      color:
                        priority === p.id
                          ? p.id === 'EMERGENCY'
                            ? '#dc2626'
                            : '#2563eb'
                          : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem' }}>{p.label}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 400, marginTop: '2px' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Issue Title / Summary
              </label>
              <input
                type="text"
                placeholder="e.g. Under-sink shutoff valve dripping water slowly"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Detailed Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe when the issue started, whether it causes leaks or tripping breakers, and any temporary steps taken..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            {/* Photo upload mock */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Photos / Short Video Evidence
              </label>
              <div
                onClick={() => setPhotosUploaded(!photosUploaded)}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: photosUploaded ? '#f0fdf4' : '#f8fafc',
                  cursor: 'pointer',
                  borderColor: photosUploaded ? '#86efac' : '#cbd5e1',
                }}
              >
                {photosUploaded ? (
                  <div style={{ color: '#16a34a' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>2 photos attached (sink_leak_1.jpg, valve_close.jpg)</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Click to replace attachments</div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b' }}>
                    <Camera size={32} style={{ margin: '0 auto 8px auto', color: '#94a3b8' }} />
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#334155' }}>
                      Click to upload photos or videos
                    </div>
                    <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>
                      Clear photos significantly accelerate diagnosis and parts procurement
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Access & Permission toggles */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Preferred Access Time
                </label>
                <select
                  value={preferredAccess}
                  onChange={(e) => setPreferredAccess(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                >
                  <option value="Morning (8am - 12pm)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12pm - 5pm)">Afternoon (12:00 PM - 5:00 PM)</option>
                  <option value="Evening (5pm - 7pm)">Evening (5:00 PM - 7:00 PM)</option>
                  <option value="Any time with Caretaker">Any time provided Caretaker is present</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="permissionEntry"
                  checked={permissionToEnter}
                  onChange={(e) => setPermissionToEnter(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="permissionEntry" style={{ fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <strong>Permission to enter:</strong> I authorize technician & caretaker to access the unit if I am not home.
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="petAlert"
                  checked={petOnPremises}
                  onChange={(e) => setPetOnPremises(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="petAlert" style={{ fontSize: '0.82rem', color: '#334155', cursor: 'pointer' }}>
                  <strong>Pet on premises alert:</strong> Warn technician about indoor pets.
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onBack}
                style={{
                  padding: '12px 20px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '12px 26px',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                }}
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Maintenance Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Detail Mode
  const stages = [
    { title: 'Submitted', time: '20 Nov, 08:30 AM', done: ticketStage >= 0 },
    { title: 'Triage & Approved', time: '20 Nov, 09:15 AM', done: ticketStage >= 1 },
    { title: 'Contractor Assigned', time: '20 Nov, 11:00 AM', done: ticketStage >= 2 },
    { title: 'In Progress', time: '21 Nov, 09:00 AM', done: ticketStage >= 3 },
    { title: 'Sign-Off Completed', time: isSignedOff ? '22 Nov, 04:30 PM' : 'Pending', done: ticketStage >= 4 },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#64748b',
          fontSize: '0.86rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginBottom: '16px',
        }}
      >
        <ArrowLeft size={16} /> Back to Maintenance
      </button>

      {/* Header Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', fontFamily: 'monospace' }}>
                {requestId}
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb' }}>
                PLUMBING
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626' }}>
                HIGH PRIORITY
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#131726', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              Kitchen Sink Shutoff Valve Water Leak
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Unit A-204 • Reported on 20 Nov 2026, 08:30 AM by Courtney Henry
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                background: ticketStage === 4 ? '#dcfce7' : '#eff6ff',
                color: ticketStage === 4 ? '#15803d' : '#2563eb',
              }}
            >
              {ticketStage === 4 ? 'RESOLVED & SIGNED OFF' : 'IN PROGRESS'}
            </span>
          </div>
        </div>

        {/* Stepper */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          {stages.map((st, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: st.done ? '#2563eb' : '#f1f5f9',
                  color: st.done ? '#ffffff' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  margin: '0 auto 6px auto',
                }}
              >
                {st.done ? '✓' : idx + 1}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: st.done ? 700 : 500, color: st.done ? '#131726' : '#94a3b8' }}>
                {st.title}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>{st.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Details & Contractor Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        {/* Left: Description & Photos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 12px 0' }}>
              Issue Details & Tenant Notes
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              The copper angle valve under the double-bowl kitchen sink began leaking at the compression fitting. A plastic bucket has been placed underneath to prevent cabinet base warping.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <img
                src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80"
                alt="Defect Photo"
                style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
              <img
                src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=300&q=80"
                alt="Defect Photo 2"
                style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          {/* Activity Log */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 16px 0' }}>
              Maintenance Timeline & Updates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '2px solid #2563eb', paddingLeft: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#131726' }}>Technician On-Site Inspection</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>21 Nov 2026, 09:45 AM • Peter Kariuki</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>
                  Replaced Teflon tape and installed new 1/2-inch brass angle valve. Pressure tested for 20 minutes with zero drops.
                </div>
              </div>
              <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#131726' }}>Parts Procurement Approved</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>20 Nov 2026, 01:20 PM • Sarah Nduta (Accounts)</div>
                <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>
                  Covered under landlord property maintenance reserve (KES 1,800). Tenant liability: KES 0.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contractor & Sign-Off Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Assigned Technician */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 16px 0' }}>
              Assigned Contractor
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <img
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=140&h=140&q=80"
                alt="Technician"
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#131726' }}>Peter Kariuki</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Certified Master Plumber • Nairobi Hydros</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#eab308', marginTop: '2px' }}>
                  <Star size={13} fill="#eab308" />
                  <span style={{ fontWeight: 700, color: '#131726' }}>4.9</span>
                  <span style={{ color: '#94a3b8' }}>(142 estate jobs)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="tel:+254712000000"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <Phone size={14} /> Call Technician
              </a>
            </div>
          </div>

          {/* Resolution Sign-Off */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#131726', margin: '0 0 8px 0' }}>
              Tenant Resolution Sign-Off
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Confirm that the repairs meet your satisfaction.
            </p>

            {isSignedOff ? (
              <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#166534' }}>
                  Resolution Confirmed & Signed
                </div>
                <div style={{ fontSize: '0.76rem', color: '#15803d', marginTop: '4px' }}>
                  Rated 5 Stars: "Quick and clean workmanship"
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTenantRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star
                        size={22}
                        fill={star <= tenantRating ? '#eab308' : '#e2e8f0'}
                        color={star <= tenantRating ? '#eab308' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  placeholder="Optional feedback on workmanship..."
                  value={tenantFeedback}
                  onChange={(e) => setTenantFeedback(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', marginBottom: '14px' }}
                />

                <button
                  onClick={handleSignOff}
                  style={{
                    width: '100%',
                    padding: '11px',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                  }}
                >
                  Confirm & Sign Off Repair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
