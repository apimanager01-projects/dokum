import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDocumentWithAncestry } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import { DocumentBody } from '@/components/documents/DocumentBody'
import type { DocumentWithAncestry } from '@/types'

interface Props {
  params: Promise<{ docId: string }>
}

// The page and its metadata need the same row; `cache` collapses that into one
// query per request. It lives here rather than in the DAL because it is this
// page↔metadata pair that reads twice, not the query itself.
const loadDocument = cache(getDocumentWithAncestry)

/**
 * The one app-level access rule of this route: an archived (unpublished) Kurs
 * is dark to everyone but an admin. Entitlement is not checked here — RLS
 * already refused the row to anyone without one — and `published` is, because
 * the document policies deliberately dropped that subquery.
 */
function isReadable(view: DocumentWithAncestry, isAdmin: boolean): boolean {
  return isAdmin || view.kurs.published
}

/**
 * The addressable full-page view of a single Dokument (#69) — what a pasted,
 * bookmarked or shared URL opens.
 *
 * ACCESS IS ENFORCED BY THE EXISTING RULES AND NO NEW ONE. The entitlement
 * check is RLS's: `documents` SELECT already requires a purchase for the
 * owning Unit (or admin), so an unentitled visitor's query returns nothing
 * here just as it does everywhere else. On top of that the parent Kurs's
 * `published` flag is re-checked in app code with an admin bypass, exactly as
 * /api/file does — that re-check is what actually makes an archived Kurs dark,
 * since the document policies deliberately dropped the `published` subquery.
 *
 * Every failure — unknown id, no entitlement, archived Kurs — lands on the
 * same 404. Distinguishing them here would leak which documents exist to
 * someone who cannot read them; telling a student "this is in Einheit 3,
 * unlock it" is a separate, deliberately server-side surface (#74).
 */
export default async function DocumentPage({ params }: Props) {
  const { docId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // The proxy already redirects unauthenticated visitors to the login page;
  // guard defensively in case the matcher is ever loosened.
  if (!user) notFound()

  const isAdmin = user.app_metadata?.['role'] === 'admin'
  const view = await loadDocument(docId)
  if (!view || !isReadable(view, isAdmin)) notFound()

  const { document, task, unit, kurs } = view
  const watermarkId = user.id.slice(0, 8).toUpperCase()
  // Back into the hierarchy at the task this document sits in — the Unit
  // page's existing deep-link parameter opens that accordion section.
  const backHref = `/kurse/${kurs.id}/units/${unit.id}?openTask=${task.id}`

  return (
    <div
      className="-mx-4 border-t border-gray-200 bg-[#fffdf8] sm:-mx-8"
      style={{ minHeight: 'calc(100svh - 66px)' }}
    >
      <div className="mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16">
        <Link
          href={backHref}
          className="mb-8 inline-block text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← {unit.title}
        </Link>
        {/* Someone arriving from a bookmark or a classmate's link has no
            history behind them, so the document says where it lives. */}
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {kurs.title} · {unit.title} · {task.title}
        </p>
        <h1 className="mt-1 text-4xl font-black tracking-[0] text-black">{document.title}</h1>
        {document.description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
            {document.description}
          </p>
        )}
        <div className="mt-6">
          <DocumentBody doc={document} watermarkId={watermarkId} />
        </div>
      </div>
    </div>
  )
}

// A bookmark is only useful if it carries the document's name. It falls back
// to the layout's title whenever the page itself would 404 — metadata must not
// become a way to learn a title the page refuses to show.
//
// The same rule as the page, evaluated as though the reader were NOT an admin:
// resolving the role here would cost an auth round-trip on every load, and all
// that rides on it is an admin's tab title for an archived document.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docId } = await params
  const view = await loadDocument(docId)
  if (!view || !isReadable(view, false)) return {}
  return { title: `${view.document.title} – Dokum` }
}
