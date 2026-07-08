'use client'

import { useRef, type RefObject } from 'react'
import type { EditorController } from '@/lib/editor/controller'

/**
 * Rich-text toolbar of the LaTeX editor (slice 1 of PRD #28).
 *
 * Markup and labels are a 1:1 port of the standalone editor's toolbar
 * (reference file in latexEditor/). LaTeX arrived with slice 3, Input/Output
 * with slice 5, „Bild einfügen" with slice 8 (reference L541–542:
 * saveSelection() before opening the file dialog, value reset after pick).
 *
 * All controls are uncontrolled and call straight into the imperative
 * controller — no React state, so typing in the contenteditable surface
 * never triggers a re-render.
 */

const FONT_SIZES = ['12', '14', '16', '18', '20', '24', '28', '32']

const TEMPLATES: { label: string; color: string; px: number; bold: boolean }[] = [
  { label: 'Schwarz 18', color: '#111827', px: 18, bold: false },
  { label: 'Schwarz 24', color: '#111827', px: 24, bold: true },
  { label: 'Orange 18', color: '#e8722c', px: 18, bold: false },
  { label: 'Cyan 18', color: '#06b6d4', px: 18, bold: false },
  { label: 'Lila 18', color: '#7c3aed', px: 18, bold: false },
]

const LABEL_STYLE = { fontSize: 12, color: '#6b7280' } as const

export function EditorToolbar({
  controllerRef,
}: {
  controllerRef: RefObject<EditorController | null>
}) {
  const ctrl = () => controllerRef.current
  const imageInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="toolbar">
      <div className="group">
        <button type="button" onClick={() => ctrl()?.exec('bold')}>
          <b>B</b>
        </button>
        <button type="button" onClick={() => ctrl()?.exec('italic')}>
          <i>I</i>
        </button>
        <button type="button" onClick={() => ctrl()?.exec('underline')}>
          <u>U</u>
        </button>
        <button type="button" onClick={() => ctrl()?.exec('strikeThrough')}>
          <s>S</s>
        </button>
      </div>
      <div className="sep" />
      <div className="group">
        <select
          aria-label="Format"
          defaultValue=""
          onChange={(e) => ctrl()?.formatBlock(e.target.value)}
        >
          <option value="">Format</option>
          <option value="H1">H1</option>
          <option value="H2">H2</option>
          <option value="P">Normal</option>
          <option value="PRE">Codeblock</option>
        </select>
        <button type="button" onClick={() => ctrl()?.exec('insertUnorderedList')}>
          &bull; Liste
        </button>
        <button type="button" onClick={() => ctrl()?.exec('insertOrderedList')}>
          1. Liste
        </button>
      </div>
      <div className="sep" />
      <div className="group">
        <label style={LABEL_STYLE}>Text</label>
        <input
          type="color"
          aria-label="Textfarbe"
          defaultValue="#111827"
          onInput={(e) => ctrl()?.applyStyles({ color: e.currentTarget.value })}
        />
        <label style={LABEL_STYLE}>Highlight</label>
        <input
          type="color"
          aria-label="Highlightfarbe"
          defaultValue="#fff3b0"
          onInput={(e) => ctrl()?.applyStyles({ backgroundColor: e.currentTarget.value })}
        />
        <button
          type="button"
          className="clear-highlight"
          aria-label="Kein Highlight"
          title="Highlight entfernen"
          onClick={() => ctrl()?.clearHighlight()}
        >
          ✕
        </button>
        <label style={LABEL_STYLE}>Größe</label>
        <select
          aria-label="Schriftgröße"
          defaultValue=""
          onChange={(e) => {
            ctrl()?.applyFontSize(e.target.value)
            // Parity with the standalone editor: the select resets itself
            e.target.value = ''
          }}
        >
          <option value="">Größe</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="sep" />
      <div className="group">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            className="template-btn"
            onClick={() => ctrl()?.applyTemplate(t.color, t.px, t.bold)}
          >
            <span className="swatch" style={{ background: t.color }} />
            {t.label}
          </button>
        ))}
      </div>
      <div className="sep" />
      <div className="group">
        <button type="button" aria-label="Linksbündig" onClick={() => ctrl()?.exec('justifyLeft')}>
          {'⇤'}
        </button>
        <button type="button" aria-label="Zentriert" onClick={() => ctrl()?.exec('justifyCenter')}>
          {'↔'}
        </button>
        <button type="button" aria-label="Rechtsbündig" onClick={() => ctrl()?.exec('justifyRight')}>
          {'⇥'}
        </button>
      </div>
      <div className="sep" />
      <div className="group">
        {/* .accent replaces the reference's [onclick*="openLatexModal"] selector (see editor.css) */}
        <button type="button" className="accent" onClick={() => ctrl()?.openLatexModal()}>
          ƒ(x) LaTeX einfügen
        </button>
        <button
          type="button"
          onClick={() => {
            // Reference L541: snapshot the selection BEFORE the file dialog
            // steals focus — the picked image is inserted at this position.
            ctrl()?.saveSelection()
            imageInputRef.current?.click()
          }}
        >
          📷 Bild einfügen
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            // Reference L1172: reset so picking the same file twice re-fires.
            e.target.value = ''
            if (file) ctrl()?.insertImageFromFile(file)
          }}
        />
        {/* Reference order (L543–544): Input/Output sit between image insert and reset. */}
        <button type="button" onClick={() => ctrl()?.insertInputField()}>
          ☐ Input
        </button>
        <button type="button" onClick={() => ctrl()?.insertOutputField()}>
          ☑ Output
        </button>
        <button type="button" onClick={() => ctrl()?.resetEditor()}>
          Editor zurücksetzen
        </button>
      </div>
      <div className="sep" />
      <div className="group">
        {/* Reference L2369–2386: the JSON-import patch appends its own toolbar
            group with an "Add JSON" button (label parity, German tooltip). */}
        <button
          type="button"
          title="JSON-Dokument importieren"
          onClick={() => ctrl()?.openJsonImportModal()}
        >
          Add JSON
        </button>
      </div>
    </div>
  )
}
