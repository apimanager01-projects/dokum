/**
 * document-json — versioned JSON persistence for the LaTeX editor
 * (PRD #28, slice 7 — #35).
 *
 * Three parts:
 *
 * 1. `DocumentJsonSchema` — the versioned Zod schema (version "1.0"). It
 *    doubles as the server-action validation for draft saves (operator story
 *    34: malformed content is rejected at the boundary). The schema is a
 *    SUPERSET of the standalone editor's import format (reference file
 *    latexEditor/latex_editor_FIXED_JSON_IMPORT_COMPLETE_OUTPUT_AS_INPUT_LATEX_FIX.htm.html,
 *    `JSON_IMPORT_EXAMPLE` L2310): the reference example validates verbatim.
 *    Slice-7 extensions, required for exact draft round-trips:
 *      - top-level `library: string[]` — the full formula-library list (the
 *        reference's per-formula `library` flag cannot represent library
 *        items whose formula block was edited or deleted);
 *      - variable extras `latexValue`, `referenceClone`, `sourceOutputName`
 *        (stored `[output:x]` results and drag-created output-reference
 *        pills);
 *      - block type `code` (the reference importer had no `pre` mapping, but
 *        the editor creates `<pre>` blocks via „Als Codeblock" / formatBlock).
 *    Deliberately NOT in v1.0: `image` blocks. The reference importer
 *    accepted `{ type:'image', src }`, but accepting arbitrary `src` would
 *    let base64 payloads into drafts (PRD forbids that); slice 8 (#36)
 *    extends the schema to storage references. The schema is strict at the
 *    boundary (unknown block types are rejected).
 *
 * 2. `importEditorJson` — ported from the reference importer (L2388–2608).
 *    Consolidation deviations (approved in #35 planning):
 *      - no per-span click listeners on imported pills (reference L2438,
 *        L2501) — the port delegates pill clicks via the controller's
 *        `onEditorClick`, the approved slice-5 deviation, which also covers
 *        imported clones;
 *      - MathJax rendering, library restore and the field refresh (the
 *        reference's `setTimeout` in `createBlock` L2550 and the post-import
 *        hook L2731) are returned as {@link ImportResult} for the controller
 *        to perform — this module stays MathJax-free and jsdom-testable;
 *      - DOM is built via `createElement`/`dataset` on `editor.ownerDocument`
 *        instead of escaped `innerHTML` strings (equivalent output).
 *
 * 3. `serializeEditorState` — NEWLY WRITTEN (no reference counterpart; the
 *    standalone editor could import JSON but never export it). Contract:
 *    export → import → export is byte-stable — for any serializer-produced
 *    J1, `JSON.stringify(J1) === JSON.stringify(serialize(import(J1)))`.
 *    This drives the canonicalisation rules (fixed key order, rgb→hex
 *    colours, `fontWeight:700` → `bold`, px font sizes → numbers, adjacent
 *    text merging, lone-`<br>` lines → empty children) and the deterministic
 *    variable ordering: fields with an inline occurrence first (content
 *    order), then hidden-store-only fields (store order) — the order the
 *    importer itself reproduces.
 *
 * Pure module: no controller state, no MathJax, no server imports. DOM nodes
 * are created through the passed editor's `ownerDocument`, so it runs in the
 * browser and in jsdom tests alike.
 */

import { z } from 'zod'

// ── Schema (version 1.0) ────────────────────────────────────────────────────

const StyleSchema = z.strictObject({
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  /** Reference alias for backgroundColor (applyStyle, L2425). */
  highlight: z.string().optional(),
  fontSize: z.union([z.number(), z.string()]).optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  /** Reference alias for strike (applyStyle, L2431). */
  strikethrough: z.boolean().optional(),
  align: z.string().optional(),
})

export type EditorTextStyle = z.infer<typeof StyleSchema>

/**
 * One inline node, exactly the shapes the reference `createInlineNodes`
 * (L2449) accepts: plain strings/numbers, `{br}`, styled text, field
 * references by name or id, nested styled groups.
 */
