'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { createEditorDraft, updateEditorDraft } from '@/actions/admin'
import { createEditorController, type EditorController } from '@/lib/editor/controller'
import { DocumentJsonSchema, type EditorDocumentJson } from '@/lib/editor/document-json'
import { EditorToolbar } from './EditorToolbar'

/**
 * React shell of the LaTeX editor (PRD #28, Approach C).
 *
 * React owns only the save bar, the toolbar and the childless mount container
 * below them. The contenteditable surface is created and managed imperatively
 * by the editor controller — the reconciler never sees its subtree, so
 * typing, selection, and user-generated DOM can never be lost to a re-render.
 *
 * Draft persistence (slice 7, #35): the page remounts this component via
 * `key={draftId ?? 'new'}`, so a draft is imported exactly once per mount —
 * `router.refresh()` re-renders (e.g. after a save updates the list) must
 * never re-import over the live editing state. Saving is explicit; there is
 * no autosave (PRD decision). After the FIRST save the page navigates to
 * `?draftId=…` (decision D6): the remount reloads the just-saved content
 * from the DB — dogfooding the export→import round-trip on every first save.
 */

type SaveStatus = { kind: 'idle' | 'saved' | 'error'; text: string }

export interface EditorShellDraft {
  id: string
  title: string
  content: unknown
}

export function EditorShell({ initialDraft }: { initialDraft?: EditorShellDraft }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<EditorController | null>(null)
  const draftIdRef = useRef<string | null>(initialDraft?.id ?? null)
  const router = useRouter()

  // Frozen at mount via a never-set state (the page's key prop remounts per
  // draft) — a router.refresh() re-render must never re-import over live
  // editing state. Invalid content becomes an error status instead of a
  // broken editor.
  const [parsedDraft] = useState<EditorDocumentJson | 'invalid' | null>(() => {
    if (!initialDraft) return null
    const parsed = DocumentJsonSchema.safeParse(initialDraft.content)
    return parsed.success ? parsed.data : 'invalid'
  })

  const [title, setTitle] = useState(initialDraft?.title ?? 'Unbenannt')
  const [status, setStatus] = useState<SaveStatus>(() =>
    parsedDraft === 'invalid'
      ? { kind: 'error', text: 'Entwurf konnte nicht geladen werden: ungültiges Dokumentformat.' }
      : { kind: 'idle', text: '' }
  )
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!mountRef.current) return
    const controller = createEditorController(mountRef.current)
    controllerRef.current = controller
    if (parsedDraft && parsedDraft !== 'invalid') {
      void controller.loadDocument(parsedDraft)
    }
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // parsedDraft is stable for the lifetime of this mount (never set).
  }, [parsedDraft])

  function handleSave() {
    const controller = controllerRef.current
    if (!controller || isPending) return

    let contentJson: string
    try {
      contentJson = JSON.stringify(controller.exportDocument())
    } catch {
      setStatus({
        kind: 'error',
        text: 'Speichern fehlgeschlagen: Inhalt konnte nicht serialisiert werden.',
      })
      return
    }
    const formData = new FormData()
    formData.set('title', title.trim() || 'Unbenannt')
    formData.set('content', contentJson)

    startTransition(async () => {
      const draftId = draftIdRef.current
      if (draftId) {
        const result = await updateEditorDraft(draftId, formData)
        if (!result.ok) {
          setStatus({ kind: 'error', text: `Speichern fehlgeschlagen: ${result.error}` })
          return
        }
        const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
        setStatus({ kind: 'saved', text: `Gespeichert (${time} Uhr)` })
        router.refresh() // draft list shows the fresh updated_at
      } else {
        const result = await createEditorDraft(formData)
        if (!result.ok) {
          setStatus({ kind: 'error', text: `Speichern fehlgeschlagen: ${result.error}` })
          return
        }
        draftIdRef.current = result.data.id
        // First save → draft URL (D6). The key-driven remount reloads the
        // saved content from the DB and refreshes the draft list.
        router.replace(`/admin/editor?draftId=${result.data.id}`)
      }
    })
  }

  return (
    <div className="latex-editor">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="draftTitle" className="text-sm text-gray-600">
          Titel
        </label>
        <input
          id="draftTitle"
          type="text"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          className="w-72 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {isPending ? 'Wird gespeichert …' : 'Speichern'}
        </button>
        <span
          role="status"
          className={status.kind === 'error' ? 'text-sm text-red-700' : 'text-sm text-gray-500'}
        >
          {status.text}
        </span>
      </div>
      <EditorToolbar controllerRef={controllerRef} />
      {/* Imperative mount point — must stay childless in JSX (see PRD #28). */}
      <div ref={mountRef} />
    </div>
  )
}
