import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ConsentPageClient } from '@/components/consent/ConsentPageClient'

export const metadata: Metadata = {
  title: 'Datenschutz-Einwilligung – Dokum',
}

export default async function ConsentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')
  if (user.user_metadata?.consent_accepted_at) redirect('/')

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <ConsentPageClient />
      </div>
    </main>
  )
}
