import React, { useMemo } from 'react';
import { CircleDollarSign, Calendar, Home, Wrench, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { formatKes } from '../lib/formatters';
import { MiniSparkline } from './ui/Primitives';

export const TopKpiRow: React.FC = () => {
  const { currentOrg } = useAuth();
  const { state } = useRms();

  const orgInvoices = useMemo(() => {
    const list = state?.invoices || [];
    return list.filter((i) => i.organization_id === currentOrg.id);
  }, [state?.invoices, currentOrg.id]);

  const orgPayments = useMemo(() => {
    const list = state?.payments || [];
    return list.filter((p) => p.organization_id === currentOrg.id);
  }, [state?.payments, currentOrg.id]);

  const orgLeases = useMemo(() => {
    const list = state?.leases || [];
    return list.filter((l) => l.organization_id === currentOrg.id && l.status === 'ACTIVE');
  }, [state?.leases, currentOrg.id]);

  const orgUnits = useMemo(() => {
    const list = state?.units || [];
    return list.filter((u) => u.organization_id === currentOrg.id);
  }, [state?.units, currentOrg.id]);

  const orgMaintenance = useMemo(() => {
    const list = state?.maintenanceRequests || state?.maintenance || [];
    return list.filter(
      (m) => m.organization_id === currentOrg.id && m.status !== 'CLOSED' && m.status !== 'RESOLVED'
    );
  }, [state?.maintenanceRequests, state?.maintenance, currentOrg.id]);

  const collectedKes = useMemo(
    () => orgPayments.reduce((acc, p) => acc + (Number(p.allocated_amount_kes) || 0), 0),
    [orgPayments]
  );

  const vacantUnits = useMemo(
    () => orgUnits.filter((u) => u.status === 'VACANT').length,
    [orgUnits]
  );

  return (
    <section className="kpi-grid" aria-label="Key Portfolio Metrics" style={{ marginBottom: '16px' }}>
      {/* Card 1: Total Revenue */}
      <article className="kpi-card">
        <div className="kpi-header">
          <CircleDollarSign size={15} color="#4b5563" aria-hidden="true" />
          <span>Total Revenue</span>
        </div>
        <div className="kpi-value">{formatKes(collectedKes)}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>12.4%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={1} activeColor="#3b82f6" />
      </article>

      {/* Card 2: Active Leases */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Calendar size={15} color="#4b5563" aria-hidden="true" />
          <span>Active Leases</span>
        </div>
        <div className="kpi-value">{orgLeases.length}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>8.7%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={3} activeColor="#3b82f6" />
      </article>

      {/* Card 3: Available Units */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Home size={15} color="#4b5563" aria-hidden="true" />
          <span>Available Units</span>
        </div>
        <div className="kpi-value">{vacantUnits}</div>
        <div className="kpi-trend-row">
          <span className="trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>5.3%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={5} activeColor="#3b82f6" />
      </article>

      {/* Card 4: Units in Maintenance */}
      <article className="kpi-card">
        <div className="kpi-header">
          <Wrench size={15} color="#4b5563" aria-hidden="true" />
          <span>Units in Maintenance</span>
        </div>
        <div className="kpi-value">{orgMaintenance.length}</div>
        <div className="kpi-trend-row">
          <span className="trend-down" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={13} aria-hidden="true" />
            <span>2.1%</span>
          </span>
          <span className="trend-muted">vs last month</span>
        </div>
        <MiniSparkline seed={7} activeColor="#3b82f6" />
      </article>
    </section>
  );
};
