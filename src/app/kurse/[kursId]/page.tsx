import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { KursWithUnits } from '@/types'

export default async function KursPage({ params }: { params: Promise<{ kursId: string }> }) {
  const { kursId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kurse')
    .select(`
      *,
      units (
        *,
        tasks ( * )
      )
    `)
    .eq('id', kursId)
    .single()

  if (error || !data) notFound()

  const kurs = data as KursWithUnits

  // Sort units and tasks by position ASC, then created_at ASC
  kurs.units.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
  kurs.units.forEach((unit) =>
    unit.tasks.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to courses
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{kurs.title}</h1>
      {kurs.description && (
        <p className="mt-2 text-gray-600">{kurs.description}</p>
      )}

      {kurs.units.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No units yet.</p>
      ) : (
        <div className="mt-8 space-y-8">
          {kurs.units.map((unit) => (
            <section key={unit.id}>
              <h2 className="text-lg font-semibold text-gray-800">{unit.title}</h2>
              {unit.description && (
                <p className="mt-1 text-sm text-gray-500">{unit.description}</p>
              )}

              {unit.tasks.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No tasks yet.</p>
              ) : (
                <ul className="mt-3 space-y-1">
                  {unit.tasks.map((task) => (
                    <li key={task.id}>
                      <Link
                        href={`/kurse/${kursId}/tasks/${task.id}`}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <span className="text-gray-400">›</span>
                        {task.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
