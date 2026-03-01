import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum – Dokum',
}

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900">
        ← Zurück
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">Impressum</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Angaben gemäß § 5 TMG</h2>
        <p className="text-gray-600">[Name]<br />[Straße Hausnummer]<br />[PLZ Ort]</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Kontakt</h2>
        <p className="text-gray-600">
          E-Mail: <span className="text-gray-900">[email@example.com]</span>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p className="text-gray-600">[Name]<br />[Adresse]</p>
      </section>
    </div>
  )
}
