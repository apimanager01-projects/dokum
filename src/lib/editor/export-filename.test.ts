/**
 * export-filename tests (PRD #28, slice 10 — #38).
 *
 * Golden cases derived from the standalone reference editor's
 * `updateFilename()` (L1221–1227) and `exportPng()` normalisation
 * (L1285–1286) — the filename template must not drift from the historic
 * exports (`SS26_C1_Unit2_MC3.png`).
 */

import { describe, expect, it } from 'vitest'
import { buildPngFilename, documentTitleFromFilename, ensurePngFilename } from './export-filename'

describe('buildPngFilename', () => {
  it('builds the reference template term_C{k}_Unit{u}_MC{t}.png', () => {
    expect(buildPngFilename('SS26', 1, 2, 3)).toBe('SS26_C1_Unit2_MC3.png')
  })

  it('matches the reference default selection (all firsts)', () => {
    expect(buildPngFilename('SS26', 1, 1, 1)).toBe('SS26_C1_Unit1_MC1.png')
  })

  it('accepts arbitrary free-text terms (WS26, multi-word)', () => {
    expect(buildPngFilename('WS26', 4, 5, 6)).toBe('WS26_C4_Unit5_MC6.png')
    expect(buildPngFilename('Sommer 2026', 2, 1, 4)).toBe('Sommer 2026_C2_Unit1_MC4.png')
  })

  it('trims the term', () => {
    expect(buildPngFilename('  SS26  ', 1, 2, 3)).toBe('SS26_C1_Unit2_MC3.png')
  })

  it('skips the leading term_ segment when the term is blank', () => {
    expect(buildPngFilename('', 1, 2, 3)).toBe('C1_Unit2_MC3.png')
    expect(buildPngFilename('   ', 1, 2, 3)).toBe('C1_Unit2_MC3.png')
  })

  it('supports ordinals beyond the reference dropdown ranges', () => {
    expect(buildPngFilename('SS26', 12, 10, 7)).toBe('SS26_C12_Unit10_MC7.png')
  })
})

describe('ensurePngFilename', () => {
  it('keeps a valid .png name unchanged', () => {
    expect(ensurePngFilename('SS26_C1_Unit2_MC3.png')).toBe('SS26_C1_Unit2_MC3.png')
  })

  it('appends .png when missing (reference L1286)', () => {
    expect(ensurePngFilename('meine-datei')).toBe('meine-datei.png')
  })

  it('treats the extension check case-insensitively', () => {
    expect(ensurePngFilename('EXPORT.PNG')).toBe('EXPORT.PNG')
    expect(ensurePngFilename('Export.Png')).toBe('Export.Png')
  })

  it('trims surrounding whitespace (reference L1285)', () => {
    expect(ensurePngFilename('  datei.png  ')).toBe('datei.png')
    expect(ensurePngFilename('  datei  ')).toBe('datei.png')
  })

  it('falls back to export.png for empty input (reference L1285)', () => {
    expect(ensurePngFilename('')).toBe('export.png')
  })

  it('falls back to export.png for whitespace-only input (sanity deviation)', () => {
    expect(ensurePngFilename('   ')).toBe('export.png')
  })

  it('does not double the extension', () => {
    expect(ensurePngFilename('foo.png.png')).toBe('foo.png.png')
    expect(ensurePngFilename('foo.jpg')).toBe('foo.jpg.png')
  })
})

describe('documentTitleFromFilename (slice 11 — publish title seed)', () => {
  it('strips the .png extension from the built filename', () => {
    expect(documentTitleFromFilename('SS26_C1_Unit2_MC3.png')).toBe('SS26_C1_Unit2_MC3')
  })

  it('strips the extension case-insensitively', () => {
    expect(documentTitleFromFilename('EXPORT.PNG')).toBe('EXPORT')
    expect(documentTitleFromFilename('Export.Png')).toBe('Export')
  })

  it('keeps names without a .png extension unchanged', () => {
    expect(documentTitleFromFilename('meine-datei')).toBe('meine-datei')
    expect(documentTitleFromFilename('foo.jpg')).toBe('foo.jpg')
  })

  it('strips only ONE trailing extension', () => {
    expect(documentTitleFromFilename('foo.png.png')).toBe('foo.png')
  })

  it('keeps interior dots', () => {
    expect(documentTitleFromFilename('a.b.png')).toBe('a.b')
  })

  it('trims surrounding whitespace', () => {
    expect(documentTitleFromFilename('  datei.png  ')).toBe('datei')
    expect(documentTitleFromFilename('  datei  ')).toBe('datei')
  })

  it('falls back to export for empty or bare-extension input', () => {
    expect(documentTitleFromFilename('')).toBe('export')
    expect(documentTitleFromFilename('   ')).toBe('export')
    expect(documentTitleFromFilename('.png')).toBe('export')
  })
})
