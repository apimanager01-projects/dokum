# Dokum — Developer Overview

## Project Purpose

**Dokum** is a web application that allows authenticated users to view and access published course materials (Kurse) organized as PDF documents and images. The app features an admin dashboard for content creators to build and manage the course hierarchy.

## Quick Facts

- **Status**: v3.5 (stable, in production)
- **Repository**: git (on `master` branch)
- **Tech Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Ready for Vercel

## Architecture Overview

### Hierarchy Model

```
Kurs (Course)
  ├── Unit
  │   ├── Task
  │   │   ├── Document (PDF/Image/Image Collection)
  │   │   │   └── DocumentImage (for collections)
```

**Key Rules:**
- Only `kurse` has a `published` boolean flag
- Child items inherit visibility via RLS (Row-Level Security) subqueries
- All levels support `position` ordering (non-unique integers; ties broken by `created_at ASC`)
- `ON DELETE CASCADE` at every foreign key level

### Authentication & Authorization

**User Roles:**
- **Regular User**: Authenticated via Supabase Auth (login/register). Can view published content.
- **Admin**: Role stored in `auth.users.raw_app_meta_data` as `{"role": "admin"}`. Can create/manage content.

**Access Control:**
- Middleware (`src/middleware.ts`) protects `/admin/*` routes — redirects non-admins to `/`
- Each admin page performs a server-side role check (belt-and-suspenders approach)
- JWT includes role automatically — no extra DB queries needed
- Role grants: `UPDATE auth.users SET raw_app_meta_data = ... WHERE email = '...'` (user must sign out/in to refresh JWT)

### Database Schema

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `profiles` | User metadata | `id` (auth.uid), `email`, `full_name`, `created_at` |
| `kurse` | Courses | `id`, `title`, `description`, **`published`**, `position`, `created_at` |
| `units` | Course sections | `id`, `kurs_id` (FK), `title`, `description`, `position`, `created_at` |
| `tasks` | Unit assignments | `id`, `unit_id` (FK), `title`, `description`, `position`, `created_at` |
| `documents` | PDFs/images | `id`, `task_id` (FK), `title`, `description`, `file_path`, `file_type` ('pdf'\|'image'\|'image_collection'), `position`, `created_at` |
| `document_images` | Image collection items | `id`, `document_id` (FK CASCADE), `file_path`, `position`, `created_at` |

### Row-Level Security (RLS)

| Table | Policy | Effect |
|-------|--------|--------|
| `profiles` | SELECT where `id = auth.uid()` | Users can only see their own profile |
| `kurse` | SELECT where `published = TRUE` (auth); INSERT where role = admin | Published courses visible to all; admins can create |
| `units/tasks/documents` | SELECT via subquery to `kurse.published`; INSERT where role = admin | Inherit parent visibility; admin create |
| `document_images` | SELECT via join to `kurse.published` + admin override; INSERT/DELETE where role = admin | Visibility inherited; admin manage |
| `storage.objects` (pdfs bucket) | INSERT/DELETE where bucket = 'pdfs' and role = admin | Only admins upload files |

## Project Structure

