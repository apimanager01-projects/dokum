'use client'

import { useActionState, useState } from 'react'
import { deleteAccount } from '@/actions/auth'

export function DeleteAccountForm({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [state, action, pending] = useActionState(deleteAccount, null)
  const confirmed = confirmation.trim() === email

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
      >
        Delete account
      </button>
    )
  }

  return (
    <form action={action} className="rounded-lg border border-red-200 bg-red-50/60 p-4">
      <h3 className="text-sm font-semibold text-red-900">Confirm account deletion</h3>
      <p className="mt-2 text-sm leading-relaxed text-red-800">
        This permanently deletes your account and signs you out. Type your email address to confirm.
      </p>

      <label className="mt-4 block text-sm font-medium text-red-950" htmlFor="delete-confirmation">
        Email address
      </label>
      <input
        id="delete-confirmation"
        name="confirmation"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        placeholder={email}
        className="mt-2 w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />

      {state?.ok === false && (
        <p className="mt-3 text-sm font-medium text-red-700">{state.error}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!confirmed || pending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Deleting...' : 'Permanently delete account'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false)
            setConfirmation('')
          }}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
