import Link from 'next/link'
import type { DocumentWithAncestry } from '@/types'
import { DocumentBody } from './DocumentBody'

/**
 * One Dokument at page scale — where it lives, what it is called, and its
 * body — for both surfaces that show a document whole: the addressable full
 * page (#69) and the intercepted overlay (#70).
 *
 * The pair below `DocumentBody`: that component owns "which render path does
 * this file_type take", this one owns "what surrounds it at page scale".
 *
 * The breadcrumb is not decoration. Someone arriving from a bookmark or a
 * classmate's link has no history behind them, and someone reading the overlay
 * has lost sight of the page underneath, so the document says where it lives
 * in both cases.
 */
export function DocumentArticle({
  view,
  watermarkId,
  titleId,
  linkAncestors = true,
}: {
  view: DocumentWithAncestry
  watermarkId: string
  /** Set by the overlay, which labels its dialog with the document's title. */
  titleId?: string
  /**
   * Whether the breadcrumb's ancestors are links — TRUE ON THE STANDALONE PAGE,
   * FALSE IN THE OVERLAY (#119, applied by #124).
   *
   * The research asks for linked ancestors so a reader can climb out of a
   * document they arrived at cold. #119 then made the overlay a centred sheet
   * with the source page visible above and below — which DISSOLVES the reason
   * here rather than trading it away: the page the student came from is on
   * screen, so the overlay's ancestors would be links out of a document that is
   * deliberately sitting on top of the very context they lead to, and following
   * one would discard everything typed into it (#70).
   */
  linkAncestors?: boolean
}) {
  const { document, task, unit, kurs } = view
  const unitHref = `/kurse/${kurs.id}/units/${unit.id}`

  const crumbs: { key: string; label: string; href: string }[] = [
    { key: 'kurs', label: kurs.title, href: `/kurse/${kurs.id}` },
    { key: 'unit', label: unit.title, href: unitHref },
    { key: 'task', label: task.title, href: `${unitHref}?openTask=${task.id}` },
  ]

  return (
    <article>
      <p className="text-[length:var(--dokum-text-micro)] font-medium uppercase leading-[var(--dokum-leading-micro)] tracking-wide text-ink-muted">
        {crumbs.map((crumb, i) => (
          <span key={crumb.key}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            {linkAncestors ? (
              <Link href={crumb.href} className="underline-offset-2 hover:underline">
                {crumb.label}
              </Link>
            ) : (
              crumb.label
            )}
          </span>
        ))}
      </p>
      <h1
        id={titleId}
        className="mt-2 text-[length:var(--dokum-text-display)] font-bold leading-[var(--dokum-leading-display)] tracking-[var(--dokum-track-display)] text-ink"
      >
        {document.title}
      </h1>
      {document.description && (
        <p className="mt-3 max-w-[var(--dokum-measure-short)] text-[length:var(--dokum-text-ui)] leading-[var(--dokum-leading-ui)] text-ink-muted">
          {document.description}
        </p>
      )}
      <div className="mt-6">
        <DocumentBody doc={document} watermarkId={watermarkId} />
      </div>
    </article>
  )
}

/**
 * The same three bars in the same three places, for whichever surface is
 * waiting on the document: the full page's `loading.tsx` adds its back link
 * above this, the overlay renders it inside the dialog it has already opened.
 */
export function DocumentArticleSkeleton() {
  return (
    <>
      <div className="h-3 w-56 animate-pulse rounded bg-hairline/50" />
      <div className="mt-2 h-9 w-80 max-w-full animate-pulse rounded-md bg-hairline/50" />
      <div className="mt-8 h-64 animate-pulse rounded-md bg-hairline/50" />
    </>
  )
}
