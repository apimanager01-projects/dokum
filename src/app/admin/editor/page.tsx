import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'
import { EditorShell } from '@/components/admin/editor/EditorShell'
import './editor.css'

// Auth is enforced by the proxy (src/proxy.ts) — the single enforcement
// point for /admin/*. No role check is duplicated here (see CLAUDE.md).
export default function AdminEditorPage() {
  return (
    <main className="mx-auto max-w-[1560px] px-4 py-10">
      <AdminSubpageNav active="editor" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">LaTeX-Editor</h1>
      </div>

      <EditorShell />
    </main>
  )
}
