// @vitest-environment jsdom
/**
 * The authoring guide IS the fixture (#107).
 *
 * `docs/document-json-authoring.md` tells an author — and the LLM they paste it
 * into — what the editor's JSON import („Add JSON" → „JSON importieren")
 * accepts. A prompt that describes a shape the code no longer parses is worse
 * than no prompt at all: it produces documents that fail at the modal, or
 * (worse) import and then render wrong.
 *
 * So this suite does not embed its own copy of the examples. It READS the
 * markdown file, extracts every fenced JSON block the document marks as an
 * example, and runs each one through the real boundary — `readDocumentJson`
 * (parse + upgrade) and `importEditorJson` (the DOM the modal actually builds).
 * The document itself is what gets validated, which is the only arrangement in
 * which the two cannot drift apart.
 *
 * Runs in jsdom for the same reason document-json.test.ts does: the importer
 * builds real DOM and the serializer walks it.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  DOCUMENT_JSON_VERSIONS,
  LATEST_DOCUMENT_JSON_VERSION,
  collectDocumentAnchors,
  importEditorJson,
  serializeEditorState,
  type ImportAdapters,
  type InlineNode,
  type LatestEditorDocumentJson,
} from './document-json'
import { readDocumentJson } from './document-version'

/**
 * Resolved from this file rather than from `process.cwd()`, so the suite does
 * not care where vitest was started. Built from the URL STRING on purpose: in
 * the jsdom environment the global `URL` is jsdom's, and `fileURLToPath`
 * refuses one of those.
 */
const GUIDE_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'docs',
  'document-json-authoring.md'
)
const GUIDE = readFileSync(GUIDE_PATH, 'utf8')

// ── Extraction from the markdown ────────────────────────────────────────────
//
// The markers are part of the document's contract with this test: a rewrite
// that drops them fails here rather than silently testing nothing.

/**
 * The paste-ready prompt block: the ```text fence tagged `<!-- prompt-block -->`.
 */
function promptBlock(): string {
  const m = /<!--\s*prompt-block\s*-->\s*```text\n([\s\S]*?)\n```/.exec(GUIDE)
  if (!m) throw new Error('docs/document-json-authoring.md: no <!-- prompt-block --> ```text fence')
  return m[1]!
}

/**
 * Every worked example, by the name in its `<!-- example: name -->` marker.
 * Deliberately not a fixed list — a new marked example is validated the moment
 * it is written, without touching this file.
 */
function workedExamples(): Map<string, string> {
  const out = new Map<string, string>()
  const re = /<!--\s*example:\s*([a-z0-9-]+)\s*-->\s*```json\n([\s\S]*?)\n```/g
  for (const m of GUIDE.matchAll(re)) out.set(m[1]!, m[2]!)
  return out
}

/**
 * The document printed at the END of the prompt block, after its sentinel
 * line. It is the only example an LLM sees when the prompt travels alone, so
 * it is held to exactly the same standard as the worked ones.
 */
function promptExample(): string {
  const block = promptBlock()
  const sentinel = 'EXAMPLE OUTPUT (this document imports as-is):'
  const at = block.indexOf(sentinel)
  if (at === -1) throw new Error(`prompt block: sentinel "${sentinel}" missing`)
  const rest = block.slice(at + sentinel.length)
  const start = rest.indexOf('{')
  if (start === -1) throw new Error('prompt block: no JSON object after the sentinel')
  return rest.slice(start).trim()
}

/** Every document this file validates: the worked examples plus the prompt's own. */
function allExamples(): Map<string, string> {
  const out = workedExamples()
  out.set('prompt-block', promptExample())
  return out
}

// ── Boundary helpers (same shape as document-json.test.ts) ──────────────────

function makeEditor(): HTMLElement {
  const editor = document.createElement('div')
  editor.id = 'editor'
  document.body.appendChild(editor)
  return editor
}

function makeAdapters(): ImportAdapters {
  let n = 0
  return {
    nextFieldId: () => `gen_${++n}`,
    resolvePlaceholders: (raw: string) => raw,
    imageUrl: (imageId: string) => `stub://editor-image/${imageId}`,
  }
}

/** Parse + upgrade — the boundary the JSON modal itself runs on a paste. */
function read(json: string): LatestEditorDocumentJson {
  const result = readDocumentJson(JSON.parse(json))
  if (!result.ok) throw new Error(result.error)
  return result.doc
}

/** Every `type` discriminator in the document — blocks and inline nodes alike. */
function nodeTypes(doc: LatestEditorDocumentJson): Set<string> {
  const types = new Set<string>()
  const walkInline = (nodes: InlineNode[] | undefined): void => {
    for (const node of nodes ?? []) {
      if (node === null || typeof node !== 'object') continue
      if ('type' in node && typeof node.type === 'string') types.add(node.type)
      if ('children' in node) walkInline(node.children)
    }
  }
  for (const block of doc.content) {
    types.add(block.type)
    if ('children' in block) walkInline(block.children)
    if (block.type === 'list') {
      for (const item of block.items ?? []) {
        walkInline(Array.isArray(item) ? item : item.children)
      }
    }
    if (block.type === 'formula' && typeof block.caption === 'object') {
      walkInline(block.caption.children)
    }
  }
  return types
}

// ── The guide's own claims ──────────────────────────────────────────────────

