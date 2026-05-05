import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'

export async function Navbar() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const supabase = hasSupabaseEnv ? await createClient() : null
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  const isAdmin = user?.app_metadata?.['role'] === 'admin'

  return (
    <nav className="sticky top-0 z-50 bg-[#fffdf8]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1420px] items-center justify-between px-5 py-2 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-gray-950">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-xl font-black text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)]">
            D
          </span>
          DOKUM
        </Link>

        <div className="flex items-center justify-end gap-5">
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900">
              Admin
            </Link>
          )}

          {user && (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                Sign out
              </button>
            </form>
          )}

          {!user && (
            <Link href="/auth/login" className="rounded-full border border-brand px-5 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
