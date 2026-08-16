// CURRENTLY UNUSED — no page imports this component. Its target route does
// exist now (#69), and the link goes through DocumentLink like every other
// in-app document link (#70), so this cannot drift out of date a second time.
import type { Document } from '@/types'
import { DocumentLink } from './DocumentLink'

export function DocumentCard({ document }: { document: Document }) {
  return (
    <DocumentLink
      docId={document.id}
      /* #119's hover rule — border-colour only, no shadow. See KursCard. */
      className="block rounded-lg border border-hairline bg-surface p-5 transition-colors duration-[var(--dokum-dur-micro)] ease-[var(--dokum-ease-standard)] hover:border-edge"
    >
      <h2 className="text-base font-semibold text-gray-900">{document.title}</h2>
      {document.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{document.description}</p>
      )}
      <span className="mt-3 inline-block text-xs font-medium text-gray-400">
        View document →
      </span>
    </DocumentLink>
  )
}
