'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = {
  error?: string
  success?: boolean
  id?: string
}

async function getAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  return { supabase, user }
}

export async function createKurs(formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()

  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)
  const published = formData.get('published') === 'true'

  if (!title) return { error: 'Title is required.' }

  const { data, error } = await supabase
    .from('kurse')
    .insert({ title, description, position, published })
    .select('id')
    .single()
  if (error) return { error: `Failed to create Kurs: ${error.message}` }

  revalidatePath('/admin/kurse/new')
  revalidatePath('/', 'layout')
  return { success: true, id: data.id }
}

export async function createUnit(formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()

  const kurs_id = (formData.get('kurs_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!kurs_id) return { error: 'Please select a Kurs.' }
  if (!title) return { error: 'Title is required.' }

  const { data, error } = await supabase
    .from('units')
    .insert({ kurs_id, title, description, position })
    .select('id')
    .single()
  if (error) return { error: `Failed to create Unit: ${error.message}` }

  revalidatePath('/admin/units/new')
  revalidatePath('/', 'layout')
  return { success: true, id: data.id }
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()

  const unit_id = (formData.get('unit_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!unit_id) return { error: 'Please select a Unit.' }
  if (!title) return { error: 'Title is required.' }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ unit_id, title, description, position })
    .select('id')
    .single()
  if (error) return { error: `Failed to create Task: ${error.message}` }

  revalidatePath('/admin/tasks/new')
  revalidatePath('/', 'layout')
  return { success: true, id: data.id }
}

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_MIMES = ['application/pdf', ...IMAGE_MIMES]
const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

export async function createDocument(formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const task_id = (formData.get('task_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const file = formData.get('pdf') as File | null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!task_id) return { error: 'Please select a Task.' }
  if (!title) return { error: 'Title is required.' }
  if (!file || file.size === 0) return { error: 'A file is required.' }
  if (!ALLOWED_MIMES.includes(file.type)) return { error: 'Only PDF, JPEG, PNG, GIF, or WebP files are allowed.' }

  const file_type = IMAGE_MIMES.includes(file.type) ? 'image' : 'pdf'
  const ext = MIME_TO_EXT[file.type] ?? '.bin'

  const sanitisedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const storagePath = `documents/${user.id}/${Date.now()}-${sanitisedTitle}${ext}`

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` }

  const { error: insertError } = await supabase
    .from('documents')
    .insert({ task_id, title, description, file_path: storagePath, file_type, position })

  if (insertError) {
    await supabase.storage.from('pdfs').remove([storagePath])
    return { error: `Failed to save document: ${insertError.message}` }
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteTask(taskId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: task } = await supabase
    .from('tasks')
    .select('id, documents(file_path)')
    .eq('id', taskId)
    .single()

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) return { error: error.message }

  const paths = ((task?.documents ?? []) as { file_path: string }[])
    .map((d) => d.file_path)
    .filter(Boolean)
  if (paths.length) await supabase.storage.from('pdfs').remove(paths)

  revalidatePath('/admin/tasks/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteUnit(unitId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: unit } = await supabase
    .from('units')
    .select('id, tasks(id, documents(file_path))')
    .eq('id', unitId)
    .single()

  const { error } = await supabase.from('units').delete().eq('id', unitId)
  if (error) return { error: error.message }

  const paths = ((unit?.tasks ?? []) as { documents: { file_path: string }[] }[])
    .flatMap((t) => t.documents.map((d) => d.file_path))
    .filter(Boolean)
  if (paths.length) await supabase.storage.from('pdfs').remove(paths)

  revalidatePath('/admin/units/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteKurs(kursId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: kurs } = await supabase
    .from('kurse')
    .select('id, units(id, tasks(id, documents(file_path)))')
    .eq('id', kursId)
    .single()

  const { error } = await supabase.from('kurse').delete().eq('id', kursId)
  if (error) return { error: error.message }

  const paths = ((kurs?.units ?? []) as { tasks: { documents: { file_path: string }[] }[] }[])
    .flatMap((u) => u.tasks.flatMap((t) => t.documents.map((d) => d.file_path)))
    .filter(Boolean)
  if (paths.length) await supabase.storage.from('pdfs').remove(paths)

  revalidatePath('/admin/kurse/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteDocument(docId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: doc, error: fetchErr } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', docId)
    .single()
  if (fetchErr || !doc) return { error: 'Document not found' }

  const { error: dbErr } = await supabase.from('documents').delete().eq('id', docId)
  if (dbErr) return { error: dbErr.message }

  if (doc.file_path) {
    await supabase.storage.from('pdfs').remove([doc.file_path])
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function updateKurs(kursId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)
  const published = formData.get('published') === 'true'
  if (!title) return { error: 'Title is required.' }
  const { error } = await supabase.from('kurse').update({ title, description, position, published }).eq('id', kursId)
  if (error) return { error: error.message }
  revalidatePath('/admin/kurse/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateUnit(unitId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)
  if (!title) return { error: 'Title is required.' }
  const { error } = await supabase.from('units').update({ title, description, position }).eq('id', unitId)
  if (error) return { error: error.message }
  revalidatePath('/admin/units/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateTask(taskId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)
  if (!title) return { error: 'Title is required.' }
  const { error } = await supabase.from('tasks').update({ title, description, position }).eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath('/admin/tasks/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateDocument(docId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)
  if (!title) return { error: 'Title is required.' }

  const pdfFile = formData.get('pdf') as File | null
  if (pdfFile && pdfFile.size > 0) {
    if (!ALLOWED_MIMES.includes(pdfFile.type)) return { error: 'Only PDF, JPEG, PNG, GIF, or WebP files are allowed.' }

    const { data: doc, error: fetchErr } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', docId)
      .single()
    if (fetchErr || !doc) return { error: 'Document not found.' }

    const file_type = IMAGE_MIMES.includes(pdfFile.type) ? 'image' : 'pdf'
    const ext = MIME_TO_EXT[pdfFile.type] ?? '.bin'
    const sanitisedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
    const newPath = `documents/${user.id}/${Date.now()}-${sanitisedTitle}${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('pdfs')
      .upload(newPath, pdfFile, { contentType: pdfFile.type, upsert: false })
    if (uploadErr) return { error: `Upload failed: ${uploadErr.message}` }

    const { error: dbErr } = await supabase.from('documents').update({ title, description, position, file_path: newPath, file_type }).eq('id', docId)
    if (dbErr) {
      await supabase.storage.from('pdfs').remove([newPath])
      return { error: dbErr.message }
    }

    if (doc.file_path) await supabase.storage.from('pdfs').remove([doc.file_path])
  } else {
    const { error } = await supabase.from('documents').update({ title, description, position }).eq('id', docId)
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return { success: true }
}
