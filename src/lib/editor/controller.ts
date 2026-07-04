/**
 * Imperative vanilla-TS core of the LaTeX editor (PRD #28, Approach C).
 *
 * Ported 1:1 from the standalone reference file
 * latexEditor/latex_editor_FIXED_JSON_IMPORT_COMPLETE_OUTPUT_AS_INPUT_LATEX_FIX.htm.html.
 * Slice-1 functions come from the base script (none of the seven patch
 * layers override them). Slice 3 (#31) ports the LaTeX pipeline; the
 * consolidated (last-wins) owners are:
 *   - modal, preview, codeblock insert, render, delete, click-to-edit,
 *     block insertion, textarea colour wrapping — base script L747–1071;
 *   - `insertLatexRendered` — the "Editing an existing LaTeX formula updates
 *     it" patch layer (L2647): the edited block must be captured BEFORE
 *     closeLatexModal() nulls it (the base version read it afterwards, so
 *     editing inserted duplicates — that patch is the fix);
 *   - `*` → `\,\cdot\,` display — the final patch layer, via
 *     latex-display.ts; full `[input:x]`/`[output:x]` resolution is
 *     slice 6 (#34).
 *
 * React renders the mount container childless and never reconciles inside it;
 * this controller owns the entire subtree (export area, contenteditable
 * surface, LaTeX modal, listeners). `document.execCommand` is kept
 * deliberately for behavioral parity with the standalone editor.
 *
 * Browser-only module — must never import the DAL or other server-only code.
 */

import { cleanupLatex, prettifyMultiplicationStars } from './latex-display'
import { loadMathJax } from './mathjax-loader'

export interface StyleObject {
  color?: string
  backgroundColor?: string
  fontSize?: string
  fontWeight?: string
}

export interface EditorController {
  /** `document.execCommand` wrapper (bold, italic, lists, alignment, …). */
  exec(cmd: string, value?: string): void
  /** Block format via execCommand: H1 | H2 | P | PRE. */
  formatBlock(tag: string): void
  /**
   * Wraps the selection in a styled span (or an empty caret span). While the
   * LaTeX modal's textarea is focused, colour/highlight wrap the textarea
   * selection in `\textcolor[HTML]{…}` / `\colorbox[HTML]{…}` instead.
   */
  applyStyles(styles: StyleObject): void
  /** Font size in px (string from the toolbar select); no-op on ''. */
  applyFontSize(px: string): void
  /** Style template: color + size + optional bold. */
  applyTemplate(color: string, px: number, bold: boolean): void
  /**
   * Snapshots the current editor selection into internal state — the saved
   * range is what block insertion (LaTeX modal, later the image file
   * dialog) anchors to.
   */
  saveSelection(): void
  /** Opens the LaTeX modal to insert a new formula („LaTeX einfügen"). */
  openLatexModal(): void
  /** „Editor zurücksetzen" — clears all content after a confirm dialog. */
  resetEditor(): void
  /** Removes document-level listeners and empties the mount container. */
  destroy(): void
}

const PLACEHOLDER_TEXT = 'Hier Text eingeben ...'

const PREVIEW_PLACEHOLDER_HTML =
  '<span style="color:#9aa3af; font-size:13px;">Vorschau erscheint hier ...</span>'

function escapeHtml(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** `err.message || String(err)` — MathJax's TexError is message-shaped but no Error instance. */
function errorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message: unknown }).message
    if (typeof message === 'string' && message) return message
  }
  return String(err)
}

