'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { createEditorDraft, updateEditorDraft, uploadEditorImage } from '@/actions/admin'
import { createEditorController, type EditorController } from '@/lib/editor/controller'
import {
  DocumentJsonSchema,
  withDocumentMeta,
  type EditorDocumentJson,
} from '@/lib/editor/document-json'
import type { EditorTargetKurs } from '@/types'
import { EditorToolbar } from './EditorToolbar'
import { ExportBar } from './ExportBar'

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
 *
 * Images (slice 8, #36): the controller's `uploadImage` hook is wired to the
 * uploadEditorImage action here. All draft-mutating server calls (uploads AND
 * saves) run strictly serialized through one promise chain: rapid consecutive
 * pastes create the implicit „Unbenannt" anchor draft exactly once, and a
 * save can never interleave with an in-flight upload — otherwise the save's
 * image reconciliation could delete the row the upload just inserted.
 * „Speichern" is additionally disabled while uploads are pending (#36
 * decision D3).
 *
 * PNG export (slice 10, #38): the ExportBar between toolbar and editor
 * surface owns the target selection (real Kurs → Unit → Task tree, DAL-fed
 * through the page) and the filename. Only the free Term field is
 * draft-persisted — the shell owns its state, seeds it from the draft's
 * `meta.term` at mount (frozen like parsedDraft; the key-remount reloads it),
 * and injects it into the save payload via `withDocumentMeta`. The
 * Kurs/Unit/Task selection is ephemeral per session (PRD decision).
 *
 * Publish (slice 11, #39): lives entirely in the ExportBar; the shell only
 * threads the SAVED draft identity down. Publishing requires a saved draft —
 * `draftId` is `initialDraft?.id` (mount identity), deliberately NOT the live
 * draftIdRef: an anchor draft created mid-session by an image upload is not
 * an explicit save, and after the first real save the D6 navigation remounts
 * the shell with an initialDraft anyway. `uploadsPending` mirrors the save
 * button's guard.
 *
 * Publish implies save (#40 parity finding): the ExportBar calls `saveDraft`
 * before exporting, so the published PNG and the stored draft JSON can never
 * drift apart. That save joins the op chain like any other draft mutation;
 * only the PNG export/publish itself stays outside it.
 */

type SaveStatus = { kind: 'idle' | 'saved' | 'error'; text: string }

export interface EditorShellDraft {
  id: string
  title: string
  content: unknown
  publishedDocumentId: string | null
}

export function EditorShell({
  initialDraft,
  targetTree,
}: {
  initialDraft?: EditorShellDraft
  targetTree: EditorTargetKurs[]
}) {
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
  // ExportBar Term field (slice 10) — the only draft-persisted export state
  // (meta.term). Seeded from the loaded draft; a JSON-modal import cannot
  // reach this state, so an imported meta.term is ignored until the draft is
  // saved and reopened (documented limitation).
  const [term, setTerm] = useState(() =>
    parsedDraft && parsedDraft !== 'invalid' ? (parsedDraft.meta?.term ?? '') : ''
  )
  const [status, setStatus] = useState<SaveStatus>(() =>
    parsedDraft === 'invalid'
      ? { kind: 'error', text: 'Entwurf konnte nicht geladen werden: ungültiges Dokumentformat.' }
      : { kind: 'idle', text: '' }
  )
  const [isPending, startTransition] = useTransition()
  const [pendingUploads, setPendingUploads] = useState(0)

  // Serializes every draft-mutating server call (image uploads and saves).
  // Kept never-rejecting so one failed operation cannot wedge the chain.
  const opChainRef = useRef<Promise<void>>(Promise.resolve())

  function enqueueOp<T>(op: () => Promise<T>): Promise<T> {
    const settled = opChainRef.current.then(op)
    opChainRef.current = settled.then(
      () => undefined,
      () => undefined
    )
    return settled
  }

  // Controller hook (slice 8). Touches only refs and stable setters, so the
  // closure the mount-effect captures never goes stale.
  async function uploadImage(
    file: File
  ): Promise<{ ok: true; imageId: string } | { ok: false; error: string }> {
    setPendingUploads((n) => n + 1)
    try {
      return await enqueueOp(async () => {
        try {
          const formData = new FormData()
          if (draftIdRef.current) formData.set('draft_id', draftIdRef.current)
          formData.set('file', file)
          const result = await uploadEditorImage(formData)
          if (!result.ok) return { ok: false as const, error: result.error }
          const anchorCreated = draftIdRef.current === null
          draftIdRef.current = result.data.draftId
          // Anchor draft „Unbenannt" appears in the list. URL and key are
          // unchanged — no remount, the live editing state is safe.
          if (anchorCreated) router.refresh()
          return { ok: true as const, imageId: result.data.imageId }
        } catch {
          return { ok: false as const, error: 'Netzwerkfehler beim Hochladen.' }
        }
      })
    } finally {
      setPendingUploads((n) => n - 1)
    }
  }

  useEffect(() => {
    if (!mountRef.current) return
    const controller = createEditorController(mountRef.current, { uploadImage })
    controllerRef.current = controller
    if (parsedDraft && parsedDraft !== 'invalid') {
      void controller.loadDocument(parsedDraft)
    }
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // parsedDraft is stable for the lifetime of this mount (never set), and
    // uploadImage reads only refs — the mount-time closure stays valid.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedDraft])

  // Persists the live editor state into the existing draft row. Used by the
  // publish flow (publish implies save); requires the draft to exist already
  // — publish is only enabled once it does.
  async function saveDraftForPublish(): Promise<{ ok: true } | { ok: false; error: string }> {
    const controller = controllerRef.current
    const draftId = draftIdRef.current
    if (!controller || !draftId) return { ok: false, error: 'Kein gespeicherter Entwurf.' }

    let contentJson: string
    try {
      contentJson = JSON.stringify(withDocumentMeta(controller.exportDocument(), term))
    } catch {
      return { ok: false, error: 'Inhalt konnte nicht serialisiert werden.' }
    }
    const formData = new FormData()
    formData.set('title', title.trim() || 'Unbenannt')
    formData.set('content', contentJson)

    return enqueueOp(async () => {
      const result = await updateEditorDraft(draftId, formData)
      if (!result.ok) return { ok: false as const, error: result.error }
      const time = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      setStatus({ kind: 'saved', text: `Gespeichert (${time} Uhr)` })
      return { ok: true as const }
    })
  }

  function handleSave() {
    const controller = controllerRef.current
    if (!controller || isPending || pendingUploads > 0) return

    let contentJson: string
    try {
      // Save payload = serialized editor state + save-time meta (the Term
      // field, slice 10). The serializer itself stays meta-free.
      contentJson = JSON.stringify(withDocumentMeta(controller.exportDocument(), term))
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

    // Enqueued behind any in-flight upload (belt to the disabled button's
    // braces): the save's image reconciliation must never run while an
    // upload is still inserting its editor_images row.
    startTransition(() =>
      enqueueOp(async () => {
        const draftId = draftIdRef.current
        if (draftId) {
          const result = await updateEditorDraft(draftId, formData)
          if (!result.ok) {
            setStatus({ kind: 'error', text: `Speichern fehlgeschlagen: ${result.error}` })
            return
          }
          if (!initialDraft) {
            // The draft row was anchor-created by an image upload, so the URL
            // has no draftId yet. Navigate on this first explicit save (D6):
            // the key-driven remount reloads the just-saved content.
            router.replace(`/admin/editor?draftId=${draftId}`)
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
    )
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
          disabled={isPending || pendingUploads > 0}
          className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {isPending ? 'Wird gespeichert …' : 'Speichern'}
        </button>
        <span
          role="status"
          className={status.kind === 'error' ? 'text-sm text-red-700' : 'text-sm text-gray-500'}
        >
          {pendingUploads > 0 ? 'Bild wird hochgeladen …' : status.text}
        </span>
      </div>
      <EditorToolbar controllerRef={controllerRef} />
      <ExportBar
        controllerRef={controllerRef}
        targetTree={targetTree}
        term={term}
        onTermChange={setTerm}
        draftId={initialDraft?.id ?? null}
        publishedDocumentId={initialDraft?.publishedDocumentId ?? null}
        uploadsPending={pendingUploads > 0}
        saveDraft={saveDraftForPublish}
      />
      {/* Imperative mount point — must stay childless in JSX (see PRD #28). */}
      <div ref={mountRef} />
    </div>
  )
}
