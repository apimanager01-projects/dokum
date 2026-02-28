import { createClient } from '@/lib/supabase/server'
import { DocumentCard } from '@/components/documents/DocumentCard'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
    .from('documents')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-red-600">Failed to load documents.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Documents</h1>

      {documents.length === 0 ? (
        <p className="text-sm text-gray-500">No documents available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </main>
  )
}
