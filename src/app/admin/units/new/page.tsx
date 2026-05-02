import Link from 'next/link'
import { getUnitById, getAllKurseWithUnits } from '@/lib/dal'
import { UnitPageClient } from '@/components/admin/UnitPageClient'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'

export default async function NewUnitPage({
  searchParams,
}: {
  searchParams: Promise<{ kursId?: string; editId?: string }>
}) {
  const { kursId, editId } = await searchParams

  let defaultKursId = kursId ?? ''
  let editDefaults: { title: string; description: string | null; position: number } | undefined
  if (editId) {
    const data = await getUnitById(editId)
    if (data) {
      editDefaults = { title: data.title, description: data.description, position: data.position }
      defaultKursId = data.kurs_id
    }
  }

  const kurse = await getAllKurseWithUnits()

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="units" />
      <div className="mb-8 flex items-baseline gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? 'Unit bearbeiten' : 'Unit anlegen'}
        </h1>
        {editId && (
          <Link href="/admin/units/new" className="text-sm text-brand hover:underline">
            + Neue Unit anlegen
          </Link>
        )}
      </div>
      <UnitPageClient
        key={editId ?? 'new'}
        kurseWithUnits={kurse}
        defaultKursId={defaultKursId}
        editId={editId}
        defaultValues={editDefaults}
      />
    </main>
  )
}
