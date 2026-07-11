'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteEditorDraft } from '@/actions/admin'
import type { EditorDocumentListItem } from '@/types'

/**
 * Draft list of the LaTeX editor (PRD #28, slice 7 — #35): title + last
 * modification, open via `?draftId=` (the page remounts the editor through
 * its key), delete with confirm. RLS is admin-wide, so the list shows both
 * admins' drafts.
 */
export function DraftList({
  drafts,
  activeId,
}: {
  drafts: EditorDocumentListItem[]
  activeId?: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(draft: EditorDocumentListItem) {
    if (
      !window.confirm(
        `Entwurf „${draft.title}“ wirklich löschen? Dies kann nicht rückgängig gemacht werden.`
      )
    ) {
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await deleteEditorDraft(draft.id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (draft.id === activeId) {
        router.push('/admin/editor')
      }
      router.refresh()
    })
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <section className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Entwürfe</h2>
        <Link href="/admin/editor" className="text-sm text-brand hover:underline">
          + Neuer Entwurf
        </Link>
      </div>
      {error && <p className="mb-2 text-sm text-red-700">{error}</p>}
      {drafts.length === 0 ? (
        <p className="text-sm text-gray-500">
          Noch keine Entwürfe. Erstelle einen im Editor und klicke auf „Speichern“.
        </p>
      ) : (
        <ul className="max-h-56 divide-y divide-gray-100 overflow-y-auto">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className={
                draft.id === activeId
                  ? 'flex items-center justify-between gap-4 rounded-md border border-brand bg-brand/10 px-3 py-2'
                  : 'flex items-center justify-between gap-4 px-3 py-2 hover:bg-gray-50'
              }
            >
              <Link
                href={`/admin/editor?draftId=${draft.id}`}
                className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 hover:text-brand"
              >
                {draft.title}
              </Link>
              <span className="shrink-0 text-xs text-gray-500" suppressHydrationWarning>
                {formatDate(draft.updated_at)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(draft)}
                disabled={isPending}
                className="shrink-0 text-sm text-red-700 hover:underline disabled:opacity-50"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
