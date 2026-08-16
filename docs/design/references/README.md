# Visual references

Exported pins from the private Pinterest board that seeded Dokum's visual direction
([#114](https://github.com/dokumtastisch/dokum/issues/114), part of map
[#112](https://github.com/dokumtastisch/dokum/issues/112)).

**A reference is evidence about taste, not a decision.** Nothing in this folder is a
commitment. These are the input the personality direction
([#116](https://github.com/dokumtastisch/dokum/issues/116)) reacts to — which is why almost
everything downstream on the map waited on them. Curation happens there, not here.

## Status

> **Images pending.** This folder exists as the drop target; the export has not landed yet.
> See "How these got here" below, then replace this section with the inventory table.

## What landed

<!-- One row per image once they land: what it is, and why it was saved where that's known.
     "Why" may be blank — the board is years of accumulated taste, not an annotated argument. -->

| File | What it is | Why it was saved |
| ---- | ---------- | ---------------- |

## The pattern across them

<!-- Filled on resolution of #114: register, palette temperature, density, type treatment.
     This is the part #116 actually consumes. -->

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
discussion. The number carries no ranking.
