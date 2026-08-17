import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DocumentArticle } from '@/components/documents/DocumentArticle'
import { loadDocumentSurface } from '@/lib/document-surface'

interface Props {
  params: Promise<{ docId: string }>
}

/**
 * The addressable full-page view of a single Dokument (#69) — what a pasted,
 * bookmarked or shared URL opens, and what a reload of an overlaid document
 * falls back to (#70).
 *
 * ACCESS IS ENFORCED BY THE EXISTING RULES AND NO NEW ONE — see
 * `loadDocumentSurface`, which both this page and the overlay read through so
 * neither can become the laxer of the two.
 *
 * Every failure — unknown id, no entitlement, archived Kurs — lands on the
 * same 404. Distinguishing them here would leak which documents exist to
 * someone who cannot read them; telling a student "this is in Einheit 3,
 * unlock it" is a separate, deliberately server-side surface (#74).
 */
export default async function DocumentPage({ params }: Props) {
  const { docId } = await params

  const surface = await loadDocumentSurface(docId)
  if (!surface) notFound()

  const { unit, kurs, task } = surface.view
  // Back into the hierarchy at the task this document sits in — the Unit
  // page's existing deep-link parameter opens that accordion section.
  const backHref = `/kurse/${kurs.id}/units/${unit.id}?openTask=${task.id}`

  return (
    /*
     * THE PAPER IS THE PAGE — THERE IS NO SHEET (#124).
     *
     * Nothing here paints a background, so `body`'s grained ground (#116) runs
     * straight under the prose and the document is written ON the paper rather
     * than laid on top of it. Which also disposes of #120's „white slab on
     * paper" by removing the slab: the only sheets left in a document are the
     * blocks a machine made, and those are `.formula-block` / `.image-block`.
     *
     * It satisfies #123's container rule as a side effect. That rule asks the
     * live document and the PNG fallback to be children of ONE ground-painting
     * element so the transparent picture cannot start a fresh grain tile at its
     * own edge — here that element is `body`, and both are inside it.
     *
     * Width is `--dokum-page` (#119) — the same 1024 the navbar's inner
     * container still has to collapse to; the measure inside is `70ch` and
     * lives in `interactive-document.css`.
     */
    <div className="py-12">
      <div className="mx-auto max-w-[var(--dokum-page)] px-[var(--dokum-gutter)]">
        <Link
          href={backHref}
          className="mb-8 inline-block text-[length:var(--dokum-text-ui)] font-medium text-ink-muted hover:text-ink"
        >
          ← {unit.title}
        </Link>
        <DocumentArticle view={surface.view} watermarkId={surface.watermarkId} />
      </div>
    </div>
  )
}

// A bookmark is only useful if it carries the document's name. It falls back
// to the layout's title whenever the page itself would 404 — metadata must not
// become a way to learn a title the page refuses to show.
//
// #69 evaluated that rule as though the reader were never an admin, to avoid
// an auth round-trip here. Sharing the loader with the page removes the reason:
// it is `cache`d per request, so the auth call and the query happen once for
// both. The visible consequence is that an admin now gets the real tab title
// for a document in an ARCHIVED Kurs, matching the page they are looking at
// instead of contradicting it.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docId } = await params
  const surface = await loadDocumentSurface(docId)
  if (!surface) return {}
  return { title: `${surface.view.document.title} – Dokum` }
}
