'use server'

import { STORAGE_BUCKET, MAX_FILE_SIZE_BYTES } from '@/lib/constants'
import { EditorPublishSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, sanitise, removeStorageObjects } from './_shared'

/**
 * Publishes an editor draft as a Document under a Task (PRD #28, slice 11 —
 * #39): the client-rendered PNG becomes a real Document through the existing
 * document pipeline — the storage-upload / rollback / audit / revalidation
 * flow deliberately MIRRORS the single-file branches of createDocument /
 * updateDocument (documents.ts) instead of refactoring them (approved: zero
 * blast radius on shipped flows).
 *
 * `mode: 'update'` (default) updates the linked Document's FILE + TITLE in
 * place when a live link exists — task_id/description/position stay untouched
 * ("in place" = same place; relocation is „Als neues Dokument" + manual
 * delete). Students keep the same Document entry (story 32): the id never
 * changes and /api/file/[docId] reads file_path at request time. When the
 * link is dead (Document deleted → FK SET NULL, or lost in a race) the same
 * call falls back to creating a new Document — the deleted-link fallback.
 * `mode: 'new'` („Als neues Dokument") always creates and RE-LINKS the draft.
 *
 * The draft row is not touched on update-in-place (its updated_at must not
 * reorder the draft list); on the create paths only published_document_id
 * changes — a failed link update rolls the whole publish back, because an
 * unlinked publish would silently duplicate on the next one.
 */
export async function publishEditorDraft(
  formData: FormData
): Promise<ActionResult<{ documentId: string; mode: 'created' | 'updated' }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(EditorPublishSchema, formData, ['draft_id', 'task_id', 'title', 'mode'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { draft_id, task_id, title, mode } = parsed.data

  // The PNG itself — validated manually (documents.ts precedent). The size
  // re-check backs the client-side pre-check (ExportBar); an honest client
  // never sends an oversized request.
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { ok: false, error: 'Kein PNG übermittelt.' }
  if (file.type !== 'image/png') {
    return { ok: false, error: 'Nur PNG-Dateien können veröffentlicht werden.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      error: `Das PNG ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximal 4 MB.`,
    }
  }

  const { data: draft, error: draftErr } = await supabase
    .from('editor_documents')
    .select('id, published_document_id')
    .eq('id', draft_id)
    .single()
  if (draftErr || !draft) return { ok: false, error: 'Entwurf nicht gefunden.' }

  // ── Update-in-place path (default when a LIVE link exists) ────────────────
  if (mode === 'update' && draft.published_document_id) {
    const { data: linkedDoc, error: linkedErr } = await supabase
      .from('documents')
      .select('id, file_path')
      .eq('id', draft.published_document_id)
      .single()

    // Only a genuine "no rows" (PGRST116) means the link is dead and we may
    // fall through to create. A transient read error must NOT be mistaken for
    // a deleted link — falling through would create a duplicate Document and
    // orphan the still-live original.
    if (linkedErr && linkedErr.code !== 'PGRST116') {
      return {
        ok: false,
        error: `Verknüpftes Dokument konnte nicht gelesen werden: ${linkedErr.message}`,
      }
    }

    if (linkedDoc) {
      const newPath = `documents/${user.id}/${Date.now()}-${sanitise(title)}.png`

      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(newPath, file, { contentType: 'image/png', upsert: false })
      if (uploadErr) return { ok: false, error: `Upload fehlgeschlagen: ${uploadErr.message}` }

      const { error: dbErr } = await supabase
        .from('documents')
        .update({ title, file_path: newPath, file_type: 'image' })
        .eq('id', linkedDoc.id)
      if (dbErr) {
        await removeStorageObjects(supabase, [newPath], 'publishEditorDraft update rollback')
        return { ok: false, error: `Dokument konnte nicht aktualisiert werden: ${dbErr.message}` }
      }

      if (linkedDoc.file_path) {
        await removeStorageObjects(supabase, [linkedDoc.file_path], 'publishEditorDraft old-file cleanup')
      }

      await logAdminAction({
        actorId: user.id,
        action: 'update',
        entityType: 'document',
        entityId: linkedDoc.id,
        entityTitle: title,
        metadata: { editor_document_id: draft_id, published_in_place: true },
      })
      revalidateAdminPages()
      return { ok: true, data: { documentId: linkedDoc.id, mode: 'updated' } }
    }
    // Linked Document vanished (deleted → FK SET NULL, or race) → fall
    // through to the create path instead of erroring (acceptance criterion).
  }

  // ── Create path (first publish, „Als neues Dokument", dead-link fallback) ──
  const storagePath = `documents/${user.id}/${Date.now()}-${sanitise(title)}.png`

  const { error: uploadErr } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: 'image/png', upsert: false })
  if (uploadErr) return { ok: false, error: `Upload fehlgeschlagen: ${uploadErr.message}` }

  const { data: insertedDoc, error: insertErr } = await supabase
    .from('documents')
    .insert({ task_id, title, description: null, file_path: storagePath, file_type: 'image', position: 0 })
    .select('id')
    .single()
  if (insertErr || !insertedDoc) {
    await removeStorageObjects(supabase, [storagePath], 'publishEditorDraft create rollback')
    return { ok: false, error: `Dokument konnte nicht angelegt werden: ${insertErr?.message ?? 'Unbekannter Fehler'}` }
  }

  const { error: linkErr } = await supabase
    .from('editor_documents')
    .update({ published_document_id: insertedDoc.id })
    .eq('id', draft_id)
  if (linkErr) {
    // Full rollback: an unlinked Document would duplicate on the next publish.
    const { error: delErr } = await supabase.from('documents').delete().eq('id', insertedDoc.id)
    if (delErr) console.error('[publishEditorDraft link rollback] document delete failed:', delErr)
    await removeStorageObjects(supabase, [storagePath], 'publishEditorDraft link rollback')
    return { ok: false, error: `Entwurf konnte nicht mit dem Dokument verknüpft werden: ${linkErr.message}` }
  }

  await logAdminAction({
    actorId: user.id,
    action: 'create',
    entityType: 'document',
    entityId: insertedDoc.id,
    entityTitle: title,
    metadata: { editor_document_id: draft_id },
  })
  // The link change is a draft mutation of its own (operator story 35).
  await logAdminAction({
    actorId: user.id,
    action: 'update',
    entityType: 'editor_document',
    entityId: draft_id,
    metadata: { published_document_id: insertedDoc.id },
  })
  revalidateAdminPages()
  return { ok: true, data: { documentId: insertedDoc.id, mode: 'created' } }
}
