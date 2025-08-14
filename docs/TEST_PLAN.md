# Test Plan — Cancellation Flow

Target ≥ 80% branch coverage on critical paths.

## 1. Unit Tests

- Variant assignment: 50/50 distribution over large N; deterministic reuse on existing record
- Validators
  - S0: requires branch
  - J1: requires yes/no
  - J2: visa required when via-us; length limits
  - N2: radio required; willing_to_pay bounds; other text length
- Dollars→cents conversion util

## 2. Integration Tests (API)

- `/api/cancellations/start`
  - 200 new record, variant in {'A','B'}, planPriceCents matches subscription
  - 400 for non-active subscription or foreign subscription
  - Re-entry returns same cancellation and variant
- `/api/cancellations/:id` PATCH
  - 200 for owner; 403 for non-owner (RLS)
  - 400 invalid payloads
- `/api/cancellations/:id/complete`
  - Sets cancellation `status='completed'` and subscription `status='pending_cancellation'`
- `/api/downsells/:id/accept`
  - Sets `accepted_downsell=true` only; does not touch subscription status

## 3. E2E Scenarios

1. Found Job path (J1→J2→J3)
2. Still Looking Variant A: S0→N1→N2→N3
3. Still Looking Variant B decline: S0→D1→N1→N2→N3
4. Still Looking Variant B accept: S0→D1 accept → exit modal

Assertions

- Step counter text correctness per variant and step
- Buttons disabled until valid
- Error messages show and hide correctly
- Persistence calls issued with correct payload

## 4. Security Tests

- CSRF: requests missing token are rejected (403)
- XSS: free text is escaped when displayed
- RLS: users cannot access others' cancellations/subscriptions

## 5. Performance

- Modal open renders < 100ms on modern hardware; API p95 < 200ms locally
