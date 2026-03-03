'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteDocument } from '@/actions/admin'

type Document = {
  id: string
  title: string
  position: number
  created_at: string
}

type Task = {
  id: string
  title: string
  position: number
  created_at: string
  documents: Document[]
}

type Unit = {
  id: string
  title: string
  position: number
  created_at: string
  tasks: Task[]
}

type Kurs = {
  id: string
  title: string
  units: Unit[]
}

type Props = {
  kurse: Kurs[]
  selectedTaskId: string
}

function sortByPosition<T extends { position: number; created_at: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)
  )
}

export function DocumentTree({ kurse, selectedTaskId }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleDelete(docId: string, docTitle: string) {
    if (!window.confirm(`Dokument "${docTitle}" wirklich löschen?`)) return
    setLoadingId(docId)
    const result = await deleteDocument(docId)
    setLoadingId(null)
    if (result.error) {
      alert(`Fehler: ${result.error}`)
    } else {
      router.refresh()
    }
  }

  if (kurse.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-400">
        Noch keine Kurse vorhanden.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {kurse.map((kurs) => (
        <div key={kurs.id} className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">{kurs.title}</p>

          {kurs.units.length === 0 ? (
            <p className="mt-2 ml-3 text-xs text-gray-400 italic">Noch keine Units</p>
          ) : (
            <div className="mt-2 space-y-2">
              {sortByPosition(kurs.units).map((unit) => (
                <div key={unit.id} className="ml-3">
                  <p className="text-xs font-medium text-gray-600">{unit.title}</p>

                  {unit.tasks.length === 0 ? (
                    <p className="mt-1 ml-3 text-xs text-gray-400 italic">Noch keine Tasks</p>
                  ) : (
                    <div className="mt-1 space-y-1.5">
                      {sortByPosition(unit.tasks).map((task) => {
                        const isSelected = task.id === selectedTaskId
                        return (
                          <div
                            key={task.id}
                            className={`ml-3 rounded-md border p-2 transition-colors ${
                              isSelected
                                ? 'border-brand bg-gray-50 ring-1 ring-brand'
                                : 'border-gray-100'
                            }`}
                          >
                            <p className="text-xs font-medium text-gray-700">{task.title}</p>

                            {task.documents.length === 0 ? (
                              <p className="mt-1 ml-3 text-xs text-gray-400 italic">
                                Noch keine Dokumente
                              </p>
                            ) : (
                              <ul className="mt-1 space-y-0.5">
                                {sortByPosition(task.documents).map((doc) => (
                                  <li
                                    key={doc.id}
                                    className="ml-3 flex items-center justify-between gap-2 text-xs text-gray-500"
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-gray-300">›</span>
                                      {doc.title}
                                    </span>
                                    <button
                                      onClick={() => handleDelete(doc.id, doc.title)}
                                      disabled={loadingId === doc.id}
                                      title="Dokument löschen"
                                      className="shrink-0 text-gray-400 hover:text-red-500 disabled:opacity-40"
                                    >
                                      ✕
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
