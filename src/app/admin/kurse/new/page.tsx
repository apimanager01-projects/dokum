import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AddKursForm } from '@/components/admin/AddKursForm'
import { KursTree } from '@/components/admin/KursTree'

export default async function NewKursPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title, units(id, title, position, created_at)')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/admin" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Kurs anlegen</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        <AddKursForm />
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">Vorhandene Kurse</p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <KursTree kurse={(kurse as any) ?? []} selectedKursId="" />
        </div>
      </div>
    </main>
  )
}
