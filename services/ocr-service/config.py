from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Server
    OCR_HOST: str = "0.0.0.0"
    OCR_PORT: int = 8000
    OCR_LOG_LEVEL: str = "INFO"
    OCR_SERVICE_API_KEY: str = ""

    # Tesseract OCR engine
    TESSERACT_CMD: str = "/usr/bin/tesseract"
    DEFAULT_LANGUAGE: str = "eng"
    OCR_TIMEOUT_SECONDS: int = 60
    MAX_DOCUMENT_SIZE_BYTES: int = 26_214_400  # 25 MB
    MAX_PAGE_COUNT: int = 50

    # Redis Queue
    REDIS_URL: str = "redis://127.0.0.1:6379/0"
    REDIS_QUEUE_NAME: str = "guri24_ocr_jobs"
    MAX_RETRIES: int = 3
    RETRY_BACKOFF_BASE_SECONDS: float = 2.0

    # Supabase Private Storage
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_STORAGE_BUCKET: str = "guri24-documents"
    SIGNED_URL_EXPIRY_SECONDS: int = 1800

    # Groq Contextual Intelligence (optional secondary extractor)
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Financial & Accounting Guardrails
    AUTHORITATIVE_ACCOUNTING_MUTATION_ALLOWED: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
