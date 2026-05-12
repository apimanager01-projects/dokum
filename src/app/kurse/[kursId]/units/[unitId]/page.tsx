import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUnitById, getUnitWithTasks, userHasUnitAccess } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import UnitDetailClient from '@/components/UnitDetailClient'
import UnitPaywall from '@/components/kurse/UnitPaywall'

interface Props {
  params: Promise<{ kursId: string; unitId: string }>
  searchParams: Promise<{ canceled?: string; purchased?: string }>
}

export default async function UnitPage({ params, searchParams }: Props) {
  const { kursId, unitId } = await params
  const { canceled, purchased } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // Middleware already redirects unauthenticated visitors away from protected
  // pages, but guard defensively in case the matcher is ever loosened.
  if (!user) notFound()

  const role = user.app_metadata?.['role'] as string | undefined
  const hasAccess = await userHasUnitAccess(user.id, unitId, role)

  if (!hasAccess) {
    // The full tree is gated by RLS, so fall back to the bare-unit query that
    // only needs the published-Kurs visibility (still allowed for everyone).
    const meta = await getUnitById(unitId)
    if (!meta) notFound()

    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/kurse/${kursId}`} className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
          ← Back to course
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{meta.title}</h1>
        {meta.description && (
          <p className="mt-2 text-gray-600">{meta.description}</p>
        )}
        <UnitPaywall
          unitId={unitId}
          title={meta.title}
          description={meta.description}
          canceled={canceled === '1'}
        />
      </div>
    )
  }

  const unit = await getUnitWithTasks(unitId)
  if (!unit) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/kurse/${kursId}`} className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to course
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">{unit.title}</h1>
      {unit.description && (
        <p className="mt-2 text-gray-600">{unit.description}</p>
      )}
      {purchased === '1' && (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Zahlung erfolgreich – die Einheit ist freigeschaltet.
        </p>
      )}
      <UnitDetailClient tasks={unit.tasks} />
    </div>
  )
}
