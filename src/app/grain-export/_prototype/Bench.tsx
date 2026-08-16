'use client'

/**
 * PROTOTYPE (#120) — throwaway. Measures whether html2canvas reproduces the
 * paper-grain ground, and what it costs.
 *
 * This is NOT a mock of the export. It builds the editor's real export DOM
 * (`.latex-editor > #exportArea > .editor-scroll#editorScroll > #editor`,
 * styled by the real editor.css), fills it with real MathJax formula blocks,
 * and hands it to the real `exportAreaToPngBlob` from lib/editor/png-export —
 * same html2canvas 1.4.1, same `{ backgroundColor:'#ffffff', scale, useCORS }`,
 * same SVG→PNG swap. What it reports is what publishing would get.
 *
 * Two grain PLACEMENTS are tested, because they are different questions:
 *   • root  — background-image on #exportArea, the element html2canvas is given
 *   • inner — background-image on #editor, a descendant of it
 * html2canvas treats the capture root's background specially, so an answer for
 * one says nothing about the other. For `root`, #editor's own white is cleared;
 * otherwise it simply paints over the ground and the test measures nothing.
 *
 * The measurement strip is found IN THE EXPORTED PIXELS by a magenta marker
 * border rather than by a DOM rect: `.exporting` reduces block padding and the
 * SVG→PNG swap changes formula heights, so a rect measured before the export
 * does not survive it.
 *
 * All pixel analysis runs in-page against the decoded PNG, so what leaves the
 * browser is numbers, not megabytes.
 */

import { useCallback, useRef, useState } from 'react'
import { exportAreaToPngBlob } from '@/lib/editor/png-export'
import { loadMathJax } from '@/lib/editor/mathjax-loader'
import '../../admin/editor/editor.css'

/** #116's decided ground and its generated tile. */
const GROUND = '#f0eae2'
const TILE = '/prototype/paper-grain.png'
const TILE_CSS_PX = 200
/** Marker colour — pure magenta appears nowhere else in the document. */
const MARKER = '#ff00ff'

type Placement = 'none' | 'root' | 'inner'

interface Stats {
  mean: number
  std: number
  p2: number
  p50: number
  p98: number
  /** Excursion the WCAG ratio has to hold across, in luma steps. */
  range98: number
  /** Distinct quarter-luma values present — 1 means a perfectly flat fill. */
  distinct: number
  /**
   * Normalised cross-correlation of the ground against itself, shifted. Keyed
   * by shift in DEVICE px: the tile period should score ~1, a half-period ~0.
   */
  shiftNcc: Record<string, number>
  /** Row-mean deviation at tile boundaries, in units of the profile's own σ. */
  seamSigma: number
  /** Sample box found in the exported canvas. */
  box: { x: number; y: number; w: number; h: number }
}

interface RunResult {
  label: string
  placement: Placement
  scale: number
  formulas: number
  ms: number
  bytes: number
  canvas: { w: number; h: number }
  stats: Stats | null
  crop: string | null
}

/* ------------------------------------------------------------ the document */

/** Economics/maths at the density of a real Dokum document — the map's domain. */
const FORMULAS = [
  'E[X] = \\sum_{i=1}^{n} x_i \\, p_i',
  '\\operatorname{Var}(X) = E[X^2] - \\left(E[X]\\right)^2',
  'NPV = \\sum_{t=0}^{T} \\frac{CF_t}{(1+r)^t}',
  '\\frac{\\partial U}{\\partial x_1} \\bigg/ \\frac{\\partial U}{\\partial x_2} = \\frac{p_1}{p_2}',
  'K_n = K_0 \\cdot (1 + i)^n',
  '\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = f\'(x)',
  '\\int_a^b f(x)\\,dx = F(b) - F(a)',
  'A = \\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix}',
  '\\det(A) = a_{11}a_{22} - a_{12}a_{21}',
  'P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}',
  '\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y',
  'Q_d = a - b\\,p \\quad\\text{und}\\quad Q_s = c + d\\,p',
  '\\varepsilon_{d} = \\frac{\\partial Q}{\\partial p} \\cdot \\frac{p}{Q}',
  'MC = \\frac{\\partial C(q)}{\\partial q} \\stackrel{!}{=} MR',
  '\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}',
  'R_{ann} = \\left(1 + \\frac{r}{m}\\right)^{m} - 1',
  '\\mathcal{L}(x,\\lambda) = f(x) - \\lambda\\,\\bigl(g(x) - c\\bigr)',
  '\\sum_{k=0}^{\\infty} q^k = \\frac{1}{1-q}, \\quad |q| < 1',
  'z = \\frac{\\bar{x} - \\mu}{\\sigma / \\sqrt{n}}',
  'BIP = C + I + G + (Ex - Im)',
]

