import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Building,
  Home,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Mail,
  Shield,
  Download,
  ExternalLink,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Info,
  Car,
  Key,
  FileText,
} from 'lucide-react';

interface PropertiesViewProps {
  activeTenancyId: string;
  onSwitchTenancy: (id: string) => void;
  currencyMode: 'KES' | 'USD';
  fmt: (amountKes: number, amountUsd?: number) => string;
  showToast: (msg: string) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  activeTenancyId,
  onSwitchTenancy,
  currencyMode,
  fmt,
  showToast,
}) => {
  const { propertyId } = useParams<{ propertyId?: string }>();

  const properties = [
    {
      id: 'prop-greenview',
      tenancyId: 'tenancy-greenview',
      name: 'Greenview Luxury Residences',
      address: '9865 Aurore Expressway, Ruiru, Kiambu County',
      block: 'Block A',
      unitNumber: 'Unit A-204',
      unitType: '2 Bedroom Master Ensuite',
      dimensions: '12x8 m² · 96 m²',
      occupancyStatus: 'Occupied · Verified Resident',
      leaseStatus: 'Active Lease',
      leaseStart: '21 June 2023',
      leaseExpires: '21 June 2024',
      monthlyRentKes: 25000,
      monthlyRentUsd: 5000,
      serviceChargeKes: 2500,
      depositKes: 25000,
      parkingSlot: 'P-204 (Covered)',
      accessCard: '9834Y65',
      managerName: 'Katherine Moss',
      managerRole: 'Lead Property Manager',
      managerPhone: '+254 722 000 111',
      managerEmail: 'management@unitflow.ke',
      caretakerName: 'Peter Kariuki',
      caretakerPhone: '+254 711 223 344',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      amenities: [
        'High-Speed Fiber Ready (Safaricom/Zuku)',
        'Solar Water Heating + Instant Backup',
        '24/7 Manned Gate & Biometric Access',
        'Borehole & 50,000L Reserve Tanks',
        'Resident Swimming Pool & Gym',
        'Allocated Covered Parking P-204',
      ],
      rules: [
        'Quiet hours strictly observed between 10:00 PM and 6:00 AM.',
        'Visitors must log in at the front security gate guardhouse.',
        'Waste sorting: separate organic from recyclables at ground collection point.',
        'No modifications or drilling into external load-bearing concrete walls.',
      ],
    },
    {
      id: 'prop-silveroak',
      tenancyId: 'tenancy-silveroak',
      name: 'Silver Oak Apartments',
      address: 'Parklands Road, Westlands, Nairobi County',
      block: 'Block B',
      unitNumber: 'Unit B-12',
      unitType: '1 Bedroom Executive Studio',
      dimensions: '8x8 m² · 64 m²',
      occupancyStatus: 'Occupied · Verified Resident',
      leaseStatus: 'Active Lease',
      leaseStart: '1 Jan 2024',
      leaseExpires: '31 Dec 2024',
      monthlyRentKes: 32000,
      monthlyRentUsd: 6400,
      serviceChargeKes: 3000,
      depositKes: 32000,
      parkingSlot: 'B-12 (Basement 1)',
      accessCard: '7729X14',
      managerName: 'Daniel Ochieng',
      managerRole: 'Senior Property Manager',
      managerPhone: '+254 720 334 455',
      managerEmail: 'westlands@unitflow.ke',
      caretakerName: 'John Macharia',
      caretakerPhone: '+254 722 554 433',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      amenities: [
        'High-Speed Fiber Internet',
        'Standby Power Backup Generator',
        '24/7 CCTV & Intercom System',
        'High-Speed Elevator Access',
        'Rooftop Terrace Lounge',
        'Basement Dedicated Parking Slot',
      ],
      rules: [
        'Strictly residential occupancy only.',
        'Pets permitted with prior written management endorsement.',
        'Parking restricted to assigned slot B-12 only.',
      ],
    },
  ];

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(propertyId || 'prop-greenview');
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            My Properties & Units
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#64748b' }}>
            View properties associated with your active leases, check amenities, rules, and switch tenancies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Active Tenancies:</span>
          <span
            style={{
              background: '#eff6ff',
              color: '#2563eb',
              fontSize: '0.76rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid #bfdbfe',
            }}
          >
            {properties.length} Units Active
          </span>
        </div>
      </div>

      {/* Properties Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '20px',
        }}
      >
        {properties.map((prop) => {
          const isCurrentActive = prop.tenancyId === activeTenancyId;
          const isSelected = prop.id === selectedPropertyId;

          return (
            <div
              key={prop.id}
              style={{
                background: '#ffffff',
                border: isCurrentActive ? '2px solid #2563eb' : isSelected ? '1.5px solid #94a3b8' : '1px solid #e2e8f0',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: isCurrentActive ? '0 8px 30px rgba(37, 99, 235, 0.12)' : '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Photo & Status Banner */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={prop.image}
                  alt={prop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Building size={13} color="#38bdf8" />
                  <span>{prop.block} &bull; {prop.unitNumber}</span>
                </div>

                {isCurrentActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: '#10b981',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={12} color="#ffffff" />
                    <span>Primary Active</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                    {prop.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#94a3b8" />
                    <span>{prop.address}</span>
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Unit Specs</span>
                    <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{prop.unitType}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{prop.dimensions}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Rent</span>
                    <div style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.96rem', marginTop: '2px' }}>
                      {fmt(prop.monthlyRentKes, prop.monthlyRentUsd)}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>+ {fmt(prop.serviceChargeKes)} service</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#475569' }}>
                  <span>Parking: <strong>{prop.parkingSlot}</strong></span>
                  <span>Card: <strong style={{ fontFamily: 'monospace' }}>{prop.accessCard}</strong></span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyId(prop.id)}
                    style={{
                      flex: 1,
                      background: isSelected ? '#0f172a' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '9px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    View Details & Rules
                  </button>

                  {!isCurrentActive ? (
                    <button
                      type="button"
                      onClick={() => {
                        onSwitchTenancy(prop.tenancyId);
                        showToast(`Switched active portal tenancy to ${prop.name}!`);
                      }}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '9px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Make Primary
                    </button>
                  ) : (
                    <Link
                      to="/portal/dashboard"
                      style={{
                        background: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        borderRadius: '10px',
                        padding: '9px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Dashboard &rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Property Details Drawer / Section */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Demised Unit Information & Bylaws
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
              {selectedProperty.name} &bull; {selectedProperty.unitNumber}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/portal/lease"
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#0f172a',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText size={14} color="#2563eb" />
              <span>View Lease Terms</span>
            </Link>
            <Link
              to="/portal/messages"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Mail size={14} />
              <span>Contact Management</span>
            </Link>
          </div>
        </div>

        {/* 3 Detail Columns: Facilities, Estate Bylaws, Management Contacts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Facilities & Amenities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#2563eb" />
              <span>Facilities & Amenities</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedProperty.amenities.map((am, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Estate Rules & Access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={16} color="#059669" />
              <span>Estate Rules & Security</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedProperty.rules.map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  <span style={{ color: '#059669', fontWeight: 800 }}>&bull;</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Property Management Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="#7c3aed" />
              <span>Assigned Property Management</span>
            </h4>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                {selectedProperty.managerName}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                {selectedProperty.managerRole}
              </div>
              <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#0f172a' }}>
                <Phone size={13} color="#2563eb" />
                <span>{selectedProperty.managerPhone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#0f172a' }}>
                <Mail size={13} color="#2563eb" />
                <span>{selectedProperty.managerEmail}</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                Caretaker: <strong>{selectedProperty.caretakerName}</strong> ({selectedProperty.caretakerPhone})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
