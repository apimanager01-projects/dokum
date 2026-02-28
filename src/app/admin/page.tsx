import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const cards = [
  {
    label: 'Kurs anlegen',
    subtitle: null,
    href: '/admin/kurse/new',
  },
  {
    label: 'Unit anlegen',
    subtitle: 'zu einem Kurs',
    href: '/admin/units/new',
  },
  {
    label: 'Task anlegen',
    subtitle: 'zu einer Unit',
    href: '/admin/tasks/new',
  },
  {
    label: 'Dokument hinzufügen',
    subtitle: 'zu einem Task',
    href: '/admin/documents/new',
  },
]

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.app_metadata?.['role'] !== 'admin') {
    redirect('/')
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Admin</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900">{card.label}</p>
              {card.subtitle && (
                <p className="mt-1 text-xs text-gray-400">{card.subtitle}</p>
              )}
            </div>
            <span className="mt-4 text-xs font-medium text-gray-400">→</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
