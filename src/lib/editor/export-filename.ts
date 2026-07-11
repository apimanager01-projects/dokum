/**
 * Export-filename builder of the LaTeX editor (PRD #28, slice 10 — #38).
 *
 * Pure, DOM-free port of the standalone editor's filename logic:
 *   • `buildPngFilename`  ← `updateFilename()` (reference L1221–1227) — the
 *     `${term}_C${kurs}_Unit${unit}_MC${mc}.png` template. The hardcoded
 *     dropdown values (Kurs 1–4, Unit 1–5, Mini Case 1–6, Term SS26/WS26)
 *     are replaced by the real course tree: the numbers are the 1-BASED
 *     INDEX of the selection in DAL sort order (`position ASC, created_at
 *     ASC`) — what the admin tree displays — NOT the raw `position` column
 *     (which defaults to 0 and permits gaps/duplicates). Term is a free
 *     text field now; when it is blank the leading `term_` segment is
 *     skipped entirely (approved deviation — the reference select could
 *     never be empty).
 *   • `ensurePngFilename` ← the input normalisation of `exportPng()`
 *     (reference L1285–1286): trim, fall back to `export.png`, append
 *     `.png` unless already present (case-insensitive). Whitespace-only
 *     input also falls back to `export.png` (the reference would have
 *     produced a bare `.png` — approved sanity deviation).
 *   • `documentTitleFromFilename` — new for slice 11 (#39, no reference
 *     counterpart): the publish path's Document-title seed (PRD story 27:
 *     the editable filename seeds the title; there is no separate input).
 */

/** `SS26_C1_Unit2_MC3.png` — or `C1_Unit2_MC3.png` when the Term is blank. */
export function buildPngFilename(
  term: string,
  kursNo: number,
  unitNo: number,
  taskNo: number
): string {
  const trimmed = term.trim()
  const prefix = trimmed ? `${trimmed}_` : ''
  return `${prefix}C${kursNo}_Unit${unitNo}_MC${taskNo}.png`
}

/** Normalises the (freely editable) filename input right before download. */
export function ensurePngFilename(raw: string): string {
  let filename = (raw || 'export.png').trim()
  if (!filename) filename = 'export.png'
  if (!filename.toLowerCase().endsWith('.png')) filename += '.png'
  return filename
}

/**
 * `'SS26_C1_Unit2_MC3.png'` → `'SS26_C1_Unit2_MC3'` — strips ONE trailing
 * `.png` case-insensitively, trims, falls back to `'export'` (belt-and-braces:
 * the publish path always feeds this `ensurePngFilename` output, which is
 * never empty).
 */
export function documentTitleFromFilename(filename: string): string {
  let title = filename.trim()
  if (title.toLowerCase().endsWith('.png')) title = title.slice(0, -4).trim()
  return title || 'export'
}
