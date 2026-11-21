import os
from typing import Tuple

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".tiff", ".tif"}

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
    "image/webp",
}

# Magic bytes headers
MAGIC_SIGNATURES = {
    b"%PDF-": "application/pdf",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"\xff\xd8\xff": "image/jpeg",
    b"II*\x00": "image/tiff",
    b"MM\x00*": "image/tiff",
    b"RIFF": "image/webp",
}


class DocumentValidator:
    """Validates document safety, extensions, MIME types, and magic bytes."""

    @classmethod
    def validate(
        cls,
        file_name: str,
        mime_type: str,
        file_bytes: bytes,
        max_size_bytes: int = 26_214_400,
    ) -> Tuple[bool, str]:
        """
        Validates document integrity and security.
        Returns (is_valid, error_message).
        """
        # 1. Path traversal & filename safety
        if ".." in file_name or "/" in file_name or "\\" in file_name:
            return False, "Invalid filename: Directory traversal or path separators rejected"

        ext = os.path.splitext(file_name)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            return (
                False,
                f"Unsupported file extension '{ext}'. Allowed extensions: PDF, JPG, JPEG, PNG, TIFF",
            )

        # 2. File size validation
        size = len(file_bytes)
        if size == 0:
            return False, "File is empty (0 bytes)"
        if size > max_size_bytes:
            return (
                False,
                f"File size {size} bytes exceeds maximum allowed limit of {max_size_bytes} bytes (25 MB)",
            )

        # 3. MIME type validation
        mime_clean = mime_type.lower().split(";")[0].strip()
        if mime_clean not in ALLOWED_MIME_TYPES:
            return (
                False,
                f"Unsupported MIME type '{mime_clean}'. Allowed: application/pdf, image/jpeg, image/png, image/tiff",
            )

        # 4. Magic bytes inspection
        has_valid_magic = False
        for sig, expected_mime in MAGIC_SIGNATURES.items():
            if file_bytes.startswith(sig):
                has_valid_magic = True
                break

        if not has_valid_magic:
            return (
                False,
                "File header does not match declared MIME signature (magic bytes mismatch)",
            )

        return True, ""
