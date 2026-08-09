import type { Document } from '@/types'

/**
 * How a Document is presented to a student. Pure and free of `server-only`
 * so both the server page and the client accordion can branch on it.
 */
export type DocumentViewKind =
  /** A published editor document with a snapshot — rendered live (#67). */
  | 'interactive'
  /** The stored picture: a legacy `image`, or an interactive row whose snapshot is missing. */
  | 'picture'
  /** A legacy image collection — its `document_images`, in order. */
  | 'collection'
  /** A legacy PDF — opened through the signed-file proxy. */
  | 'file'

/**
 * The single place the "which render path?" question is answered.
 *
 * `file_type` decides first and `content` only ever refines the interactive
 * case, so a legacy row can never fall into the live path by accident. The
 * interactive → picture fallback here is the STORED one (no snapshot was
 * written); the runtime one — a snapshot this build cannot render — lives
 * inside `InteractiveDocument`, which is the only place that can discover it.
 */
export function documentViewKind(
  doc: Pick<Document, 'file_type'> & { content?: unknown }
): DocumentViewKind {
  switch (doc.file_type) {
    case 'image_collection':
      return 'collection'
    case 'interactive':
      return doc.content != null ? 'interactive' : 'picture'
    case 'image':
      return 'picture'
    default:
      return 'file'
  }
}
