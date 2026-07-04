'use client'

import type { RefObject } from 'react'
import type { EditorController } from '@/lib/editor/controller'

/**
 * Rich-text toolbar of the LaTeX editor (slice 1 of PRD #28).
 *
 * Markup and labels are a 1:1 port of the standalone editor's toolbar
 * (reference file in latexEditor/), reduced to the slice-1 controls.
 * Later slices append their groups (LaTeX, Bild, Input/Output).
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
        <button type="button" onClick={() => ctrl()?.resetEditor()}>
          Editor zurücksetzen
        </button>
      </div>
    </div>
  )
}
