'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type MouseEvent } from 'react'
import { deleteEditorDraft } from '@/actions/admin'
import { filterDraftsByTitle } from '@/lib/editor/draft-filter'
import { confirmLeaveEditor } from '@/lib/editor/unsaved-changes'
import type { EditorDocumentListItem } from '@/types'

/**
 * The drafts catalog of the LaTeX editor (#109) — a button in the page header
 * that opens the draft list in a popup. It replaces the standing list that used
 * to sit between the heading and the editor (PRD #28, slice 7 — #35): that list
 * cost vertical space on every single visit to pay for a glance taken rarely,
 * and it grew into something to scroll rather than something to read.
 *
 * THE BUTTON CARRIES WHAT THE STANDING LIST GAVE FOR FREE — how many drafts
 * there are, and which one is open. Collapsing a list is only free if the facts
 * it published at a glance survive the collapse.
 *
 * The title beside the button is the SAVED title, read from the same server
 * list the popup renders. It therefore follows a save (`router.refresh()`) and
 * not the editor's live title field — a header that renamed itself per
 * keystroke would claim a draft was called something the database has never
 * heard of.
 *
 * Content still comes from the server on every render, so a save, a delete and
 * a publish all keep the count and the list honest through the `router.refresh()`
 * they already do — no client-side copy of the list to go stale.
 */
