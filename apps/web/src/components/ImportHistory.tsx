import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, AlertCircle, Download, RefreshCw, X } from 'lucide-react';
import { apiClient } from '../lib/apiClient';
import { ImportJobHistoryItem } from '../lib/importEngine';

interface ImportHistoryProps {
  onClose?: () => void;
}

export const ImportHistory: React.FC<ImportHistoryProps> = ({ onClose }) => {
  const [history, setHistory] = useState<ImportJobHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getImportHistory();
      setHistory(data || []);
    } catch {
      // Fallback
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadErrors = async (job: ImportJobHistoryItem) => {
    if (!job.errors || job.errors.length === 0) return;
    try {
      const csv = await apiClient.exportImportErrors(job.errors);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `errors_${job.file_name || 'import'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Failed to generate error report.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '16px',
        background: '#111c2e',
        border: '1px solid #243656',
        borderRadius: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={18} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
            Data Import Audit History &amp; Logs
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-outline"
            onClick={fetchHistory}
            style={{ fontSize: '0.74rem', padding: '4px 10px' }}
          >
            <RefreshCw size={12} style={{ marginRight: '4px' }} /> Refresh
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
          Loading import logs...
        </div>
      ) : history.length === 0 ? (
        <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
          No previous bulk import jobs recorded yet.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', maxHeight: '340px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#0b1320', borderBottom: '1px solid #243656' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#94a3b8' }}>Timestamp</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#94a3b8' }}>Module</th>
                <th style={{ padding: '8px 12px', textAlign: 'left', color: '#94a3b8' }}>File Name</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', color: '#94a3b8' }}>Status</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', color: '#94a3b8' }}>Processed</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', color: '#4ade80' }}>Inserted</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', color: '#f87171' }}>Failed</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', color: '#94a3b8' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((job) => (
                <tr key={job.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '8px 12px', color: '#cbd5e1' }}>
                    {new Date(job.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#38bdf8' }}>
                    {job.module}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#e2e8f0' }}>{job.file_name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        background:
                          job.status === 'COMPLETED'
                            ? 'rgba(34, 197, 94, 0.15)'
                            : job.status === 'PARTIAL'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : 'rgba(239, 68, 68, 0.15)',
                        color:
                          job.status === 'COMPLETED'
                            ? '#4ade80'
                            : job.status === 'PARTIAL'
                            ? '#fbbf24'
                            : '#f87171',
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                    {job.total_rows}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#4ade80', fontWeight: 700 }}>
                    {job.inserted_count}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: job.failed_count > 0 ? '#f87171' : '#64748b', fontWeight: 700 }}>
                    {job.failed_count}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    {job.errors && job.errors.length > 0 ? (
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => handleDownloadErrors(job)}
                        style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                        title="Download error report CSV"
                      >
                        <Download size={11} style={{ marginRight: '4px' }} /> Errors CSV
                      </button>
                    ) : (
                      <span style={{ color: '#4ade80', fontSize: '0.72rem' }}>Clean</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
