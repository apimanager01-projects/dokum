'use server'

import { collectReferencedImageIds } from '@/lib/editor/document-json'
import { EditorDraftFormSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, removeStorageObjects } from './_shared'

// Editor drafts (PRD #28, slice 7 — #35). Drafts live outside the
// Kurs → Unit → Task → Document hierarchy until published (slice 11).
// Image cleanup (slice 8, #36) is reconciliation-based: contenteditable undo
// (Ctrl+Z) can resurrect a deleted image block, so rows/objects are removed
// when a SAVE no longer references them — never at the keystroke that removed
// the block. Deleting a draft cleans up all its images immediately.
//
// The export target (#106) rides along on BOTH save paths: the ExportBar's
// live Kurs → Unit → Mini Case selection is stored as `target_task_id` on the
// draft row — a column, not a field in the document JSON (that would earn a
// schema version bump; `published_document_id` is the precedent). Every save
// writes it, so the shell must always send the field: a save that omitted it
// would clear the target rather than leave it alone.

export async function createEditorDraft(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(EditorDraftFormSchema, formData, ['title', 'content', 'target_task_id'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, content, target_task_id } = parsed.data

  const { data, error } = await supabase
    .from('editor_documents')
    .insert({ title, content, target_task_id, created_by: user.id })
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, error: `Entwurf konnte nicht gespeichert werden: ${error?.message ?? 'Unbekannter Fehler'}` }
  }

  await logAdminAction({ actorId: user.id, action: 'create', entityType: 'editor_document', entityId: data.id, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: { id: data.id } }
}

export async function updateEditorDraft(draftId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(EditorDraftFormSchema, formData, ['title', 'content', 'target_task_id'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, content, target_task_id } = parsed.data

  const { data, error } = await supabase
    .from('editor_documents')
    .update({ title, content, target_task_id })
    .eq('id', draftId)
    .select('id')
    .single()
  if (error || !data) {
    // PGRST116 = no row matched (.single() on empty result)
    if (error && error.code !== 'PGRST116') {
      return { ok: false, error: `Entwurf konnte nicht gespeichert werden: ${error.message}` }
    }
    return { ok: false, error: 'Entwurf nicht gefunden.' }
  }

  // Save-time image reconciliation (slice 8): rows of this draft that the
  // just-saved content no longer references lose their storage object and
  // row. Cleanup failures must never fail the save (audit-log philosophy).
  const imagesDeleted = await deleteUnreferencedImages(supabase, draftId, collectReferencedImageIds(content))

  await logAdminAction({
    actorId: user.id,
    action: 'update',
    entityType: 'editor_document',
    entityId: draftId,
    entityTitle: title,
    ...(imagesDeleted > 0 ? { metadata: { images_deleted: imagesDeleted } } : {}),
  })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

export async function deleteEditorDraft(draftId: string): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const { data: draft, error: fetchErr } = await supabase
    .from('editor_documents')
    .select('title, editor_images(file_path)')
    .eq('id', draftId)
    .single()
  if (fetchErr || !draft) return { ok: false, error: 'Entwurf nicht gefunden.' }

  const { error } = await supabase.from('editor_documents').delete().eq('id', draftId)
  if (error) return { ok: false, error: `Entwurf konnte nicht gelöscht werden: ${error.message}` }

  // editor_images rows cascaded with the draft; the bucket objects remain
  // until removed here (paths were captured before the delete).
  const imagePaths = (draft.editor_images ?? []).map((i) => i.file_path)
  await removeStorageObjects(supabase, imagePaths, 'deleteEditorDraft')

  await logAdminAction({
    actorId: user.id,
    action: 'delete',
    entityType: 'editor_document',
    entityId: draftId,
    entityTitle: draft.title,
    metadata: { images_deleted: imagePaths.length },
  })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

// ── Internal helpers ─────────────────────────────────────────────────────────

type SupabaseClient = Awaited<ReturnType<typeof getAdminUser>>['supabase']

async function deleteUnreferencedImages(
  supabase: SupabaseClient,
  draftId: string,
  referencedIds: string[],
): Promise<number> {
  const { data: rows, error } = await supabase
    .from('editor_images')
    .select('id, file_path')
    .eq('editor_document_id', draftId)
  if (error) {
    console.error('[updateEditorDraft image cleanup] select failed:', error)
    return 0
  }
  const referenced = new Set(referencedIds)
  const stale = (rows ?? []).filter((r) => !referenced.has(r.id))
  if (stale.length === 0) return 0

  const { error: deleteError } = await supabase
    .from('editor_images')
    .delete()
    .in('id', stale.map((r) => r.id))
  if (deleteError) {
    console.error('[updateEditorDraft image cleanup] delete failed:', deleteError)
    return 0
  }
  await removeStorageObjects(supabase, stale.map((r) => r.file_path), 'updateEditorDraft image cleanup')
  return stale.length
}
