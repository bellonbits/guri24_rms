# Guri24 RMS — Production Deployment, Observability & Backup Runbook

## 1. Infrastructure Stack (`docker-compose.yml`)
- **`caddy`**: Production TLS reverse proxy (`infrastructure/docker/Caddyfile`) serving the Vite SPA and proxying `/api/v1/*` and `/health` to the Rust backend.
- **`backend`**: Multi-stage Debian slim container (`infrastructure/docker/Dockerfile.backend`) running `guri24-rms-backend`.
- **`postgres`**: PostgreSQL 16 (`Africa/Nairobi` timezone, `NUMERIC(14,2)` financial ledger).
- **`redis`**: Redis 7 for rate limiting and distributed locks.
- **`minio`**: S3-compatible private object storage for tenant documents and receipts.
- **`prometheus` & `grafana`**: Metrics collection (`infrastructure/monitoring/prometheus.yml`) and dashboards.

## 2. Database Backup & Verification (`infrastructure/deployment/backup-restore.sh`)
```bash
# Create compressed custom-format dump + SHA-256 checksum
./infrastructure/deployment/backup-restore.sh backup

# Verify archive table-of-contents integrity
./infrastructure/deployment/backup-restore.sh verify ./backups/guri24_rms_20261114.dump

# Restore into target database
./infrastructure/deployment/backup-restore.sh restore ./backups/guri24_rms_20261114.dump
```
