'use client'

/** PROTOTYPE (#116) — throwaway variant switcher. Never rendered in production. */

import { useCallback, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const VARIANTS = [
  { key: 'A', name: 'Papier — warmth of ground' },
  { key: 'B', name: 'Luft — generosity of space' },
  { key: 'C', name: 'Karte — softness of form' },
] as const

export function PrototypeSwitcher({ current, grainOn }: { current: string; grainOn: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const index = Math.max(
    0,
    VARIANTS.findIndex((v) => v.key === current),
  )

  const push = useCallback(
    (patch: Record<string, string>) => {
      const q = new URLSearchParams(params.toString())
      for (const [k, v] of Object.entries(patch)) q.set(k, v)
      router.replace(`${pathname}?${q.toString()}`, { scroll: false })
    },
    [params, pathname, router],
  )

  const go = useCallback(
    (delta: number) => {
      const next = VARIANTS[(index + delta + VARIANTS.length) % VARIANTS.length]!
      // Carry the CURRENT grain state explicitly, otherwise switching variants
      // would silently fall back to each variant's default and the two axes
      // would stop being independent — which is the whole point of the toggle.
      push({ variant: next.key, grain: grainOn ? 'on' : 'off' })
    },
    [grainOn, index, push],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return
      }
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
      if (e.key.toLowerCase() === 'g') push({ grain: grainOn ? 'off' : 'on' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, grainOn, push])

  const variant = VARIANTS[index]!

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: '#111827',
        color: '#fff',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        boxShadow: '0 8px 30px rgb(0 0 0 / 0.35)',
      }}
    >
      <Arrow label="Vorige Variante" onClick={() => go(-1)}>
        ←
      </Arrow>
      <span style={{ padding: '0 12px', whiteSpace: 'nowrap' }}>
        <strong>{variant.key}</strong> — {variant.name}
      </span>
      <Arrow label="Nächste Variante" onClick={() => go(1)}>
        →
      </Arrow>
      <button
        type="button"
        onClick={() => push({ grain: grainOn ? 'off' : 'on' })}
        style={{
          marginLeft: 8,
          padding: '6px 12px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 11,
          whiteSpace: 'nowrap',
          background: grainOn ? '#f5f5f4' : '#374151',
          color: grainOn ? '#111827' : '#9ca3af',
        }}
      >
        Körnung {grainOn ? 'an' : 'aus'}
      </button>
      <span
        style={{
          marginLeft: 8,
          marginRight: 6,
          opacity: 0.45,
          fontSize: 10,
          whiteSpace: 'nowrap',
        }}
      >
        ← → G · PROTOTYPE #116
      </span>
    </div>
  )
}

function Arrow({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        width: 30,
        height: 30,
        borderRadius: 999,
        border: 'none',
        background: '#374151',
        color: '#fff',
        cursor: 'pointer',
        fontSize: 14,
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  )
}
