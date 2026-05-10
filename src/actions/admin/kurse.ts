'use server'

import { KursFormSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, collectStoragePaths, removeStorageObjects, type DocumentFileRef } from './_shared'

export async function createKurs(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(KursFormSchema, formData, ['title', 'description', 'position', 'published'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, description, position, published } = parsed.data

  const { data, error } = await supabase
    .from('kurse')
    .insert({ title, description, position, published })
    .select('id')
    .single()
  if (error) return { ok: false, error: `Failed to create Kurs: ${error.message}` }

  await logAdminAction({ actorId: user.id, action: 'create', entityType: 'kurs', entityId: data.id, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: { id: data.id } }
}

export async function updateKurs(kursId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(KursFormSchema, formData, ['title', 'description', 'position', 'published'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, description, position, published } = parsed.data

  const { error } = await supabase.from('kurse').update({ title, description, position, published }).eq('id', kursId)
  if (error) return { ok: false, error: error.message }

  await logAdminAction({ actorId: user.id, action: 'update', entityType: 'kurs', entityId: kursId, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

export async function deleteKurs(kursId: string): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const { data: kurs } = await supabase
    .from('kurse')
    .select('id, units(id, tasks(id, documents(file_path, file_type, document_images(file_path))))')
    .eq('id', kursId)
    .single()

  const { error } = await supabase.from('kurse').delete().eq('id', kursId)
  if (error) return { ok: false, error: error.message }

  const allDocs = (kurs?.units ?? [])
    .flatMap((u) => (u as any).tasks ?? [])
    .flatMap((t: any) => t.documents ?? []) as DocumentFileRef[]
  const paths = collectStoragePaths(allDocs)
  await removeStorageObjects(supabase, paths, 'deleteKurs')

  await logAdminAction({ actorId: user.id, action: 'delete', entityType: 'kurs', entityId: kursId, metadata: { paths_deleted: paths.length } })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}