```
src/
├── actions/                    # Server Actions (async server-side logic)
│   ├── admin.ts               # createKurs, createUnit, createTask, createDocument
│   └── auth.ts                # signIn, signUp, signOut
├── app/                        # Next.js App Router pages
│   ├── page.tsx               # Home: lists published Kurse
│   ├── layout.tsx             # Root layout (Navbar, Footer)
│   ├── auth/
│   │   ├── login/page.tsx     # Login form
│   │   ├── register/page.tsx  # Register form
│   │   └── callback/route.ts  # Supabase auth callback
│   ├── consent/               # Cookie/consent management
│   ├── datenschutz/           # Privacy policy
│   ├── impressum/             # Legal info
│   ├── kurse/
│   │   └── [kursId]/          # Kurs detail view (tree of units/tasks/documents)
│   │       └── tasks/[taskId]/ # Task detail (deprecated, not linked in UI)
│   │       └── units/[unitId]/ # Unit detail
│   ├── admin/                  # Admin dashboard
│   │   ├── page.tsx           # Admin hub (4-card grid)
│   │   ├── kurse/new/         # Create Kurs
│   │   ├── units/new/         # Create Unit
│   │   ├── tasks/new/         # Create Task
│   │   └── documents/new/     # Create Document
│   └── api/
│       ├── file/[docId]/route.ts   # Auth-gated file proxy (PDFs/images)
│       └── image/[imageId]/route.ts # Image collection proxy
├── components/
│   ├── admin/                  # Admin UI components
│   │   ├── Add{Kurs,Unit,Task,Document}Form.tsx  # Form components
│   │   ├── New{Unit,Task,Document}PageClient.tsx # Client wrappers (state + layout)
│   │   ├── AdminTree.tsx       # Generic tree visualizer
│   │   └── AdminSubpageNav.tsx # Tab navigation for admin subpages
│   ├── auth/                   # Login/Register forms
│   ├── kurse/                  # Kurs/Unit card components
│   ├── documents/              # Document card component
│   ├── consent/                # Cookie consent UI
│   ├── datenschutz/            # Privacy-related components
│   ├── KursDetailClient.tsx    # Kurs detail page (client-side tree + PDF links)
│   ├── UnitDetailClient.tsx    # Unit detail page
│   ├── ShareButton.tsx         # Document share functionality
│   └── layout/
│       ├── Navbar.tsx          # Header with auth status
│       └── Footer.tsx          # Footer with legal links
├── lib/
│   ├── supabase/
│   │   ├── server.ts           # Supabase SSR client (for middleware & server actions)
│   │   └── client.ts           # Supabase browser client
│   └── utils.ts                # Helper utilities
├── middleware.ts               # Request routing & auth checks
└── types/
    └── index.ts                # TypeScript interfaces
```

## Key Patterns

### Admin Subpage Layout Pattern

Each admin creation page (`/admin/{kurse,units,tasks,documents}/new`) follows a **70/30 two-column grid**:

```
┌─────────────────────────────────────────────────────┐
│ AdminSubpageNav (back link + tab buttons)           │
├──────────────────┬──────────────────────────────────┤
│   Form (70%)     │   Tree View (30%)                │
│                  │   • Shows current selection      │
│                  │   • Auto-updates on creation     │
│                  │   • Highlights selected parent   │
└──────────────────┴──────────────────────────────────┘
```

**Implementation:**
1. Server page fetches full nested hierarchy and passes to a **client wrapper** component
2. Client wrapper holds `selectedId` state
3. Form component accepts optional `on{X}Change` callback
4. Tree component shows current selection and updates reactively

**Post-Creation Flow:**
- Success box displays "← Zurück" (back) + "X hinzufügen →" (add next) buttons
- Navigation uses search params (`?kursId=`, `?unitId=`, `?taskId=`) to pre-select parent

### File Serving Pattern

**PDFs and images are served through authenticated proxies:**

1. **Storage**: Files stored in private Supabase Storage bucket `pdfs`
2. **API Routes**:
   - `GET /api/file/[docId]` → proxies PDFs/images
   - `GET /api/image/[imageId]` → proxies image collection items
3. **Security**:
   - Middleware blocks unauthenticated requests before route handler
   - Server generates short-lived (60s) signed URLs
   - Supabase URLs never exposed to browser
   - Address bar always shows `/api/file/[docId]`
   - `Content-Disposition: inline` for iPhone Safari compatibility

### Server Actions

Located in `src/actions/admin.ts` and `src/actions/auth.ts`:

- **Auth**: `signIn()`, `signUp()`, `signOut()`
- **Admin**: `createKurs()`, `createUnit()`, `createTask()`, `createDocument()`
- Use Supabase server client for secure database operations
- Return errors as serializable objects (for client feedback)

## Pages & Routes

### Public Routes

| Route | Purpose | Component |
|-------|---------|-----------|
| `/` | Home: grid of published Kurse | `src/app/page.tsx` |
| `/kurse/[kursId]` | Kurs detail: units/tasks/documents tree | `src/app/kurse/[kursId]/page.tsx` |
| `/kurse/[kursId]/units/[unitId]` | Unit detail | `src/app/kurse/[kursId]/units/[unitId]/page.tsx` |
| `/kurse/[kursId]/tasks/[taskId]` | Task detail (deprecated) | `src/app/kurse/[kursId]/tasks/[taskId]/page.tsx` |
| `/auth/login` | Login form | `src/app/auth/login/page.tsx` |
| `/auth/register` | Register form | `src/app/auth/register/page.tsx` |
| `/impressum` | Legal info | `src/app/impressum/page.tsx` |
| `/datenschutz` | Privacy policy | `src/app/datenschutz/page.tsx` |
| `/consent` | Cookie/consent management | `src/app/consent/page.tsx` |

