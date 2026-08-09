import type { DocumentWithAncestry } from '@/types'

/**
 * May this reader see this Dokument? Pure and free of `server-only` so it can
 * be tested directly; the loading half lives in `document-surface.ts`.
 *
 * THIS IS THE WHOLE APP-LEVEL RULE AND IT ADDS NO NEW WAY TO READ CONTENT.
 * Entitlement is RLS's job — `documents` SELECT already requires a purchase
 * for the owning Unit (or admin), so an unentitled reader's query returns
 * nothing and arrives here as `null`. What RLS deliberately does NOT check is
 * the parent Kurs's `published` flag: `add_entitlements.sql` dropped that
 * subquery from the document policies, which is why every app-code reader of a
 * document — /api/file, /api/image and now both student surfaces — re-checks
 * it with an admin bypass. That re-check is the only thing that makes an
 * archived Kurs dark.
 *
 * The view is nullable on purpose. Unknown id, no entitlement and archived
 * Kurs must be indistinguishable to the reader, so they collapse into one
 * `false` here rather than into three branches at two call sites.
 */
export function isDocumentReadable(
  view: DocumentWithAncestry | null,
  isAdmin: boolean
): view is DocumentWithAncestry {
  if (!view) return false
  return isAdmin || view.kurs.published
}
