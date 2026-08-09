# Dokum — Developer Overview

## Project Purpose

**Dokum** is a web application that allows authenticated users to view and access published course materials (Kurse) organized as PDF documents and images. The app features an admin dashboard for content creators to build and manage the course hierarchy.

## Quick Facts

- **Status**: v4.3 (LaTeX editor integrated into the admin panel — PRD #28)
- **Repository**: git (`master` branch is stable; feature work on separate branches)
- **Tech Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel-ready

## Architecture Overview

### Hierarchy Model

```
Kurs (Course)
  └── Unit                    ← paid unit-of-purchase (see Payments below)
        └── Task
              └── Document (PDF | Image | Image Collection)
                    └── DocumentImage (for collections only)
```

**Key Rules:**
- Only `kurse` has a `published` boolean — `units` inherit visibility from it, and **nothing below Unit does**
- **Tasks / Documents / DocumentImages / `pdfs` storage objects gate on an `entitlements` row alone** (or admin role). `add_entitlements.sql` *dropped* the `published` subquery from those four policies, so at the DB level they stay readable to an entitled user even when the parent Kurs is unpublished. The `/api/file` and `/api/image` proxies independently re-check `kurse.published` in app code, so **files** are still blocked — only row metadata (title/description/position) is exposed. Closing that gap is a decided-but-unimplemented change (map issue #60): re-add the `published` conjunct so the policies read *entitled AND published*.
- All levels support `position` ordering (non-unique integers; ties broken by `created_at ASC`)
- Sorting is applied inside the DAL (`src/lib/dal.ts`) — no manual sorting in page components
- `ON DELETE CASCADE` at every foreign key level

### Payments (per-Unit, one-time, flat €3)

- **Model:** each `Unit` is bought once for a flat €3 (test mode price `price_1TWLu0CbBje0sCsEadcen6py`). Lifetime entitlement, no subscription.
- **`entitlements` table:** `(user_id, unit_id, granted_at, source: 'purchase'|'admin', stripe_session_id)`. UNIQUE on `(user_id, unit_id)`; partial UNIQUE on `stripe_session_id` for webhook idempotency.
- **RLS:** SELECT on tasks/documents/document_images and storage.objects (bucket `pdfs`) requires `EXISTS` in `entitlements` for the ancestor `unit_id`, OR admin role.
- **Flow:** user clicks "Freischalten – €3" → form posts to `/api/checkout/[unitId]` → server creates Checkout Session and redirects → user pays on Stripe → Stripe redirects to `/api/checkout/success?session_id=…` which eager-inserts the entitlement using the service-role client (idempotent on `stripe_session_id`) → `/api/stripe/webhook` covers the case where the user closes the tab.
- **Admin grants:** insert directly into `entitlements` with `source = 'admin'` (via Supabase dashboard or a future admin action) — audit-log with `action='grant', entity_type='entitlement'`.
- **Env requirements:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_UNIT_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- **CSP:** `connect-src` allows `api.stripe.com`; `frame-src` allows `js.stripe.com`, `hooks.stripe.com`, `checkout.stripe.com`; `form-action` allows `checkout.stripe.com`.
- **Proxy:** `/api/stripe/webhook` bypasses the proxy entirely (Stripe has no cookies).

### Authentication & Authorization

**User Roles:**
- **Regular User**: Authenticated via Supabase Auth (login/register). Can view published content.
- **Admin**: Role stored in `auth.users.raw_app_meta_data` as `{"role": "admin"}`. Can create, edit, and delete content.

**Access Control:**
- Proxy (`src/proxy.ts` — Next.js 16 renamed the `middleware` convention to `proxy`) protects `/admin/*` routes and API proxy routes
- Admin pages do **not** duplicate the auth check — the proxy is the single enforcement point
- File proxy routes (`/api/file`, `/api/image`) verify the document belongs to a published course before serving — unauthenticated or unpublished-content requests return 401/403 at the application layer
- JWT includes role automatically — no extra DB queries needed
- Role grants: `UPDATE auth.users SET raw_app_meta_data = ... WHERE email = '...'` (user must sign out/in to refresh JWT)

### Database Schema

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | User metadata | `id` (auth.uid), `email`, `full_name`, `created_at` |
| `kurse` | Courses | `id`, `title`, `description`, **`published`**, `position`, `created_at` |
| `units` | Course sections | `id`, `kurs_id` (FK), `title`, `description`, `position`, `created_at` |
| `tasks` | Unit assignments | `id`, `unit_id` (FK), `title`, `description`, `position`, `created_at` |
| `documents` | PDFs/images/published interactive documents | `id`, `task_id` (FK), `title`, `description`, `file_path`, `file_type` (`pdf`\|`image`\|`image_collection`\|`interactive`, CHECK-constrained), `position`, `created_at`, `content` (JSONB, published document JSON — NULL for legacy rows) |
| `document_images` | Image collection items | `id`, `document_id` (FK CASCADE), `file_path`, `position`, `created_at` |
| `audit_logs` | Admin + purchase action log | `id`, `actor_id` (FK auth.users), `action` (`create`\|`update`\|`delete`\|`grant`\|`revoke`), `entity_type` (incl. `entitlement`, `editor_document`, `editor_image`), `entity_id`, `entity_title`, `metadata` (JSONB), `created_at` |
| `entitlements` | Per-(user, unit) paid access | `id`, `user_id` (FK auth.users), `unit_id` (FK units), `granted_at`, `source` (`purchase`\|`admin`), `stripe_session_id` |
| `editor_documents` | LaTeX-editor drafts (PRD #28; outside the Kurs hierarchy until published) | `id`, `title`, `content` (JSONB, versioned document JSON), `published_document_id` (FK documents, SET NULL), `created_by` (FK auth.users, SET NULL), `created_at`, `updated_at` (trigger-maintained) |
| `editor_images` | Uploaded images of editor drafts (slice 8; never base64 in `content` — blocks store the row id) | `id`, `editor_document_id` (FK CASCADE), `file_path` (in bucket `pdfs` under `editor-images/<draftId>/…`), `created_at` |

### Row-Level Security (RLS)

| Table | Policy | Effect |
|-------|--------|--------|
| `profiles` | SELECT where `id = auth.uid()` | Users see only their own profile |
| `kurse` | SELECT where `published = TRUE` (auth); INSERT/UPDATE/DELETE where role = admin | Published courses visible to all; admins manage |
| `units` | SELECT via subquery to `kurse.published`; INSERT/UPDATE/DELETE where role = admin | Units stay browseable for non-purchasers (so they can see what to buy) |
| `tasks/documents` | SELECT via subquery to `entitlements` + admin override; INSERT/UPDATE/DELETE where role = admin | Content gated by purchase |
| `document_images` | SELECT via join to `entitlements` + admin override; INSERT/DELETE where role = admin | Content gated by purchase |
| `entitlements` | SELECT own rows or admin; INSERT/DELETE where role = admin (webhook inserts via service-role) | Users see their grants; admins manage |
| `storage.objects` (`pdfs` bucket) | INSERT/DELETE where bucket = `pdfs` and role = admin; SELECT requires entitlement for the unit owning the path | File access matches in-DB access |
| `audit_logs` | SELECT/INSERT where role = admin; no UPDATE/DELETE | Immutable audit trail; admin-readable only |
| `editor_documents` | SELECT/INSERT/UPDATE/DELETE where role = admin (not filtered by `created_by`) | Drafts are admin-only; both admins see and edit all drafts |
| `editor_images` | SELECT/INSERT/DELETE where role = admin (no UPDATE — rows are immutable) | Editor images admin-only; the bucket-wide admin storage policies cover their objects (entitlement SELECT never matches these paths) |

## Project Structure

```
src/
├── actions/
│   ├── admin/                      # Admin server actions (split by entity)
│   │   ├── _shared.ts             # Shared helpers (getAdminUser, collectStoragePaths, parseForm)
│   │   ├── kurse.ts               # createKurs, updateKurs, deleteKurs
│   │   ├── units.ts               # createUnit, updateUnit, deleteUnit
│   │   ├── tasks.ts               # createTask, updateTask, deleteTask
│   │   ├── documents.ts           # createDocument, updateDocument, deleteDocument
│   │   ├── editor-documents.ts    # createEditorDraft, updateEditorDraft, deleteEditorDraft
│   │   ├── editor-images.ts       # uploadEditorImage (implicit anchor draft, storage upload)
│   │   ├── editor-publish.ts      # publishEditorDraft (PNG → Document; create / update-in-place)
│   │   └── index.ts               # Re-exports all actions
│   └── auth.ts                    # signIn, signUp, signOut
├── app/
│   ├── page.tsx                   # Home: grid of published Kurse
│   ├── layout.tsx                 # Root layout (Navbar, Footer)
│   ├── error.tsx                  # Root error boundary (client component)
│   ├── loading.tsx                # Root loading skeleton
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts      # Supabase auth callback
│   ├── consent/                   # GDPR consent management
│   ├── datenschutz/               # Privacy policy
│   ├── impressum/                 # Legal info
│   ├── kurse/
│   │   └── [kursId]/
│   │       ├── page.tsx           # Kurs detail (unit cards)
│   │       ├── error.tsx
│   │       ├── loading.tsx
│   │       └── units/[unitId]/
│   │           ├── page.tsx       # Unit detail (expandable task/document tree)
│   │           ├── error.tsx
│   │           └── loading.tsx
│   ├── admin/
│   │   ├── page.tsx               # Admin hub (4-card grid)
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── kurse/new/page.tsx     # Create/edit Kurs
│   │   ├── units/new/page.tsx     # Create/edit Unit
│   │   ├── tasks/new/page.tsx     # Create/edit Task
│   │   ├── documents/new/page.tsx # Create/edit Document
│   │   └── editor/                # LaTeX editor (PRD #28): draft list, editor shell, PNG export, publish
│   │       ├── page.tsx           #   loads draft + target tree via DAL, remounts shell per draftId
│   │       └── editor.css         #   consolidated editor styles (Dokum-red rebrand)
│   └── api/
│       ├── file/[docId]/route.ts          # Auth-gated file proxy (PDFs/images)
│       ├── image/[imageId]/route.ts       # Auth-gated image collection proxy
│       └── editor-image/[imageId]/route.ts # Admin-only editor-image proxy (STREAMS, same-origin)
├── components/
│   ├── admin/
│   │   ├── KursForm.tsx           # Create/edit Kurs form
│   │   ├── UnitForm.tsx           # Create/edit Unit form
│   │   ├── TaskForm.tsx           # Create/edit Task form
│   │   ├── DocumentForm.tsx       # Create/edit Document form
│   │   ├── UnitPageClient.tsx     # Client wrapper for Unit admin page
│   │   ├── TaskPageClient.tsx     # Client wrapper for Task admin page
│   │   ├── DocumentPageClient.tsx # Client wrapper for Document admin page
│   │   ├── AdminTree.tsx          # Generic nested tree visualizer
│   │   ├── AdminSubpageNav.tsx    # Tab navigation for admin subpages
│   │   └── editor/                # LaTeX editor React shell (PRD #28)
│   │       ├── EditorShell.tsx    #   save bar + Term state + imperative mount (controller)
│   │       ├── EditorToolbar.tsx  #   rich-text toolbar (uncontrolled → controller)
│   │       ├── ExportBar.tsx      #   Kurs/Unit/Task targets, Term, filename, PNG download + publish (size guard)
│   │       └── DraftList.tsx      #   draft list with open/delete
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── kurse/
│   │   ├── KursCard.tsx
│   │   └── UnitCard.tsx
│   ├── documents/
│   │   ├── DocumentCard.tsx
│   │   ├── InteractiveDocument.tsx # Live student render of a published document JSON + PNG fallback (error boundary)
│   │   ├── DocumentPng.tsx        #   the stored picture: legacy 'image' render AND the interactive fallback
│   │   ├── Watermark.tsx          #   tiled deterrent overlay (pointer-events:none — must not block selection)
│   │   └── interactive-document.css #  student typography/pills/formula blocks (scoped to .dokum-document)
│   ├── consent/
│   ├── datenschutz/
│   ├── UnitDetailClient.tsx       # Unit detail page (expandable tasks + documents)
│   ├── ShareButton.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── constants.ts               # Centralized config (bucket, file limits, MIME types)
│   ├── dal.ts                     # Data access layer — all Supabase read queries
│   ├── schemas.ts                 # Zod schemas for server action input validation
│   ├── audit.ts                   # logAdminAction() — fire-and-forget audit log writer
│   ├── editor/                    # LaTeX editor (PRD #28): imperative core + pure modules
│   │   ├── controller.ts          # Imperative contenteditable controller (browser-only)
│   │   ├── document-json.ts       # Versioned Zod schema (discriminated union over `version`) + ported importer + serializer
│   │   ├── document-version.ts    # Upgrade-on-read: pure vN→vN+1 chain + readDocumentJson (the boundary for stored snapshots) — pure
│   │   ├── document-render.ts     # Student renderer: document JSON → live DOM, reusing the importer + resolver; MathJax-free — pure
│   │   ├── publish-plan.ts        # Copy-fresh-then-swap image re-homing plan for publishing (what to copy/rewrite/delete) — pure
│   │   ├── expression-evaluator.ts # CSP-safe math tokenizer/parser — replaces new Function; errors → NaN
│   │   ├── latex-normalise.ts     # LaTeX→expression translation + auto-expression extraction
│   │   ├── field-resolver.ts      # Input/Output field graph: value resolution, cycle → Err, output-as-input rule — pure
│   │   ├── latex-display.ts       # LaTeX display cleanup (cleanupLatex, `*` → `\,\cdot\,`) — pure
│   │   ├── library-sync.ts        # Formula-library entry sync after formula edits — pure
│   │   ├── number-format.ts       # German display formatting (formatValue)
│   │   ├── export-filename.ts     # PNG filename builder (Term + 1-based tree ordinals) + Document-title seed — pure
│   │   ├── png-export.ts          # PNG export pipeline → Blob (SVG raster at 2×, html2canvas; browser-only)
│   │   ├── mathjax-loader.ts      # Bundled MathJax loader — config set BEFORE the dynamic tex-svg-full import (full build: color macros need it; browser-only)
│   │   ├── mathjax.d.ts           # Minimal type declarations for the bundled MathJax component
│   │   └── *.test.ts              # Colocated Vitest golden tests (parity contract with the standalone editor)
│   ├── supabase/
│   │   ├── server.ts              # Supabase SSR client (server/proxy)
│   │   └── client.ts              # Supabase browser client
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
├── proxy.ts                       # Request routing, auth enforcement, consent check (Next.js 16 renamed middleware → proxy)
└── types/
    └── index.ts                   # TypeScript interfaces + ActionResult<T> union
```

Outside `src/`: `supabase/` holds the SQL migrations (see [Database Migrations](#database-migrations)), and `latexEditor/` holds the committed standalone reference editor (PRD #28) — the port's behavioral ground truth, still runnable in a plain browser.

## Key Patterns

### Data Access Layer (DAL)

All Supabase data reads go through `src/lib/dal.ts`. Page components and API routes never call `supabase.from()` directly.

```ts
// In a page component:
import { getKursWithUnits } from '@/lib/dal'
const kurs = await getKursWithUnits(kursId)
if (!kurs) notFound()
```

The DAL is marked `import 'server-only'` — importing it in a client component causes a build error. Sorting (position ASC, created_at ASC) is applied inside each DAL function.

### Server Action Result Type

All server actions return `ActionResult<T>` — a discriminated union from `src/types/index.ts`:

```ts
type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string }
```

Components check `state?.ok === false` for errors and `state?.ok === true` for success. No more optional `{ error?, success?, id? }` shapes.

### Zod Input Validation

All server actions validate `FormData` through Zod schemas (`src/lib/schemas.ts`) before touching the database. A missing or misnamed form field returns a typed error immediately instead of writing `undefined`/`NaN` to the database.

### Audit Logging

Every admin create, update, and delete calls `logAdminAction()` from `src/lib/audit.ts` after the primary operation succeeds. Audit log failures are logged to console but never block the primary operation.

```ts
await logAdminAction({
  actorId: user.id,
  action: 'delete',
  entityType: 'kurs',
  entityId: kursId,
  metadata: { paths_deleted: paths.length },
})
```

Records are written to the `audit_logs` table with RLS — admins can read, nobody can delete.

### Admin Subpage Layout

Each admin page (`/admin/{kurse,units,tasks,documents}/new`) follows a **70/30 two-column grid**:

```
┌─────────────────────────────────────────────────────┐
│ AdminSubpageNav (tab buttons)                       │
├──────────────────┬──────────────────────────────────┤
│   Form (70%)     │   Tree View (30%)                │
│                  │   • Shows current hierarchy      │
│                  │   • Edit/delete buttons          │
│                  │   • Highlights selected item     │
└──────────────────┴──────────────────────────────────┘
```

Pages support both create mode (no `?editId`) and edit mode (`?editId=<uuid>`). The form renders with `defaultValues` pre-filled when editing.

### File Serving

Files are stored in the private Supabase Storage bucket `pdfs`. Access is always through authenticated proxy routes:

- `GET /api/file/[docId]` — PDFs and single images
- `GET /api/image/[imageId]` — image collection items
- `GET /api/editor-image/[imageId]` — LaTeX-editor draft images (admin-only)

The document routes verify:
1. User is authenticated
2. If not admin: the document's parent course is published (join query up to `kurse.published`)

Short-lived signed URLs (60s) are generated server-side. The document routes respond with a single 302 redirect to the signed URL (the link dies after 60 s); the editor-image route instead fetches it server-side and **streams** the body, so the browser only ever sees a same-origin response — that is what lets the PNG export (html2canvas) rasterise editor images without CORS handling or canvas tainting. Signed Supabase URLs are never stored, embedded in content, or exposed beyond that one redirect.

### Error & Loading Boundaries

Every major route segment has scoped `error.tsx` and `loading.tsx` files. A failed Supabase query shows a friendly German error UI instead of a white screen.

## Server Actions

### Admin (`src/actions/admin/`)

| Function | File | Description |
|----------|------|-------------|
| `createKurs` | `kurse.ts` | Insert new Kurs |
| `updateKurs` | `kurse.ts` | Update existing Kurs |
| `deleteKurs` | `kurse.ts` | Delete Kurs + all children + storage files |
| `createUnit` | `units.ts` | Insert new Unit |
| `updateUnit` | `units.ts` | Update existing Unit |
| `deleteUnit` | `units.ts` | Delete Unit + all children + storage files |
| `createTask` | `tasks.ts` | Insert new Task |
| `updateTask` | `tasks.ts` | Update existing Task |
| `deleteTask` | `tasks.ts` | Delete Task + all children + storage files |
| `createDocument` | `documents.ts` | Upload file + insert Document record |
| `updateDocument` | `documents.ts` | Update metadata, optionally replace file |
| `deleteDocument` | `documents.ts` | Delete Document record + storage file(s) |
| `createEditorDraft` | `editor-documents.ts` | Insert editor draft (validated document JSON); returns the new id |
| `updateEditorDraft` | `editor-documents.ts` | Update draft title + content; reconciles images (rows/objects the content no longer references are deleted) |
| `deleteEditorDraft` | `editor-documents.ts` | Delete editor draft + its `editor_images` rows (cascade) + storage objects |
| `uploadEditorImage` | `editor-images.ts` | Upload an editor image to storage + insert `editor_images` row; creates the implicit „Unbenannt" anchor draft when no draft exists yet |
| `publishEditorDraft` | `editor-publish.ts` | Publish a draft's rendered PNG as a Document: updates the linked Document's file + title in place by default (same entry for students), or creates + links a new Document (first publish, „Als neues Dokument", dead-link fallback); mirrors the documents.ts upload/rollback pattern and maintains `published_document_id` |

All actions: validate input via Zod → auth check via `getAdminUser()` → database operation → audit log → revalidate cache.

### Auth (`src/actions/auth.ts`)

`signIn`, `signUp`, `signOut`, `acceptConsent`, `withdrawConsent`

## Constants & Configuration

All magic values live in `src/lib/constants.ts`:

| Constant | Value | Used for |
|----------|-------|---------|
| `STORAGE_BUCKET` | `'pdfs'` | All Supabase Storage operations |
| `MAX_FILE_SIZE_BYTES` | `4 * 1024 * 1024` | File upload size limit (4 MB) |
| `SIGNED_URL_EXPIRY_SECONDS` | `60` | Proxy route signed URL TTL |
| `ALLOWED_IMAGE_MIMES` | `['image/jpeg', ...]` | Accepted image types |
| `ALLOWED_FILE_MIMES` | `['application/pdf', ...]` | Accepted file types |
| `MIME_TO_EXT` | `Record<string, string>` | MIME → file extension map |
| `editorImageUrl(imageId)` | `` `/api/editor-image/${imageId}` `` | Single source for editor-image browser URLs (controller, JSON importer, proxy route) |

## Dependencies

| Package | Purpose |
|---------|---------|
| `next` 16 | Framework (App Router, Turbopack) |
| `react` 19 | UI with Server Components |
| `typescript` 5 | Type safety (strict mode) |
| `tailwindcss` 4 | Utility-first CSS |
| `@supabase/ssr` | Supabase Auth + DB + Storage |
| `zod` | Runtime schema validation for server actions |
| `server-only` | Build-time guard for server-only modules |
| `yet-another-react-lightbox` | Image gallery/lightbox |
| `clsx` + `tailwind-merge` | Conditional className helpers |
| `mathjax` (exact `3.2.2`) | LaTeX → SVG rendering, bundled + code-split to the editor page (no CDN — CSP) |
| `html2canvas` (exact `1.4.1`) | Editor PNG export rasterizer, bundled + code-split, loaded on first export (no CDN — CSP) |

## Running Locally

### Prerequisites

- Node.js 18+
- Supabase project with: PostgreSQL, Auth, Storage bucket named `pdfs`

### Setup

```bash
npm install

# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

npm run dev
```

Visit `http://localhost:3000`

### Tests

Vitest (`vitest.config.ts`) is a dev-only dependency — no runtime impact.

```bash
npm test             # run all unit tests once
npm run test:watch   # watch mode
```

Conventions: tests are colocated `*.test.ts` files next to their modules and assert **external behavior only** (inputs → outputs, no internal call structure). The default environment is plain Node; DOM-dependent suites opt into jsdom per file via a `@vitest-environment jsdom` docblock — currently `document-json.test.ts`, whose importer builds real DOM. The editor-module tests under `src/lib/editor/` are golden cases generated from the standalone reference editor (`latexEditor/*.html`) and double as the React port's parity contract — expected values must not be changed without checking the reference behavior first.

### Two Supabase Projects

The app talks to **two completely separate Supabase projects** — not one project with branches.

| Env | Project ref | Selected by | `NEXT_PUBLIC_APP_ENV` |
|-----|-------------|-------------|------------------------|
| Dev  | `elnupcpwhvfbmbpcbwrc` | `npm run dev` (loads `.env.local`) | `dev` |
| Prod | `pnooldcnqlsqjatbtimz` | `npm run build` / `npm run start` and Vercel (loads `.env.production.local`) | `prod` |

The dev project is a sandbox — fine to wipe and reseed. The prod project holds real users and content; treat it accordingly. Schema changes go to **dev first**, then prod once verified. The Supabase MCP server (`.mcp.json`) is pinned to the **dev project only** (`--project-ref=elnupcpwhvfbmbpcbwrc`); prod is intentionally not reachable via MCP and must be modified manually through the Supabase dashboard or CLI.

### Database Migrations

Migrations live in `supabase/`. Apply them in order — first to dev (Supabase SQL editor, CLI, or `mcp__supabase__apply_migration`), then to prod once verified (Supabase SQL editor or CLI; MCP is dev-only):

| File | Description |
|------|-------------|
| `migration.sql` | Initial schema (all tables, RLS, storage policies) |
| `add_audit_log.sql` | Audit log table and policies |
| `add_entitlements.sql` | `entitlements` table + RLS rewire so tasks/documents/storage require a purchase |
| `add_editor_documents.sql` | `editor_documents` drafts table (admin-only RLS, `updated_at` trigger) + audit `entity_type` extension |
| `add_editor_images.sql` | `editor_images` table (admin-only RLS, cascade with draft) + audit `entity_type` extension (`editor_image`); no storage-policy changes needed |
| `add_document_content.sql` | `documents.content` JSONB (published document snapshot, NULL for legacy rows) + `documents_file_type_check` CHECK adding `interactive`; no RLS changes needed — the row is already entitlement-gated |

## Common Tasks

### Grant Admin Access

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```

User must sign out and back in for the role change to take effect (JWT refresh).

### Add a New Admin Action

1. Add Zod schema to `src/lib/schemas.ts`
2. Write the action in the relevant `src/actions/admin/*.ts` file
3. Add `logAdminAction(...)` call after the primary operation succeeds
4. Call `revalidatePath(...)` to bust the Next.js cache

### Query Audit Logs

```sql
SELECT al.created_at, al.action, al.entity_type, al.entity_title, u.email
FROM public.audit_logs al
JOIN auth.users u ON u.id = al.actor_id
ORDER BY al.created_at DESC
LIMIT 50;
```

### Enable/Disable a Kurs

Set `published = true/false` in the `kurse` table. The Kurs and its Units appear/disappear instantly via RLS, and `/api/file` + `/api/image` immediately 403 non-admins for everything beneath it.

⚠ Per the Key Rules above, this hides the **navigation path and the files** — not the rows. `tasks`/`documents`/`document_images` rows stay readable to a user holding an `entitlements` row for the Unit, since their policies no longer check `published`. Admins keep full access to both rows and files, which is what makes an unpublished Kurs usable as an archive.

## Debugging Tips

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Admin page accessible without being admin | Proxy not running | Check `src/proxy.ts` exists at `src/` root (Next.js 16 renamed middleware → proxy) |
| File proxy returns 403 | Course not published | Set `kurse.published = true` for the parent course |
| Zod error on form submit | Field name mismatch | Check form field `name` attributes match schema keys in `schemas.ts` |
| Audit log not writing | `audit_logs` table missing | Apply `supabase/add_audit_log.sql` migration |
| PDF won't open in iPhone Safari | Content-Disposition | Route sets `{ download: false }` in signed URL — ensure it stays |
| Admin role not working after grant | JWT not refreshed | User must sign out and back in |
| TypeScript error on DAL import in client | `server-only` guard | Move the import to a server component or action |
| Editor formulas don't render | MathJax chunk failed or config set too late | `mathjax-loader.ts` must set `window.MathJax` config **before** the dynamic import — check the console for chunk 404s / CSP violations |
| Editor field or formula shows `Err` | Circular reference or invalid expression | By design: the evaluator returns NaN on any parse/eval error and the resolver breaks cycles — fix the expression or reference in the field modal |
| PNG export fails / editor images missing in the PNG | Image not served same-origin | Editor images must load via `/api/editor-image/[imageId]` (streaming route) — any cross-origin URL taints the html2canvas canvas |
| „Als Dokument speichern" disabled | Draft never saved, or image upload in flight | Publishing requires a saved draft; saves (and thus publish) are blocked while uploads are pending |
| Draft content older than the published PNG | Pre-#40 behavior | No longer possible: publish persists the draft first (publish implies save, ExportBar → saveDraft) |
| Color in LaTeX shows an error box | Formula uses the legacy `\textcolor[HTML]{…}` syntax | MathJax v3 has no HTML color model — re-apply color via the toolbar (emits `\textcolor{#HEX}{…}` / `\colorbox{#HEX}{$…$}`) |
| Publish rejected: PNG too large | 2×-rendered PNG exceeds the 4 MB limit | The size guard offers a reduced 1× export; beyond that the document must be shortened or split (Vercel body ceiling — the limit cannot be raised) |
| Typed `[input:x]` stays plain text | Conversion is a 1-second interval sweep | Wait a second; if it still doesn't convert, check the placeholder syntax for typos |

## File Reference Guide

| What You Need | File(s) |
|---------------|---------|
| Auth flow | `src/actions/auth.ts`, `src/proxy.ts` |
| Admin create/update/delete logic | `src/actions/admin/*.ts` |
| All data read queries | `src/lib/dal.ts` |
| Input validation schemas | `src/lib/schemas.ts` |
| Audit logging | `src/lib/audit.ts` |
| Config / magic values | `src/lib/constants.ts` |
| TypeScript types + ActionResult | `src/types/index.ts` |
| Admin form components | `src/components/admin/{Kurs,Unit,Task,Document}Form.tsx` |
| Admin tree visualizer | `src/components/admin/AdminTree.tsx` |
| File proxy routes | `src/app/api/file/[docId]/route.ts`, `src/app/api/image/[imageId]/route.ts`, `src/app/api/editor-image/[imageId]/route.ts` |
| LaTeX editor core (controller + pure modules) | `src/lib/editor/*` |
| LaTeX editor UI (page, shell, toolbar, export, drafts) | `src/app/admin/editor/*`, `src/components/admin/editor/*` |
| Standalone reference editor (parity ground truth) | `latexEditor/*.html` |
| Error/loading boundaries | `src/app/**/error.tsx`, `src/app/**/loading.tsx` |

---

**Last Updated**: 2026-07-05 | **Version**: 4.3
