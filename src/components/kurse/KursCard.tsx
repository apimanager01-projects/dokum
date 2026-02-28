import Link from 'next/link'
import type { Kurs } from '@/types'

export function KursCard({ kurs }: { kurs: Kurs }) {
  return (
    <Link
      href={`/kurse/${kurs.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300"
    >
      <h2 className="text-base font-semibold text-gray-900">{kurs.title}</h2>
      {kurs.description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{kurs.description}</p>
      )}
      <span className="mt-3 inline-block text-xs font-medium text-gray-400">
        View course →
      </span>
    </Link>
  )
}
