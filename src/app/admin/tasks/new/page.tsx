import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewTaskPageClient } from '@/components/admin/NewTaskPageClient'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewTaskPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title, units(id, title, position, created_at, tasks(id, title, position, created_at))')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="tasks" />
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Task anlegen</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <NewTaskPageClient kurseWithUnitsAndTasks={(kurse as any) ?? []} />
    </main>
  )
}
