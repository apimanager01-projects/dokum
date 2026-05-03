'use server'

import { STORAGE_BUCKET } from '@/lib/constants'
import { UnitFormSchema, DocumentUpdateMetaSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, collectStoragePaths, type DocumentFileRef } from './_shared'

export async function createUnit(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(UnitFormSchema, formData, ['kurs_id', 'title', 'description', 'position'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { kurs_id, title, description, position } = parsed.data

  const { data, error } = await supabase
    .from('units')
    .insert({ kurs_id, title, description, position })
    .select('id')
    .single()
  if (error) return { ok: false, error: `Failed to create Unit: ${error.message}` }

  await logAdminAction({ actorId: user.id, action: 'create', entityType: 'unit', entityId: data.id, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: { id: data.id } }
}

export async function updateUnit(unitId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(DocumentUpdateMetaSchema, formData, ['title', 'description', 'position'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, description, position } = parsed.data

  const { error } = await supabase.from('units').update({ title, description, position }).eq('id', unitId)
  if (error) return { ok: false, error: error.message }

  await logAdminAction({ actorId: user.id, action: 'update', entityType: 'unit', entityId: unitId, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

export async function deleteUnit(unitId: string): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const { data: unit } = await supabase
    .from('units')
    .select('id, tasks(id, documents(file_path, file_type, document_images(file_path)))')
    .eq('id', unitId)
    .single()

  const { error } = await supabase.from('units').delete().eq('id', unitId)
  if (error) return { ok: false, error: error.message }

  const allDocs = (unit?.tasks ?? []).flatMap((t) => (t as any).documents ?? []) as DocumentFileRef[]
  const paths = collectStoragePaths(allDocs)
  if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths)

  await logAdminAction({ actorId: user.id, action: 'delete', entityType: 'unit', entityId: unitId, metadata: { paths_deleted: paths.length } })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}
