import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getUnitWithTasks } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import UnitDetailClient from '@/components/UnitDetailClient'

interface Props {
  params: Promise<{ kursId: string; unitId: string }>
  searchParams: Promise<{ openTask?: string }>
}

export default async function UnitPage({ params, searchParams }: Props) {
  const { kursId, unitId } = await params
  const { openTask } = await searchParams
  const [unit, supabase] = await Promise.all([getUnitWithTasks(unitId), createClient()])
  if (!unit) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const watermarkId = (user?.id ?? 'unknown').slice(0, 8).toUpperCase()

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
        <UnitDetailClient tasks={unit.tasks} openTaskId={openTask} watermarkId={watermarkId} />
      </div>
    </div>
  )
}
