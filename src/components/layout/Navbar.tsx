import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          Dokum
        </Link>

        {user && (
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        )}
      </div>
    </nav>
  )
}
