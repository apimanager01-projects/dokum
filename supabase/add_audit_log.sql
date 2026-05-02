-- Audit log for admin destructive and mutating actions
CREATE TABLE public.audit_logs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action        TEXT        NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  entity_type   TEXT        NOT NULL CHECK (entity_type IN ('kurs', 'unit', 'task', 'document')),
  entity_id     UUID        NOT NULL,
  entity_title  TEXT,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_id_idx  ON public.audit_logs (actor_id);
CREATE INDEX audit_logs_entity_id_idx ON public.audit_logs (entity_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admins can insert audit logs (server-side only)
CREATE POLICY "Admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Nobody can update or delete audit logs (immutable record)
