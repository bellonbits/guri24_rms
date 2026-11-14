# Module 20 — Grounded AI Agent Assistant (`assistant`)

## Grounding, RBAC, and Safety Architecture
- **Service**: Implemented in `backend/src/modules/assistant/mod.rs` (`GroundedAssistantService`) and mirrored in `apps/web/src/lib/api.ts`.
- **Tenant & Permission Scoping**:
  - Every tool execution requires `assistant.use` plus the specific domain permission (`invoices.view`, `properties.view`, `leases.view`, `maintenance.view`, `documents.view`, etc.) and filters strictly by `organization_id`.
- **Registered Tools**:
  - `get_collection_summary`, `get_arrears_report`, `get_unit_availability`, `get_maintenance_requests`, `search_documents`, `get_property_summary`, `create_maintenance_request`, `draft_tenant_notification`.
- **Source Citations**: Every assistant response returns structured `AssistantCitation` items linking to the exact `INV-*`, `LSE-*`, `Unit *`, `MNT-*`, or `ocr-job-*` records used.
- **Prompt-Injection & Cross-Tenant Guard**: Blocks any prompt attempting to ignore system instructions, bypass RBAC, or query another organization's records.
- **Action Confirmation Gate**: Mutating or external communication actions create a `PENDING` `AssistantActionConfirmation` record and only execute after explicit user approval via `POST /api/v1/assistant/confirmations/:id`.