const PROSE = [
  'Die folgende Herleitung geht vom einfachsten Fall aus und lockert die Annahmen anschließend Schritt für Schritt. Achte darauf, welche Größe jeweils exogen bleibt und welche sich anpasst.',
  'Setze die Werte aus der Angabe ein und rechne mit vier Nachkommastellen weiter. Gerundet wird erst am Schluss, sonst wandert der Fehler durch die ganze Rechnung.',
  'Die Bedingung erster Ordnung liefert das Optimum nur dann, wenn die zweite Ableitung das richtige Vorzeichen hat. Prüfe das, bevor du das Ergebnis interpretierst.',
  'In der Prüfung wird meistens nicht das Ergebnis abgefragt, sondern der Zwischenschritt. Schreibe ihn hin, auch wenn du ihn im Kopf machen könntest.',
]

function buildDocument(host: HTMLElement, formulaCount: number, withStrip: boolean) {
  const parts: string[] = ['<h1>Investitionsrechnung und Erwartungswert</h1>']
  for (let i = 0; i < formulaCount; i++) {
    if (i % 4 === 0) parts.push(`<h2>Abschnitt ${Math.floor(i / 4) + 1}</h2>`)
    parts.push(`<p>${PROSE[i % PROSE.length]}</p>`)
    parts.push(
      '<div class="formula-block" draggable="true">' +
        '<span class="drag-handle" contenteditable="false">&#10074;&#10074;</span>' +
        '<div class="render-target" contenteditable="false" data-bench-index="' +
        i +
        '">Rendering...</div>' +
        '</div>'
    )
  }
  parts.push(`<p>${PROSE[1]}</p>`)
  // The measurement strip: a tall run of pure ground with nothing on it, so the
  // stats describe the GROUND and not the ink sitting on it. 620 CSS px is three
  // tile periods plus the marker — enough to correlate the repeat against itself.
  if (withStrip) {
    parts.push(
      `<div id="benchStrip" style="height:620px;border:2px solid ${MARKER};background:transparent"></div>`
    )
  }
  host.innerHTML = parts.join('')
}

async function typesetAll(host: HTMLElement) {
  const mathJax = await loadMathJax()
  const targets = Array.from(host.querySelectorAll<HTMLElement>('.render-target[data-bench-index]'))
  for (const target of targets) {
    const tex = FORMULAS[Number(target.dataset['benchIndex']) % FORMULAS.length]!
    const svg = await mathJax.tex2svgPromise(tex, { display: true })
    target.innerHTML = ''
    target.appendChild(svg)
  }
}

/* ---------------------------------------------------------------- analysis */

