'use client'

import Link from 'next/link'

export default function KursError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    /* Ground wrapper retired (#116/#118/#119, landed by #122) — see kurse/page.tsx. */
    <div>
      <div className="mx-auto max-w-5xl px-8 py-20 text-center sm:px-12 lg:px-16">
        <h2 className="text-2xl font-black tracking-[0]">This course couldn&apos;t be loaded.</h2>
        <p className="mt-3 text-base text-ink-muted">Please try again or go back to the overview.</p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            Try again
          </button>
          <Link
            href="/kurse"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to courses
          </Link>
        </div>
      </div>
    </div>
  )
}
