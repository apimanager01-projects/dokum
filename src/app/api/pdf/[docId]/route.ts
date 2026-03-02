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
    .select('pdf_path')
    .eq('id', docId)
    .single()

  if (error || !doc) {
    return new NextResponse('Dokument nicht gefunden.', { status: 404 })
  }

  // Generate a short-lived signed URL (60 s — only used server-side for the fetch below)
  const { data: urlData, error: urlError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(doc.pdf_path, 60, { download: false })

  if (urlError || !urlData?.signedUrl) {
    return new NextResponse('PDF konnte nicht geladen werden.', { status: 500 })
  }

  // Fetch the PDF from Supabase Storage and stream it to the client
  const pdfRes = await fetch(urlData.signedUrl)
  if (!pdfRes.ok) {
    return new NextResponse('PDF konnte nicht geladen werden.', { status: 502 })
  }

  const headers = new Headers({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline',
  })

  // Forward Content-Length if present so browsers can show a loading progress bar
  const contentLength = pdfRes.headers.get('Content-Length')
  if (contentLength) headers.set('Content-Length', contentLength)

  return new NextResponse(pdfRes.body, { headers })
}
