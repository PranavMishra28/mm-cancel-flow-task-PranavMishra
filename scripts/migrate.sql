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

DROP POLICY IF EXISTS "Users can update own cancellations" ON cancellations;
CREATE POLICY "Users can update own cancellations" ON cancellations
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status <> 'completed');
