# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Primary reference

[DEVELOPER_OVERVIEW.md](DEVELOPER_OVERVIEW.md) is the authoritative architecture doc — schema, RLS policies, full file map, debugging table. Read it before any non-trivial change. Keep it in sync when patterns shift.

## Commands

```bash
npm run dev      # Next.js dev server (Turbopack) on :3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (eslint-config-next 16)
npm test         # Vitest (dev-only) — colocated *.test.ts unit tests
```

Tests run via Vitest ([vitest.config.ts](vitest.config.ts)): colocated `*.test.ts` files next to their modules, currently the editor modules in [src/lib/editor/](src/lib/editor/). Default environment is plain Node; DOM-dependent suites opt into jsdom per file via a `@vitest-environment jsdom` docblock (currently `document-json.test.ts`). The editor-module tests are golden cases derived from the standalone reference editor ([latexEditor/](latexEditor/)) and act as the port's parity contract — don't "fix" expected values without checking the reference behavior.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind 4 · Supabase (Postgres + Auth + Storage) · Zod for input validation. The UI is German.

## Architecture invariants

These are load-bearing and easy to violate accidentally:

- **Hierarchy:** `Kurs → Unit → Task → Document → DocumentImage`. Only `kurse.published` exists — don't add a `published` column anywhere else. But visibility is **split, not inherited all the way down**: `kurse` and `units` gate on `published`; `tasks`, `documents`, `document_images` and the `pdfs` storage objects gate on an **`entitlements` row alone** (or admin), because [add_entitlements.sql](supabase/add_entitlements.sql) dropped the `published` subquery from those four policies. What actually makes an unpublished Kurs dark is that [/api/file](src/app/api/file/[docId]/route.ts) and [/api/image](src/app/api/image/[imageId]/route.ts) re-check `kurse.published` in app code — at the DB level those child rows stay readable to an entitled user.
- **DAL is the only read path.** All Supabase reads go through [src/lib/dal.ts](src/lib/dal.ts), which is `import 'server-only'` — importing it from a client component is a build error. Page components and API routes must not call `supabase.from()` directly. Sorting (`position ASC, created_at ASC`) lives inside the DAL; don't re-sort in pages.
- **Proxy is the single auth enforcement point.** [src/proxy.ts](src/proxy.ts) (Next.js 16 renamed the `middleware` convention to `proxy`) protects `/admin/*`, redirects unauthenticated users, and enforces consent. Admin pages must not duplicate the role check. Server actions still call `getAdminUser()` from [src/actions/admin/_shared.ts](src/actions/admin/_shared.ts) as defence in depth.
- **Admin role lives in the JWT** as `auth.users.raw_app_meta_data.role = "admin"`. Read it via `user.app_metadata?.role`. Never query a role table.
- **Server actions return `ActionResult<T>`** — the discriminated union `{ ok: true; data: T } | { ok: false; error: string }` from [src/types/index.ts](src/types/index.ts). Don't introduce ad-hoc `{ error?, success? }` shapes.
- **All server-action input flows through Zod** ([src/lib/schemas.ts](src/lib/schemas.ts)) before touching the DB. Form field `name` attributes must match schema keys exactly.
- **Audit log every admin mutation.** After the primary DB op succeeds, call `logAdminAction()` from [src/lib/audit.ts](src/lib/audit.ts). Failures are logged but never block. The `audit_logs` table is admin-readable and immutable (no UPDATE/DELETE policy).
- **Files are never served directly from Supabase.** Storage bucket `pdfs` is private; access goes through [src/app/api/file/[docId]/route.ts](src/app/api/file/[docId]/route.ts) and [src/app/api/image/[imageId]/route.ts](src/app/api/image/[imageId]/route.ts) (60-second signed URLs generated server-side, exposed only as a single 302 redirect) and [src/app/api/editor-image/[imageId]/route.ts](src/app/api/editor-image/[imageId]/route.ts), which instead **streams** the body so editor images stay same-origin (html2canvas export must not taint the canvas). Never store Supabase URLs in content or hand them to the browser beyond that one redirect.
- **Revalidate after every admin mutation.** Use `revalidateAdminPages()` from `_shared.ts` — it busts all four admin pages plus the root layout. Skipping this leaves stale tree views.
- **Body size limit is duplicated and must stay in sync.** `MAX_FILE_SIZE_BYTES` in [src/lib/constants.ts](src/lib/constants.ts) and `experimental.serverActions.bodySizeLimit` in [next.config.ts](next.config.ts) both say 4 MB. Change both together.
- **CSP is set in [next.config.ts](next.config.ts).** Adding external scripts/styles/fonts/images requires updating `connect-src`/`script-src`/etc. there.
- **The LaTeX editor's surface is imperative.** `/admin/editor` mounts [src/lib/editor/controller.ts](src/lib/editor/controller.ts) once into a contenteditable container; React must never reconcile inside it (it would destroy the cursor and user-typed DOM). Editor drafts (`editor_documents`/`editor_images`) live outside the Kurs hierarchy until published; draft JSON stores image **ids**, never base64. Expressions run through the pure evaluator — no `eval`/`new Function` — and MathJax/html2canvas are bundled exact-pinned (the CSP forbids CDNs and eval).

