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

export async function createDocument(formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const task_id = (formData.get('task_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const pdfFile = formData.get('pdf') as File | null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!task_id) return { error: 'Please select a Task.' }
  if (!title) return { error: 'Title is required.' }
  if (!pdfFile || pdfFile.size === 0) return { error: 'A PDF file is required.' }
  if (pdfFile.type !== 'application/pdf') return { error: 'The uploaded file must be a PDF.' }

  // Generate storage path: documents/{userId}/{timestamp}-{sanitised-title}.pdf
  const sanitisedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const storagePath = `documents/${user.id}/${Date.now()}-${sanitisedTitle}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(storagePath, pdfFile, { contentType: 'application/pdf', upsert: false })

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` }

  const { error: insertError } = await supabase
    .from('documents')
    .insert({ task_id, title, description, pdf_path: storagePath, position })

  if (insertError) {
    await supabase.storage.from('pdfs').remove([storagePath])
    return { error: `Failed to save document: ${insertError.message}` }
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteDocument(docId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: doc, error: fetchErr } = await supabase
    .from('documents')
    .select('pdf_path')
    .eq('id', docId)
    .single()
  if (fetchErr || !doc) return { error: 'Document not found' }

  const { error: dbErr } = await supabase.from('documents').delete().eq('id', docId)
  if (dbErr) return { error: dbErr.message }

  if (doc.pdf_path) {
    await supabase.storage.from('pdfs').remove([doc.pdf_path])
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return {}
}
