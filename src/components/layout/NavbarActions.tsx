'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { signOut } from '@/actions/auth'

export function NavbarActions({
  isAdmin,
  userName,
}: {
  isAdmin: boolean
  userName: string | null
}) {
  const pathname = usePathname()
  const usesLandingHeader = pathname === '/' || pathname.startsWith('/kurse') || pathname === '/settings'
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      aria-hidden={!usesLandingHeader}
      className={`flex min-w-[170px] items-center justify-end gap-5 ${usesLandingHeader ? '' : 'invisible pointer-events-none'}`}
    >
      {isAdmin && (
        <Link href="/admin" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
          Admin
        </Link>
      )}

      {userName ? (
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
          >
            {userName}
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[180px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand"
              >
                <SettingsIcon />
                Settings
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="group flex w-full items-center px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-gray-50"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/login" className="rounded-md border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
          Sign in
        </Link>
      )}
    </div>
  )
}

function SettingsIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ marginRight: 8 }} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.04.05a2 2 0 0 1-3.92 0L10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.05-.04a2 2 0 0 1 0-3.92L4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.04-.05a2 2 0 0 1 3.92 0L14 4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1l.05.04a2 2 0 0 1 0 3.92L20 14a1.7 1.7 0 0 0-.6 1Z" />
      </svg>
    </span>
  )
}

function LogoutIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" style={{ marginRight: 8 }} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
    </span>
  )
}
