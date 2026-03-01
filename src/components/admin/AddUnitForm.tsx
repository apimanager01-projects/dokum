'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createUnit } from '@/actions/admin'
import type { Kurs } from '@/types'

type ActionState = {
  error?: string
  success?: boolean
  id?: string
}

const initialState: ActionState = {}

export function AddUnitForm({
  kurse,
  onKursChange,
  defaultKursId = '',
}: {
  kurse: Pick<Kurs, 'id' | 'title'>[]
  onKursChange?: (kursId: string) => void
  defaultKursId?: string
}) {
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
      {state.success && state.id && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-3">
          <p className="text-sm font-medium text-green-800">Unit erfolgreich angelegt!</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              ← Zurück zur Übersicht
            </Link>
            <Link
              href={`/admin/tasks/new?unitId=${state.id}`}
              className="rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5 btn-brand"
            >
              Task hinzufügen →
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="unit-kurs" className="text-sm font-medium text-gray-700">
          Kurs <span className="text-red-500">*</span>
        </label>
        <select
          id="unit-kurs"
          name="kurs_id"
          required
          defaultValue={defaultKursId}
          onChange={(e) => onKursChange?.(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
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
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-gray-400">Lower numbers appear first within the Kurs.</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/5 disabled:opacity-50 btn-brand"
      >
        {pending ? 'Saving…' : 'Add Unit'}
      </button>
    </form>
  )
}
