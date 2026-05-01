import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { STORAGE_BUCKET, SIGNED_URL_EXPIRY_SECONDS } from '@/lib/constants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const isAdmin = user.app_metadata?.['role'] === 'admin'

  // Fetch image with parent course published status via join (document_images → documents → tasks → units → kurse).
  // The `!inner` joins guarantee the relations exist; we cast to `any` because
  // deep nested join types are not automatically inferred without generated types.
  const { data: img, error } = await supabase
    .from('document_images')
    .select(`
      file_path,
      documents!inner (
        tasks!inner (
          units!inner (
            kurse!inner ( published )
          )
        )
      )
    `)
    .eq('id', imageId)
    .single()

  if (error || !img) {
    return new NextResponse('Bild nicht gefunden.', { status: 404 })
  }

  // Non-admins cannot access images from unpublished courses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const published = (img as any).documents?.tasks?.units?.kurse?.published ?? false
  if (!isAdmin && !published) {
    return new NextResponse('Zugriff verweigert.', { status: 403 })
  }

  // Generate a short-lived signed URL (60 s — only used server-side for the fetch below)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(img.file_path, SIGNED_URL_EXPIRY_SECONDS, { download: false })

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
