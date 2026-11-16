# Guri24 RMS — Multi-Service Deployment and Migration Strategy

## 1. Overview & Deployment Topology

Guri24 RMS operates as a coordinated multi-service architecture communicating over an internal secure network while connecting to a single authoritative **Supabase PostgreSQL** instance:

```
[ Internet / Client Traffic ]
               │
               ▼
   [ Nginx / Load Balancer ] (Port 443 / 80)
         │               │
         ▼               ▼
[ Web Frontend (Port 5175) ]  [ Rust Core API & Gateway (Port 8085) ]
                                      │
                   ┌──────────────────┴──────────────────┐
                   │ Internal Service Network (Encrypted)│
                   ▼                                     ▼
[ Spring Financial Service (8086) ]      [ Spring Notification Service (8087) ]
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                        [ Python OCR Service (8000) ]
                                      │
                                      ▼
                   [ Supabase PostgreSQL (Port 5432 / 6543) ]
```

---

## 2. Safe Database Migration & Ownership Reconciliation

### Zero-Downtime Migration Rule:
1. **Never drop or recreate existing domain tables**: Existing production data in `organizations`, `properties`, `tenants`, `leases`, `invoices`, and `payments` must remain fully intact.
2. **Apply migration `0013_service_database_roles_and_grants.sql`**:
   - Creates the dedicated service roles (`guri24_rust_app`, `guri24_spring_app`, `guri24_python_app`) with strong generated passwords.
   - Enforces table-level permissions: write permissions to authoritative owners, read-only permissions for projections.
   - Attaches the immutability trigger `trg_protect_journal_immutability` to `journal_entries` to prevent deletions.
3. **Phased Rollout**:
   - **Phase 1 (Dual-read / Single-write)**: Rust continues reading existing records; Spring Boot takes ownership of all financial mutations via `/api/v1/finance/*`.
   - **Phase 2 (Event-driven decoupling)**: Transactional outbox workers publish domain events asynchronously between services.

---

## 3. Environment Configuration & Secret Management

Each service connects to PostgreSQL using its own dedicated role credentials:

```bash
# --- Rust Core API (.env) ---
DATABASE_URL=postgres://guri24_rust_app:${RUST_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
INTERNAL_SERVICE_AUTH_SECRET=guri24_internal_mesh_sec_32char_key
SPRING_FINANCIAL_SERVICE_URL=http://financial-service:8086
PYTHON_OCR_SERVICE_URL=http://ocr-service:8000

# --- Spring Boot Financial Service (application.yml) ---
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=guri24_spring_app
SPRING_DATASOURCE_PASSWORD=${SPRING_DB_PASSWORD}
INTERNAL_SERVICE_AUTH_SECRET=guri24_internal_mesh_sec_32char_key

# --- Python OCR Service (environment) ---
DATABASE_URL=postgresql://guri24_python_app:${PYTHON_DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
INTERNAL_SERVICE_AUTH_SECRET=guri24_internal_mesh_sec_32char_key
```

---

## 4. Connection Pooling and Sizing

To prevent PostgreSQL connection exhaustion across multiple runtimes, connection pool limits must be strictly tuned:

| Service | Pool Technology | Max Pool Size | Min Idle | Connection Timeout |
|---|---|---|---|---|
| **Rust Core API** | SQLx Pool (`deadpool`) | `15` | `3` | `5,000 ms` |
| **Spring Financial Service** | HikariCP | `10` | `2` | `5,000 ms` |
| **Spring Notification Service** | HikariCP | `5` | `1` | `5,000 ms` |
| **Python OCR Service** | AsyncPG / SQLAlchemy | `3` | `1` | `5,000 ms` |
| **Total Connections** | — | **`33`** | — | Fits safely within 60-connection Supabase pooler limit |

---

## 5. Health Probes, Circuit Breakers & Rollback Plan

1. **Liveness & Readiness Probes**:
   - Rust: `GET /health`
   - Spring Boot: `GET /actuator/health` or `GET /api/v1/health`
   - Python: `GET /health`
2. **Circuit Breakers**:
   - If the Spring Boot Financial Service becomes unreachable, the Rust gateway's circuit breaker opens, returning `503 Service Unavailable` with a structured error payload. Mutation requests are not dropped into unbacked in-memory state.
3. **Rollback Procedure**:
   - If a deployed service fails health checks within 60 seconds of deployment, the orchestrator rolls traffic back to the previous stable release.
   - Database migrations are purely additive (adding grants, triggers, and outbox tables) and do not require destructive rollback.
