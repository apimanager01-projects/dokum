import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { STORAGE_BUCKET, SIGNED_URL_EXPIRY_SECONDS } from '@/lib/constants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const isAdmin = user.app_metadata?.['role'] === 'admin'
  const isBrowserNav = request.headers.get('sec-fetch-dest') === 'document'

  // Fetch document with parent course published status via join.
  // The `!inner` joins guarantee the relations exist; we cast to `any` because
  // deep nested join types are not automatically inferred without generated types.
  const { data: doc, error } = await supabase
    .from('documents')
    .select(`
      file_path,
      tasks!inner (
        units!inner (
          kurse!inner ( published )
        )
      )
    `)
    .eq('id', docId)
    .single()

  if (error || !doc) {
    if (isBrowserNav) {
      return NextResponse.redirect(new URL('/document-not-found', request.url))
    }
    return new NextResponse('Dokument nicht gefunden.', { status: 404 })
  }

  // Non-admins cannot access documents from unpublished courses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const published = (doc as any).tasks?.units?.kurse?.published ?? false
  if (!isAdmin && !published) {
    return new NextResponse('Zugriff verweigert.', { status: 403 })
  }

  if (!doc.file_path) {
    if (isBrowserNav) {
      return NextResponse.redirect(new URL('/document-not-found', request.url))
    }
    return new NextResponse('Keine Datei vorhanden.', { status: 404 })
  }

  // Generate a short-lived signed URL (60 s — only used server-side for the fetch below)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(doc.file_path, SIGNED_URL_EXPIRY_SECONDS, { download: false })

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
