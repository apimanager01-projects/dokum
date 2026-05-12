-- v5.0: per-Unit entitlements (paid access via Stripe)
-- ──────────────────────────────────────────────────────────────────────────
-- Adds an entitlements table and rewires content-read RLS so that ordinary
-- users can no longer read tasks/documents/document_images/storage objects
-- just because the parent Kurs is published — they now also need a row in
-- public.entitlements for the corresponding unit (or be an admin).
--
-- Units themselves remain visible whenever the parent Kurs is published,
-- so non-purchasers can still browse the catalogue and see what to buy.

-- ── entitlements ──────────────────────────────────────────────────────────
CREATE TABLE public.entitlements (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id            UUID        NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  granted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source             TEXT        NOT NULL CHECK (source IN ('purchase', 'admin')),
  stripe_session_id  TEXT,
  UNIQUE (user_id, unit_id)
);

CREATE INDEX entitlements_user_id_idx ON public.entitlements (user_id);
CREATE INDEX entitlements_unit_id_idx ON public.entitlements (unit_id);
CREATE UNIQUE INDEX entitlements_stripe_session_idx
  ON public.entitlements (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entitlements"
  ON public.entitlements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all entitlements"
  ON public.entitlements FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert entitlements"
  ON public.entitlements FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete entitlements"
  ON public.entitlements FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Webhook / checkout-success handlers insert via service-role key, which
-- bypasses RLS — no user-facing INSERT policy needed for purchases.

-- ── Replace child-content SELECT policies to require entitlement ─────────
DROP POLICY IF EXISTS "View tasks of published kurse" ON public.tasks;
CREATE POLICY "View tasks of entitled units"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.entitlements e
      WHERE e.unit_id = tasks.unit_id
        AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "View documents of published kurse" ON public.documents;
CREATE POLICY "View documents of entitled units"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.tasks t
      JOIN public.entitlements e ON e.unit_id = t.unit_id
      WHERE t.id = documents.task_id
        AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "View document_images of published kurse" ON public.document_images;
CREATE POLICY "View document_images of entitled units"
  ON public.document_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.documents d
      JOIN public.tasks t ON t.id = d.task_id
      JOIN public.entitlements e ON e.unit_id = t.unit_id
      WHERE d.id = document_images.document_id
        AND e.user_id = auth.uid()
    )
  );

-- ── Storage: replace published-based read policy with entitlement-based ──
DROP POLICY IF EXISTS "View PDFs of published kurse" ON storage.objects;
CREATE POLICY "View PDFs of entitled units"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pdfs'
    AND (
      EXISTS (
        SELECT 1
        FROM public.documents d
        JOIN public.tasks t ON t.id = d.task_id
        JOIN public.entitlements e ON e.unit_id = t.unit_id
        WHERE d.file_path = storage.objects.name
          AND e.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM public.document_images di
        JOIN public.documents d ON d.id = di.document_id
        JOIN public.tasks t ON t.id = d.task_id
        JOIN public.entitlements e ON e.unit_id = t.unit_id
        WHERE di.file_path = storage.objects.name
          AND e.user_id = auth.uid()
      )
    )
  );

-- ── Extend audit_logs to record entitlement grants/revokes ───────────────
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_entity_type_check;
ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_entity_type_check
  CHECK (entity_type IN ('kurs', 'unit', 'task', 'document', 'entitlement'));

ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_action_check;
ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_action_check
  CHECK (action IN ('create', 'update', 'delete', 'grant', 'revoke'));
