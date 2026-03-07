import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — must not run any other logic between createServerClient and getUser
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // If getUser fails, treat as unauthenticated
  }

  const { pathname } = request.nextUrl
  const isAuthPage = pathname.startsWith('/auth')
  const isAdminPage = pathname.startsWith('/admin')
  const isConsentPage = pathname === '/consent'
  const isPublicPage = pathname === '/impressum' || pathname === '/datenschutz' || isConsentPage

  // Unauthenticated user trying to access a protected page → redirect to login
  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    if (pathname.startsWith('/api/pdf/') || pathname.startsWith('/api/file/') || pathname.startsWith('/api/image/')) {
      url.searchParams.set('message', 'Bitte melde dich an/registriere dich, um auf dieses Dokument zuzugreifen.')
    }
    return NextResponse.redirect(url)
  }

  // Authenticated user without admin role trying to access /admin → redirect to home
  if (user && isAdminPage && user.app_metadata?.['role'] !== 'admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Authenticated user visiting auth pages → redirect to home
  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // Authenticated non-admin without consent → redirect to /consent
  if (
    user &&
    !isAuthPage &&
    !isPublicPage &&
    user.app_metadata?.['role'] !== 'admin' &&
    !user.user_metadata?.['consent_accepted_at']
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/consent'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
