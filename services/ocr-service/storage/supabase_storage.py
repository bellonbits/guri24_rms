import hashlib
import os
import re
import tempfile
from typing import Optional, Tuple
import httpx
from config import settings


class SupabaseStorageManager:
    """Manages private Supabase storage interactions and secure temp file cleanup."""

    @staticmethod
    def compute_sha256(content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    @staticmethod
    def mask_pii_for_logging(text: str) -> str:
        """Masks national IDs, KRA PINs, phone numbers, and secrets from application logs."""
        # Mask 7-8 digit national IDs
        masked = re.sub(r"\b([0-9]{2})[0-9]{3,4}([0-9]{2})\b", r"\1****\2", text)
        # Mask KRA PIN (1 letter, 8-10 digits, 1 letter)
        masked = re.sub(r"\b([A-Z])\d{8,10}([A-Z])\b", r"\1*******\2", masked)
        # Mask Kenyan phone numbers
        masked = re.sub(r"(\+?254|0)7\d{2}(\d{4})\d{2}", r"\1 7** **** \2", masked)
        return masked

    @classmethod
    async def fetch_document_bytes(
        cls,
        signed_url: str,
        expected_organization_id: str,
        timeout: float = 30.0,
    ) -> Tuple[bytes, str]:
        """
        Fetches document bytes from a signed Supabase URL.
        Returns (content_bytes, sha256_checksum).
        """
        async with httpx.AsyncClient(timeout=timeout) as client:
            res = await client.get(signed_url)
            if res.status_code != 200:
                raise ValueError(
                    f"Failed to fetch document from storage: HTTP {res.status_code} {res.reason_phrase}"
                )
            content = res.content
            checksum = cls.compute_sha256(content)
            return content, checksum

    @classmethod
    def with_secure_tempfile(cls, suffix: str, content: bytes):
        """Context manager yielding path to a temporary file that is guaranteed to be deleted on exit."""
        class TempFileContext:
            def __enter__(self):
                self.f = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
                self.f.write(content)
                self.f.flush()
                self.path = self.f.name
                self.f.close()
                return self.path

            def __exit__(self, exc_type, exc_val, exc_tb):
                if os.path.exists(self.path):
                    try:
                        os.remove(self.path)
                    except Exception:
                        pass

        return TempFileContext()