function luma(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Finds the marker-bordered strip in the exported canvas. Immune to every
 * layout shift the export itself introduces, because it reads the result.
 */
function findMarkerBox(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const { data } = ctx.getImageData(0, 0, w, h)
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      // Generous threshold: the border may be antialiased at its ends.
      if (data[i]! > 200 && data[i + 1]! < 80 && data[i + 2]! > 200) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (!Number.isFinite(minX)) return null
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

/** Normalised cross-correlation of a field against itself, shifted by `lag` rows. */
function shiftNcc(values: Float64Array, w: number, h: number, mean: number, lag: number) {
  if (lag >= h) return NaN
  let num = 0
  let a2 = 0
  let b2 = 0
  for (let y = 0; y + lag < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = values[y * w + x]! - mean
      const b = values[(y + lag) * w + x]! - mean
      num += a * b
      a2 += a * a
      b2 += b * b
    }
  }
  const den = Math.sqrt(a2 * b2)
  return den > 0 ? +(num / den).toFixed(3) : NaN
}

/**
 * Everything the ticket asks about the ground: does it vary at all (did the
 * grain survive), how far does it swing (the WCAG excursion), does it still
 * repeat at the tile period at the export's pixel ratio, and does the repeat
 * show a seam.
 */
function analyse(data: ImageData, period: number): Stats {
  const { width, height, data: px } = data
  const values = new Float64Array(width * height)
  const seen = new Set<number>()
  const rowMean = new Float64Array(height)
  let sum = 0

  for (let y = 0; y < height; y++) {
    let rs = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const l = luma(px[i]!, px[i + 1]!, px[i + 2]!)
      values[y * width + x] = l
      rs += l
      if (seen.size < 4096) seen.add(Math.round(l * 4))
    }
    rowMean[y] = rs / width
    sum += rs
  }

  const n = values.length
  const mean = sum / n
  let varSum = 0
  for (let i = 0; i < n; i++) varSum += (values[i]! - mean) ** 2
  const std = Math.sqrt(varSum / n)

  const sorted = Float64Array.from(values).sort()
  const at = (q: number) => sorted[Math.min(n - 1, Math.max(0, Math.round(q * (n - 1))))]!

  // Does the tiling survive? Shift the field by exactly one tile period and
  // correlate. ~1 means the repeat is pixel-exact; the half-period control
  // says what "no relationship" scores on this same field.
  const ncc: Record<string, number> = {
    [`p${period}`]: shiftNcc(values, width, height, mean, period),
    [`p${period - 1}`]: shiftNcc(values, width, height, mean, period - 1),
    [`p${period + 1}`]: shiftNcc(values, width, height, mean, period + 1),
    [`half${Math.round(period / 2)}`]: shiftNcc(values, width, height, mean, Math.round(period / 2)),
  }

  // A seam would be a row of altered luma exactly at the tile boundary.
  const rowMu = rowMean.reduce((a, v) => a + v, 0) / height
  const rowSigma = Math.sqrt(rowMean.reduce((a, v) => a + (v - rowMu) ** 2, 0) / height) || 1e-9
  let worst = 0
  for (let y = 0; y < height; y++) {
    if (y % period !== 0) continue
    for (const yy of [y, y - 1, y + 1]) {
      if (yy < 0 || yy >= height) continue
      worst = Math.max(worst, Math.abs(rowMean[yy]! - rowMu) / rowSigma)
    }
  }

  return {
    mean: +mean.toFixed(2),
    std: +std.toFixed(3),
    p2: +at(0.02).toFixed(1),
    p50: +at(0.5).toFixed(1),
    p98: +at(0.98).toFixed(1),
    range98: +(at(0.98) - at(0.02)).toFixed(1),
    distinct: seen.size,
    shiftNcc: ncc,
    seamSigma: +worst.toFixed(2),
    box: { x: 0, y: 0, w: width, h: height },
  }
}

/* ------------------------------------------- the transparent-ground option */

/**
 * Costs the three grounds the PNG could carry, with everything else held
 * equal: white (today), grain, and none at all. The third is the interesting
 * one — if the PNG carries only ink, the LIVE page supplies the paper behind
 * it, so the fallback matches whatever the document ground is at no byte cost
 * and with no second copy of the grain to keep in step.
 */
