'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteKurs, deleteUnit, deleteTask, deleteDocument } from '@/actions/admin'

type DocumentItem = { id: string; title: string; position: number; created_at: string }
type TaskItem = { id: string; title: string; position: number; created_at: string; documents?: DocumentItem[] }
type UnitItem = { id: string; title: string; position: number; created_at: string; tasks?: TaskItem[] }
type KursItem = { id: string; title: string; units?: UnitItem[] }

type Props = {
  kurse: KursItem[]
  selectedId?: string
  deleteLevel?: 'kurs' | 'unit' | 'task' | 'document'
}

function sort<T extends { position: number; created_at: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)
  )
}

const confirmMessages = {
  kurs: (t: string) => `Kurs "${t}" und alle zugehörigen Units, Tasks und Dokumente wirklich löschen?`,
  unit: (t: string) => `Unit "${t}" und alle zugehörigen Tasks und Dokumente wirklich löschen?`,
  task: (t: string) => `Task "${t}" und alle zugehörigen Dokumente wirklich löschen?`,
  document: (t: string) => `Dokument "${t}" wirklich löschen?`,
}

const deleteActions = { kurs: deleteKurs, unit: deleteUnit, task: deleteTask, document: deleteDocument }

const editHrefs = {
  kurs: (id: string) => `/admin/kurse/new?editId=${id}`,
  unit: (id: string) => `/admin/units/new?editId=${id}`,
  task: (id: string) => `/admin/tasks/new?editId=${id}`,
  document: (id: string) => `/admin/documents/new?editId=${id}`,
}

export function AdminTree({ kurse, selectedId = '', deleteLevel }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleDelete(id: string, title: string, level: keyof typeof deleteActions) {
    if (!window.confirm(confirmMessages[level](title))) return
    setLoadingId(id)
    const result = await deleteActions[level](id)
    setLoadingId(null)
    if (result.error) alert(`Fehler: ${result.error}`)
    else router.refresh()
  }

  function itemBtns(id: string, title: string, level: keyof typeof deleteActions) {
    return (
      <div className="flex items-center gap-1">
        {deleteLevel === level && (
          <button
            onClick={() => router.push(editHrefs[level](id))}
            className="shrink-0 text-gray-300 transition-colors hover:text-blue-500"
            title="Bearbeiten"
          >
            ✎
          </button>
        )}
        {deleteLevel === level && (
          <button
            onClick={() => handleDelete(id, title, level)}
            disabled={loadingId === id}
            className="shrink-0 text-gray-300 transition-colors hover:text-red-500 disabled:opacity-50"
            title={`${level.charAt(0).toUpperCase() + level.slice(1)} löschen`}
          >
            ✕
          </button>
        )}
      </div>
    )
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
        <div
          key={kurs.id}
          className={`rounded-lg border p-4 transition-colors ${
            kurs.id === selectedId
              ? 'border-brand bg-gray-50 ring-1 ring-brand'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{kurs.title}</p>
            {itemBtns(kurs.id, kurs.title, 'kurs')}
          </div>

          {kurs.units !== undefined && (
            kurs.units.length === 0 ? (
              <p className="mt-2 ml-3 text-xs text-gray-400 italic">Noch keine Units</p>
            ) : (
              <div className="mt-2 space-y-2">
                {sort(kurs.units).map((unit) => (
                  <div
                    key={unit.id}
                    className={`ml-3 rounded-md border p-2 transition-colors ${
                      unit.id === selectedId
                        ? 'border-brand bg-gray-50 ring-1 ring-brand'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-gray-700">{unit.title}</p>
                      {itemBtns(unit.id, unit.title, 'unit')}
                    </div>

                    {unit.tasks !== undefined && (
                      unit.tasks.length === 0 ? (
                        <p className="mt-1 ml-3 text-xs text-gray-400 italic">Noch keine Tasks</p>
                      ) : (
                        <div className="mt-1 space-y-1">
                          {sort(unit.tasks).map((task) => (
                            <div
                              key={task.id}
                              className={`ml-3 rounded border px-2 py-1 transition-colors ${
                                task.id === selectedId
                                  ? 'border-brand bg-gray-50 ring-1 ring-brand'
                                  : 'border-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-600">{task.title}</p>
                                {itemBtns(task.id, task.title, 'task')}
                              </div>

                              {task.documents !== undefined && (
                                task.documents.length === 0 ? (
                                  <p className="mt-1 ml-3 text-xs text-gray-400 italic">
                                    Noch keine Dokumente
                                  </p>
                                ) : (
                                  <ul className="mt-1 space-y-0.5">
                                    {sort(task.documents).map((doc) => (
                                      <li
                                        key={doc.id}
                                        className="ml-3 flex items-center justify-between gap-2 text-xs text-gray-500"
                                      >
                                        <span className="flex items-center gap-2">
                                          <span className="text-gray-300">›</span>
                                          {doc.title}
                                        </span>
                                        {itemBtns(doc.id, doc.title, 'document')}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  )
}
