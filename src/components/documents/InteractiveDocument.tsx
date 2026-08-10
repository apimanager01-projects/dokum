'use client'

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { anchoredBlocks } from '@/lib/editor/anchors'
import { renderDocumentJson } from '@/lib/editor/document-render'
import { readDocumentJson } from '@/lib/editor/document-version'
import { loadMathJax } from '@/lib/editor/mathjax-loader'
import { linkHref, linkOpensOverlay } from '@/lib/link-navigation'
import { DocumentPng } from './DocumentPng'
import { Watermark } from './Watermark'
import './interactive-document.css'

/**
 * A published interactive document, rendered live for students (#67) and
 * editable where the author put an input (#68).
 *
 * React mounts the host and never reconciles inside it — the renderer owns
 * that DOM, including the student's controls and everything a keystroke
 * re-resolves. This component's remaining job is the browser half: typesetting
 * the formulas the renderer reports as changed.
 *
 * The PNG is a REAL PER-DOCUMENT RUNTIME FALLBACK, not a feature flag. If this
 * document cannot be rendered — a snapshot newer than this build, a failed
 * upgrade, an unrecognised node — the student gets the stored picture and the
 * failure is logged. What must never happen is a PARTIAL render: silently
 * dropping a node means someone who paid for this material misses a whole
 * section with no indication that anything is missing.
 *
 * There are three ways rendering can fail and all three land on the picture:
 * the read boundary refusing the snapshot, `renderDocumentJson` throwing, and
 * a render-phase error anywhere below — which is why the class boundary
 * exists as well as the try/catch (an error thrown inside an effect never
 * reaches an error boundary on its own).
 *
 * MathJax is the one failure that does NOT fall back: a formula that cannot
 * be typeset keeps its LaTeX source visible and the rest of the document
 * stays readable, which is strictly better than replacing a whole readable
 * document with a picture over one bad formula.
 */
export function InteractiveDocument({
  docId,
  title,
  content,
  watermarkId,
}: {
  docId: string
  title: string
  content: unknown
  watermarkId: string
}) {
  const fallback = <DocumentPng docId={docId} title={title} watermarkId={watermarkId} />
  return (
    <DocumentRenderBoundary docId={docId} fallback={fallback}>
      <LiveDocument docId={docId} content={content} watermarkId={watermarkId} fallback={fallback} />
    </DocumentRenderBoundary>
  )
}

function LiveDocument({
  docId,
  content,
  watermarkId,
  fallback,
}: {
  docId: string
  content: unknown
  watermarkId: string
  fallback: ReactNode
}) {
  // Upgrade-on-read (#64) is PURE, so it happens during render: an older
  // snapshot is migrated, an unreadable one is refused whole. That covers
  // every documented fallback reason — unknown version, failed upgrade,
  // unrecognised node — without a round-trip through state.
  const snapshot = useMemo(() => readDocumentJson(content), [content])
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [renderFailed, setRenderFailed] = useState(false)

  // The router is reached through a ref rather than through the effect's
  // dependencies, and that is not a style choice: re-running the effect calls
  // `renderDocumentJson` again, which rebuilds the whole document and throws
  // away every value the student typed into it. Nothing that merely CHANGES may
  // be a dependency of this effect.
  const router = useRouter()
  const routerRef = useRef(router)
  useEffect(() => {
    routerRef.current = router
  }, [router])

  useEffect(() => {
    if (!snapshot.ok) {
      console.error(`[InteractiveDocument ${docId}] Snapshot abgelehnt, PNG-Fallback:`, snapshot.error)
      return
    }
    const host = hostRef.current
    if (!host) return
    let cancelled = false

    // Typesetting runs are SERIALISED. A student holding a key down fires a
    // recompute per keystroke, and MathJax is async: two overlapping runs over
    // the same formula could otherwise settle in the wrong order and leave a
    // stale picture. Chaining them also makes each run read the LaTeX that is
    // current when it executes, so a burst collapses onto the final value.
    let queue: Promise<void> = Promise.resolve()
    const typeset = (targets: HTMLElement[]) => {
      if (!targets.length) return
      queue = queue
        .then(() => typesetFormulas(targets, () => cancelled))
        // A rejected link would swallow every run queued behind it, and the
        // document would silently stop typesetting for the rest of the session.
        .catch((err) => {
          console.error('[InteractiveDocument] Formelsatz fehlgeschlagen:', err)
        })
    }

    // Where a link lands inside THIS document (#73). Run after the first
    // typeset rather than straight after the render: a formula changes height
    // when its source is replaced by SVG, so scrolling before that settles
    // aims at a position the document is about to move out from under.
    const scrollToMarkedSpot = () => {
      const anchorId = markedSpotInUrl()
      if (!anchorId) return
      // Matched by walking the marked blocks rather than by a selector: an
      // anchor id is opaque and only ever required to be non-empty, so it
      // cannot be interpolated into one safely.
      const block = anchoredBlocks(host).find((el) => el.dataset['anchorId'] === anchorId)
      block?.scrollIntoView({ block: 'start' })
    }

    try {
      const { renderTargets } = renderDocumentJson(snapshot.doc, host, {
        imageUrl: (imageId) => `/api/image/${imageId}`,
        linkHref,
        // Client-side, so the page underneath is never unmounted and the
        // values the student typed survive the trip (#70). The href comes back
        // from the chip rather than being resolved again, so a click cannot
        // land anywhere other than where the chip says it goes.
        //
        // `scroll: false` only for the overlay: it stops the router discarding
        // the reading position of a page that stays on screen, and would
        // strand a student halfway down a Kurs page they have never seen.
        followLink: (target, href) =>
          routerRef.current.push(href, { scroll: !linkOpensOverlay(target) }),
        // Only the formulas whose value actually moved — an untouched formula
        // must not re-typeset, and re-typesetting is what this costs.
        onRecompute: typeset,
      })
      typeset(renderTargets)
      queue = queue.then(() => {
        if (!cancelled) scrollToMarkedSpot()
      })
    } catch (err) {
      // Leave nothing half-drawn behind before handing over to the picture.
      host.replaceChildren()
      console.error(`[InteractiveDocument ${docId}] Rendern fehlgeschlagen, PNG-Fallback:`, err)
      // The failure is discovered while synchronising with the DOM, so it has
      // to travel back into React — deferred by a microtask rather than set
      // synchronously here, which would cascade renders.
      void Promise.resolve().then(() => {
        if (!cancelled) setRenderFailed(true)
      })
    }

    // A second link to another Sprungmarke in the document already on screen
    // changes the fragment without remounting anything, so the jump has to be
    // listened for. Every mounted document hears it and only the one actually
    // holding that marked spot moves.
    window.addEventListener('hashchange', scrollToMarkedSpot)

    return () => {
      cancelled = true
      window.removeEventListener('hashchange', scrollToMarkedSpot)
    }
  }, [snapshot, docId])

  if (!snapshot.ok || renderFailed) return <>{fallback}</>

  return (
    <div className="relative mt-2">
      <div ref={hostRef} className="dokum-document" />
      <Watermark id={watermarkId} />
    </div>
  )
}

