'use client'

import { useActionState } from 'react'
import { createDocument } from '@/actions/admin'
import type { Task, Unit, Kurs } from '@/types'

type ActionState = {
  error?: string
  success?: boolean
}

const initialState: ActionState = {}

type TaskWithUnit = Task & { units: Unit & { kurse: Pick<Kurs, 'title'> } }

export function AddDocumentForm({
  tasks,
  onTaskChange,
  defaultTaskId = '',
}: {
  tasks: TaskWithUnit[]
  onTaskChange?: (taskId: string) => void
  defaultTaskId?: string
}) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => {
      const result = await createDocument(formData)
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
      {state.success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-3">
          <p className="text-sm font-medium text-green-800">Dokument erfolgreich hochgeladen!</p>
          <div className="mt-3">
            <a
              href="/admin"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              ← Zurück zur Übersicht
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="doc-task" className="text-sm font-medium text-gray-700">
          Task <span className="text-red-500">*</span>
        </label>
        <select
          id="doc-task"
          name="task_id"
          required
          defaultValue={defaultTaskId}
          onChange={(e) => onTaskChange?.(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">— Select a Task —</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.units.kurse.title} › {t.units.title} › {t.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="doc-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="doc-title"
          name="title"
          type="text"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="doc-description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="doc-description"
          name="description"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="doc-pdf" className="text-sm font-medium text-gray-700">
          PDF File <span className="text-red-500">*</span>
        </label>
        <input
          id="doc-pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          required
          className="text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
        <p className="text-xs text-gray-400">Max file size: 10 MB</p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="doc-position" className="text-sm font-medium text-gray-700">
          Position
        </label>
        <input
          id="doc-position"
          name="position"
          type="number"
          defaultValue={0}
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-gray-400">Lower numbers appear first within the Task.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/5 disabled:opacity-50 btn-brand"
      >
        {pending ? 'Saving…' : 'Add Document'}
      </button>
    </form>
  )
}
