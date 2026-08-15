/**
 * draft-filter tests (#109).
 *
 * The rules the popup's filter field relies on: a blank query is not a filter,
 * matching ignores case, and the newest-first order the DAL produced survives
 * untouched.
 */

import { describe, expect, it } from 'vitest'
import { filterDraftsByTitle } from './draft-filter'

const DRAFTS = [
  { id: 'd1', title: 'Wärmelehre – Aufgabe 3' },
  { id: 'd2', title: 'Unbenannt' },
  { id: 'd3', title: 'Kinematik Grundlagen' },
  { id: 'd4', title: 'kinematik – Zusatz' },
]

describe('filterDraftsByTitle', () => {
  it('returns every draft for a blank query, in the given order', () => {
    expect(filterDraftsByTitle(DRAFTS, '')).toEqual(DRAFTS)
    expect(filterDraftsByTitle(DRAFTS, '   ')).toEqual(DRAFTS)
  })

  it('matches case-insensitively and keeps the newest-first order', () => {
    expect(filterDraftsByTitle(DRAFTS, 'KINEMATIK').map((d) => d.id)).toEqual(['d3', 'd4'])
    expect(filterDraftsByTitle(DRAFTS, 'kinematik').map((d) => d.id)).toEqual(['d3', 'd4'])
  })

  it('matches anywhere in the title, not just at the start', () => {
    expect(filterDraftsByTitle(DRAFTS, 'aufgabe').map((d) => d.id)).toEqual(['d1'])
    expect(filterDraftsByTitle(DRAFTS, 'grundlagen').map((d) => d.id)).toEqual(['d3'])
  })

  it('trims the query — a trailing space from typing must not empty the list', () => {
    expect(filterDraftsByTitle(DRAFTS, '  Unbenannt  ').map((d) => d.id)).toEqual(['d2'])
  })

  it('folds umlauts by case, but does not strip the diacritic', () => {
    expect(filterDraftsByTitle(DRAFTS, 'wärme').map((d) => d.id)).toEqual(['d1'])
    expect(filterDraftsByTitle(DRAFTS, 'WÄRME').map((d) => d.id)).toEqual(['d1'])
    expect(filterDraftsByTitle(DRAFTS, 'warme')).toEqual([])
  })

  it('returns nothing when no title matches — the popup says so', () => {
    expect(filterDraftsByTitle(DRAFTS, 'thermodynamik')).toEqual([])
  })

  it('never mutates or aliases the input array', () => {
    const input = [...DRAFTS]
    const all = filterDraftsByTitle(input, '')
    expect(all).not.toBe(input)
    all.pop()
    expect(input).toHaveLength(DRAFTS.length)
  })

  it('handles an empty list', () => {
    expect(filterDraftsByTitle([], '')).toEqual([])
    expect(filterDraftsByTitle([], 'irgendwas')).toEqual([])
  })
})