export type InlineNode =
  | string
  | number
  | { br: true }
  | { type: 'br' }
  | { text: string | number; style?: EditorTextStyle }
  | { field?: string; fieldId?: string }
  | { children: InlineNode[]; style?: EditorTextStyle }

const InlineNodeSchema: z.ZodType<InlineNode> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.strictObject({ br: z.literal(true) }),
    z.strictObject({ type: z.literal('br') }),
    z.strictObject({
      text: z.union([z.string(), z.number()]),
      style: StyleSchema.optional(),
    }),
    z
      .strictObject({
        field: z.string().optional(),
        fieldId: z.string().optional(),
      })
      .refine((v) => v.field !== undefined || v.fieldId !== undefined, {
        message: 'Feldreferenz benötigt "field" oder "fieldId".',
      }),
    z.strictObject({
      children: z.array(InlineNodeSchema),
      style: StyleSchema.optional(),
    }),
  ])
)

/** Reference list items: an inline array or `{ children }` / `{ text }` (L2531). */
const ListItemSchema = z.union([
  z.array(InlineNodeSchema),
  z.strictObject({
    children: z.array(InlineNodeSchema).optional(),
    text: z.union([z.string(), z.number()]).optional(),
  }),
])

/** Reference captions: a plain string or `{ children }` / `{ text }` (L2547). */
const CaptionSchema = z.union([
  z.string(),
  z.strictObject({
    children: z.array(InlineNodeSchema).optional(),
    text: z.union([z.string(), z.number()]).optional(),
  }),
])

const ParagraphBlockSchema = z.strictObject({
  type: z.literal('paragraph'),
  children: z.array(InlineNodeSchema).optional(),
  text: z.union([z.string(), z.number()]).optional(),
  style: StyleSchema.optional(),
})

const HeadingBlockSchema = z.strictObject({
  type: z.literal('heading'),
  level: z.number().optional(),
  children: z.array(InlineNodeSchema).optional(),
  text: z.union([z.string(), z.number()]).optional(),
  style: StyleSchema.optional(),
})

const ListBlockSchema = z.strictObject({
  type: z.literal('list'),
  ordered: z.boolean().optional(),
  items: z.array(ListItemSchema).optional(),
  style: StyleSchema.optional(),
})

const FormulaBlockSchema = z.strictObject({
  type: z.literal('formula'),
  latex: z.string().optional(),
  /** Reference alias (L2538). */
  rawLatex: z.string().optional(),
  /** Reference per-formula library flag — only consulted when the top-level `library` list is absent. */
  library: z.boolean().optional(),
  caption: CaptionSchema.optional(),
  style: StyleSchema.optional(),
})

/** Slice-7 extension — the reference importer had no mapping for `<pre>` blocks. */
const CodeBlockSchema = z.strictObject({
  type: z.literal('code'),
  text: z.union([z.string(), z.number()]).optional(),
  style: StyleSchema.optional(),
})

const BlockSchema = z.discriminatedUnion('type', [
  ParagraphBlockSchema,
  HeadingBlockSchema,
  ListBlockSchema,
  FormulaBlockSchema,
  CodeBlockSchema,
])

const VariableSchema = z.strictObject({
  id: z.union([z.string(), z.number()]).optional(),
  type: z.enum(['input', 'output']),
  name: z.union([z.string(), z.number()]).optional(),
  refType: z.enum(['static', 'ref']).optional(),
  value: z.union([z.string(), z.number()]).optional(),
  refId: z.union([z.string(), z.number()]).optional(),
  refName: z.string().optional(),
  /** Reference alias for refName (createFieldMaster, L2492). */
  ref: z.string().optional(),
  expr: z.string().optional(),
  /** Slice-7 extension: value persisted by a LaTeX `[output:x]` resolution. */
  latexValue: z.string().optional(),
  /** Slice-7 extension: drag-created output-reference pill (hidden in the variables sidebar). */
  referenceClone: z.boolean().optional(),
  /** Slice-7 extension: display name of the referenced Output on a reference clone. */
  sourceOutputName: z.string().optional(),
})

