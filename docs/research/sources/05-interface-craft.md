# Interface craft for Dokum — motion, perceived performance, maths readability, accessibility

Primary-source research, mapped onto this repository's actual architecture.
Date of research: 2026-08-15. Branch read: `feat/editor-fixes-106-110` @ `42966f6`.

---

## Part A — Repo reality (read first; everything below is constrained by this)

### A.1 Stack and versions (verbatim from `package.json`)

| Package | Pinned version | Note |
|---|---|---|
| `next` | `^16.1.6` | App Router; Next 16 renamed `middleware` → `proxy` (`src/proxy.ts`) |
| `react` / `react-dom` | `19.2.3` (exact) | Server Components; **stable channel**, not canary |
| `typescript` | `^5` | strict |
| `tailwindcss` | `^4` + `@tailwindcss/postcss` | **CSS-first config — there is no `tailwind.config.*` file in the repo** |
| `mathjax` | `3.2.2` (exact) | bundled, code-split |
| `html2canvas` | `1.4.1` (exact) | editor PNG export |
| `zod` | `^4.4.1`, `stripe` `^22.1.1`, `@supabase/ssr` `^0.8.0` | |
| `vitest` | `^4.1.9` (dev), `jsdom` `^29.1.1` (dev) | no component/E2E seam |

**There is no animation library.** No Framer Motion / Motion, no GSAP, no `tailwindcss-animate`, no `react-spring`. Every animation in the product today is hand-written CSS.

Fonts: `next/font/google` (`Geist`, `Geist_Mono`) self-hosted at build time (`src/app/layout.tsx:7-15`). But `src/app/globals.css:39` sets `body { font-family: Arial, Helvetica, sans-serif; }` — **the Geist variables are declared in `@theme inline` and applied to `<body>` as CSS variables, yet the `body` rule hard-codes Arial after them.** The site is very likely rendering in Arial, not Geist. Worth confirming in a browser; it is a one-line fix either way.

### A.2 The CSP — the hard boundary on anything added

`next.config.ts:43-55` emits, on every route (`source: '/(.*)'`):

```
default-src 'self'
script-src 'self' 'unsafe-inline' https://js.stripe.com          (+ 'unsafe-eval' 'wasm-unsafe-eval' in DEV ONLY)
style-src  'self' 'unsafe-inline'
connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com <NEXT_PUBLIC_SUPABASE_URL>
font-src   'self'
img-src    'self' data: blob: https://*.supabase.co
frame-src  https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com
frame-ancestors 'none'; object-src 'none'; base-uri 'self'
form-action 'self' https://checkout.stripe.com
```

Consequences for this slice:
- **No CDN for anything** — no script, no font, no stylesheet, no image host beyond Supabase. A library must be an npm dependency bundled from `'self'`.
- **No `eval` / `new Function` in production.** `'unsafe-eval'` is dev-only (`isDev` guard, line 39-41). Any animation library that compiles easing strings or keyframes via `new Function` is out.
- `style-src 'unsafe-inline'` **is** present, so inline `style` attributes and injected `<style>` blocks work — which is what CSS-in-JS animation libraries and the Web Animations API need. WAAPI needs neither.
- `img-src` has no `https:` wildcard — so no third-party image/lottie asset host.

### A.3 What animation exists today (complete inventory)

`src/app/globals.css:20-34` — the entire global motion layer:
```css
@keyframes slide-up { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform: translateY(0) } }
.animate-slide-up { animation: slide-up 0.65s ease-out both; }
.btn-brand { transition: box-shadow 0.15s ease, background-color 0.15s ease; }
```

Applied at:
- `src/components/kurse/KursCard.tsx:17` and `src/components/kurse/UnitCard.tsx:15` — `… transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[…] animate-slide-up`
- `src/app/admin/page.tsx:52` — same `animate-slide-up` on the 4-card admin grid
- `src/components/UnitDetailClient.tsx:86` — accordion: `grid transition-[grid-template-rows] duration-300 ease-in-out`
- `src/components/UnitDetailClient.tsx:73` — chevron `transition-transform duration-150`
- `src/components/documents/interactive-document.css:202` — `.student-input { transition: border-color .12s ease, box-shadow .12s ease }`
- `src/components/documents/interactive-document.css:261` — `.doc-link { transition: background-color .12s ease }`
- `src/app/admin/editor/editor.css` — 4× `transition: opacity/filter 0.1s`
- Skeletons: Tailwind `animate-pulse` in `src/app/loading.tsx`, `src/app/kurse/[kursId]/loading.tsx`, `src/app/kurse/[kursId]/units/[unitId]/loading.tsx`, `src/app/admin/loading.tsx`, `src/app/dokumente/[docId]/loading.tsx`, `src/components/documents/DocumentArticle.tsx:58-66` (`DocumentArticleSkeleton`)

Four concrete defects visible in that inventory, each substantiated in Part B:
1. **`prefers-reduced-motion` appears nowhere in the repo.** Grep across `src/` for `prefers-reduced-motion` → 0 hits. (§B2.1, §B2.2)
2. **`.animate-slide-up` is 650 ms** — 1.6× the longest Material 3 duration token normally used for a component-level entrance, and it fires on *every card simultaneously* with no stagger. (§B1.1, §B1.4)
3. **`transition-all` on the cards** animates every animatable property including `border-color`, `box-shadow` and the `translateY` — `box-shadow` is a paint-triggering property. (§B3.3)
4. **`transition-[grid-template-rows]`** on the accordion animates a *layout* property every frame for 300 ms. (§B3.3)

### A.4 Student-facing viewer — the invariant that governs everything

`src/lib/editor/document-render.ts` owns the DOM under its host container. React mounts the host (`<div ref={hostRef} className="dokum-document" />`, `src/components/documents/InteractiveDocument.tsx:249`) and never reconciles inside it. Reasons, in code comments at `InteractiveDocument.tsx:83-97` and `:99-108`:

- Student-typed values live **only in that DOM**. No storage, no request, no state. Re-running the mount effect calls `renderDocumentJson` again and destroys everything typed.
- The effect deps are exactly `[snapshot, docId]`; `router` is deliberately reached through a ref (`routerRef`, lines 93-97) so a router identity change cannot re-run it.
- Because typed values are unpersisted, an in-app document link opens an **overlay** (`src/app/@modal/(.)dokumente/[docId]`) via parallel routing, which never unmounts the source page. `src/components/documents/DocumentOverlay.tsx` uses a native `<dialog>` + `showModal()` for the focus trap, Escape and inert background; every dismissal is `router.back()`.

**This is the single biggest constraint on any animation library.** Anything that requires React to own/reconcile the animated subtree is unusable inside `.dokum-document`. Only these are safe there:
- CSS declared in `interactive-document.css` (the renderer stamps classes/attributes; CSS animates them)
- WAAPI (`element.animate()`) called imperatively from `document-render.ts`
- a **view transition** initiated at navigation level, which snapshots the DOM rather than reconciling it

### A.5 Maths rendering

- `mathjax@3.2.2` exact, bundled. `src/lib/editor/mathjax-loader.ts` sets `window.MathJax` **before** `await import('mathjax/es5/tex-svg-full.js')` (that ordering is the whole point of the dynamic import; line 91).
- Config: `svg: { fontCache: 'none' }`, `startup: { typeset: false }`, `tex.packages: {'[+]': ['color']}`, `tex.formatError` throws so bad LaTeX lands in the German `.formula-error` box.
- **Output is SVG, not MathML and not CHTML.** `fontCache: 'none'` inlines glyph paths per formula — no follow-up requests, larger DOM.
- **The MathJax startup pipeline never runs.** Every call site uses `tex2svgPromise` directly (`InteractiveDocument.tsx:308`). Consequence documented at `src/app/globals.css:49-88`: MathJax's own `MJX-SVG-styles` sheet is never inserted, so the `<mjx-assistive-mml>` copy would render visibly — the repo reproduces MathJax's own hiding declarations verbatim in `globals.css:69-87`, plus `user-select: none` so copying a document doesn't yield every formula twice.
- Typesetting is **serialised through a promise queue** (`InteractiveDocument.tsx:113-123`) and each target remembers `dataset.typesetLatex` so a stale run does no work (lines 305-307).
- Mobile: `.render-target { overflow-x: auto; overflow-y: hidden }` and `svg { max-width: 100%; height: auto }` (`interactive-document.css:96-105`) — a wide derivation scrolls itself rather than widening the page.

### A.6 Visual layer — what a "design system" currently amounts to

