import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Document } from '@/types'

type TaskWithDocumentsAndKurs = {
  id: string
  title: string
  description: string | null
  documents: Document[]
  units: { kurs_id: string; kurse: { title: string } }
}

export default async function TaskPage({
  params,
}: {
  params: Promise<{ kursId: string; taskId: string }>
}) {
  const { kursId, taskId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id,
      title,
      description,
      documents ( * ),
      units!inner (
        kurs_id,
        kurse ( title )
      )
    `)
    .eq('id', taskId)
    .single()

  if (error || !data) notFound()

  const task = data as unknown as TaskWithDocumentsAndKurs
  if (task.units.kurs_id !== kursId) notFound()

  const kursTitle = task.units.kurse.title

  // Sort documents by position ASC, then created_at ASC
  const docs = [...task.documents].sort(
    (a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at)
  )

  // Generate signed URLs for all PDFs in parallel
  const signedUrls = await Promise.all(
    docs.map((doc) =>
      supabase.storage.from('pdfs').createSignedUrl(doc.pdf_path, 60 * 60)
    )
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={`/kurse/${kursId}`}
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to {kursTitle}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
      {task.description && (
        <p className="mt-2 text-gray-600">{task.description}</p>
      )}

      {docs.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No documents yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {docs.map((doc, i) => {
            const { data: urlData, error: urlError } = signedUrls[i]
            return (
              <div
                key={doc.id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-base font-semibold text-gray-900">{doc.title}</h2>
                {doc.description && (
                  <p className="mt-1 text-sm text-gray-500">{doc.description}</p>
                )}
                <div className="mt-3">
                  {urlError || !urlData?.signedUrl ? (
                    <span className="text-xs text-red-500">Could not generate PDF link.</span>
                  ) : (
                    <a
                      href={urlData.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/5 transition-colors btn-brand"
                    >
                      Open PDF ↗
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
