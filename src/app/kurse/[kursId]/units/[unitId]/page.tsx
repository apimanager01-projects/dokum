import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUnitById, getUnitWithTasks, userHasUnitAccess } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import UnitDetailClient from '@/components/UnitDetailClient'
import UnitPaywall from '@/components/kurse/UnitPaywall'

interface Props {
  params: Promise<{ kursId: string; unitId: string }>
  searchParams: Promise<{ openTask?: string; canceled?: string; purchased?: string }>
}

export default async function UnitPage({ params, searchParams }: Props) {
  const { kursId, unitId } = await params
  const { openTask, canceled, purchased } = await searchParams

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

  const watermarkId = user.id.slice(0, 8).toUpperCase()

  return (
    <div className="-mx-4 border-t border-gray-200 bg-[#fffdf8] sm:-mx-8" style={{ minHeight: 'calc(100svh - 66px)' }}>
      <div className="mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16">
        <Link href={`/kurse/${kursId}`} className="mb-8 inline-block text-sm font-medium text-gray-500 hover:text-gray-700">
          ← Back to course
        </Link>
        <h1 className="text-4xl font-black tracking-[0] text-black">{unit.title}</h1>
        {unit.description && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">{unit.description}</p>
        )}
      {purchased === '1' && (
        <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Zahlung erfolgreich – die Einheit ist freigeschaltet.
        </p>
      )}
        <UnitDetailClient tasks={unit.tasks} openTaskId={openTask} watermarkId={watermarkId} />
      </div>
    </div>
  )
}
