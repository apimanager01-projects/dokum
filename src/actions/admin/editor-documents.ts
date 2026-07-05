'use server'

import { EditorDraftFormSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages } from './_shared'

// Editor drafts (PRD #28, slice 7 — #35). Drafts live outside the
// Kurs → Unit → Task → Document hierarchy until published (slice 11).
// Storage cleanup for draft images arrives with slice 8 (#36).

export async function createEditorDraft(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(EditorDraftFormSchema, formData, ['title', 'content'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, content } = parsed.data

  const { data, error } = await supabase
    .from('editor_documents')
    .insert({ title, content, created_by: user.id })
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

  const parsed = parseForm(EditorDraftFormSchema, formData, ['title', 'content'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, content } = parsed.data

  const { data, error } = await supabase
    .from('editor_documents')
    .update({ title, content })
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

  await logAdminAction({ actorId: user.id, action: 'update', entityType: 'editor_document', entityId: draftId, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

export async function deleteEditorDraft(draftId: string): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const { data: draft, error: fetchErr } = await supabase
    .from('editor_documents')
    .select('title')
    .eq('id', draftId)
    .single()
  if (fetchErr || !draft) return { ok: false, error: 'Entwurf nicht gefunden.' }

  const { error } = await supabase.from('editor_documents').delete().eq('id', draftId)
  if (error) return { ok: false, error: `Entwurf konnte nicht gelöscht werden: ${error.message}` }

  await logAdminAction({ actorId: user.id, action: 'delete', entityType: 'editor_document', entityId: draftId, entityTitle: draft.title })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}
