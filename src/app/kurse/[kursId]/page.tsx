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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to courses
      </Link>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">{kurs.title}</h1>
        <ShareButton title={kurs.title} />
      </div>
      {kurs.description && (
        <p className="mt-2 text-gray-600">{kurs.description}</p>
      )}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
  )
}
