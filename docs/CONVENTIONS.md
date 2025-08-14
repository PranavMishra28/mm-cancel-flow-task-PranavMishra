# Project Rules and Conventions

## 1. Code Style

- TypeScript strict mode; no `any` in exported types
- Functions ≤ 50 lines; files ≤ 300 lines; refactor early
- Prefer pure functions; inject dependencies; avoid global state
- Use descriptive names; avoid abbreviations

## 2. Directory Layout

```
src/
  app/
    api/
      cancellations/
        start/route.ts
        [id]/route.ts            # PATCH
        [id]/complete/route.ts
      downsells/
        [id]/accept/route.ts
    profile/
      page.tsx
    components/cancel-flow/
      CancelModal.tsx
      steps/
        S0Entry.tsx
        J1Congrats.tsx
        J2Feedback.tsx
        J3Done.tsx
        D1Downsell.tsx
        N1Improve.tsx
        N2MainReason.tsx
        N3Done.tsx
    lib/
      supabase.ts
      validation.ts
      logging.ts
      csrf.ts
```

## 3. State Management

- Local state with a reducer finite-state machine per `docs/FIGMA_HANDOFF.md` IDs (`S0`, `J1`, ...)
- Serialize step payloads to server on Next button click; debounce to avoid dupes
- Persist and reuse `cancellationId` and `variant` from `/start`

## 4. UI

- Tailwind utility classes; match tokens in `docs/FIGMA_HANDOFF.md#7-styling-tokens`
- Accessible components: labeled inputs, `aria-invalid`, `aria-describedby`

## 5. Commits (Conventional Commits)

- `feat: cancel modal shell`
- `feat: api start endpoint with variant assignment`
- `feat: S0 step + PATCH`
- `feat: J1/J2 steps + validation`
- `feat: downsell D1 + accept endpoint`
- `feat: N1/N2/N3 steps + completion endpoint`
- `chore: db schema and RLS upgrades`
- `test: unit/integration/e2e coverage`
- `docs: update README`

## 6. Testing

- Unit tests for validators and reducers
- Integration tests for API routes (success/invalid/unauthorized)
- e2e tests for the full paths (Found Job; Still Looking A; Still Looking B accept; Still Looking B decline)

## 7. Observability

- `src/lib/logging.ts` exports `logInfo`, `logWarn`, `logError` including correlation id
- Include `user_id`, `subscription_id`, `cancellation_id`, and `variant` when available
