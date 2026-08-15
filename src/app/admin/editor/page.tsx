import { notFound } from 'next/navigation'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'
import { DraftCatalog } from '@/components/admin/editor/DraftCatalog'
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
      // Remembered export target (#106) — NULL when never set or when the Task
      // was deleted; the ExportBar seeds the first tree entry either way.
      targetTaskId: draft.target_task_id,
    }
  }

  const drafts = await getEditorDocuments()
  // Kurs → Unit → Task targets for the ExportBar (slice 10; slice 11 reuses
  // the selection for publishing). DAL-sorted — the client never re-sorts.
  const targetTree = await getEditorTargetTree()

  return (
    <main className="mx-auto max-w-[1560px] px-4 py-10">
      <AdminSubpageNav active="editor" />
      {/* The drafts live behind the header button (#109) — no standing list
          between the heading and the editor, which starts right below this. */}
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="shrink-0 text-2xl font-bold text-gray-900">LaTeX-Editor</h1>
        <DraftCatalog drafts={drafts} activeId={draftId} />
      </div>

      {/* key: switching drafts (or leaving one) rebuilds the imperative
          editor — the established edit-page remount pattern. */}
      <EditorShell key={draftId ?? 'new'} initialDraft={initialDraft} targetTree={targetTree} />
    </main>
  )
}
