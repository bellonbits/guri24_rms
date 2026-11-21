import pytest
from storage.validator import DocumentValidator
from storage.supabase_storage import SupabaseStorageManager


def test_validator_rejects_path_traversal():
    valid, msg = DocumentValidator.validate(
        file_name="../../etc/passwd.pdf",
        mime_type="application/pdf",
        file_bytes=b"%PDF-1.4 test",
    )
    assert valid is False
    assert "Directory traversal" in msg


def test_validator_rejects_invalid_extension():
    valid, msg = DocumentValidator.validate(
        file_name="invoice.exe",
        mime_type="application/pdf",
        file_bytes=b"%PDF-1.4 test",
    )
    assert valid is False
    assert "Unsupported file extension" in msg


def test_validator_rejects_magic_bytes_mismatch():
    # File named .pdf but containing plain text or executable bytes
    valid, msg = DocumentValidator.validate(
        file_name="fake.pdf",
        mime_type="application/pdf",
        file_bytes=b"This is just plain text without PDF header",
    )
    assert valid is False
    assert "magic bytes mismatch" in msg


def test_validator_enforces_size_limit():
    valid, msg = DocumentValidator.validate(
        file_name="oversized.pdf",
        mime_type="application/pdf",
        file_bytes=b"%PDF-1.4 " + b"0" * 1000,
        max_size_bytes=500,
    )
    assert valid is False
    assert "exceeds maximum allowed limit" in msg


def test_validator_accepts_valid_documents():
    valid_pdf, _ = DocumentValidator.validate(
        file_name="lease.pdf",
        mime_type="application/pdf",
        file_bytes=b"%PDF-1.7 valid content",
    )
    assert valid_pdf is True

    valid_png, _ = DocumentValidator.validate(
        file_name="id.png",
        mime_type="image/png",
        file_bytes=b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR",
    )
    assert valid_png is True


def test_pii_masking_in_logs():
    raw_log = "Processing National ID 29845120 and KRA PIN A012345678X for phone 0712345678"
    masked = SupabaseStorageManager.mask_pii_for_logging(raw_log)
    assert "29845120" not in masked
    assert "A012345678X" not in masked
    assert "0712345678" not in masked
    assert "****" in masked
