# Dokum — Manual Test Cases (Foundation Refactor v4.0)

Test against **dev** (`elnupcpwhvfbmbpcbwrc`) unless explicitly noted. Each case lists the steps, expected result, and (where useful) a SQL check you can run in the Supabase dashboard.

You'll need:
- One **regular user** account
- One **admin** account (`raw_app_meta_data.role = "admin"`)
- One **published** Kurs and one **unpublished** Kurs in the dev DB
- A small PDF (<4 MB) and a JPG/PNG (<4 MB) for upload tests
- A PDF >4 MB to trigger the size limit

---

## 1. Authentication & middleware ([src/middleware.ts](src/middleware.ts))

### 1.1 Unauthenticated user is redirected from /admin
1. Sign out (or use private window).
2. Visit `/admin`.
3. **Expect:** redirect to `/auth/login`.
4. Repeat for `/admin/kurse/new`, `/admin/units/new`, `/admin/tasks/new`, `/admin/documents/new` — all should redirect.

### 1.2 Regular (non-admin) user is blocked from /admin
1. Sign in as the regular user.
2. Visit `/admin`.
3. **Expect:** redirect away (to `/` or `/auth/login`); the admin hub does not render.
4. Confirm in the network panel that no admin data was returned.

### 1.3 Admin can access /admin/*
1. Sign in as admin.
2. Visit `/admin` — 4-card grid renders.
3. Visit each `/admin/{kurse,units,tasks,documents}/new` — page renders with form + tree.

### 1.4 JWT role refresh
1. As admin, run in SQL: `UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data - 'role' WHERE email = '<admin-email>';`
2. **Without signing out**, refresh `/admin`.
3. **Expect:** still works (JWT not yet refreshed).
4. Sign out, sign back in, visit `/admin`.
5. **Expect:** now blocked.
6. Restore admin role: `UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb WHERE email = '<admin-email>';` and sign out/in.

### 1.5 Consent enforcement
1. As a brand-new user (no consent record), sign in.
2. **Expect:** middleware redirects to `/consent`.
3. Accept consent → can now reach `/`.
4. Visit `/consent/withdraw`, withdraw consent.
5. **Expect:** future requests redirect back to `/consent`.

---

## 2. Public content visibility (RLS)

### 2.1 Only published Kurse appear on home
1. Set one Kurs `published = false` in DB.
2. As regular user, visit `/`.
3. **Expect:** unpublished Kurs is **not** in the grid.
4. As admin, visit `/` — admin sees the same set (RLS returns only published; admin sees all only when accessing `/admin`).
5. SQL sanity check:
   ```sql
   SELECT id, title, published FROM kurse ORDER BY position;
   ```

### 2.2 Direct URL of unpublished Kurs returns 404
1. Copy the UUID of an unpublished Kurs.
2. As regular user, visit `/kurse/<that-uuid>`.
3. **Expect:** 404 / "not found" UI (not a server error).

### 2.3 Children of unpublished Kurs are hidden
1. As regular user, attempt to visit `/kurse/<unpublished-id>/units/<unit-id>`.
2. **Expect:** 404. RLS subquery on `kurse.published` blocks the read.

### 2.4 Toggling published is instant
1. As admin in DB: `UPDATE kurse SET published = true WHERE id = '<id>';`
2. Refresh home as regular user (Ctrl+F5 to bypass cache).
3. **Expect:** Kurs appears immediately.

---

## 3. Sorting (DAL — [src/lib/dal.ts](src/lib/dal.ts))

### 3.1 Position sorting
1. In DB set 3 Kurse to `position = 1, 2, 3`.
2. **Expect:** home shows them in that order.
3. Swap two positions, refresh — order updates.

### 3.2 Tie-break on created_at
1. Set 2 Kurse to the same `position`.
2. **Expect:** the one with the earlier `created_at` appears first.

### 3.3 Same rule applies at every level
- Repeat 3.1 for `units`, `tasks`, `documents`, `document_images`. All should obey `position ASC, created_at ASC`.

---

## 4. Admin CRUD (server actions + Zod + audit + revalidate)

For each entity (Kurs, Unit, Task, Document) run create / update / delete and verify the same 4 things:
- (a) DB row appears/changes/disappears
- (b) Tree view on the right reflects it **without manual refresh** (revalidate worked)
- (c) An `audit_logs` row was written
- (d) Bad input is rejected by Zod

### 4.1 Create Kurs
1. `/admin/kurse/new`, fill title + description, submit.
2. **(a)** `SELECT * FROM kurse ORDER BY created_at DESC LIMIT 1;`
3. **(b)** Tree on right side shows the new Kurs.
4. **(c)** `SELECT * FROM audit_logs WHERE action='create' AND entity_type='kurs' ORDER BY created_at DESC LIMIT 1;` — actor_id matches your admin user.
5. **(d)** Submit form with empty title — **Expect:** German error message, no DB write.

