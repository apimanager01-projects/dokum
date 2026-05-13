import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Kurs, KursWithUnits, UnitWithTasks } from '@/types'

// ── Shared sort utility ─────────────────────────────────────────────────────
function sortByPosition<T extends { position: number; created_at: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
}

// ── Kurs queries ────────────────────────────────────────────────────────────

export async function getPublishedKurse(): Promise<Kurs[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select('*')
    .eq('published', true)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function getAllKurse(): Promise<Kurs[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  return data ?? []
}

export async function getKursById(
  kursId: string
): Promise<Pick<Kurs, 'title' | 'description' | 'position' | 'published'> | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select('title, description, position, published')
    .eq('id', kursId)
    .single()
  return data ?? null
}

// Returns Kurs + sorted Units (no tasks/documents). Used by admin/kurse and admin/units pages.
export async function getAllKurseWithUnits(): Promise<KursWithUnits[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select('*, units(id, kurs_id, title, description, position, created_at)')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  const kurse = (data ?? []) as KursWithUnits[]
  kurse.forEach((k) => { k.units = sortByPosition(k.units ?? []) })
  return kurse
}

// Returns full deep tree. Used by admin/tasks and admin/documents pages.
export async function getAllKurseDeep(): Promise<KursWithUnits[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select(`
      *,
      units(
        *,
        tasks(
          *,
          documents(
            id, title, position, created_at, file_type,
            document_images(id)
          )
        )
      )
    `)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  const kurse = (data ?? []) as KursWithUnits[]
  kurse.forEach((k) => {
    k.units = sortByPosition(k.units ?? [])
    k.units.forEach((u) => {
      u.tasks = sortByPosition(u.tasks ?? [])
      u.tasks.forEach((t) => {
        t.documents = sortByPosition(t.documents ?? [])
      })
    })
  })
  return kurse
}

export async function getPublishedKurseDeep(): Promise<KursWithUnits[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('kurse')
    .select(`
      *,
      units(
        *,
        tasks(
          *,
          documents(
            id, title, position, created_at, file_type,
            document_images(id)
          )
        )
      )
    `)
    .eq('published', true)
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  const kurse = (data ?? []) as KursWithUnits[]
  kurse.forEach((k) => {
    k.units = sortByPosition(k.units ?? [])
    k.units.forEach((u) => {
      u.tasks = sortByPosition(u.tasks ?? [])
      u.tasks.forEach((t) => {
        t.documents = sortByPosition(t.documents ?? [])
      })
    })
  })
  return kurse
}

// Returns Kurs with sorted Units. Used by public Kurs detail page.
export async function getKursWithUnits(kursId: string): Promise<KursWithUnits | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('kurse')
    .select('*, units(id, kurs_id, title, description, position, created_at)')
    .eq('id', kursId)
    .single()
  if (error || !data) return null
  const kurs = data as KursWithUnits
  kurs.units = sortByPosition(kurs.units ?? [])
  return kurs
}

// ── Unit queries ────────────────────────────────────────────────────────────

export async function getUnitById(
  unitId: string
): Promise<Pick<import('@/types').Unit, 'kurs_id' | 'title' | 'description' | 'position'> | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('units')
    .select('kurs_id, title, description, position')
    .eq('id', unitId)
    .single()
  return data ?? null
}

// Returns Unit with fully sorted Tasks → Documents → DocumentImages. Used by public Unit detail page.
export async function getUnitWithTasks(unitId: string): Promise<UnitWithTasks | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('units')
    .select('*, tasks(*, documents(*, document_images(id, file_path, position, created_at)))')
    .eq('id', unitId)
    .single()
  if (error || !data) return null
  const unit = data as UnitWithTasks
  unit.tasks = sortByPosition(unit.tasks ?? [])
  unit.tasks.forEach((t) => {
    t.documents = sortByPosition(t.documents ?? [])
    t.documents.forEach((d) => {
      d.document_images = sortByPosition(d.document_images ?? [])
    })
  })
  return unit
}

// ── Task queries ────────────────────────────────────────────────────────────

export async function getTaskById(
  taskId: string
): Promise<Pick<import('@/types').Task, 'unit_id' | 'title' | 'description' | 'position'> | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tasks')
    .select('unit_id, title, description, position')
    .eq('id', taskId)
    .single()
  return data ?? null
}

// ── Document queries ────────────────────────────────────────────────────────

export async function getDocumentById(
  docId: string
): Promise<Pick<import('@/types').Document, 'task_id' | 'title' | 'description' | 'position' | 'file_path' | 'file_type'> | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('documents')
    .select('task_id, title, description, position, file_path, file_type')
    .eq('id', docId)
    .single()
  return data ?? null
}

// Used by /api/file/[docId] route
export async function getDocumentFilePath(
  docId: string
): Promise<{ file_path: string | null } | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', docId)
    .single()
  return data ?? null
}

// Used by /api/image/[imageId] route
export async function getImageFilePath(
  imageId: string
): Promise<{ file_path: string } | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('document_images')
    .select('file_path')
    .eq('id', imageId)
    .single()
  return data ?? null
}

// ── Entitlement queries ─────────────────────────────────────────────────────

// Returns the set of unit IDs the current user has access to via a paid
// purchase or admin grant. Admins are treated as entitled to every unit;
// callers that have an admin user can skip this query entirely.
export async function getEntitledUnitIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('entitlements')
    .select('unit_id')
    .eq('user_id', userId)
  return new Set((data ?? []).map((row) => row.unit_id as string))
}

// Single-unit access check. Pass the `app_metadata.role` value (or undefined)
// so admins short-circuit without a DB round-trip.
export async function userHasUnitAccess(
  userId: string,
  unitId: string,
  role: string | undefined,
): Promise<boolean> {
  if (role === 'admin') return true
  const supabase = await createClient()
  const { data } = await supabase
    .from('entitlements')
    .select('id')
    .eq('user_id', userId)
    .eq('unit_id', unitId)
    .maybeSingle()
  return data !== null
}
