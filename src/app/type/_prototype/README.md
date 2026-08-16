# PROTOTYPE — typeface system (#117)

> Five candidate type systems on one specimen, at <http://localhost:3000/type>.

Throwaway. Nothing here is production code — prototype rules (no tests, no error handling, no
abstractions). Whatever wins gets written properly when the tokens land.

## Run it

```bash
npm run dev
```

Then <http://localhost:3000/type>. `←` / `→` or `1`–`5` switch system, `G` toggles the grain,
`+` / `−` nudge the document reading size.

| | System | Chrome | Document | Mono |
| --- | --- | --- | --- | --- |
| **A** | Geist | Geist | Geist | Geist Mono |
| **B** | Plex | IBM Plex Sans | **IBM Plex Serif** | IBM Plex Mono |
| **C** | Geist + Literata | Geist | **Literata** | Geist Mono |
| **D** | Schibsted Grotesk | Schibsted Grotesk | Schibsted Grotesk | IBM Plex Mono |
| **E** | Geist + Plex Serif | Geist | **IBM Plex Serif** | Geist Mono |

**E was added after A–D had been rendered**, and the reason is the finding itself: once it was
clear the document wants a serif, "which chrome" and "which serif" became separable axes, and
B vs C conflated them. E holds the chrome constant at today's Geist so the two serifs can be
compared on their own.

The system lives in React state, **not** in the URL: switching must not remount, because the
whole method here is to hold your eye on one paragraph and flip the family under it. Scroll
position survives for free. `?system=` and `?grain=` only seed the initial state.

Dev only — the route `notFound()`s in production, and `proxy.ts` has a matching dev-only
public-page exemption so it doesn't bounce to the login page.

## What is held constant

Everything except the fonts and the six numbers each system declares in
[`systems.ts`](systems.ts) (reading size, leading, numeral weight, display weight and tracking,
document weight). Anything else that differed would be a confound.

The ground is #116's decision — warm paper `#f0eae2`, warm-white panels `#fffefb`, the generated
grain tile. **A face that only works on white has not been tested**, and #116 explicitly hands
this ticket the requirement that the family stay legible on a textured ground at 13–14 px.

## The four specimens the ticket demands

1. **Real German prose** — `Wirtschaftswissenschaften`, `Budgetbeschränkung`,
   `Deckungsbeitragsrechnung`, `Grenznutzenausgleich`; ß and ä/ö/ü in every weight, including
   `ÄÖÜ` in caps.
2. **Real MathJax, inline and block.** #116's prototype faked the formula with a serif italic —
   fine there, useless here. This goes through `loadMathJax()`, the same loader the editor and
   the student viewer use, at the same settings. There is also a close-up section rendering the
   same sentence at 19/17/15 px, because MathJax's SVG scales in `ex` units off the surrounding
   font: a face with a large x-height grows the formula with it, and that only shows up across
   sizes.
3. **A live `.student-input` in a sentence**, styled by the real
   `interactive-document.css` — 600 weight, `1em`, inline, and it recomputes the output pill.
4. **The `dokum.` wordmark** at three sizes plus the dark navbar ground. The dot is whatever the
   family's full stop happens to be; nothing is redrawn.

Plus what the ticket also asks to settle: the **type scale** (seven steps), the **weights**
actually loaded, the **numerals** (tabular column, confusables, mono), and **compounds at card
width** — where a German word is wider than its column, the family decides how bad that looks.

## The constraint that turned out to be one-sided

**MathJax v3's SVG output has exactly one font: Computer Modern.** `fontCache: 'none'` changes
caching, not the face, and alternative maths fonts only arrive in MathJax v4 — which research §9
already flags as "a ticket, not a bump" (ES6-module-first, load-order-sensitive). So the maths is
a **fixed, light, high-contrast transitional serif**, and the body face is the only side of the
pairing that can move.

## Licensing and privacy

Every family is declared through `next/font/google`, which downloads the files at build time and
serves them from this origin. No runtime request leaves the browser, so the CSP is untouched and
#61's Datenschutzerklärung problem doesn't get worse. Anything rendered here is genuinely
shippable — a face that could only be served from a vendor CDN is disqualified by the ticket
regardless of how it looks.

Measured latin payload per family, as actually downloaded by the page:

| Family | KB |
| --- | --- |
| Geist (variable) | 57 |
| Geist Mono (variable) | 45 |
| IBM Plex Sans (4 static weights) | 157 |
| IBM Plex Serif (400/600 + italic) | 62 |
| IBM Plex Mono (400/500) | 20 |
| Literata (variable, roman + italic) | 123 |
| Schibsted Grotesk (variable) | 46 |

Per system that is roughly A ≈ 102 KB, B ≈ 239 KB, C ≈ 225 KB, D ≈ 66 KB, E ≈ 164 KB — upper bounds, since
Plex's weight count is a choice and `next/font` splits by unicode-range so a German reader pulls
only the subsets they need.

## Screenshots

[`shots/`](shots/) — the document at each system, the pairing close-up for the two serifs, the
chrome for B and D, and one full page.
