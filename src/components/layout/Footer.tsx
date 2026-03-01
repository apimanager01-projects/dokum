import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-sm text-gray-400">
        <span>© {year} Dokum</span>
        <div className="flex gap-4">
          <Link href="/impressum" className="transition-colors hover:text-gray-700">
            Impressum
          </Link>
          <Link href="/datenschutz" className="transition-colors hover:text-gray-700">
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  )
}
