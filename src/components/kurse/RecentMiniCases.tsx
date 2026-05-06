'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface RecentItem {
  id: string
  title: string
  createdAt: string
  kursId: string
  kursTitle: string
  unitId: string
  unitTitle: string
  taskId: string
}

function getInitials(title: string) {
  return title.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function removeFromCookie(docId: string) {
  const raw = document.cookie.split('; ').find((r) => r.startsWith('recent_minicases='))?.split('=')[1]
  const ids = raw ? decodeURIComponent(raw).split(',').filter(Boolean) : []
  const next = ids.filter((id) => id !== docId)
  document.cookie = `recent_minicases=${encodeURIComponent(next.join(','))}; path=/; max-age=${60 * 60 * 24 * 30}`
}

interface ContextMenu {
  x: number
  y: number
  itemId: string
}

export function RecentMiniCases({ initialItems }: { initialItems: RecentItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [menu, setMenu] = useState<ContextMenu | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setMenu(null), [])

  useEffect(() => {
    if (!menu) return
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeMenu()
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menu, closeMenu])

  function handleContextMenu(e: React.MouseEvent, itemId: string) {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, itemId })
  }

  function handleRemove(itemId: string) {
    removeFromCookie(itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    closeMenu()
  }

  if (items.length === 0) return null

  return (
    <>
      <section className="mt-10">
        <h2 className="text-2xl font-black tracking-[0] text-black">Recently viewed</h2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {items.map((item) => (
            <a
              key={item.id}
              href={`/kurse/${item.kursId}/units/${item.unitId}?openTask=${item.taskId}`}
              onContextMenu={(e) => handleContextMenu(e, item.id)}
              className="flex min-h-20 items-center gap-5 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-colors hover:border-brand/40 select-none"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-brand/10 font-mono text-sm font-black text-brand">
                {getInitials(item.kursTitle)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-black">{item.kursTitle} – {item.unitTitle}</span>
                <span className="block truncate text-sm text-gray-600">{item.title}</span>
              </span>
              <span className="text-xl font-bold text-gray-500">→</span>
            </a>
          ))}
        </div>
      </section>

      {menu && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menu.y, left: menu.x, zIndex: 50 }}
          className="min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            onClick={() => handleRemove(menu.itemId)}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
            Remove
          </button>
        </div>
      )}
    </>
  )
}
