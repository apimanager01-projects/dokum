'use client'

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { renderDocumentJson } from '@/lib/editor/document-render'
import { readDocumentJson } from '@/lib/editor/document-version'
import { loadMathJax } from '@/lib/editor/mathjax-loader'
import { DocumentPng } from './DocumentPng'
import { Watermark } from './Watermark'
import './interactive-document.css'

/**
 * A published interactive document, rendered live for students (#67).
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

  useEffect(() => {
    if (!snapshot.ok) {
      console.error(`[InteractiveDocument ${docId}] Snapshot abgelehnt, PNG-Fallback:`, snapshot.error)
      return
    }
    const host = hostRef.current
    if (!host) return
    let cancelled = false

    try {
      const { renderTargets } = renderDocumentJson(snapshot.doc, host, {
        imageUrl: (imageId) => `/api/image/${imageId}`,
      })
      void typesetFormulas(renderTargets, () => cancelled)
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

    return () => {
      cancelled = true
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
 * Typesets each formula with the BUNDLED MathJax — no CDN, no `eval`, and so
 * no CSP change. The renderer deliberately stops at the resolved LaTeX so it
 * stays pure and jsdom-testable; this is the browser half.
 */
async function typesetFormulas(
  targets: HTMLElement[],
  isCancelled: () => boolean
): Promise<void> {
  let mathJax: Awaited<ReturnType<typeof loadMathJax>>
  try {
    mathJax = await loadMathJax()
  } catch (err) {
    // The resolved LaTeX source is already in the element — readable, if ugly.
    console.error('[InteractiveDocument] MathJax konnte nicht geladen werden:', err)
    return
  }

  for (const target of targets) {
    if (isCancelled()) return
    const latex = target.dataset['latex'] ?? ''
    try {
      const svg = await mathJax.tex2svgPromise(latex, { display: true })
      if (isCancelled()) return
      target.replaceChildren(svg)
    } catch {
      const box = target.ownerDocument.createElement('div')
      box.className = 'formula-error'
      box.textContent = latex
      target.replaceChildren(box)
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
