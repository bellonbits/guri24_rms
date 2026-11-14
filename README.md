# Guri24 RMS — Multi-Tenant Residential Rental Management System (Kenya)

Production-grade, multi-tenant Residential Rental Management SaaS built for the Kenyan market (`KES` currency, `Africa/Nairobi` timezone, Safaricom M-Pesa Daraja STK Push & Paybill/Till C2B reconciliation, double-entry financial accounting, and mobile-first tenant portal).

---

## Host Port Allocation (Isolated from existing `aqivo-*` & `guri24-*` containers)

| Service | Container Name | Host Binding -> Container Port | Notes |
|---|---|---|---|
| **Caddy Gateway** | `guri24_rms_caddy` | `0.0.0.0:8088 -> 80`, `0.0.0.0:8448 -> 443` | Avoids `8080`/`8443` (`aqivo-caddy-1`) |
| **Rust Backend API** | `guri24_rms_backend` | `127.0.0.1:8085 -> 8085` | Avoids `8000` (`aqivo-backend-1`) & `8002` (`guri24-api`) |
| **Web Frontend (SPA)** | `guri24_rms_web` | `127.0.0.1:5175 -> 80` | Vite dev server also defaults to `5175` |
| **PostgreSQL 16** | `guri24_rms_postgres` | `127.0.0.1:5435 -> 5432` | Avoids `5432` & `5433` (`guri24-db`) |
| **Redis 7** | `guri24_rms_redis` | `127.0.0.1:6382 -> 6379` | Avoids `6379` (`aqivo-redis-1`) & `6380` (`guri24-redis`) |
| **MinIO S3 Storage** | `guri24_rms_minio` | `127.0.0.1:9010 -> 9000`, `127.0.0.1:9011 -> 9001` | Avoids `9000-9001` (`guri24-minio`) & `9443` |
| **Prometheus** | `guri24_rms_prometheus` | `127.0.0.1:9095 -> 9090` | Metrics scraper |
| **Grafana** | `guri24_rms_grafana` | `127.0.0.1:3005 -> 3000` | Dashboards |

---

## Repository Structure

```text
guri24_rms/
├── apps/
│   └── web/                        # Vite + React + TypeScript + Modern CSS Layer Architecture
│       ├── index.html
│       ├── public/manifest.webmanifest
│       └── src/
│           ├── components/ui/Primitives.tsx
│           ├── features/domainEngine.ts
│           ├── features/acceptance.test.mjs
│           ├── lib/{api,formatters,polyfills}.ts
│           ├── styles/index.css
│           ├── types/index.ts
│           ├── App.tsx
│           └── main.tsx
├── backend/                        # Rust + Axum + Tokio + SQLx + rust_decimal Modular Monolith
│   ├── Cargo.toml
│   ├── migrations/                 # 6 SQL migrations (35+ normalized tables + immutability triggers)
│   ├── src/
│   │   ├── config/
│   │   ├── core/{errors,security,tenant_context,events,circuit_breaker,middleware,pagination}/
│   │   ├── integrations/{mpesa,sms,email,storage,ai}/
│   │   ├── modules/{organizations,auth,properties,tenants,leases,billing,payments,accounting,deposits,maintenance,documents,notifications,reports}/
│   │   ├── database/
│   │   ├── workers/
│   │   ├── routes/
│   │   ├── lib.rs
│   │   └── main.rs
│   └── tests/acceptance_tests.rs   # 14 critical acceptance scenarios
├── infrastructure/
│   ├── docker/{Dockerfile.backend,Dockerfile.web,Caddyfile}
│   ├── monitoring/prometheus.yml
│   └── deployment/backup-restore.sh
├── docs/
│   ├── architecture/overview.md
│   ├── database/schema.md
│   ├── api/openapi.md
│   ├── security/data-protection-kenya.md
│   └── deployment/production.md
└── docker-compose.yml
```

---

## Quick Start

### 1. Run with Docker Compose
```bash
cp .env.example .env
docker compose up --build -d
```

### 2. Run Acceptance Tests
```bash
# Frontend & Domain Acceptance Suite (Node built-in test runner)
node --test apps/web/src/features/acceptance.test.mjs

# Rust Backend Acceptance Suite (requires Rust toolchain installed)
cd backend && cargo test
```