### Protected Routes (Admin Only)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard (4-card hub) |
| `/admin/kurse/new` | Create Kurs |
| `/admin/units/new` | Create Unit |
| `/admin/tasks/new` | Create Task |
| `/admin/documents/new` | Create Document |

## Dependencies

### Key Libraries

- **Next.js 16**: Framework with App Router, Turbopack for fast builds
- **React 19**: Latest React with Server Components
- **TypeScript 5**: Type safety
- **Tailwind CSS 4**: Utility-first CSS
- **@supabase/ssr**: Supabase integration (Auth + Database + Storage)
- **yet-another-react-lightbox**: Image gallery/lightbox (for image collections)
- **clsx**: Conditional className utility
- **tailwind-merge**: Merge Tailwind classes safely

### Configuration

- **Server Actions Body Limit**: 10 MB (configured in `next.config.ts`)
- **Supabase Environment**: `.env.local` (project URL + anon key required)

## Running Locally

### Prerequisites

- Node.js 18+
- Supabase project (Auth + PostgreSQL + Storage bucket named `pdfs`)

### Setup

```bash
# Install dependencies
npm install

# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Run dev server
npm run dev
```

Visit `http://localhost:3000`

### Build & Start

```bash
npm run build
npm start
```

## Common Tasks

### Grant Admin Access

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```

**Important**: User must sign out and back in for the role change to take effect (JWT refresh).

### Upload a Test PDF

1. Log in as admin
2. Navigate to `/admin` → create Kurs → create Unit → create Task → create Document
3. Select a PDF file (max 10 MB via Server Action, or use Storage bucket directly)
4. Return to Kurs page to see the document in the tree

### Enable/Disable a Kurs

Edit the `kurse` table in Supabase and set `published = true/false`. Visibility is inherited by all children via RLS.

## Important Technical Notes

### Next.js + src/ Directory
- `middleware.ts` **must** be at `src/middleware.ts` (not project root)
- If middleware logs nothing, check its file location

### Supabase
- Store only **file paths** in the database (not signed URLs) — generate signed URLs server-side each page load
- Middleware uses `request.cookies` (not `cookies()` from `next/headers`) for SSR client
- Nested selects don't support `.order()` on child relations — sort in JavaScript after fetch
- **Vercel body limit**: Request bodies capped at 4.5 MB — large file uploads use direct Supabase Storage upload instead

### PDF Delivery
- Route handler generates signed URL, fetches PDF, streams response
- `Content-Disposition: inline` is critical for iPhone Safari (otherwise forces download)
- Forward `Content-Length` header for browser progress bar

## Roadmap / Future Features

- Embedded PDF viewer (react-pdf integration instead of new-tab link)
- Admin edit/delete/unpublish functionality
- Document cover images (per Kurs/Unit/Task)
- Batch operations

## Debugging Tips

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Middleware not running | File location | Check `src/middleware.ts` exists |
| TypeScript errors on `next/navigation` | Incomplete build | `rm -rf node_modules/next && npm install next` |
| PDF won't open in iPhone Safari | Content-Disposition header | Ensure route sets `{ download: false }` in signedUrl options |
| Admin page shows "Not authorized" | JWT not refreshed | User must sign out and back in after role grant |
| "413 Payload Too Large" on document upload | Body too large | Use direct Supabase Storage upload for >4.5 MB files |
| Nested data not sorted | Supabase limitation | Sort manually in JavaScript after fetch |

## File Reference Guide

| What You Need | File(s) |
|---------------|---------|
| User authentication flow | `src/actions/auth.ts`, `src/middleware.ts` |
| Admin creation logic | `src/actions/admin.ts` |
| Database queries | `src/lib/supabase/server.ts` (server), `src/lib/supabase/client.ts` (browser) |
| Form components | `src/components/admin/Add*Form.tsx` |
| Tree visualization | `src/components/admin/AdminTree.tsx` |
| Kurs display | `src/app/page.tsx`, `src/app/kurse/[kursId]/page.tsx` |
| PDF proxy | `src/app/api/file/[docId]/route.ts` |
| Data types | `src/types/index.ts` |
| Styling (Tailwind) | All components use utility classes (no CSS files) |

---

**Last Updated**: 2026-03-26 | **Version**: 3.5