async function measureGrounds(host: HTMLElement, formulas: number) {
  const { default: html2canvas } = await import('html2canvas')
  const grainCss = `${GROUND} url(${TILE}) repeat top left / ${TILE_CSS_PX}px ${TILE_CSS_PX}px`
  const cases: { name: string; bg: string; canvasBg: string | null }[] = [
    { name: 'white (today)', bg: '#ffffff', canvasBg: '#ffffff' },
    { name: 'grain baked in', bg: grainCss, canvasBg: '#ffffff' },
    { name: 'transparent', bg: 'transparent', canvasBg: null },
  ]

  const out: { name: string; ms: number; bytes: number; mb: number }[] = []
  for (const c of cases) {
    host.innerHTML =
      '<div class="latex-editor" style="padding:0">' +
      '<div id="exportArea"><div class="topbar"></div>' +
      '<div class="editor-scroll" id="editorScroll"><div id="editor"></div></div>' +
      '</div></div>'
    const exportArea = host.querySelector<HTMLElement>('#exportArea')!
    const editorScroll = host.querySelector<HTMLElement>('#editorScroll')!
    const editor = host.querySelector<HTMLElement>('#editor')!
    exportArea.style.background = c.bg
    editor.style.background = 'transparent'
    buildDocument(editor, formulas, false)
    await typesetAll(editor)
    await document.fonts.ready
    editorScroll.style.maxHeight = 'none'
    editorScroll.style.overflowY = 'visible'
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

    const t0 = performance.now()
    const canvas = await html2canvas(exportArea, {
      backgroundColor: c.canvasBg,
      scale: 2,
      useCORS: true,
      logging: false,
    })
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error('no blob'))), 'image/png')
    )
    const ms = performance.now() - t0
    out.push({ name: c.name, ms: Math.round(ms), bytes: blob.size, mb: +(blob.size / 1048576).toFixed(2) })
  }
  return out
}

/* -------------------------------------------------------------- the bench */

