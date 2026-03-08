import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { KursWithUnits } from '@/types'
import KursDetailClient from '@/components/KursDetailClient'
import ShareButton from '@/components/ShareButton'

export default async function KursPage({ params }: { params: Promise<{ kursId: string }> }) {
  const { kursId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kurse')
    .select('*, units(id, kurs_id, title, description, position, created_at)')
    .eq('id', kursId)
    .single()

  if (error || !data) notFound()

  const kurs = data as KursWithUnits

  // Sort units by position ASC, then created_at ASC
  kurs.units.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to courses
      </Link>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">{kurs.title}</h1>
        <ShareButton title={kurs.title} />
      </div>
      {kurs.description && (
        <p className="mt-2 text-gray-600">{kurs.description}</p>
      )}

      <KursDetailClient units={kurs.units} kursId={kursId} />
    </main>
  )
}
