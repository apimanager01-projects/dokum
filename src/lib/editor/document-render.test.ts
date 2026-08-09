// @vitest-environment jsdom
/**
 * document-render tests (#67).
 *
 * Behavioural: given a published snapshot, what does the STUDENT get? Not
 * which helper ran, not the internal call order — what is on screen, what is
 * selectable, what is resolved, and what editor affordances are provably
 * absent.
 *
 * Runs in jsdom, in the style of the document-json suite: the renderer builds
 * real DOM and stays MathJax-free, so the formula assertions check the
 * resolved LaTeX handed to MathJax rather than its SVG output.
 */

import { describe, expect, it } from 'vitest'
import type { LatestEditorDocumentJson } from './document-json'
import { renderDocumentJson } from './document-render'

const IMG_ID = '44444444-4444-4444-8444-444444444444'

function mount(): HTMLElement {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host
}

function render(doc: LatestEditorDocumentJson, host = mount()) {
  const result = renderDocumentJson(doc, host, { imageUrl: (id) => `/api/image/${id}` })
  return { host, result }
}

/** A document exercising every v1.0 block type plus the field graph. */
const DOC: LatestEditorDocumentJson = {
  version: '1.0',
  variables: [
    { id: 'v_rev', type: 'input', name: 'Revenue', refType: 'static', value: 1200 },
    { id: 'v_mar', type: 'input', name: 'Margin', refType: 'static', value: 0.2534 },
    { id: 'v_ebit', type: 'output', name: 'EBIT', expr: 'Revenue * Margin' },
  ],
  content: [
    { type: 'heading', level: 1, children: [{ text: 'Bewertung' }] },
    {
      type: 'paragraph',
      children: [{ text: 'Umsatz: ' }, { fieldId: 'v_rev' }, { text: ' | Marge: ' }, { fieldId: 'v_mar' }],
    },
    { type: 'formula', latex: 'EBIT = [input:Revenue] \\cdot [input:Margin]' },
    { type: 'paragraph', children: [{ text: 'Ergebnis: ' }, { fieldId: 'v_ebit' }] },
    { type: 'list', ordered: false, items: [[{ text: 'Punkt A' }], [{ text: 'Punkt B' }]] },
    { type: 'code', text: 'x^2' },
    { type: 'image', imageId: IMG_ID, alt: 'Diagramm' },
  ],
  library: [],
}

// ── Content renders as real content ─────────────────────────────────────────

describe('renderDocumentJson — structure', () => {
  it('renders each block type as its own element', () => {
    const { host } = render(DOC)
    expect(host.querySelector('h1')?.textContent).toBe('Bewertung')
    expect(host.querySelectorAll('p').length).toBe(2)
    expect(host.querySelectorAll('ul li').length).toBe(2)
    expect(host.querySelector('pre')?.textContent).toBe('x^2')
    expect(host.querySelector('.formula-block')).not.toBeNull()
    expect(host.querySelector('.image-block')).not.toBeNull()
  })

  it('produces real selectable text, not an image of text', () => {
    const { host } = render(DOC)
    // The words a student would want to copy are present as text nodes.
    expect(host.textContent).toContain('Bewertung')
    expect(host.textContent).toContain('Umsatz:')
    expect(host.textContent).toContain('Punkt A')
    expect(host.querySelectorAll('img[data-image-id]').length).toBe(1)
  })

  it('resolves images through the injected entitlement-gated route', () => {
    const { host } = render(DOC)
    const img = host.querySelector<HTMLImageElement>('img[data-image-id]')
    expect(img?.getAttribute('src')).toBe(`/api/image/${IMG_ID}`)
    expect(img?.getAttribute('alt')).toBe('Diagramm')
  })

  it('replaces previous content when the same container is rendered again', () => {
    const { host } = render(DOC)
    render(DOC, host)
    expect(host.querySelectorAll('h1').length).toBe(1)
    expect(host.querySelectorAll('.image-block').length).toBe(1)
  })
})

// ── No editor affordances reach the student ─────────────────────────────────

