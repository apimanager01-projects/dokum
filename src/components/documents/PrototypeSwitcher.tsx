'use client'

/*
 * PROTOTYPE — #124. THROWAWAY. DO NOT MERGE TO A FEATURE BRANCH.
 *
 * The floating bar that flips between the three document variants. Deliberately
 * loud and deliberately ugly: it must never be mistaken for part of the design
 * being judged.
 */

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { PROTO_VARIANTS, type ProtoVariant } from './prototype-124-variants'

const NAMES: Record<ProtoVariant, string> = {
  A: 'Ruled — one sheet, no boxes',
  B: 'Recessed — wells cut into the sheet',
  C: 'Paper — no sheet, grain under the prose',
}

export function PrototypeSwitcher({ current }: { current: ProtoVariant }) {
  const router = useRouter()
  const pathname = usePathname()

  const go = (delta: number) => {
    const next = PROTO_VARIANTS[(PROTO_VARIANTS.indexOf(current) + delta + 3) % 3]
    // `scroll: false` — flipping variants must not throw away the reading
    // position, or a long document can only be judged from its top.
    router.replace(`${pathname}?variant=${next}`, { scroll: false })
  }

  // The variant also goes on <html>, so the OVERLAY carries it. The overlay is
  // a separate route tree and never sees `?variant=`, but the source page is
  // still mounted underneath it (#70) — so this component is still alive and
  // the root attribute is still set while the dialog is open. Which is also
  // how the two surfaces get compared as one object, the ticket's question 4.
  useEffect(() => {
    window.document.documentElement.dataset['proto'] = current
    return () => {
      delete window.document.documentElement.dataset['proto']
    }
  }, [current])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      // A document is FULL of student inputs — stealing the arrow keys would
      // make the prototype unusable for the one thing it is meant to test.
      const el = window.document.activeElement
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return
      }
      go(event.key === 'ArrowLeft' ? -1 : 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        borderRadius: 999,
        background: '#101014',
        color: '#fff',
        font: '500 13px/1 ui-monospace, monospace',
        boxShadow: '0 6px 24px rgba(0,0,0,.35)',
      }}
    >
      <button type="button" onClick={() => go(-1)} style={BTN} aria-label="Vorherige Variante">
        ←
      </button>
      <span style={{ whiteSpace: 'nowrap' }}>
        PROTO #124 · {current} — {NAMES[current]}
      </span>
      <button type="button" onClick={() => go(1)} style={BTN} aria-label="Nächste Variante">
        →
      </button>
    </div>
  )
}

const BTN: React.CSSProperties = {
  cursor: 'pointer',
  border: '1px solid #3a3a44',
  borderRadius: 999,
  background: '#1c1c22',
  color: '#fff',
  width: 26,
  height: 26,
  lineHeight: 1,
}
