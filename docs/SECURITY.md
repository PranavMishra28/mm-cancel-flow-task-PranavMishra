# Security Specification — Migrate Mate Cancellation Flow

This document defines RLS policies, CSRF/XSS protections, input validation, and sensitive data handling for the cancellation flow. It complements `docs/PRD.md` and `docs/DB_SCHEMA.md`.

## 1. Threat Model

- Unauthorized read/write of another user's cancellations or subscriptions
- CSRF on mutating endpoints
- XSS via free-text inputs
- Parameter tampering (changing `cancellation_id`, `subscription_id`)
- Replay or brute-force of start endpoint to skew A/B assignment

## 2. Authentication and Session

- Use Supabase Auth (or mocked in dev) with `auth.uid()` available in Postgres RLS context
- All server handlers assert a valid session; otherwise return 401
- Never trust client-provided `user_id`; derive from session in server code

## 3. Row-Level Security (RLS)

Enabled on `users`, `subscriptions`, and `cancellations`. Baseline policies exist in `seed.sql` and are extended in `docs/DB_SCHEMA.md`.

Policies to add/ensure:

- `subscriptions`
  - SELECT/UPDATE permitted only when `auth.uid() = user_id`
  - On update to set `status = 'pending_cancellation'`, require same check
- `cancellations`
  - INSERT allowed when `auth.uid() = user_id`
  - SELECT allowed when `auth.uid() = user_id`
  - UPDATE allowed when `auth.uid() = user_id`
  - Optional: Prevent UPDATE when `status = 'completed'`

## 4. CSRF Protection

- Use `SameSite=Lax` cookies for session
- Include a CSRF token for each mutating request:
  - Server sets token in an HttpOnly cookie and mirrors a non-HttpOnly value for client to read
  - Client sends token in `X-CSRF-Token` header for POST/PATCH
  - Server verifies equality and rejects if missing/invalid

## 5. Input Validation

- Use zod/yup-like schemas server-side; reject unknown fields and coerce types safely
- Field constraints
  - `reason_key` one of the allowed values
  - `willing_to_pay_cents` integer 0–50000
  - Free text fields trimmed, max lengths per `docs/FIGMA_HANDOFF.md`
  - `downsell_variant` strictly 'A' | 'B'; assigned server-side only at `/start`
  - IDs validated as UUIDs

## 6. XSS and Output Encoding

- Never render untrusted HTML; treat all free text as plain text
- Sanitize server-side with a minimal HTML stripper if needed; primarily store as text
- Escape output in React by default (no `dangerouslySetInnerHTML`)

## 7. Rate Limiting and Abuse Controls

- Apply per-user and per-IP rate limits on mutating routes (suggested: 30/min)
- Debounce client step submissions
- Log blocked attempts with correlation ids

## 8. Secrets Management

- Do not commit secrets; use `.env.local` for dev and platform secrets for prod
- Use service-role key only on the server; never expose to browser

## 9. Logging and Audit

- JSON logs with `correlation_id`, `user_id`, `subscription_id`, `cancellation_id` when present
- Log on `/start`, `/patch`, `/complete`, and downsell accept including variant and decision

## 10. Data Retention

- Cancellation records retained indefinitely unless data retention policy dictates deletion
- Free text fields may include user feedback; treat as customer data

## 11. Testing

- Unit tests for validators
- Integration tests for RLS (positive and negative cases)
- e2e tests for CSRF token presence and rejection of missing/invalid tokens
