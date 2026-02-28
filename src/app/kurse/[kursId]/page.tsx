import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { KursWithUnits } from '@/types'
import KursDetailClient from '@/components/KursDetailClient'

export default async function KursPage({ params }: { params: Promise<{ kursId: string }> }) {
  const { kursId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kurse')
    .select(`
      *,
      units (
        *,
        tasks (
          *,
          documents ( * )
        )
      )
    `)
    .eq('id', kursId)
    .single()

  if (error || !data) notFound()

  const kurs = data as KursWithUnits

  // Sort units, tasks, and documents by position ASC, then created_at ASC
  kurs.units.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
  kurs.units.forEach((unit) => {
    unit.tasks.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
    unit.tasks.forEach((task) =>
      task.documents.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
    )
  })

  // Collect all documents and generate signed URLs in parallel
  const allDocs = kurs.units.flatMap((u) => u.tasks.flatMap((t) => t.documents))
  const signedResults = await Promise.all(
    allDocs.map((doc) => supabase.storage.from('pdfs').createSignedUrl(doc.pdf_path, 60 * 60))
  )
  const urlMap: Record<string, string | null> = {}
  allDocs.forEach((doc, i) => {
    urlMap[doc.id] = signedResults[i].data?.signedUrl ?? null
  })

  // Enrich units with signed URLs on each document
  const enrichedUnits = kurs.units.map((unit) => ({
    ...unit,
    tasks: unit.tasks.map((task) => ({
      ...task,
      documents: task.documents.map((doc) => ({
        ...doc,
        signedUrl: urlMap[doc.id] ?? null,
      })),
    })),
  }))

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to courses
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{kurs.title}</h1>
      {kurs.description && (
        <p className="mt-2 text-gray-600">{kurs.description}</p>
      )}

      <KursDetailClient units={enrichedUnits} />
    </main>
  )
}
