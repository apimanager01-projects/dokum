/**
 * unsaved-changes tests (#110).
 *
 * Two rules pull against each other and both have to hold: unsaved writing must
 * raise the confirm, and an untouched editor must never raise it — a dialog
 * that fires every time is one people learn to click through. The blank-line
 * cases are the second rule; everything else is the first.
 */

import { afterEach, describe, expect, it } from 'vitest'
import type { EditorDocumentBlock, LatestEditorDocumentJson } from './document-json'
import {
  draftSaveTitle,
  editorHasUnsavedChanges,
  hasUnsavedChanges,
  registerUnsavedChangesCheck,
  type DraftSnapshot,
} from './unsaved-changes'

function doc(
  content: EditorDocumentBlock[],
  extra: Partial<LatestEditorDocumentJson> = {}
): LatestEditorDocumentJson {
  return { version: '1.1', variables: [], content, library: [], ...extra }
}

const HELLO: EditorDocumentBlock = { type: 'paragraph', children: ['Hallo Welt'] }

function snap(document: LatestEditorDocumentJson, title = 'Mini Case 1'): DraftSnapshot {
  return { title, document }
}

describe('draftSaveTitle', () => {
  it('is the title a save writes — trimmed, with the „Unbenannt" fallback', () => {
    expect(draftSaveTitle('  Wärmelehre  ')).toBe('Wärmelehre')
    expect(draftSaveTitle('')).toBe('Unbenannt')
    expect(draftSaveTitle('   ')).toBe('Unbenannt')
  })
})

describe('hasUnsavedChanges', () => {
  it('says no for an untouched editor', () => {
    expect(hasUnsavedChanges(snap(doc([HELLO])), snap(doc([HELLO])))).toBe(false)
  })

  it('says no before the baseline exists — the draft is still loading', () => {
    expect(hasUnsavedChanges(null, snap(doc([HELLO])))).toBe(false)
  })

  it('asks when the live state cannot be serialized at all', () => {
    expect(hasUnsavedChanges(snap(doc([HELLO])), null)).toBe(true)
  })

  it('sees typed text', () => {
    const live = doc([{ type: 'paragraph', children: ['Hallo Welt!'] }])
    expect(hasUnsavedChanges(snap(doc([HELLO])), snap(live))).toBe(true)
  })

  it('sees a deleted paragraph, even when an empty one is left behind', () => {
    const live = doc([{ type: 'paragraph', children: [] }])
    expect(hasUnsavedChanges(snap(doc([HELLO])), snap(live))).toBe(true)
  })

  it('sees a renamed draft', () => {
    expect(hasUnsavedChanges(snap(doc([HELLO]), 'Alt'), snap(doc([HELLO]), 'Neu'))).toBe(true)
  })

  it('ignores title whitespace a save would trim away anyway', () => {
    expect(
      hasUnsavedChanges(snap(doc([HELLO]), '  Mini Case 1  '), snap(doc([HELLO]), 'Mini Case 1'))
    ).toBe(false)
    expect(hasUnsavedChanges(snap(doc([HELLO]), ''), snap(doc([HELLO]), 'Unbenannt'))).toBe(false)
  })

  it('sees an edited Term — it is saved as meta on the document', () => {
    const baseline = doc([HELLO], { meta: { term: 'SS26' } })
    const live = doc([HELLO], { meta: { term: 'WS26' } })
    expect(hasUnsavedChanges(snap(baseline), snap(live))).toBe(true)
  })

  it('sees changed variables and a changed formula library', () => {
    const baseline = doc([HELLO])
    const withVar = doc([HELLO], {
      variables: [{ id: 'f1', type: 'input', name: 'Umsatz', refType: 'static', value: '10' }],
    })
    const withLibrary = doc([HELLO], { library: ['a^2'] })
    expect(hasUnsavedChanges(snap(baseline), snap(withVar))).toBe(true)
    expect(hasUnsavedChanges(snap(baseline), snap(withLibrary))).toBe(true)
  })

  it('ignores blank paragraphs a contenteditable adds on its own', () => {
    const baseline = doc([HELLO])
    // Both shapes an empty line takes: the serializer's collapsed `children: []`
    // and the stray top-level `<br>` a browser leaves in an editable element.
    const withEmpty = doc([HELLO, { type: 'paragraph', children: [] }])
    const withBogusBr = doc([HELLO, { type: 'paragraph', children: [{ br: true }] }])
    expect(hasUnsavedChanges(snap(baseline), snap(withEmpty))).toBe(false)
    expect(hasUnsavedChanges(snap(baseline), snap(withBogusBr))).toBe(false)
    expect(hasUnsavedChanges(snap(doc([])), snap(withBogusBr))).toBe(true)
  })

  it('keeps a blank paragraph that carries a Sprungmarke or block styling', () => {
    const baseline = doc([HELLO])
    const marked = doc([
      HELLO,
      { type: 'paragraph', children: [], anchor: { id: 'a1', label: 'Teil B' } },
    ])
    const styled = doc([HELLO, { type: 'paragraph', children: [], style: { align: 'center' } }])
    expect(hasUnsavedChanges(snap(baseline), snap(marked))).toBe(true)
    expect(hasUnsavedChanges(snap(baseline), snap(styled))).toBe(true)
  })

  it('never treats a blank line as a licence to drop other block types', () => {
    const baseline = doc([HELLO])
    const withEmptyCode = doc([HELLO, { type: 'code', text: '' }])
    expect(hasUnsavedChanges(snap(baseline), snap(withEmptyCode))).toBe(true)
  })
})

describe('the EditorShell → DraftCatalog seam', () => {
  afterEach(() => {
    registerUnsavedChangesCheck(() => false)()
  })

  it('reports nothing unsaved while no editor is mounted', () => {
    expect(editorHasUnsavedChanges()).toBe(false)
  })

  it('asks the mounted editor, and stops after it unregisters', () => {
    const unregister = registerUnsavedChangesCheck(() => true)
    expect(editorHasUnsavedChanges()).toBe(true)
    unregister()
    expect(editorHasUnsavedChanges()).toBe(false)
  })

  it('runs the check per call, not once — the state changes as the author types', () => {
    let dirty = false
    const unregister = registerUnsavedChangesCheck(() => dirty)
    expect(editorHasUnsavedChanges()).toBe(false)
    dirty = true
    expect(editorHasUnsavedChanges()).toBe(true)
    unregister()
  })

  it('leaves a freshly mounted editor guarded when the outgoing one cleans up late', () => {
    const unregisterOld = registerUnsavedChangesCheck(() => false)
    const unregisterNew = registerUnsavedChangesCheck(() => true)
    // Remount order: the incoming shell registers, then the outgoing shell's
    // cleanup runs. It must not clear the new editor's check.
    unregisterOld()
    expect(editorHasUnsavedChanges()).toBe(true)
    unregisterNew()
  })
})
