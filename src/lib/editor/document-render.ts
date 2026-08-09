/**
 * document-render — the student-facing renderer for published document JSON
 * (#67, spec #63 §4).
 *
 * This is the payoff of not flattening documents to a picture: a published
 * snapshot renders as live content — real selectable text, crisply typeset
 * formulas, images, and computed values — instead of a PNG.
 *
 * It is Option B of the structure decision: a dedicated renderer that REUSES
 * the editor's already-pure modules rather than mounting the imperative
 * controller read-only. Concretely it reuses the JSON importer (which already
 * knows every v1.0 block and inline shape, including the field-pill clones and
 * reference resolution), the field resolver, the expression evaluator, the
 * LaTeX normaliser and the German number formatter — so the student sees the
 * same document the author built, resolved by the same code.
 *
 * ⚠ ONE THING IS DUPLICATED, KNOWINGLY: {@link domFieldGraph} mirrors the
 * controller's DOM adapter (controller.ts, `fieldGraph`/`tokenizeLine`/
 * `toFieldData`) almost line for line. The two roots differ — the controller
 * owns a live contenteditable, this owns a read-only container — and folding
 * them together means editing the shipped editor, whose behaviour is pinned
 * by parity goldens. It was left duplicated deliberately, but it IS a second
 * implementation: a change to either adapter must be mirrored in the other,
 * or the editor and the student view will resolve the same document
 * differently. Extracting the shared adapter is the right follow-up.
 *
 * Two deliberate properties:
 *
 * 1. **MathJax-free, therefore jsdom-testable.** Like document-json.ts, this
 *    module builds DOM and stops. The formula elements come back in
 *    {@link DocumentRenderResult.renderTargets} carrying their RESOLVED LaTeX,
 *    and the React layer typesets them with the bundled loader. No CDN, no
 *    `eval`, no CSP change — the renderer needs none of it.
 *
 * 2. **Editor chrome never reaches the student.** The importer builds editor
 *    DOM: drag handles, image delete buttons, `draggable` blocks and an
 *    editable caption. All of it is stripped after the import, in one pass, so
 *    the two paths cannot drift — a new affordance added to the importer is
 *    removed here by class, not by having remembered to.
 *
 * The hidden field store the importer creates is KEPT (it is `display:none`):
 * it holds the field masters the resolver reads, and it is what the
 * student-editable inputs of #68 will recompute against.
 *
 * Pure module: no MathJax, no server imports, no mutation of the snapshot.
 * DOM is created through the container's `ownerDocument`, so it runs in the
 * browser and in jsdom alike.
 */

import { importEditorJson, type LatestEditorDocumentJson } from './document-json'
import {
  fieldDisplay,
  resolveFieldPlaceholders,
  type FieldData,
  type FieldGraph,
  type LineToken,
} from './field-resolver'
import { formatValue } from './number-format'

export interface DocumentRenderAdapters {
  /**
   * Browser URL for a re-homed document image. The caller passes the
   * entitlement-gated `/api/image/[imageId]` route — publishing rewrote the
   * snapshot's ids to `document_images` rows (#66), so no new access path is
   * needed.
   */
  imageUrl(imageId: string): string
}

export interface DocumentRenderResult {
  /**
   * The `.render-target` element of every formula, in document order, each
   * carrying its resolved LaTeX in `data-latex` and its source in
   * `data-raw-latex`. The caller MathJax-renders them.
   */
  renderTargets: HTMLElement[]
}

const FIELD_SELECTOR = '.input-field, .output-field'

/**
 * Renders a published snapshot into `container`, replacing whatever was there.
 *
 * Throws if the snapshot cannot be rendered — the caller is expected to catch
 * that inside an error boundary and fall back to the stored PNG. Rendering
 * something partial is not an option: silently dropping a node means a paying
 * student misses a whole section with no indication.
 */
export function renderDocumentJson(
  doc: LatestEditorDocumentJson,
  container: HTMLElement,
  adapters: DocumentRenderAdapters
): DocumentRenderResult {
  const graph = domFieldGraph(container)

  let seq = 0
  const { renderTargets } = importEditorJson(doc, container, {
    nextFieldId: () => `sf_${++seq}`,
    resolvePlaceholders: (raw) => resolveFieldPlaceholders(graph, raw),
    imageUrl: adapters.imageUrl,
  })

  // Resolve in document order so a later formula sees an earlier one's
  // `[output:x]` write-back, then refresh every pill from the settled graph —
  // the same two-step the controller performs after an import.
  for (const target of renderTargets) {
    const raw = target.dataset['rawLatex'] ?? ''
    if (!raw) continue
    const resolved = resolveFieldPlaceholders(graph, raw)
    target.dataset['latex'] = resolved
    target.textContent = resolved
  }
  refreshFields(container, graph)

  stripEditorChrome(container)

  return { renderTargets }
}

