import 'server-only'
import Stripe from 'stripe'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

// Lazy singleton — avoids throwing at module-load time during `next build`
// when the env may not yet be present (e.g. type-check phase).
let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(requireEnv('STRIPE_SECRET_KEY'), {
      // No apiVersion pin: the SDK defaults to its bundled latest, which is
      // the only one its types accept. Bumping the SDK is the upgrade path.
      appInfo: { name: 'dokum', url: process.env.NEXT_PUBLIC_SITE_URL ?? '' },
    })
  }
  return _stripe
}

export const STRIPE_UNIT_PRICE_ID = () => requireEnv('STRIPE_UNIT_PRICE_ID')
export const STRIPE_WEBHOOK_SECRET = () => requireEnv('STRIPE_WEBHOOK_SECRET')

export function siteUrl(): string {
  // Used to build success_url / cancel_url for Stripe Checkout. Falls back to
  // localhost for dev; in prod NEXT_PUBLIC_SITE_URL must be set.
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}
