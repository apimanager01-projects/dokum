-- editor_documents: persisted LaTeX-editor drafts (PRD #28, slice 7).
-- Drafts live OUTSIDE the Kurs → Unit → Task → Document hierarchy until
-- published (slice 11). No `published` column here — kurse.published stays
-- the only one (architecture invariant).
CREATE TABLE public.editor_documents (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT        NOT NULL,
  content               JSONB       NOT NULL,
  -- Set when slice 11 publishes the draft as a Document; cleared when that
  -- Document is deleted (the draft itself survives).
  published_document_id UUID        REFERENCES public.documents(id) ON DELETE SET NULL,
  -- Nullable + SET NULL: deleting an admin account must not delete or
  -- orphan-block the shared drafts.
  created_by            UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX editor_documents_published_document_id_idx ON public.editor_documents (published_document_id);
CREATE INDEX editor_documents_created_by_idx            ON public.editor_documents (created_by);
-- Backs the draft-list sort (updated_at DESC in the DAL).
CREATE INDEX editor_documents_updated_at_idx            ON public.editor_documents (updated_at DESC);

-- updated_at maintained by trigger (function precedent: handle_new_user in migration.sql)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER editor_documents_set_updated_at
  BEFORE UPDATE ON public.editor_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.editor_documents ENABLE ROW LEVEL SECURITY;

-- Admin-only on all four verbs, role from JWT app_metadata (established
-- pattern). Deliberately NOT filtered by created_by: both admins see and
-- edit all drafts (PRD #28, user story 8).
CREATE POLICY "Admins can view editor documents"
  ON public.editor_documents FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert editor documents"
  ON public.editor_documents FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update editor documents"
  ON public.editor_documents FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete editor documents"
  ON public.editor_documents FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── Extend audit_logs to record editor-draft mutations ──────────────────────
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_entity_type_check;
ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_entity_type_check
  CHECK (entity_type IN ('kurs', 'unit', 'task', 'document', 'entitlement', 'editor_document'));
