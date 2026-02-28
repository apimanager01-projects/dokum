import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AddTaskForm } from '@/components/admin/AddTaskForm'

export default async function NewTaskPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { data: units } = await supabase
    .from('units')
    .select('*, kurse ( title )')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Task anlegen</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <AddTaskForm units={(units as any) ?? []} />
    </main>
  )
}
