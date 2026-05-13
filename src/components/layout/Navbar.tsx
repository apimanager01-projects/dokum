import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavbarActions } from '@/components/layout/NavbarActions'

export async function Navbar() {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const supabase = hasSupabaseEnv ? await createClient() : null
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  const isAdmin = user?.app_metadata?.['role'] === 'admin'
  const userName =
    user?.user_metadata?.['full_name'] ||
    user?.user_metadata?.['name'] ||
    user?.email?.split('@')[0] ||
    null

  return (
    <nav
      className="sticky top-0 z-50 bg-[#fffdf8]/95 backdrop-blur-sm"
      style={{ height: 66, paddingTop: 16 }}
    >
      <div className="mx-auto flex max-w-[1420px] items-start justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-lg font-black uppercase tracking-tight text-gray-950">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-xl font-black text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.25)]">
            D
          </span>
          DOKUM
        </Link>

        <NavbarActions isAdmin={isAdmin} userName={userName} />
      </div>
    </nav>
  )
}
