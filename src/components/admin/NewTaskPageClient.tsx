'use client'

import { useState } from 'react'
import { AddTaskForm } from '@/components/admin/AddTaskForm'
import { TaskTree } from '@/components/admin/TaskTree'

type Task = { id: string; title: string; position: number; created_at: string }
type Unit = { id: string; title: string; position: number; created_at: string; tasks: Task[] }
type KursWithUnitsAndTasks = { id: string; title: string; units: Unit[] }

type Props = {
  kurseWithUnitsAndTasks: KursWithUnitsAndTasks[]
}

export function NewTaskPageClient({ kurseWithUnitsAndTasks }: Props) {
  const [selectedUnitId, setSelectedUnitId] = useState('')

  // Flatten units with kurs title for the form dropdown
  const units = kurseWithUnitsAndTasks.flatMap((kurs) =>
    kurs.units.map((unit) => ({
      ...unit,
      kurse: { title: kurs.title },
    }))
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
      <AddTaskForm units={units} onUnitChange={setSelectedUnitId} />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">Kurs-Übersicht</p>
        <TaskTree kurse={kurseWithUnitsAndTasks} selectedUnitId={selectedUnitId} />
      </div>
    </div>
  )
}
