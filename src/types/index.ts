export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Kurs {
  id: string
  title: string
  description: string | null
  published: boolean
  position: number
  created_at: string
}

export interface Unit {
  id: string
  kurs_id: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface Task {
  id: string
  unit_id: string
  title: string
  description: string | null
  position: number
  created_at: string
}

export interface Document {
  id: string
  task_id: string
  title: string
  description: string | null
  file_path: string | null
  /**
   * Mirrors the `documents_file_type_check` CHECK constraint
   * (supabase/add_document_content.sql) — the two must list the same values.
   * `'interactive'` is a published editor document; the legacy values are
   * kept because file_type is the restoration key for archived rows.
   */
  file_type: 'pdf' | 'image' | 'image_collection' | 'interactive'
  position: number
  created_at: string
  /**
   * Published document JSON (#65) — NULL for every legacy row. Validated
   * against the versioned schema on read via `readDocumentJson`, never
   * trusted as-is.
   *
   * NOT selected by every query: the Unit-page read lists its columns
   * explicitly so a page that does not render the snapshot does not ship it.
   */
  content: unknown
}

export interface DocumentImage {
  id: string
  document_id: string
  file_path: string
  position: number
  created_at: string
}

export interface DocumentWithImages extends Document {
  document_images: DocumentImage[]
}

export interface TaskWithDocuments extends Task {
  documents: DocumentWithImages[]
}

// Exactly what rendering a document's body needs — and deliberately nothing
// more. No `file_path`, so no storage path travels to the browser for a
// component that addresses everything through the proxy routes by id. Both
// student surfaces satisfy it: the accordion passes its full
// `DocumentWithImages` rows, the full-page route selects only these columns.
export type RenderableDocument = Pick<Document, 'id' | 'title' | 'file_type' | 'content'> & {
  document_images: Pick<DocumentImage, 'id'>[]
}

// A single Document plus the ancestry its full-page route needs (#69):
// `kurs.published` is what the page enforces access with, and the ids and
// titles are the way back into the hierarchy for someone who arrived from a
// bookmark or a shared link with no history behind them.
export interface DocumentWithAncestry {
  document: RenderableDocument & Pick<Document, 'description'>
  task: Pick<Task, 'id' | 'title'>
  unit: Pick<Unit, 'id' | 'title'>
  kurs: Pick<Kurs, 'id' | 'title' | 'published'>
}

export interface UnitWithTasks extends Unit {
  tasks: TaskWithDocuments[]
}

export interface KursWithUnits extends Kurs {
  units: UnitWithTasks[]
}

// ── Editor drafts (PRD #28) ─────────────────────────────────────────────────

// Draft documents of the LaTeX editor. Live outside the Kurs → Unit → Task →
// Document hierarchy until published (published_document_id links the
// resulting Document; SET NULL when that Document is deleted).
export interface EditorDocument {
  id: string
  title: string
  /** Versioned document JSON — validated against DocumentJsonSchema at both boundaries. */
  content: unknown
  published_document_id: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type EditorDocumentListItem = Pick<
  EditorDocument,
  'id' | 'title' | 'created_at' | 'updated_at' | 'published_document_id'
>

// Uploaded images of editor drafts (slice 8). Mirrors DocumentImage: rows
// cascade with their draft; storage objects are removed by the server actions.
export interface EditorImage {
  id: string
  editor_document_id: string
  file_path: string
  created_at: string
}

// Lean Kurs → Unit → Task tree for the editor's export/publish target
// selection (slice 10 — filename ordinals; slice 11 — publish target) and,
// since #72, for the link picker. Fetched by getEditorTargetTree()
// (DAL-sorted: position ASC, created_at ASC); serializable, crosses the
// server→client boundary as a page prop.
// The 1-based array index is the filename ordinal — NOT the raw `position`.
//
// `published` is carried but NOT filtered on: publishing may target an
// unpublished Kurs, while the link picker may only offer published ones
// (a link must point at something a student can reach, spec #63 §6). One tree,
// two rules — the consumer applies its own.
export type EditorTargetTask = Pick<Task, 'id' | 'title' | 'position' | 'created_at'>
export type EditorTargetUnit = Pick<Unit, 'id' | 'title' | 'position' | 'created_at'> & {
  tasks: EditorTargetTask[]
}
export type EditorTargetKurs = Pick<Kurs, 'id' | 'title' | 'position' | 'created_at' | 'published'> & {
  units: EditorTargetUnit[]
}

// The lazily-fetched fourth level of the link picker (#72): the Dokumente of
// one Task, each with the Sprungmarken it offers.
//
// The tree above deliberately stops at Task so no document or image id reaches
// the client bundle, and that reason still holds — so this arrives per Task, on
// expand. `anchors` is read out of the published snapshot server-side; the
// snapshot itself never crosses the boundary.
export interface LinkTargetDocument {
  id: string
  title: string
  anchors: { id: string; label: string }[]
}

// ── Server action result types ──────────────────────────────────────────────

export type ActionSuccess<T = void> = { ok: true; data: T }
export type ActionError = { ok: false; error: string }
export type ActionResult<T = void> = ActionSuccess<T> | ActionError

// ── Audit log ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string
  actor_id: string
  action: 'create' | 'update' | 'delete' | 'grant' | 'revoke'
  entity_type: 'kurs' | 'unit' | 'task' | 'document' | 'entitlement' | 'editor_document' | 'editor_image'
  entity_id: string
  entity_title: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

// ── Entitlements ────────────────────────────────────────────────────────────

export interface Entitlement {
  id: string
  user_id: string
  unit_id: string
  granted_at: string
  source: 'purchase' | 'admin'
  stripe_session_id: string | null
}
