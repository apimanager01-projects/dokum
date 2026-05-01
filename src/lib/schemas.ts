import { z } from 'zod'

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
