import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddKursForm } from '@/components/admin/AddKursForm'
import { AddUnitForm } from '@/components/admin/AddUnitForm'
import { AddTaskForm } from '@/components/admin/AddTaskForm'
import { AddDocumentForm } from '@/components/admin/AddDocumentForm'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Belt-and-suspenders: middleware handles the redirect, but guard here too
  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  // Fetch all kurse, units, and tasks to populate form dropdowns
  const [{ data: kurse }, { data: units }, { data: tasks }] = await Promise.all([
    supabase
      .from('kurse')
      .select('id, title')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('units')
      .select('*, kurse ( title )')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
    supabase
      .from('tasks')
      .select('*, units ( title, kurse ( title ) )')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true }),
  ])

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-14">
      <h1 className="text-2xl font-bold text-gray-900">Admin</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Add Kurs
        </h2>
        <AddKursForm />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Add Unit
        </h2>
        <AddUnitForm kurse={kurse ?? []} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Add Task
        </h2>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AddTaskForm units={(units as any) ?? []} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Add Document (PDF)
        </h2>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AddDocumentForm tasks={(tasks as any) ?? []} />
      </section>
    </main>
  )
}
