import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UnitWithTasks } from '@/types'
import UnitDetailClient from '@/components/UnitDetailClient'

interface Props {
  params: Promise<{ kursId: string; unitId: string }>
}

export default async function UnitPage({ params }: Props) {
  const { kursId, unitId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('units')
    .select('*, tasks(*, documents(*, document_images(id, file_path, position, created_at)))')
    .eq('id', unitId)
    .single()

  if (error || !data) notFound()

  const unit = data as UnitWithTasks

  // Sort tasks and documents by position ASC, then created_at ASC
  unit.tasks.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
  unit.tasks.forEach((task) => {
    task.documents.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
    task.documents.forEach((doc) =>
      doc.document_images.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
    )
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/kurse/${kursId}`} className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
        ← Back to course
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">{unit.title}</h1>
      {unit.description && (
        <p className="mt-2 text-gray-600">{unit.description}</p>
      )}

      <UnitDetailClient tasks={unit.tasks} />
    </div>
  )
}
