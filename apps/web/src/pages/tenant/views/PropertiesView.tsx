import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Info,
  Car,
  Key,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';
import type { Property, Unit, Lease } from '../../../types';

interface PropertiesViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({ onBack, showToast }) => {
  const { propertyId } = useParams<{ propertyId?: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [propsRes, unitsRes, leasesRes] = await Promise.all([
        apiClient.getProperties(),
        apiClient.getUnits(),
        apiClient.getLeases(),
      ]);
      setProperties(propsRes || []);
      setUnits(unitsRes || []);
      setLeases(leasesRes || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load property records from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter properties to authorized tenancies
  const activeTenancyCards = leases
    .filter((l) => l.status === 'ACTIVE' || l.status === 'Active Lease')
    .map((lease) => {
      const property = properties.find((p) => p.id === lease.property_id);
      const unit = units.find((u) => u.id === lease.unit_id);
      return {
        lease,
        property,
        unit,
      };
    });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: '#64748b' }}>
        <RefreshCw size={36} className="animate-spin" style={{ marginBottom: '14px', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>Loading Assigned Properties...</h3>
        <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>Querying authoritative property and lease registry.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#991b1b', margin: '0 0 6px 0' }}>Unable to Load Properties</h3>
        <p style={{ fontSize: '0.88rem', color: '#7f1d1d', margin: '0 0 16px 0' }}>{error}</p>
        <button
          onClick={loadData}
          style={{ padding: '8px 18px', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.84rem', cursor: 'pointer' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Honest Empty State
  if (activeTenancyCards.length === 0) {
    return (
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '48px 32px', textAlign: 'center', maxWidth: '640px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <Building size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
          No Properties Assigned
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          There are currently no properties linked to your tenant account. Contact property management if you believe this is incorrect.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link
            to="/portal/support"
            style={{ padding: '10px 20px', background: '#2563eb', color: '#ffffff', textDecoration: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.86rem' }}
          >
            Contact Management
          </Link>
          <button
            onClick={loadData}
            style={{ padding: '10px 18px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, fontSize: '0.86rem', color: '#475569', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Selected Detail View
  if (propertyId) {
    const selected = activeTenancyCards.find((c) => c.property?.id === propertyId || c.lease.id === propertyId);
    if (!selected || !selected.property) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Property Record Not Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>The requested property is not linked to your authenticated tenancy.</p>
          <Link to="/portal/properties" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.86rem' }}>&larr; Back to My Properties</Link>
        </div>
      );
    }

    const { property, unit, lease } = selected;

    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
        <Link
          to="/portal/properties"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600, marginBottom: '20px' }}
        >
          &larr; Back to Assigned Properties
        </Link>

        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '12px' }}>
                {unit?.unit_number || 'Unit Details'}
              </span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px 0' }}>
                {property.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#64748b' }}>
                <MapPin size={15} color="#64748b" />
                <span>{property.address || property.location || property.city || 'Property Location Recorded'}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Monthly Rent</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                KES {(lease.rent_amount || lease.rent || 0).toLocaleString()}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: '#dcfce7', color: '#15803d' }}>
                {lease.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Unit Type</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{unit?.unit_type || 'Residential Apartment'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Floor / Block</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>Floor {unit?.floor_id || '1'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Lease Period</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{lease.start_date} &bull; {lease.end_date}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Security Deposit Held</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>KES {(lease.deposit_amount || 0).toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/portal/lease"
              style={{ padding: '9px 16px', background: '#eff6ff', color: '#2563eb', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FileText size={15} /> View Full Lease Terms
            </Link>
            <Link
              to="/portal/maintenance/new"
              style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600 }}
            >
              Request Maintenance for Unit
            </Link>
            <Link
              to="/portal/support"
              style={{ padding: '9px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 600 }}
            >
              Contact Management Desk
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Listing Cards
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          My Properties & Units
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
          Properties and residential units actively leased under your verified tenant profile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {activeTenancyCards.map(({ property, unit, lease }) => (
          <div
            key={lease.id}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '24px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '4px 10px', borderRadius: '10px' }}>
                  {unit?.unit_number || 'Assigned Unit'}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: '#dcfce7', color: '#15803d' }}>
                  {lease.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                {property?.name || 'Property Residence'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
                <MapPin size={14} />
                <span>{property?.address || property?.location || property?.city || 'Address on record'}</span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Unit Type:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{unit?.unit_type || 'Apartment'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Monthly Rent:</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>KES {(lease.rent_amount || lease.rent || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Lease Expiry:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{lease.end_date || 'Active Term'}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                to={`/portal/properties/${property?.id || lease.id}`}
                style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                View Property Details & Rules &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