export const DocumentJsonSchema = z.strictObject({
  version: z.literal('1.0'),
  /** Reserved (reference-compat + slice 10's Term field). The serializer never emits it — the draft title lives in the DB column. */
  meta: z
    .strictObject({
      title: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
  variables: z.array(VariableSchema).superRefine((vars, ctx) => {
    // Mirrors the importer's validateUniqueImportedVariables (reference L2410)
    // so duplicates are already rejected at the server boundary.
    const seen = new Set<string>()
    for (const v of vars) {
      const name = strictText(v.name).trim()
      if (!name) continue
      const key = name.toLowerCase()
      if (seen.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Doppelter Variablenname im JSON: "' + name + '". Variablennamen müssen eindeutig sein.',
        })
        return
      }
      seen.add(key)
    }
  }),
  content: z.array(BlockSchema),
  /** Slice-7 extension: the full ordered formula-library LaTeX list (authoritative when present). */
  library: z.array(z.string()).optional(),
})

export type EditorDocumentJson = z.infer<typeof DocumentJsonSchema>
export type EditorDocumentVariable = z.infer<typeof VariableSchema>
export type EditorDocumentBlock = z.infer<typeof BlockSchema>

// ── Shared helpers (reference L2388–2390) ───────────────────────────────────

function strictText(v: unknown): string {
  return v === null || v === undefined ? '' : String(v)
}

function normaliseName(name: unknown): string {
  return strictText(name).trim().toLowerCase()
}

function safeFieldId(raw: string, nextFieldId: () => string): string {
  return strictText(raw || nextFieldId()).replace(/[^a-zA-Z0-9_\-:.]/g, '_')
}

// ── Importer (ported, reference L2392–2608) ─────────────────────────────────

export interface ImportAdapters {
  /** The controller's field-id generator (deterministic stub in tests). */
  nextFieldId(): string
  /**
   * `resolveForDisplay` of the controller — `[input:x]`/`[output:x]`
   * resolution incl. the output-as-input write-back (identity in tests; the
   * serializer never reads the resolved value).
   */
  resolvePlaceholders(raw: string): string
}

export interface ImportResult {
  /**
   * The `.render-target` elements of all imported formula blocks, in document
   * order — the controller MathJax-renders them (the reference did this via
   * `setTimeout` per block, L2550, plus the post-import re-render L2731).
   */
  renderTargets: HTMLElement[]
  /**
   * Ordered LaTeX list to restore into the library sidebar: the document's
   * top-level `library` when present (authoritative, slice-7 extension),
   * otherwise derived from formula blocks with `library !== false`
   * (reference behavior, L2553). The controller's `addToLibrary` dedups.
   */
  libraryLatex: string[]
}

interface InlineContext {
  docEl: Document
  fieldByName: Map<string, HTMLElement>
  fieldById: Map<string, HTMLElement>
}

function getOrCreateHiddenStore(editor: HTMLElement): HTMLElement {
  let store = editor.querySelector<HTMLElement>('#hiddenFields')
  if (!store) {
    store = editor.ownerDocument.createElement('div')
    store.id = 'hiddenFields'
    store.style.display = 'none'
    store.setAttribute('contenteditable', 'false')
    editor.appendChild(store)
  }
  return store
}

function fieldNameExistsInEditor(editor: HTMLElement, name: string): boolean {
  const target = normaliseName(name)
  if (!target) return false
  return Array.from(
    editor.querySelectorAll<HTMLElement>('.input-field, .output-field')
  ).some((f) => normaliseName(f.dataset['name']) === target)
}

function validateUniqueImportedVariables(
  editor: HTMLElement,
  vars: EditorDocumentVariable[],
  replaceExisting: boolean
): void {
  const seen = new Set<string>()
  for (const v of vars) {
    const name = strictText(v.name).trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (seen.has(key)) {
      throw new Error(
        'Doppelter Variablenname im JSON: "' + name + '". Variablennamen müssen eindeutig sein.'
      )
    }
    seen.add(key)
    if (!replaceExisting && fieldNameExistsInEditor(editor, name)) {
      throw new Error(
        'Variablenname existiert bereits im Editor: "' +
          name +
          '". Bitte eindeutigen Namen verwenden oder Import mit Ersetzen ausführen.'
      )
    }
  }
}

