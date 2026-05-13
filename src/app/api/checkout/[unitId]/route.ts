import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, STRIPE_UNIT_PRICE_ID, siteUrl } from '@/lib/stripe'

// POST /api/checkout/[unitId]
// Creates a Stripe Checkout Session for the flat-price one-time Unit purchase
// and 303-redirects the browser to Stripe's hosted checkout page.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> },
) {
  const { unitId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const back = new URL('/auth/login', request.url)
    back.searchParams.set('message', 'Bitte melde dich an, um eine Einheit zu kaufen.')
    return NextResponse.redirect(back, { status: 303 })
  }

  // Resolve the unit (RLS keeps this readable as long as the parent Kurs is
  // published; non-existent or unpublished units return null → 404).
  const { data: unit } = await supabase
    .from('units')
    .select('id, kurs_id, title')
    .eq('id', unitId)
    .single()

  if (!unit) {
    return new NextResponse('Unit nicht gefunden.', { status: 404 })
  }

  // If already entitled, skip checkout and bounce straight to the unit.
  const { data: existing } = await supabase
    .from('entitlements')
    .select('id')
    .eq('user_id', user.id)
    .eq('unit_id', unitId)
    .maybeSingle()

  if (existing) {
    return NextResponse.redirect(
      new URL(`/kurse/${unit.kurs_id}/units/${unitId}`, request.url),
      { status: 303 },
    )
  }

  const successUrl = `${siteUrl()}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${siteUrl()}/kurse/${unit.kurs_id}/units/${unitId}?canceled=1`
  console.log('[checkout] siteUrl env =', JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL), 'resolved =', JSON.stringify(siteUrl()), 'success_url =', JSON.stringify(successUrl))

  let session
  try {
    session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: STRIPE_UNIT_PRICE_ID(), quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      // Webhook + success-return handler both rely on these.
      metadata: { user_id: user.id, unit_id: unitId },
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Customers should always pay in their own session; allow promo codes
      // for future flexibility without round-tripping through Stripe.
      allow_promotion_codes: true,
    })
  } catch (err) {
    console.error('[checkout] stripe.checkout.sessions.create failed', err)
    return new NextResponse('Bezahlung konnte nicht gestartet werden.', { status: 500 })
  }

  if (!session.url) {
    return new NextResponse('Stripe lieferte keine Checkout-URL.', { status: 502 })
  }

  return NextResponse.redirect(session.url, { status: 303 })
}
