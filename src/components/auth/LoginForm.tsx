'use client'

import { useActionState } from 'react'
import { signIn } from '@/actions/auth'
import Link from 'next/link'

const initialState = { error: undefined as string | undefined }

export function LoginForm({ message }: { message?: string }) {
  const [state, action, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signIn(formData)
      return result ?? initialState
    },
    initialState
  )

  return (
    <form action={action} className="flex flex-col gap-4">
      {message && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {message}
        </p>
      )}

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-gray-500">
        No account?{' '}
        <Link href="/auth/register" className="font-medium text-gray-900 underline">
          Register
        </Link>
      </p>
    </form>
  )
}
