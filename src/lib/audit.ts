import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

type AuditAction = 'create' | 'update' | 'delete' | 'grant' | 'revoke'
type EntityType = 'kurs' | 'unit' | 'task' | 'document' | 'entitlement'

type AuditParams = {
  actorId: string
  action: AuditAction
  entityType: EntityType
  entityId: string
  entityTitle?: string | null
  metadata?: Record<string, unknown>
}

async function writeAudit(supabase: SupabaseClient, params: AuditParams): Promise<void> {
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

export async function logAdminAction(params: AuditParams): Promise<void> {
  const supabase = await createClient()
  await writeAudit(supabase, params)
}

// Webhook / checkout-success handlers run with a service-role client (no JWT)
// and must use this variant — the SSR client would lack INSERT permission.
export async function logAuditWith(
  supabase: SupabaseClient,
  params: AuditParams,
): Promise<void> {
  await writeAudit(supabase, params)
}
