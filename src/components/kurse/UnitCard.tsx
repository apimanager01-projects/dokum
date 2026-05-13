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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-[0_8px_20px_rgb(0_0_0_/_0.04)] transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_14px_30px_rgb(0_0_0_/_0.08)] animate-slide-up"
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
      <h2 className="text-base font-black text-black">{unit.title}</h2>
      {unit.description && (
        <p className="mt-2 text-sm leading-snug text-gray-600 line-clamp-2">{unit.description}</p>
      )}
      <span className="mt-auto pt-4 text-xs font-bold text-brand">
        {locked ? 'Freischalten →' : 'View unit →'}
      </span>
    </Link>
  )
}
