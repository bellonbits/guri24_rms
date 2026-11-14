use std::{
    collections::HashMap,
    sync::{Arc, RwLock},
};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    core::{
        errors::{AppError, AppResult},
        tenant_context::TenantContext,
    },
    integrations::storage::{SignedDocumentUrl, StorageAdapter},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentRecord {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub category: String,
    pub entity_type: String,
    pub entity_id: Uuid,
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: u64,
    #[serde(skip_serializing)]
    pub s3_object_key: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RegisterDocumentCommand {
    pub category: String,
    pub entity_type: String,
    pub entity_id: Uuid,
    pub file_name: String,
    pub mime_type: String,
    pub file_size_bytes: u64,
}

pub trait DocumentRepository: Send + Sync {
    fn register_document(
        &self,
        ctx: &TenantContext,
        cmd: RegisterDocumentCommand,
    ) -> AppResult<DocumentRecord>;
    fn generate_signed_url(
        &self,
        ctx: &TenantContext,
        document_id: Uuid,
    ) -> AppResult<SignedDocumentUrl>;
    fn list_documents(&self, ctx: &TenantContext) -> AppResult<Vec<DocumentRecord>>;
}

pub struct InMemoryDocumentRepository {
    documents: Arc<RwLock<HashMap<Uuid, DocumentRecord>>>,
    storage_adapter: Arc<dyn StorageAdapter>,
}

impl InMemoryDocumentRepository {
    pub fn new(storage_adapter: Arc<dyn StorageAdapter>) -> Self {
        Self {
            documents: Arc::new(RwLock::new(HashMap::new())),
            storage_adapter,
        }
    }
}

impl DocumentRepository for InMemoryDocumentRepository {
    fn register_document(
        &self,
        ctx: &TenantContext,
        cmd: RegisterDocumentCommand,
    ) -> AppResult<DocumentRecord> {
        ctx.require_permission("documents.view")?;
        let s3_object_key = self.storage_adapter.build_private_object_key(
            ctx.organization_id,
            &cmd.category,
            &cmd.file_name,
        )?;

        let doc = DocumentRecord {
            id: Uuid::new_v4(),
            organization_id: ctx.organization_id,
            category: cmd.category,
            entity_type: cmd.entity_type,
            entity_id: cmd.entity_id,
            file_name: cmd.file_name,
            mime_type: cmd.mime_type,
            file_size_bytes: cmd.file_size_bytes,
            s3_object_key,
            created_at: Utc::now(),
        };

        self.documents
            .write()
            .unwrap_or_else(|e| e.into_inner())
            .insert(doc.id, doc.clone());
        Ok(doc)
    }

    fn generate_signed_url(
        &self,
        ctx: &TenantContext,
        document_id: Uuid,
    ) -> AppResult<SignedDocumentUrl> {
        ctx.require_permission("documents.view")?;
        let doc = self
            .documents
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .get(&document_id)
            .cloned()
            .ok_or_else(|| AppError::NotFound("Document not found".to_string()))?;
        ctx.assert_owns_record(doc.organization_id)?;

        self.storage_adapter.generate_presigned_download_url(
            ctx.organization_id,
            doc.id,
            &doc.s3_object_key,
        )
    }

    fn list_documents(&self, ctx: &TenantContext) -> AppResult<Vec<DocumentRecord>> {
        ctx.require_permission("documents.view")?;
        Ok(self
            .documents
            .read()
            .unwrap_or_else(|e| e.into_inner())
            .values()
            .filter(|d| d.organization_id == ctx.organization_id)
            .cloned()
            .collect())
    }
}
