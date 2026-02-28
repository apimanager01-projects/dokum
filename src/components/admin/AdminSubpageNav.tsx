import Link from 'next/link'

type Tab = 'kurse' | 'units' | 'tasks' | 'documents'

const TABS: { id: Tab; label: string; href: string }[] = [
  { id: 'kurse',     label: 'Kurs',     href: '/admin/kurse/new' },
  { id: 'units',     label: 'Unit',     href: '/admin/units/new' },
  { id: 'tasks',     label: 'Task',     href: '/admin/tasks/new' },
  { id: 'documents', label: 'Dokument', href: '/admin/documents/new' },
]

export function AdminSubpageNav({ active }: { active: Tab }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <Link href="/admin" className="shrink-0 text-sm text-gray-500 hover:text-gray-700">
        ← Zurück zur Übersicht
      </Link>
      <div className="flex items-center gap-1">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={
              tab.id === active
                ? 'rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
