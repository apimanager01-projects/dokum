'use client'

import { useState, type RefObject } from 'react'
import type { EditorController } from '@/lib/editor/controller'
import { buildPngFilename, ensurePngFilename } from '@/lib/editor/export-filename'
import type { EditorTargetKurs } from '@/types'

/**
 * Export rows of the LaTeX editor (PRD #28, slice 10 — #38): a port of the
 * reference file's two `.export-row`s (L550–587) with the hardcoded
 * Kurs 1–4 / Unit 1–5 / Mini Case 1–6 dropdowns replaced by the REAL course
 * tree (DAL-fed via the page's server component) and the SS26/WS26 Term
 * select replaced by a free text field. „Als HTML speichern" is not ported —
 * dead code in the reference (`downloadHtml()` was never defined; PRD
 * decision).
 *
 * Semantics (reference parity):
 *  • Any Kurs/Unit/Task/Term change REBUILDS and overwrites the filename
 *    (`updateFilename()`, L1221–1227); manual filename edits persist until
 *    the next such change. Built once on mount when a full selection exists.
 *  • Ordinals are the 1-based index in DAL sort order (what the admin tree
 *    shows), not the raw `position` column.
 *  • Changing a parent select cascades: the child resets to its first entry
 *    (the reference's independent dropdowns had no hierarchy to respect).
 *  • Degenerate trees (Kurs without Units, Unit without Tasks, no Kurse):
 *    child selects are disabled, the filename is left untouched, and the
 *    download still works with the manually editable filename.
 *  • Download: controller.exportToPng() → Blob → temporary object URL →
 *    <a download> (the reference used a data URL; the Blob is the PRD's
 *    shared pipeline for slice 11's publish path). Failures alert in German
 *    (reference L1351). The button is disabled while an export runs —
 *    approved deviation: a re-entrant run would corrupt the DOM swap/restore.
 *
 * The Term value is lifted to EditorShell: it persists in the draft JSON as
 * `meta.term` on save (decision D11 reserved it for this slice) and reloads
 * with the draft. The Kurs/Unit/Task selection is deliberately ephemeral per
 * session — only slice 11's publish consumes it live.
 */

const LABEL_STYLE = { fontSize: 13, color: '#374151' } as const