export function GrainExportBench({ formulaCount }: { formulaCount: number }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [results, setResults] = useState<RunResult[]>([])
  const [status, setStatus] = useState('Bereit.')

  const run = useCallback(
    async (formulas: number, placement: Placement, scale: number, withStrip: boolean) => {
      const host = hostRef.current!
      host.innerHTML =
        '<div class="latex-editor" style="padding:0">' +
        '<div id="exportArea"><div class="topbar"></div>' +
        '<div class="editor-scroll" id="editorScroll"><div id="editor"></div></div>' +
        '</div></div>'

      const exportArea = host.querySelector<HTMLElement>('#exportArea')!
      const editorScroll = host.querySelector<HTMLElement>('#editorScroll')!
      const editor = host.querySelector<HTMLElement>('#editor')!

      const grainCss = `${GROUND} url(${TILE}) repeat top left / ${TILE_CSS_PX}px ${TILE_CSS_PX}px`
      if (placement === 'root') {
        exportArea.style.background = grainCss
        // editor.css paints #editor white; leave it and the root's ground is
        // simply covered up and the test measures nothing.
        editor.style.background = 'transparent'
      }
      if (placement === 'inner') editor.style.background = grainCss

      buildDocument(editor, formulas, withStrip)
      await typesetAll(editor)
      await document.fonts.ready
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

      const t0 = performance.now()
      const blob = await exportAreaToPngBlob(exportArea, editorScroll, { scale })
      const ms = performance.now() - t0

      const bitmap = await createImageBitmap(blob)
      const canvas = document.createElement('canvas')
      canvas.width = bitmap.width
      canvas.height = bitmap.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0)

      let stats: Stats | null = null
      let crop: string | null = null
      if (withStrip) {
        const marker = findMarkerBox(ctx, canvas.width, canvas.height)
        if (marker) {
          // Well clear of the marker border and its antialiasing.
          const inset = 6 * scale
          const x = marker.x + inset
          const y = marker.y + inset
          const w = marker.w - inset * 2
          const h = marker.h - inset * 2
          if (w > 32 && h > 32) {
            stats = analyse(ctx.getImageData(x, y, w, h), TILE_CSS_PX * scale)
            stats.box = { x, y, w, h }
            const cc = document.createElement('canvas')
            cc.width = Math.min(w, 420)
            cc.height = Math.min(h, 420)
            cc.getContext('2d')!.drawImage(canvas, x, y, cc.width, cc.height, 0, 0, cc.width, cc.height)
            crop = cc.toDataURL('image/png')
          }
        }
      }

      return {
        label: `${placement}/${scale}×/${formulas}f${withStrip ? '+strip' : ''}`,
        placement,
        scale,
        formulas,
        ms: Math.round(ms),
        bytes: blob.size,
        canvas: { w: canvas.width, h: canvas.height },
        stats,
        crop,
      } satisfies RunResult
    },
    []
  )

  const runAll = useCallback(async () => {
    const out: RunResult[] = []
    const push = async (f: number, p: Placement, s: number, strip: boolean) => {
      setStatus(`Läuft: ${p} @${s}× ${f} Formeln ${strip ? '(Streifen)' : '(Kosten)'} …`)
      out.push(await run(f, p, s, strip))
      setResults([...out])
    }

    // Warm MathJax and the html2canvas chunk so the first timing is not the
    // module load. Discarded.
    await run(2, 'none', 1, false)

    // Fidelity — the strip is in, so the ground itself can be measured.
    await push(formulaCount, 'none', 2, true)
    await push(formulaCount, 'root', 2, true)
    await push(formulaCount, 'inner', 2, true)
    await push(formulaCount, 'inner', 1, true)

    // Cost — no strip, so the bytes describe a real document. Twice each; the
    // faster of the pair is the honest number (the slower carries GC noise).
    for (const rep of [0, 1]) {
      void rep
      await push(formulaCount, 'none', 2, false)
      await push(formulaCount, 'inner', 2, false)
      await push(formulaCount, 'none', 1, false)
      await push(formulaCount, 'inner', 1, false)
    }

    // Where does grain cross the 4 MB publish ceiling? The curve, not one point.
    for (const f of [4, 8, 12, 16]) {
      await push(f, 'inner', 2, false)
      await push(f, 'none', 2, false)
    }

    // The hypothetical the numbers point at: bake NO ground into the PNG and
    // let the live page supply it behind the <img>. This is the one variant
    // that does not go through exportAreaToPngBlob — that function hard-codes
    // `backgroundColor: '#ffffff'`, so adopting this means changing that line.
    // Measured with the same direct html2canvas call for all three grounds, so
    // the three numbers are comparable to each other (they are NOT directly
    // comparable to the runs above, which include the MathJax SVG→PNG swap).
    setStatus('Läuft: Grund-Vergleich (weiß / Grain / transparent) …')
    const groundCost = await measureGrounds(hostRef.current!, formulaCount)
    ;(window as unknown as { __groundCost: unknown }).__groundCost = groundCost

    setStatus('Fertig.')
    ;(window as unknown as { __benchResults: RunResult[] }).__benchResults = out
  }, [formulaCount, run])

  return (
    <div style={{ padding: 16, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
      <button id="runBench" onClick={() => void runAll()} style={{ padding: '6px 12px' }}>
        Run bench ({formulaCount} Formeln)
      </button>
      <span style={{ marginLeft: 12 }} id="benchStatus">
        {status}
      </span>

      <pre id="benchJson" style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(
          results.map(({ crop: _crop, ...r }) => r),
          null,
          1
        )}
      </pre>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} id="benchCrops">
        {results
          .filter((r) => r.crop)
          .map((r) => (
            <figure key={r.label} style={{ margin: 0 }}>
              <figcaption>{r.label}</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.crop!} alt={r.label} style={{ border: '1px solid #999' }} />
            </figure>
          ))}
      </div>

      {/* The live export DOM. Kept on screen so a failure is visible, not silent. */}
      <div ref={hostRef} style={{ marginTop: 24, width: 860 }} />
    </div>
  )
}
