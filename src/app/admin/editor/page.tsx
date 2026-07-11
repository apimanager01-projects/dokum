import { notFound } from 'next/navigation'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'
import { DraftList } from '@/components/admin/editor/DraftList'
import { EditorShell, type EditorShellDraft } from '@/components/admin/editor/EditorShell'
import { getEditorDocumentById, getEditorDocuments, getEditorTargetTree } from '@/lib/dal'
import './editor.css'

// Auth is enforced by the proxy (src/proxy.ts) — the single enforcement
// point for /admin/*. No role check is duplicated here (see CLAUDE.md).
export default async function AdminEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ draftId?: string }>
}) {
  const { draftId } = await searchParams

  let initialDraft: EditorShellDraft | undefined
  if (draftId) {
    const draft = await getEditorDocumentById(draftId)
    if (!draft) notFound()
    initialDraft = {
      id: draft.id,
      title: draft.title,
      content: draft.content,
      publishedDocumentId: draft.published_document_id,
    }
  }

  const drafts = await getEditorDocuments()
  // Kurs → Unit → Task targets for the ExportBar (slice 10; slice 11 reuses
  // the selection for publishing). DAL-sorted — the client never re-sorts.
  const targetTree = await getEditorTargetTree()

  return (
    <main className="mx-auto max-w-[1560px] px-4 py-10">
      <AdminSubpageNav active="editor" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">LaTeX-Editor</h1>
      </div>

      <DraftList drafts={drafts} activeId={draftId} />
      {/* key: switching drafts (or leaving one) rebuilds the imperative
          editor — the established edit-page remount pattern. */}
      <EditorShell key={draftId ?? 'new'} initialDraft={initialDraft} targetTree={targetTree} />
    </main>
  )
}