describe('docs/document-json-authoring.md', () => {
  it('carries the paste-ready prompt block', () => {
    expect(promptBlock().trim().length).toBeGreaterThan(500)
  })

  it('names the version the code actually emits', () => {
    expect(promptBlock()).toContain(`"version": "${LATEST_DOCUMENT_JSON_VERSION}"`)
  })

  it('describes no schema version other than the newest', () => {
    // A guide that shows an older shape teaches an LLM to emit it (#107). The
    // whole file is checked, not just the prompt block: the schema reference
    // travels with the examples when someone copies a section of it.
    const older = DOCUMENT_JSON_VERSIONS.filter((v) => v !== LATEST_DOCUMENT_JSON_VERSION)
    expect(older.length).toBeGreaterThan(0) // the check is meaningless otherwise
    for (const version of older) {
      const mention = new RegExp('\\b' + version.replace('.', '\\.') + '\\b')
      expect(GUIDE).not.toMatch(mention)
    }
  })

  it('rules images and links out inside the prompt block itself, with the reason', () => {
    const prompt = promptBlock()
    // The two shapes it must forbid…
    expect(prompt).toContain('"type": "image"')
    expect(prompt).toContain('"type": "link"')
    // …and why: both key off ids that only exist server-side.
    expect(prompt).toContain('editor_images')
    expect(prompt).toMatch(/primary key/i)
  })

  it('marks both required worked examples', () => {
    expect([...workedExamples().keys()].sort()).toEqual(['full', 'minimal'])
  })
})

// ── Every example, through the real boundary ────────────────────────────────

describe.each([...allExamples()])('example %s', (name, json) => {
  it('parses as JSON', () => {
    expect(() => JSON.parse(json)).not.toThrow()
  })

  it('is accepted by readDocumentJson — the modal boundary', () => {
    const result = readDocumentJson(JSON.parse(json))
    // Surface the German refusal, not just `false`, when this breaks.
    expect(result.ok ? null : result.error).toBeNull()
  })

  it('is written at the newest schema version, not merely upgradeable to it', () => {
    expect(JSON.parse(json).version).toBe(LATEST_DOCUMENT_JSON_VERSION)
  })

  it('carries no image block and no link node', () => {
    const types = nodeTypes(read(json))
    expect(types.has('image')).toBe(false)
    expect(types.has('link')).toBe(false)
  })

  it('imports into the editor DOM with every field reference resolved', () => {
    const editor = makeEditor()
    try {
      expect(() => importEditorJson(read(json), editor, makeAdapters())).not.toThrow()
      // The importer renders an unresolvable { field } / { fieldId } as a red
      // marker rather than failing — an example with a typo would import
      // "successfully" and read wrong.
      expect(editor.textContent ?? '').not.toContain('[NOT FOUND:')
    } finally {
      editor.remove()
    }
  })

  it('survives the editor round trip: import → serialize → read again', () => {
    const editor = makeEditor()
    try {
      const result = importEditorJson(read(json), editor, makeAdapters())
      const again = readDocumentJson(serializeEditorState(editor, result.libraryLatex))
      expect(again.ok ? null : again.error).toBeNull()
    } finally {
      editor.remove()
    }
  })

  it('gives no two blocks one Sprungmarken id', () => {
    const doc = read(json)
    const ids = doc.content.map((b) => b.anchor?.id).filter((id): id is string => id !== undefined)
    // collectDocumentAnchors drops duplicates; an example that lost one here
    // would be offering one link target under two names.
    expect(collectDocumentAnchors(doc)).toHaveLength(ids.length)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// ── What each named example is supposed to demonstrate ──────────────────────

describe('example minimal', () => {
  it('stays text-only — no variables, no formulas', () => {
    const doc = read(workedExamples().get('minimal')!)
    expect(doc.variables).toHaveLength(0)
    expect(doc.content.length).toBeGreaterThan(0)
    expect(nodeTypes(doc).has('formula')).toBe(false)
  })
})

describe('example full', () => {
  const doc = () => read(workedExamples().get('full')!)

  it('exercises formulas, input and output fields, and a Sprungmarke', () => {
    const d = doc()
    expect(nodeTypes(d).has('formula')).toBe(true)
    expect(d.variables.some((v) => v.type === 'input')).toBe(true)
    expect(d.variables.some((v) => v.type === 'output')).toBe(true)
    expect(collectDocumentAnchors(d).length).toBeGreaterThan(0)
  })

  it('shows both ways an output gets its expression — manual and derived', () => {
    const outputs = doc().variables.filter((v) => v.type === 'output')
    expect(outputs.some((v) => (v.expr ?? '').trim() !== '')).toBe(true)
    expect(outputs.some((v) => (v.expr ?? '') === '')).toBe(true)
  })

  it('declares a variable for every name the content references', () => {
    const d = doc()
    const declared = new Set(
      d.variables.map((v) => String(v.name ?? '').trim().toLowerCase()).filter(Boolean)
    )
    const latex = d.content
      .map((b) => (b.type === 'formula' ? b.latex ?? b.rawLatex ?? '' : ''))
      .join('\n')
    for (const [, , referenced] of latex.matchAll(/\[(input|output):([^\]]+)\]/g)) {
      expect([...declared]).toContain(referenced!.trim().toLowerCase())
    }
  })
})
