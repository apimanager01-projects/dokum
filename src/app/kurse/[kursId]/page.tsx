import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getKursWithUnits, getEntitledUnitIds } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import ShareButton from '@/components/ShareButton'
import { UnitCard } from '@/components/kurse/UnitCard'

export default async function KursPage({ params }: { params: Promise<{ kursId: string }> }) {
  const { kursId } = await params
  const kurs = await getKursWithUnits(kursId)
  if (!kurs) notFound()

  // Build the per-unit lock state. Admins skip the entitlement query — they can
  // see everything via RLS overrides anyway.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.['role'] === 'admin'
  const entitledIds = !user || isAdmin ? new Set<string>() : await getEntitledUnitIds(user.id)

  return (
    /* Ground wrapper retired (#116/#118/#119, landed by #122) — see kurse/page.tsx. */
    <div>
      <div className="mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16">
        <Link href="/kurse" className="mb-8 inline-block text-sm font-medium text-ink-muted hover:text-ink">
          ← Back to courses
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[0]">{kurs.title}</h1>
            {kurs.description && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{kurs.description}</p>
            )}
            <p className="mt-3 max-w-2xl text-xs text-ink-muted">
              Alle Lernunterlagen ohne Gewähr auf Richtigkeit und Vollständigkeit. Fehler können nicht ausgeschlossen werden.
            </p>
          </div>
          <ShareButton title={kurs.title} />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kurs.units.map((unit) => (
            <UnitCard
            key={unit.id}
            unit={unit}
            kursId={kursId}
            locked={!isAdmin && !entitledIds.has(unit.id)}
          />
          ))}
        </div>
      </div>
    </div>
  )
}