function applyStyle(el: HTMLElement, style: EditorTextStyle | undefined): void {
  if (!style || typeof style !== 'object') return
  if (style.color) el.style.color = style.color
  if (style.backgroundColor || style.highlight) {
    el.style.backgroundColor = style.backgroundColor || style.highlight || ''
  }
  if (style.fontSize) {
    el.style.fontSize =
      typeof style.fontSize === 'number' ? style.fontSize + 'px' : style.fontSize
  }
  if (style.bold) el.style.fontWeight = '700'
  if (style.italic) el.style.fontStyle = 'italic'
  const decorations: string[] = []
  if (style.underline) decorations.push('underline')
  if (style.strike || style.strikethrough) decorations.push('line-through')
  if (decorations.length) el.style.textDecoration = decorations.join(' ')
  if (style.align) el.style.textAlign = style.align
}

function createTextSpan(
  docEl: Document,
  node: { text: string | number; style?: EditorTextStyle }
): HTMLElement {
  const span = docEl.createElement('span')
  span.textContent = strictText(node.text)
  applyStyle(span, node.style)
  return span
}

function createFieldMaster(
  v: EditorDocumentVariable,
  editor: HTMLElement,
  idMap: Map<string, string>,
  nextFieldId: () => string
): HTMLElement {
  const docEl = editor.ownerDocument
  const span = docEl.createElement('span')
  const type = v.type === 'output' ? 'output' : 'input'
  span.className = type === 'input' ? 'input-field' : 'output-field'
  span.setAttribute('contenteditable', 'false')
  const sourceId = strictText(v.id) || strictText(v.name) || nextFieldId()
  let newId = safeFieldId(sourceId, nextFieldId)
  while (editor.querySelector('[data-field-id="' + newId.replace(/"/g, '\\"') + '"]')) {
    newId = nextFieldId()
  }
  idMap.set(sourceId, newId)
  span.dataset['fieldId'] = newId
  span.dataset['type'] = type
  span.dataset['name'] = strictText(v.name).trim()
  if (type === 'input') {
    span.dataset['refType'] = v.ref || v.refName || v.refId ? 'ref' : v.refType || 'static'
    if (span.dataset['refType'] === 'static') {
      span.dataset['value'] = strictText(v.value !== undefined ? v.value : 0)
    } else if (v.refId) {
      span.dataset['pendingRefId'] = strictText(v.refId)
    } else if (v.refName || v.ref) {
      span.dataset['pendingRefName'] = strictText(v.refName || v.ref)
    }
    span.textContent = span.dataset['value'] || '0'
  } else {
    span.dataset['expr'] = strictText(v.expr)
    span.textContent = '?'
  }
  // Slice-7 round-trip extensions (dataset mirror; display is refreshed by
  // the controller's updateAllFields after the import).
  if (v.latexValue !== undefined) span.dataset['latexValue'] = strictText(v.latexValue)
  if (v.referenceClone) span.dataset['referenceClone'] = 'true'
  if (v.sourceOutputName) span.dataset['sourceOutputName'] = strictText(v.sourceOutputName)
  // Click-to-edit is delegated via the controller's onEditorClick — the
  // reference's per-span listener (L2501) is deliberately not ported.
  return span
}

function resolveImportedRefs(
  fieldMasters: HTMLElement[],
  fieldByName: Map<string, HTMLElement>,
  idMap: Map<string, string>
): void {
  for (const f of fieldMasters) {
    if (f.dataset['type'] !== 'input' || f.dataset['refType'] !== 'ref') continue
    const pendingId = f.dataset['pendingRefId']
    const pendingName = f.dataset['pendingRefName']
    if (pendingId) {
      f.dataset['refId'] = idMap.get(pendingId) || pendingId
      delete f.dataset['pendingRefId']
    } else if (pendingName) {
      const target = fieldByName.get(normaliseName(pendingName))
      if (target) f.dataset['refId'] = target.dataset['fieldId'] ?? ''
      delete f.dataset['pendingRefName']
    }
  }
}

function createInlineNodes(children: InlineNode[] | undefined, ctx: InlineContext): DocumentFragment {
  const frag = ctx.docEl.createDocumentFragment()
  for (const ch of children ?? []) {
    if (ch === null || ch === undefined) continue
    if (typeof ch === 'string' || typeof ch === 'number') {
      frag.appendChild(ctx.docEl.createTextNode(String(ch)))
      continue
    }
    if (('br' in ch && ch.br === true) || ('type' in ch && ch.type === 'br')) {
      frag.appendChild(ctx.docEl.createElement('br'))
      continue
    }
    if ('text' in ch) {
      frag.appendChild(createTextSpan(ctx.docEl, ch))
      continue
    }
    if ('field' in ch || 'fieldId' in ch) {
      const fieldNode = ch as { field?: string; fieldId?: string }
      const master = fieldNode.fieldId
        ? ctx.fieldById.get(strictText(fieldNode.fieldId))
        : ctx.fieldByName.get(normaliseName(fieldNode.field))
      if (!master) {
        const missing = ctx.docEl.createElement('span')
        missing.textContent = '[NOT FOUND: ' + strictText(fieldNode.field ?? fieldNode.fieldId) + ']'
        missing.style.color = '#ff0000'
        missing.style.fontWeight = '700'
        frag.appendChild(missing)
      } else {
        frag.appendChild(master.cloneNode(true))
      }
      continue
    }
    if ('children' in ch) {
      const span = ctx.docEl.createElement('span')
      span.appendChild(createInlineNodes(ch.children, ctx))
      applyStyle(span, ch.style)
      frag.appendChild(span)
    }
  }
  return frag
}

function createBlock(
  block: EditorDocumentBlock,
  ctx: InlineContext,
  resolvePlaceholders: (raw: string) => string,
  renderTargets: HTMLElement[]
): HTMLElement {
  const docEl = ctx.docEl
  let el: HTMLElement
  if (block.type === 'heading') {
    const lvl = Math.min(2, Math.max(1, Number(block.level || 1)))
    el = docEl.createElement(lvl === 1 ? 'h1' : 'h2')
    el.appendChild(createInlineNodes(block.children ?? [{ text: strictText(block.text) }], ctx))
  } else if (block.type === 'list') {
    el = docEl.createElement(block.ordered ? 'ol' : 'ul')
    for (const item of block.items ?? []) {
      const li = docEl.createElement('li')
      li.appendChild(
        createInlineNodes(
          Array.isArray(item) ? item : item.children ?? [{ text: strictText(item.text) }],
          ctx
        )
      )
      el.appendChild(li)
    }
  } else if (block.type === 'formula') {
    el = docEl.createElement('div')
    el.className = 'formula-block'
    el.setAttribute('draggable', 'true')
    const rawLatex = strictText(block.latex || block.rawLatex)
    const resolved = resolvePlaceholders(rawLatex)
    const handle = docEl.createElement('span')
    handle.className = 'drag-handle'
    handle.setAttribute('contenteditable', 'false')
    handle.textContent = '❚❚'
    const target = docEl.createElement('div')
    target.className = 'render-target'
    target.setAttribute('contenteditable', 'false')
    target.dataset['rawLatex'] = rawLatex
    target.dataset['latex'] = resolved
    target.textContent = resolved
    el.appendChild(handle)
    el.appendChild(target)
    renderTargets.push(target)
    if (block.caption !== undefined) {
      const cap = docEl.createElement('div')
      cap.className = 'block-caption'
      cap.setAttribute('contenteditable', 'true')
      cap.dataset['ph'] = 'Caption ...'
      const capChildren: InlineNode[] =
        typeof block.caption === 'string'
          ? [{ text: block.caption }]
          : block.caption.children ?? [{ text: strictText(block.caption.text) }]
      cap.appendChild(createInlineNodes(capChildren, ctx))
      el.appendChild(cap)
    }
  } else if (block.type === 'code') {
    // Slice-7 extension: the editor's <pre> blocks (codeblock insert / formatBlock).
    el = docEl.createElement('pre')
    el.textContent = strictText(block.text)
  } else {
    // paragraph — and, matching the reference's default branch (L2560), the
    // fallback for anything unknown (unreachable through the strict schema).
    el = docEl.createElement('p')
    el.appendChild(createInlineNodes(block.children ?? [{ text: strictText(block.text) }], ctx))
    if (!el.childNodes.length) el.appendChild(docEl.createElement('br'))
  }
  applyStyle(el, block.style)
  return el
}

/**
 * JSON → editor DOM (ported `importEditorJson`, reference L2569). Builds all
 * field masters into the hidden store, then the content blocks before it.
 * Throws a German `Error` on duplicate/colliding variable names. Rendering,
 * library restore and the field refresh are the caller's job — see
 * {@link ImportResult}.
 */
export function importEditorJson(
  doc: EditorDocumentJson,
  editor: HTMLElement,
  adapters: ImportAdapters,
  options?: { replaceExisting?: boolean }
): ImportResult {
  const vars = doc.variables
  const blocks = doc.content
  const replaceExisting = options?.replaceExisting !== false

  validateUniqueImportedVariables(editor, vars, replaceExisting)

  if (replaceExisting) editor.innerHTML = ''

  const idMap = new Map<string, string>()
  const fieldByName = new Map<string, HTMLElement>()
  const fieldById = new Map<string, HTMLElement>()
  const store = getOrCreateHiddenStore(editor)
  const fieldMasters: HTMLElement[] = []

  for (const v of vars) {
    const master = createFieldMaster(v, editor, idMap, adapters.nextFieldId)
    fieldMasters.push(master)
    const name = master.dataset['name']
    if (name) fieldByName.set(normaliseName(name), master)
    const sourceId = strictText(v.id) || (master.dataset['fieldId'] ?? '')
    fieldById.set(sourceId, master)
    fieldById.set(master.dataset['fieldId'] ?? '', master)
    store.appendChild(master)
  }
  resolveImportedRefs(fieldMasters, fieldByName, idMap)

  const ctx: InlineContext = { docEl: editor.ownerDocument, fieldByName, fieldById }
  const renderTargets: HTMLElement[] = []
  for (const block of blocks) {
    const node = createBlock(block, ctx, adapters.resolvePlaceholders, renderTargets)
    editor.insertBefore(node, store)
  }

  const libraryLatex =
    doc.library !== undefined
      ? [...doc.library]
      : blocks
          .filter((b) => b.type === 'formula' && b.library !== false)
          .map((b) => strictText(b.type === 'formula' ? b.latex || b.rawLatex : ''))
          .filter((latex) => latex !== '')

  return { renderTargets, libraryLatex }
}

// ── Serializer (newly written) ──────────────────────────────────────────────

function hasKeys(style: EditorTextStyle): boolean {
  return Object.keys(style).length > 0
}

/**
 * Canonical colour: `rgb(r, g, b)` / opaque `rgba(...)` → lowercase
 * `#rrggbb` (browsers and jsdom normalise inline hex colours to rgb, so this
 * is what makes colour round-trips byte-stable). Anything else passes
 * through unchanged.
 */
function canonicalColor(value: string): string {
  if (!value) return ''
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value)
  if (!m) return value
  if (m[4] !== undefined && Number(m[4]) !== 1) return value
  const hex = (n: string) => Number(n).toString(16).padStart(2, '0')
  return '#' + hex(m[1]!) + hex(m[2]!) + hex(m[3]!)
}

/** Canonical font size: `"18px"` → `18`; everything else stays a string. */
function canonicalFontSize(value: string): number | string {
  const m = /^(\d+(?:\.\d+)?)px$/.exec(value)
  return m ? Number(m[1]) : value
}

/**
 * Canonical style of an element: inline styles plus the semantic tags the
 * editor's execCommands produce (B/STRONG, I/EM, U, S/STRIKE/DEL). Keys are
 * built in a FIXED order — the key order is part of the byte-stability
 * contract. Booleans are emitted as `true` or omitted, never `false` (the
 * importer only acts on truthy values).
 */
function extractStyle(el: HTMLElement): EditorTextStyle {
  const s = el.style
  const tag = el.tagName
  const style: EditorTextStyle = {}
  const color = canonicalColor(s.color)
  if (color) style.color = color
  const backgroundColor = canonicalColor(s.backgroundColor)
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (s.fontSize) style.fontSize = canonicalFontSize(s.fontSize)
  const fontWeight = s.fontWeight
  if (
    tag === 'B' ||
    tag === 'STRONG' ||
    fontWeight === 'bold' ||
    fontWeight === 'bolder' ||
    Number(fontWeight) >= 600
  ) {
    style.bold = true
  }
  if (tag === 'I' || tag === 'EM' || s.fontStyle === 'italic') style.italic = true
  const decoration = s.textDecoration || s.textDecorationLine || ''
  if (tag === 'U' || decoration.includes('underline')) style.underline = true
  if (tag === 'S' || tag === 'STRIKE' || tag === 'DEL' || decoration.includes('line-through')) {
    style.strike = true
  }
  if (s.textAlign) style.align = s.textAlign
  return style
}

function serializeInlineChildren(container: HTMLElement): InlineNode[] {
  const out: InlineNode[] = []
  for (const node of Array.from(container.childNodes)) {
    appendInlineNode(node, out)
  }
  // Canonical empty line: a lone <br> means "no content" — the importer
  // restores the <br> for empty paragraphs (reference L2563).
  if (out.length === 1) {
    const only = out[0]
    if (typeof only === 'object' && only !== null && 'br' in only) return []
  }
  return out
}

function appendInlineNode(node: Node, out: InlineNode[]): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? ''
    if (text === '') return
    const last = out[out.length - 1]
    if (typeof last === 'string') {
      out[out.length - 1] = last + text // canonical: merge adjacent text
    } else {
      out.push(text)
    }
    return
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return
  const el = node as HTMLElement
  if (el.tagName === 'BR') {
    out.push({ br: true })
    return
  }
  // Transient drag UI / block chrome never belongs in the document JSON.
  if (el.classList.contains('inline-drop-caret') || el.classList.contains('drag-handle')) return
  if (el.classList.contains('input-field') || el.classList.contains('output-field')) {
    out.push({ fieldId: el.dataset['fieldId'] ?? '' })
    return
  }
  const style = extractStyle(el)
  const childNodes = Array.from(el.childNodes)
  const firstChild = childNodes[0]
  if (childNodes.length === 1 && firstChild && firstChild.nodeType === Node.TEXT_NODE) {
    const textNode: { text: string; style?: EditorTextStyle } = {
      text: firstChild.textContent ?? '',
    }
    if (hasKeys(style)) textNode.style = style
    out.push(textNode)
    return
  }
  const children: InlineNode[] = []
  for (const child of childNodes) appendInlineNode(child, children)
  const group: { children: InlineNode[]; style?: EditorTextStyle } = { children }
  if (hasKeys(style)) group.style = style
  out.push(group)
}