### 4.2 Update Kurs
1. Click edit on an existing Kurs in the tree → URL becomes `?editId=<uuid>`, form pre-fills.
2. Change title, submit.
3. **Expect:** DB updated, tree refreshed, audit row with `action='update'`.

### 4.3 Toggle published from form
1. Edit a Kurs, flip the published checkbox, save.
2. **Expect:** `kurse.published` flips in DB; child visibility for regular users flips correspondingly.

### 4.4 Delete Kurs cascades
1. Pick a Kurs that has units → tasks → documents (with at least one uploaded file).
2. Note the file paths: `SELECT file_path FROM documents WHERE task_id IN (SELECT id FROM tasks WHERE unit_id IN (SELECT id FROM units WHERE kurs_id = '<id>'));`
3. Delete the Kurs from the admin UI.
4. **Expect:**
   - `kurse`, `units`, `tasks`, `documents`, `document_images` rows all gone (`ON DELETE CASCADE`).
   - Storage bucket `pdfs` no longer contains those file paths (check via Supabase dashboard → Storage).
   - Audit row with `action='delete'`, `entity_type='kurs'`, `metadata.paths_deleted = <count>`.

### 4.5 Repeat 4.1–4.4 for Unit, Task, Document
- Unit/Task have no file uploads — skip the storage cleanup check.
- For Document: upload PDF, then upload image, then upload image_collection (multiple images). Verify `file_type` column is set correctly.

### 4.6 Document file replace
1. Edit an existing Document, upload a new file.
2. **Expect:** `documents.file_path` updated, **old file removed** from Storage, audit row.

### 4.7 Zod field-name regression
1. Open browser devtools, edit one form input's `name` attribute (e.g. rename `title` → `titel`), submit.
2. **Expect:** action returns `{ ok: false, error: ... }`; no DB write. (This protects against future rename mismatches.)

---

## 5. File upload limits & MIME ([src/lib/constants.ts](src/lib/constants.ts), [next.config.ts](next.config.ts))

### 5.1 Oversize file rejected
1. Try to upload a 5 MB PDF as a Document.
2. **Expect:** rejection (Next.js server action body limit is 4 MB — should fail before reaching DB).

### 5.2 Disallowed MIME rejected
1. Try to upload a `.txt` or `.exe` file.
2. **Expect:** Zod rejects it; no upload.

### 5.3 Allowed types accepted
- `application/pdf` → file_type `pdf` ✓
- `image/jpeg`, `image/png`, `image/webp` → file_type `image` ✓
- Multiple images at once → file_type `image_collection` with rows in `document_images` ✓

---

## 6. File proxy routes (auth-gated streaming)

`/api/file/[docId]` and `/api/image/[imageId]` should never expose Supabase URLs.

### 6.1 Unauthenticated request
1. Sign out, hit `/api/file/<any-doc-id>` directly.
2. **Expect:** 401 (or redirect to login).

### 6.2 Regular user, published course
1. Sign in as regular user.
2. Open a Kurs → Unit → Task → click a document.
3. **Expect:** PDF/image renders in browser.
4. Network tab: response comes from `/api/file/...`, not from `*.supabase.co`.

### 6.3 Regular user, unpublished course
1. As admin, set parent Kurs `published = false`.
2. As regular user (other tab), reuse the docId and hit `/api/file/<docId>`.
3. **Expect:** 403 (the proxy joins up to `kurse.published`).

### 6.4 Admin sees unpublished
1. As admin, hit the same `/api/file/<docId>` for an unpublished Kurs's document.
2. **Expect:** 200 — admin can preview unpublished content.

### 6.5 Signed URL not leaked
1. Inspect any file response headers / page source.
2. **Expect:** no raw `*.supabase.co/storage/v1/object/sign/...` URL anywhere in HTML or network besides the server-side fetch.

### 6.6 PDF on iPhone Safari (regression guard)
1. On an iPhone, open a PDF document.
2. **Expect:** opens inline (no forced download). The signed URL must not include `download=true`.

---

## 7. Error & loading boundaries

### 7.1 Loading skeletons render
1. Throttle network to "Slow 3G" in devtools.
2. Navigate to `/`, `/kurse/<id>`, `/kurse/<id>/units/<id>`, `/admin`.
3. **Expect:** `loading.tsx` skeleton appears briefly before the page content.

### 7.2 Route-level error boundary
1. Temporarily break a Kurs detail by passing an invalid UUID like `/kurse/not-a-uuid`.
2. **Expect:** German error UI from `error.tsx` (not a Next.js stack trace, not a white screen).
3. The retry button on the error page reloads correctly.

### 7.3 Admin error boundary
1. Visit `/admin/kurse/new?editId=00000000-0000-0000-0000-000000000000` (non-existent UUID).
2. **Expect:** form falls back to create mode OR error boundary catches gracefully — never a stack trace.

---

## 8. Audit log integrity ([supabase/add_audit_log.sql](supabase/add_audit_log.sql))

