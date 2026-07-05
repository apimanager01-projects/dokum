import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getEditorImageFilePath } from '@/lib/dal'
import { STORAGE_BUCKET, SIGNED_URL_EXPIRY_SECONDS } from '@/lib/constants'

/**
 * Signed-URL proxy for editor images (PRD #28, slice 8 — #36).
 *
 * DELIBERATE DEVIATION from /api/file and /api/image (which 302-redirect to
 * the signed URL): this route fetches the signed URL server-side and STREAMS
 * the body, so the browser only ever sees a same-origin response. That is
 * what lets the slice-10 PNG export (html2canvas) rasterise the images
 * without CORS handling or canvas tainting, and keeps `img-src 'self'`
 * sufficient in the CSP.
 *
 * Admin-only: drafts (and their images) exist only pre-publish; the published
 * Document is a burned-in PNG, so students never request this route. RLS on
 * editor_images is admin-only too — the DAL lookup is the second gate.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  const { imageId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse('Nicht angemeldet.', { status: 401 })
  }
  if (user.app_metadata?.['role'] !== 'admin') {
    return new NextResponse('Zugriff verweigert.', { status: 403 })
  }

  const image = await getEditorImageFilePath(imageId)
  if (!image) {
    return new NextResponse('Bild nicht gefunden.', { status: 404 })
  }

  const { data: urlData, error: urlError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(image.file_path, SIGNED_URL_EXPIRY_SECONDS, { download: false })
  if (urlError || !urlData?.signedUrl) {
    return new NextResponse('Bild konnte nicht geladen werden.', { status: 500 })
  }

  const upstream = await fetch(urlData.signedUrl)
  if (!upstream.ok || !upstream.body) {
    return new NextResponse('Bild konnte nicht geladen werden.', { status: 500 })
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
      // Image ids are immutable (one upload per row) — short private caching
      // keeps repeated renders (editor, later html2canvas export) cheap.
      'Cache-Control': 'private, max-age=3600',
    },
  })
}