function withBlockStyle<T extends EditorDocumentBlock>(block: T, el: HTMLElement): T {
  const style = extractStyle(el)
  if (hasKeys(style)) (block as { style?: EditorTextStyle }).style = style
  return block
}

function serializeBlockElement(el: HTMLElement): EditorDocumentBlock {
  const tag = el.tagName
  if (tag === 'H1' || tag === 'H2') {
    return withBlockStyle(
      { type: 'heading', level: tag === 'H1' ? 1 : 2, children: serializeInlineChildren(el) },
      el
    )
  }
  if (tag === 'UL' || tag === 'OL') {
    const items = Array.from(el.children)
      .filter((li) => li.tagName === 'LI')
      .map((li) => serializeInlineChildren(li as HTMLElement))
    return withBlockStyle({ type: 'list', ordered: tag === 'OL', items }, el)
  }
  if (tag === 'PRE') {
    return withBlockStyle({ type: 'code', text: el.textContent ?? '' }, el)
  }
  if (el.classList.contains('formula-block')) {
    const target = el.querySelector<HTMLElement>('.render-target')
    const latex = target?.dataset['rawLatex'] ?? target?.dataset['latex'] ?? ''
    const block: Extract<EditorDocumentBlock, { type: 'formula' }> = { type: 'formula', latex }
    const cap = el.querySelector<HTMLElement>('.block-caption')
    if (cap) block.caption = { children: serializeInlineChildren(cap) }
    return withBlockStyle(block, el)
  }
  // <p>, generic <div> lines and anything unknown → paragraph.
  return withBlockStyle({ type: 'paragraph', children: serializeInlineChildren(el) }, el)
}

