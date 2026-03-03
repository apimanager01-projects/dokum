'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { acceptConsent, withdrawConsent } from '@/actions/auth'

// NOTE: Replace this email with the actual contact address when ready
const CONTACT_EMAIL = 'kontakt@example.com'

export function ConsentPageClient() {
  const [rejectState, rejectAction, rejectPending] = useActionState(
    async (_prev: { done: boolean }) => {
      await withdrawConsent()
      return { done: true }
    },
    { done: false }
  )

  if (rejectState.done) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">Einwilligung abgelehnt</h1>
        <p className="text-sm text-gray-600">
          Du wurdest abgemeldet. Um deine Daten löschen zu lassen, wende dich an:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand underline">
            {CONTACT_EMAIL}
          </a>
        </p>
        <Link href="/auth/login" className="text-sm text-gray-500 underline hover:text-gray-900">
          Zurück zur Anmeldung
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-gray-900">Datenschutz-Einwilligung</h1>

      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 leading-relaxed">
        <p className="mb-2 font-medium text-gray-900">Zusammenfassung</p>
        <p>
          Wir verarbeiten deine E-Mail-Adresse und deinen Namen, um dir Zugang zu den
          Kursinhalten zu ermöglichen (Art. 6 Abs. 1 lit. b DSGVO). Deine Daten werden
          nicht an Dritte weitergegeben. Du kannst deine Einwilligung jederzeit widerrufen.
        </p>
        <p className="mt-2">
          Die vollständige{' '}
          <Link href="/datenschutz" className="font-medium text-brand underline" target="_blank">
            Datenschutzerklärung
          </Link>{' '}
          steht dir jederzeit zur Verfügung.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form action={acceptConsent} className="flex-1">
          <button
            type="submit"
            className="w-full rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/5 btn-brand"
          >
            Zustimmen
          </button>
        </form>

        <form action={rejectAction} className="flex-1">
          <button
            type="submit"
            disabled={rejectPending}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {rejectPending ? 'Wird verarbeitet…' : 'Ablehnen'}
          </button>
        </form>
      </div>
    </div>
  )
}
