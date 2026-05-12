import 'server-only'
import { createClient as createSbClient, type SupabaseClient } from '@supabase/supabase-js'

// Service-role client. Bypasses RLS — only call from server-side handlers
// that have already verified the request (e.g. Stripe webhook signature,
// or a pre-validated checkout-success redirect).
//
// NEVER import this from a client component; the `server-only` guard above
// will turn that into a build error.
let _service: SupabaseClient | null = null
export function createServiceClient(): SupabaseClient {
  if (!_service) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
    if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
    _service = createSbClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _service
}
