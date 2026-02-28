import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Admin — Add Document</h1>
      <AddDocumentForm />
    </main>
  )
}