`src/app/globals.css` is 88 lines. The whole token set is:
```css
:root { --background:#ffffff; --foreground:#171717; }
@theme inline { --color-background; --color-foreground; --font-sans; --font-mono; }
@theme { --color-brand:#db3627; --color-brand-dark:#a6281c; }
```
- **No dark mode.** Zero `dark:` utilities in `src/`, zero `prefers-color-scheme` rules. Body is hard-set light: `bg-gray-50 text-gray-900` (`layout.tsx:43`), document surfaces `bg-[#fffdf8]`.
- **No spacing / radius / elevation / duration tokens.** Shadows are one-off arbitrary values, e.g. `shadow-[0_8px_20px_rgb(0_0_0_/_0.04)]` (`KursCard.tsx:17`).
- **Two disconnected brand colours.** Global brand is `#db3627` (Dokum red). But `interactive-document.css` falls back to `var(--brand, #00338d)` — a **blue** — for `h1`, `h2` and the formula-block accent bar (lines 29, 36, 89). `--brand` is not defined anywhere in `src/app/globals.css`, so the student document renders **blue** headings inside a red-branded app.
- Document typography: `.dokum-document { font-size: 17px; line-height: 1.55 }`, `p`/`li` `line-height: 1.65`, dropping to `16px` under 640px (`interactive-document.css:16-24, 46-49, 328-331`).
- **Measure**: `src/app/dokumente/[docId]/page.tsx:41` → `mx-auto max-w-5xl px-8 py-10 sm:px-12 lg:px-16`. 64rem − 2×4rem = **896 px of text at 17 px** ≈ **100–110 characters per line**. See §B5.1.
- Sticky header: `src/components/layout/Navbar.tsx:23` → `sticky top-0 z-50 bg-[#fffdf8]/95 backdrop-blur-sm`; anchors compensate with `scroll-margin-top: 4.5rem` (`interactive-document.css:325`).
- Target size is already handled deliberately: `.doc-link` gets `padding: 3px 7px` explicitly "so the chip clears 24px tall — WCAG 2.2 AA 2.5.8" (`interactive-document.css:245-247`), and `.student-input` gets `min-height: 44px` under 640px citing the platform 44 px guideline (lines 339-349).

---

## Part B — Researched claims

Format: **Claim / number → Source → Confidence → What it means here.**

---

### B1. Motion specifics

#### B1.1 — Material Design 3 duration tokens (all 16)

**Claim.** M3 defines exactly 16 duration tokens:

| Token | ms | Token | ms | Token | ms | Token | ms |
|---|---|---|---|---|---|---|---|
| `short1` | 50 | `medium1` | 250 | `long1` | 450 | `extraLong1` | 700 |
| `short2` | 100 | `medium2` | 300 | `long2` | 500 | `extraLong2` | 800 |
| `short3` | 150 | `medium3` | 350 | `long3` | 550 | `extraLong3` | 900 |
| `short4` | 200 | `medium4` | 400 | `long4` | 600 | `extraLong4` | 1000 |

