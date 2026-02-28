import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ id: string }>
}

export default async function DocumentPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the document (RLS ensures only published docs are visible)
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()

  if (!document) {
    notFound()
  }

  // Generate a short-lived signed URL for the private PDF
  const { data: signedData, error: signedError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(document.pdf_path, 60 * 60) // 1-hour expiry

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>

      {document.description && (
        <p className="mt-2 text-gray-600">{document.description}</p>
      )}

      <div className="mt-6">
        {signedError || !signedData?.signedUrl ? (
          <p className="text-sm text-red-600">
            Unable to generate a link for this document. Please try again later.
          </p>
        ) : (
          <a
            href={signedData.signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
          >
            Open PDF ↗
          </a>
        )}
      </div>
    </main>
  )
}
