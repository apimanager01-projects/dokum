/**
 * PROTOTYPE (#117) — the four candidate type systems. Throwaway.
 *
 * Every family is declared through `next/font/google`, which downloads the
 * files at build time and serves them from this origin. That is not a
 * convenience: the ticket disqualifies any face that can only be served from a
 * vendor CDN (the CSP forbids external hosts, and #61 is an open bug about the
 * Datenschutzerklärung over-declaring font CDNs). Anything rendered here is
 * therefore genuinely shippable — no runtime request leaves the browser.
 */

import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  IBM_Plex_Mono,
  Literata,
  Schibsted_Grotesk,
} from 'next/font/google'

const geist = Geist({ variable: '--pt-geist', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--pt-geist-mono', subsets: ['latin'] })

const plexSans = IBM_Plex_Sans({
  variable: '--pt-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const plexSerif = IBM_Plex_Serif({
  variable: '--pt-plex-serif',
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
})
const plexMono = IBM_Plex_Mono({
  variable: '--pt-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const literata = Literata({
  variable: '--pt-literata',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})

const schibsted = Schibsted_Grotesk({ variable: '--pt-schibsted', subsets: ['latin'] })

/** Every font variable, mounted once on the page root so all four can be flipped without a reload. */
export const ALL_FONT_VARIABLES = [
  geist.variable,
  geistMono.variable,
  plexSans.variable,
  plexSerif.variable,
  plexMono.variable,
  literata.variable,
  schibsted.variable,
].join(' ')

export interface TypeSystem {
  key: string
  name: string
  /** The one-line thesis this system is arguing. */
  thesis: string
  /** Chrome: navbar, catalog cards, buttons, wordmark. */
  ui: string
  /** The learning surface — `.dokum-document` running text. */
  doc: string
  mono: string
  /** Reading size for `.dokum-document`. Today: 17px / 1.55. */
  docSize: number
  docLeading: number
  /** Weight of the card numerals — #116 wants them heavy. */
  numWeight: number
  /** Display tracking at wordmark/h1 size; a grotesque wants less than a serif. */
  displayTracking: string
  /** Weight used for h1 / wordmark. */
  displayWeight: number
  /** Running-text weight on the document. A light face on grain may need 450+. */
  docWeight: number
  notes: string[]
}

const SANS_FALLBACK = 'ui-sans-serif, system-ui, sans-serif'
const SERIF_FALLBACK = 'ui-serif, Georgia, serif'
const MONO_FALLBACK = 'ui-monospace, monospace'

export const SYSTEMS: TypeSystem[] = [
  {
    key: 'A',
    name: 'Geist',
    thesis: 'The incumbent is enough — character comes from the seam and the grain, not the type.',
    ui: `var(--pt-geist), ${SANS_FALLBACK}`,
    doc: `var(--pt-geist), ${SANS_FALLBACK}`,
    mono: `var(--pt-geist-mono), ${MONO_FALLBACK}`,
    docSize: 17,
    docLeading: 1.55,
    numWeight: 700,
    displayTracking: '-0.035em',
    displayWeight: 700,
    docWeight: 400,
    notes: [
      'Inherited from the Next.js template, never chosen. Present as the control.',
      'Neo-grotesque: large x-height, near-zero stroke contrast, tight default tracking.',
      'Tabular numerals are strong and the 700 weight is genuinely heavy — it serves #116’s numerals well.',
    ],
  },
  {
    key: 'B',
    name: 'Plex',
    thesis: 'One superfamily, three voices — the document goes serif because the maths already is.',
    ui: `var(--pt-plex-sans), ${SANS_FALLBACK}`,
    doc: `var(--pt-plex-serif), ${SERIF_FALLBACK}`,
    mono: `var(--pt-plex-mono), ${MONO_FALLBACK}`,
    docSize: 17,
    docLeading: 1.6,
    numWeight: 700,
    displayTracking: '-0.02em',
    displayWeight: 600,
    docWeight: 400,
    notes: [
      'IBM Plex Sans / Serif / Mono — one design, three roles, so chrome and document are relatives rather than strangers.',
      'Plex Serif is a transitional face: the same skeleton family as MathJax’s Computer Modern, so the formula stops looking imported.',
      'Plex’s German is excellent and it has real character (the flared stems, the single-storey g in Mono) without shouting.',
    ],
  },
  {
    key: 'C',
    name: 'Geist + Literata',
    thesis: 'Change only the surface where reading actually happens; keep the chrome.',
    ui: `var(--pt-geist), ${SANS_FALLBACK}`,
    doc: `var(--pt-literata), ${SERIF_FALLBACK}`,
    mono: `var(--pt-geist-mono), ${MONO_FALLBACK}`,
    docSize: 17,
    docLeading: 1.6,
    numWeight: 700,
    displayTracking: '-0.035em',
    displayWeight: 700,
    docWeight: 400,
    notes: [
      'The minimal change: the catalog, navbar and buttons stay exactly as they are today.',
      'Literata was drawn for Google Play Books — sturdy, warm, big x-height, and it holds ink on a textured ground.',
      'Tests whether the split is worth it, or whether two families read as an accident.',
    ],
  },
  {
    key: 'D',
    name: 'Schibsted Grotesk',
    thesis: 'Keep sans everywhere — but a sans with editorial DNA instead of a product-UI default.',
    ui: `var(--pt-schibsted), ${SANS_FALLBACK}`,
    doc: `var(--pt-schibsted), ${SANS_FALLBACK}`,
    mono: `var(--pt-plex-mono), ${MONO_FALLBACK}`,
    docSize: 17,
    docLeading: 1.6,
    numWeight: 800,
    displayTracking: '-0.03em',
    displayWeight: 700,
    docWeight: 400,
    notes: [
      'Drawn for Norwegian news — a reading grotesque, not an interface grotesque, and its diacritics were a design requirement.',
      'Goes to 900, which gives the card numerals more weight than Geist can reach.',
      'The direct answer to “is the problem Geist, or is the problem sans?”',
    ],
  },
  {
    key: 'E',
    name: 'Geist + Plex Serif',
    thesis: 'Same minimal change as C, different serif — so “which serif” can be judged against a fixed chrome.',
    ui: `var(--pt-geist), ${SANS_FALLBACK}`,
    doc: `var(--pt-plex-serif), ${SERIF_FALLBACK}`,
    mono: `var(--pt-geist-mono), ${MONO_FALLBACK}`,
    docSize: 17,
    docLeading: 1.6,
    numWeight: 700,
    displayTracking: '-0.035em',
    displayWeight: 700,
    docWeight: 400,
    notes: [
      'Added after A–D were rendered: once the document went serif, chrome and serif became separable axes, and C vs B conflated them.',
      'Plex Serif is narrower and crisper than Literata; Literata is warmer and has the larger x-height.',
      'Costs less than C — Plex Serif at two weights plus italic is 62 KB against Literata’s 123 KB variable file.',
    ],
  },
]

export function systemFor(key: string | undefined): TypeSystem {
  return SYSTEMS.find((s) => s.key === (key ?? '').toUpperCase()) ?? SYSTEMS[0]
}
