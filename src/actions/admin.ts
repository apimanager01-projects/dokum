'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult = {
  error?: string
  success?: boolean
}

export async function createDocument(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  // Re-validate admin status server-side — never trust the caller
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  // Extract and validate form fields
  const title = (formData.get('title') as string | null)?.trim()
  const description = (formData.get('description') as string | null)?.trim() || null
  const pdfFile = formData.get('pdf') as File | null
  const published = formData.get('published') === 'true'

  if (!title) {
    return { error: 'Title is required.' }
  }
  if (!pdfFile || pdfFile.size === 0) {
    return { error: 'A PDF file is required.' }
  }
  if (pdfFile.type !== 'application/pdf') {
    return { error: 'The uploaded file must be a PDF.' }
  }

  // Generate storage path: documents/{userId}/{timestamp}-{sanitised-title}.pdf
  const sanitisedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const storagePath = `documents/${user.id}/${Date.now()}-${sanitisedTitle}.pdf`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(storagePath, pdfFile, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` }
  }

  // Insert the document row (pdf_path stores the path, never a signed URL)
  const { error: insertError } = await supabase.from('documents').insert({
    title,
    description,
    pdf_path: storagePath,
    published,
  })

  if (insertError) {
    // Best-effort cleanup: remove the uploaded file to avoid orphaned storage objects
    await supabase.storage.from('pdfs').remove([storagePath])
    return { error: `Failed to save document: ${insertError.message}` }
  }

  return { success: true }
}
