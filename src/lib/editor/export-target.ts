/**
 * Export-target seeding of the LaTeX editor (#106).
 *
 * The ExportBar's Kurs → Unit → Mini Case selection used to be ephemeral per
 * session: every remount reset it to the first entry of the tree — including
 * the remount the FIRST „Speichern" causes (it navigates to `?draftId=…`,
 * decision D6) — while the publish button silently kept pointing at
 * Kurs 1 → Unit 1 → Mini Case 1. Since #106 the chosen Task is persisted on the
 * draft ROW (`editor_documents.target_task_id`), never in the document JSON:
 * `MetaSchema` is a `z.strictObject`, so a new meta field would earn a document
 * schema version bump (#71 precedent) for a field the student renderer never
 * reads. `published_document_id` is the precedent — publish-target state is a
 * column on the draft.
 *
 * This module is the seeding half, kept pure because the ExportBar itself has
 * no test seam:
 *
 *  • A stored Task still in the tree WINS, and its Kurs and Unit are derived
 *    from where it sits. They are never stored separately — a second stored id
 *    could contradict the first once a Task moves.
 *  • Everything else falls back to the first Kurs → Unit → Task, SILENTLY: no
 *    stored target, or a Task deleted since (the column's `ON DELETE SET NULL`
 *    makes that a NULL), or one that has otherwise left the tree. A NULL column
 *    must seed exactly like a draft that never had a target (#106 decision);
 *    the accepted cost is that the two are indistinguishable.
 *  • Degenerate trees (no Kurse, a Kurs without Units, a Unit without Tasks)
 *    yield empty strings — what the ExportBar's disabled selects already show.
 */

import type { EditorTargetKurs } from '@/types'

/** Ids for the ExportBar's three selects. Empty string = nothing selectable. */
export interface ExportTargetSelection {
  kursId: string
  unitId: string
  taskId: string
}

export function resolveExportTarget(
  tree: EditorTargetKurs[],
  targetTaskId: string | null
): ExportTargetSelection {
  if (targetTaskId) {
    for (const kurs of tree) {
      for (const unit of kurs.units ?? []) {
        if ((unit.tasks ?? []).some((task) => task.id === targetTaskId)) {
          return { kursId: kurs.id, unitId: unit.id, taskId: targetTaskId }
        }
      }
    }
  }
  const kurs = tree[0]
  const unit = kurs?.units?.[0]
  const task = unit?.tasks?.[0]
  return { kursId: kurs?.id ?? '', unitId: unit?.id ?? '', taskId: task?.id ?? '' }
}
