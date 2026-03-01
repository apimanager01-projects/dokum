import Link from 'next/link'
import type { Kurs } from '@/types'

export function KursCard({ kurs }: { kurs: Kurs }) {
  return (
    <Link
      href={`/kurse/${kurs.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand/30 hover:shadow-md animate-slide-up"
    >
      <h2 className="text-base font-semibold text-gray-900">{kurs.title}</h2>
      {kurs.description && (
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{kurs.description}</p>
      )}
      <span className="mt-4 inline-block text-xs font-medium text-brand">
        View course →
      </span>
    </Link>
  )
}
