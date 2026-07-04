/**
 * Formula-library dedup/sync decisions for the LaTeX editor (PRD #28,
 * slice 4 — #32).
 *
 * Pure decision logic extracted from the standalone reference file
 * latexEditor/latex_editor_FIXED_JSON_IMPORT_COMPLETE_OUTPUT_AS_INPUT_LATEX_FIX.htm.html:
 *
 * - `shouldAddToLibrary` ← the guard clauses of `addToLibrary` (base script
 *   L1074–1080): empty LaTeX is never added, duplicates are rejected.
 * - `librarySyncAction` ← `syncFormulaLibraryAfterEdit` of the "Editing an
 *   existing LaTeX formula updates it" patch layer (L2647) — its only
 *   definition. The controller applies the returned action to the sidebar
 *   DOM; this module only decides.
 *
 * Library entries are identified by their exact raw-LaTeX string
 * (`dataset.latex` in the sidebar); `existing` is the current item list in
 * sidebar order. The library is session-scoped by design (PRD: no
 * persistence across sessions or drafts).
 *
 * Pure and DOM-free — the tests encode the dedup acceptance criteria of #32.
 */

/** What the sidebar must do after a formula edit. Indices point into `existing`. */
export type LibrarySyncAction =
  | { kind: 'noop' }
  | { kind: 'remove-old'; index: number }
  | { kind: 'update-old'; index: number }
  | { kind: 'add' }

/** `addToLibrary` guard: empty LaTeX is never added, duplicates are rejected. */
export function shouldAddToLibrary(existing: readonly string[], latex: string): boolean {
  return Boolean(latex) && !existing.includes(latex)
}

/**
 * Decides how the library follows an edit of a formula block from `oldLatex`
 * to `newLatex` (reference semantics, patch L2647):
 *
 * - empty `newLatex` → noop;
 * - `newLatex` already has a DIFFERENT entry (edit collision) → remove the
 *   `oldLatex` entry and keep the existing one (noop when there is no old
 *   entry — the existing one already covers the formula);
 * - an `oldLatex` entry exists → update it in place (this includes the
 *   unchanged-LaTeX case: the entry is refreshed, never duplicated);
 * - otherwise → add `newLatex` as a new entry (covers entries the admin
 *   removed by hand and blocks that never had one, e.g. sample content).
 */
export function librarySyncAction(
  existing: readonly string[],
  oldLatex: string,
  newLatex: string
): LibrarySyncAction {
  if (!newLatex) return { kind: 'noop' }
  const oldIndex = oldLatex ? existing.indexOf(oldLatex) : -1
  const existingIndex = existing.indexOf(newLatex)
  if (existingIndex !== -1 && existingIndex !== oldIndex) {
    return oldIndex !== -1 ? { kind: 'remove-old', index: oldIndex } : { kind: 'noop' }
  }
  if (oldIndex !== -1) return { kind: 'update-old', index: oldIndex }
  return { kind: 'add' }
}
