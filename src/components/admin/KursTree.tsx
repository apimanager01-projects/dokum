'use client'

type Unit = {
  id: string
  title: string
  position: number
  created_at: string
}

type KursWithUnits = {
  id: string
  title: string
  units: Unit[]
}

type Props = {
  kurse: KursWithUnits[]
  selectedKursId: string
}

export function KursTree({ kurse, selectedKursId }: Props) {
  if (kurse.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-400">
        Noch keine Kurse vorhanden.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {kurse.map((kurs) => {
        const isSelected = kurs.id === selectedKursId
        const sortedUnits = [...kurs.units].sort(
          (a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)
        )

        return (
          <div
            key={kurs.id}
            className={`rounded-lg border p-4 transition-colors ${
              isSelected
                ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                : 'border-gray-200 bg-white'
            }`}
          >
            <p className="text-sm font-semibold text-gray-900">{kurs.title}</p>

            {sortedUnits.length === 0 ? (
              <p className="mt-2 ml-3 text-xs text-gray-400 italic">Noch keine Units</p>
            ) : (
              <ul className="mt-2 space-y-1">
                {sortedUnits.map((unit) => (
                  <li key={unit.id} className="ml-3 flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-300">›</span>
                    {unit.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
