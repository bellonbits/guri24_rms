import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Download,
  Filter,
  Search,
  RefreshCw,
  Building,
} from 'lucide-react';
import { apiClient } from '../../../lib/apiClient';

interface AnnouncementsViewProps {
  onBack?: () => void;
  showToast?: (msg: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ onBack, showToast }) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const notifs = await apiClient.getNotificationDeliveries().catch(() => []);
        const filtered = (notifs || []).filter((n: any) => n.template_key?.includes('ANNOUNCEMENT') || n.subject?.toLowerCase().includes('notice'));
        setAnnouncements(filtered);
      } catch {
        setAnnouncements([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b' }}>
        <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#2563eb' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Loading Building Announcements...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          Announcements & Notices
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
          Official notices, utility schedules, and estate updates published by property management.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '48px 32px', textAlign: 'center', maxWidth: '600px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <Megaphone size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto', strokeWidth: 1.5 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '0 0 8px 0' }}>
            No Announcements Published
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
            There are currently no published announcements or notices targeted to your building. Check back here for updates on maintenance schedules, utility works, or security circulars.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((item) => (
            <div key={item.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: '#eff6ff', color: '#2563eb' }}>
                  {item.template_key || 'GENERAL NOTICE'}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{item.created_at || 'Recently'}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                {item.subject || 'Building Notice'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                {item.content || item.error_message || 'Notice content on file.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
