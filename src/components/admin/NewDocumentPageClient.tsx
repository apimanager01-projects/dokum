'use client'

import { useState } from 'react'
import { AddDocumentForm } from '@/components/admin/AddDocumentForm'
import { DocumentTree } from '@/components/admin/DocumentTree'

type Document = { id: string; title: string; position: number; created_at: string }
type Task = { id: string; title: string; position: number; created_at: string; documents: Document[] }
type Unit = { id: string; title: string; position: number; created_at: string; tasks: Task[] }
type KursTree = { id: string; title: string; units: Unit[] }

type Props = {
  kurseTree: KursTree[]
}

export function NewDocumentPageClient({ kurseTree }: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState('')

  // Flatten tasks with unit + kurs labels for the form dropdown
  const tasks = kurseTree.flatMap((kurs) =>
    kurs.units.flatMap((unit) =>
      unit.tasks.map((task) => ({
        ...task,
        units: { ...unit, kurse: { title: kurs.title } },
      }))
    )
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[7fr_3fr]">
      <AddDocumentForm tasks={tasks} onTaskChange={setSelectedTaskId} />
      <div>
        <p className="mb-3 text-sm font-medium text-gray-500">Kurs-Übersicht</p>
        <DocumentTree kurse={kurseTree} selectedTaskId={selectedTaskId} />
      </div>
    </div>
  )
}
