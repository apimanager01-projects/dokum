# Dokum — Developer Overview

## Project Purpose

**Dokum** is a web application that allows authenticated users to view and access published course materials (Kurse) organized as PDF documents and images. The app features an admin dashboard for content creators to build and manage the course hierarchy.

## Quick Facts

- **Status**: v4.0 (foundation refactor complete, production-ready)
- **Repository**: git (`master` branch is stable; feature work on separate branches)
- **Tech Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel-ready

## Architecture Overview

### Hierarchy Model

```
Kurs (Course)
  └── Unit
        └── Task
              └── Document (PDF | Image | Image Collection)
                    └── DocumentImage (for collections only)
```

**Key Rules:**
- Only `kurse` has a `published` boolean — child visibility is inherited via RLS
- All levels support `position` ordering (non-unique integers; ties broken by `created_at ASC`)
- Sorting is applied inside the DAL (`src/lib/dal.ts`) — no manual sorting in page components
- `ON DELETE CASCADE` at every foreign key level

### Authentication & Authorization

**User Roles:**
- **Regular User**: Authenticated via Supabase Auth (login/register). Can view published content.
- **Admin**: Role stored in `auth.users.raw_app_meta_data` as `{"role": "admin"}`. Can create, edit, and delete content.

**Access Control:**
- Middleware (`src/middleware.ts`) protects `/admin/*` routes and API proxy routes
- Admin pages do **not** duplicate the auth check — middleware is the single enforcement point
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
| `documents` | PDFs/images | `id`, `task_id` (FK), `title`, `description`, `file_path`, `file_type` (`pdf`\|`image`\|`image_collection`), `position`, `created_at` |
| `document_images` | Image collection items | `id`, `document_id` (FK CASCADE), `file_path`, `position`, `created_at` |
| `audit_logs` | Admin action log | `id`, `actor_id` (FK auth.users), `action` (`create`\|`update`\|`delete`), `entity_type`, `entity_id`, `entity_title`, `metadata` (JSONB), `created_at` |

### Row-Level Security (RLS)

| Table | Policy | Effect |
|-------|--------|--------|
| `profiles` | SELECT where `id = auth.uid()` | Users see only their own profile |
| `kurse` | SELECT where `published = TRUE` (auth); INSERT/UPDATE/DELETE where role = admin | Published courses visible to all; admins manage |
| `units/tasks/documents` | SELECT via subquery to `kurse.published`; INSERT/UPDATE/DELETE where role = admin | Inherit parent visibility; admin manage |
| `document_images` | SELECT via join to `kurse.published` + admin override; INSERT/DELETE where role = admin | Visibility inherited; admin manage |
| `storage.objects` (`pdfs` bucket) | INSERT/DELETE where bucket = `pdfs` and role = admin | Only admins upload files |
| `audit_logs` | SELECT/INSERT where role = admin; no UPDATE/DELETE | Immutable audit trail; admin-readable only |

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
│   │   └── documents/new/page.tsx # Create/edit Document
│   └── api/
│       ├── file/[docId]/route.ts      # Auth-gated file proxy (PDFs/images)
│       └── image/[imageId]/route.ts   # Auth-gated image collection proxy
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
│   │   └── AdminSubpageNav.tsx    # Tab navigation for admin subpages
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── kurse/
│   │   ├── KursCard.tsx
│   │   └── UnitCard.tsx
│   ├── documents/
│   │   └── DocumentCard.tsx
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
│   ├── supabase/
│   │   ├── server.ts              # Supabase SSR client (server/middleware)
│   │   └── client.ts              # Supabase browser client
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
├── middleware.ts                  # Request routing, auth enforcement, consent check
└── types/
    └── index.ts                   # TypeScript interfaces + ActionResult<T> union
```

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

Both routes verify:
1. User is authenticated
2. If not admin: the document's parent course is published (join query up to `kurse.published`)

Short-lived signed URLs (60s) are generated server-side and used for a single streaming fetch. Supabase URLs are never exposed to the browser.

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

### Database Migrations

Migrations live in `supabase/`. Apply them in order via the Supabase SQL editor or CLI:

| File | Description |
|------|-------------|
| `migration.sql` | Initial schema (all tables, RLS, storage policies) |
| `add_audit_log.sql` | Audit log table and policies |

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

Set `published = true/false` in the `kurse` table. All child items inherit visibility via RLS instantly.

## Debugging Tips

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Admin page accessible without being admin | Middleware not running | Check `src/middleware.ts` exists at `src/` root |
| File proxy returns 403 | Course not published | Set `kurse.published = true` for the parent course |
| Zod error on form submit | Field name mismatch | Check form field `name` attributes match schema keys in `schemas.ts` |
| Audit log not writing | `audit_logs` table missing | Apply `supabase/add_audit_log.sql` migration |
| PDF won't open in iPhone Safari | Content-Disposition | Route sets `{ download: false }` in signed URL — ensure it stays |
| Admin role not working after grant | JWT not refreshed | User must sign out and back in |
| TypeScript error on DAL import in client | `server-only` guard | Move the import to a server component or action |

## File Reference Guide

| What You Need | File(s) |
|---------------|---------|
| Auth flow | `src/actions/auth.ts`, `src/middleware.ts` |
| Admin create/update/delete logic | `src/actions/admin/*.ts` |
| All data read queries | `src/lib/dal.ts` |
| Input validation schemas | `src/lib/schemas.ts` |
| Audit logging | `src/lib/audit.ts` |
| Config / magic values | `src/lib/constants.ts` |
| TypeScript types + ActionResult | `src/types/index.ts` |
| Admin form components | `src/components/admin/{Kurs,Unit,Task,Document}Form.tsx` |
| Admin tree visualizer | `src/components/admin/AdminTree.tsx` |
| File proxy routes | `src/app/api/file/[docId]/route.ts`, `src/app/api/image/[imageId]/route.ts` |
| Error/loading boundaries | `src/app/**/error.tsx`, `src/app/**/loading.tsx` |

---

**Last Updated**: 2026-05-03 | **Version**: 4.0
