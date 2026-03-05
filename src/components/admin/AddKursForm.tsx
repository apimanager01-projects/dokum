'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createKurs, updateKurs } from '@/actions/admin'

type ActionState = {
  error?: string
  success?: boolean
  id?: string
}

const initialState: ActionState = {}

type DefaultValues = {
  title: string
  description: string | null
  position: number
  published: boolean
}

export function AddKursForm({ editId, defaultValues }: { editId?: string; defaultValues?: DefaultValues }) {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (_prev: ActionState, formData: FormData) => {
      const result = editId ? await updateKurs(editId, formData) : await createKurs(formData)
      return result ?? initialState
    },
    initialState
  )

  useEffect(() => {
    if (state.success) router.refresh()
  }, [state.success])

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      {state.success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-3">
          <p className="text-sm font-medium text-green-800">
            {editId ? 'Kurs erfolgreich aktualisiert!' : 'Kurs erfolgreich angelegt!'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/admin"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              ← Zurück zur Übersicht
            </Link>
            {!editId && state.id && (
              <Link
                href={`/admin/units/new?kursId=${state.id}`}
                className="rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand/5 btn-brand"
              >
                Unit hinzufügen →
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="kurs-title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="kurs-title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="kurs-description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="kurs-description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ''}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="kurs-position" className="text-sm font-medium text-gray-700">
          Position
        </label>
        <input
          id="kurs-position"
          name="position"
          type="number"
          defaultValue={defaultValues?.position ?? 0}
          className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <p className="text-xs text-gray-400">Lower numbers appear first. Ties are broken by creation time.</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="kurs-published"
          name="published"
          type="checkbox"
          value="true"
          defaultChecked={defaultValues?.published ?? false}
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="kurs-published" className="text-sm font-medium text-gray-700">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand/5 disabled:opacity-50 btn-brand"
      >
        {pending ? 'Saving…' : editId ? 'Aktualisieren' : 'Add Kurs'}
      </button>
    </form>
  )
}
