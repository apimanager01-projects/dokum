import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params
  const supabase = await createClient()

  // Auth check — middleware also guards this route, but belt-and-suspenders
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Fetch document — RLS ensures only documents under published Kurse are accessible
  const { data: doc, error } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', docId)
    .single()

  if (error || !doc) {
    return new NextResponse('Dokument nicht gefunden.', { status: 404 })
  }

  // Generate a short-lived signed URL (60 s — only used server-side for the fetch below)
  const { data: urlData, error: urlError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(doc.file_path, 60, { download: false })

  if (urlError || !urlData?.signedUrl) {
    return new NextResponse('Datei konnte nicht geladen werden.', { status: 500 })
  }

  // Fetch the file from Supabase Storage and stream it to the client
  const storageRes = await fetch(urlData.signedUrl)
  if (!storageRes.ok) {
    return new NextResponse('Datei konnte nicht geladen werden.', { status: 502 })
  }

  // Use the Content-Type from Supabase so PDFs and images are served correctly
  const contentType = storageRes.headers.get('Content-Type') ?? 'application/octet-stream'

  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': 'inline',
  })

  // Forward Content-Length if present so browsers can show a loading progress bar
  const contentLength = storageRes.headers.get('Content-Length')
  if (contentLength) headers.set('Content-Length', contentLength)

  return new NextResponse(storageRes.body, { headers })
}
