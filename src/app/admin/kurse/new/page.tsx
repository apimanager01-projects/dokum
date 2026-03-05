import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddKursForm } from '@/components/admin/AddKursForm'
import { AdminTree } from '@/components/admin/AdminTree'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewKursPage({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { editId } = await searchParams

  let editDefaults: { title: string; description: string | null; position: number; published: boolean } | undefined
  if (editId) {
    const { data } = await supabase
      .from('kurse')
      .select('title, description, position, published')
      .eq('id', editId)
      .single()
    if (data) editDefaults = data
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title, units(id, title, position, created_at)')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="kurse" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? 'Kurs bearbeiten' : 'Kurs anlegen'}
        </h1>
        {editId && (
          <Link href="/admin/kurse/new" className="text-sm text-brand hover:underline">
            + Neuen Kurs anlegen
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        <AddKursForm key={editId ?? 'new'} editId={editId} defaultValues={editDefaults} />
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">Vorhandene Kurse</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <AdminTree kurse={(kurse as any) ?? []} selectedId="" deleteLevel="kurs" />
        </div>
      </div>
    </main>
  )
}
