'use client'

import { useState } from 'react'
import type { Task, DocumentWithImages } from '@/types'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

type TaskWithDocs = Task & { documents: DocumentWithImages[] }

interface LightboxState {
  slides: { src: string }[]
  index: number
}

function trackMiniCase(docId: string) {
  const raw = document.cookie
    .split('; ')
    .find((row) => row.startsWith('recent_minicases='))
    ?.split('=')[1]
  const ids = raw ? decodeURIComponent(raw).split(',').filter(Boolean) : []
  const next = [docId, ...ids.filter((id) => id !== docId)].slice(0, 4)
  document.cookie = `recent_minicases=${encodeURIComponent(next.join(','))}; path=/; max-age=${60 * 60 * 24 * 30}`
}

function Watermark({ id }: { id: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden', pointerEvents: 'none', userSelect: 'none',
      }}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: `${(Math.floor(i / 4) * 22) + 5}%`,
            left: `${((i % 4) * 28) - 8}%`,
            transform: 'rotate(-35deg)',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'rgba(0,0,0,0.35)',
            whiteSpace: 'nowrap',
            mixBlendMode: 'multiply',
          }}
        >
          {id}
        </span>
      ))}
    </div>
  )
}

export default function UnitDetailClient({ tasks, openTaskId, watermarkId }: { tasks: TaskWithDocs[]; openTaskId?: string; watermarkId: string }) {
  const [openTaskIds, setOpenTaskIds] = useState<Set<string>>(openTaskId ? new Set([openTaskId]) : new Set())
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  function openLightbox(images: string[], index: number) {
    setLightbox({ slides: images.map((src) => ({ src })), index })
  }

  function toggleTask(taskId: string, docs: DocumentWithImages[]) {
    setOpenTaskIds((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
        docs.forEach((doc) => trackMiniCase(doc.id))
      }
      return next
    })
  }

  if (tasks.length === 0) {
    return <p className="mt-8 text-sm text-gray-500">No tasks yet.</p>
  }

  return (
    <>
    {/* onContextMenu wrapper blocks right-click "Save Image" inside the lightbox */}
    <div onContextMenu={(e) => e.preventDefault()}>
      <Lightbox
        open={lightbox !== null}
        close={() => setLightbox(null)}
        slides={lightbox?.slides ?? []}
        index={lightbox?.index ?? 0}
        plugins={[Zoom]}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 4 }}
      />
    </div>
    <div className="mt-8 space-y-8">
      {tasks.map((task) => {
        const isOpen = openTaskIds.has(task.id)
        return (
          <section key={task.id}>
            <button
              onClick={() => toggleTask(task.id, task.documents)}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-left"
            >
              <span
                className="text-gray-400 transition-transform duration-150"
                style={{ display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none' }}
              >
                ›
              </span>
              <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            </button>

            {task.description && (
              <p className="mt-1 text-sm text-gray-500 pl-8">{task.description}</p>
            )}

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="ml-6 mt-1 mb-2">
                  {task.documents.length === 0 ? (
                    <p className="px-3 text-xs text-gray-400">No documents yet.</p>
                  ) : (
                    <ul className="space-y-1">
                      {task.documents.map((doc) => (
                        <li
                          key={doc.id}
                          className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                        >
                          {doc.file_type === 'image_collection' ? (
                            <div>
                              <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-500">{doc.description}</p>
                              )}
                              <div className="mt-2 grid grid-cols-1 gap-2">
                                {(doc.document_images ?? []).map((img, imgIndex) => (
                                  <div key={img.id} className="mt-1">
                                    <div
                                      className="relative inline-block rounded-md overflow-hidden max-w-full"
                                      onContextMenu={(e) => e.preventDefault()}
                                    >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={`/api/image/${img.id}`}
                                      alt={doc.title}
                                      className="block max-w-full max-h-[400px] select-none"
                                      style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                                      draggable={false}
                                    />
                                    <div
                                      className="absolute inset-0 cursor-zoom-in"
                                      onClick={() => openLightbox(
                                        (doc.document_images ?? []).map((i) => `/api/image/${i.id}`),
                                        imgIndex
                                      )}
                                    />
                                    <Watermark id={watermarkId} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : doc.file_type === 'image' ? (
                            <div>
                              <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                              {doc.description && (
                                <p className="text-xs text-gray-500">{doc.description}</p>
                              )}
                              <div className="mt-2 inline-block max-w-full">
                                <div
                                  className="relative rounded-md overflow-hidden"
                                  onContextMenu={(e) => e.preventDefault()}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={`/api/file/${doc.id}`}
                                    alt={doc.title}
                                    className="block max-w-full max-h-[600px] select-none"
                                    style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                                    draggable={false}
                                  />
                                  <div
                                    className="absolute inset-0 cursor-zoom-in"
                                    onClick={() => openLightbox([`/api/file/${doc.id}`], 0)}
                                  />
                                  <Watermark id={watermarkId} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{doc.title}</p>
                                {doc.description && (
                                  <p className="text-xs text-gray-500">{doc.description}</p>
                                )}
                              </div>
                              <a
                                href={`/api/file/${doc.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 rounded-md border border-brand px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/5 transition-colors btn-brand"
                              >
                                Open PDF ↗
                              </a>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
    </>
  )
}
