'use client'

import Link from 'next/link'

// Content-only: this boundary sits INSIDE the Kurs layout, so the sidebar and
// the page background are still there and must not be drawn again. Errors
// thrown by the layout itself bubble past this one to the root boundary.
export default function KursError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-black tracking-[0] text-black">
        Dieser Kurs konnte nicht geladen werden.
      </h2>
      <p className="mt-3 text-base text-gray-600">
        Bitte versuche es erneut oder geh zurück zur Übersicht.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Erneut versuchen
        </button>
        <Link
          href="/kurse"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Zurück zu den Kursen
        </Link>
      </div>
    </div>
  )
}
