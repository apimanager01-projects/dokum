/**
 * link-navigation tests (#73).
 *
 * Behavioural: given what a link STORES, where does the browser go? The two
 * interesting cases are the ones the stored target cannot answer on its own —
 * an Einheit whose Kurs the link never recorded, and a spot inside a document.
 */

import { describe, expect, it } from 'vitest'
import { linkHref, linkOpensOverlay } from './link-navigation'

const KURS_ID = '11111111-1111-4111-8111-111111111111'
const UNIT_ID = '22222222-2222-4222-8222-222222222222'
const DOC_ID = '33333333-3333-4333-8333-333333333333'

describe('linkHref', () => {
  it('sends a Kurs link to that Kurs', () => {
    expect(linkHref({ kursId: KURS_ID })).toBe(`/kurse/${KURS_ID}`)
  })

  it('sends an Einheit link to a URL that needs no Kurs id', () => {
    // A link stores `{ unitId }` and nothing else (spec §6), while the Einheit
    // page lives under its Kurs — so the flat URL is what makes an Einheit
    // link followable at all.
    expect(linkHref({ unitId: UNIT_ID })).toBe(`/einheiten/${UNIT_ID}`)
  })

  it('sends a Dokument link to the addressable document URL', () => {
    expect(linkHref({ docId: DOC_ID })).toBe(`/dokumente/${DOC_ID}`)
  })

  it('carries a Sprungmarke as the fragment, so the spot travels with the URL', () => {
    expect(linkHref({ docId: DOC_ID, anchorId: 'anc_x1_2' })).toBe(
      `/dokumente/${DOC_ID}#anc_x1_2`
    )
  })

  it('encodes a Sprungmarke id that is not URL-safe', () => {
    // Anchor ids are opaque and only ever `min(1)` in the schema, so a
    // hand-authored or imported snapshot may hold anything at all.
    expect(linkHref({ docId: DOC_ID, anchorId: 'a b#c' })).toBe(
      `/dokumente/${DOC_ID}#a%20b%23c`
    )
  })
})

describe('linkOpensOverlay', () => {
  it('is true for a Dokument, with or without a Sprungmarke', () => {
    // Only a document has an intercepting route, so only a document can open
    // on top of the page holding what the student typed.
    expect(linkOpensOverlay({ docId: DOC_ID })).toBe(true)
    expect(linkOpensOverlay({ docId: DOC_ID, anchorId: 'anc_1' })).toBe(true)
  })

  it('is false for a Kurs or an Einheit — those are real departures', () => {
    expect(linkOpensOverlay({ kursId: KURS_ID })).toBe(false)
    expect(linkOpensOverlay({ unitId: UNIT_ID })).toBe(false)
  })
})
