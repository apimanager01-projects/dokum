'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavbarActions({
  isAdmin,
  userName,
}: {
  isAdmin: boolean
  userName: string | null
}) {
  const pathname = usePathname()
  const usesLandingHeader = pathname === '/' || pathname.startsWith('/kurse')

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
        <Link href="/kurse" className="rounded-md border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
          {userName}
        </Link>
      ) : (
        <Link href="/auth/login" className="rounded-md border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
          Sign in
        </Link>
      )}
    </div>
  )
}
