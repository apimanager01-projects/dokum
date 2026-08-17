import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DocumentArticle } from '@/components/documents/DocumentArticle'
import { PrototypeSwitcher } from '@/components/documents/PrototypeSwitcher'
import { normaliseVariant } from '@/components/documents/prototype-124-variants'
import { loadDocumentSurface } from '@/lib/document-surface'
import '@/components/documents/prototype-124-variants.css'

interface Props {
  params: Promise<{ docId: string }>
  /* PROTOTYPE — #124. THROWAWAY, along with everything `proto` below. */
  searchParams: Promise<Record<string, string | string[] | undefined>>
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
export default async function DocumentPage({ params, searchParams }: Props) {
  const { docId } = await params
  const variant = normaliseVariant((await searchParams)['variant'])

  const surface = await loadDocumentSurface(docId)
  if (!surface) notFound()

  const { unit, kurs, task } = surface.view
  // Back into the hierarchy at the task this document sits in — the Unit
  // page's existing deep-link parameter opens that accordion section.
  const backHref = `/kurse/${kurs.id}/units/${unit.id}?openTask=${task.id}`

  return (
    /* PROTOTYPE GEOMETRY. The sheet's width, inset, radius and whether it is a
       sheet at all is #124's open question 4, so the shape lives in the variant
       stylesheet rather than in classes here. The winner comes back as real
       Tailwind on this element. */
    <div className="proto-124" data-proto={variant}>
      <div className="proto-sheet">
        <Link href={backHref} className="proto-back">
          ← {unit.title}
        </Link>
        <DocumentArticle view={surface.view} watermarkId={surface.watermarkId} />
      </div>
      <PrototypeSwitcher current={variant} />
    </div>
  )
}

// A bookmark is only useful if it carries the document's name. It falls back
// to the layout's title whenever the page itself would 404 — metadata must not
// become a way to learn a title the page refuses to show.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docId } = await params
  const surface = await loadDocumentSurface(docId)
  if (!surface) return {}
  return { title: `${surface.view.document.title} – Dokum` }
}
