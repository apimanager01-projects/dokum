import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Kurs } from '@/types'

export function KursCard({
  kurs,
  unitCount,
  miniCaseCount,
}: {
  kurs: Kurs
  unitCount: number
  miniCaseCount: number
}) {
  return (
    <Link
      href={`/kurse/${kurs.id}`}
      /*
       * #119's hover rule, landed: border-colour only, at `--dokum-dur-micro`,
       * with no transform and no shadow. The lift plus the 30px shadow bloom
       * was the register #116 retired, and `box-shadow` is paint-bound where
       * `transform`/`opacity` are composited — so it cost frames as well as
       * taste. `transition-all` goes with them: it was animating properties
       * nobody had chosen.
       *
       * Hairline at rest, `--dokum-edge` on hover. #118 says an edge means „you
       * can act on this" — a card IS something you can act on, so revealing the
       * edge under the pointer states the grammar rather than bending it.
       *
       * The card's geometry — radius, the seam, the numeral slot — is #121's.
       */
      className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface p-6 transition-colors duration-[var(--dokum-dur-micro)] ease-[var(--dokum-ease-standard)] hover:border-edge animate-slide-up"
    >
      {!kurs.published && (
        <span className="absolute right-5 top-5 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
          Unpublished
        </span>
      )}
      <div className="flex items-start gap-4">
        <div className="min-w-0 pt-1">
          <h2 className="text-2xl font-black leading-none tracking-[0] text-black">{kurs.title}</h2>
          {kurs.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-gray-600">{kurs.description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-600" style={{ maxWidth: 260 }}>
        <Metric icon={<BookIcon />} value={unitCount} label="Units" />
        <Metric icon={<DocumentIcon />} value={miniCaseCount} label="Mini Cases" />
      </div>

    </Link>
  )
}

function Metric({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <span className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-800">{icon}</span>
      <span>
        <strong className="block text-base leading-none text-black">{value}</strong>
        <span className="mt-1 block text-xs leading-none text-gray-600">{label}</span>
      </span>
    </span>
  )
}


function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 5.5v16A2.5 2.5 0 0 1 6.5 19H20" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v5h5M9.5 12h6M9.5 16h6" />
    </svg>
  )
}
