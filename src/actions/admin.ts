'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { STORAGE_BUCKET, MAX_FILE_SIZE_BYTES, ALLOWED_IMAGE_MIMES, ALLOWED_FILE_MIMES, MIME_TO_EXT } from '@/lib/constants'
import { KursFormSchema, UnitFormSchema, TaskFormSchema, DocumentMetaSchema, DocumentUpdateMetaSchema } from '@/lib/schemas'

type ActionResult = {
  error?: string
  success?: boolean
  id?: string
}

function parseForm<T>(schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } }, formData: FormData, fields: string[]): { ok: true; data: T } | { ok: false; error: string } {
  const raw: Record<string, unknown> = {}
  for (const field of fields) {
    raw[field] = formData.get(field)
  }
  const result = schema.safeParse(raw)
  if (!result.success) return { ok: false, error: result.error.issues[0].message }
  return { ok: true, data: result.data }
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

  const parsed = parseForm(KursFormSchema, formData, ['title', 'description', 'position', 'published'])
  if (!parsed.ok) return { error: parsed.error }
  const { title, description, position, published } = parsed.data

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

  const parsed = parseForm(UnitFormSchema, formData, ['kurs_id', 'title', 'description', 'position'])
  if (!parsed.ok) return { error: parsed.error }
  const { kurs_id, title, description, position } = parsed.data

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

  const parsed = parseForm(TaskFormSchema, formData, ['unit_id', 'title', 'description', 'position'])
  if (!parsed.ok) return { error: parsed.error }
  const { unit_id, title, description, position } = parsed.data

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

function sanitise(name: string, maxLen = 60) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, maxLen)
}

