import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewTaskPageClient } from '@/components/admin/NewTaskPageClient'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ unitId?: string; editId?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { unitId, editId } = await searchParams

  let defaultUnitId = unitId ?? ''
  let editDefaults: { title: string; description: string | null; position: number } | undefined
  if (editId) {
    const { data } = await supabase
      .from('tasks')
      .select('unit_id, title, description, position')
      .eq('id', editId)
      .single()
    if (data) {
      editDefaults = { title: data.title, description: data.description, position: data.position }
      defaultUnitId = data.unit_id
    }
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title, units(id, title, position, created_at, tasks(id, title, position, created_at))')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="tasks" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? 'Task bearbeiten' : 'Task anlegen'}
        </h1>
        {editId && (
          <Link href="/admin/tasks/new" className="text-sm text-brand hover:underline">
            + Neuen Task anlegen
          </Link>
        )}
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <NewTaskPageClient
        key={editId ?? 'new'}
        kurseWithUnitsAndTasks={(kurse as any) ?? []}
        defaultUnitId={defaultUnitId}
        editId={editId}
        defaultValues={editDefaults}
      />
    </main>
  )
}
