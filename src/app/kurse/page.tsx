import { cookies } from 'next/headers'
import { getPublishedKurseDeep } from '@/lib/dal'
import { KursCard } from '@/components/kurse/KursCard'
import { RecentMiniCases } from '@/components/kurse/RecentMiniCases'
import type { KursWithUnits } from '@/types'

export default async function KursePage() {
  const allKurse = await getPublishedKurseDeep()
  const cookieStore = await cookies()
  const raw = cookieStore.get('recent_minicases')?.value
  const recentIds = raw ? decodeURIComponent(raw).split(',').filter(Boolean) : []
  const recentDocuments = getRecentDocuments(allKurse, recentIds)

  return (
    <div
      className="-mx-4 border-t border-gray-200 bg-[#fffdf8] text-black sm:-mx-8"
      style={{ minHeight: 'calc(100svh - 66px)' }}
    >
      <main className="mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16">
        <section id="kurse" className="flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-[0] text-black">Courses</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
              Select a course to browse its units, tasks, and mini cases.
            </p>
          </div>

          {allKurse.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-sm font-medium text-gray-500">
              No courses available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
              {allKurse.map((kurs) => (
                <KursCard
                  key={kurs.id}
                  kurs={kurs}
                  unitCount={kurs.units.length}
                  miniCaseCount={countMiniCases(kurs)}
                />
              ))}
            </div>
          )}
        </section>

        <RecentMiniCases initialItems={recentDocuments} />
      </main>
    </div>
  )
}

function countMiniCases(kurs: KursWithUnits) {
  return kurs.units.reduce(
    (unitTotal, unit) =>
      unitTotal + unit.tasks.reduce((taskTotal, task) => taskTotal + task.documents.length, 0),
    0,
  )
}

function getRecentDocuments(kurse: KursWithUnits[], recentIds: string[]) {
  if (recentIds.length === 0) return []
  const allDocs = kurse.flatMap((kurs) =>
    kurs.units.flatMap((unit) =>
      unit.tasks.flatMap((task) =>
        task.documents.map((doc) => ({
          id: doc.id,
          title: doc.title,
          createdAt: doc.created_at,
          kursId: kurs.id,
          kursTitle: kurs.title,
          unitId: unit.id,
          unitTitle: unit.title,
          taskId: task.id,
        })),
      ),
    ),
  )
  const docMap = new Map(allDocs.map((d) => [d.id, d]))
  return recentIds.map((id) => docMap.get(id)).filter((d) => d !== undefined)
}
