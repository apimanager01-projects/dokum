/**
 * PROTOTYPE (#116) — throwaway host. Three variants of /kurse, switchable via
 * `?variant=`, rendered on the real route so they sit under the real navbar.
 *
 * The navbar above is CURRENT PRODUCTION CHROME, not part of any variant —
 * each variant renders its own wordmark lockup at the top of the page so the
 * `DOKUM` tile and the proposed `dokum.` can be compared in one screen.
 *
 * GRAIN IS A SECOND AXIS, not part of the variant. The map wants it decided
 * deliberately and wants it product-wide, so binding it to one variant would
 * settle two questions with one click: "is warmth the lever" and "does the
 * product have texture" are separable, and B or C with grain is a real answer.
 * `?grain=on|off` overrides; the default is each variant's own proposal.
 */

import { Suspense } from 'react'
import { PrototypeSwitcher } from './PrototypeSwitcher'
import { VariantA } from './VariantA'
import { VariantB } from './VariantB'
import { VariantC } from './VariantC'

const grainCss = `
[data-grain='on'] .pv-a,
[data-grain='on'] .pv-b,
[data-grain='on'] .pv-c,
[data-grain='on'] .pv-a .doc,
[data-grain='on'] .pv-c .doc {
  background-image: url('/prototype/paper-grain.png');
  background-size: 200px 200px;
}
`

export function PrototypeCatalog({ variant, grain }: { variant: string; grain?: string }) {
  const key = ['A', 'B', 'C'].includes(variant.toUpperCase()) ? variant.toUpperCase() : 'A'
  const grainOn = grain ? grain === 'on' || grain === '1' : key === 'A'

  return (
    <div className="-mx-4 sm:-mx-8" data-grain={grainOn ? 'on' : 'off'}>
      <style>{grainCss}</style>
      {key === 'A' && <VariantA />}
      {key === 'B' && <VariantB />}
      {key === 'C' && <VariantC />}
      <Suspense fallback={null}>
        <PrototypeSwitcher current={key} grainOn={grainOn} />
      </Suspense>
    </div>
  )
}
