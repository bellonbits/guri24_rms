use std::{
    io::Write,
    process::{Command, Stdio},
};
use serde::{Deserialize, Serialize};

use crate::core::{
    circuit_breaker::CircuitBreaker,
    errors::AppResult,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GroqChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Debug, Serialize)]
struct GroqChatCompletionRequest<'a> {
    model: &'a str,
    messages: Vec<GroqChatMessage>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Debug, Deserialize)]
struct GroqChoiceMessage {
    content: Option<String>,
}

#[derive(Debug, Deserialize)]
struct GroqChoice {
    message: GroqChoiceMessage,
}

#[derive(Debug, Deserialize)]
struct GroqChatCompletionResponse {
    choices: Option<Vec<GroqChoice>>,
}

/// Section 13: Groq API Provider Adapter
/// Connects to https://api.groq.com/openai/v1/chat/completions using GROQ_API_KEY and GROQ_MODEL.
pub struct GroqLlmAdapter {
    pub base_url: String,
    pub model: String,
    pub api_key: Option<String>,
    pub breaker: CircuitBreaker,
}

impl GroqLlmAdapter {
    pub fn new(
        base_url: String,
        model: String,
        api_key: Option<String>,
        breaker: CircuitBreaker,
    ) -> Self {
        Self {
            base_url,
            model,
            api_key,
            breaker,
        }
    }

    pub fn is_configured(&self) -> bool {
        self.api_key.is_some()
    }

    pub fn complete_grounded_response(
        &self,
        user_prompt: &str,
        live_tool_context: &str,
    ) -> AppResult<Option<String>> {
        let Some(api_key) = &self.api_key else {
            return Ok(None);
        };

        self.breaker.call(|| {
            let endpoint = format!(
                "{}/chat/completions",
                self.base_url.trim_end_matches('/')
            );

            let system_prompt = format!(
                "You are the Guri24 Residential Rental Management System (RMS) AI Assistant for Kenya (Currency: KES, Timezone: Africa/Nairobi). \
                 Answer strictly using the live authorized RMS database tool records below. \
                 Never invent properties, units, tenants, leases, invoices, or payments. \
                 If no matching records exist, state clearly that the database contains 0 matching records.\n\n\
                 CRITICAL FORMATTING INSTRUCTION: Do NOT use markdown syntax. Do not output markdown headers (no '#', '##', '###'), do not output asterisks for bold or italic (no '**' or '*'), and do not use raw markdown bullet dashes (no '- '). Provide responses in clean, natural plain text paragraphs with clear line spacing.\n\n\
                 LIVE AUTHORIZED RMS TOOL RECORDS:\n{live_tool_context}"
            );

            let payload = GroqChatCompletionRequest {
                model: &self.model,
                messages: vec![
                    GroqChatMessage {
                        role: "system".to_string(),
                        content: system_prompt,
                    },
                    GroqChatMessage {
                        role: "user".to_string(),
                        content: user_prompt.to_string(),
                    },
                ],
                temperature: 0.1,
                max_tokens: 700,
            };

            let body = serde_json::to_string(&payload)
                .map_err(|e| format!("Groq JSON serialize error: {e}"))?;

            let mut child = Command::new("curl")
                .arg("-sS")
                .arg("--max-time")
                .arg("20")
                .arg("-X")
                .arg("POST")
                .arg(&endpoint)
                .arg("-H")
                .arg("Content-Type: application/json")
                .arg("-H")
                .arg(format!("Authorization: Bearer {api_key}"))
                .arg("-d")
                .arg("@-")
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Groq HTTP spawn error: {e}"))?;

            if let Some(mut stdin) = child.stdin.take() {
                let _ = stdin.write_all(body.as_bytes());
            }

            let out = child
                .wait_with_output()
                .map_err(|e| format!("Groq HTTP wait error: {e}"))?;

            if !out.status.success() {
                return Ok(None);
            }

            if let Ok(parsed) =
                serde_json::from_slice::<GroqChatCompletionResponse>(&out.stdout)
            {
                if let Some(choice) = parsed.choices.and_then(|mut c| c.pop()) {
                    if let Some(text) = choice.message.content {
                        let trimmed = text.trim();
                        if !trimmed.is_empty() {
                            let clean_text = Self::sanitize_plain_text(trimmed);
                            return Ok(Some(clean_text));
                        }
                    }
                }
            }
            Ok(None)
        })
    }

    pub fn sanitize_plain_text(input: &str) -> String {
        let mut lines = Vec::new();
        for raw_line in input.lines() {
            let trimmed = raw_line.trim();
            if trimmed.is_empty() {
                lines.push(String::new());
                continue;
            }
            // Strip header markers (#, ##, ###, ####, etc.)
            let no_header = trimmed.trim_start_matches('#').trim();
            // Replace raw markdown bullets with clean readable bullets
            let bulleted = if no_header.starts_with("- ") || no_header.starts_with("* ") || no_header.starts_with("+ ") {
                format!("• {}", &no_header[2..])
            } else {
                no_header.to_string()
            };
            // Remove bold, italics, backticks, strikethrough
            let cleaned = bulleted
                .replace("***", "")
                .replace("**", "")
                .replace("__", "")
                .replace('*', "")
                .replace('`', "")
                .replace("~~", "");
            lines.push(cleaned);
        }
        lines.join("\n").trim().to_string()
    }
}
