import { UNIT_PRICE_DISPLAY } from '@/lib/constants'

interface Props {
  unitId: string
  title: string
  description: string | null
  canceled?: boolean
}

export default function UnitPaywall({ unitId, title, description, canceled }: Props) {
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-2xl">🔒</span>
        <h2 className="text-lg font-semibold text-gray-900">Einheit gesperrt</h2>
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Schalte <span className="font-medium text-gray-900">{title}</span> frei, um auf alle
        Aufgaben und Dokumente dieser Einheit zuzugreifen.
      </p>
      {description && (
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      )}

      {canceled && (
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Bezahlung abgebrochen. Du kannst es jederzeit erneut versuchen.
        </p>
      )}

      <form action={`/api/checkout/${unitId}`} method="post" className="mt-6">
        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand/90 transition-colors btn-brand"
        >
          Freischalten – {UNIT_PRICE_DISPLAY}
        </button>
      </form>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        Sichere Bezahlung über Stripe. Einmalige Zahlung — dauerhafter Zugriff.
      </p>
    </div>
  )
}
