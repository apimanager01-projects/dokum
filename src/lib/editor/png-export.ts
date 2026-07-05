/**
 * PNG-export pipeline of the LaTeX editor (PRD #28, slice 10 — #38).
 *
 * Port of the standalone editor's `exportPng()` (reference file in
 * latexEditor/, L1283–1353) minus filename handling and the download anchor:
 * this module returns a **Blob**, so „Als PNG herunterladen" (slice 10) and
 * „Als Dokument speichern" (slice 11 publishing) share one pipeline.
 *
 * `svgToPngDataUrl` is defined twice in the reference; the LAST patch layer
 * (L2635, "keep LaTeX formula visual size stable in PNG export") fully
 * replaces the base version and is the porting ground truth per the PRD's
 * consolidation rule. Its differences from the base (L1236): it sizes from
 * the SVG's OWN bounding rect (mjx-container rect only as fallback) and it
 * injects a missing `viewBox` so the raster scales instead of clipping.
 *
 * html2canvas is bundled (exact-pinned 1.4.1 — byte-identical to the cdnjs
 * file the reference loaded) and dynamically imported inside the pipeline:
 * the same split-point pattern as mathjax-loader.ts, so the chunk is loaded
 * on first export only, reachable only from the editor page, and served
 * from 'self' (CSP-clean, no CDN request).
 *
 * Browser-only module — must never be imported from server code.
 */

export interface PngExportOptions {
  /**
   * html2canvas render scale. Default 2 (reference parity, L1340); slice
   * 11's reduced-resolution fallback passes 1 when the 2× Blob exceeds the
   * upload limit. The internal MathJax-SVG raster stays fixed at 2×
   * regardless — the swapped <img> is sized in CSS px, so only this scale
   * determines the final pixel dimensions.
   */
  scale?: number
}

/**
 * Rasterises one MathJax SVG to a PNG data URL at 2× (patched reference
 * L2635). `width`/`height` are the CSS-pixel display size the replacement
 * <img> must be given.
 */
export function svgToPngDataUrl(
  svgEl: SVGSVGElement
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Size from the SVG's own rect; the mjx-container rect (what the base
    // version used) is only the zero-size fallback.
    const svgRect = svgEl.getBoundingClientRect()
    const container = svgEl.closest('mjx-container') ?? svgEl
    const containerRect = container.getBoundingClientRect()
    const width = Math.max(1, Math.round(svgRect.width || containerRect.width))
    const height = Math.max(1, Math.round(svgRect.height || containerRect.height))

    const clone = svgEl.cloneNode(true) as SVGSVGElement
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('width', String(width))
    clone.setAttribute('height', String(height))
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // currentColor → real colour value (the serialized SVG loses the cascade).
    const color = getComputedStyle(svgEl).color || '#111827'
    clone.querySelectorAll('[fill="currentColor"], [stroke="currentColor"]').forEach((el) => {
      if (el.getAttribute('fill') === 'currentColor') el.setAttribute('fill', color)
      if (el.getAttribute('stroke') === 'currentColor') el.setAttribute('stroke', color)
    })
    if (!clone.getAttribute('fill') || clone.getAttribute('fill') === 'currentColor') {
      clone.setAttribute('fill', color)
    }

    const svgStr = new XMLSerializer().serializeToString(clone)
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const tmpImg = new Image()
    tmpImg.onload = () => {
      const scale = 2 // fixed internal raster scale (reference parity)
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas-2D-Kontext nicht verfügbar.'))
        return
      }
      ctx.scale(scale, scale)
      ctx.drawImage(tmpImg, 0, 0, width, height)
      URL.revokeObjectURL(url)
      resolve({ dataUrl: canvas.toDataURL('image/png'), width, height })
    }
    tmpImg.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    tmpImg.src = url
  })
}

/**
 * Renders the export area to a PNG Blob (reference `exportPng()` pipeline):
 *
 *  1. expand the scroll container so the full document is in the layout,
 *  2. hide the drag handles (previous inline display stashed, like the
 *     reference),
 *  3. `.exporting` on — field pills print as plain text, reduced block
 *     padding (editor.css),
 *  4. rasterize every MathJax SVG and swap the WHOLE render-target content
 *     for a PNG <img> (awaiting load before insertion; per-SVG failures are
 *     logged and skipped, reference L1324–1326),
 *  5. html2canvas over the export area (white background, `useCORS: true` —
 *     harmless: editor images stream through the same-origin
 *     /api/editor-image/ proxy, so the canvas is never tainted),
 *  6. restore the DOM — always, on success AND failure, before the Blob
 *     conversion (the reference restores right after html2canvas settles).
 */
export async function exportAreaToPngBlob(
  exportArea: HTMLElement,
  editorScroll: HTMLElement,
  options: PngExportOptions = {}
): Promise<Blob> {
  const scale = options.scale ?? 2

  const prevMaxHeight = editorScroll.style.maxHeight
  const prevOverflow = editorScroll.style.overflowY
  editorScroll.style.maxHeight = 'none'
  editorScroll.style.overflowY = 'visible'

  const handles = Array.from(exportArea.querySelectorAll<HTMLElement>('.drag-handle'))
  handles.forEach((h) => {
    h.dataset['prevDisplay'] = h.style.display
    h.style.display = 'none'
  })

  exportArea.classList.add('exporting')

  const renderTargets = Array.from(exportArea.querySelectorAll<HTMLElement>('.render-target'))
  const swaps: { target: HTMLElement; savedHTML: string }[] = []
  for (const target of renderTargets) {
    const svg = target.querySelector('svg')
    if (!svg) continue
    try {
      const { dataUrl, width, height } = await svgToPngDataUrl(svg)
      const savedHTML = target.innerHTML
      const img = document.createElement('img')
      img.style.width = `${width}px`
      img.style.height = `${height}px`
      img.style.display = 'inline-block'
      // Wait for the load BEFORE swapping it in (reference L1315–1320).
      await new Promise((res, rej) => {
        img.onload = res
        img.onerror = rej
        img.src = dataUrl
      })
      target.innerHTML = ''
      target.appendChild(img)
      swaps.push({ target, savedHTML })
    } catch (e) {
      console.error('SVG-Rasterisierung fehlgeschlagen:', e)
    }
  }

  let restored = false
  const restore = () => {
    if (restored) return
    restored = true
    editorScroll.style.maxHeight = prevMaxHeight
    editorScroll.style.overflowY = prevOverflow
    handles.forEach((h) => {
      h.style.display = h.dataset['prevDisplay'] ?? ''
      delete h.dataset['prevDisplay']
    })
    swaps.forEach(({ target, savedHTML }) => {
      target.innerHTML = savedHTML
    })
    exportArea.classList.remove('exporting')
  }

  try {
    // Bundler split point (mathjax-loader pattern) — html2canvas lands in an
    // async chunk that only ever loads on the first export.
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(exportArea, {
      backgroundColor: '#ffffff',
      scale,
      useCORS: true,
      logging: false,
    })
    restore()
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('PNG-Blob konnte nicht erstellt werden.')),
        'image/png'
      )
    })
  } catch (err) {
    restore()
    throw err
  }
}
