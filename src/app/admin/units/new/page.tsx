import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AddUnitForm } from '@/components/admin/AddUnitForm'

export default async function NewUnitPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  const { data: kurse } = await supabase
    .from('kurse')
    .select('id, title')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Unit anlegen</h1>
      <AddUnitForm kurse={kurse ?? []} />
    </main>
  )
}