/**
 * The Sprungmarke the current URL asks for, or `''`.
 *
 * A fragment is user-supplied text — a hand-typed or truncated URL can carry a
 * broken escape sequence, and `decodeURIComponent` throws on those. Falling
 * back to the raw fragment keeps a bad URL from throwing out of a listener over
 * something as small as a scroll position.
 */
function markedSpotInUrl(): string {
  const raw = window.location.hash.slice(1)
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/**
 * Typesets each formula with the BUNDLED MathJax — no CDN, no `eval`, and so
 * no CSP change. The renderer deliberately stops at the resolved LaTeX so it
 * stays pure and jsdom-testable; this is the browser half.
 *
 * Each target's LaTeX is read here rather than captured by the caller, and
 * what was last typeset is remembered on the element — so a run that arrives
 * after a newer edit does no work instead of painting a stale formula.
 */
async function typesetFormulas(
  targets: HTMLElement[],
  isCancelled: () => boolean
): Promise<void> {
  let mathJax: Awaited<ReturnType<typeof loadMathJax>>
  try {
    mathJax = await loadMathJax()
  } catch (err) {
    console.error('[InteractiveDocument] MathJax konnte nicht geladen werden:', err)
    // Without MathJax the resolved source IS the formula the student reads, so
    // it has to keep up with their edits — on the first render it is already
    // there, on a recompute it is not.
    for (const target of targets) target.textContent = target.dataset['latex'] ?? ''
    return
  }

  for (const target of targets) {
    if (isCancelled()) return
    const latex = target.dataset['latex'] ?? ''
    if (target.dataset['typesetLatex'] === latex) continue
    try {
      const svg = await mathJax.tex2svgPromise(latex, { display: true })
      if (isCancelled()) return
      target.replaceChildren(svg)
      target.dataset['typesetLatex'] = latex
    } catch {
      const box = target.ownerDocument.createElement('div')
      box.className = 'formula-error'
      box.textContent = latex
      target.replaceChildren(box)
      target.dataset['typesetLatex'] = latex
    }
  }
}

/**
 * Catches render-phase errors from the live document and shows the picture
 * instead. The effect-level try/catch above cannot cover these: React does
 * not route errors thrown during render through the component that scheduled
 * them, and an effect's throw never reaches a boundary at all — so both
 * mechanisms are needed to make "never partial" actually true.
 */
class DocumentRenderBoundary extends Component<
  { docId: string; fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  override componentDidCatch(error: Error) {
    console.error(`[InteractiveDocument ${this.props.docId}] Renderfehler, PNG-Fallback:`, error)
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
