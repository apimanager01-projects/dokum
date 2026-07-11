'use server'

import { STORAGE_BUCKET, MAX_FILE_SIZE_BYTES, ALLOWED_IMAGE_MIMES, MIME_TO_EXT } from '@/lib/constants'
import { emptyEditorDocumentJson } from '@/lib/editor/document-json'
import { EditorImageUploadSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, sanitise, removeStorageObjects } from './_shared'

/**
 * Uploads an editor image to the private bucket and records it in
 * `editor_images` (PRD #28, slice 8 — #36). Images NEVER enter the draft JSON
 * as base64 — the document only stores the returned image id, served through
 * /api/editor-image/[imageId].
 *
 * Without `draft_id` the action first creates the implicit „Unbenannt" anchor
 * draft (an anchor row only — content is the canonical empty document, never
 * an autosave) so the image has a row to belong to before the first explicit
 * save. The caller passes the returned `draftId` on every subsequent call.
 */
export async function uploadEditorImage(
  formData: FormData
): Promise<ActionResult<{ imageId: string; draftId: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(EditorImageUploadSchema, formData, ['draft_id'])
  if (!parsed.ok) return { ok: false, error: parsed.error }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { ok: false, error: 'Kein Bild übermittelt.' }
  if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, error: `"${file.name}" ist kein unterstütztes Bildformat (JPEG, PNG, GIF, WebP).` }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: `"${file.name}" ist zu groß (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximal 4 MB pro Bild.` }
  }

  // ── Draft anchor: verify the given draft, or create the implicit one ──────
  let draftId: string
  let anchorCreated = false
  if (parsed.data.draft_id) {
    const { data: draft, error } = await supabase
      .from('editor_documents')
      .select('id')
      .eq('id', parsed.data.draft_id)
      .single()
    if (error || !draft) return { ok: false, error: 'Entwurf nicht gefunden.' }
    draftId = parsed.data.draft_id
  } else {
    const { data: anchor, error } = await supabase
      .from('editor_documents')
      .insert({ title: 'Unbenannt', content: emptyEditorDocumentJson(), created_by: user.id })
      .select('id')
      .single()
    if (error || !anchor) {
      return { ok: false, error: `Entwurf konnte nicht angelegt werden: ${error?.message ?? 'Unbekannter Fehler'}` }
    }
    draftId = anchor.id as string
    anchorCreated = true
    await logAdminAction({
      actorId: user.id,
      action: 'create',
      entityType: 'editor_document',
      entityId: draftId,
      entityTitle: 'Unbenannt',
      metadata: { implicit_anchor: true },
    })
  }

  // ── Upload + row insert (rollback keeps storage, rows and anchor in sync) ──
  const ext = MIME_TO_EXT[file.type] ?? '.jpg'
  const storagePath = `editor-images/${draftId}/${Date.now()}-${sanitise(file.name || 'bild', 40)}${ext}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })
  if (uploadError) {
    await rollbackAnchor(supabase, draftId, anchorCreated)
    return { ok: false, error: `Upload fehlgeschlagen: ${uploadError.message}` }
  }

  const { data: image, error: insertError } = await supabase
    .from('editor_images')
    .insert({ editor_document_id: draftId, file_path: storagePath })
    .select('id')
    .single()
  if (insertError || !image) {
    await removeStorageObjects(supabase, [storagePath], 'uploadEditorImage rollback')
    await rollbackAnchor(supabase, draftId, anchorCreated)
    return { ok: false, error: `Bild konnte nicht gespeichert werden: ${insertError?.message ?? 'Unbekannter Fehler'}` }
  }

  await logAdminAction({
    actorId: user.id,
    action: 'create',
    entityType: 'editor_image',
    entityId: image.id,
    metadata: { draft_id: draftId, file_path: storagePath },
  })
  revalidateAdminPages()
  return { ok: true, data: { imageId: image.id, draftId } }
}

// ── Internal helpers ─────────────────────────────────────────────────────────

type SupabaseClient = Awaited<ReturnType<typeof getAdminUser>>['supabase']

// Failed uploads must not leave an empty implicit anchor behind — the anchor
// exists "exactly once, only when needed" (#36 acceptance criterion).
async function rollbackAnchor(supabase: SupabaseClient, draftId: string, anchorCreated: boolean) {
  if (!anchorCreated) return
  const { error } = await supabase.from('editor_documents').delete().eq('id', draftId)
  if (error) console.error('[uploadEditorImage rollback] anchor delete failed:', error)
}
