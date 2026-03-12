'use client'

import { User } from '@supabase/supabase-js'
import { WithdrawConsentButton } from '@/components/consent/WithdrawConsentButton'

interface ConsentWithdrawalSectionProps {
  user: User | null
}

export function ConsentWithdrawalSection({ user }: ConsentWithdrawalSectionProps) {
  const isAdmin = user?.app_metadata?.['role'] === 'admin'
  const showWithdrawal = !!user && !isAdmin && !!user.user_metadata?.['consent_accepted_at']

  if (!showWithdrawal) {
    return null
  }

  return (
    <section className="mt-12 rounded-md border border-red-100 bg-red-50 p-6">
      <h2 className="mb-2 text-base font-semibold text-gray-900">Einwilligung widerrufen</h2>
      <p className="mb-4 text-sm text-gray-600">
        Du kannst deine Einwilligung zur Datenverarbeitung jederzeit widerrufen.
        Du wirst anschließend abgemeldet. Zur vollständigen Datenlöschung kontaktiere uns.
      </p>
      <WithdrawConsentButton />
    </section>
  )
}
