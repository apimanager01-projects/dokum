import { createClient } from '@/lib/supabase/server'
import { getPublishedKurse, getAllKurse } from '@/lib/dal'
import { KursCard } from '@/components/kurse/KursCard'

export default async function KursePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.['role'] === 'admin'

  const kurse = isAdmin ? await getAllKurse() : await getPublishedKurse()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kurse</h1>
      {kurse.length === 0 ? (
        <p className="text-sm text-gray-500">No courses available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {kurse.map((kurs) => (
            <KursCard key={kurs.id} kurs={kurs} />
          ))}
        </div>
      )}
    </div>
  )
}
