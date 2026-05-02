'use client'

import { useState } from 'react'
import { UnitForm } from '@/components/admin/UnitForm'
import { AdminTree } from '@/components/admin/AdminTree'

type Unit = {
  id: string
  title: string
  position: number
  created_at: string
}

type KursWithUnits = {
  id: string
  title: string
  units: Unit[]
}

type DefaultValues = { title: string; description: string | null; position: number }

type Props = {
  kurseWithUnits: KursWithUnits[]
  defaultKursId: string
  editId?: string
  defaultValues?: DefaultValues
}

export function UnitPageClient({ kurseWithUnits, defaultKursId, editId, defaultValues }: Props) {
  const [selectedKursId, setSelectedKursId] = useState(defaultKursId)

  const kurse = kurseWithUnits.map(({ id, title }) => ({ id, title }))

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
      <UnitForm
        kurse={kurse}
        onKursChange={setSelectedKursId}
        defaultKursId={defaultKursId}
        editId={editId}
        defaultValues={defaultValues}
      />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">Kurs-Übersicht</p>
        <AdminTree kurse={kurseWithUnits} selectedId={selectedKursId} deleteLevel="unit" />
      </div>
    </div>
  )
}
