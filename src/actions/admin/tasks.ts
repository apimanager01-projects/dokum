'use server'

import { TaskFormSchema, DocumentUpdateMetaSchema } from '@/lib/schemas'
import type { ActionResult } from '@/types'
import { logAdminAction } from '@/lib/audit'
import { getAdminUser, parseForm, revalidateAdminPages, collectStoragePaths, removeStorageObjects, type DocumentFileRef } from './_shared'

export async function createTask(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(TaskFormSchema, formData, ['unit_id', 'title', 'description', 'position'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { unit_id, title, description, position } = parsed.data

  const { data, error } = await supabase
    .from('tasks')
    .insert({ unit_id, title, description, position })
    .select('id')
    .single()
  if (error) return { ok: false, error: `Failed to create Task: ${error.message}` }

  await logAdminAction({ actorId: user.id, action: 'create', entityType: 'task', entityId: data.id, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: { id: data.id } }
}

export async function updateTask(taskId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(DocumentUpdateMetaSchema, formData, ['title', 'description', 'position'])
  if (!parsed.ok) return { ok: false, error: parsed.error }
  const { title, description, position } = parsed.data

  const { error } = await supabase.from('tasks').update({ title, description, position }).eq('id', taskId)
  if (error) return { ok: false, error: error.message }

  await logAdminAction({ actorId: user.id, action: 'update', entityType: 'task', entityId: taskId, entityTitle: title })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const { data: task } = await supabase
    .from('tasks')
    .select('id, documents(file_path, file_type, document_images(file_path))')
    .eq('id', taskId)
    .single()

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) return { ok: false, error: error.message }

  const paths = collectStoragePaths((task?.documents ?? []) as DocumentFileRef[])
  await removeStorageObjects(supabase, paths, 'deleteTask')

  await logAdminAction({ actorId: user.id, action: 'delete', entityType: 'task', entityId: taskId, metadata: { paths_deleted: paths.length } })
  revalidateAdminPages()
  return { ok: true, data: undefined }
}
