#!/usr/bin/env bash
set -euo pipefail

# Guri24 RMS - PostgreSQL Automated Backup & Verification Script
# Complies with financial record retention and Kenya Data Protection Act 2019

ACTION="${1:-backup}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/guri24_rms}"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
DB_URL="${DATABASE_URL:-postgres://rms_user:rms_password_dev_only@localhost:5432/guri24_rms}"

mkdir -p "$BACKUP_DIR"

case "$ACTION" in
  backup)
    OUT_FILE="${BACKUP_DIR}/guri24_rms_${TIMESTAMP}.dump"
    echo "[INFO] Creating custom-format PostgreSQL backup: ${OUT_FILE}"
    pg_dump --format=custom --no-owner --no-privileges "$DB_URL" --file="$OUT_FILE"
    shasum -a 256 "$OUT_FILE" > "${OUT_FILE}.sha256"
    echo "[INFO] Verifying archive table of contents..."
    pg_restore --list "$OUT_FILE" > /dev/null
    echo "[OK] Backup verified successfully: ${OUT_FILE}"
    ;;
  verify)
    LATEST_FILE="$(ls -t "${BACKUP_DIR}"/*.dump | head -n 1)"
    echo "[INFO] Verifying checksum and TOC for ${LATEST_FILE}"
    shasum -a 256 -c "${LATEST_FILE}.sha256"
    pg_restore --list "$LATEST_FILE" > /dev/null
    echo "[OK] Archive integrity confirmed."
    ;;
  *)
    echo "Usage: $0 {backup|verify}"
    exit 1
    ;;
esac
