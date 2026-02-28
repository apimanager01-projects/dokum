'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult = {
  error?: string
  success?: boolean
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

  const { error } = await supabase.from('kurse').insert({ title, description, position, published })
  if (error) return { error: `Failed to create Kurs: ${error.message}` }

  return { success: true }
}

export async function createUnit(formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()

  const kurs_id = (formData.get('kurs_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!kurs_id) return { error: 'Please select a Kurs.' }
  if (!title) return { error: 'Title is required.' }

  const { error } = await supabase.from('units').insert({ kurs_id, title, description, position })
  if (error) return { error: `Failed to create Unit: ${error.message}` }

  return { success: true }
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()

  const unit_id = (formData.get('unit_id') as string | null)?.trim()
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const position = parseInt((formData.get('position') as string | null) ?? '0', 10)

  if (!unit_id) return { error: 'Please select a Unit.' }
  if (!title) return { error: 'Title is required.' }

  const { error } = await supabase.from('tasks').insert({ unit_id, title, description, position })
  if (error) return { error: `Failed to create Task: ${error.message}` }

  return { success: true }
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

  return { success: true }
}
