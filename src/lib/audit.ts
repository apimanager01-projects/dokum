import 'server-only'
import { createClient } from '@/lib/supabase/server'

type AuditAction = 'create' | 'update' | 'delete'
type EntityType = 'kurs' | 'unit' | 'task' | 'document'

export async function logAdminAction(params: {
  actorId: string
  action: AuditAction
  entityType: EntityType
  entityId: string
  entityTitle?: string | null
  metadata?: Record<string, unknown>
}): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('audit_logs').insert({
    actor_id: params.actorId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    entity_title: params.entityTitle ?? null,
    metadata: params.metadata ?? null,
  })
  if (error) {
    // Audit log failure must NEVER fail the primary operation.
    console.error('[audit] Failed to write audit log:', error.message, {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
    })
  }
}
