import { z } from 'zod'
import { DocumentJsonSchema } from '@/lib/editor/document-json'

// ── Shared field definitions ────────────────────────────────────────────────

const titleField = z.string().min(1, 'Title is required.').max(200).trim()
const descriptionField = z.string().max(2000).trim().nullable().optional()
  .transform((v) => v ?? null)
const positionField = z.coerce.number().int().min(0).default(0)
const uuidField = z.string().uuid()

// ── Entity schemas ──────────────────────────────────────────────────────────

export const KursFormSchema = z.object({
  title: titleField,
  description: descriptionField,
  position: positionField,
  published: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
})

export const UnitFormSchema = z.object({
  kurs_id: uuidField,
  title: titleField,
  description: descriptionField,
  position: positionField,
})

export const TaskFormSchema = z.object({
  unit_id: uuidField,
  title: titleField,
  description: descriptionField,
  position: positionField,
})

export const DocumentMetaSchema = z.object({
  task_id: uuidField,
  title: titleField,
  description: descriptionField,
  position: positionField,
  doc_type: z.enum(['pdf', 'image', 'image_collection']).default('pdf'),
})

export const DocumentUpdateMetaSchema = z.object({
  title: titleField,
  description: descriptionField,
  position: positionField,
})

// Editor drafts (PRD #28, slice 7). German messages — the editor UI is
// German end to end. `content` arrives as a JSON string in FormData and is
// validated against the versioned document schema before touching the DB
// (operator story 34).
export const EditorDraftFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Titel ist erforderlich.')
    .max(200, 'Titel darf höchstens 200 Zeichen lang sein.'),
  content: z
    .string()
    .max(3_000_000, 'Der Entwurf ist zu groß.')
    .transform((raw, ctx) => {
      try {
        return JSON.parse(raw) as unknown
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Ungültiges Dokument-JSON.' })
        return z.NEVER
      }
    })
    .pipe(DocumentJsonSchema),
})

// ── Auth schemas ────────────────────────────────────────────────────────────

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  full_name: z.string().min(1, 'Full name is required.').max(100).trim().optional(),
})

// ── Inferred types ──────────────────────────────────────────────────────────

export type KursFormData = z.infer<typeof KursFormSchema>
export type UnitFormData = z.infer<typeof UnitFormSchema>
export type TaskFormData = z.infer<typeof TaskFormSchema>
export type DocumentMetaData = z.infer<typeof DocumentMetaSchema>
export type DocumentUpdateMetaData = z.infer<typeof DocumentUpdateMetaSchema>
export type EditorDraftFormData = z.infer<typeof EditorDraftFormSchema>
