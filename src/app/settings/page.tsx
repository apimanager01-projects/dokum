import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'
import { DeleteAccountForm } from '@/components/settings/DeleteAccountForm'

export const metadata: Metadata = {
  title: 'Settings – Dokum',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const displayName =
    user.user_metadata?.['full_name'] ||
    user.user_metadata?.['name'] ||
    user.email?.split('@')[0] ||
    'Account'

  return (
    <div className="mx-auto w-full max-w-3xl py-10">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Account</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd className="mt-1 font-medium text-gray-900">{displayName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="mt-1 font-medium text-gray-900">{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Session</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
          Sign out of this device. You can sign in again at any time with your account credentials.
        </p>
        <form action={signOut} className="mt-4">
          <button
            type="submit"
            className="rounded-md border border-brand px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/5"
          >
            Sign out
          </button>
        </form>
      </section>

      <section className="mt-4 rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-red-900">Danger zone</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
          Delete your account permanently. This requires an extra confirmation step.
        </p>
        <div className="mt-4">
          <DeleteAccountForm email={user.email ?? ''} />
        </div>
      </section>
    </div>
  )
}
