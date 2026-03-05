'use client'

import { useState } from 'react'
import { AddTaskForm } from '@/components/admin/AddTaskForm'
import { AdminTree } from '@/components/admin/AdminTree'

type Task = { id: string; title: string; position: number; created_at: string }
type Unit = { id: string; kurs_id: string; title: string; description: string | null; position: number; created_at: string; tasks: Task[] }
type KursWithUnitsAndTasks = { id: string; title: string; units: Unit[] }

type DefaultValues = { title: string; description: string | null; position: number }

type Props = {
  kurseWithUnitsAndTasks: KursWithUnitsAndTasks[]
  defaultUnitId: string
  editId?: string
  defaultValues?: DefaultValues
}

export function NewTaskPageClient({ kurseWithUnitsAndTasks, defaultUnitId, editId, defaultValues }: Props) {
  const [selectedUnitId, setSelectedUnitId] = useState(defaultUnitId)

  // Flatten units with kurs title for the form dropdown
  const units = kurseWithUnitsAndTasks.flatMap((kurs) =>
    kurs.units.map((unit) => ({
      ...unit,
      kurse: { title: kurs.title },
    }))
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
      <AddTaskForm
        units={units}
        onUnitChange={setSelectedUnitId}
        defaultUnitId={defaultUnitId}
        editId={editId}
        defaultValues={defaultValues}
      />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">Kurs-Übersicht</p>
        <AdminTree kurse={kurseWithUnitsAndTasks} selectedId={selectedUnitId} deleteLevel="task" />
      </div>
    </div>
  )
}
