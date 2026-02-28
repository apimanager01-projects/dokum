'use client'

import { useActionState } from 'react'
import { createUnit } from '@/actions/admin'
import type { Kurs } from '@/types'

type ActionState = {
  error?: string
  success?: boolean
}

const initialState: ActionState = {}

export function AddUnitForm({ kurse }: { kurse: Pick<Kurs, 'id' | 'title'>[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => {
      const result = await createUnit(formData)
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
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Unit added successfully.
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="unit-kurs" className="text-sm font-medium text-gray-700">
          Kurs <span className="text-red-500">*</span>
        </label>
        <select
          id="unit-kurs"
          name="kurs_id"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">— Select a Kurs —</option>
          {kurse.map((k) => (
            <option key={k.id} value={k.id}>
              {k.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unit-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="unit-title"
          name="title"
          type="text"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unit-description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="unit-description"
          name="description"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unit-position" className="text-sm font-medium text-gray-700">
          Position
        </label>
        <input
          id="unit-position"
          name="position"
          type="number"
          defaultValue={0}
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <p className="text-xs text-gray-400">Lower numbers appear first within the Kurs.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Add Unit'}
      </button>
    </form>
  )
}
