import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { WithdrawConsentButton } from '@/components/consent/WithdrawConsentButton'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – Dokum',
}

export default async function DatenschutzPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.['role'] === 'admin'
  const showWithdrawal = !!user && !isAdmin && !!user.user_metadata?.['consent_accepted_at']

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900">
        ← Zurück
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">Datenschutzerklärung</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Verantwortlicher</h2>
        <p className="text-gray-600">[Name]<br />[Adresse]<br />E-Mail: [email@example.com]</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Erhebung und Verarbeitung personenbezogener Daten</h2>
        <p className="text-gray-600">
          [Beschreibung, welche Daten erhoben werden, zu welchem Zweck und auf welcher Rechtsgrundlage (z. B. Art. 6 Abs. 1 lit. b DSGVO).]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Hosting</h2>
        <p className="text-gray-600">
          Diese Website wird bei Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA gehostet.
          Details finden sich in der{' '}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900"
          >
            Datenschutzerklärung von Vercel
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Ihre Rechte</h2>
        <p className="text-gray-600">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer
          personenbezogenen Daten sowie das Recht auf Datenübertragbarkeit. Wenden Sie sich dazu an:{' '}
          <span className="text-gray-900">[email@example.com]</span>.
        </p>
      </section>

      {showWithdrawal && (
        <section className="mt-12 rounded-md border border-red-100 bg-red-50 p-6">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Einwilligung widerrufen</h2>
          <p className="mb-4 text-sm text-gray-600">
            Du kannst deine Einwilligung zur Datenverarbeitung jederzeit widerrufen.
            Du wirst anschließend abgemeldet. Zur vollständigen Datenlöschung kontaktiere uns.
          </p>
          <WithdrawConsentButton />
        </section>
      )}
    </div>
  )
}
