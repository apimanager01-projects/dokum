'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { withdrawConsent } from '@/actions/auth'

// NOTE: Replace this email with the actual contact address when ready
const CONTACT_EMAIL = 'kontakt@example.com'

export function WithdrawConsentButton() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: { done: boolean }) => {
      await withdrawConsent()
      return { done: true }
    },
    { done: false }
  )

  useEffect(() => {
    if (state.done) {
      router.push(
        `/auth/login?message=${encodeURIComponent(
          `Einwilligung widerrufen. Datenlöschung beantragen: ${CONTACT_EMAIL}`
        )}`
      )
    }
  }, [state.done, router])

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        {pending ? 'Wird verarbeitet…' : 'Einwilligung widerrufen'}
      </button>
    </form>
  )
}
