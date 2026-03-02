// CURRENTLY UNUSED — no page imports this component.
// The target route /documents/[id] does not exist yet.
import Link from 'next/link'
import type { Document } from '@/types'

export function DocumentCard({ document }: { document: Document }) {
  return (
    <Link
      href={`/documents/${document.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <h2 className="text-base font-semibold text-gray-900">{document.title}</h2>
      {document.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{document.description}</p>
      )}
      <span className="mt-3 inline-block text-xs font-medium text-gray-400">
        View document →
      </span>
    </Link>
  )
}
