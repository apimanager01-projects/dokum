/**
 * PROTOTYPE (#120) — html2canvas grain-reproduction bench. Dev only.
 *
 * A route of its own, like #117's /type: this drives the REAL export pipeline
 * (`exportAreaToPngBlob`) over a faithful replica of the editor's `#exportArea`,
 * so the numbers it reports are the numbers publishing would get. It has nothing
 * to authenticate against, so the proxy exempts it in dev (see src/proxy.ts).
 */

import { notFound } from 'next/navigation'
import { GrainExportBench } from './_prototype/Bench'

export default async function GrainExportPage({
  searchParams,
}: {
  searchParams: Promise<{ formulas?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { formulas } = await searchParams
  const count = Number(formulas)

  return <GrainExportBench formulaCount={Number.isFinite(count) && count > 0 ? count : 20} />
}