## Adding an admin action

1. Add the Zod schema to [src/lib/schemas.ts](src/lib/schemas.ts).
2. Implement the action in the matching `src/actions/admin/{kurse,units,tasks,documents,editor-documents,editor-images,editor-publish}.ts` file. Start with `const { supabase, user } = await getAdminUser()`.
3. Validate FormData via `parseForm(schema, formData, [...fields])`.
4. Call `logAdminAction(...)` after the primary op succeeds.
5. Call `revalidateAdminPages()` (or a narrower `revalidatePath`) before returning.
6. Re-export from [src/actions/admin/index.ts](src/actions/admin/index.ts) if it's a new public action.

## Two Supabase projects (dev + prod)

There are **two separate Supabase projects**, not one project with branches:

| Env | Project ref | Used by | `NEXT_PUBLIC_APP_ENV` |
|-----|-------------|---------|------------------------|
| Dev  | `elnupcpwhvfbmbpcbwrc` | `npm run dev` (reads [.env.local](.env.local)) | `dev` |
| Prod | `pnooldcnqlsqjatbtimz` | `npm run build` / `start` (reads [.env.production.local](.env.production.local)) | `prod` |

The dev project is a free playground — break it freely. The prod project has real users and content.

## Database changes

Migrations are plain SQL in [supabase/](supabase/) — apply via the Supabase SQL editor or CLI. Order matters: `migration.sql`, then `add_audit_log.sql`, then `add_entitlements.sql`, then `add_editor_documents.sql`, then `add_editor_images.sql`. There is no migration runner; new migrations must be applied manually.

**Workflow for a new migration:** apply to **dev first** via `mcp__supabase__apply_migration`, verify with `get_advisors` and a quick read, then have the user apply the same migration to prod manually (MCP cannot reach prod — see below).

## Supabase MCP

A Supabase MCP server is configured (`mcp__supabase__*` tools — see [.mcp.json](.mcp.json)) and is **pinned to the dev project only** via `--project-ref=elnupcpwhvfbmbpcbwrc`. Prod is intentionally unreachable through MCP; any prod change must be made by the user via the Supabase dashboard or CLI. Auth uses `SUPABASE_ACCESS_TOKEN` from the environment.

Use the MCP to inspect and modify the dev project instead of asking the user to run SQL by hand: `list_tables`, `execute_sql`, `apply_migration`, `list_migrations`, `get_advisors`, `generate_typescript_types`, `get_logs`, plus edge function and branch management.

- Prefer `apply_migration` over `execute_sql` for schema changes so the change is tracked.
- Run `get_advisors` after schema changes to catch missing RLS or index issues.
- After schema changes, regenerate types with `generate_typescript_types` and update [src/types/index.ts](src/types/index.ts) if the shape changed.

## Agent skills

### Issue tracker

GitHub Issues on `apimanager01-projects/dokum`, via the `gh` CLI. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

### Triage labels

The five canonical labels, unchanged. See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context — `CONTEXT.md` + `docs/adr/` at the repo root, created lazily. See [docs/agents/domain.md](docs/agents/domain.md).
