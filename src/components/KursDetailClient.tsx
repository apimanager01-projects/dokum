'use client'

import type { Unit } from '@/types'
import { UnitCard } from '@/components/kurse/UnitCard'

export default function KursDetailClient({ units, kursId }: { units: Unit[]; kursId: string }) {
  if (units.length === 0) {
    return <p className="mt-8 text-sm text-gray-500">No units yet.</p>
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((unit) => (
        <UnitCard key={unit.id} unit={unit} kursId={kursId} />
      ))}
    </div>
  )
}
