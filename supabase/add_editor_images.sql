-- editor_images: uploaded images of LaTeX-editor drafts (PRD #28, slice 8).
-- Mirrors the DocumentImage pattern (document_images): one row per stored
-- image, path inside the private 'pdfs' bucket. Rows cascade with their
-- draft; the storage OBJECTS are removed by the server actions
-- (uploadEditorImage rollback, updateEditorDraft reconciliation,
-- deleteEditorDraft) — SQL cannot delete bucket objects.
CREATE TABLE public.editor_images (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  editor_document_id UUID        NOT NULL REFERENCES public.editor_documents(id) ON DELETE CASCADE,
  file_path          TEXT        NOT NULL, -- storage path inside the 'pdfs' bucket
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX editor_images_editor_document_id_idx ON public.editor_images (editor_document_id);

ALTER TABLE public.editor_images ENABLE ROW LEVEL SECURITY;

-- Admin-only on SELECT/INSERT/DELETE, role from JWT app_metadata (established
-- pattern). No UPDATE policy: rows are immutable — replacing an image means a
-- new upload plus save-time reconciliation of the old row.
CREATE POLICY "Admins can view editor images"
  ON public.editor_images FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert editor images"
  ON public.editor_images FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete editor images"
  ON public.editor_images FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Deliberately NO storage.objects changes: the bucket-wide admin policies on
-- 'pdfs' ("Admins can upload/view/delete PDFs") already cover editor images
-- under editor-images/<draftId>/…, and the entitlement-based SELECT policy
-- can never match those paths (they are never referenced by documents or
-- document_images), so non-admins cannot read them.

-- ── Extend audit_logs to record editor-image uploads ─────────────────────────
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_entity_type_check;
ALTER TABLE public.audit_logs
  ADD CONSTRAINT audit_logs_entity_type_check
  CHECK (entity_type IN ('kurs', 'unit', 'task', 'document', 'entitlement', 'editor_document', 'editor_image'));
