# API Specification — Cancellation Flow

All endpoints are Next.js App Router handlers under `/app/api/...` and return JSON. All require an authenticated session and CSRF token for POST/PATCH.

Base types

```ts
type UUID = string;
type Variant = "A" | "B";
type ReasonKey =
  | "too_expensive"
  | "not_finding_roles"
  | "hired_elsewhere"
  | "product_issues"
  | "temporary_break"
  | "other";
```

## POST /api/cancellations/start

Request

```json
{ "subscriptionId": "<UUID>" }
```

Behavior

- If an in-progress cancellation exists for this `subscriptionId` and user, return it and its variant
- Else create a new cancellation with deterministic 50/50 assignment using crypto RNG, persist variant
- Respond with the user's current plan price in cents

Response 200

```json
{ "cancellationId": "<UUID>", "variant": "A", "planPriceCents": 2500 }
```

Errors

- 400 if subscription not active or not owned by user
- 401 if unauthenticated

## PATCH /api/cancellations/:id

Path params: `id: UUID`

Request (one or more fields)

```json
{
  "found_job": true,
  "found_via_migratemate": false,
  "visa_type": null,
  "freeform_feedback": "string(<=1000)",
  "reason_key": "too_expensive",
  "willing_to_pay_cents": 1900
}
```

Response 200

```json
{ "ok": true }
```

Errors

- 400 invalid payload or state
- 403 not owner (RLS)
- 404 not found

## POST /api/cancellations/:id/complete

Behavior

- Updates cancellation `status = 'completed'`
- Sets `subscriptions.status = 'pending_cancellation'`
- Returns success

Response 200

```json
{ "ok": true }
```

## POST /api/downsells/:id/accept

Behavior

- Sets `accepted_downsell = true` on cancellation
- Does not change subscription status

Response 200

```json
{ "ok": true }
```

## Security

- All mutating endpoints require CSRF header `X-CSRF-Token`
- Server derives `user_id` from session; client never sends it
- Validate all inputs with strict schemas; coerce dollars→cents server-side

## Logging

- Each request logs a JSON object with `correlation_id`, `user_id`, `subscription_id`, `cancellation_id`, `variant` (if applicable), and `action`
