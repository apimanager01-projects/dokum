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
    /*
     * Sticky, opaque, and no blur (#119). `backdrop-blur-sm` was the one effect
     * that actively fought #116's material decision — `backdrop-filter` smears
     * the grain it sits over, and it repaints every scroll frame of a long
     * document. The translucency went with it: 95% of the ground over the
     * ground is a needless composite.
     *
     * Still no hairline under it, deliberately. #118 made an edge mean „you can
     * act on this"; a full-width rule across the chrome would be the first lie
     * in that grammar. Separation is space and the sheet.
     */
    <nav
      className="dokum-ground sticky top-0 z-50"
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
