-- add_editor_target_task: an editor draft remembers its export target (#106).
--
-- Apply order: migration.sql → add_audit_log.sql → add_entitlements.sql →
-- add_editor_documents.sql → add_editor_images.sql → add_document_content.sql →
-- add_rls_published_conjunct.sql → THIS FILE.
--
-- The ExportBar's Kurs → Unit → Mini Case selection was ephemeral per session:
-- every remount reset it to the first entry of the tree — including the remount
-- the FIRST „Speichern" causes (it navigates to `?draftId=…`, decision D6) —
-- while the publish button silently kept pointing at Kurs 1 → Unit 1 → Mini
-- Case 1. This column is where the chosen Task now survives.
--
-- ⚠ WHY A COLUMN AND NOT `meta` IN THE DOCUMENT JSON. `MetaSchema` is a
-- `z.strictObject`, so a new optional meta field earns a document-schema
-- version bump under the #71 precedent — which would make the student renderer
-- carry a v1.2 upgrade rung forever for a field it never reads, and would ship
-- an authoring-time Task id inside every published snapshot. The document JSON
-- stays v1.1, untouched. `editor_documents.published_document_id` is the
-- precedent followed here: publish-target state is a column on the draft row.
--
-- ⚠ APPLY THIS BEFORE DEPLOYING THE CODE THAT SHIPS WITH IT. The migration is
-- backwards-compatible with the OLD code (a column nothing reads), but the new
-- code writes `target_task_id` on every draft save, and PostgREST rejects the
-- whole write when the column does not exist — every „Speichern" in the editor
-- would fail. Order is: migrate dev → verify → deploy, and the same for prod.

-- ─────────────────────────────────────────────
-- 1. The remembered export target
-- ─────────────────────────────────────────────

-- NULL for every existing row, and NULL is a first-class value: a draft that
-- never had a target and a draft whose target was deleted seed the ExportBar
-- identically (the first tree entry, silently — #106 decision; the accepted
-- cost is that the two are indistinguishable).
--
-- ON DELETE SET NULL is what buys that: deleting the Task must neither delete
-- the draft nor block the delete. It mirrors `published_document_id`, whose
-- Document may also vanish under the draft.
--
-- Only the Task is stored. Its Kurs and Unit are derived from where it sits in
-- the tree — a second stored id could contradict the first after a move.
ALTER TABLE public.editor_documents
  ADD COLUMN IF NOT EXISTS target_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL;

-- Not for a query — nothing looks a draft up by its target. This backs the FK
-- maintenance: without it, deleting ONE Task sequentially scans every draft row
-- to apply the SET NULL. Same reasoning as editor_documents_published_document_id_idx.
CREATE INDEX IF NOT EXISTS editor_documents_target_task_id_idx
  ON public.editor_documents (target_task_id);

-- ─────────────────────────────────────────────
-- 2. No RLS work is needed and none is added
-- ─────────────────────────────────────────────

-- `editor_documents` is admin-only on all four verbs and its policies are
-- column-blind (`(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`), so the
-- new column inherits the existing gate with zero new policies. The referenced
-- `tasks` row is checked by the FK, which runs with the table owner's rights
-- and is not subject to RLS — an admin can target a Task under an unpublished
-- Kurs, which is exactly the archive-then-republish workflow.
--
-- VERIFYING IT (read-only, safe against prod):
--   SELECT column_name, data_type, is_nullable
--     FROM information_schema.columns
--    WHERE table_schema = 'public' AND table_name = 'editor_documents'
--      AND column_name = 'target_task_id';
--   SELECT conname, pg_get_constraintdef(oid)
--     FROM pg_constraint
--    WHERE conrelid = 'public.editor_documents'::regclass AND contype = 'f';
--
-- The behavioural proof (target set → Task deleted → column NULL, draft alive)
-- is supabase/checks/editor_target_task_check.sql. Run it against dev.