export function DraftCatalog({
  drafts,
  activeId,
}: {
  drafts: EditorDocumentListItem[]
  activeId?: string
}) {
  const [open, setOpen] = useState(false)
  const activeTitle = activeId ? drafts.find((draft) => draft.id === activeId)?.title : undefined

  return (
    // `basis-64` inside the header's `flex-wrap`: the button sits beside the
    // heading when there is room for it and the open draft's title, and drops
    // onto its own line on a phone instead of squeezing that title to nothing.
    <div className="flex min-w-0 shrink grow basis-64 items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand"
      >
        Entwürfe ({drafts.length})
      </button>
      {activeTitle !== undefined && (
        <span className="min-w-0 truncate text-sm text-gray-500" title={activeTitle}>
          {activeTitle}
        </span>
      )}
      {/* Mounted only while open, like every other dialog here: the filter text
          and the delete error start fresh on each open, and the popup's focus
          handling gets a mount and an unmount to hang off. */}
      {open && (
        <DraftCatalogDialog drafts={drafts} activeId={activeId} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

/**
 * The popup itself: a native `<dialog>` opened with `showModal()` — the
 * established pattern here (DocumentOverlay, LinkLockedCard, LinkTargetPicker).
 * The focus trap, Escape and the inert background come from the platform
 * instead of from key handlers this file would have to keep correct; the two
 * things the platform does not do — the scroll lock behind the dialog and
 * returning focus to the trigger after React unmounts the element — are the
 * explicit parts of the effect below. A dropdown panel was considered and
 * declined on the ticket, and would have had to hand-roll all four.
 */
function DraftCatalogDialog({
  drafts,
  activeId,
  onClose,
}: {
  drafts: EditorDocumentListItem[]
  activeId?: string
  onClose: () => void
}) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const filterRef = useRef<HTMLInputElement | null>(null)
  const pressedBackdrop = useRef(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // Remembered before `showModal()` moves focus off it: the trigger is still
    // in the header underneath, and a keyboard user has to come back to it
    // rather than to `<body>`. The browser's own restoration does not survive
    // React unmounting the element on close.
    const opener = document.activeElement
    // Rendering the `open` attribute would NOT put the dialog in the top layer,
    // and without the top layer there is no focus trap and no inert background.
    if (!dialog.open) dialog.showModal()
    // The filter is the point of the popup, so it gets the focus explicitly:
    // `showModal()`'s own focusing steps would land on whatever comes first in
    // the DOM (the close button), and React's `autoFocus` runs while the dialog
    // is still `display:none`, where focusing does nothing.
    filterRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [])

  // EVERY dismissal ends here, so Escape, the ✕ and the backdrop cannot end up
  // in different states — React unmounting the popup is the one thing that
  // closes it.
  //
  // ⚠ IT MUST NOT BE THE ELEMENT'S `close()`, AND `onClose` MUST NOT BE A STATE
  // INPUT. React runs an effect mount → cleanup → mount in StrictMode (Next's
  // dev default), and the cleanup below closes the dialog; the `close` event
  // that fires for it is indistinguishable from a real dismissal, so routing it
  // into `onClose` unmounted the popup in the same tick it opened — the button
  // looked dead. Escape is caught as `cancel` instead (DocumentOverlay does the
  // same, for the same reason), and the element is left to unmount, which takes
  // it out of the top layer on its own.
  const dismiss = () => onClose()

  /**
   * The one door out of the current draft — opening another one and
   * „+ Neuer Entwurf" both go through it, which is why they are the same
   * function and not two inline handlers.
   *
   * Following either link changes the page's `key`, which remounts EditorShell
   * and rebuilds the editor from the DB. With no autosave that discards
   * everything typed since the last „Speichern", so the leave is confirmed
   * first (#110) — silently when there is nothing unsaved, because a dialog
   * that fires every time is one people learn to click through. Cancelling
   * stops at `preventDefault()`: no navigation, no dismiss, so the draft, its
   * content, its selection and the popup are all exactly as they were.
   */
  function handleLeaveDraft(event: MouseEvent<HTMLAnchorElement>) {
    // A modifier click opens the draft in a NEW tab and leaves this one exactly
    // where it is. Nothing is being left, so the popup stays as it is (and #110
    // must not ask about unsaved work either).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!confirmLeaveEditor()) {
      event.preventDefault()
      return
    }
    dismiss()
  }

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
      // The popup deliberately stays open: the list refreshes under it, so
      // deleting several drafts is one visit rather than one visit each.
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

  // Newest-first from the DAL; the filter preserves that order (#109: no sort
  // controls).
  const visible = filterDraftsByTitle(drafts, query)

  return (
    <dialog
      ref={dialogRef}
      // `aria-labelledby` wins whenever it resolves; the static label is the net
      // under it, so a state that failed to render the heading degrades to a
      // vaguely-named dialog rather than an unnamed one.
      aria-label="Entwürfe"
      aria-labelledby="draftCatalogTitle"
      // Escape, without letting the platform's own close drive React state (see
      // `dismiss`). `cancel` does not bubble in the DOM, but React replays it
      // along the COMPONENT tree (#103), so the identity check keeps a dialog
      // rendered below from closing this one.
      onCancel={(event) => {
        if (event.target !== dialogRef.current) return
        event.preventDefault()
        dismiss()
      }}
      // The press decides, not the click: a click's target is the common
      // ancestor of press and release, so releasing past the panel edge after
      // selecting a draft title inside it would otherwise dismiss the popup.
      onMouseDown={(event) => {
        pressedBackdrop.current = event.target === dialogRef.current
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === dialogRef.current) dismiss()
      }}
      className="m-auto w-[92vw] max-w-lg rounded-xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/40"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 id="draftCatalogTitle" className="text-base font-semibold text-gray-900">
            Entwürfe ({drafts.length})
          </h2>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Schließen"
            className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-gray-200 px-5 py-3">
          <input
            ref={filterRef}
            type="text"
            value={query}
            maxLength={200}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Entwürfe nach Titel filtern"
            placeholder="Nach Titel filtern …"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {error && <p className="px-3 py-2 text-sm text-red-700">{error}</p>}
          {drafts.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">
              Noch keine Entwürfe. Erstelle einen im Editor und klicke auf „Speichern“.
            </p>
          ) : visible.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-500">
              Kein Entwurf passt zu „{query.trim()}“.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map((draft) => (
                <li
                  key={draft.id}
                  className={
                    draft.id === activeId
                      ? 'flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-brand bg-brand/10 px-3 py-2'
                      : 'flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 hover:bg-gray-50'
                  }
                >
                  {/* Still a real link: the draft has a URL (`?draftId=`) and
                      the page remounts the editor through its key. */}
                  <Link
                    href={`/admin/editor?draftId=${draft.id}`}
                    onClick={handleLeaveDraft}
                    className="min-w-0 basis-full truncate text-sm font-medium text-gray-900 hover:text-brand sm:flex-1 sm:basis-auto"
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
                    className="ml-auto shrink-0 text-sm text-red-700 hover:underline disabled:opacity-50 sm:ml-0"
                  >
                    Löschen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-gray-200 px-5 py-3">
          <Link
            href="/admin/editor"
            onClick={handleLeaveDraft}
            className="text-sm font-medium text-brand hover:underline"
          >
            + Neuer Entwurf
          </Link>
        </div>
      </div>
    </dialog>
  )
}
