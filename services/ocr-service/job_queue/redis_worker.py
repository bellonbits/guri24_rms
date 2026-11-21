import json
import time
from typing import Any, Dict, Optional
import redis
from config import settings
from models import JobStatus


class RedisJobQueue:
    """Manages Redis-backed OCR background jobs, deduplication, and retry backoff."""

    def __init__(self, redis_url: Optional[str] = None):
        self.url = redis_url or settings.REDIS_URL
        self._client: Optional[redis.Redis] = None

    def get_client(self) -> Optional[redis.Redis]:
        if self._client is None:
            try:
                self._client = redis.from_url(
                    self.url,
                    socket_connect_timeout=2.0,
                    decode_responses=True,
                )
                self._client.ping()
            except Exception:
                self._client = None
        return self._client

    def is_connected(self) -> bool:
        c = self.get_client()
        if not c:
            return False
        try:
            return bool(c.ping())
        except Exception:
            return False

    def check_idempotency(self, organization_id: str, sha256_checksum: str) -> Optional[str]:
        """Checks if a document with this hash has already been processed for this org."""
        c = self.get_client()
        if not c:
            return None
        key = f"guri24:idempotency:{organization_id}:{sha256_checksum}"
        try:
            return c.get(key)
        except Exception:
            return None

    def record_idempotency(self, organization_id: str, sha256_checksum: str, job_id: str, ttl: int = 86400):
        """Records document processing hash with 24-hour TTL."""
        c = self.get_client()
        if not c:
            return
        key = f"guri24:idempotency:{organization_id}:{sha256_checksum}"
        try:
            c.setex(key, ttl, job_id)
        except Exception:
            pass

    def enqueue_job(self, job_dict: Dict[str, Any]):
        """Pushes an OCR job to the Redis queue."""
        c = self.get_client()
        if not c:
            return
        queue_key = settings.REDIS_QUEUE_NAME
        try:
            c.rpush(queue_key, json.dumps(job_dict))
        except Exception:
            pass

    def get_queue_depth(self) -> int:
        """Returns the current number of pending OCR jobs in the queue."""
        c = self.get_client()
        if not c:
            return 0
        try:
            return int(c.llen(settings.REDIS_QUEUE_NAME))
        except Exception:
            return 0


job_queue = RedisJobQueue()
