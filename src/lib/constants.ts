export const STORAGE_BUCKET = 'pdfs'

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024 // 4 MB

export const SIGNED_URL_EXPIRY_SECONDS = 60

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const

export const ALLOWED_FILE_MIMES = ['application/pdf', ...ALLOWED_IMAGE_MIMES] as const

export const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}
