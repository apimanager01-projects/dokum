# PROTOTYPE — personality direction (#116)

> Three variants of the catalog, switchable via `?variant=`, on the existing `/kurse` route.

Throwaway. Nothing here is a decision, and nothing here is production code — it was written
under prototype rules (no tests, no error handling, no abstractions). The winner gets
rewritten properly when it is folded in.

## Run it

```bash
npm run dev
```

Then open, and use `←` / `→` or the floating bar at the bottom:

| URL | Variant | Lever |
| --- | ------- | ----- |
| <http://localhost:3000/kurse?variant=A> | **Papier** | warmth of ground |
| <http://localhost:3000/kurse?variant=B> | **Luft** | generosity of space |
| <http://localhost:3000/kurse?variant=C> | **Karte** | softness of form |

`/kurse` with no `?variant=` is the untouched production page. The switcher and the variant
branch are both gated on `NODE_ENV !== 'production'`.

### The grain is a second, independent axis

`?grain=on|off`, or the **G** key, or the button in the bar. The map wants texture
product-wide *and* wants the implementation chosen deliberately — so binding it to Variant A
would have settled two questions with one click. "Is warmth the lever?" and "does the product
have texture?" are separable, and **B or C with grain is a real answer**. Defaults are each
variant's own proposal (A on, B and C off) and the toggle carries across variant switches.

Screenshots of all five states are in [`shots/`](shots/).

## What each variant is arguing

The ticket names three defensible systems for where "welcoming" comes from. One variant per
lever, so the comparison is between *systems*, not between three tweaks of one card grid.

- **A — Papier.** Cream ground carrying the real grain tile; everything else disciplined.
  Flat panels, hairlines, no shadows, restrained weights. The one chromatic mark is a red rule.
- **B — Luft.** Cool near-white, **no cards at all** — an editorial index of hairline-separated
  rows with the counts set as large light numerals. Welcoming from air and measure only.
  This is the variant that tests whether the cream can go.
- **C — Karte.** Rounded-square tiles built from the flip-clock reference inverted to a light
  ground: heavy weight, tabular numerals, and a **hairline seam** crossing every card at a
  fixed height — the flip card's split digit, which is what makes this something other than
  the generic soft-card answer the ticket warns about.

## What is deliberately held constant

- **Geist everywhere.** The typeface is #117's decision, and this ticket must not pre-empt it.
  Variants differ in weight, size and rhythm — not in family.
- **State chips are achromatic.** Colour semantics are #118's. `Locked` appears on two Kurse
  purely so the state grammar has somewhere to sit.
- **Red is `#db3627`** and appears at most once per variant, so the personality question is not
  quietly answered by "more brand colour".

## Each variant ends with a specimen strip

Both sub-questions the ticket attaches, answered inside each system rather than in the
abstract:

1. **Wordmark** — `dokum.` with the period as a red dot, as a plain full stop, and as a red
   square/circle/card, set in that variant's own weight and tracking.
2. **Learning surface** — an `h2`, running text at ~70ch, a formula block, and a live inline
   student input. This is the constraint that kills a direction: one that only works on
   marketing surfaces has failed.

The formula is static markup in a serif italic standing in for MathJax's SVG output — close
enough for spacing and weight, not a rendering test.

## The data is not the dev DB

`prototype-data.ts` holds six realistic German course names. The dev project's catalog is QA
fixtures (`publishTestKurs`, `testtabkurs`), which are shorter and more ASCII than anything a
real Kurs is called — they would hide exactly the compound-noun wrapping and density problems
this prototype exists to expose.

## The grain

`generate-grain.py` produces `public/prototype/paper-grain.png` — a 200×200 **seamless** tile
(blur applied across a 3×3 layout, centre-cropped, so the edges wrap). Tiling the reference
scan itself was rejected: at 691×1024 it shows a visible repeat across a landing page.

Measured off `01-paper-grain-cream.jpg`: mean `#f3ece5`, luma p5–p95 `224–249`. The tile swings
both ways around the ground rather than only darkening it, and composited on `#faf6f0` gives a
p2–p98 range of `232–248`. That excursion is the WCAG constraint made concrete — a contrast
ratio assumes a *flat* background, so it has to hold at the texture's darkest point, not its
mean.