export function createEditorController(container: HTMLElement): EditorController {
  // --- Static skeleton (imperative DOM; the React reconciler never sees it) ---
  // The LaTeX modal is part of the skeleton (PRD: modals stay DOM-driven).
  // It must live inside the container so the `.latex-editor #latexOverlay`
  // styles apply; position:fixed detaches it visually anyway. The reference
  // markup's inline `width:680px` is intentionally not ported — the
  // consolidated editor.css owns the width (`min(720px, 92vw)`, the
  // layout-refresh layer's last word, which carried `!important`).
  container.innerHTML =
    '<div id="exportArea">' +
    '<div class="topbar"></div>' +
    '<div class="editor-scroll" id="editorScroll">' +
    '<div id="editor" contenteditable="true"></div>' +
    '</div>' +
    '</div>' +
    '<div class="modal-overlay" id="latexOverlay">' +
    '<div class="modal">' +
    '<h2 id="latexModalTitle">LaTeX-Formel einfügen</h2>' +
    '<textarea id="latexInput" placeholder="z.B. \\begin{aligned} ... \\end{aligned}  oder  $$ a^2+b^2=c^2 $$&#10;Platzhalter für Felder: [input:name] oder [output:name]"></textarea>' +
    '<div style="font-size:11px; color:#6b7280; margin-top:4px;">' +
    'Tipp: Markiere Text und nutze die <b>Haupttoolbar</b> für Farbe (→ <code>\\textcolor</code>), bzw. <b>Input/Output</b> direkt dort — wird an Cursor-Position eingefügt.' +
    '</div>' +
    '<div id="latexPreviewBox" style="margin-top:12px; min-height:70px; max-height:200px; overflow:auto; background:#f8fafc; border:1px solid #e0e6ee; border-radius:10px; padding:14px; display:flex; align-items:center; justify-content:center;">' +
    PREVIEW_PLACEHOLDER_HTML +
    '</div>' +
    '<div class="modal-actions">' +
    '<button type="button" class="ghost" id="latexDeleteBtn" style="margin-right:auto; color:#991b1b; display:none;">Löschen</button>' +
    '<button type="button" class="ghost" id="latexCancelBtn">Abbrechen</button>' +
    '<button type="button" id="latexCodeblockBtn">Als Codeblock</button>' +
    '<button type="button" class="primary" id="latexApplyBtn">Gerendert einfügen</button>' +
    '</div>' +
    '</div>' +
    '</div>'

  const editor = container.querySelector<HTMLElement>('#editor')!
  editor.dataset['placeholder'] = PLACEHOLDER_TEXT

  const latexOverlay = container.querySelector<HTMLElement>('#latexOverlay')!
  const latexModalTitle = container.querySelector<HTMLElement>('#latexModalTitle')!
  const latexInput = container.querySelector<HTMLTextAreaElement>('#latexInput')!
  const latexPreviewBox = container.querySelector<HTMLElement>('#latexPreviewBox')!
  const latexDeleteBtn = container.querySelector<HTMLButtonElement>('#latexDeleteBtn')!
  const latexCancelBtn = container.querySelector<HTMLButtonElement>('#latexCancelBtn')!
  const latexCodeblockBtn = container.querySelector<HTMLButtonElement>('#latexCodeblockBtn')!
  const latexApplyBtn = container.querySelector<HTMLButtonElement>('#latexApplyBtn')!

  // Mutable controller state. Kept as an object so later slices (image
  // insertion, drag & drop) share the same saved selection.
  const state: { savedRange: Range | null } = { savedRange: null }

  // null = neue Formel, sonst: bestehender .formula-block zum Bearbeiten
  let editingFormulaBlock: HTMLElement | null = null
  let latexPreviewTimer: ReturnType<typeof setTimeout> | undefined
  // Tracker: welcher Editor war zuletzt aktiv (Haupteditor oder LaTeX-Textarea)
  let lastFocused: 'editor' | 'latex' = 'editor'

  // Warm-up: the reference file loaded MathJax at page load (CDN <script> in
  // <head>); the port starts the bundled dynamic import when the editor
  // mounts. Render paths still await loadMathJax(), where a failure surfaces
  // as the German error box.
  void loadMathJax().catch(() => {})

  function exec(cmd: string, value?: string) {
    editor.focus()
    document.execCommand(cmd, false, value)
  }

  function ensureEditorSelection(): Selection | null {
    editor.focus()
    let sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || !editor.contains(sel.anchorNode)) {
      const r = document.createRange()
      r.selectNodeContents(editor)
      r.collapse(false)
      sel = window.getSelection()
      if (!sel) return null
      sel.removeAllRanges()
      sel.addRange(r)
    }
    return sel
  }

  function applyStyles(styleObj: StyleObject) {
    if (isLatexActive()) {
      if (styleObj.color) {
        applyLatexColor(styleObj.color)
        return
      }
      if (styleObj.backgroundColor) {
        applyLatexHighlight(styleObj.backgroundColor)
        return
      }
      // Größe/Bold im LaTeX-Modus: ignorieren (kein sinnvolles 1:1-Mapping)
      return
    }
    const sel = ensureEditorSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)

    const span = document.createElement('span')
    Object.assign(span.style, styleObj)

    if (!range.collapsed) {
      // Auswahl vorhanden: wrappen, Cursor ans Ende
      try {
        span.appendChild(range.extractContents())
      } catch {
        return
      }
      range.insertNode(span)
      const after = document.createRange()
      after.setStartAfter(span)
      after.collapse(true)
      sel.removeAllRanges()
      sel.addRange(after)
    } else {
      // Keine Auswahl: leerer Style-Span mit Zero-Width-Space, Cursor rein
      const zwsp = document.createTextNode('\u200B')
      span.appendChild(zwsp)
      range.insertNode(span)
      const inside = document.createRange()
      inside.setStart(zwsp, 1)
      inside.collapse(true)
      sel.removeAllRanges()
      sel.addRange(inside)
    }
  }

  function applyFontSize(px: string) {
    if (!px) return
    applyStyles({ fontSize: px + 'px' })
  }

  function applyTemplate(color: string, px: number, bold: boolean) {
    applyStyles({ color, fontSize: px + 'px', fontWeight: bold ? 'bold' : 'normal' })
  }

  function formatBlock(tag: string) {
    if (!tag) return
    editor.focus()
    document.execCommand('formatBlock', false, tag)
  }

  function saveSelection() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      state.savedRange = sel.getRangeAt(0).cloneRange()
    } else {
      state.savedRange = null
    }
  }

  function getTopLevelBlock(node: Node | null): Node | null {
    while (node && node.parentNode && node.parentNode !== editor) {
      node = node.parentNode
    }
    return node && node.parentNode === editor ? node : null
  }

  // Fügt einen Block-Knoten nach dem Top-Level-Block der aktuellen Cursor-Position ein
  function insertBlockAtCursor(blockNode: HTMLElement, trailingP?: HTMLElement) {
    editor.focus()
    let topLevel: Node | null = null
    if (state.savedRange) {
      topLevel = getTopLevelBlock(state.savedRange.startContainer)
    }
    if (topLevel && topLevel.parentNode === editor) {
      editor.insertBefore(blockNode, topLevel.nextSibling)
      if (trailingP) editor.insertBefore(trailingP, blockNode.nextSibling)
    } else {
      // Kein Top-Level-Block (Editor leer oder Cursor direkt im editor) → ans Ende
      editor.appendChild(blockNode)
      if (trailingP) editor.appendChild(trailingP)
    }
    // Cursor in den trailing-Absatz oder hinter den Block
    const sel = window.getSelection()
    if (!sel) return
    const r = document.createRange()
    if (trailingP) {
      r.setStart(trailingP, 0)
    } else {
      r.setStartAfter(blockNode)
    }
    r.collapse(true)
    sel.removeAllRanges()
    sel.addRange(r)
    state.savedRange = r.cloneRange()
  }

  // --- LaTeX-Modal (slice 3, #31) ---

  function isLatexActive(): boolean {
    return lastFocused === 'latex' && latexOverlay.classList.contains('open')
  }

  /**
   * Slice-3 stand-in for the reference's final `resolveFieldPlaceholders`
   * (patch-output-as-input-latex-fix-v1, L2698): with no Input/Output fields
   * yet, `[input:x]`/`[output:x]` placeholders pass through verbatim —
   * exactly what the final version does for unknown names — and only the
   * display prettification applies. Slice 6 (#34) replaces this with full
   * field resolution.
   */
  function resolveForDisplay(rawLatex: string): string {
    return prettifyMultiplicationStars(rawLatex)
  }

  function openLatexModal(existingBlock?: HTMLElement | null) {
    saveSelection()
    editingFormulaBlock = existingBlock ?? null

    if (editingFormulaBlock) {
      const target = editingFormulaBlock.querySelector<HTMLElement>('.render-target')
      latexModalTitle.textContent = 'Formel bearbeiten'
      latexDeleteBtn.style.display = ''
      latexApplyBtn.textContent = 'Aktualisieren'
      latexInput.value = target?.dataset['rawLatex'] || target?.dataset['latex'] || ''
    } else {
      latexModalTitle.textContent = 'LaTeX-Formel einfügen'
      latexDeleteBtn.style.display = 'none'
      latexApplyBtn.textContent = 'Gerendert einfügen'
      latexInput.value = ''
    }

    // (populateFieldQuickInsert of the reference was already a no-op — not ported.)
    latexOverlay.classList.add('open')
    latexInput.focus()
    updateLatexPreview()
  }

  function closeLatexModal() {
    latexOverlay.classList.remove('open')
    editingFormulaBlock = null
  }

  // Wrappt LaTeX-Textarea-Auswahl mit \textcolor[HTML]{HEX} (kein "#", da das in math-mode bricht)
  function wrapTextareaSelectionWithLatex(commandStart: string, commandEnd: string) {
    const start = latexInput.selectionStart
    const end = latexInput.selectionEnd
    if (start === end) {
      // Keine Auswahl: an Cursor einfügen, Cursor zwischen Wrapper setzen
      const insert = commandStart + commandEnd
      latexInput.value = latexInput.value.slice(0, start) + insert + latexInput.value.slice(end)
      const innerPos = start + commandStart.length
      latexInput.focus()
      latexInput.setSelectionRange(innerPos, innerPos)
    } else {
      const selected = latexInput.value.slice(start, end)
      const wrapped = commandStart + selected + commandEnd
      latexInput.value = latexInput.value.slice(0, start) + wrapped + latexInput.value.slice(end)
      const newPos = start + wrapped.length
      latexInput.focus()
      latexInput.setSelectionRange(newPos, newPos)
    }
    updateLatexPreview()
  }

  function applyLatexColor(hex: string) {
    const clean = (hex || '').replace('#', '').toUpperCase()
    wrapTextareaSelectionWithLatex('\\textcolor[HTML]{' + clean + '}{', '}')
  }

  function applyLatexHighlight(hex: string) {
    const clean = (hex || '').replace('#', '').toUpperCase()
    wrapTextareaSelectionWithLatex('\\colorbox[HTML]{' + clean + '}{', '}')
  }

  function updateLatexPreview() {
    clearTimeout(latexPreviewTimer)
    latexPreviewTimer = setTimeout(async () => {
      const raw = cleanupLatex(latexInput.value)
      if (!raw) {
        latexPreviewBox.innerHTML = PREVIEW_PLACEHOLDER_HTML
        return
      }
      const resolved = resolveForDisplay(raw)
      try {
        const mathJax = await loadMathJax()
        const svg = await mathJax.tex2svgPromise(resolved, { display: true })
        latexPreviewBox.innerHTML = ''
        latexPreviewBox.appendChild(svg)
      } catch (err) {
        latexPreviewBox.innerHTML =
          '<div class="formula-error">MathJax-Fehler:\n' + escapeHtml(errorMessage(err)) + '</div>'
      }
    }, 250)
  }

  function insertLatexCodeblock() {
    const latex = cleanupLatex(latexInput.value)
    closeLatexModal()
    if (!latex) return
    const pre = document.createElement('pre')
    pre.textContent = latex
    const trailing = document.createElement('p')
    trailing.innerHTML = '<br>'
    insertBlockAtCursor(pre, trailing)
  }

  async function renderLatexInElement(target: HTMLElement, latex: string) {
    target.classList.add('is-loading')
    target.textContent = 'Rendering...'

    try {
      // Deviation from the reference (which awaited MathJax OUTSIDE its
      // try/catch): a load failure lands in the German error box here
      // instead of escaping as an unhandled rejection.
      const mathJax = await loadMathJax()
      const svg = await mathJax.tex2svgPromise(latex, { display: true })
      target.classList.remove('is-loading')
      target.innerHTML = ''
      target.appendChild(svg)
      target.dataset['latex'] = latex
    } catch (err) {
      target.classList.remove('is-loading')
      target.innerHTML =
        '<div class="formula-error">MathJax-Fehler:\n' +
        escapeHtml(errorMessage(err)) +
        '\n\nLaTeX:\n' +
        escapeHtml(latex) +
        '</div>'
    }
  }

  async function insertLatexRendered() {
    // The edited block must be captured BEFORE closeLatexModal() nulls it.
    // Slice 4 (#32) additionally captures the block's previous raw LaTeX
    // here and calls syncFormulaLibraryAfterEdit / addToLibrary below.
    const raw = cleanupLatex(latexInput.value)
    const block = editingFormulaBlock
    closeLatexModal()
    if (!raw) return

    const resolved = resolveForDisplay(raw)

    if (block) {
      // Bestehende Formel updaten
      const target = block.querySelector<HTMLElement>('.render-target')
      if (!target) return
      target.dataset['rawLatex'] = raw
      target.dataset['latex'] = resolved
      await renderLatexInElement(target, resolved)
      return
    }

    // Neue Formel einfügen. draggable is part of the reference block markup;
    // the drag & drop handlers land with the library sidebar in slice 4 (#32).
    const blockEl = document.createElement('div')
    blockEl.className = 'formula-block'
    blockEl.draggable = true
    blockEl.innerHTML =
      '<span class="drag-handle" contenteditable="false">&#10074;&#10074;</span>' +
      '<div class="render-target" contenteditable="false" data-raw-latex="' +
      escapeHtml(raw) +
      '" data-latex="' +
      escapeHtml(resolved) +
      '">' +
      escapeHtml(resolved) +
      '</div>'

    const trailing = document.createElement('p')
    trailing.innerHTML = '<br>'
    insertBlockAtCursor(blockEl, trailing)

    const target = blockEl.querySelector<HTMLElement>('.render-target')!
    await renderLatexInElement(target, resolved)
  }

  function deleteCurrentFormula() {
    if (editingFormulaBlock) {
      editingFormulaBlock.remove()
    }
    closeLatexModal()
  }

  function resetEditor() {
    if (window.confirm('Editor wirklich zurücksetzen? Alle Inhalte gehen verloren.')) {
      editor.innerHTML = ''
    }
  }

  // --- Tab zum Einrücken ---
  function insertTabAtCursor() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const tabNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0')
    range.insertNode(tabNode)
    range.setStartAfter(tabNode)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  function removeIndentAtCursor() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    const range = sel.getRangeAt(0)
    if (!range.collapsed) return
    const node = range.startContainer
    if (node.nodeType !== Node.TEXT_NODE) return
    const offset = range.startOffset
    const text = node.textContent ?? ''
    let removeCount = 0
    for (let i = offset - 1; i >= 0 && removeCount < 4; i--) {
      if (text[i] === '\u00A0') removeCount++
      else break
    }
    if (removeCount > 0) {
      node.textContent = text.slice(0, offset - removeCount) + text.slice(offset)
      const newRange = document.createRange()
      newRange.setStart(node, offset - removeCount)
      newRange.collapse(true)
      sel.removeAllRanges()
      sel.addRange(newRange)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    e.preventDefault()

    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return

    let node: Node | null = sel.anchorNode
    let li: Node | null = null
    while (node && node !== editor) {
      if (node.nodeName === 'LI') {
        li = node
        break
      }
      node = node.parentNode
    }

    if (li) {
      document.execCommand(e.shiftKey ? 'outdent' : 'indent')
    } else if (e.shiftKey) {
      removeIndentAtCursor()
    } else {
      insertTabAtCursor()
    }
  }

  // Guard until slice 8: swallow pasted image items so no base64 <img> can
  // enter the document (the PRD forbids base64 image payloads; slice 8
  // replaces this with the upload-to-storage flow).
  const onPaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type && item.type.startsWith('image/')) {
        e.preventDefault()
        return
      }
    }
  }

  // savedRange immer aktuell halten, solange im Editor getippt/geklickt wird
  const onSelectionChange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      state.savedRange = sel.getRangeAt(0).cloneRange()
    }
  }

  // Klick auf irgendeine gerenderte Formel im Editor öffnet das Bearbeiten-Modal
  const onEditorClick = (e: MouseEvent) => {
    const clicked = e.target instanceof Element ? e.target : null
    const target = clicked?.closest('.render-target')
    if (!target) return
    const block = target.closest<HTMLElement>('.formula-block')
    if (!block) return
    e.stopPropagation()
    openLatexModal(block)
  }

  editor.addEventListener('keydown', onKeyDown)
  editor.addEventListener('paste', onPaste)
  editor.addEventListener('click', onEditorClick)
  editor.addEventListener('focus', () => {
    lastFocused = 'editor'
  })
  document.addEventListener('selectionchange', onSelectionChange)

  latexInput.addEventListener('focus', () => {
    lastFocused = 'latex'
  })
  latexInput.addEventListener('input', updateLatexPreview)
  latexDeleteBtn.addEventListener('click', deleteCurrentFormula)
  latexCancelBtn.addEventListener('click', closeLatexModal)
  latexCodeblockBtn.addEventListener('click', insertLatexCodeblock)
  latexApplyBtn.addEventListener('click', () => {
    void insertLatexRendered()
  })
  // Parity port of the reference's overlay background click-to-close
  // (L1355). Dead in practice for #latexOverlay — its pointer-events:none
  // background never receives clicks (that is what keeps the floating panel
  // non-blocking) — but it is the live pattern for the slice-5 field overlay.
  latexOverlay.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement && e.target.id === 'latexOverlay') closeLatexModal()
  })

  function destroy() {
    clearTimeout(latexPreviewTimer)
    document.removeEventListener('selectionchange', onSelectionChange)
    editor.removeEventListener('keydown', onKeyDown)
    editor.removeEventListener('paste', onPaste)
    editor.removeEventListener('click', onEditorClick)
    container.innerHTML = ''
  }

  return {
    exec,
    formatBlock,
    applyStyles,
    applyFontSize,
    applyTemplate,
    saveSelection,
    openLatexModal,
    resetEditor,
    destroy,
  }
}
