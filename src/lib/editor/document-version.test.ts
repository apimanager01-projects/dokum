/**
 * document-version tests (#64).
 *
 * Behavioural, not structural: given a stored snapshot, what does the read
 * boundary hand the renderer? The load-bearing property is the REFUSAL —
 * for paid material an honest failure beats quietly dropping a node the
 * student paid for, so every "cannot understand this" path must return
 * `ok: false` and never a partially populated document.
 *
 * Runs in plain Node: nothing here touches the DOM.
 */

import { describe, expect, it } from 'vitest'
import {
  DOCUMENT_JSON_VERSIONS,
  LATEST_DOCUMENT_JSON_VERSION,
  type DocumentJsonVersion,
  type EditorDocumentJson,
} from './document-json'
import {
  DOCUMENT_JSON_UPGRADES,
  readDocumentJson,
  upgradeDocumentJson,
} from './document-version'

/**
 * One minimal valid document per supported version. Typed as a total record,
 * so adding a version to DOCUMENT_JSON_VERSIONS fails to compile until its
 * fixture exists — the chain tests below then cover it for free.
 */
const MINIMAL_BY_VERSION: Record<DocumentJsonVersion, EditorDocumentJson> = {
  '1.0': { version: '1.0', variables: [], content: [] },
}

const V1_0 = {
  version: '1.0',
  variables: [{ id: 'v1', type: 'input', name: 'Revenue', refType: 'static', value: 1200 }],
  content: [
    { type: 'heading', level: 1, children: [{ text: 'Titel' }] },
    { type: 'paragraph', children: [{ text: 'Umsatz: ' }, { fieldId: 'v1' }] },
  ],
  library: [],
} satisfies EditorDocumentJson

// ── The version list ────────────────────────────────────────────────────────

describe('DOCUMENT_JSON_VERSIONS', () => {
  it('is ordered oldest → newest, with LATEST as the last entry', () => {
    expect(DOCUMENT_JSON_VERSIONS.length).toBeGreaterThan(0)
    expect(DOCUMENT_JSON_VERSIONS[DOCUMENT_JSON_VERSIONS.length - 1]).toBe(
      LATEST_DOCUMENT_JSON_VERSION
    )
  })

  it('carries an upgrade step for every version — the chain is total', () => {
    for (const version of DOCUMENT_JSON_VERSIONS) {
      expect(typeof DOCUMENT_JSON_UPGRADES[version]).toBe('function')
    }
  })
})

// ── The upgrade chain ───────────────────────────────────────────────────────

describe('upgradeDocumentJson', () => {
  it('returns a latest-version document unchanged (the identity step)', () => {
    const doc = MINIMAL_BY_VERSION[LATEST_DOCUMENT_JSON_VERSION]
    expect(upgradeDocumentJson(doc)).toEqual(doc)
  })

  it('lifts every supported version to the latest version', () => {
    for (const version of DOCUMENT_JSON_VERSIONS) {
      const upgraded = upgradeDocumentJson(MINIMAL_BY_VERSION[version])
      expect(upgraded.version).toBe(LATEST_DOCUMENT_JSON_VERSION)
    }
  })

  it('is pure — the input document is not mutated', () => {
    const before = JSON.stringify(V1_0)
    upgradeDocumentJson(V1_0)
    expect(JSON.stringify(V1_0)).toBe(before)
  })

  it('preserves the document body across the chain', () => {
    const upgraded = upgradeDocumentJson(V1_0)
    expect(upgraded.content).toEqual(V1_0.content)
    expect(upgraded.variables).toEqual(V1_0.variables)
  })

  it('refuses a version outside the supported list rather than coercing it', () => {
    // Only reachable through an unchecked cast — the schema rejects it first.
    const alien = { version: '9.9', variables: [], content: [] } as unknown as EditorDocumentJson
    expect(() => upgradeDocumentJson(alien)).toThrow(/Schema-Version/)
  })
})

// ── The read boundary ───────────────────────────────────────────────────────

describe('readDocumentJson', () => {
  it('accepts a v1.0 snapshot and returns it at the latest version', () => {
    const result = readDocumentJson(V1_0)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.doc.version).toBe(LATEST_DOCUMENT_JSON_VERSION)
      expect(result.doc.content).toEqual(V1_0.content)
    }
  })

  it('accepts a snapshot that arrived as a JSON round-trip (the DB read shape)', () => {
    const result = readDocumentJson(JSON.parse(JSON.stringify(V1_0)))
    expect(result.ok).toBe(true)
  })

  it('refuses an unrecognised version with the German boundary message', () => {
    const result = readDocumentJson({ ...V1_0, version: '2.0' })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Nicht unterstützte Schema-Version — erwartet wird "1.0".')
    }
  })

  it('refuses a missing version', () => {
    const withoutVersion: Record<string, unknown> = { ...V1_0 }
    delete withoutVersion['version']
    expect(readDocumentJson(withoutVersion).ok).toBe(false)
  })

  it('refuses an unknown node type instead of dropping it', () => {
    // The honest-failure rule: a student who paid for this document must not
    // silently lose a block the renderer does not understand.
    const result = readDocumentJson({
      ...V1_0,
      content: [...V1_0.content, { type: 'video', videoId: 'abc' }],
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('content[2]')
  })

  it('refuses unknown keys — strictness is unchanged', () => {
    expect(readDocumentJson({ ...V1_0, extra: true }).ok).toBe(false)
    expect(
      readDocumentJson({
        ...V1_0,
        content: [{ type: 'code', text: 'x', bogus: true }],
      }).ok
    ).toBe(false)
  })

  it('refuses non-object snapshots, including null and undefined', () => {
    for (const raw of [null, undefined, 42, 'kein objekt', [1, 2]]) {
      const result = readDocumentJson(raw)
      expect(result.ok).toBe(false)
      if (!result.ok) expect(result.error.length).toBeGreaterThan(0)
    }
  })

  it('never returns a partial document on failure', () => {
    const result = readDocumentJson({ ...V1_0, content: [{ type: 'nope' }] })
    expect(result.ok).toBe(false)
    expect('doc' in result).toBe(false)
  })
})
