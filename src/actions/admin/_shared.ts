import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type DocumentFileRef = {
  file_path: string | null
  file_type: string
  document_images?: { file_path: string }[]
}

export function collectStoragePaths(documents: DocumentFileRef[]): string[] {
  return documents.flatMap((d) => {
    const paths: string[] = []
    if (d.file_path) paths.push(d.file_path)
    if (d.file_type === 'image_collection') {
      paths.push(...(d.document_images ?? []).map((i) => i.file_path))
    }
    return paths
  })
}

export function parseForm<T>(
  schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } },
  formData: FormData,
  fields: string[],
): { ok: true; data: T } | { ok: false; error: string } {
  const raw: Record<string, unknown> = {}
  for (const field of fields) {
    raw[field] = formData.get(field)
  }
  const result = schema.safeParse(raw)
  if (!result.success) return { ok: false, error: result.error.issues[0].message }
  return { ok: true, data: result.data }
}

export function revalidateAdminPages() {
  revalidatePath('/admin/kurse/new')
  revalidatePath('/admin/units/new')
  revalidatePath('/admin/tasks/new')
  revalidatePath('/admin/documents/new')
  revalidatePath('/', 'layout')
}

export async function getAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  return { supabase, user }
}

export function sanitise(name: string, maxLen = 60) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, maxLen)
}
