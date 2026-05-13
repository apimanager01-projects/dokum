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
    <div className="-mx-4 border-t border-gray-200 bg-[#fffdf8] sm:-mx-8" style={{ minHeight: 'calc(100svh - 66px)' }}>
      <div className="mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16">
        <Link href="/kurse" className="mb-8 inline-block text-sm font-medium text-gray-500 hover:text-gray-700">
          ← Back to courses
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[0] text-black">{kurs.title}</h1>
            {kurs.description && (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">{kurs.description}</p>
            )}
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
