# Database Schema and Migration Notes

This document defines the precise schema for the cancellation flow and how to migrate a local Supabase instance.

## 1. Tables

Existing (from `seed.sql`): `users`, `subscriptions`, `cancellations`

Required extensions/changes:

```sql
-- Ensure gen_random_uuid extension is available (Supabase default)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- subscriptions: add trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_set_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_set_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- cancellations: extend minimal structure
ALTER TABLE cancellations
  ADD COLUMN IF NOT EXISTS found_job BOOLEAN,
  ADD COLUMN IF NOT EXISTS found_via_migratemate BOOLEAN,
  ADD COLUMN IF NOT EXISTS visa_type TEXT,
  ADD COLUMN IF NOT EXISTS freeform_feedback TEXT,
  ADD COLUMN IF NOT EXISTS reason_key TEXT,
  ADD COLUMN IF NOT EXISTS willing_to_pay_cents INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_cancellations_user ON cancellations(user_id);
CREATE INDEX IF NOT EXISTS idx_cancellations_subscription ON cancellations(subscription_id);
CREATE INDEX IF NOT EXISTS idx_cancellations_status ON cancellations(status);

-- Optional: prevent edits after completion at DB-level via RLS (see below)
```

## 2. RLS Policies

Enabled tables: `users`, `subscriptions`, `cancellations`.

Policies to add:

```sql
-- subscriptions: already has select/update ownership checks in seed.sql

-- cancellations: allow owner to update; block updates after completion
DROP POLICY IF EXISTS "Users can update own cancellations" ON cancellations;
CREATE POLICY "Users can update own cancellations" ON cancellations
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status <> 'completed');

-- Optionally allow owner to delete in-progress only (not required by flow)
-- CREATE POLICY "Users can delete own in-progress cancellations" ON cancellations
--   FOR DELETE USING (auth.uid() = user_id AND status = 'in_progress');
```

## 3. Seed Notes

- `subscriptions.monthly_price` is stored in cents (2500, 2900)
- Downsell math derives discounted price client-side for rendering only

## 4. Migration Scripts

Create `scripts/migrate.sql` including the DDL above. Run locally with:

```bash
npm run db:setup
psql -h localhost -p 54322 -U postgres -d postgres -f scripts/migrate.sql
```

## 5. Data Mapping

See `docs/FIGMA_HANDOFF.md#9-data-mapping-summary` for field-to-UI mapping. Server must coerce dollars→cents when persisting `willing_to_pay_cents`.
