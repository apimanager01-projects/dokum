'use client'

export default function UnitError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h2 className="text-xl font-semibold text-gray-900">Einheit konnte nicht geladen werden.</h2>
      <p className="mt-2 text-sm text-gray-500">Bitte versuche es erneut.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
      >
        Erneut versuchen
      </button>
    </div>
  )
}
