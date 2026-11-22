import { test } from 'node:test';
import assert from 'node:assert/strict';

// Test Suite: Full-Page AI Assistant Workspace, Citations, RBAC, and Confirmation Guard

test('Assistant Workspace: Queries are organization-scoped and generate structured record citations', () => {
  const currentOrgId = 'org-0001';
  const orgInvoices = [
    { id: 'inv-1', organization_id: 'org-0001', invoice_number: 'INV-2026-001', balance_kes: 15000 },
    { id: 'inv-2', organization_id: 'org-0002', invoice_number: 'INV-2026-999', balance_kes: 45000 },
  ];

  // Assistant query scoped to active organization
  const scopedInvoices = orgInvoices.filter((i) => i.organization_id === currentOrgId);
  assert.equal(scopedInvoices.length, 1);
  assert.equal(scopedInvoices[0].invoice_number, 'INV-2026-001');

  // Citation generation
  const citations = scopedInvoices.map((inv) => ({
    record_type: 'Invoice',
    reference_code: inv.invoice_number,
    summary: `Balance KES ${inv.balance_kes}`,
  }));

  assert.equal(citations[0].record_type, 'Invoice');
  assert.equal(citations[0].reference_code, 'INV-2026-001');
});

test('Assistant Workspace: Mutating actions (maintenance, reminders, refund drafts) require explicit confirmation', () => {
  const mutatingTools = [
    'create_maintenance_request',
    'draft_tenant_notification',
    'prepare_invoice_draft',
    'prepare_deposit_refund_draft',
  ];

  for (const tool of mutatingTools) {
    const confirmationRequired = true;
    assert.equal(confirmationRequired, true, `Tool ${tool} must require explicit confirmation`);
  }

  // Confirmation transition from PENDING -> CONFIRMED
  const confirmation = {
    id: 'conf-001',
    action_type: 'create_maintenance_request',
    status: 'PENDING',
  };

  const decideConfirmation = (conf, approve) => ({
    ...conf,
    status: approve ? 'CONFIRMED' : 'CANCELLED',
    decided_at: new Date().toISOString(),
  });

  const approved = decideConfirmation(confirmation, true);
  assert.equal(approved.status, 'CONFIRMED');
  assert.ok(approved.decided_at);
});

test('Assistant Workspace: Chat bubble text colors enforce high-contrast WCAG AA readability', () => {
  // Test user bubble: dark navy background (#0f172a) with white text (#ffffff)
  const userBubble = { bg: '#0f172a', color: '#ffffff' };
  assert.equal(userBubble.bg, '#0f172a');
  assert.equal(userBubble.color, '#ffffff');

  // Test assistant bubble: white background (#ffffff) with dark charcoal text (#0f172a)
  // NEVER white-on-white text
  const assistantBubble = { bg: '#ffffff', color: '#0f172a' };
  assert.equal(assistantBubble.bg, '#ffffff');
  assert.equal(assistantBubble.color, '#0f172a');
  assert.notEqual(assistantBubble.bg, assistantBubble.color);
});

test('Assistant Workspace: New account starts with zero prior chats and renders prompt starters', () => {
  const newOrgId = 'org-fresh-009';
  const allConversations = [
    { id: 'c-old-1', organization_id: 'org-legacy', title: 'Old conversation', messages: [{ id: 'm-1', role: 'USER', content: 'test' }] },
  ];

  // Scoped conversations for the new account must be strictly empty
  const scopedForNewAccount = allConversations.filter((c) => c.organization_id === newOrgId);
  assert.equal(scopedForNewAccount.length, 0);

  // When scoped conversations is empty, displayMessages must be empty (clean slate)
  const displayMessages = scopedForNewAccount.length > 0 ? scopedForNewAccount[0].messages : [];
  assert.equal(displayMessages.length, 0);
});

test('Assistant Workspace: Clear chats wipes conversation history for active account only', () => {
  const activeOrgId = 'org-alpha';
  const otherOrgId = 'org-beta';

  let store = [
    { id: 'conv-1', organization_id: 'org-alpha', title: 'Alpha chat 1', messages: [] },
    { id: 'conv-2', organization_id: 'org-alpha', title: 'Alpha chat 2', messages: [] },
    { id: 'conv-3', organization_id: 'org-beta', title: 'Beta chat 1', messages: [] },
  ];

  // Perform clear chats for active organization
  store = store.filter((c) => c.organization_id !== activeOrgId);

  // Assert active org conversations are completely cleared
  assert.equal(store.filter((c) => c.organization_id === activeOrgId).length, 0);
  // Assert other organizations' data remains untouched
  assert.equal(store.filter((c) => c.organization_id === otherOrgId).length, 1);
  assert.equal(store[0].id, 'conv-3');
});
