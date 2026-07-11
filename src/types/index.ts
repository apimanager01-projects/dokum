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
  file_type: 'pdf' | 'image' | 'image_collection'
  position: number
  created_at: string
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
// selection (slice 10 — filename ordinals; slice 11 — publish target).
// Fetched by getEditorTargetTree() (DAL-sorted: position ASC, created_at
// ASC); serializable, crosses the server→client boundary as a page prop.
// The 1-based array index is the filename ordinal — NOT the raw `position`.
export type EditorTargetTask = Pick<Task, 'id' | 'title' | 'position' | 'created_at'>
export type EditorTargetUnit = Pick<Unit, 'id' | 'title' | 'position' | 'created_at'> & {
  tasks: EditorTargetTask[]
}
export type EditorTargetKurs = Pick<Kurs, 'id' | 'title' | 'position' | 'created_at'> & {
  units: EditorTargetUnit[]
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
