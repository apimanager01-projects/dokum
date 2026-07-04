/**
 * Imperative vanilla-TS core of the LaTeX editor (PRD #28, Approach C).
 *
 * Ported 1:1 from the standalone reference file
 * latexEditor/latex_editor_FIXED_JSON_IMPORT_COMPLETE_OUTPUT_AS_INPUT_LATEX_FIX.htm.html
 * (base script — none of the seven patch layers override slice-1 functions).
 *
 * React renders the mount container childless and never reconciles inside it;
 * this controller owns the entire subtree (export area, contenteditable
 * surface, listeners). `document.execCommand` is kept deliberately for
 * behavioral parity with the standalone editor.
 *
 * Browser-only module — must never import the DAL or other server-only code.
 */

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
  /** Wraps the selection in a styled span (or an empty caret span). */
  applyStyles(styles: StyleObject): void
  /** Font size in px (string from the toolbar select); no-op on ''. */
  applyFontSize(px: string): void
  /** Style template: color + size + optional bold. */
  applyTemplate(color: string, px: number, bold: boolean): void
  /**
   * Snapshots the current editor selection into internal state.
   * Groundwork for later slices (LaTeX modal, image file dialog) — the
   * saved range is what block insertion anchors to.
   */
  saveSelection(): void
  /** „Editor zurücksetzen" — clears all content after a confirm dialog. */
  resetEditor(): void
  /** Removes document-level listeners and empties the mount container. */
  destroy(): void
}

const PLACEHOLDER_TEXT = 'Hier Text eingeben ...'

export function createEditorController(container: HTMLElement): EditorController {
  // --- Static skeleton (imperative DOM; the React reconciler never sees it) ---
  container.innerHTML =
    '<div id="exportArea">' +
    '<div class="topbar"></div>' +
    '<div class="editor-scroll" id="editorScroll">' +
    '<div id="editor" contenteditable="true"></div>' +
    '</div>' +
    '</div>'

  const editor = container.querySelector<HTMLElement>('#editor')!
  editor.dataset['placeholder'] = PLACEHOLDER_TEXT

  // Mutable controller state. Kept as an object so later slices (LaTeX
  // modal, image insertion, drag & drop) share the same saved selection.
  const state: { savedRange: Range | null } = { savedRange: null }

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
    // Slice 3 adds the isLatexActive() branch here: while the LaTeX modal's
    // textarea is focused, color/highlight wrap the textarea selection in
    // \textcolor / \colorbox instead of styling editor content.
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

  editor.addEventListener('keydown', onKeyDown)
  editor.addEventListener('paste', onPaste)
  document.addEventListener('selectionchange', onSelectionChange)

  function destroy() {
    document.removeEventListener('selectionchange', onSelectionChange)
    editor.removeEventListener('keydown', onKeyDown)
    editor.removeEventListener('paste', onPaste)
    container.innerHTML = ''
  }

  return {
    exec,
    formatBlock,
    applyStyles,
    applyFontSize,
    applyTemplate,
    saveSelection,
    resetEditor,
    destroy,
  }
}
