-- Run this in the Supabase SQL editor to set up the database schema.

-- ─────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────

-- profiles: one row per user, auto-created on sign-up
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Kurs → Unit → Task → Document hierarchy ───────────

-- kurse: top-level groupings (e.g. "Kurs 1")
CREATE TABLE public.kurse (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  published   BOOLEAN     NOT NULL DEFAULT FALSE,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- units: second level, belong to a Kurs
CREATE TABLE public.units (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  kurs_id     UUID        NOT NULL REFERENCES public.kurse(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- tasks: third level, belong to a Unit
CREATE TABLE public.tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID        NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- documents: PDF leaf nodes, belong to a Task (one or more per task)
CREATE TABLE public.documents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID        NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  pdf_path    TEXT        NOT NULL, -- storage path inside the 'pdfs' bucket
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Trigger: auto-create a profile row on sign-up
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kurse     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Each user can only see their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- ── SELECT: visibility is inherited from the parent Kurs's published flag ──

-- Authenticated users see published kurse
CREATE POLICY "Authenticated users can view published kurse"
  ON public.kurse FOR SELECT
  TO authenticated
  USING (published = TRUE);

-- Units are visible when their parent Kurs is published
CREATE POLICY "View units of published kurse"
  ON public.units FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.kurse
      WHERE kurse.id = units.kurs_id AND kurse.published = TRUE
    )
  );

-- Tasks are visible when their grandparent Kurs is published
CREATE POLICY "View tasks of published kurse"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.units
      JOIN public.kurse ON kurse.id = units.kurs_id
      WHERE units.id = tasks.unit_id AND kurse.published = TRUE
    )
  );

-- Documents are visible when their great-grandparent Kurs is published
CREATE POLICY "View documents of published kurse"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      JOIN public.units ON units.id = tasks.unit_id
      JOIN public.kurse ON kurse.id = units.kurs_id
      WHERE tasks.id = documents.task_id AND kurse.published = TRUE
    )
  );

-- ── SELECT: admins can view all rows (including unpublished) ──
-- Multiple SELECT policies are OR'd, so regular users still only see published content.

CREATE POLICY "Admins can view all kurse"
  ON public.kurse FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can view all units"
  ON public.units FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can view all tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── INSERT: admin only (role checked from JWT app_metadata) ──

CREATE POLICY "Admins can insert kurse"
  ON public.kurse FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert units"
  ON public.units FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── UPDATE: admin only ──

CREATE POLICY "Admins can update kurse"
  ON public.kurse FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update units"
  ON public.units FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ── DELETE: admin only ──

CREATE POLICY "Admins can delete kurse"
  ON public.kurse FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete units"
  ON public.units FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─────────────────────────────────────────────
-- Storage policies (run in Supabase SQL editor)
-- ─────────────────────────────────────────────

-- Admins can upload files to the pdfs bucket
CREATE POLICY "Admins can upload PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pdfs'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Admins can delete PDFs from storage
CREATE POLICY "Admins can delete PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pdfs'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ─────────────────────────────────────────────
-- Granting admin role (run once per admin user)
-- ─────────────────────────────────────────────
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-admin@example.com';

-- ─────────────────────────────────────────────
-- v3.4 migration: add image support to documents
-- ─────────────────────────────────────────────

-- Add file_type column (existing rows default to 'pdf')
ALTER TABLE public.documents ADD COLUMN file_type text NOT NULL DEFAULT 'pdf';

-- Rename pdf_path to file_path
ALTER TABLE public.documents RENAME COLUMN pdf_path TO file_path;

-- ─────────────────────────────────────────────
-- v3.5 migration: image collection support
-- ─────────────────────────────────────────────

-- Make file_path nullable (image_collection documents have no single file)
ALTER TABLE public.documents ALTER COLUMN file_path DROP NOT NULL;

-- document_images: multiple images belonging to one document
CREATE TABLE public.document_images (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID        NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  file_path   TEXT        NOT NULL,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.document_images ENABLE ROW LEVEL SECURITY;

-- Regular users: visible when parent document is under a published kurs
CREATE POLICY "View document_images of published kurse"
  ON public.document_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.documents
      JOIN public.tasks  ON tasks.id  = documents.task_id
      JOIN public.units  ON units.id  = tasks.unit_id
      JOIN public.kurse  ON kurse.id  = units.kurs_id
      WHERE documents.id = document_images.document_id AND kurse.published = TRUE
    )
  );

-- Admins can view all document_images
CREATE POLICY "Admins can view all document_images"
  ON public.document_images FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admins can insert document_images
CREATE POLICY "Admins can insert document_images"
  ON public.document_images FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admins can delete document_images
CREATE POLICY "Admins can delete document_images"
  ON public.document_images FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