export async function createDocument(formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()

  const parsed = parseForm(DocumentMetaSchema, formData, ['task_id', 'title', 'description', 'position', 'doc_type'])
  if (!parsed.ok) return { error: parsed.error }
  const { task_id, title, description, position, doc_type } = parsed.data

  // ── Image collection branch ──────────────────────────────────────────────
  if (doc_type === 'image_collection') {
    const images = formData.getAll('images') as File[]
    const validImages = images.filter((f) => f.size > 0)
    if (validImages.length === 0) return { error: 'At least one image is required.' }

    for (const img of validImages) {
      if (!(ALLOWED_IMAGE_MIMES as readonly string[]).includes(img.type))
        return { error: `"${img.name}" ist kein unterstütztes Bildformat (JPEG, PNG, GIF, WebP).` }
      if (img.size > MAX_FILE_SIZE_BYTES)
        return { error: `"${img.name}" ist zu groß (${(img.size / 1024 / 1024).toFixed(1)} MB). Maximal 4 MB pro Bild.` }
    }

    // Insert document record (no file_path for image collections)
    const { data: docData, error: insertError } = await supabase
      .from('documents')
      .insert({ task_id, title, description, file_path: null, file_type: 'image_collection', position })
      .select('id')
      .single()
    if (insertError) return { error: `Failed to save document: ${insertError.message}` }

    // Upload each image and collect paths
    const uploadedPaths: string[] = []
    for (let i = 0; i < validImages.length; i++) {
      const img = validImages[i]
      const ext = MIME_TO_EXT[img.type] ?? '.jpg'
      const storagePath = `documents/${user.id}/${Date.now()}-${i}-${sanitise(img.name, 40)}${ext}`

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, img, { contentType: img.type, upsert: false })

      if (uploadError) {
        // Rollback: delete document + already-uploaded images
        const [dbRollback, storageRollback] = await Promise.allSettled([
          supabase.from('documents').delete().eq('id', docData.id),
          uploadedPaths.length
            ? supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths)
            : Promise.resolve(null),
        ])
        // Log rollback failures for observability — do not throw
        const dbErr = dbRollback.status === 'rejected' ? dbRollback.reason : (dbRollback.value as any)?.error
        const stErr = storageRollback.status === 'rejected' ? storageRollback.reason : null
        if (dbErr) console.error('[createDocument rollback] DB delete failed:', dbErr)
        if (stErr) console.error('[createDocument rollback] Storage remove failed:', stErr)
        return { error: `Upload fehlgeschlagen: ${uploadError.message}` }
      }
      uploadedPaths.push(storagePath)
    }

    // Bulk-insert document_images rows
    const imgRows = uploadedPaths.map((file_path, i) => ({
      document_id: docData.id,
      file_path,
      position: i,
    }))
    const { error: imgInsertError } = await supabase.from('document_images').insert(imgRows)
    if (imgInsertError) {
      const [dbRollback, storageRollback] = await Promise.allSettled([
        supabase.from('documents').delete().eq('id', docData.id),
        uploadedPaths.length
          ? supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths)
          : Promise.resolve(null),
      ])
      // Log rollback failures for observability — do not throw
      const dbErr = dbRollback.status === 'rejected' ? dbRollback.reason : (dbRollback.value as any)?.error
      const stErr = storageRollback.status === 'rejected' ? storageRollback.reason : null
      if (dbErr) console.error('[createDocument rollback] DB delete failed:', dbErr)
      if (stErr) console.error('[createDocument rollback] Storage remove failed:', stErr)
      return { error: `Failed to save images: ${imgInsertError.message}` }
    }

    revalidatePath('/admin/documents/new')
    revalidatePath('/', 'layout')
    return { success: true }
  }

  // ── Single-file branch (pdf / image) ────────────────────────────────────
  const file = formData.get('pdf') as File | null
  if (!file || file.size === 0) return { error: 'A file is required.' }
  if (!(ALLOWED_FILE_MIMES as readonly string[]).includes(file.type)) return { error: 'Only PDF, JPEG, PNG, GIF, or WebP files are allowed.' }

  const file_type = (ALLOWED_IMAGE_MIMES as readonly string[]).includes(file.type) ? 'image' : 'pdf'
  const ext = MIME_TO_EXT[file.type] ?? '.bin'
  const storagePath = `documents/${user.id}/${Date.now()}-${sanitise(title)}${ext}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` }

  const { error: insertError } = await supabase
    .from('documents')
    .insert({ task_id, title, description, file_path: storagePath, file_type, position })

  if (insertError) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
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
    .select('id, documents(file_path, file_type, document_images(file_path))')
    .eq('id', taskId)
    .single()

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) return { error: error.message }

  const paths = ((task?.documents ?? []) as { file_path: string | null; file_type: string; document_images: { file_path: string }[] }[])
    .flatMap((d) => {
      const p: string[] = []
      if (d.file_path) p.push(d.file_path)
      if (d.file_type === 'image_collection') p.push(...(d.document_images ?? []).map((i) => i.file_path))
      return p
    })
    .filter(Boolean)
  if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths)

  revalidatePath('/admin/tasks/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteUnit(unitId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: unit } = await supabase
    .from('units')
    .select('id, tasks(id, documents(file_path, file_type, document_images(file_path)))')
    .eq('id', unitId)
    .single()

  const { error } = await supabase.from('units').delete().eq('id', unitId)
  if (error) return { error: error.message }

  const paths = ((unit?.tasks ?? []) as { documents: { file_path: string | null; file_type: string; document_images: { file_path: string }[] }[] }[])
    .flatMap((t) =>
      t.documents.flatMap((d) => {
        const p: string[] = []
        if (d.file_path) p.push(d.file_path)
        if (d.file_type === 'image_collection') p.push(...(d.document_images ?? []).map((i) => i.file_path))
        return p
      })
    )
    .filter(Boolean)
  if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths)

  revalidatePath('/admin/units/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteKurs(kursId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: kurs } = await supabase
    .from('kurse')
    .select('id, units(id, tasks(id, documents(file_path, file_type, document_images(file_path))))')
    .eq('id', kursId)
    .single()

  const { error } = await supabase.from('kurse').delete().eq('id', kursId)
  if (error) return { error: error.message }

  const paths = ((kurs?.units ?? []) as { tasks: { documents: { file_path: string | null; file_type: string; document_images: { file_path: string }[] }[] }[] }[])
    .flatMap((u) =>
      u.tasks.flatMap((t) =>
        t.documents.flatMap((d) => {
          const p: string[] = []
          if (d.file_path) p.push(d.file_path)
          if (d.file_type === 'image_collection') p.push(...(d.document_images ?? []).map((i) => i.file_path))
          return p
        })
      )
    )
    .filter(Boolean)
  if (paths.length) await supabase.storage.from(STORAGE_BUCKET).remove(paths)

  revalidatePath('/admin/kurse/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteDocument(docId: string): Promise<{ error?: string }> {
  const { supabase } = await getAdminUser()

  const { data: doc, error: fetchErr } = await supabase
    .from('documents')
    .select('file_path, file_type, document_images(file_path)')
    .eq('id', docId)
    .single()
  if (fetchErr || !doc) return { error: 'Document not found' }

  const { error: dbErr } = await supabase.from('documents').delete().eq('id', docId)
  if (dbErr) return { error: dbErr.message }

  const pathsToDelete: string[] = []
  if (doc.file_path) pathsToDelete.push(doc.file_path)
  if (doc.file_type === 'image_collection') {
    pathsToDelete.push(...((doc.document_images ?? []) as { file_path: string }[]).map((i) => i.file_path))
  }
  if (pathsToDelete.length) await supabase.storage.from(STORAGE_BUCKET).remove(pathsToDelete)

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return {}
}

export async function updateKurs(kursId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const parsed = parseForm(KursFormSchema, formData, ['title', 'description', 'position', 'published'])
  if (!parsed.ok) return { error: parsed.error }
  const { title, description, position, published } = parsed.data
  const { error } = await supabase.from('kurse').update({ title, description, position, published }).eq('id', kursId)
  if (error) return { error: error.message }
  revalidatePath('/admin/kurse/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateUnit(unitId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const parsed = parseForm(DocumentUpdateMetaSchema, formData, ['title', 'description', 'position'])
  if (!parsed.ok) return { error: parsed.error }
  const { title, description, position } = parsed.data
  const { error } = await supabase.from('units').update({ title, description, position }).eq('id', unitId)
  if (error) return { error: error.message }
  revalidatePath('/admin/units/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateTask(taskId: string, formData: FormData): Promise<ActionResult> {
  const { supabase } = await getAdminUser()
  const parsed = parseForm(DocumentUpdateMetaSchema, formData, ['title', 'description', 'position'])
  if (!parsed.ok) return { error: parsed.error }
  const { title, description, position } = parsed.data
  const { error } = await supabase.from('tasks').update({ title, description, position }).eq('id', taskId)
  if (error) return { error: error.message }
  revalidatePath('/admin/tasks/new')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateDocument(docId: string, formData: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAdminUser()
  const parsed = parseForm(DocumentUpdateMetaSchema, formData, ['title', 'description', 'position'])
  if (!parsed.ok) return { error: parsed.error }
  const { title, description, position } = parsed.data

  // Fetch current document to know its type
  const { data: currentDoc, error: fetchErr } = await supabase
    .from('documents')
    .select('file_path, file_type')
    .eq('id', docId)
    .single()
  if (fetchErr || !currentDoc) return { error: 'Document not found.' }

  // image_collection: only metadata editable (no file replacement)
  if (currentDoc.file_type === 'image_collection') {
    const { error } = await supabase.from('documents').update({ title, description, position }).eq('id', docId)
    if (error) return { error: error.message }
    revalidatePath('/admin/documents/new')
    revalidatePath('/', 'layout')
    return { success: true }
  }

  // pdf / image: optionally replace the file
  const pdfFile = formData.get('pdf') as File | null
  if (pdfFile && pdfFile.size > 0) {
    if (!(ALLOWED_FILE_MIMES as readonly string[]).includes(pdfFile.type)) return { error: 'Only PDF, JPEG, PNG, GIF, or WebP files are allowed.' }

    const file_type = (ALLOWED_IMAGE_MIMES as readonly string[]).includes(pdfFile.type) ? 'image' : 'pdf'
    const ext = MIME_TO_EXT[pdfFile.type] ?? '.bin'
    const newPath = `documents/${user.id}/${Date.now()}-${sanitise(title)}${ext}`

    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(newPath, pdfFile, { contentType: pdfFile.type, upsert: false })
    if (uploadErr) return { error: `Upload failed: ${uploadErr.message}` }

    const { error: dbErr } = await supabase.from('documents').update({ title, description, position, file_path: newPath, file_type }).eq('id', docId)
    if (dbErr) {
      const [storageRollback] = await Promise.allSettled([
        supabase.storage.from(STORAGE_BUCKET).remove([newPath]),
      ])
      // Log rollback failures for observability — do not throw
      const stErr = storageRollback.status === 'rejected' ? storageRollback.reason : null
      if (stErr) console.error('[updateDocument rollback] Storage remove failed:', stErr)
      return { error: dbErr.message }
    }

    if (currentDoc.file_path) await supabase.storage.from(STORAGE_BUCKET).remove([currentDoc.file_path])
  } else {
    const { error } = await supabase.from('documents').update({ title, description, position }).eq('id', docId)
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
  return { success: true }
}
