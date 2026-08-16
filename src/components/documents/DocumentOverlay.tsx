'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

/**
 * The shell an in-app document opens in: a modal dialog over the page the
 * student came from, which is still mounted underneath (#70).
 *
 * WHY A NATIVE `<dialog>` AND NOT A DIV. `showModal()` gives the three things
 * this has to get right — a real focus trap, Escape, and everything behind it
 * made inert — from the platform rather than from a hand-rolled key handler
 * that would have to be maintained alongside a live document full of student
 * inputs. What the platform does not do is scroll-lock the page behind it, so
 * that one part is explicit below.
 *
 * EVERY DISMISSAL IS `router.back()`, and that is the whole navigation model.
 * The overlay exists because the router pushed a history entry for the
 * document URL; popping that entry is what closes it, which is why browser
 * Back and the close button are the same gesture and cannot disagree. Escape
 * is deliberately intercepted (`onCancel` → `preventDefault`) rather than left
 * to close the dialog natively: a native close would leave the URL pointing at
 * a document that is no longer on screen.
 *
 * The source page keeps its live student inputs through all of this — nothing
 * persists them, and nothing has to, because parallel routing never unmounts
 * it. That is the reason this ticket exists rather than plain navigation.
 */
export function DocumentOverlay({
  titleId,
  children,
}: {
  /** Id of the heading inside `children` that names the dialog. */
  titleId: string
  children: ReactNode
}) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const pressedBackdrop = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // The element that opened the overlay — remembered before `showModal()`
    // moves focus off it. The browser's own focus restoration does not survive
    // this component being unmounted by the navigation that closes it, and
    // dropping focus to `<body>` would strand a keyboard user at the top of a
    // page they were halfway down.
    const opener = document.activeElement
    // Rendering the `open` attribute would NOT put the dialog in the top
    // layer, and without the top layer there is no focus trap and no inert
    // background — the whole reason for using the element.
    if (!dialog.open) dialog.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
      // The source page was never unmounted, so the link is still there to
      // give focus back to.
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [])

  const dismiss = () => router.back()

  return (
    <dialog
      ref={dialogRef}
      // `aria-labelledby` wins whenever it resolves; the static label is the
      // net under it, so a state that forgot to render the heading degrades to
      // a vaguely-named dialog instead of an unnamed one.
      aria-label="Dokument"
      aria-labelledby={titleId}
      // ONLY THIS DIALOG'S OWN CANCEL COUNTS (#103). `cancel` does not bubble in
      // the DOM, but React replays it along the COMPONENT tree, so Escape over a
      // dialog rendered inside the document — the locked-link card — arrives
      // here too and used to take the whole overlay down with it, discarding
      // everything the student had typed. The identity check is the same one
      // `onMouseDown` makes for the backdrop, and it holds for any dialog
      // embedded below, not just that one.
      onCancel={(event) => {
        if (event.target !== dialogRef.current) return
        event.preventDefault()
        dismiss()
      }}
      // A press that lands on the dialog element itself came from the backdrop:
      // the element has no padding and its child fills it, so nothing else can.
      //
      // THE PRESS DECIDES, NOT THE CLICK. A click's target is the common
      // ancestor of where the pointer went down and came up, so a student
      // selecting a term inside the document and releasing past the panel edge
      // produces a click targeted at the dialog — and the overlay would vanish
      // mid-selection. Interactive documents are selectable, copyable text by
      // design (#63), so that gesture is ordinary rather than exotic.
      onMouseDown={(event) => {
        pressedBackdrop.current = event.target === dialogRef.current
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === dialogRef.current) dismiss()
      }}
      /* The cream becomes the sheet (#118) and the header loses its blur: #119
         forbids blur here for the same reason it took it off the navbar, and
         with more force — a blurred header smears the document the student is
         still working in. The geometry #119 decided (a centred sheet at
         `--dokum-page`, inset from the top, source page visible above and
         below) is the document restyle's, not this ticket's. */
      className="m-auto h-dvh max-h-none w-full max-w-none rounded-none border-0 bg-surface p-0 backdrop:bg-black/40 sm:h-auto sm:max-h-[90vh] sm:w-[92vw] sm:max-w-5xl sm:rounded-xl sm:shadow-2xl"
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <div className="flex shrink-0 justify-end border-b border-hairline bg-surface px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dokument schließen"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-ground hover:text-ink"
          >
            Schließen ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">{children}</div>
      </div>
    </dialog>
  )
}
