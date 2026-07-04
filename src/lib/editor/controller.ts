/**
 * Imperative vanilla-TS core of the LaTeX editor (PRD #28, Approach C).
 *
 * Ported 1:1 from the standalone reference file
 * latexEditor/latex_editor_FIXED_JSON_IMPORT_COMPLETE_OUTPUT_AS_INPUT_LATEX_FIX.htm.html.
 * Slice-1 functions come from the base script (none of the seven patch
 * layers override them). Slice 3 (#31) ported the LaTeX pipeline, slice 4
 * (#32) the formula library sidebar and block drag & drop; the consolidated
 * (last-wins) owners are:
 *   - modal, preview, codeblock insert, render, delete, click-to-edit,
 *     block insertion, textarea colour wrapping — base script L747–1071;
 *   - `insertLatexRendered` — the "Editing an existing LaTeX formula updates
 *     it" patch layer (L2647): the edited block and its previous raw LaTeX
 *     must be captured BEFORE closeLatexModal() nulls them (the base version
 *     read the block afterwards, so editing inserted duplicates — that patch
 *     is the fix), and the edit path syncs the library entry;
 *   - `addToLibrary` — base script L1074–1130, with the library-item
 *     dragstart consolidated to the same patch's `ensureDrag` behavior (its
 *     last word): the drag payload reads `dataset.latex` at drag time, so
 *     in-place library syncs never drag stale LaTeX. The dedup/sync
 *     decisions live in library-sync.ts (pure, tested);
 *   - `syncFormulaLibraryAfterEdit` — defined only in that patch (L2647);
 *   - block drag & drop, inline drop caret, `insertFormulaFromLibraryAt` —
 *     base script L1966–2092 / L1132–1168, never patched (the capture-phase
 *     field-drop handlers L2232–2235 and the variables sidebar belong to
 *     slice 5, #33);
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
import { librarySyncAction, shouldAddToLibrary } from './library-sync'
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
  // Sidebar markup ← reference L589–605. Slice 5 (#33) prepends the
  // "Variablen" h3 + #variableList section above the library heading and
  // restores the reference's inline margin-top:18px on it (the heading is
  // first — and margin-less — until then).
  container.innerHTML =
    '<div class="workspace">' +
    '<div id="exportArea">' +
    '<div class="topbar"></div>' +
    '<div class="editor-scroll" id="editorScroll">' +
    '<div id="editor" contenteditable="true"></div>' +
    '</div>' +
    '</div>' +
    '<aside id="formulaLibrary">' +
    '<h3>Formel-Bibliothek</h3>' +
    '<div id="libraryList">' +
    '<div class="library-empty">Noch keine Formeln. Füge welche über &laquo;LaTeX einfügen&raquo; hinzu — sie erscheinen hier und können per Drag&amp;Drop in den Editor gezogen werden.</div>' +
    '</div>' +
    '</aside>' +
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

  const libraryList = container.querySelector<HTMLElement>('#libraryList')!
  const latexOverlay = container.querySelector<HTMLElement>('#latexOverlay')!
  const latexModalTitle = container.querySelector<HTMLElement>('#latexModalTitle')!
  const latexInput = container.querySelector<HTMLTextAreaElement>('#latexInput')!
  const latexPreviewBox = container.querySelector<HTMLElement>('#latexPreviewBox')!
  const latexDeleteBtn = container.querySelector<HTMLButtonElement>('#latexDeleteBtn')!
  const latexCancelBtn = container.querySelector<HTMLButtonElement>('#latexCancelBtn')!
  const latexCodeblockBtn = container.querySelector<HTMLButtonElement>('#latexCodeblockBtn')!
  const latexApplyBtn = container.querySelector<HTMLButtonElement>('#latexApplyBtn')!

  // Mutable controller state. Kept as an object so drag & drop and later
  // slices (image insertion) share the same saved selection.
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

  // Formula-block markup shared by modal insertion and library drops
  // (reference L1037–1044 and its verbatim copy L1154–1161).
  function createFormulaBlockElement(raw: string, resolved: string): HTMLElement {
    const block = document.createElement('div')
    block.className = 'formula-block'
    block.draggable = true
    block.innerHTML =
      '<span class="drag-handle" contenteditable="false">&#10074;&#10074;</span>' +
      '<div class="render-target" contenteditable="false" data-raw-latex="' +
      escapeHtml(raw) +
      '" data-latex="' +
      escapeHtml(resolved) +
      '">' +
      escapeHtml(resolved) +
      '</div>'
    return block
  }

  async function insertLatexRendered() {
    // The edited block and its previous raw LaTeX must be captured BEFORE
    // closeLatexModal() nulls the editing state (patch L2647).
    const raw = cleanupLatex(latexInput.value)
    const block = editingFormulaBlock
    const oldRaw = block
      ? block.querySelector<HTMLElement>('.render-target')?.dataset['rawLatex'] ||
        block.querySelector<HTMLElement>('.render-target')?.dataset['latex'] ||
        ''
      : ''
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
      await syncFormulaLibraryAfterEdit(oldRaw, raw)
      return
    }

    // Neue Formel einfügen
    const blockEl = createFormulaBlockElement(raw, resolved)
    const trailing = document.createElement('p')
    trailing.innerHTML = '<br>'
    insertBlockAtCursor(blockEl, trailing)

    const target = blockEl.querySelector<HTMLElement>('.render-target')!
    await renderLatexInElement(target, resolved)

    await addToLibrary(raw)
  }

  function deleteCurrentFormula() {
    if (editingFormulaBlock) {
      editingFormulaBlock.remove()
    }
    closeLatexModal()
  }

  // --- Formel-Bibliothek (slice 4, #32) ---
  // Session-scoped by design (PRD: no persistence across sessions/drafts);
  // items are identified by their raw LaTeX in dataset.latex. resetEditor
  // deliberately leaves the library alone (reference parity).

  function libraryItems(): HTMLElement[] {
    return Array.from(libraryList.querySelectorAll<HTMLElement>('.library-item'))
  }

  // The patch's `preview()` helper (L2647): text fallback first, then the
  // mini-render — on MathJax failure the LaTeX text simply stays.
  async function updateLibraryItemPreview(item: HTMLElement, latex: string) {
    const preview = item.querySelector<HTMLElement>('.preview')
    if (!preview) return
    preview.textContent = latex
    try {
      const mathJax = await loadMathJax()
      // Aufgelöste Version zeigen, falls Platzhalter enthalten sind
      const svg = await mathJax.tex2svgPromise(resolveForDisplay(latex), { display: true })
      preview.innerHTML = ''
      preview.appendChild(svg)
    } catch {
      preview.textContent = latex
    }
  }

  async function addToLibrary(latex: string) {
    // Duplikate vermeiden (decision: library-sync.ts)
    if (!shouldAddToLibrary(libraryItems().map((it) => it.dataset['latex'] ?? ''), latex)) return

    const empty = libraryList.querySelector('.library-empty')
    if (empty) empty.remove()

    const item = document.createElement('div')
    item.className = 'library-item'
    item.draggable = true
    item.dataset['latex'] = latex
    item.title = 'Ziehen, um in den Editor einzufügen'

    const preview = document.createElement('div')
    preview.className = 'preview'
    preview.textContent = latex
    item.appendChild(preview)

    const rm = document.createElement('button')
    rm.type = 'button'
    rm.className = 'lib-remove'
    rm.textContent = '×'
    rm.title = 'Aus Bibliothek entfernen'
    rm.addEventListener('click', (e) => {
      e.stopPropagation()
      item.remove()
      if (!libraryList.querySelector('.library-item')) {
        const e2 = document.createElement('div')
        e2.className = 'library-empty'
        e2.textContent = 'Noch keine Formeln in der Bibliothek.'
        libraryList.appendChild(e2)
      }
    })
    item.appendChild(rm)

    libraryList.appendChild(item)

    // Consolidated dragstart (base L1114 closure, superseded by the L2647
    // patch's capture-phase `ensureDrag` — last definition wins): the
    // payload reads dataset.latex at drag time, so an in-place library sync
    // never leaves a stale closure behind.
    item.addEventListener('dragstart', (e) => {
      if (!e.dataTransfer) return
      const current = item.dataset['latex'] ?? ''
      e.dataTransfer.effectAllowed = 'copy'
      e.dataTransfer.setData('application/x-latex', current)
      e.dataTransfer.setData('text/plain', current)
    })

    await updateLibraryItemPreview(item, latex)
  }

  // Hält die Bibliothek nach dem Bearbeiten einer Formel synchron
  // (patch L2647; decision logic in library-sync.ts).
  async function syncFormulaLibraryAfterEdit(oldLatex: string, newLatex: string) {
    const items = libraryItems()
    const action = librarySyncAction(
      items.map((it) => it.dataset['latex'] ?? ''),
      oldLatex,
      newLatex
    )
    switch (action.kind) {
      case 'remove-old':
        // Edit-Kollision: der bestehende Eintrag für newLatex bleibt
        items[action.index]?.remove()
        return
      case 'update-old': {
        const item = items[action.index]
        if (!item) return
        item.dataset['latex'] = newLatex
        await updateLibraryItemPreview(item, newLatex)
        return
      }
      case 'add':
        await addToLibrary(newLatex)
        return
      case 'noop':
        return
    }
  }

  async function insertFormulaFromLibraryAt(rawLatex: string, clientX: number, clientY: number) {
    // Cursor an Drop-Position setzen
    const dropRange = caretRangeAtPoint(clientX, clientY)
    if (dropRange && editor.contains(dropRange.startContainer)) {
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(dropRange)
      }
      state.savedRange = dropRange.cloneRange()
    }

    const resolved = resolveForDisplay(rawLatex)
    const block = createFormulaBlockElement(rawLatex, resolved)
    const trailing = document.createElement('p')
    trailing.innerHTML = '<br>'
    insertBlockAtCursor(block, trailing)

    const target = block.querySelector<HTMLElement>('.render-target')!
    await renderLatexInElement(target, resolved)
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

  // --- Drag & Drop: Blocks verschieben + Bibliothek einfügen (slice 4, #32) ---
  // Base script L1966–2092, never patched. The capture-phase field-drop
  // handlers (L2232–2235) arrive with the variables sidebar in slice 5 (#33).

  // Caret-Range an Bildschirmposition (WebKit caretRangeFromPoint bzw.
  // Standard caretPositionFromPoint) — shared by the library drop and the
  // inline drop caret (identical inline blocks in the reference).
  function caretRangeAtPoint(clientX: number, clientY: number): Range | null {
    if (document.caretRangeFromPoint) {
      return document.caretRangeFromPoint(clientX, clientY)
    }
    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(clientX, clientY)
      if (pos) {
        const r = document.createRange()
        r.setStart(pos.offsetNode, pos.offset)
        r.collapse(true)
        return r
      }
    }
    return null
  }

  let dragEl: HTMLElement | null = null
  let dropIndicator: HTMLElement | null = null
  let inlineDropCaret: HTMLElement | null = null

  function ensureDropIndicator(): HTMLElement {
    if (!dropIndicator) {
      dropIndicator = document.createElement('div')
      dropIndicator.className = 'drop-indicator'
    }
    return dropIndicator
  }

  function removeDropIndicator() {
    if (dropIndicator && dropIndicator.parentNode) {
      dropIndicator.parentNode.removeChild(dropIndicator)
    }
  }

  // (The parameter deliberately shadows the outer mount container — it is
  // always called with `editor`, matching the reference signature.)
  function getDragAfterElement(container: HTMLElement, y: number): Element | null {
    // #hiddenFields is slice 5's (#33) hidden field store — the filter is
    // ported verbatim and is a no-op until then.
    const elements = [...container.children].filter(
      (el) => el !== dragEl && el !== dropIndicator && el.id !== 'hiddenFields'
    )
    let closest: { offset: number; element: Element | null } = {
      offset: Number.NEGATIVE_INFINITY,
      element: null,
    }
    for (const el of elements) {
      const box = el.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        closest = { offset, element: el }
      }
    }
    return closest.element
  }

  // .image-block blocks arrive with slice 8 (#36); the selectors are ported
  // verbatim so their reordering works the moment they exist.
  const onDragStart = (e: DragEvent) => {
    const targetEl = e.target instanceof Element ? e.target : null
    const block = targetEl?.closest<HTMLElement>('.formula-block, .image-block')
    if (!block) return
    dragEl = block
    setTimeout(() => block.classList.add('dragging'), 0)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', 'block-drag')
    }
  }

  const onDragEnd = () => {
    if (dragEl) dragEl.classList.remove('dragging')
    removeDropIndicator()
    dragEl = null
  }

  const onDragOver = (e: DragEvent) => {
    if (dragEl) {
      e.preventDefault()
      const afterEl = getDragAfterElement(editor, e.clientY)
      const indicator = ensureDropIndicator()
      if (afterEl == null) {
        editor.appendChild(indicator)
      } else {
        editor.insertBefore(indicator, afterEl)
      }
    } else if (
      e.dataTransfer &&
      (e.dataTransfer.types.includes('application/x-latex') ||
        e.dataTransfer.types.includes('application/x-field-id'))
    ) {
      // application/x-field-id: variables-sidebar drags of slice 5 (#33) —
      // the caret preview is already wired for them here.
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      showInlineDropCaret(e.clientX, e.clientY)
    }
  }

  const onDragLeave = (e: DragEvent) => {
    // Nur entfernen, wenn der Mauszeiger den Editor wirklich verlässt (nicht nur ein Kind-Element)
    if (e.target === editor) hideInlineDropCaret()
  }

  const onDrop = (e: DragEvent) => {
    hideInlineDropCaret()
    if (dragEl) {
      e.preventDefault()
      const afterEl = getDragAfterElement(editor, e.clientY)
      removeDropIndicator()
      if (afterEl == null) {
        editor.appendChild(dragEl)
      } else {
        editor.insertBefore(dragEl, afterEl)
      }
      return
    }
    if (!e.dataTransfer) return

    // Seam (slice 5, #33): 'application/x-field-id' drops from the variables
    // sidebar are checked here first in the reference (L2050–2055) and call
    // cloneFieldToDropPosition(fieldId, e.clientX, e.clientY).

    const latex = e.dataTransfer.getData('application/x-latex')
    if (latex) {
      e.preventDefault()
      void insertFormulaFromLibraryAt(latex, e.clientX, e.clientY)
    }
  }

  // --- Live-Drop-Vorschau ---

  function showInlineDropCaret(clientX: number, clientY: number) {
    hideInlineDropCaret()
    const dropRange = caretRangeAtPoint(clientX, clientY)
    if (!dropRange || !editor.contains(dropRange.startContainer)) return
    inlineDropCaret = document.createElement('span')
    inlineDropCaret.className = 'inline-drop-caret'
    inlineDropCaret.setAttribute('contenteditable', 'false')
    try {
      dropRange.insertNode(inlineDropCaret)
    } catch {
      inlineDropCaret = null
    }
  }

  function hideInlineDropCaret() {
    if (inlineDropCaret && inlineDropCaret.parentNode) {
      inlineDropCaret.parentNode.removeChild(inlineDropCaret)
    }
    inlineDropCaret = null
  }

  editor.addEventListener('keydown', onKeyDown)
  editor.addEventListener('paste', onPaste)
  editor.addEventListener('click', onEditorClick)
  editor.addEventListener('dragstart', onDragStart)
  editor.addEventListener('dragend', onDragEnd)
  editor.addEventListener('dragover', onDragOver)
  editor.addEventListener('dragleave', onDragLeave)
  editor.addEventListener('drop', onDrop)
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
    editor.removeEventListener('dragstart', onDragStart)
    editor.removeEventListener('dragend', onDragEnd)
    editor.removeEventListener('dragover', onDragOver)
    editor.removeEventListener('dragleave', onDragLeave)
    editor.removeEventListener('drop', onDrop)
    dragEl = null
    dropIndicator = null
    inlineDropCaret = null
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
