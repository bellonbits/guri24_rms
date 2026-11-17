import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fee2e2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <AlertCircle size={32} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
        404 — Page Not Found
      </h1>

      <p style={{ maxWidth: '460px', color: '#64748b', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
        The requested address <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{location.pathname}</code> does not exist on Guri24 RMS or may have been moved.
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Link
          to="/app/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#2563eb',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.86rem',
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
          }}
        >
          <Home size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};
