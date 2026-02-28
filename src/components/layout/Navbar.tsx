import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAdmin = user?.app_metadata?.['role'] === 'admin'

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-brand text-xs font-bold text-white">
            D
          </span>
          Dokum
        </Link>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Admin
            </Link>
          )}

          {user && (
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  )
}