const BLOCK_TAGS = new Set(['H1', 'H2', 'UL', 'OL', 'PRE', 'P', 'DIV', 'BLOCKQUOTE'])

/**
 * Deterministic variable order: fields with an inline (visible) occurrence
 * first, by first occurrence in content order, then hidden-store-only fields
 * in store order — exactly the order a subsequent import reproduces, which
 * makes the ordering a fixed point of export → import → export.
 */
function serializeVariables(editor: HTMLElement): EditorDocumentVariable[] {
  const hidden = editor.querySelector('#hiddenFields')
  const all = Array.from(editor.querySelectorAll<HTMLElement>('.input-field, .output-field'))
  const inline = all.filter((el) => !(hidden && hidden.contains(el)))
  const hiddenOnly = all.filter((el) => hidden !== null && hidden.contains(el))
  const seen = new Set<string>()
  const out: EditorDocumentVariable[] = []
  for (const el of [...inline, ...hiddenOnly]) {
    const id = el.dataset['fieldId'] ?? ''
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(variableFromElement(el, id))
  }
  return out
}

function variableFromElement(el: HTMLElement, id: string): EditorDocumentVariable {
  const type = el.dataset['type'] === 'output' ? 'output' : 'input'
  const v: EditorDocumentVariable = { id, type }
  const name = el.dataset['name'] ?? ''
  if (name) v.name = name
  if (type === 'input') {
    const refType = el.dataset['refType'] === 'ref' ? 'ref' : 'static'
    v.refType = refType
    if (refType === 'static') {
      v.value = el.dataset['value'] ?? '0'
    } else if (el.dataset['refId'] !== undefined) {
      v.refId = el.dataset['refId']
    }
  } else {
    v.expr = el.dataset['expr'] ?? ''
  }
  if (el.dataset['latexValue'] !== undefined) v.latexValue = el.dataset['latexValue']
  if (el.dataset['referenceClone'] === 'true') v.referenceClone = true
  const sourceOutputName = el.dataset['sourceOutputName']
  if (sourceOutputName) v.sourceOutputName = sourceOutputName
  return v
}

