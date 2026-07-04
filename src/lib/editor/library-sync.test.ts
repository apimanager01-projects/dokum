/**
 * Parity tests for the formula-library dedup/sync decisions (#32).
 *
 * Expected behavior mirrors the standalone editor: `addToLibrary`'s guards
 * (base script L1074–1080) and `syncFormulaLibraryAfterEdit` of the "Editing
 * an existing LaTeX formula updates it" patch layer (L2647). These encode
 * the acceptance criteria of #32: inserting the same formula twice creates
 * one entry, and editing a formula syncs its entry without duplicates.
 */
import { describe, expect, it } from 'vitest'
import { librarySyncAction, shouldAddToLibrary } from './library-sync'

describe('shouldAddToLibrary', () => {
  it('adds a formula the library does not contain yet', () => {
    expect(shouldAddToLibrary([], 'a+b')).toBe(true)
    expect(shouldAddToLibrary(['x^2'], 'a+b')).toBe(true)
  })

  it('rejects duplicates — inserting the same formula twice keeps one entry', () => {
    expect(shouldAddToLibrary(['a+b'], 'a+b')).toBe(false)
    expect(shouldAddToLibrary(['x^2', 'a+b'], 'a+b')).toBe(false)
  })

  it('never adds empty LaTeX', () => {
    expect(shouldAddToLibrary([], '')).toBe(false)
    expect(shouldAddToLibrary(['a+b'], '')).toBe(false)
  })

  it('matches on the exact raw-LaTeX string (no normalisation)', () => {
    expect(shouldAddToLibrary(['a + b'], 'a+b')).toBe(true)
  })
})

describe('librarySyncAction', () => {
  it('updates the edited entry in place (no duplicate is created)', () => {
    expect(librarySyncAction(['x^2', 'a+b'], 'a+b', 'a+c')).toEqual({
      kind: 'update-old',
      index: 1,
    })
  })

  it('refreshes the entry when the edit did not change the LaTeX', () => {
    expect(librarySyncAction(['a+b'], 'a+b', 'a+b')).toEqual({
      kind: 'update-old',
      index: 0,
    })
  })

  it('removes the old entry when the edit collides with another entry', () => {
    expect(librarySyncAction(['a+b', 'x^2'], 'a+b', 'x^2')).toEqual({
      kind: 'remove-old',
      index: 0,
    })
  })

  it('is a noop when the edit collides but the block had no library entry', () => {
    expect(librarySyncAction(['x^2'], 'a+b', 'x^2')).toEqual({ kind: 'noop' })
    expect(librarySyncAction(['x^2'], '', 'x^2')).toEqual({ kind: 'noop' })
  })

  it('re-adds the formula when its entry was removed by hand', () => {
    expect(librarySyncAction([], 'a+b', 'a+c')).toEqual({ kind: 'add' })
    expect(librarySyncAction(['x^2'], 'a+b', 'a+c')).toEqual({ kind: 'add' })
  })

  it('adds when the block never had an entry (empty oldLatex)', () => {
    expect(librarySyncAction(['x^2'], '', 'a+b')).toEqual({ kind: 'add' })
  })

  it('is a noop for empty new LaTeX', () => {
    expect(librarySyncAction(['a+b'], 'a+b', '')).toEqual({ kind: 'noop' })
    expect(librarySyncAction([], '', '')).toEqual({ kind: 'noop' })
  })

  it('an empty oldLatex never matches an entry, even an empty-string one', () => {
    // Guard parity: the reference only searches for the old entry when
    // oldLatex is truthy (`old = oldLatex ? its.find(...) : null`).
    expect(librarySyncAction(['', 'x^2'], '', 'a+b')).toEqual({ kind: 'add' })
  })
})
