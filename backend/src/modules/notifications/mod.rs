use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::core::errors::{AppError, AppResult};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationMessage {
    pub id: Uuid,
    pub organization_id: Uuid,
    pub channel: String,
    pub destination: String,
    pub subject: Option<String>,
    pub body: String,
    pub created_at: DateTime<Utc>,
}

/// Section 5.9: Builder Pattern - NotificationBuilder
pub struct NotificationBuilder {
    organization_id: Option<Uuid>,
    channel: Option<String>,
    destination: Option<String>,
    subject: Option<String>,
    body: Option<String>,
}

impl Default for NotificationBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl NotificationBuilder {
    pub fn new() -> Self {
        Self {
            organization_id: None,
            channel: None,
            destination: None,
            subject: None,
            body: None,
        }
    }

    pub fn organization_id(mut self, id: Uuid) -> Self {
        self.organization_id = Some(id);
        self
    }

    pub fn channel(mut self, channel: impl Into<String>) -> Self {
        self.channel = Some(channel.into());
        self
    }

    pub fn destination(mut self, destination: impl Into<String>) -> Self {
        self.destination = Some(destination.into());
        self
    }

    pub fn subject(mut self, subject: impl Into<String>) -> Self {
        self.subject = Some(subject.into());
        self
    }

    pub fn body(mut self, body: impl Into<String>) -> Self {
        self.body = Some(body.into());
        self
    }

    pub fn build(self) -> AppResult<NotificationMessage> {
        let organization_id = self
            .organization_id
            .ok_or_else(|| AppError::Validation("organization_id is required".to_string()))?;
        let channel = self
            .channel
            .ok_or_else(|| AppError::Validation("channel is required".to_string()))?;
        let destination = self
            .destination
            .ok_or_else(|| AppError::Validation("destination is required".to_string()))?;
        let body = self
            .body
            .ok_or_else(|| AppError::Validation("body is required".to_string()))?;

        if destination.trim().is_empty() || body.trim().is_empty() {
            return Err(AppError::Validation(
                "Notification destination and body cannot be empty".to_string(),
            ));
        }

        Ok(NotificationMessage {
            id: Uuid::new_v4(),
            organization_id,
            channel,
            destination,
            subject: self.subject,
            body,
            created_at: Utc::now(),
        })
    }
}

/// Section 5.6: Strategy Pattern - NotificationDeliveryStrategy
pub trait NotificationDeliveryStrategy: Send + Sync {
    fn select_channels(&self, sms_enabled: bool, email_enabled: bool) -> Vec<&'static str>;
}

pub struct KenyanSmsFirstDeliveryStrategy;

impl NotificationDeliveryStrategy for KenyanSmsFirstDeliveryStrategy {
    fn select_channels(&self, sms_enabled: bool, email_enabled: bool) -> Vec<&'static str> {
        let mut channels = vec!["IN_APP"];
        if sms_enabled {
            channels.insert(0, "SMS");
        }
        if email_enabled {
            channels.push("EMAIL");
        }
        channels
    }
}
