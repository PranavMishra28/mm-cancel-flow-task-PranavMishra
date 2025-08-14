# Developer Guide — Local Setup & Workflow

## 1) Prereqs

- Node 18+
- Docker (for Supabase local)
- `psql` client (installed with Supabase CLI or Postgres)

## 2) Install & Run

```bash
npm install
npm run db:setup           # starts Supabase and seeds base schema
# Optional: apply extended schema changes
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/migrate.sql

npm run dev
```

Environment variables (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...local-anon
SUPABASE_SERVICE_ROLE_KEY=ey...local-service-role
CANCEL_FLOW_ENABLED=true
```

## 3) Implementation Order

1. DB: create `scripts/migrate.sql` from `docs/DB_SCHEMA.md`
2. Lib: `src/lib/validation.ts`, `src/lib/csrf.ts`, `src/lib/logging.ts`
3. API: `/api/cancellations/start`, PATCH `/api/cancellations/[id]`, `/complete`, downsell `/accept`
4. UI: `CancelModal` shell and S0 step → wire to `/start`
5. Steps J1/J2/J3, N1/N2/N3, and D1 with validations and PATCH calls
6. Observability + tests per `docs/TEST_PLAN.md`
7. README rewrite (≤600 words) and final cleanup

## 4) Conventions

Follow `docs/CONVENTIONS.md`. Logs must include correlation id; commit messages follow Conventional Commits.
