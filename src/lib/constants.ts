export const STORAGE_BUCKET = 'pdfs'

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024 // 4 MB

export const SIGNED_URL_EXPIRY_SECONDS = 60

// Flat per-Unit price. MUST match the unit_amount of the Stripe Price referenced
// by STRIPE_UNIT_PRICE_ID — change both together. Currency is EUR.
export const UNIT_PRICE_CENTS = 300
export const UNIT_PRICE_CURRENCY = 'EUR' as const
export const UNIT_PRICE_DISPLAY = '€3'

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const

export const ALLOWED_FILE_MIMES = ['application/pdf', ...ALLOWED_IMAGE_MIMES] as const

export const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}
