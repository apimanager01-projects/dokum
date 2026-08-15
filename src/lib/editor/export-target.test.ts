/**
 * export-target tests (#106).
 *
 * The rules the ExportBar seeds from: a stored Task wins and implies its Kurs
 * and Unit; anything unresolvable falls back to the first entry SILENTLY (the
 * ticket declined a „Das gespeicherte Ziel existiert nicht mehr" note, so a
 * deleted target and a never-set one must be indistinguishable here).
 */

import { describe, expect, it } from 'vitest'
import type { EditorTargetKurs } from '@/types'
import { resolveExportTarget } from './export-target'

function task(id: string) {
  return { id, title: id, position: 0, created_at: '2026-01-01T00:00:00Z' }
}
function unit(id: string, tasks: ReturnType<typeof task>[]) {
  return { id, title: id, position: 0, created_at: '2026-01-01T00:00:00Z', tasks }
}
function kurs(id: string, units: ReturnType<typeof unit>[]): EditorTargetKurs {
  return { id, title: id, position: 0, created_at: '2026-01-01T00:00:00Z', published: true, units }
}

const TREE: EditorTargetKurs[] = [
  kurs('k1', [unit('u1', [task('t1'), task('t2')]), unit('u2', [task('t3')])]),
  kurs('k2', [unit('u3', [task('t4')])]),
]

describe('resolveExportTarget', () => {
  it('seeds the first Kurs → Unit → Task when no target is stored', () => {
    expect(resolveExportTarget(TREE, null)).toEqual({ kursId: 'k1', unitId: 'u1', taskId: 't1' })
  })

  it('restores a stored target and derives its Kurs and Unit', () => {
    expect(resolveExportTarget(TREE, 't3')).toEqual({ kursId: 'k1', unitId: 'u2', taskId: 't3' })
    expect(resolveExportTarget(TREE, 't4')).toEqual({ kursId: 'k2', unitId: 'u3', taskId: 't4' })
  })

  it('restores a target that is not the first Task of its Unit', () => {
    expect(resolveExportTarget(TREE, 't2')).toEqual({ kursId: 'k1', unitId: 'u1', taskId: 't2' })
  })

  it('falls back to the first entry when the stored Task is gone — like a draft that never had one', () => {
    // ON DELETE SET NULL turns a deleted Task into null; a stale id can still
    // arrive from a tree the client has not refreshed. Both take the same path.
    expect(resolveExportTarget(TREE, 'deleted')).toEqual(resolveExportTarget(TREE, null))
    expect(resolveExportTarget(TREE, 'deleted')).toEqual({ kursId: 'k1', unitId: 'u1', taskId: 't1' })
  })

  it('treats an empty string like no target at all', () => {
    expect(resolveExportTarget(TREE, '')).toEqual({ kursId: 'k1', unitId: 'u1', taskId: 't1' })
  })

  it('returns empty ids for an empty tree', () => {
    expect(resolveExportTarget([], null)).toEqual({ kursId: '', unitId: '', taskId: '' })
    expect(resolveExportTarget([], 't1')).toEqual({ kursId: '', unitId: '', taskId: '' })
  })

  it('degrades one level at a time: Kurs without Units, Unit without Tasks', () => {
    expect(resolveExportTarget([kurs('k1', [])], 't1')).toEqual({
      kursId: 'k1',
      unitId: '',
      taskId: '',
    })
    expect(resolveExportTarget([kurs('k1', [unit('u1', [])])], 't1')).toEqual({
      kursId: 'k1',
      unitId: 'u1',
      taskId: '',
    })
  })

  it('never searches past the first match', () => {
    // Two Kurse cannot legitimately hold one Task id; if they somehow do, the
    // first in DAL order wins — deterministic beats clever.
    const duplicated = [kurs('k1', [unit('u1', [task('dup')])]), kurs('k2', [unit('u2', [task('dup')])])]
    expect(resolveExportTarget(duplicated, 'dup')).toEqual({
      kursId: 'k1',
      unitId: 'u1',
      taskId: 'dup',
    })
  })
})
