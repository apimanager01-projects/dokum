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

      <div className="prose prose-sm max-w-none text-gray-600">
        <p>Informationen über den Diensteanbieter.</p>
        <p className="font-semibold text-gray-900">Maurice Riegler</p>
        <p>
          Peygarten-Ottenstein 195, <br />
          3532 Rastenfeld, <br />
          Österreich
        </p>
        <p>
          <strong>Tel.:</strong> +4367761555976
          <br />
          <strong>E-Mail:</strong>{' '}
          <a href="mailto:mauriceriegler@dokum.at" className="text-blue-600 hover:underline">
            mauriceriegler@dokum.at
          </a>
        </p>

        <h2 id="bildernachweis" className="mt-8 mb-3 text-lg font-semibold text-gray-900">
          Bildernachweis
        </h2>
        <p>Die Bilder, Fotos und Grafiken auf dieser Webseite sind urheberrechtlich geschützt.</p>
        <p>
          <strong>Die Bilderrechte liegen bei:</strong>
          <br />
          Maurice Rieger
          <br />
          Daniel Gretz
        </p>
        <p>Alle Texte sind urheberrechtlich geschützt.</p>

        <p className="mt-4 text-xs text-gray-500">
          Quelle: Erstellt mit dem{' '}
          <a
            href="https://www.adsimple.at/impressum-generator/"
            title="Impressum Generator Österreich von AdSimple"
            className="text-blue-600 hover:underline"
          >
            Impressum Generator
          </a>{' '}
          von AdSimple
        </p>
      </div>
    </div>
  )
}
