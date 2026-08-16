# Visual references

Exported pins from the private Pinterest board that seeded Dokum's visual direction
([#114](https://github.com/dokumtastisch/dokum/issues/114), part of map
[#112](https://github.com/dokumtastisch/dokum/issues/112)).

**A reference is evidence about taste, not a decision.** Nothing in this folder is a
commitment. These are the input the personality direction
([#116](https://github.com/dokumtastisch/dokum/issues/116)) reacts to — which is why almost
everything downstream on the map waited on them. Curation happens there, not here.

## Status

> **Partial — 2 references, both material.** The ticket expected 10–20. More pins are
> welcome; see the gap named below, which is the part that actually constrains #116.

## What landed

| File | What it is | Why it was saved |
| ---- | ---------- | ---------------- |
| [01-paper-grain-cream.jpg](01-paper-grain-cream.jpg) | Scan of uncoated recycled paper. Warm cream ground, dense fibrous grain, visible flecks and inclusions, no printed content. 691×1024. | The "paper look (granularity)" from the brief, stated directly. A *material* sample, not a layout. |
| [02-flip-clock-black.jpg](02-flip-clock-black.jpg) | Flip clock reading 5:00 AM. Pure black ground, two rounded-square cards, hairline seam across the numeral, heavy grotesque digits, no colour at all. 736×736. | Saved off a *vision-board / "5am motivation"* pin, per the original filename — so it may have been saved for the message rather than the design. Read as design it still carries signal; read as motivation it carries none. **Worth confirming.** |

## The pattern across them

With two pins the honest reading is narrow, and the most useful thing here is what is
**absent**.

**The through-line is materiality.** Both references are physical objects, not screens: paper
fibre and a mechanical flip card. Neither is flat, and neither is decorative — the interest in
each is *what the thing is made of* and how it catches light. That is a coherent instinct and
it agrees with the settled quiet/editorial register: character coming from substance and
restraint rather than from ornament, colour, or illustration.

**They are opposites on every other axis**, and that is not yet a contradiction to resolve —
it is simply two data points that do not overlap:

| | 01 paper | 02 flip clock |
| --- | --- | --- |
| Polarity | light ground | dark ground |
| Temperature | warm | neutral-cold |
| Contrast | very low, all mid-tones | maximal, black/white only |
| Form | organic, irregular | geometric, rounded-square, exact |

**Two constraints already apply to 02.** Its most distinctive quality — the black ground — is
unusable: dark mode is out of scope on the map, and research §9 backs positive polarity for
normal vision. What survives inversion is the rounded-square card, the heavy numeral, the
hairline seam, and the reductive austerity of showing exactly one thing.

**One constraint already applies to 01.** Grain on the *learning surface* is not free:
`html2canvas` has to reproduce whatever `.dokum-document` is made of, because the exported PNG
is the fallback every student sees when live MathJax rendering fails (§9). Grain on the
catalog with a flat document ground is a legitimate answer.

### The gap

**There is no layout evidence here at all.** Neither reference shows a screen, a type
hierarchy, a grid, a component, a state, or a piece of running text. So this folder can inform
**ground and surface** — what things are made of — and cannot inform measure, density,
hierarchy, type treatment, or how a card, a control or a formula block should look. Those are
most of what #116 has to decide.

Two ways that closes, and either is fine:

1. **More pins**, weighted toward interfaces and editorial layout rather than materials.
2. **Prototypes carry it instead** — #116 renders the catalog three ways and the layout
   direction is decided by looking at Dokum's own screens rather than by analogy. The two
   material references still do real work there, as the *ground* each alternative sits on.

## How these got here

Pinterest has no board export. The board is private, but `i.pinimg.com` serves pin images
without authentication — so only the URL list has to come out of the browser by hand.

On the board page, scroll to the bottom **first** (the grid is virtualised — pins that were
never scrolled past are not in the DOM), then in the DevTools console:

```js
copy([...new Set(
  [...document.querySelectorAll('img[src*="i.pinimg.com"]')]
    .map(i => i.src.replace(/\/\d+x\//, '/originals/'))
)].join('\n'))
```

That rewrite matters: the grid renders 236 px thumbnails, and at that size type treatment,
measure and spacing — the things a reference is being read for — are illegible. `originals`
occasionally 404s; `736x` is the fallback and is usually enough.

Files are named `NN-slug.<ext>`, numbered only so they can be referred to unambiguously in
discussion. The number carries no ranking. Source files arrived as `.jfif` (a JPEG container
with an awkward extension) and one carried an emoji in its filename; both were renamed for
cross-platform and git sanity, and the bytes are untouched.