describe('renderDocumentJson — editor chrome is stripped', () => {
  it('carries no drag handles, delete buttons or draggable blocks', () => {
    const { host } = render(DOC)
    expect(host.querySelector('.drag-handle')).toBeNull()
    expect(host.querySelector('.img-remove')).toBeNull()
    expect(host.querySelector('[draggable]')).toBeNull()
  })

  it('leaves nothing contenteditable — the document text is fixed', () => {
    const doc: LatestEditorDocumentJson = {
      ...DOC,
      content: [{ type: 'formula', latex: 'a+b', caption: 'Eine Bildunterschrift' }],
    }
    const { host } = render(doc)
    expect(host.querySelector('[contenteditable]')).toBeNull()
    // The caption still renders — only its editability is gone.
    expect(host.textContent).toContain('Eine Bildunterschrift')
  })
})

// ── Computed values ─────────────────────────────────────────────────────────

describe('renderDocumentJson — field values', () => {
  it('shows a static input’s own value', () => {
    const { host } = render(DOC)
    const rev = host.querySelector('.input-field[data-field-id="v_rev"]')
    expect(rev?.textContent).toBe('1200')
  })

  it('shows an output’s computed value, German-formatted', () => {
    const { host } = render(DOC)
    const ebit = host.querySelector('.output-field[data-field-id="v_ebit"]')
    expect(ebit?.textContent).toBe('304,08')
  })

  it('marks a non-resolvable output as an error rather than blank', () => {
    const doc: LatestEditorDocumentJson = {
      version: '1.0',
      variables: [{ id: 'v_bad', type: 'output', name: 'Kaputt', expr: 'Unbekannt * 2' }],
      content: [{ type: 'paragraph', children: [{ fieldId: 'v_bad' }] }],
      library: [],
    }
    const { host } = render(doc)
    const field = host.querySelector('.output-field[data-field-id="v_bad"]')
    expect(field?.textContent).toBe('Err')
    expect(field?.classList.contains('is-error')).toBe(true)
  })

  it('resolves a reference input to the value it points at', () => {
    const doc: LatestEditorDocumentJson = {
      version: '1.0',
      variables: [
        { id: 'v_a', type: 'input', name: 'A', refType: 'static', value: 2500 },
        { id: 'v_out', type: 'output', name: 'Doppelt', expr: 'A * 2' },
        { id: 'v_clone', type: 'input', refType: 'ref', refId: 'v_out', referenceClone: true },
      ],
      content: [{ type: 'paragraph', children: [{ fieldId: 'v_clone' }] }],
      library: [],
    }
    const { host } = render(doc)
    expect(host.querySelector('.input-field[data-field-id="v_clone"]')?.textContent).toBe('5 000')
  })
})

// ── Formulas ────────────────────────────────────────────────────────────────

describe('renderDocumentJson — formulas', () => {
  it('returns a render target per formula, in document order', () => {
    const doc: LatestEditorDocumentJson = {
      version: '1.0',
      variables: [],
      content: [
        { type: 'formula', latex: 'a+b' },
        { type: 'paragraph', children: [{ text: 'dazwischen' }] },
        { type: 'formula', latex: 'c+d' },
      ],
      library: [],
    }
    const { result } = render(doc)
    expect(result.renderTargets.map((t) => t.dataset['rawLatex'])).toEqual(['a+b', 'c+d'])
  })

  it('hands MathJax the RESOLVED latex and keeps the raw source alongside', () => {
    const { result } = render(DOC)
    const target = result.renderTargets[0]
    expect(target?.dataset['rawLatex']).toBe('EBIT = [input:Revenue] \\cdot [input:Margin]')
    // Placeholders become German-formatted display values (reference parity).
    expect(target?.dataset['latex']).toContain('1 200')
    expect(target?.dataset['latex']).toContain('0,2534')
    expect(target?.dataset['latex']).not.toContain('[input:')
  })

  it('leaves an unknown placeholder name visible rather than silently blank', () => {
    const doc: LatestEditorDocumentJson = {
      version: '1.0',
      variables: [],
      content: [{ type: 'formula', latex: 'x = [input:GibtEsNicht]' }],
      library: [],
    }
    const { result } = render(doc)
    expect(result.renderTargets[0]?.dataset['latex']).toContain('[input:GibtEsNicht]')
  })
})

// ── Purity ──────────────────────────────────────────────────────────────────

describe('renderDocumentJson — purity', () => {
  it('does not mutate the snapshot it renders', () => {
    const before = JSON.stringify(DOC)
    render(DOC)
    expect(JSON.stringify(DOC)).toBe(before)
  })

  it('renders into the container it is given and nowhere else', () => {
    const other = mount()
    const { host } = render(DOC)
    expect(host.childNodes.length).toBeGreaterThan(0)
    expect(other.childNodes.length).toBe(0)
  })
})
