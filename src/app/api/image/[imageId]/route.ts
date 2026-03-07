import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  const supabase = await createClient()

  // Auth check — middleware also guards this route, but belt-and-suspenders
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Fetch the document_images row — RLS ensures only images under published Kurse are accessible
  const { data: img, error } = await supabase
    .from('document_images')
    .select('file_path')
    .eq('id', imageId)
    .single()

  if (error || !img) {
    return new NextResponse('Bild nicht gefunden.', { status: 404 })
  }

  // Generate a short-lived signed URL (60 s — only used server-side for the fetch below)
  const { data: urlData, error: urlError } = await supabase.storage
    .from('pdfs')
    .createSignedUrl(img.file_path, 60, { download: false })

  if (urlError || !urlData?.signedUrl) {
    return new NextResponse('Bild konnte nicht geladen werden.', { status: 500 })
  }

  // Fetch the image from Supabase Storage and stream it to the client
  const storageRes = await fetch(urlData.signedUrl)
  if (!storageRes.ok) {
    return new NextResponse('Bild konnte nicht geladen werden.', { status: 502 })
  }

  const contentType = storageRes.headers.get('Content-Type') ?? 'image/jpeg'

  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': 'inline',
  })

  const contentLength = storageRes.headers.get('Content-Length')
  if (contentLength) headers.set('Content-Length', contentLength)

  return new NextResponse(storageRes.body, { headers })
}
