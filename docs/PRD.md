# Product Requirements Document (PRD) — Migrate Mate Cancellation Flow

## 1. Purpose and Goals

- Build a secure, deterministic, and pixel-accurate subscription cancellation experience that matches the Figma flow across mobile and desktop.
- Persist user decisions and feedback for business analysis and retention experiments (A/B downsell).
- Enforce strong security (RLS, input validation, CSRF/XSS protections) and ship with reproducible local setup and tests.

## 2. Scope

- In-scope
  - End-to-end cancellation flow UI inside a modal launched from the Profile page
  - Deterministic 50/50 downsell experiment with persistence
  - API routes, server logic, data model extensions, and Supabase RLS policies
  - Validation, empty/error states, loading states, and accessibility
  - Unit, integration, and e2e tests; reproducible DB setup
- Out of scope
  - Real payment processing (stub only)
  - Real authentication flows (use Supabase auth session or mocked user in dev)
  - Emails and full analytics (basic structured logs allowed)

## 3. Users and Assumptions

- Users: Logged-in subscribers with an active subscription at $25 or $29/month
- Assumptions
  - A single active subscription per user
  - If a cancellation record exists for a subscription and is not completed, it is resumed rather than duplicated
  - Downsell acceptance exits the modal and does not make billing changes (stub only)

## 4. Experience Requirements

- Full handoff spec is in `docs/FIGMA_HANDOFF.md`. This PRD summarizes and references it as source of truth.
- Modal behavior
  - Focus trap, close on ESC only before completion or after downsell acceptance
  - Step counter: “Step X of Y”, where Y depends on variant (A=4 steps on "still looking" path, B=5)
  - Primary and secondary actions per step per `docs/FIGMA_HANDOFF.md`
- Breakpoints
  - Mobile 375–430 px: full height modal with internal scroll
  - Desktop 1024–1280 px: centered container max-w 600–720 px
- Accessibility: Labels, `aria-describedby` for errors, keyboard navigation
- Copy: Use content keys from `docs/FIGMA_HANDOFF.md#8-content-keys`

## 5. Flow and Branching (high-level)

- S0 Entry → choose `found_job` vs `still_looking`
  - If `found_job` → J1 → J2 → J3 (complete)
  - If `still_looking` → Variant B shows D1 downsell; Accept → exit to Profile; Decline → N1 → N2 → N3 (complete). Variant A skips D1 and starts at N1.
- Variant assignment is deterministic 50/50 on first entry and persisted; reused across sessions.
- Detailed screens, validation, and persistence fields are defined in `docs/FIGMA_HANDOFF.md`.

## 6. Data Model

- `users`, `subscriptions` provided in `seed.sql`
- Extend `cancellations` with:
  - `found_job boolean` (S0)
  - `found_via_migratemate boolean null` (J1)
  - `visa_type text null` (J2, only when `found_via_migratemate=true`)
  - `freeform_feedback text null` (J2 and N1; store last non-empty)
  - `reason_key text null` (N2 values; see enumerations)
  - `willing_to_pay_cents integer null` (0–50000, server converts dollars → cents)
  - `downsell_variant text not null check in ('A','B')` (already present)
  - `accepted_downsell boolean not null default false`
  - `status text not null default 'in_progress' check in ('in_progress','completed')`
  - Timestamps: `created_at timestamptz default now(), updated_at timestamptz default now()`

Enumerations

- `reason_key ∈ { 'too_expensive','not_finding_roles','hired_elsewhere','product_issues','temporary_break','other' }`
- `visa_type` unrestricted text with optional shortlist client-side; consider enum in future.

Indexes

- `(user_id)`, `(subscription_id)`, `(status)`

See `docs/DB_SCHEMA.md` for precise DDL and RLS.

## 7. API Requirements

All API routes are internal Next.js App Router endpoints and must enforce session context. Full spec in `docs/API_SPEC.md`.

- POST `/api/cancellations/start` → returns `{ cancellationId, variant, planPriceCents }`
- PATCH `/api/cancellations/:id` → upserts step fields (see mapping)
- POST `/api/cancellations/:id/complete` → marks cancellation complete and sets `subscriptions.status = 'pending_cancellation'`
- POST `/api/downsells/:id/accept` → `{ accepted_downsell: true }` and exit modal
- All inputs validated on server with schemas; CSRF protection enabled; RLS enforced by Supabase when using row-scoped operations.

## 8. Validation and Error Handling

- Validation (see `docs/FIGMA_HANDOFF.md#3-validation-matrix`)
  - Required radios: S0, J1, N2
  - Conditional required: J2 `visa_type` when applicable; N2 `willing_to_pay_cents` when `too_expensive`
  - Free text limits: 1000 chars; "other" short inputs 80–200 chars
  - Numbers: willing-to-pay dollars 0–500 integer; server stores cents 0–50000
- Errors: Inline beneath fields, descriptive and tied via `aria-describedby`
- Network errors: toast non-blocking; retain inputs

## 9. Security and Privacy (summary)

- Use RLS policies scoped to `auth.uid()`; only owners can select/insert/update their cancellations and subscriptions; completion updates subscription with same user check
- CSRF: same-site cookies and per-request CSRF token for mutating endpoints
- XSS: never render untrusted HTML; escape output; strip dangerous tags server-side
- Input validation: strict schemas; reject unknown keys; rate-limit mutating endpoints
- PII: store only necessary fields; no raw payment data
- Full details in `docs/SECURITY.md`.

## 10. Instrumentation and Logging

- Structured JSON logs at info/warn/error levels
- Include correlation id per request; include `user_id`, `subscription_id`, `cancellation_id` where available
- Emit counters for downsell show/accept, completion, and reasons distribution

## 11. Acceptance Criteria

- Pixel-perfect across breakpoints; all screens and transitions implemented
- Deterministic A/B with persistence and re-use
- RLS policies verified by tests; unauthorized access denied
- All validation and error states implemented; step counter accurate per variant
- `npm run dev` works; `npm run db:setup` provisions and seeds; tests pass locally

## 12. Dependencies and Risks

- Supabase local stack must run; service role used only on server
- If a user has no active subscription, entry returns 400 and UI shows helpful message
- If downsell accepted, do not complete cancellation nor mutate billing

## 13. Rollout Plan

- Feature flag `CANCEL_FLOW_ENABLED` can gate modal entry in production
- Ship behind flag; validate metrics; expand rollout when stable
