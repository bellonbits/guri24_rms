# Guri24 RMS — Multi-Tenant Residential Rental Management System (Kenya)

Production-grade, multi-tenant Residential Rental Management SaaS built for the Kenyan market (`KES` currency, `Africa/Nairobi` timezone, Safaricom M-Pesa Daraja STK Push & Paybill/Till C2B reconciliation, double-entry financial accounting, and mobile-first tenant portal).

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