export function ExportBar({
  controllerRef,
  targetTree,
  term,
  onTermChange,
}: {
  controllerRef: RefObject<EditorController | null>
  targetTree: EditorTargetKurs[]
  term: string
  onTermChange: (term: string) => void
}) {
  // Reference parity: preselect the first Kurs → Unit → Task; the initial
  // filename is built from that selection (ordinals 1/1/1) when it is
  // complete, else the reference input default `export.png`.
  const [kursId, setKursId] = useState(() => targetTree[0]?.id ?? '')
  const [unitId, setUnitId] = useState(() => targetTree[0]?.units[0]?.id ?? '')
  const [taskId, setTaskId] = useState(() => targetTree[0]?.units[0]?.tasks[0]?.id ?? '')
  const [filename, setFilename] = useState(() =>
    targetTree[0]?.units[0]?.tasks[0] ? buildPngFilename(term, 1, 1, 1) : 'export.png'
  )
  const [exporting, setExporting] = useState(false)

  const kurs = targetTree.find((k) => k.id === kursId)
  const units = kurs?.units ?? []
  const unit = units.find((u) => u.id === unitId)
  const tasks = unit?.tasks ?? []

  /** Overwrites the filename when the new selection is complete (reference `updateFilename()`). */
  function rebuildFilename(nextKursId: string, nextUnitId: string, nextTaskId: string, nextTerm: string) {
    const built = builtFilename(targetTree, nextKursId, nextUnitId, nextTaskId, nextTerm)
    if (built !== null) setFilename(built)
  }

  function handleKursChange(id: string) {
    const nextKurs = targetTree.find((k) => k.id === id)
    const nextUnitId = nextKurs?.units[0]?.id ?? ''
    const nextTaskId = nextKurs?.units[0]?.tasks[0]?.id ?? ''
    setKursId(id)
    setUnitId(nextUnitId)
    setTaskId(nextTaskId)
    rebuildFilename(id, nextUnitId, nextTaskId, term)
  }

  function handleUnitChange(id: string) {
    const nextUnit = units.find((u) => u.id === id)
    const nextTaskId = nextUnit?.tasks[0]?.id ?? ''
    setUnitId(id)
    setTaskId(nextTaskId)
    rebuildFilename(kursId, id, nextTaskId, term)
  }

  function handleTaskChange(id: string) {
    setTaskId(id)
    rebuildFilename(kursId, unitId, id, term)
  }

  function handleTermChange(value: string) {
    onTermChange(value)
    rebuildFilename(kursId, unitId, taskId, value)
  }

  async function handleDownload() {
    const controller = controllerRef.current
    if (!controller || exporting) return
    setExporting(true)
    try {
      const blob = await controller.exportToPng()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = ensurePngFilename(filename)
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      // Reference L1351 — restore already ran inside the pipeline.
      window.alert(
        'PNG-Export fehlgeschlagen: ' + (err instanceof Error ? err.message : String(err))
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="export-row">
        <label htmlFor="selKurs" style={LABEL_STYLE}>
          Kurs:
        </label>
        <select
          id="selKurs"
          value={kursId}
          disabled={targetTree.length === 0}
          onChange={(e) => handleKursChange(e.target.value)}
        >
          {targetTree.map((k, i) => (
            <option key={k.id} value={k.id}>
              {i + 1} — {k.title}
            </option>
          ))}
        </select>
        <label htmlFor="exportTerm" style={LABEL_STYLE}>
          Term:
        </label>
        <input
          id="exportTerm"
          type="text"
          value={term}
          placeholder="z. B. SS26"
          style={{ maxWidth: 120 }}
          onChange={(e) => handleTermChange(e.target.value)}
        />
        <label htmlFor="selUnit" style={LABEL_STYLE}>
          Unit:
        </label>
        <select
          id="selUnit"
          value={unitId}
          disabled={units.length === 0}
          onChange={(e) => handleUnitChange(e.target.value)}
        >
          {units.map((u, i) => (
            <option key={u.id} value={u.id}>
              {i + 1} — {u.title}
            </option>
          ))}
        </select>
        <label htmlFor="selMC" style={LABEL_STYLE}>
          Mini Case:
        </label>
        <select
          id="selMC"
          value={taskId}
          disabled={tasks.length === 0}
          onChange={(e) => handleTaskChange(e.target.value)}
        >
          {tasks.map((t, i) => (
            <option key={t.id} value={t.id}>
              {i + 1} — {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="export-row">
        <label htmlFor="pngFilename" style={LABEL_STYLE}>
          Dateiname:
        </label>
        <input
          id="pngFilename"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button type="button" className="primary" disabled={exporting} onClick={handleDownload}>
          {exporting ? 'PNG wird erstellt …' : 'Als PNG herunterladen'}
        </button>
      </div>
    </>
  )
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * `buildPngFilename` over the 1-based indices of the selection, or null when
 * the selection is incomplete (degenerate tree → filename stays untouched).
 */
function builtFilename(
  tree: EditorTargetKurs[],
  kursId: string,
  unitId: string,
  taskId: string,
  term: string
): string | null {
  const kursIndex = tree.findIndex((k) => k.id === kursId)
  if (kursIndex < 0) return null
  const unitIndex = tree[kursIndex].units.findIndex((u) => u.id === unitId)
  if (unitIndex < 0) return null
  const taskIndex = tree[kursIndex].units[unitIndex].tasks.findIndex((t) => t.id === taskId)
  if (taskIndex < 0) return null
  return buildPngFilename(term, kursIndex + 1, unitIndex + 1, taskIndex + 1)
}
