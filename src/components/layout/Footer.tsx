'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const year = new Date().getFullYear()

  if (pathname !== '/') {
    return null
  }

  return (
    <footer className="border-t border-gray-200 bg-[#fffdf8]">
      <div className="mx-auto flex max-w-[1420px] items-center justify-between px-5 py-7 text-base font-medium text-gray-500 sm:px-8 lg:px-12">
        <span>© {year} DOKUM</span>
        <div className="flex gap-12">
          <Link href="/impressum" className="transition-colors hover:text-gray-700">
            Impressum
          </Link>
          <Link href="/datenschutz" className="transition-colors hover:text-gray-700">
            Datenschutz
          </Link>
          <Link href="/agb" className="transition-colors hover:text-gray-700">
            AGB
          </Link>
        </div>
      </div>
    </footer>
  )
}
