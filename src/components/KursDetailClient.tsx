'use client'

import { useState } from 'react'
import type { Unit, Task, Document } from '@/types'

type DocWithUrl = Document & { signedUrl: string | null }
type TaskWithDocsAndUrls = Task & { documents: DocWithUrl[] }
type UnitWithTasksAndUrls = Unit & { tasks: TaskWithDocsAndUrls[] }

export default function KursDetailClient({ units }: { units: UnitWithTasksAndUrls[] }) {
  const [openTaskIds, setOpenTaskIds] = useState<Set<string>>(new Set())

  function toggleTask(taskId: string) {
    setOpenTaskIds((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  if (units.length === 0) {
    return <p className="mt-8 text-sm text-gray-500">No units yet.</p>
  }

  return (
    <div className="mt-8 space-y-8">
      {units.map((unit) => (
        <section key={unit.id}>
          <h2 className="text-lg font-semibold text-gray-800">{unit.title}</h2>
          {unit.description && (
            <p className="mt-1 text-sm text-gray-500">{unit.description}</p>
          )}

          {unit.tasks.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">No tasks yet.</p>
          ) : (
            <ul className="mt-3 space-y-1">
              {unit.tasks.map((task) => {
                const isOpen = openTaskIds.has(task.id)
                return (
                  <li key={task.id}>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left"
                    >
                      <span
                        className="text-gray-400 transition-transform duration-150"
                        style={{ display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none' }}
                      >
                        ›
                      </span>
                      {task.title}
                    </button>

                    {isOpen && (
                      <div className="ml-6 mt-1 mb-2">
                        {task.description && (
                          <p className="px-3 pb-2 text-sm text-gray-500">{task.description}</p>
                        )}
                        {task.documents.length === 0 ? (
                          <p className="px-3 text-xs text-gray-400">No documents yet.</p>
                        ) : (
                          <ul className="space-y-1">
                            {task.documents.map((doc) => (
                              <li
                                key={doc.id}
                                className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                                    {doc.description && (
                                      <p className="text-xs text-gray-500">{doc.description}</p>
                                    )}
                                  </div>
                                  {doc.signedUrl ? (
                                    <a
                                      href={doc.signedUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="shrink-0 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
                                    >
                                      Open PDF ↗
                                    </a>
                                  ) : (
                                    <span className="shrink-0 text-xs text-red-500">Link unavailable</span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
