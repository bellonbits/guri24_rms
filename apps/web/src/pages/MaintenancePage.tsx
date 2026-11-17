import React, { useState, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Wrench, Plus, Search, Filter, AlertTriangle, CheckCircle2, Clock, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRms } from '../context/RmsContext';
import { ResponsiveTable, StatusBadge, ModalDialog } from '../components/ui/Primitives';
import { MaintenanceRequest, MaintenanceStatus } from '../types';
import { formatKes, formatNairobiDate } from '../lib/formatters';

const STATUS_TRANSITIONS: Record<MaintenanceStatus, MaintenanceStatus[]> = {
  SUBMITTED: ['REVIEWED', 'REJECTED'],
  REVIEWED: ['APPROVED', 'REJECTED'],
  APPROVED: ['ASSIGNED', 'IN_PROGRESS'],
  REJECTED: [],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: ['VERIFIED'],
  VERIFIED: ['CLOSED'],
  CLOSED: [],
};

export const MaintenancePage: React.FC = () => {
  const { currentOrg, hasPermission } = useAuth();
  const { state, setState, createMaintenanceTicket, updateMaintenanceStatus } = useRms();
  const { id: detailTicketId } = useParams<{ id?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State
  const [ticketUnitId, setTicketUnitId] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'PLUMBING' | 'ELECTRICAL' | 'APPLIANCE' | 'STRUCTURAL'>('PLUMBING');
  const [ticketPriority, setTicketPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [ticketDescription, setTicketDescription] = useState('');

  const isVendorsView = location.pathname.includes('/vendors');

  const orgTickets = useMemo(() => {
    const list = state?.maintenanceRequests || state?.maintenance || [];
    return list.filter((m) => m.organization_id === currentOrg.id);
  }, [state?.maintenanceRequests, state?.maintenance, currentOrg.id]);
  const orgUnits = useMemo(
    () => (state?.units || []).filter((u) => u.organization_id === currentOrg.id),
    [state?.units, currentOrg.id]
  );
  const orgVendors = useMemo(
    () => (state?.vendors || []).filter((v) => v.organization_id === currentOrg.id),
    [state?.vendors, currentOrg.id]
  );

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return orgTickets;
    const q = searchQuery.toLowerCase();
    return orgTickets.filter(
      (m) =>
        m.description.toLowerCase().includes(q) ||
        m.ticket_number?.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    );
  }, [orgTickets, searchQuery]);

  // Selected Ticket Details if :id is provided
  const activeDetailTicket = useMemo(() => {
    if (!detailTicketId) return null;
    return orgTickets.find((m) => m.id === detailTicketId) || null;
  }, [detailTicketId, orgTickets]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketUnitId || !ticketDescription.trim()) return;

    const newTicket: MaintenanceRequest = {
      id: `mnt-${Date.now()}`,
      organization_id: currentOrg.id,
      unit_id: ticketUnitId,
      ticket_number: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketCategory as any,
      priority: ticketPriority as any,
      description: ticketDescription.trim(),
      status: 'SUBMITTED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    createMaintenanceTicket(newTicket);
    setTicketDescription('');
    setIsLogModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          <Link
            to="/app/maintenance"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: !isVendorsView ? '#ffffff' : 'transparent',
              color: !isVendorsView ? '#0f172a' : '#64748b',
              boxShadow: !isVendorsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Work Orders ({orgTickets.length})
          </Link>
          <Link
            to="/app/maintenance/vendors"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              background: isVendorsView ? '#ffffff' : 'transparent',
              color: isVendorsView ? '#0f172a' : '#64748b',
              boxShadow: isVendorsView ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            Approved Vendors ({orgVendors.length})
          </Link>
        </div>

        {hasPermission('maintenance.view') && (
          <button
            type="button"
            className="btn-dark"
            onClick={() => setIsLogModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Log Repair Request</span>
          </button>
        )}
      </div>

      {/* Ticket Detail Drawer if :id provided */}
      {activeDetailTicket && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Work Order #{activeDetailTicket.ticket_number || activeDetailTicket.id}
              </span>
              <h2 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                {activeDetailTicket.description}
              </h2>
            </div>
            <Link to="/app/maintenance" className="btn-outline" style={{ textDecoration: 'none' }}>
              Close
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned Unit</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                Unit {orgUnits.find((u) => u.id === activeDetailTicket.unit_id)?.unit_number || '—'}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Category & Priority</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
                {activeDetailTicket.category} &bull; {activeDetailTicket.priority}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Status</div>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge
                  status={activeDetailTicket.status}
                  tone={activeDetailTicket.status === 'COMPLETED' || activeDetailTicket.status === 'CLOSED' ? 'success' : 'warning'}
                />
              </div>
            </div>
          </div>

          {/* Status Transitions */}
          {STATUS_TRANSITIONS[activeDetailTicket.status]?.length > 0 && (
            <div style={{ marginTop: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                Advance Work Order Workflow:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {STATUS_TRANSITIONS[activeDetailTicket.status].map((next) => (
                  <button
                    key={next}
                    type="button"
                    className="btn-outline"
                    onClick={() => updateMaintenanceStatus(activeDetailTicket.id, next)}
                    style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <span>Move to {next}</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content: Tickets or Vendors */}
      {isVendorsView ? (
        <section className="surface-card">
          <ResponsiveTable
            caption="Verified Kenyan maintenance vendors and service providers"
            headers={['Vendor Company', 'Service Speciality', 'Contact Phone', 'KRA PIN', 'Rating']}
          >
            {orgVendors.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No specialized external vendors registered. Work orders dispatched in-house.
                </td>
              </tr>
            ) : (
              orgVendors.map((v) => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{v.company_name}</td>
                  <td>{v.service_category}</td>
                  <td>{v.phone}</td>
                  <td>{v.kra_pin || 'P051239841K'}</td>
                  <td style={{ fontWeight: 600, color: '#16a34a' }}>5.0 &starf;</td>
                </tr>
              ))
            )}
          </ResponsiveTable>
        </section>
      ) : (
        <section className="surface-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search maintenance requests by ticket number or issue description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ padding: '6px 12px', minBlockSize: '34px', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          <ResponsiveTable
            caption="Maintenance tickets, workflow stages, and repair dispatches"
            headers={['Ticket #', 'Unit', 'Category', 'Description', 'Priority', 'Status', 'Actions']}
          >
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px 16px', color: '#94a3b8' }}>
                  No maintenance requests logged. All residential units operational.
                </td>
              </tr>
            ) : (
              filteredTickets.map((m) => {
                const unit = orgUnits.find((u) => u.id === m.unit_id);
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 700, color: '#2563eb' }}>
                      {m.ticket_number || m.id.slice(0, 8)}
                    </td>
                    <td>Unit {unit?.unit_number || '—'}</td>
                    <td>{m.category}</td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.description}
                    </td>
                    <td>
                      <StatusBadge
                        status={m.priority}
                        tone={m.priority === 'HIGH' ? 'danger' : m.priority === 'MEDIUM' ? 'warning' : 'neutral'}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        status={m.status}
                        tone={m.status === 'COMPLETED' || m.status === 'CLOSED' ? 'success' : 'info'}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/app/maintenance/${m.id}`}
                        className="btn-outline"
                        style={{ padding: '3px 8px', fontSize: '0.74rem', textDecoration: 'none' }}
                      >
                        Workflow
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </ResponsiveTable>
        </section>
      )}

      {/* Log Repair Request Modal */}
      {isLogModalOpen && (
        <ModalDialog
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log Maintenance Work Order"
        >
          <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="field-group">
              <label>Select Unit</label>
              <select
                className="form-control"
                value={ticketUnitId}
                onChange={(e) => setTicketUnitId(e.target.value)}
                required
              >
                <option value="">-- Choose Unit --</option>
                {orgUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unit_number} ({u.unit_type})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div className="field-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                >
                  <option value="PLUMBING">Plumbing & Water</option>
                  <option value="ELECTRICAL">Electrical & Power</option>
                  <option value="APPLIANCE">Appliance</option>
                  <option value="STRUCTURAL">Structural & Masonry</option>
                </select>
              </div>

              <div className="field-group">
                <label>Priority</label>
                <select
                  className="form-control"
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value as any)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label>Issue Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Detailed description of repair needed..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button type="button" className="btn-outline" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-dark">
                Dispatch Work Order
              </button>
            </div>
          </form>
        </ModalDialog>
      )}
    </div>
  );
};
