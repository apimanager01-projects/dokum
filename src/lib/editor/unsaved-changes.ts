/**
 * unsaved-changes — does the editor hold work „Speichern" has not written yet
 * (#110)?
 *
 * ⚠ THIS EXISTS BECAUSE SWITCHING DRAFTS IS DESTRUCTIVE. Following a draft link
 * changes the page's `key={draftId ?? 'new'}`, which remounts EditorShell and
 * rebuilds the imperative controller from the DB. There is no autosave (PRD
 * decision, and it stands), so the whole window between two saves is the
 * author's to lose — silently, until this module.
 *
 * TWO HALVES, DELIBERATELY IN ONE FILE:
 *
 * 1. The comparison. It is a diff between two `exportDocument()` results — the
 *    ticket's preferred option, and the only one that cannot drift from what a
 *    save would actually write, because it IS what a save writes. The baseline
 *    is captured by calling the very same serializer once, right after the
 *    controller has finished loading the draft; diffing against the raw stored
 *    JSON string would compare a stored shape against a freshly serialized one
 *    and report every untouched draft as dirty (key order, filled-in defaults,
 *    normalised ids).
 *
 * 2. The seam. The dirty state lives in EditorShell, which owns the controller;
 *    the click that has to be guarded lives in DraftCatalog. Those two are
 *    SIBLINGS under a server component (`src/app/admin/editor/page.tsx`), so a
 *    React context would need a new client wrapper owning the whole page
 *    subtree — a render path around the imperative editor host, for a boolean
 *    read once per navigation. A module-level registry costs three lines,
 *    touches no render path at all, and therefore cannot make React reconcile
 *    inside the contenteditable.
 *
 * The check runs ONCE PER CLICK on a draft link, never per keystroke: nothing
 * here subscribes to input, and EditorShell registers a closure over refs
 * rather than re-registering as the author types.
 */

import type { EditorDocumentBlock, InlineNode, LatestEditorDocumentJson } from './document-json'

/**
 * Everything one „Speichern" would persist that the author can lose: the title
 * field and the serialized document (`exportDocument()` with the ExportBar's
 * Term folded in, exactly as the save payload builds it).
 *
 * The export target (#106) is deliberately NOT part of it — the ExportBar
 * reports the RESOLVED selection on mount, so a draft whose stored Task is null
 * or deleted reports the first tree entry instead, and an untouched draft would
 * look dirty the moment it opened. That is precisely the false positive the
 * ticket warns about, and a mis-set target is one dropdown to fix, not lost
 * writing.
 */
export interface DraftSnapshot {
  /** The title field as typed — normalised here the way a save normalises it. */
  title: string
  /** What the save payload's `content` would be. */
  document: LatestEditorDocumentJson
}

/**
 * The title a save actually writes. EditorShell's `buildDraftFormData` uses
 * this same function, which is what keeps „ Foo " and „Foo" from counting as a
 * change: both are stored as „Foo", so neither is unsaved work.
 */
export function draftSaveTitle(title: string): string {
  return title.trim() || 'Unbenannt'
}

/**
 * Has anything changed since `baseline`?
 *
 * - `baseline === null` — the draft has not finished loading, so there is no
 *   author work in the editor yet and nothing to protect. Asking here would
 *   fire on the one click an author makes fastest: opening a draft and
 *   immediately changing their mind.
 * - `live === null` — the editor could not be serialized at all. Unknowable
 *   rather than unchanged, and the cost of the two answers is not symmetric, so
 *   it asks.
 */
export function hasUnsavedChanges(
  baseline: DraftSnapshot | null,
  live: DraftSnapshot | null
): boolean {
  if (baseline === null) return false
  if (live === null) return true
  return fingerprint(baseline) !== fingerprint(live)
}

/**
 * Comparable string form of a snapshot. Both sides come out of the same
 * serializer, whose key order is fixed by its byte-stability contract
 * (document-json.ts), so `JSON.stringify` is a faithful comparison and not a
 * lucky one.
 */
function fingerprint(snapshot: DraftSnapshot): string {
  const doc = snapshot.document
  return JSON.stringify({
    title: draftSaveTitle(snapshot.title),
    document: { ...doc, content: doc.content.filter(carriesWork) },
  })
}

/**
 * Whether a block is worth prompting about. Everything is, except a blank
 * paragraph.
 *
 * A contenteditable produces blank paragraphs on its own — a browser's bogus
 * `<br>` in an empty editor, a stray Enter — and they carry no writing, so a
 * confirm raised by one is a confirm raised by nothing. That is the failure the
 * ticket names outright: a dialog that fires every time is a dialog people
 * learn to click through.
 *
 * Blank means blank: a paragraph with a Sprungmarke (#71), with block styling,
 * or with any text at all is real content and stays. And dropping blanks from
 * BOTH sides never hides real work — emptying a paragraph that had text still
 * changes the side that had the text.
 */
function carriesWork(block: EditorDocumentBlock): boolean {
  if (block.type !== 'paragraph') return true
  if (block.anchor !== undefined || block.style !== undefined) return true
  if (block.text !== undefined && String(block.text) !== '') return true
  const children = block.children ?? []
  if (children.length === 0) return false
  return !(children.length === 1 && isLineBreak(children[0]!))
}

/** The two shapes the serializer and the reference importer use for `<br>`. */
function isLineBreak(node: InlineNode): boolean {
  if (typeof node !== 'object' || node === null) return false
  if ('br' in node) return node.br === true
  return 'type' in node && node.type === 'br'
}

// ── The seam: EditorShell publishes, DraftCatalog asks ──────────────────────

type DirtyCheck = () => boolean

/**
 * At most one editor is mounted at a time (`/admin/editor` mounts exactly one
 * EditorShell), so one slot is the whole registry. Unregistering compares
 * identity rather than clearing blindly: a keyed remount can run the outgoing
 * shell's cleanup after the incoming one has already registered, and clearing
 * blindly there would leave the new editor unguarded.
 */
let activeCheck: DirtyCheck | null = null

/** Registers the mounted editor's dirty check; the return value unregisters it. */
export function registerUnsavedChangesCheck(check: DirtyCheck): () => void {
  activeCheck = check
  return () => {
    if (activeCheck === check) activeCheck = null
  }
}

/** False when no editor is mounted — there is nothing to lose then. */
export function editorHasUnsavedChanges(): boolean {
  return activeCheck !== null && activeCheck()
}

export const UNSAVED_CHANGES_CONFIRM =
  'Dieser Entwurf hat ungespeicherte Änderungen. Beim Wechsel gehen sie verloren.\n\n' +
  'Trotzdem fortfahren?'

/**
 * May the current editor be left? Silent when there is nothing unsaved — the
 * whole point — and a single confirm otherwise. Cancelling returns false and
 * the caller must `preventDefault()` the navigation: nothing else may change,
 * the draft, its content and its selection all stay exactly as they were.
 */
export function confirmLeaveEditor(): boolean {
  if (!editorHasUnsavedChanges()) return true
  return window.confirm(UNSAVED_CHANGES_CONFIRM)
}
