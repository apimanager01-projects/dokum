/**
 * PROTOTYPE (#117) — type specimen. Dev only; `notFound()` in production.
 *
 * A route of its own rather than a `?variant=` on an existing page (as #116
 * did): there is no production page this belongs on, and the specimen needs
 * the whole viewport without a navbar set in a fifth typeface arguing with it.
 */

import { notFound } from 'next/navigation'
import { Specimen } from './_prototype/Specimen'
import { ALL_FONT_VARIABLES } from './_prototype/systems'

export default async function TypePage({
  searchParams,
}: {
  searchParams: Promise<{ system?: string; grain?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { system, grain } = await searchParams

  return (
    <div className={`${ALL_FONT_VARIABLES} -mx-4 sm:-mx-8`}>
      <Specimen initialSystem={system} initialGrain={grain} />
    </div>
  )
}