**Source.** `material-foundation/material-tokens`, `json/motion.json` (Google's own token repository, the machine-readable form of m3.material.io/styles/motion/easing-and-duration/tokens-specs) — https://github.com/material-foundation/material-tokens/blob/json/json/motion.json. Cross-checked against Google's `material-components-android` theming doc, https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md, which lists the identical 16 values.

**Confidence.** High. Two independent Google-owned repos agree exactly. (m3.material.io itself is client-rendered and could not be fetched directly; the token repo is the same data.)

**For this repo.** `.animate-slide-up` at **650 ms** sits between `long4` (600) and `extraLong1` (700) — the band M3 reserves for full-screen / large-area transitions. It is being used for a card fading up 12 px. That is 3× too long by M3's own scale; `medium2`/`medium3` (300/350 ms) is the right band. Replace `0.65s` in `globals.css:26`.

#### B1.2 — Material Design 3 easing tokens

**Claim.**

| Token | cubic-bezier |
|---|---|
| `linear` | `0, 0, 1, 1` |
| `standard` | `0.2, 0, 0, 1` |
| `standard.accelerate` | `0.3, 0, 1, 1` |
| `standard.decelerate` | `0, 0, 0, 1` |
| `emphasized.accelerate` | `0.3, 0, 0.8, 0.15` |
| `emphasized.decelerate` | `0.05, 0.7, 0.1, 1` |
| `legacy` (= M2 standard) | `0.4, 0, 0.2, 1` |
| `legacy.accelerate` | `0.4, 0, 1, 1` |
| `legacy.decelerate` | `0, 0, 0.2, 1` |

**The plain `emphasized` easing is NOT expressible as a single `cubic-bezier()`.** Google ships it as a two-segment path: `M 0,0 C 0.05,0 0.133333,0.06 0.166666,0.4 C 0.208333,0.82 0.25,1 1,1`.

**Source.** Same two repos as B1.1; the path form is quoted in `material-components-android/docs/theming/Motion.md` as `?attr/motionEasingEmphasizedInterpolator`.

**Confidence.** High for the cubic-beziers. High that `emphasized` is a path, not a bezier — it is stated as such in Google's own Android doc.

**For this repo.** In plain CSS you cannot use `emphasized` directly. Use `standard` (`cubic-bezier(.2,0,0,1)`) as the general-purpose curve, `standard.decelerate` (`cubic-bezier(0,0,0,1)`) for things entering, `standard.accelerate` (`cubic-bezier(.3,0,1,1)`) for things leaving. The current code uses bare `ease-out` (`globals.css:26`) and `ease` / `ease-in-out` — Tailwind's `ease-out` is `cubic-bezier(0,0,.2,1)`, which is M3's *legacy* decelerate, not the current one.

#### B1.3 — Apple HIG on motion and Reduce Motion

**Claim.** Apple's guidance: make motion triggers optional; the vestibular system in the inner ear measures self-motion, and "certain types of motion, such as scaling, spinning, or peripheral motion, cause dizziness or nausea for people with motion sensitivity"; Reduce Motion exists "to support users with extreme motion sensitivity, who may experience negative side effects, such as nausea, dizziness, headaches, or distraction." Best practices include providing a sense of stability, being gentle with camera motion, and avoiding oscillations — with "an oscillation-free alternative through the Reduce Motion accessibility setting." Apple now also publishes formal **Reduced Motion evaluation criteria** for App Store Connect: an app may declare Reduced Motion support only once it "no longer displays problematic motion triggers to users whose setting indicates a need or preference for reduced motion."

**Source.** developer.apple.com HIG *Motion* (https://developer.apple.com/design/human-interface-guidelines/motion) and *Accessibility* pages, plus App Store Connect Help, *Reduced Motion evaluation criteria* (https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/). Apple HIG pages are client-rendered; these are search-surfaced quotations from those Apple pages rather than a full-page fetch.

**Confidence.** Medium-high on wording (could not fetch the pages' full DOM — Apple serves them as a JS shell and the DocC JSON endpoint 404s), high on substance: identical content is corroborated by W3C's SC 2.3.3 Understanding doc and MDN.

**For this repo.** Apple does **not** publish numeric duration tokens the way Material does — HIG's motion guidance is qualitative. So the numbers in the proposal table come from Material + the perception literature; Apple contributes the *reduce-motion obligation* and the "scaling / spinning / peripheral motion" trigger list. Nothing in Dokum scales or spins today; the 12 px translate in `slide-up` is well inside the safe zone, but `animate-pulse` on skeletons is an infinite oscillation of `opacity` — see §B2.2.

#### B1.4 — Human response-time thresholds: the real citations

**Claim (Nielsen's three limits).** 0.1 s — "the limit for having the user feel that the system is reacting instantaneously, meaning that no special feedback is necessary except to display the result." 1.0 s — the limit for the user's flow of thought to stay uninterrupted; "the user will notice the delay… but the user does lose the feeling of operating directly on the data." 10 s — the limit for keeping attention; beyond it, "users will want to perform other tasks while waiting" and need a percent-done indicator.

**Source.** Nielsen, J., *Response Times: The 3 Important Limits* (NN/g, 1993/updated) — https://www.nngroup.com/articles/response-times-3-important-limits/. Nielsen explicitly derives them from **Miller, R. B. (1968), "Response time in man-computer conversational transactions," Proc. AFIPS Fall Joint Computer Conference Vol. 33, 267–277**, and **Card, S. K., Robertson, G. G., & Mackinlay, J. D. (1991), "The information visualizer: An information workspace," Proc. ACM CHI'91, 181–188**.

**Confidence.** High. Nielsen names both citations on the page.

**Claim (Doherty threshold, 400 ms).** *The Economic Value of Rapid Response Time*, Walter J. Doherty (IBM T. J. Watson Research Center) and Ahrvind J. Thadani (IBM San Jose), **IBM, November 1982, 12 pages**, IBM document number GE20-0752-0. The finding popularly reduced to "the Doherty threshold": productivity rises sharply — non-linearly — as system response time drops below ~400 ms, well past the 2-second figure then treated as adequate.

**Source.** Computer History Museum catalogue record 102751398 (accession X6915.2014) — https://www.computerhistory.org/collections/catalog/102751398 — confirms publisher IBM, November 1982, 12 pp. Author attribution and the 400 ms figure come from secondary reproductions of the paper (the full text is not on a primary host).

**Confidence.** Medium-high. Bibliographic record verified at CHM; **the exact "400 ms" number I could not verify against the paper's own text** — CHM's record does not include the body, and every source carrying the number is secondary. Note also that the widely repeated attribution to "IBM Systems Journal" appears to be wrong: CHM catalogues it as an IBM corporate publication. Flag this if it is ever quoted in a customer-facing document.

**For this repo.** These are the numbers that justify the token scale: anything the student initiates should show its first visual change well under 100 ms (INP's territory, §B3.1); any transition that *delays* content should be ≤ 400 ms end-to-end. The overlay open in `DocumentOverlay.tsx` is already designed to this rule without saying so — `DEVELOPER_OVERVIEW.md` documents that the dialog shell renders **outside** the Suspense boundary precisely so it appears before the document is loaded.

#### B1.5 — Is there real evidence for a specific animation duration?

**Honest answer: mostly no. The 200–500 ms band is convention derived from perception thresholds, not from an experiment that optimised duration.**

- What *is* evidence: the perception limits in B1.4 (Miller 1968, Card 1991) and the Model Human Processor's ~230 ms perceptual cycle. Those bound the range from both ends — under ~100 ms a transition is not perceived as motion at all, over ~1 s it reads as delay.
- What is convention: the specific 200/300/500 ms figures. Material 3 publishes them as *design tokens* with the rationale "duration should increase as the area/traversal of an animation increases" (material-components-android `Motion.md`) — a rule of proportion, not an optimum from a study.
- Academic work exists but does not deliver a single optimal number. Relevant primary papers: Mejtoft et al. and, on duration specifically, **"User perception of animation fluency: The effect of time duration in different phases of animated transitions during application usage," Int. J. Human-Computer Studies vol. 186 (2024), doi:10.1016/j.ijhcs.2024.103257**; and **"Perceived User Experience of Animated Transitions in Mobile User Interfaces," CHI'16 Extended Abstracts, doi:10.1145/2851581.2892489**. These study *perceived fluency and hedonic quality* across styles and phases, not a global optimum duration.

**Confidence.** High that the honest characterisation is "bounded by evidence, specified by convention." Medium on the detail of the two papers' findings (I have their titles/venues/DOIs, not their full results).

**For this repo.** Do not present the token table below as "research-backed optimal durations." Present it as: *Material 3's published scale, clipped to the perceptual bounds Miller/Card establish.* That is defensible; "studies show 300 ms is optimal" is not.

---

### B2. Reduced motion — non-negotiable, with the normative text

#### B2.1 — `prefers-reduced-motion`, normative definition

**Claim (verbatim).** Media Queries Level 5 defines the feature with values `no-preference | reduce`, where **`reduce`**:

> "Indicates that the user has expressed the desire to minimize the amount of motion or animation, preferably to the point where all non-essential motions are removed."

and notes:

> "This media feature applies to animations created using CSS Animations, CSS Transitions, and the Web Animations API. It does not apply to other kinds of motion, such as the movement caused by scrolling."

**Source.** W3C, *Media Queries Level 5*, §prefers-reduced-motion — https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion

**Claim (usage).** `@media (prefers-reduced-motion)` is equivalent to `@media (prefers-reduced-motion: reduce)`, because `reduce` evaluates true and `no-preference` evaluates false. MDN's recommended pattern is **full motion as the default, overridden inside `(prefers-reduced-motion: reduce)`** — and to *replace* rather than merely delete motion where the motion carried meaning ("tone down the animation to avoid vestibular motion triggers"). MDN attributes the risk to **vestibular motion disorders**, naming "scaling or panning large objects" as triggers.

**Source.** MDN (de-facto reference, not a standard) — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

**Confidence.** High (both quoted verbatim from the fetched pages).

**For this repo.** Zero hits for `prefers-reduced-motion` across `src/`. Every one of the ~12 animated declarations in §A.3 is currently unconditional. The fix is one block appended to `src/app/globals.css` plus per-surface overrides in `interactive-document.css` and `editor.css`. Note the spec's exclusion: **`scrollIntoView` in `InteractiveDocument.tsx:135` and `:190` is not covered** by the media feature — but it *is* covered if you ever set `scroll-behavior: smooth` (which the repo does not, and should not without a guard).

#### B2.2 — WCAG: which criterion, which level

**Claim.** Two distinct criteria, at two different levels — do not conflate them:

- **SC 2.3.3 Animation from Interactions — Level AAA.**
  > "Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed."

- **SC 2.2.2 Pause, Stop, Hide — Level A.**
  > "For moving, blinking, scrolling information that starts automatically, lasts more than five seconds, and is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it."

**Source.** W3C, *Web Content Accessibility Guidelines (WCAG) 2.2* — https://www.w3.org/TR/WCAG22/

**Supporting normative context.** The Understanding doc for 2.3.3 (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) defines *motion animation* as "addition of steps between conditions to create the illusion of movement or to give a sense of a smooth transition," and **explicitly excludes** colour changes, blurring, and opacity adjustments that do not alter perceived size, shape or position. It states: "The impact of animation on people with vestibular disorders can be quite severe. Triggered reactions include nausea, migraine headaches, and potentially needing bed rest to recover." It lists the CSS `prefers-reduced-motion` query as a **sufficient technique**.

The Understanding doc for 2.2.2 (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) gives the intent as avoiding distraction, and notes that "certain groups, particularly those with attention deficit disorders, find blinking content distracting."

**Confidence.** High — quoted from w3.org.

**For this repo — this is the sharpest finding in the whole document:**

1. **`animate-slide-up` is squarely SC 2.3.3 territory** (a 12 px `translateY` = a change in perceived position, triggered by navigation). AAA, so not a conformance blocker at AA — but `prefers-reduced-motion` is the named sufficient technique and costs three lines.
2. **`transition-all` on cards including `hover:-translate-y-0.5`** — same category, and it fires on every hover.
3. **`animate-pulse` skeletons are the Level A exposure.** Tailwind's `animate-pulse` is an *infinite* opacity oscillation. Read literally: it starts automatically, is presented in parallel with other content, and if a Supabase read is slow it will run for more than five seconds with no pause mechanism → **SC 2.2.2, Level A**. The counter-argument is strong: the Understanding doc for 2.3.3 excludes pure opacity change from "motion animation," and 2.2.2's own examples are tickers and marquees, not loading placeholders. But the safe reading is the one to build to. Two mitigations, both cheap: (a) stop the pulse under `prefers-reduced-motion: reduce`, leaving a static grey block; (b) cap the animation with `animation-iteration-count` so it settles rather than oscillating forever. **This applies to six files** — `src/app/loading.tsx`, `src/app/admin/loading.tsx`, `src/app/kurse/[kursId]/loading.tsx`, `src/app/kurse/[kursId]/units/[unitId]/loading.tsx`, `src/app/dokumente/[docId]/loading.tsx`, `src/components/documents/DocumentArticle.tsx`.

#### B2.3 — Vestibular disorders: the primary statement

**Claim.** W3C/WAI's own normative-adjacent statement is the one quoted above from Understanding SC 2.3.3 ("nausea, migraine headaches, and potentially needing bed rest to recover"). Apple's HIG independently names the mechanism: the vestibular system measures self-motion, and scaling / spinning / peripheral motion trigger the mismatch.

**Source.** https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html ; developer.apple.com HIG *Motion*.

**Confidence.** High for the W3C quotation. **Low-medium on the underlying clinical literature** — I did not reach a primary experimental paper on parallax-induced visually induced motion sickness. If that citation is needed, the field term to search is *visually induced motion sickness (VIMS)*; W3C's statement is sufficient authority for a product decision.

**For this repo.** Nothing in Dokum currently does parallax, large-area motion, or spin. The risk here is **prospective** — it is a reason not to add hero parallax or page-scale slide transitions later without a reduce-motion path built in from the start.

#### B2.4 — German / EU legal exposure: BFSG, BITV 2.0, EAA

This is a real compliance question and the answer materially affects the product. Careful reading:

**Claim 1 — the EAA covers e-commerce services, from 28 June 2025.**
Directive (EU) 2019/882 Art. 2(2)(f) brings **e-commerce services** into scope, defined in Art. 3 as "services provided at a distance, through websites and mobile device-based services by electronic means and at the individual request of a consumer with a view to concluding a consumer contract." Art. 31 sets the application date: services provided **after 28 June 2025**.
**Source.** EUR-Lex, CELEX 32019L0882 — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0882
**Confidence.** High.

**Claim 2 — Germany transposed it as the BFSG, same date, and the definition tracks the directive.**
`§1 Abs. 3 Nr. 5 BFSG` covers "Dienstleistungen im elektronischen Geschäftsverkehr." `§2 Nr. 26` defines them as "digitale Dienste nach § 1 Absatz 4 Nummer 1 des Digitale-Dienste-Gesetzes, die über Webseiten und über Anwendungen auf Mobilgeräten angeboten werden und elektronisch und auf individuelle Anfrage eines Verbrauchers im Hinblick auf den Abschluss eines Verbrauchervertrags erbracht werden." `§3 Abs. 3` exempts **Kleinstunternehmen** (microenterprises) from the requirements *for services*. `§38` sets the general application date of **28 June 2025**.
**Source.** gesetze-im-internet.de, BFSG — https://www.gesetze-im-internet.de/bfsg/BJNR297010021.html
**Confidence.** High for the section numbers and the date, as fetched.

**Claim 3 — BITV 2.0 is almost certainly NOT the applicable instrument here.**
BITV 2.0's `§2` scopes it to "Angebote, Anwendungen und Dienste **öffentlicher Stellen**" — websites, mobile applications and electronically supported administrative processes of *public bodies*. It presumes conformance where the offering complies with harmonised standards published in the EU Official Journal (`§3 Abs. 2`) — in practice **EN 301 549**, which incorporates WCAG 2.1 Level AA (BITV 2.0 does not name the standard inline; it delegates to the published harmonised standard).
**Source.** gesetze-im-internet.de, BITV 2.0 — https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html
**Confidence.** High that it targets public bodies. Medium on the exact EN 301 549 / WCAG version, because BITV 2.0 delegates rather than names.

**Synthesis and the uncertainty to flag.**
Dokum sells access to course material to consumers through a website, concluding a consumer contract via Stripe Checkout (`/api/checkout/[unitId]`, `entitlements` per Unit, flat €3). On the plain text of `§2 Nr. 26 BFSG` that **is** a "Dienstleistung im elektronischen Geschäftsverkehr," and the BFSG has applied since **28 June 2025** — i.e. it is already in force as of today.

Three genuine uncertainties, all of which need a lawyer, not an engineer:
1. **Kleinstunternehmen exemption (`§3 Abs. 3 BFSG`).** <10 employees *and* ≤ €2 m annual turnover/balance sheet total. If Dokum qualifies today, the service-side obligations do not bite — but the exemption evaporates on growth, and it is a bad thing to build a product around.
2. **Scope boundary: the *transaction* vs. the *content*.** Whether the BFSG reaches only the purchase flow (checkout, account, invoices) or the whole learning surface including the interactive documents is exactly the kind of line that is argued rather than read off the statute. The directive's own recitals in the fetched text do not mention e-learning or education specifically — which cuts both ways.
3. **What "accessible" means concretely.** The BFSG's technical anchor is the harmonised standard (EN 301 549 → WCAG 2.1 AA). **SC 2.3.3 is AAA and therefore not required by that route; SC 2.2.2 is Level A and is.** So the skeleton-pulse question in §B2.2 is the one with legal weight, and the card slide-up is the one that is merely good practice.

**Recommendation.** Treat **WCAG 2.2 Level AA** as the build target (it supersets 2.1 AA, and the repo already cites 2.5.8 in `interactive-document.css:245`), and implement `prefers-reduced-motion` anyway — it is the cheapest AAA criterion in the entire guideline set and Apple's App Store now evaluates apps on it.

---

### B3. Performance is perceived quality

#### B3.1 — INP thresholds

**Claim.** Interaction to Next Paint, measured at the **75th percentile** of page loads, segmented by mobile and desktop:
- **Good:** ≤ **200 ms**
- **Needs improvement:** > 200 ms and ≤ **500 ms**
- **Poor:** > **500 ms**

Only three interaction types are measured: mouse click, touchscreen tap, key press on a physical or on-screen keyboard. INP reports approximately the longest interaction of the visit, discarding "one highest interaction for every 50 interactions."

**Source.** web.dev (first-party Chrome), *Interaction to Next Paint (INP)* — https://web.dev/articles/inp

**Confidence.** High.

**For this repo — this is the metric Dokum is most exposed on, and the exposure is structural.** Every keystroke in a `.student-input` triggers the renderer's full recompute (`document-render.ts` → field resolver → `onRecompute` → typeset). Three things determine whether that lands inside 200 ms:
1. `renderDocumentJson`'s recompute path is synchronous DOM work on the main thread.
2. MathJax typesetting is queued (`InteractiveDocument.tsx:113-123`), so it does **not** block the paint of the keystroke itself — good, that queue is already the right shape.
3. `dataset.typesetLatex` short-circuits unchanged formulas (`:306`) — also right.
The measurement to actually take: hold a key down in a document with ~20 formulas on a mid-range Android and read INP. web.dev's `optimize-inp` guidance (https://web.dev/articles/optimize-inp) is the applicable playbook — "break up the work in event callbacks into separate tasks," and "limit what gets run to just the logic required to apply visual updates for the next frame."

#### B3.2 — CLS thresholds

**Claim.** Cumulative Layout Shift at the 75th percentile: **good ≤ 0.1**, needs improvement 0.1–0.25, **poor > 0.25**. `layout shift score = impact fraction × distance fraction`. CLS reports the largest *session window*: shifts less than 1 s apart, window capped at 5 s total.

**Source.** web.dev, *Cumulative Layout Shift (CLS)* — https://web.dev/articles/cls

**Confidence.** High.

**For this repo — there is a specific, known CLS generator: MathJax.** The renderer writes `.render-target` elements containing raw LaTeX text, then `typesetFormulas` replaces each with an SVG of a *different height* (`InteractiveDocument.tsx:308-311`). The code already acknowledges this: the comment at `:126-128` says scrolling must wait for the first typeset "a formula changes height when its source is replaced by SVG." That is the same phenomenon CLS measures. A document with many block formulas will shift repeatedly during the typeset queue.

Mitigations that fit the architecture without breaking the "React must not reconcile" rule:
- Reserve height on `.render-target` before typeset (`min-height` proportional to the formula, or `aspect-ratio` once known) — a pure CSS change in `interactive-document.css`.
- Persist the typeset SVG's height into the published snapshot at publish time (`editor-publish.ts` already rasterises the document; the geometry is available there) and stamp it as an inline `style` on the `.render-target` — the renderer then reserves exact space. Costs a schema field, so it is a v1.2 document-JSON decision, not a CSS tweak.
- The skeletons already reserve space correctly (`DocumentArticleSkeleton` uses fixed `h-64`) — that part is fine.

#### B3.3 — Only `transform` and `opacity` are cheap

**Claim.** Chrome's own guidance: **"restrict animations to `opacity` and `transform` to keep animations on the compositing stage of the rendering path."** and **"Avoid any property that triggers layout or paint unless it's absolutely necessary."** web.dev demonstrates the gap concretely: animating with `transform` drops ~1 % of frames where animating `top`/`left` drops ~50 %. `will-change` should be used sparingly — "only if you notice graphics issues" — and removed once the animation completes, because layer creation itself costs.

**Source.** web.dev (first-party Chrome), *Animations guide* — https://web.dev/articles/animations-guide

**Confidence.** High (quoted).

**Related — RAIL.** Still published, but explicitly demoted: the page carries the note that "Core Web Vitals … is the recommended approach for defining performance goals over RAIL, and has different thresholds than those detailed here." Its numbers remain useful as frame budgets: response within **100 ms**, **10 ms per animation frame**, idle work in chunks of **50 ms or less**, interactive in 5 s on mid-range mobile.
**Source.** https://web.dev/articles/rail — **Confidence.** High.

**For this repo — three concrete violations:**
1. `KursCard.tsx:17` / `UnitCard.tsx:15`: `transition-all` + `hover:shadow-[0_14px_30px_…]`. `transition-all` sweeps every animatable property; **`box-shadow` is paint-bound**, and a 30 px blur radius on a grid of cards is exactly the "effects involving blur (shadows) are significantly more expensive" case web.dev names. Fix: replace `transition-all` with `transition-[transform,border-color] duration-200`, and get the elevation change from an absolutely-positioned pseudo-element whose **`opacity`** animates instead of its `box-shadow`.
2. `UnitDetailClient.tsx:86`: `transition-[grid-template-rows] duration-300`. This is the well-known "animate a grid row from `0fr` to `1fr`" trick — it is genuinely the cleanest way to animate to auto-height, but it runs **layout every frame for 300 ms**. Acceptable for one accordion section; measure it if a Unit ever has many Aufgaben open at once. The alternative that stays composited is animating `transform: scaleY()` on a wrapper, which distorts text — so keeping the grid trick and shortening it to 200 ms is the pragmatic call.
3. `globals.css:30`: `.btn-brand { transition: box-shadow .15s ease, background-color .15s ease }`. Both are paint-bound. At 150 ms on a single button this is fine; noting it only so the pattern is not copied into a list.

---

### B4. Maths rendering and accessibility

#### B4.1 — MathJax's own accessibility story, v3 vs v4

**Claim.** In **v3**, the `a11y/assistive-mml` component "embedded a MathML representation of each expression that was visually hidden, but available to screen readers" — and MathJax's docs caution that "the quality of MathML support in screenreaders varies greatly." In v3 the accessibility *tools* were **off** by default and assistive MathML was **on**; users had to enable the explorer by hand. In **v4**, the approach changed: a `speech` component "generates speech strings from the math expressions in the page and inserts them via `aria-label` and `aria-braillelabel` attributes," and an `explorer` component lets a user "descend into the expression and read it term by term." Both "are included and enabled in all the combined components so that your pages should be accessible to users with screen or Braille readers automatically."

**Source.** docs.mathjax.org — https://docs.mathjax.org/en/latest/basic/accessibility.html and https://docs.mathjax.org/en/latest/options/accessibility.html (the latter confirms: "In version 3, the accessibility tools were off and the assistive MathML was on by default"). MathJax **v4 is released**; https://docs.mathjax.org/en/latest/upgrading/v3.html documents the v3→v4 migration (ES6 modules, promise-based API, `textmacros` no longer default).

**Confidence.** High on the v3/v4 default difference and the mechanism. Medium on v4's exact current patch version.

**For this repo — the situation is subtle and mostly already handled.**
- Dokum pins `mathjax@3.2.2` and renders via `tex2svgPromise`. The assistive MathML copy **is** produced (that is precisely why `globals.css:69-87` exists — the repo had to reproduce MathJax's own hiding CSS because the startup pipeline that normally injects it never runs). So screen readers *do* get MathML. Good.
- What Dokum does **not** get: the explorer, speech strings, and the contextual menu (`ui/menu` is not loaded). So a screen-reader user gets whatever their AT makes of raw MathML — which MathJax itself warns "varies greatly."
- **The upgrade path is real and lands directly on this weakness.** v4's `speech` component writes `aria-label`, which does not depend on the screen reader understanding MathML at all. But: v4 is ES6-module-first and promise-API-different; `mathjax-loader.ts` imports `mathjax/es5/tex-svg-full.js` and depends on the exact `window.MathJax` assignment-before-import ordering, and the `globals.css` assistive-mml hack would need re-deriving. **This is a ticket, not a bump.** Also verify the CSP survives: v4 must still be bundleable from `'self'` with no runtime fetch (v3's `fontCache: 'none'` is what guarantees that today, per the loader's own comment at lines 8-9).
- Also worth noting: because `startup.typeset: false`, MathJax's zoom/menu features are unavailable. There is no double-click-to-zoom on a formula.

#### B4.2 — MathML Core status and browser support

**Claim.** **MathML Core is a W3C Candidate Recommendation Snapshot dated 24 June 2025**, not yet a Recommendation ("not expected to advance to Proposed Recommendation any earlier than 30 September 2025"). It is a deliberately reduced, browser-implementable subset of MathML 3, with detailed rendering rules based on TeX and OpenType; MathML 4 is the separate, larger spec.
MDN reports MathML as **"Baseline Widely available"** — "available across browsers since January 2023" (that date is Chrome 109's ship).

**Source.** https://www.w3.org/TR/mathml-core/ ; https://developer.mozilla.org/en-US/docs/Web/MathML (MDN as de-facto reference).

**Confidence.** High on the CR status and date. High on Baseline-widely-available. Medium on per-browser version numbers — MDN's compat table did not come through the fetch; the January 2023 Baseline date corresponds to Chrome/Edge 109, with Firefox and Safari having shipped earlier.

**For this repo.** MathML output is now a *viable* alternative to SVG — it would give native text scaling, native reflow, real selectable maths, and much smaller DOM than `fontCache: 'none'` inline SVG paths. **But do not switch.** Two blockers specific to Dokum:
1. **`html2canvas@1.4.1` rasterises the editor's PNG export** (`src/lib/editor/png-export.ts`, "SVG raster at 2×"). html2canvas has no MathML layout engine; MathML output would produce blank or broken formulas in the exported PNG — and that PNG is the **runtime fallback** every student sees when live rendering fails (`InteractiveDocument.tsx:55-60`). Breaking it breaks the safety net.
2. The published-document contract stores LaTeX, not layout, so the change is reversible — but the parity golden tests in `src/lib/editor/*.test.ts` are written against the reference editor's SVG behaviour.
The pragmatic position: **keep SVG output, and get accessibility from the assistive-MathML copy that already exists** — then revisit when moving to MathJax v4, where `aria-label` speech makes the question mostly moot.

#### B4.3 — Equations on a phone

**Claim.** There is no crisp standards-body number for "how to make an equation readable on a 360 px screen." The applicable normative constraints are WCAG **1.4.4 Resize Text** (AA, 200 % without loss of content or functionality) and **1.4.10 Reflow** (AA, content at 320 CSS px wide without two-dimensional scrolling — *with an explicit exception for content requiring two-dimensional layout for usage or meaning*, which is exactly what a wide equation is).

**Source.** W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/. MathJax's docs offer no responsive/overflow guidance of their own (confirmed: the accessibility options page covers menu and speech, not layout).

**Confidence.** High on the WCAG criteria and the reflow exception; high that MathJax publishes no numeric mobile guidance.

**For this repo — already solved, and solved in the way the exception contemplates.** `interactive-document.css:96-105` scopes horizontal scroll to `.render-target` only, so a dense derivation "scrolls itself" and never widens the page. `svg { max-width: 100%; height: auto }` handles the shrink case. `min-height: 44px` on `.student-input` under 640 px handles targets. The remaining gap is that a formula shrunk to `max-width: 100%` on a narrow phone can become *smaller than 16 px equivalent* with no way to enlarge it — the fix (a tap-to-zoom on `.render-target`) is a product decision, not a compliance one.

---

### B5. Reading environment

#### B5.1 — Line length (measure)

**Claim (evidence).** Dyson & Haselgrove (2001) compared six line lengths from 25 to 100 characters per line with 48 participants reading ~800-word passages: **55 characters per line produced the highest comprehension** — better than the 100 cpl condition — and was also read faster than short lines.
**Source.** Dyson, M. C. & Haselgrove, M. (2001), "The influence of reading speed and line length on the effectiveness of reading from screen," *International Journal of Human-Computer Studies* 54(4), 585–612 — https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586
**Confidence.** Medium-high. Title/venue/year confirmed; the 55-vs-100 finding is reported consistently across the citing literature, but I read it through secondary summaries rather than the paywalled paper.

**Claim (normative).** WCAG **SC 1.4.8 Visual Presentation (Level AAA)** requires, among other things: "Width is no more than **80 characters or glyphs** (40 if CJK)"; "Line spacing (leading) is at least **space-and-a-half** within paragraphs, and paragraph spacing is at least **1.5 times** larger than the line spacing"; text is not justified; text resizes to 200 % without horizontal scrolling.
**Source.** https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
**Confidence.** High (quoted).
**Honest caveat, from W3C's own Understanding doc:** the reasoning given for 80 is *functional*, not experimental — people with reading or vision disabilities "have trouble keeping their place and following the flow of text. Having a narrow block of text makes it easier for them to continue on to the next line." **W3C cites no study for the number 80.**

**Claim (convention).** The familiar "45–75 characters, 66 ideal" is Robert Bringhurst, *The Elements of Typographic Style* — craft authority, not evidence. Label it as such.

**For this repo — this is the highest-leverage readability fix available, and it is one class name.**
`src/app/dokumente/[docId]/page.tsx:41` gives the document ~**896 px** of text at 17 px ≈ **100–110 cpl**. That is above WCAG 1.4.8's 80-character AAA ceiling and roughly double Dyson & Haselgrove's best-performing condition. It is also the *only* long-form reading surface in the product.
- Change: constrain the prose column, not the page. `max-w-5xl` on the outer container is fine for the breadcrumb and images; the running text should be capped around **68–72ch**. Because `.dokum-document` owns the typography, the cleanest place is `interactive-document.css`: add `max-width: 70ch` to `.dokum-document p, .dokum-document li` (leaving `.formula-block` and `.image-block` full-width so a wide derivation keeps its room). At 17 px that lands ≈ 640–680 px.
- Line height already complies: `p`/`li` are `1.65`, above the 1.5 floor (`interactive-document.css:46-49`). The base `1.55` on `.dokum-document` also clears it.
- Paragraph spacing: `margin: 0.8em 0` on `p` = 1.6em between paragraphs. Line spacing is 1.65em, so paragraph spacing is **0.97× line spacing — below the "at least 1.5×" AAA requirement.** Raising `p` margin to `1.25em 0` (2.5em between paragraphs) would satisfy it.
- `DocumentArticle.tsx:42` already caps the description at `max-w-2xl` (42rem ≈ 672 px). The body should match that discipline.

#### B5.2 — Dark mode: the evidence is not what the internet says

**Claim.** For readers with normal vision, **positive polarity (dark text on light) generally wins**, and the picture only becomes nuanced at the edges:
- **Piepenbrock et al. (2013), *Ergonomics*** — young (18–33) and older (60–85) adults without eye disease, visual-acuity and proofreading tasks: light mode won across all dimensions, though older adults benefited less than younger.
- **Piepenbrock et al., *Human Factors*** — the advantage interacts with text size: "the smaller the font, the better it is for users to see the text in light mode."
- **Dobres et al. (2017), *Applied Ergonomics*** — glanceable reading: during daytime **no significant effect** of polarity; at night, light mode outperformed dark.
- **Legge et al. (1985), *Vision Research*** — 7 participants with cloudy ocular media (cataracts) read **faster in dark mode**; participants with central-vision impairments showed no polarity preference.
- **Aleman et al. (2018), *Scientific Reports*** — choroid thinning under light-mode reading, thickening under dark-mode, which the authors relate to myopia risk. A long-term physiological finding, not a legibility one.

**Source.** NN/g, *Dark Mode vs. Light Mode: Which Is Better?* — https://www.nngroup.com/articles/dark-mode/ — labelled **practitioner research** here; the five underlying papers are the primary sources and are named above with venue and year.

**Confidence.** High that these are the papers and roughly what they found (NN/g names them explicitly). Medium on effect sizes — I did not read the originals.

**For this repo.** Dokum has **no dark mode at all** (§A.6), and on this evidence that is a defensible default for a study product whose core surface is dense text and maths. The honest framing for a product decision: dark mode is a **preference and comfort feature** with a real accessibility case for a specific minority (cloudy ocular media, photophobia), not a legibility upgrade for the median user. If it is built, build it as `prefers-color-scheme` + an explicit toggle, and note the concrete cost here: **MathJax renders formulas as SVG with baked-in `currentColor`-independent fills in some cases, and `interactive-document.css` hard-codes ~20 hex colours** (pills `#fef3c7`/`#dbeafe`, chips `#eef2ff`/`#fffbeb`, error `#fee2e2`, gradients `#fbfdff→#f5f8fc`). Dark mode is a tokenisation project across `interactive-document.css` + `editor.css` + `globals.css`, not a class sweep.

#### B5.3 — Contrast: the numbers, and where APCA actually stands

**Claim.** **SC 1.4.3 Contrast (Minimum), Level AA:** "Text and images of text has a contrast ratio of at least **4.5:1**, except large text has at least **3:1**." **SC 1.4.6 Contrast (Enhanced), Level AAA:** at least **7:1**, large text **4.5:1**.
**Source.** https://www.w3.org/TR/WCAG22/ — **Confidence.** High (quoted).

**Claim (APCA status — be precise).** **WCAG 3.0 is a W3C Working Draft dated 3 March 2026** which states it needs "several years of work," that most guidelines are marked "Developing," and that "The final set of requirements in WCAG 3 will be different from what is in this draft." **The current WCAG 3 draft does not name APCA**; it refers only to an existing "contrast ratio test" with a placeholder. APCA is best described as the *candidate* visual-contrast method for WCAG 3, still under peer review in the AGWG's Visual Contrast of Text subgroup; APCA's own documentation states plainly that "WCAG 3 Compliant does not exist yet. Until WCAG 3 is an official recommendation there is no such thing."
**Source.** https://www.w3.org/TR/wcag-3.0/ ; w3c/wcag3 issue #29 "Contrast Research: APCA Peer Reviews + Defining a Visual Contrast Guideline" (https://github.com/w3c/wcag3/issues/29) ; https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup ; git.apcacontrast.com.
**Confidence.** High that WCAG 3 is years out and that APCA is not normative anywhere. High that the current draft does not name it (fetched and checked).

**For this repo.** Ship against **1.4.3 (4.5:1)**. Two colours to actually measure, both in `src/components/documents/interactive-document.css`:
- `.input-field` — `#92400e` on `#fef3c7`. Amber-800 on amber-100 is comfortably above 4.5:1; fine.
- `.doc-link-gone-note` — `#6b7280` (gray-500) on `#fffdf8`, **at `font-size: 0.85em` of 17 px ≈ 14.5 px**, so it is *not* "large text" and needs the full 4.5:1. Gray-500 on near-white is ≈ 4.6:1 — it passes, but with essentially no margin. Worth pinning with a measured value rather than leaving to chance.
- `.block-caption` `#374151` (gray-700) at `0.9em` — comfortable.
- The brand red `#db3627` on white is ≈ 4.0:1 — **below 4.5:1 for normal-size text.** Check every place it is used as *text* rather than as a background or border. `--color-brand` is used for borders and accents in most places, which is governed by 1.4.11 Non-text Contrast (3:1) and passes — but any red body text or red link label fails AA.

---

### B6. Navigation and interaction patterns (NN/g — practitioner research, labelled as such)

#### B6.1 — Skeleton screens vs spinners: the honest answer

**Claim.** The claim that skeleton screens feel faster rests on **one** cited study: **Mejtoft, T., Långström, A., & Söderström, U. (2018), "The effect of skeleton screens: Users' perception of speed and ease of navigation," Proc. 36th European Conference on Cognitive Ergonomics (ECCE'18), doi:10.1145/3232078.3232086.** Its reported direction is that skeleton screens are perceived as faster and easier to navigate than spinners.

**Honest caveats, which matter:**
- **NN/g's own article cites the study but reports no numbers, no effect size, and no significance test.** Its positive claims ("create the illusion that the page is gradually transitioning into its final format," "develop mental models") are presented as design principles, not findings.
- The study is a single ECCE short-paper with a small sample, not a replicated result.
- The evidence base is therefore **thin**. The defensible statement is: *skeleton screens communicate layout, which is a real and separate benefit from perceived speed; the perceived-speed advantage over spinners has one supporting study and should not be treated as settled.*

**Source.** https://www.nngroup.com/articles/skeleton-screens/ (practitioner) → the 2018 ECCE paper (primary).
**Confidence.** High on the citation. **Low on the strength of the underlying effect** — flagged deliberately.

**For this repo.** Dokum already uses skeletons everywhere (§A.3) and — more importantly — uses them *correctly*: `DocumentArticleSkeleton` mirrors the real layout's three bars in the real positions (`DocumentArticle.tsx:58-66`), and the loading files reserve the actual grid shape. That is the part with an independent justification (it prevents layout shift, §B3.2), regardless of what the perceived-speed literature says. **Do not add spinners.** The one change worth making is the reduce-motion / iteration-cap on `animate-pulse` from §B2.2.

#### B6.2 — Progress indicators: which one, when

**Claim.** NN/g's thresholds: **looped animation (spinner) for 2–10 s**; **percent-done progress bar for 10 s or more**; static indicators are never sufficient because "they do not offer enough information." Under ~1 s, show nothing. NN/g cites a University of Nebraska–Lincoln study finding users with animated progress bars reported higher satisfaction and were willing to wait roughly **3× longer** than those with no indicator.
**Source.** https://www.nngroup.com/articles/progress-indicators/ (practitioner research).
**Confidence.** Medium-high — the thresholds are quoted; the 3× figure comes via NN/g's summary rather than the original.

**For this repo.** These map onto Dokum's real waits: Stripe Checkout redirect (`/api/checkout/[unitId]`), the PNG export + publish path (`png-export.ts` → `editor-publish.ts`, which can approach the 4 MB body limit), and the backlink scan (`scanDocumentBacklinks` reads the whole catalogue). **The publish path is the one that plausibly exceeds 10 s** and currently has no percent-done affordance.

#### B6.3 — Breadcrumbs and tabs

**Claim (breadcrumbs).** NN/g has recommended breadcrumbs since 1995; the rules are: place at the top just below global navigation; `>` as separator (`/` acceptable); **the current page's crumb must not be a link** and must be visually differentiated. **NN/g cites no usage-rate or effectiveness study in this article** — it is prescriptive guidance.
**Source.** https://www.nngroup.com/articles/breadcrumbs/ — **Confidence.** High on the rules, high that no research numbers are given.

**Claim (tabs).** Use tabs when content has clear, few groupings of unequal importance and users do not need to compare across tabs; labels 1–2 words, mixed case not ALL CAPS; use **at least two visual indicators** for the selected tab (e.g. weight *and* underline); avoid overflow, because an overflowing tab bar "becomes a carousel" with reduced discoverability. **Again, prescriptive — no empirical study cited.**
**Source.** https://www.nngroup.com/articles/tabs-used-right/ — **Confidence.** High on the rules; explicitly not research.

**For this repo.**
- `DocumentArticle.tsx:35-37` renders the breadcrumb as `{kurs.title} · {unit.title} · {task.title}` — **plain text, no links, mid-dot separator.** Against NN/g's rules that is half-right: correct that the current page is not a link, but the *ancestors* should be. The route knows them (`surface.view` carries `kurs`, `unit`, `task`), and `constants.ts` already exports `kursUrl()` and `unitUrl()`. Making the first two crumbs links is a small, high-value change — and it matters more in the **overlay**, where the reader has "lost sight of the page underneath" (the component's own doc comment says exactly this).
- Tabs: `AdminSubpageNav.tsx` is the only tab bar, admin-only, 4 tabs. Within NN/g's limits.

---

### B7. Animation libraries for React 19 / Next.js 16 — what is actually viable here

#### B7.1 — Motion (motion.dev, formerly Framer Motion)

**Claim.** "A React animation library for building smooth, production-grade UI animations." Installed as `npm install motion`, imported from `motion/react`. Its **hybrid engine** "runs animations natively in the browser using the Web Animations API and ScrollTimeline for 120fps performance," falling back to JS only for spring physics, interruptible keyframes and gesture tracking. Motion's own docs give these bundle figures: **`motion` component 34 kb; `useAnimate` mini 2.3 kb (WAAPI-only, "the smallest animation library available for React"); `useAnimate` hybrid 17 kb; `m` component + `LazyMotion` "just under 4.6 kb for the initial render", with `domAnimation` +15 kb or `domMax` +25 kb loaded lazily.**
**Source.** https://motion.dev/docs/react-quick-start and https://motion.dev/docs/react-reduce-bundle-size (the library's own docs).
**Confidence.** High on the figures (quoted from motion.dev). Medium on React 19 compatibility — motion.dev's quick-start does not state a React version matrix; verify against the package's `peerDependencies` before adopting.

**CSP verdict:** **compatible.** Bundled from npm, served from `'self'`. WAAPI needs no `eval`. Motion's inline style writes are covered by the existing `style-src 'unsafe-inline'`. The jsDelivr CDN option in the docs is the one thing that would violate `script-src` — don't use it.

**Invariant verdict:** **must not be used inside `.dokum-document`.** Motion's React API works by React owning and reconciling the animated elements; `<motion.div>` inside the renderer's host would be exactly the reconciliation the architecture forbids (`InteractiveDocument.tsx:83-97`, `DEVELOPER_OVERVIEW.md` "React must not reconcile inside its container"). If Motion is ever adopted, it is for **chrome only** — cards, navbar, the overlay shell, admin UI — and even then `useAnimate` mini (2.3 kb) or plain WAAPI would do the same job.

#### B7.2 — CSS View Transitions API

**Claim.** W3C **CSS View Transitions Module Level 1, Candidate Recommendation Draft, 28 March 2024**. The UA stylesheet's default is a **0.25 s** cross-fade: `:root::view-transition-group(*) { animation-duration: 0.25s; animation-fill-mode: both; }`. **The Level 1 spec contains no mention of `prefers-reduced-motion`** — respecting it is entirely the author's job.
**Source.** https://www.w3.org/TR/css-view-transitions-1/
**Confidence.** High (both quoted from the spec).

**Browser support (same-document):** caniuse reports **90.2 % global**. Chrome/Edge 111+, Safari 18.0+ (and iOS Safari 18.0+), Firefox 144+ (behind a flag in 143), Opera 97+, Samsung Internet 23+. Not supported in Opera Mini / UC / QQ / Baidu / KaiOS.
**Source.** https://caniuse.com/view-transitions — **Confidence.** High.

**CSP verdict:** **perfect fit.** It is a platform API — zero bytes of dependency, no eval, no CDN, and it degrades to an instant swap where unsupported.

**Invariant verdict:** **the only technique that is safe across the renderer boundary.** A view transition snapshots the old and new DOM as images and cross-fades them; it does not reconcile anything. That means it can animate *around* `.dokum-document` — e.g. the overlay opening — without React ever touching the renderer's DOM.

**Caveat specific to Dokum:** the overlay is a native `<dialog>` in the **top layer** (`DocumentOverlay.tsx:53`, `showModal()`). Top-layer elements and view transitions interact awkwardly in current implementations. Prototype before committing; a plain CSS `@keyframes` on the dialog + `::backdrop`, guarded by `prefers-reduced-motion`, is the low-risk version and is what the token table below assumes.

#### B7.3 — React's `<ViewTransition>`

**Claim.** React does have a `<ViewTransition>` component, but it is **Canary and Experimental channels only — not in stable React**. It activates only when it wraps the **first DOM node** in its tree, and only for updates inside `startTransition`, `<Suspense>`, or `useDeferredValue`. Two mounted `<ViewTransition>`s with the same `name` throw. And explicitly: **"Users' `prefers-reduced-motion` preferences must be manually checked and respected."**
**Source.** https://react.dev/reference/react/ViewTransition
**Confidence.** High (quoted from react.dev).

**Verdict for this repo: not available.** `package.json` pins `react: 19.2.3` **stable**. Adopting `<ViewTransition>` means moving the whole app to a canary channel — which for a product with a Stripe payment path and a hand-built imperative editor is not a trade worth making for entrance animations. Revisit when it ships stable.

#### B7.4 — Recommendation

| Option | CSP-safe | Safe near `.dokum-document` | Bytes | Verdict |
|---|---|---|---|---|
| Hand-written CSS (`@keyframes`, `transition`) | yes | yes | 0 | **Use this.** Covers everything Dokum needs today. |
| WAAPI (`el.animate()`) from `document-render.ts` | yes | yes (imperative) | 0 | **Use for anything the renderer itself must animate.** |
| CSS View Transitions | yes | yes (snapshots, no reconcile) | 0 | **Adopt for route/overlay transitions** once the `<dialog>` interaction is prototyped. 90.2 % support, degrades cleanly. |
| Motion (`useAnimate` mini) | yes | **no** — chrome only | 2.3 kb | Only if hand CSS proves insufficient. |
| Motion (`motion` component) | yes | **no** — chrome only | 34 kb | Not justified by anything in the current product. |
| React `<ViewTransition>` | yes | n/a | 0 | **Blocked** — canary only; repo is on stable 19.2.3. |

**The bottom line: Dokum should not add an animation dependency.** Everything in the proposal below is plain CSS, and the one genuinely new capability worth having (view transitions) is a platform API with zero bundle cost.

---

## Motion token proposal

Named tokens, concrete values, and the exact `prefers-reduced-motion` fallback for each. Durations are Material 3's published scale (§B1.1) clipped to the perceptual bounds Miller 1968 / Card 1991 establish (§B1.4); easings are M3's cubic-beziers (§B1.2). `emphasized` is omitted deliberately — it is not expressible as a single `cubic-bezier()`.

### The tokens

| Token | Value | ms | Maps to M3 | Use for | `prefers-reduced-motion: reduce` fallback |
|---|---|---|---|---|---|
| `--dokum-dur-instant` | `50ms` | 50 | `short1` | Nothing user-visible; pure state snap | `1ms` (never `0s` — see note) |
| `--dokum-dur-micro` | `100ms` | 100 | `short2` | Hover/focus colour + border on `.doc-link`, `.student-input`, buttons. Under Nielsen's 0.1 s "instantaneous" limit. | **keep 100 ms** — colour/opacity only, excluded from "motion animation" by Understanding SC 2.3.3 |
| `--dokum-dur-quick` | `150ms` | 150 | `short3` | Chevron rotate, small icon state, tooltip fade | `1ms` (it is a transform → real motion) |
| `--dokum-dur-short` | `200ms` | 200 | `short4` | Card hover lift, small element enter/exit, accordion open | `1ms` |
| `--dokum-dur-medium` | `300ms` | 300 | `medium2` | Card entrance (`slide-up`), overlay panel enter, list stagger total | `1ms` for the transform; **keep the opacity leg at 150 ms** |
| `--dokum-dur-long` | `400ms` | 400 | `medium4` | Full-screen sheet on mobile; the ceiling — Doherty's 400 ms | `1ms` |
| `--dokum-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | — | `standard` | Default for anything that starts and ends on screen | unchanged (irrelevant at 1 ms) |
| `--dokum-ease-enter` | `cubic-bezier(0, 0, 0, 1)` | — | `standard.decelerate` | Elements appearing | unchanged |
| `--dokum-ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | — | `standard.accelerate` | Elements leaving | unchanged |
| `--dokum-ease-emph-in` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | — | `emphasized.decelerate` | The overlay opening — the one moment that deserves emphasis | unchanged |
| `--dokum-ease-emph-out` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | — | `emphasized.accelerate` | The overlay closing | unchanged |

**Why `1ms` and not `0s`:** setting `animation-duration: 0s` can suppress `animationend`/`transitionend` events, silently breaking any listener that depends on them. `1ms` (or `0.01ms`) fires the event and is imperceptible. This is the widely-used reduced-motion reset pattern and it matters here because `DocumentOverlay` and future transition code may key off those events.

### Drop-in implementation

Append to `src/app/globals.css` (Tailwind 4 CSS-first, so `@theme` is the right home for the values):

```css
@theme {
  --dokum-dur-instant: 50ms;
  --dokum-dur-micro:   100ms;
  --dokum-dur-quick:   150ms;
  --dokum-dur-short:   200ms;
  --dokum-dur-medium:  300ms;
  --dokum-dur-long:    400ms;

  --dokum-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --dokum-ease-enter:    cubic-bezier(0, 0, 0, 1);
  --dokum-ease-exit:     cubic-bezier(0.3, 0, 1, 1);
  --dokum-ease-emph-in:  cubic-bezier(0.05, 0.7, 0.1, 1);
  --dokum-ease-emph-out: cubic-bezier(0.3, 0, 0.8, 0.15);
}

/* 650ms → 300ms (M3 medium2); ease-out → M3 standard.decelerate */
.animate-slide-up {
  animation: slide-up var(--dokum-dur-medium) var(--dokum-ease-enter) both;
}

.btn-brand {
  transition:
    box-shadow      var(--dokum-dur-micro) var(--dokum-ease-standard),
    background-color var(--dokum-dur-micro) var(--dokum-ease-standard);
}

/*
 * Media Queries Level 5: `reduce` = "minimize the amount of motion or
 * animation, preferably to the point where all non-essential motions are
 * removed."  W3C names this query as a sufficient technique for WCAG SC 2.3.3
 * (AAA), and it is also what caps the infinite `animate-pulse` skeletons
 * against SC 2.2.2 (Level A).
 *
 * 1ms rather than 0s so transitionend/animationend still fire.
 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }

  /* Colour-only feedback is NOT "motion animation" (Understanding SC 2.3.3
     excludes colour/opacity changes that don't alter size, shape or position),
     so these stay — losing them would remove real affordance signalling. */
  .dokum-document .doc-link,
  .dokum-document .student-input,
  .btn-brand {
    transition-duration: var(--dokum-dur-micro) !important;
  }

  /* The skeletons stop oscillating and become a static grey block. */
  .animate-pulse { animation: none !important; opacity: 1 !important; }

  /* slide-up loses the translate but keeps a short fade — the entrance still
     reads as "this arrived" without any change in perceived position. */
  .animate-slide-up {
    animation: fade-in var(--dokum-dur-quick) linear both !important;
  }
}

@keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
```

### Per-surface changes this implies

| File | Line | Now | Change | Justification |
|---|---|---|---|---|
| `src/app/globals.css` | 26 | `0.65s ease-out` | `var(--dokum-dur-medium) var(--dokum-ease-enter)` | §B1.1 — 650 ms is M3 `long4`+ for a 12 px card entrance |
| `src/app/globals.css` | 30 | `0.15s ease` ×2 | `var(--dokum-dur-micro) var(--dokum-ease-standard)` | §B1.4 — hover feedback belongs under 100 ms |
| `src/app/globals.css` | — | (absent) | add the whole `@media (prefers-reduced-motion: reduce)` block | §B2.1, §B2.2 — currently **zero** occurrences repo-wide |
| `src/components/kurse/KursCard.tsx` | 17 | `transition-all` | `transition-[transform,border-color] duration-200` + opacity-based shadow layer | §B3.3 — `box-shadow` is paint-bound |
| `src/components/kurse/UnitCard.tsx` | 15 | same | same | §B3.3 |
| `src/components/UnitDetailClient.tsx` | 86 | `duration-300 ease-in-out` | `duration-200` + `var(--dokum-ease-standard)` | §B1.1/§B3.3 — layout-animating property, shorten it |
| `src/components/UnitDetailClient.tsx` | 73 | `duration-150` | keep — already `--dokum-dur-quick` | §B1.1 |
| `src/components/documents/interactive-document.css` | 202, 261 | `0.12s ease` | `var(--dokum-dur-micro)` | §B1.1 — snap to the scale |
| `src/components/documents/interactive-document.css` | 46-53 | `p { margin: .8em 0 }` | `1.25em 0` | §B5.1 — paragraph spacing must be ≥1.5× line spacing (AAA 1.4.8) |
| `src/components/documents/interactive-document.css` | 46-49 | (absent) | add `max-width: 70ch` to `p`, `li` | §B5.1 — currently ~100–110 cpl vs Dyson & Haselgrove's 55 and WCAG's 80 |
| `src/components/documents/interactive-document.css` | 96-105 | `.render-target` | add reserved `min-height` before typeset | §B3.2 — MathJax SVG swap is a CLS generator |
| `src/app/globals.css` | 39 | `font-family: Arial…` | remove, or set `var(--font-geist-sans)` | §A.1 — `next/font` Geist is loaded and then overridden |
| `src/components/documents/interactive-document.css` | 29, 36, 89 | `var(--brand, #00338d)` | define `--brand` = `#db3627`, or change the fallback | §A.6 — student documents render **blue** headings inside a **red** brand |
| all six `loading.tsx` / `DocumentArticleSkeleton` | — | `animate-pulse` | covered by the global reduce-motion rule above | §B2.2 — infinite oscillation, SC 2.2.2 Level A |

---

## Sources

**Standards / specs (normative)**
- [W3C — Media Queries Level 5, `prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — Understanding SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [W3C — Understanding SC 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- [W3C — Understanding SC 1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
- [W3C — WCAG 3.0 Working Draft (3 March 2026)](https://www.w3.org/TR/wcag-3.0/)
- [W3C — MathML Core (CR Snapshot, 24 June 2025)](https://www.w3.org/TR/mathml-core/)
- [W3C — CSS View Transitions Module Level 1 (CR Draft, 28 March 2024)](https://www.w3.org/TR/css-view-transitions-1/)
- [W3C — Visual Contrast of Text Subgroup (Silver)](https://www.w3.org/WAI/GL/task-forces/silver/wiki/Visual_Contrast_of_Text_Subgroup) · [w3c/wcag3 issue #29](https://github.com/w3c/wcag3/issues/29)

**Legal**
- [EUR-Lex — Directive (EU) 2019/882 (European Accessibility Act)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0882)
- [gesetze-im-internet.de — Barrierefreiheitsstärkungsgesetz (BFSG)](https://www.gesetze-im-internet.de/bfsg/BJNR297010021.html)
- [gesetze-im-internet.de — BITV 2.0](https://www.gesetze-im-internet.de/bitv_2_0/BJNR184300011.html)

**Vendor / first-party**
- [Material tokens — `json/motion.json` (material-foundation)](https://github.com/material-foundation/material-tokens/blob/json/json/motion.json)
- [Material Components Android — Motion theming](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion) · [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Reduced Motion evaluation criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/)
- [web.dev — INP](https://web.dev/articles/inp) · [Optimize INP](https://web.dev/articles/optimize-inp) · [CLS](https://web.dev/articles/cls) · [Animations guide](https://web.dev/articles/animations-guide) · [RAIL](https://web.dev/articles/rail)
- [MathJax docs — Accessibility](https://docs.mathjax.org/en/latest/basic/accessibility.html) · [Accessibility options](https://docs.mathjax.org/en/latest/options/accessibility.html) · [Upgrading from v3](https://docs.mathjax.org/en/latest/upgrading/v3.html)
- [Motion — React quick start](https://motion.dev/docs/react-quick-start) · [Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size)
- [React — `<ViewTransition>`](https://react.dev/reference/react/ViewTransition)

**De-facto reference / support data**
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) · [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML) · [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [caniuse — View Transitions](https://caniuse.com/view-transitions)

**Research — primary papers**
- Miller, R. B. (1968). Response time in man-computer conversational transactions. *Proc. AFIPS Fall Joint Computer Conf.* 33, 267–277.
- Doherty, W. J. & Thadani, A. J. (1982). *The Economic Value of Rapid Response Time*. IBM, Nov 1982, 12 pp. — [Computer History Museum record 102751398](https://www.computerhistory.org/collections/catalog/102751398)
- Card, S. K., Robertson, G. G. & Mackinlay, J. D. (1991). The information visualizer: An information workspace. *Proc. ACM CHI'91*, 181–188.
- [Dyson, M. C. & Haselgrove, M. (2001). *Int. J. Human-Computer Studies* 54(4), 585–612.](https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586)
- [Mejtoft, T., Långström, A. & Söderström, U. (2018). The effect of skeleton screens. *ECCE'18*.](https://dl.acm.org/doi/10.1145/3232078.3232086)
- [User perception of animation fluency… *IJHCS* 186 (2024).](https://dl.acm.org/doi/10.1016/j.ijhcs.2024.103257) · [Perceived UX of Animated Transitions in Mobile UIs, *CHI'16 EA*.](https://dl.acm.org/doi/10.1145/2851581.2892489)
- Piepenbrock et al. (2013) *Ergonomics*; Piepenbrock et al. *Human Factors*; Dobres et al. (2017) *Applied Ergonomics*; Legge et al. (1985) *Vision Research*; Aleman et al. (2018) *Scientific Reports* — all as surveyed in NN/g's dark-mode review.

**Practitioner research (NN/g — labelled)**
- [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/) · [Dark Mode vs. Light Mode](https://www.nngroup.com/articles/dark-mode/) · [Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/) · [Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) · [Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/) · [Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
