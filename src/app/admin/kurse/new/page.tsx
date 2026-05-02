import Link from 'next/link'
import { getKursById, getAllKurseWithUnits } from '@/lib/dal'
import { KursForm } from '@/components/admin/KursForm'
import { AdminTree } from '@/components/admin/AdminTree'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewKursPage({
  searchParams,
}: {
  searchParams: Promise<{ editId?: string }>
}) {
  const { editId } = await searchParams

  const [editDefaults, kurse] = await Promise.all([
    editId ? getKursById(editId) : Promise.resolve(null),
    getAllKurseWithUnits(),
  ])

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="kurse" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? 'Kurs bearbeiten' : 'Kurs anlegen'}
        </h1>
        {editId && (
          <Link href="/admin/kurse/new" className="text-sm text-brand hover:underline">
            + Neuen Kurs anlegen
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
        <KursForm key={editId ?? 'new'} editId={editId} defaultValues={editDefaults ?? undefined} />
        <div>
          <p className="mb-3 text-sm font-medium text-gray-500">Vorhandene Kurse</p>
          <AdminTree kurse={kurse} selectedId="" deleteLevel="kurs" />
        </div>
      </div>
    </main>
  )
}