### 8.1 Admin can SELECT
1. Sign in as admin → run in SQL editor:
   ```sql
   SELECT count(*) FROM audit_logs;
   ```
2. **Expect:** returns the count.

### 8.2 Regular user cannot SELECT
1. Sign in to the SQL editor as a non-admin (or use the anon key in a quick fetch).
2. **Expect:** RLS blocks; result is 0 rows or permission denied.

### 8.3 Audit log is immutable
Run as admin in SQL editor:
```sql
UPDATE audit_logs SET action = 'create' WHERE id = (SELECT id FROM audit_logs LIMIT 1);
DELETE FROM audit_logs WHERE id = (SELECT id FROM audit_logs LIMIT 1);
```
**Expect:** both fail with RLS / permission error. No `UPDATE`/`DELETE` policy exists.

### 8.4 Audit failure does not block primary op
1. Temporarily revoke INSERT on `audit_logs` for the admin role:
   ```sql
   REVOKE INSERT ON audit_logs FROM authenticated;
   ```
2. Create a new Kurs from the UI.
3. **Expect:** Kurs is created (primary op succeeds); server logs show audit failure but UI does not break.
4. Restore: `GRANT INSERT ON audit_logs TO authenticated;` (or re-apply the migration).

### 8.5 Metadata is captured on cascade delete
1. Delete a Kurs that owns N storage files.
2. `SELECT metadata FROM audit_logs WHERE action='delete' AND entity_type='kurs' ORDER BY created_at DESC LIMIT 1;`
3. **Expect:** `metadata.paths_deleted = N` (or similar key — see [src/actions/admin/kurse.ts](src/actions/admin/kurse.ts)).

---

## 9. Revalidation after mutations ([src/actions/admin/_shared.ts](src/actions/admin/_shared.ts))

### 9.1 All four admin pages refresh
1. Open `/admin/units/new` in tab A and `/admin/tasks/new` in tab B.
2. In tab A, create a new Unit.
3. Without manual refresh, switch to tab B.
4. **Expect:** the new Unit appears in B's tree (since tasks tree shows the unit hierarchy).

### 9.2 Public pages refresh
1. Open `/` in tab A as regular user.
2. In tab B as admin, create + publish a new Kurs.
3. Refresh tab A.
4. **Expect:** new Kurs appears immediately (root layout was revalidated).

---

## 10. CSP & security headers ([next.config.ts](next.config.ts))

### 10.1 CSP header present
1. In devtools network tab, click any document load.
2. **Expect:** `Content-Security-Policy` response header lists explicit sources for `script-src`, `style-src`, `img-src`, `connect-src`, `font-src`.
3. No `'unsafe-inline'` for scripts (styles may use it for Tailwind).

### 10.2 External script blocked
1. Open browser console on `/`, paste:
   ```js
   const s = document.createElement('script'); s.src='https://example.com/x.js'; document.head.appendChild(s);
   ```
2. **Expect:** browser blocks the load (CSP violation in console).

---

## 11. Two-environment safety

### 11.1 Dev badge visible
1. Run `npm run dev` (loads `.env.local` → dev project).
2. **Expect:** dev badge visible somewhere in the layout.
3. Run `npm run build && npm run start` (loads `.env.production.local` → prod project).
4. **Expect:** no dev badge.

### 11.2 Don't accidentally hit prod
1. Confirm `NEXT_PUBLIC_APP_ENV=dev` in `.env.local`.
2. Confirm Supabase URL in `.env.local` includes `elnupcpwhvfbmbpcbwrc`.
3. Confirm `.env.production.local` includes `pnooldcnqlsqjatbtimz`.

---

## 12. Smoke (5-minute end-to-end)

If you only have 5 minutes:

1. Sign in as admin → create a Kurs (published) → create a Unit → create a Task → upload a PDF Document.
2. Sign out → sign in as regular user → navigate from home down to the document → open the PDF.
3. Back as admin → delete the Kurs.
4. Verify in DB: cascading delete cleared everything; 5 audit rows written (1 create per level + 1 delete).
5. Verify in Storage: the uploaded PDF is gone.

If all of this works, the foundation refactor is healthy.

---

## Quick SQL cheatsheet

```sql
-- Recent audit activity
SELECT al.created_at, al.action, al.entity_type, al.entity_title, u.email
FROM audit_logs al JOIN auth.users u ON u.id = al.actor_id
ORDER BY al.created_at DESC LIMIT 20;

-- Find orphaned storage paths (none should exist)
SELECT file_path FROM documents
UNION ALL
SELECT file_path FROM document_images;

-- Confirm RLS is enabled on all relevant tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles','kurse','units','tasks','documents','document_images','audit_logs');

-- Grant / revoke admin
UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb WHERE email = '<email>';
UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data - 'role' WHERE email = '<email>';
```




# Test Notice

- when a document gets updated/replaced the old documents doesnt gets deleted in the supabase storage