/** Applies the resolved display state to every field pill in the container. */
function refreshFields(container: HTMLElement, graph: FieldGraph): void {
  for (const el of Array.from(container.querySelectorAll<HTMLElement>(FIELD_SELECTOR))) {
    const id = el.dataset['fieldId'] ?? ''
    if (!id) continue
    const display = fieldDisplay(graph, id)
    el.textContent = display.text
    el.classList.toggle('is-error', display.isError)
    el.classList.toggle('is-ref', display.isRef)
  }
}

/**
 * Removes everything the importer builds for the sake of EDITING. Selected by
 * class and attribute rather than by block type, so an affordance added to the
 * importer later is stripped here without a matching change.
 */
function stripEditorChrome(container: HTMLElement): void {
  for (const el of Array.from(container.querySelectorAll('.drag-handle, .img-remove'))) {
    el.remove()
  }
  for (const el of Array.from(container.querySelectorAll('[draggable]'))) {
    el.removeAttribute('draggable')
  }
  // Captions are built `contenteditable="true"`; field pills carry
  // `contenteditable="false"`. Neither means anything inside a container that
  // is not editable, and leaving the "true" ones would let a student type into
  // the material they are studying.
  for (const el of Array.from(container.querySelectorAll('[contenteditable]'))) {
    el.removeAttribute('contenteditable')
  }
}

// ── Field graph over the rendered DOM ───────────────────────────────────────

function fieldDataFrom(el: HTMLElement): FieldData {
  const data: FieldData = {
    id: el.dataset['fieldId'] ?? '',
    type: el.dataset['type'] === 'output' ? 'output' : 'input',
    name: el.dataset['name'] ?? '',
  }
  if (el.dataset['refType'] !== undefined) {
    data.refType = el.dataset['refType'] === 'ref' ? 'ref' : 'static'
  }
  if (el.dataset['value'] !== undefined) data.value = el.dataset['value']
  if (el.dataset['refId'] !== undefined) data.refId = el.dataset['refId']
  if (el.dataset['expr'] !== undefined) data.expr = el.dataset['expr']
  if (el.dataset['latexValue'] !== undefined) data.latexValue = el.dataset['latexValue']
  return data
}

/** Top-level block of the container that contains `el`, or null. */
function topLevelBlock(container: HTMLElement, el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el
  while (node && node.parentElement && node.parentElement !== container) {
    node = node.parentElement
  }
  return node && node.parentElement === container ? node : null
}

/** Characters and field pills of a line, in document order (reference tokenizeLine). */
function tokenizeLine(line: Node): LineToken[] {
  const tokens: LineToken[] = []
  function walk(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const ch of node.textContent ?? '') tokens.push({ char: ch })
      return
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return
    const el = node as HTMLElement
    if (el.classList.contains('drag-handle')) return
    if (el.classList.contains('input-field') || el.classList.contains('output-field')) {
      tokens.push({ fieldId: el.dataset['fieldId'] ?? '' })
      return
    }
    for (const child of Array.from(node.childNodes)) walk(child)
  }
  walk(line)
  return tokens
}

/**
 * The same thin DOM adapter the controller implements, over the rendered
 * document. Sharing the shape is the point: the resolver sees plain objects
 * and cannot tell the editor and the student view apart, so both resolve
 * identically — including the `[output:x]` write-back, which must be visible
 * to later reads within the same pass.
 *
 * Exported because the student-editable inputs of #68 recompute against it.
 */
export function domFieldGraph(container: HTMLElement): FieldGraph {
  // Plain interpolation, as the controller does: the importer runs every id
  // through `safeFieldId`, which leaves only [A-Za-z0-9_\-:.] — no quote can
  // reach this selector. (CSS.escape is also absent in jsdom.)
  const elementById = (id: string): HTMLElement | null =>
    container.querySelector<HTMLElement>(`[data-field-id="${id}"]`)

  return {
    byId(id) {
      const el = elementById(id)
      return el ? fieldDataFrom(el) : null
    },
    all() {
      return Array.from(container.querySelectorAll<HTMLElement>(FIELD_SELECTOR)).map(fieldDataFrom)
    },
    lineTokensFor(fieldId) {
      const el = elementById(fieldId)
      if (!el) return null
      const line = topLevelBlock(container, el)
      if (!line) return null
      // Hidden masters have no text-line context (reference L1532).
      if (line.id === 'hiddenFields') return null
      return tokenizeLine(line)
    },
    setLatexValue(fieldId, v) {
      const el = elementById(fieldId)
      if (!el) return
      if (Number.isFinite(v)) {
        el.dataset['latexValue'] = String(v)
        el.textContent = formatValue(v)
        el.classList.remove('is-error')
      } else {
        delete el.dataset['latexValue']
        el.textContent = 'Err'
        el.classList.add('is-error')
      }
    },
  }
}
