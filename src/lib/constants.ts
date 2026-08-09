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

// Browser URL of a stored editor image (PRD #28, slice 8) — the streaming
// signed-URL proxy route. Single source for the path so the controller, the
// JSON importer wiring and the route itself cannot drift apart.
export function editorImageUrl(imageId: string): string {
  return `/api/editor-image/${imageId}`
}

// The addressable URL of a single Dokument (#69) — the thing a student
// bookmarks or sends to a classmate. Deliberately FLAT: a link stores the
// target's document id and nothing else (#63 §6), so the URL needs no Kurs or
// Unit in it, and a top-level segment is also the shape the overlay's
// intercepting route needs (#70).
export function documentUrl(docId: string): string {
  return `/dokumente/${docId}`
}
