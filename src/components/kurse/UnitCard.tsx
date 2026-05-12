import Link from 'next/link'
import type { Unit } from '@/types'
import { UNIT_PRICE_DISPLAY } from '@/lib/constants'

interface Props {
  unit: Unit
  kursId: string
  locked?: boolean
}

export function UnitCard({ unit, kursId, locked = false }: Props) {
  return (
    <Link
      href={`/kurse/${kursId}/units/${unit.id}`}
      className="relative block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand/30 hover:shadow-md animate-slide-up"
    >
      {locked && (
        <span
          aria-label="Gesperrt"
          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
        >
          <span aria-hidden>🔒</span>
          {UNIT_PRICE_DISPLAY}
        </span>
      )}
      <h2 className="text-base font-semibold text-gray-900">{unit.title}</h2>
      {unit.description && (
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{unit.description}</p>
      )}
      <span className="mt-4 inline-block text-xs font-medium text-brand">
        {locked ? 'Freischalten →' : 'View unit →'}
      </span>
    </Link>
  )
}
