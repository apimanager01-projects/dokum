import Link from 'next/link'
import type { Unit } from '@/types'

export function UnitCard({ unit, kursId }: { unit: Unit; kursId: string }) {
  return (
    <Link
      href={`/kurse/${kursId}/units/${unit.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-[0_8px_20px_rgb(0_0_0_/_0.04)] transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_14px_30px_rgb(0_0_0_/_0.08)] animate-slide-up"
    >
      <h2 className="text-base font-black text-black">{unit.title}</h2>
      {unit.description && (
        <p className="mt-2 text-sm leading-snug text-gray-600 line-clamp-2">{unit.description}</p>
      )}
      <span className="mt-auto pt-4 text-xs font-bold text-brand">
        View unit →
      </span>
    </Link>
  )
}
