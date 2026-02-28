'use client'

import { useActionState } from 'react'
import { createDocument } from '@/actions/admin'

type ActionState = {
  error?: string
  success?: boolean
}

const initialState: ActionState = {}

export function AddDocumentForm() {
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
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Document added successfully.
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pdf" className="text-sm font-medium text-gray-700">
          PDF File <span className="text-red-500">*</span>
        </label>
        <input
          id="pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          required
          className="text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
        <p className="text-xs text-gray-400">Max file size: 10 MB</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          value="true"
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publish immediately
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? 'Saving…' : 'Add Document'}
      </button>
    </form>
  )
}
