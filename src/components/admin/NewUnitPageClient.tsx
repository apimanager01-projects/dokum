'use client'

import { useState } from 'react'
import { AddUnitForm } from '@/components/admin/AddUnitForm'
import { KursTree } from '@/components/admin/KursTree'

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

type Props = {
  kurseWithUnits: KursWithUnits[]
  defaultKursId: string
}

export function NewUnitPageClient({ kurseWithUnits, defaultKursId }: Props) {
  const [selectedKursId, setSelectedKursId] = useState(defaultKursId)

  const kurse = kurseWithUnits.map(({ id, title }) => ({ id, title }))

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
      <AddUnitForm kurse={kurse} onKursChange={setSelectedKursId} defaultKursId={defaultKursId} />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">Kurs-Übersicht</p>
        <KursTree kurse={kurseWithUnits} selectedKursId={selectedKursId} />
      </div>
    </div>
  )
}
