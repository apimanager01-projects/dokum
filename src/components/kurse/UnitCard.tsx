import Link from 'next/link'
import type { Unit } from '@/types'

export function UnitCard({ unit, kursId }: { unit: Unit; kursId: string }) {
  return (
    <Link
      href={`/kurse/${kursId}/units/${unit.id}`}
      className="relative block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand/30 hover:shadow-md animate-slide-up"
    >
      <h2 className="text-base font-semibold text-gray-900">{unit.title}</h2>
      {unit.description && (
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{unit.description}</p>
      )}
      <span className="mt-4 inline-block text-xs font-medium text-brand">
        View unit →
      </span>
    </Link>
  )
}
