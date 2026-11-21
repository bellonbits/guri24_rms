import json
from typing import Any, Dict, List, Optional
import httpx
from config import settings
from models import ExtractedField, PageExtraction


class GroqIntelligenceClient:
    """
    Optional contextual extractor using Groq API (e.g. llama-3.3-70b-versatile).
    All extracted values retain source-page references and are marked as unverified (verified=False).
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self.enabled = bool(self.api_key)

    async def refine_extraction(
        self,
        category: str,
        raw_text: str,
        pages: List[PageExtraction],
        existing_fields: List[ExtractedField],
    ) -> List[ExtractedField]:
        """
        Refines and extracts additional structured entities using Groq LLM if configured.
        Falls back safely to existing rule-based fields if unconfigured or on failure.
        """
        if not self.enabled or not raw_text.strip():
            return existing_fields

        prompt = f"""You are a high-precision Kenyan real estate and legal document intelligence engine for Guri24 RMS.
Document Category: {category}
Raw OCR Text:
{raw_text[:4000]}

Extract the key structured entities as JSON:
{{"fields": [{{"field_key": "...", "field_label": "...", "extracted_value": "...", "confidence_pct": 95.0, "is_sensitive_pii": false}}]}}

Rules:
1. Only extract real information present in the text. Never hallucinate.
2. Mark National IDs, KRA PINs, phone numbers, and passport numbers as is_sensitive_pii: true.
3. Respond ONLY with valid JSON.
"""

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.0,
                    },
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    items = parsed.get("fields", [])
                    if items:
                        refined: List[ExtractedField] = []
                        for item in items:
                            val = str(item.get("extracted_value", "")).strip()
                            if not val:
                                continue
                            # Find source page
                            src_page = 1
                            for p in pages:
                                if val.lower() in p.text.lower():
                                    src_page = p.page_number
                                    break

                            refined.append(
                                ExtractedField(
                                    field_key=item.get("field_key", "field").lower().replace(" ", "_"),
                                    field_label=item.get("field_label", "Field"),
                                    extracted_value=val,
                                    confidence_pct=float(item.get("confidence_pct", 90.0)),
                                    source_page=src_page,
                                    is_sensitive_pii=bool(item.get("is_sensitive_pii", False)),
                                    verified=False,
                                )
                            )
                        return refined if refined else existing_fields
        except Exception:
            pass

        return existing_fields


groq_client = GroqIntelligenceClient()