/**
 * Editor DOM → versioned JSON. `library` is the current formula-library
 * LaTeX list (the controller reads it from the sidebar items; the library
 * lives outside the editor element).
 */
export function serializeEditorState(editor: HTMLElement, library: string[]): EditorDocumentJson {
  const content: EditorDocumentBlock[] = []
  let pendingInline: InlineNode[] = []

  const flushInline = () => {
    if (pendingInline.length === 0) return
    content.push({ type: 'paragraph', children: pendingInline })
    pendingInline = []
  }

  for (const node of Array.from(editor.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Stray top-level text (contenteditable quirk) → canonical paragraph.
      const text = node.textContent ?? ''
      if (text.trim() !== '') appendInlineNode(node, pendingInline)
      continue
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue
    const el = node as HTMLElement
    if (el.id === 'hiddenFields') continue
    if (el.classList.contains('drop-indicator') || el.classList.contains('inline-drop-caret')) {
      continue
    }
    if (BLOCK_TAGS.has(el.tagName) || el.classList.contains('formula-block')) {
      flushInline()
      content.push(serializeBlockElement(el))
      continue
    }
    // Stray top-level inline element (pill, span, <br>, …) → collect into a paragraph.
    appendInlineNode(el, pendingInline)
  }
  flushInline()

  return {
    version: '1.0',
    variables: serializeVariables(editor),
    content,
    library: [...library],
  }
}
