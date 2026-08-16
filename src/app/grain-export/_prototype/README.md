# PROTOTYPE (#120) — html2canvas grain-reproduction bench

Throwaway, dev-only (`/grain-export`, `notFound()` in production). Built to answer
[#120](https://github.com/dokumtastisch/dokum/issues/120): does the PNG export reproduce the paper
grain #116 decided, and what does it cost.

    npm run dev
    open http://localhost:3000/grain-export      # ?formulas=20 by default

Click **Run bench**. Results land in the `<pre>` and on `window.__benchResults` /
`window.__groundCost`.

## What it actually drives

Not a mock. It builds the editor's real export DOM
(`.latex-editor > #exportArea > .editor-scroll#editorScroll > #editor`, styled by the real
`editor.css`), fills it with real MathJax formula blocks, and hands it to the real
`exportAreaToPngBlob` from `src/lib/editor/png-export.ts` — same html2canvas 1.4.1, same
`{ backgroundColor: '#ffffff', scale, useCORS }`, same SVG→PNG swap.

One variant is deliberately **not** the real path: the transparent-ground case in
`measureGrounds()` calls html2canvas directly, because `exportAreaToPngBlob` hard-codes
`backgroundColor: '#ffffff'`. That variant is costing a hypothetical, and adopting it would mean
changing that line.

## Two things it does that are worth keeping if this is ever re-run

- **The strip is found in the exported pixels, not by a DOM rect.** `.exporting` reduces block
  padding and the SVG→PNG swap changes formula heights, so a rect measured before the export does
  not survive it. The strip carries a magenta border and `findMarkerBox()` locates it in the result.
- **The `root` placement clears `#editor`'s background.** `editor.css` paints `#editor` white; leave
  it and a ground on `#exportArea` is simply covered up, and the test reads as "html2canvas dropped
  it" when nothing of the sort happened. That false negative is what the first run produced.

## Result

See the [resolution on #120](https://github.com/dokumtastisch/dokum/issues/120). Short version:
html2canvas reproduces the grain exactly (tile repeat correlates at 1.000 against itself, no seam),
it costs ~4× the PNG bytes, and none of that matters as much as the fact that the export runs over
the **admin editor's** surface and never sees `.dokum-document` at all.

`shots/exported-ground.png` — 1:1 crops of the exported ground: flat control (white), grain at 2×
via both placements, grain at 1×.
