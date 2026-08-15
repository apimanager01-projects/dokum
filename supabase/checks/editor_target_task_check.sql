-- editor_target_task_check: does a draft's remembered export target actually
-- survive, and does it actually go NULL when the Task disappears? (#106)
--
-- ─────────────────────────────────────────────────────────────────────────
-- WHY THIS FILE EXISTS
-- ─────────────────────────────────────────────────────────────────────────
-- The silent fallback the ticket asks for is bought entirely with
-- `ON DELETE SET NULL`: a NULL column seeds the ExportBar exactly like a draft
-- that never had a target. That is a database guarantee — `npm test` covers
-- pure modules and no test seam in this repo reaches Postgres — so it is
-- proved here, against a real database, instead of by hand-deleting real
-- content in the admin UI.
--
-- ─────────────────────────────────────────────────────────────────────────
-- HOW TO RUN
-- ─────────────────────────────────────────────────────────────────────────
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/checks/editor_target_task_check.sql
-- or paste it into the Supabase SQL editor.
--
-- PASS  → the final SELECT returns one row reading "PASSED".
-- FAIL  → the run aborts with `EDITOR TARGET CHECK FAILED — <scenario>: …`.
--
-- Everything happens inside a transaction that ends in ROLLBACK, so the
-- fixture never survives the run. Safe against dev. For prod, prefer the
-- read-only catalog query in the "VERIFYING IT" header of
-- supabase/add_editor_target_task.sql.
--
-- ─────────────────────────────────────────────────────────────────────────
-- WHAT IT ASSERTS
-- ─────────────────────────────────────────────────────────────────────────
--   1  A stored target round-trips                        (the feature)
--   2  An unknown Task id is refused by the FK            (the column is a real reference)
--   3  Deleting the Task nulls the column, draft survives (the silent fallback)
--   4  An admin reads the column; a non-admin reads nothing (RLS still covers the row)
--
-- Before add_editor_target_task.sql the very first INSERT fails with
-- „column target_task_id does not exist" — which is also a correct failure.

BEGIN;

-- ─────────────────────────────────────────────
-- Fixture
-- ─────────────────────────────────────────────
-- Fixed UUIDs, not gen_random_uuid(): the assertions name these rows
-- explicitly, so a rerun that somehow escaped its rollback collides loudly on
-- the primary key instead of quietly measuring the wrong rows.

INSERT INTO public.kurse (id, title, published, position) VALUES
  ('bbbbbbbb-0000-4000-8000-000000000001', 'Target-Check Kurs', FALSE, 0);

INSERT INTO public.units (id, kurs_id, title, position) VALUES
  ('bbbbbbbb-0000-4000-8000-000000000002',
   'bbbbbbbb-0000-4000-8000-000000000001', 'Target-Check Einheit', 0);

-- Two Tasks: the draft targets the SECOND one, so scenario 3 cannot pass by
-- accident when the fallback happens to be the same row.
INSERT INTO public.tasks (id, unit_id, title, position) VALUES
  ('bbbbbbbb-0000-4000-8000-000000000003',
   'bbbbbbbb-0000-4000-8000-000000000002', 'Target-Check Aufgabe 1', 0),
  ('bbbbbbbb-0000-4000-8000-000000000004',
   'bbbbbbbb-0000-4000-8000-000000000002', 'Target-Check Aufgabe 2', 1);

INSERT INTO public.editor_documents (id, title, content, target_task_id) VALUES
  ('bbbbbbbb-0000-4000-8000-000000000005',
   'Target-Check Entwurf',
   '{"version":"1.1","variables":[],"content":[]}'::jsonb,
   'bbbbbbbb-0000-4000-8000-000000000004');

-- ─────────────────────────────────────────────
-- 1. A stored target round-trips
-- ─────────────────────────────────────────────

DO $$
DECLARE t uuid;
BEGIN
  SELECT target_task_id INTO t FROM public.editor_documents
   WHERE id = 'bbbbbbbb-0000-4000-8000-000000000005';
  IF t IS DISTINCT FROM 'bbbbbbbb-0000-4000-8000-000000000004'::uuid THEN
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — stored target: expected the second Aufgabe, got %', t;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 2. An unknown Task id is refused
-- ─────────────────────────────────────────────
-- Without this, a plain UUID column with no REFERENCES would pass every other
-- scenario except 3 — and would silently keep dangling ids forever.

DO $$
BEGIN
  BEGIN
    INSERT INTO public.editor_documents (id, title, content, target_task_id) VALUES
      ('bbbbbbbb-0000-4000-8000-000000000006', 'Target-Check Dangling',
       '{"version":"1.1","variables":[],"content":[]}'::jsonb,
       'bbbbbbbb-0000-4000-8000-0000000000ff');
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — foreign key: an unknown Task id was accepted as target_task_id';
  EXCEPTION WHEN foreign_key_violation THEN
    NULL;  -- expected
  END;
END $$;

-- ─────────────────────────────────────────────
-- 3. Deleting the Task nulls the column
-- ─────────────────────────────────────────────
-- The silent fallback of #106. The draft must survive: an author's work cannot
-- disappear because someone reorganised the course tree.

DELETE FROM public.tasks WHERE id = 'bbbbbbbb-0000-4000-8000-000000000004';

DO $$
DECLARE rows bigint; t uuid;
BEGIN
  SELECT count(*) INTO rows FROM public.editor_documents
   WHERE id = 'bbbbbbbb-0000-4000-8000-000000000005';
  IF rows <> 1 THEN
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — task delete: the draft did not survive (expected 1 row, got %)', rows;
  END IF;
  SELECT target_task_id INTO t FROM public.editor_documents
   WHERE id = 'bbbbbbbb-0000-4000-8000-000000000005';
  IF t IS NOT NULL THEN
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — task delete: expected target_task_id NULL, got %', t;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 4. RLS still covers the row, column and all
-- ─────────────────────────────────────────────
-- The four editor_documents policies are column-blind, so the new column needs
-- no policy of its own. Asserted rather than assumed.

SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub":"bbbbbbbb-0000-4000-8000-00000000000c","role":"authenticated","app_metadata":{"role":"admin"}}';

DO $$
DECLARE rows bigint;
BEGIN
  SELECT count(*) INTO rows FROM public.editor_documents
   WHERE id = 'bbbbbbbb-0000-4000-8000-000000000005' AND target_task_id IS NULL;
  IF rows <> 1 THEN
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — admin read: expected 1 draft row, got %', rows;
  END IF;
END $$;

RESET ROLE;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"sub":"bbbbbbbb-0000-4000-8000-00000000000d","role":"authenticated","app_metadata":{"provider":"email"}}';

DO $$
DECLARE rows bigint;
BEGIN
  SELECT count(*) INTO rows FROM public.editor_documents
   WHERE id = 'bbbbbbbb-0000-4000-8000-000000000005';
  IF rows <> 0 THEN
    RAISE EXCEPTION 'EDITOR TARGET CHECK FAILED — non-admin read: drafts are admin-only, expected 0 rows, got %', rows;
  END IF;
END $$;

RESET ROLE;

SELECT 'editor target-task check: PASSED — 4 scenarios, 6 assertions' AS result;

ROLLBACK;
