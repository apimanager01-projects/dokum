import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewDocumentPageClient } from '@/components/admin/NewDocumentPageClient'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string; editId?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { taskId, editId } = await searchParams

  let defaultTaskId = taskId ?? ''
  let editDefaults: { title: string; description: string | null; position: number; file_path: string; file_type: 'pdf' | 'image' } | undefined
  if (editId) {
    const { data } = await supabase
      .from('documents')
      .select('task_id, title, description, position, file_path, file_type')
      .eq('id', editId)
      .single()
    if (data) {
      editDefaults = { title: data.title, description: data.description, position: data.position, file_path: data.file_path, file_type: data.file_type as 'pdf' | 'image' }
      defaultTaskId = data.task_id
    }
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title, units(id, title, position, created_at, tasks(id, title, position, created_at, documents(id, title, position, created_at)))')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="documents" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? 'Dokument bearbeiten' : 'Dokument hinzufügen'}
        </h1>
        {editId && (
          <Link href="/admin/documents/new" className="text-sm text-brand hover:underline">
            + Neues Dokument hinzufügen
          </Link>
        )}
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <NewDocumentPageClient
        key={editId ?? 'new'}
        kurseTree={(kurse as any) ?? []}
        defaultTaskId={defaultTaskId}
        editId={editId}
        defaultValues={editDefaults}
      />
    </main>
  )
}
