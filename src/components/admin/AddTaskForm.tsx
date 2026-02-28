'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createTask } from '@/actions/admin'
import type { Unit, Kurs } from '@/types'

type ActionState = {
  error?: string
  success?: boolean
  id?: string
}

const initialState: ActionState = {}

type UnitWithKurs = Unit & { kurse: Pick<Kurs, 'title'> }

export function AddTaskForm({
  units,
  onUnitChange,
  defaultUnitId = '',
}: {
  units: UnitWithKurs[]
  onUnitChange?: (unitId: string) => void
  defaultUnitId?: string
}) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => {
      const result = await createTask(formData)
      return result ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {state.success && state.id && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-3">
          <p className="text-sm font-medium text-green-800">Task erfolgreich angelegt!</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              ← Zurück zur Übersicht
            </Link>
            <Link
              href={`/admin/documents/new?taskId=${state.id}`}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Dokument hinzufügen →
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="task-unit" className="text-sm font-medium text-gray-700">
          Unit <span className="text-red-500">*</span>
        </label>
        <select
          id="task-unit"
          name="unit_id"
          required
          defaultValue={defaultUnitId}
          onChange={(e) => onUnitChange?.(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">— Select a Unit —</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.kurse.title} › {u.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-position" className="text-sm font-medium text-gray-700">
          Position
        </label>
        <input
          id="task-position"
          name="position"
          type="number"
          defaultValue={0}
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <p className="text-xs text-gray-400">Lower numbers appear first within the Unit.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Add Task'}
      </button>
    </form>
  )
}
