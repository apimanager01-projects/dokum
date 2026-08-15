# A learning environment students actually learn in

**Research question.** How can Dokum's UI increase students' *studying capability* and give them a
learning environment they want to be in — modern, smooth, satisfying, intuitive, built around small
successes — for German university students aged 19–25 studying economics/business and mathematics?

**Date of research pass:** 2026-08-15. **Repo state read:** `feat/editor-fixes-106-110` @ `42966f6`.

**Method.** Five parallel primary-source passes. Peer-reviewed papers and meta-analyses (author, year,
journal, DOI), W3C/EU legal texts read from the Official Journal and gesetze-im-internet.de, first-party
vendor docs labelled as such, and NN/g labelled as practitioner research. Every claim below carries a
source and a confidence level. Where a famous result failed to replicate, or where two literatures
disagree, that is reported rather than smoothed over — several of the most useful findings here are
negative.

**Full evidence with per-claim sourcing lives in [sources/](sources/):**

| File | Covers |
|---|---|
| [01-learning-science.md](sources/01-learning-science.md) | Retrieval, spacing, interleaving, cognitive load, Mayer, worked-example fading, maths notation |
| [02-motivation-and-gamification.md](sources/02-motivation-and-gamification.md) | SDT, overjustification, gamification meta-analyses, every mechanic one by one, German student data, anxiety, EU dark-pattern law |
| [03-manipulation-ethics.md](sources/03-manipulation-ethics.md) | Where persuasion becomes manipulation; four operational tests |
| [04-notifications-and-nudges.md](sources/04-notifications-and-nudges.md) | Push-notification HCI; the large-scale higher-ed nudge nulls |
| [05-interface-craft.md](sources/05-interface-craft.md) | Motion tokens, `prefers-reduced-motion`, WCAG/BFSG, INP/CLS, MathJax a11y, plus a code audit of this repo |
| [06-german-law.md](sources/06-german-law.md) | UWG, the Anhang blacklist, § 312k BGB Kündigungsbutton, BGH case law, vzbv positions |

---

## The short version

1. **The brief's instinct about "small successes" is correct and verified — but it is not gamification.**
   It is Bandura's *mastery experience*, the strongest of four sources of self-efficacy, which is in turn
   the **strongest single psychological correlate of university GPA out of 50 measured** (Richardson,
   Abraham & Bond 2012). You cannot give a student self-efficacy by telling them they have it. You can
   only arrange for them to succeed, unaided, at something genuinely hard, and then make that success
   unmissable. Pep-talk copy is source #3 (verbal persuasion — the weak one).

2. **For mathematics specifically, the usual edtech prior is inverted.** Worked examples are **g = 0.48**
   in maths (Barbieri et al. 2023, 181 effect sizes), while retrieval practice vs restudy in maths is
   **g = 0.18 with a CI crossing zero** across only 7 studies (Murray, Horner & Göbel 2025). The testing
   effect is a verbal-memory finding that has not been shown to transfer to maths problem-solving. Build
   **faded worked examples**, not flashcards, for anything with multiple interacting steps.

3. **"Smooth, satisfying animation" must move out of the learning surface and into the chrome.**
   Seductive details — interesting but irrelevant text, images, anecdotes, *animation* — produce a
   measured **negative** effect on learning (overall **g = −0.16**, transfer −0.12), mediated specifically
   by increased extraneous cognitive load (Sundararajan & Adesope 2020, 68 studies). Motion during
   encoding competes for the exact resource maths anxiety already depletes. The satisfying feel belongs in
   *responsiveness* (sub-100 ms feedback, zero layout shift), in *transitions between* activities, and in
   *craft* — not in confetti over a derivation.

4. **Gamification helps the need this product doesn't need and misses the one it does.** The 2024
   meta-analysis (Li, Hew & Du, 35 interventions): autonomy **g = 0.638**, relatedness **g = 1.776**,
   **competence g = 0.277 with a CI lower bound of 0.001 — effectively null.** For econ/maths, competence
   *is* the product. It comes from step-level feedback on hard problems, not from badges.

5. **German students, asked to rank 20 things, put game elements last.** Reliable functioning >99%,
   uncluttered functions 99%, access to learning materials 99%, Datenschutz 96% — **Serious Games 25%, VR
   23%** (HFD 2020, n = 10,579). And the dropout data reframes the whole product: **university Mathematik
   has a 59% Bachelor dropout rate**, with **performance problems involved in 84%** of Math/Nat dropouts
   and **30% unable to close prerequisite gaps** — while maths students already self-study **19.9 h/week,
   more than they spend in class**. They are not under-working. They are under-supported.

---

## 1. What actually increases studying capability, ranked for this domain

Effect-size calibration first, because Cohen's conventions mislead in education: in educational field
studies **d = 0.10–0.20 is a real, deployable effect**; 0.40+ from a classroom RCT is unusual and usually
shrinks on replication; anything above 0.60 from a small-k meta-analysis is probably inflated by
publication bias.

| Rank | Mechanism | Evidence | Confidence |
|---|---|---|---|
| 1 | **Faded worked examples + principle prompts** | Worked examples in maths **g = 0.48** (Barbieri et al. 2023, 43 articles / 181 ES). Fading alone buys *near* transfer only; fading **plus** "which principle applies here?" buys near **and far** transfer with no extra time on task (Atkinson, Renkl & Merrill 2003) | strong |
| 2 | **Interleaved problem types** | Cluster-RCT, 54 seventh-grade maths classes: **61% vs 38%** on an unannounced test one month later, **d = 0.83** (Rohrer, Dedrick, Hartwig & Cheung 2020). Earlier: d = 0.42 at 1 day → **d = 0.79 at 30 days** (Rohrer, Dedrick & Stershic 2015) | strong |
| 3 | **Spacing keyed to the student's exam date** | Spaced 47.3% vs massed 36.7% recall, 271 comparisons, N = 14,811 (Cepeda et al. 2006). Optimal gap ≈ **20–40% of a 1-week retention interval falling to 5–10% at one year** (Cepeda et al. 2008). Maths-specific: **g = 0.28** — real but smaller than the verbal headline (Murray et al. 2025) | strong |
| 4 | **Elaborated feedback at step level** | Elaborated **d = 0.49** vs knowledge-of-correct-response 0.32 vs **correctness-only d = 0.05** — and **larger for mathematics** than other subjects (Van der Kleij, Feskens & Eggen 2015) | strong |
| 5 | **Scaffolded self-explanation prompts** | Inducing self-explanation **g = 0.55** across 69 effect sizes (Bisra et al. 2018); stronger when the explanation is scaffolded rather than a blank box (Rittle-Johnson, Loehr & Durkin 2017) | strong / moderate |
| 6 | **Signalling what changed between lines** | 103 studies, N = 12,201: retention **g+ = 0.53**, transfer **g+ = 0.33**, and measurably *reduced* cognitive load (Schneider et al. 2018) | strong |
| 7 | **Spatial contiguity (kill split attention)** | 58 comparisons, n = 2,426, **g = 0.63** for integrated designs (Schroeder & Cenkci 2018) | strong |
| 8 | **Segmenting derivations into learner-advanced steps** | 56 investigations, 88 comparisons: small-to-medium effects on retention *and* transfer, reduced load — and **increased learning time** (Rey et al. 2019) | strong |
| 9 | **Retrieval practice — low-interactivity layer only** | g = 0.50–0.51 overall (Rowland 2014; Adesope et al. 2017) but **g = 0.18, CI crossing zero, in maths** (Murray et al. 2025) | strong overall / weak in-domain |

**Read rows 1 and 9 together — that is the design decision.** Van Gog & Sweller (2015) argue the testing
effect shrinks and can vanish as *element interactivity* rises; Karpicke & Aue (2015) rebut in the same
issue and the dispute is unresolved in print. Whoever is right, the safe split is the same:

> **Two content types, enforced in the data model.** *Facts to be retrieved* — definitions, formula
> statements, Lagrange conditions, elasticity cases, notation — go to the retrieval layer. *Procedures to
> be faded* — multi-step derivations, constrained optimisation, comparative statics — go to the
> worked-example layer. **Do not let an author put a derivation into the flashcard type.**

### The concrete feature this points at

A derivation is authored **once**, as a complete solution with each step tagged by principle. The renderer
then generates a ladder over repeated encounters: (1) all steps shown; (2) last step blanked; (3) last two
blanked; … until only the problem statement remains — **backward fading** (Renkl & Atkinson 2003). At each
blanked step, a required one-line prompt: *"Welches Prinzip wird hier angewendet?"* with a principle
picker. Without that prompt you get near transfer only.

Add one cheap content type alongside it: **"Fehlerhafte Lösung"** — a plausible wrong derivation where the
student locates and explains the faulty step. In real Algebra I classrooms, explaining worked examples
*including incorrect ones* improved conceptual understanding over guided practice alone (Booth et al.
2013). Authoring cost is near zero: invert an existing correct derivation.

### Composite prescription for rendering a derivation

1. **Segment** — one transformation per step, learner-advanced (Rey et al. 2019).
2. **Signal** — cue exactly what changed from the previous line; colour or weight on the substituted term
   (Schneider et al. 2018).
3. **Integrate** — symbol definitions inline beside the symbol, never in a legend or footnote (Schroeder &
   Cenkci 2018, g = 0.63).
4. **Justify** — a principle label per step, prompted once fading starts (Atkinson et al. 2003).
5. **Fade** — blank steps from the end backwards across encounters (Renkl & Atkinson 2003).
6. **Strip** — no decorative animation on step transitions (Sundararajan & Adesope 2020, g = −0.16).
7. **Remove the scaffold** once performance says the learner is no longer a novice — expertise reversal
   means support that helps novices actively harms experts (Kalyuga, Ayres, Chandler & Sweller 2003).

### Formula typography is instruction, not cosmetics

Four experiments on validity judgements of algebraic equations, manipulating **non-mathematical perceptual
grouping** (physical spacing): accuracy was **highest when perceptual grouping supported the mathematical
grouping**, and the difference was larger when the judgement depended on operator precedence (Landy &
Goldstone 2007). The effect **persisted under masking and was not eliminated by vocalisation** (Rivera &
Garrigan 2016) — it lives in the visual system, so you cannot instruct it away.

Checkable requirements: spacing must agree with precedence (tighter around higher-precedence operations);
**never let an equation line-wrap at an arbitrary point** — a break that splits a product creates a false
grouping; never justify text containing inline maths; don't let responsive font scaling change relative
spacing inside formulas. Dokum already scopes horizontal scroll to `.render-target`
([interactive-document.css:96-105](../../src/components/documents/interactive-document.css#L96-L105)), which
is the right answer and matches WCAG 1.4.10's explicit exception for content requiring two-dimensional
layout for meaning.

---

## 2. "Small successes" — the instinct is right, the usual implementation is wrong

### Why it is right

Bandura's four sources of self-efficacy, in descending order of influence: **mastery experiences** (actually
performing and succeeding), vicarious experiences, verbal persuasion, physiological/affective states
(Bandura 1977). Mastery experience is empirically the dominant source — in several analyses effectively
the only independent predictor once the others are controlled (Usher & Pajares 2008, 2009).

And self-efficacy is not a nice-to-have. Richardson, Abraham & Bond (2012) screened 7,167 articles and
synthesised 241 datasets covering **50 conceptually distinct correlates of university GPA**; **performance
self-efficacy was the strongest of all 50.** *(The often-quoted r ≈ .59 was not verified against the
primary text — the ranking was.)*

On direction of causation: Talsma et al.'s (2018) meta-analytic cross-lagged panel analysis finds the
relationship **reciprocal**, and in studies measuring self-efficacy first at each wave the
**performance → belief** path was the stronger one. *(Honest caveat the authors flag: the pattern reverses
by measurement order.)*

> **The operational consequence, and it is the opposite of what most gamified products do:** every euro
> spent on encouragement copy is misallocated relative to a euro spent on difficulty calibration. A
> calibrated problem the student solves without help is source #1. "Du schaffst das!" is source #3.

### What this means for checkmarks

Mark completion against **mastery**, not **exposure**. A checkmark on "I read this" is a fake mastery
experience — it builds nothing, and it inflates the student's confidence going into a Klausur, which for a
paid product is a quality failure. A checkmark on "I solved 4 of these problem types correctly, unaided" is
true. This matters because students are demonstrably bad at this judgement: **78% performed better with
spaced presentation, yet 78% said massing was as good or better** — *after* taking the test that proved
otherwise (Kornell & Bjork 2008).

### Calibrating the difficulty

The much-cited "85% rule" — optimal training error 15.87% — is **an analytically derived result for
gradient-descent learners on binary classification tasks**, not a human RCT (Wilson, Shenhav, Straccia &
Cohen 2019). It is a principled starting parameter, not a validated human constant, and it is routinely
over-cited in edtech as if it were the latter. Use **80–85% success as a labelled hypothesis**.

The tension to hold: high success rates feel like learning and produce satisfaction; **desirable
difficulties** produce retention while depressing both. In controlled comparisons in large introductory
physics courses, students in active-learning conditions **learned more but reported feeling they learned
less** (Deslauriers et al. 2019, PNAS). Bjork's standing caveat is that a difficulty is desirable only if
the learner can respond to it successfully — so **gate every difficulty on demonstrated competence at the
easier level**, and never apply desirable difficulties to a first encounter with high-interactivity
material.

**Never let difficulty adapt downward toward whatever maximises session length.** That is the mechanism by
which every engagement-optimised learning product becomes useless.

---

## 3. Where "smooth and satisfying" legitimately belongs

The brief asks for modern, smooth, satisfying motion. The evidence says: **yes — but not during encoding.**

### The constraint

Seductive details reduce learning: **overall g = −0.16, comprehension −0.19, recall −0.17, transfer −0.12**,
across 68 studies, with mediation analysis showing the damage runs through **increased extraneous cognitive
load** (Sundararajan & Adesope 2020). Motion is worse than static because it competes for attention during
encoding. The magnitude is small, so this is a "don't add it" rule rather than a "rip everything out"
emergency — but it is a rule.

It compounds with maths anxiety. Anxiety-driven intrusive worry occupies working memory; Ashcraft & Kirk's
(2001) dual-task experiments showed higher maths anxiety producing measurably more errors on a concurrent
letter-recall task. **Every interface element that competes for working memory during problem-solving is
amplifying maths anxiety** — a countdown timer, a live score, a rank, a streak warning, an animated
distraction. That is a mechanistic prediction, not a soft preference.

### The three places motion earns its keep

**(a) Perceived responsiveness.** This is where "feels modern" actually comes from, and it is measurable.
Nielsen's limits, derived from Miller (1968) and Card et al. (1991): **0.1 s** = feels instantaneous;
**1.0 s** = flow of thought preserved; **10 s** = attention lost. Core Web Vitals put **INP good ≤ 200 ms,
poor > 500 ms** at the 75th percentile, and **CLS good ≤ 0.1** (web.dev).

Dokum's structural exposure here is real: every keystroke in a `.student-input` triggers the renderer's full
recompute. Two things are already right — MathJax typesetting is queued so it doesn't block the keystroke
paint, and `dataset.typesetLatex` short-circuits unchanged formulas. The measurement to actually take: hold
a key down in a document with ~20 formulas on a mid-range Android and read INP.

**(b) Layout stability.** Layout shift is the single most "cheap-feeling" defect, and Dokum has a known
generator: `.render-target` holds raw LaTeX text, then typesetting replaces it with an SVG of a *different
height*. The codebase already comments on exactly this. Fix is reserved height in CSS, or geometry baked
into the published snapshot at publish time.

**(c) Transitions between activities, not during them.** Celebration, if you want it, goes *between*
activities. Task-boundary moments are also where interruption is cheapest: notifications at task breakpoints
got reaction times of **3.07 s vs 4.08 s** when delivered immediately, and task resumption after a *relevant*
notification took **4.65 s vs 23.1 s** after a general-interest one (Iqbal & Bailey 2008). A study platform
*owns* its task boundaries — exercise submitted, Unit finished. In-app prompts there are the cheapest
high-value interaction available.

### Honest framing of the numbers

**There is no experiment that optimised UI animation duration.** The 200–500 ms band is convention bounded
by the perception limits above; Material 3 publishes its scale as *design tokens* with the rationale
"duration should increase as area/traversal increases" — a rule of proportion, not an optimum from a study.
Present the token table as *Material 3's published scale clipped to perceptual bounds*, never as
"research shows 300 ms is optimal."

### The token proposal

Durations are Material 3's tokens (verified against two Google-owned repos); easings are M3's cubic-beziers.
M3's plain `emphasized` easing is deliberately omitted — Google ships it as a two-segment path, not
expressible as a single `cubic-bezier()`.

| Token | Value | M3 | Use | `reduce` fallback |
|---|---|---|---|---|
| `--dokum-dur-micro` | `100ms` | `short2` | Hover/focus colour + border | **keep 100 ms** — colour-only is excluded from "motion animation" by Understanding SC 2.3.3 |
| `--dokum-dur-quick` | `150ms` | `short3` | Chevron rotate, tooltip fade | `1ms` |
| `--dokum-dur-short` | `200ms` | `short4` | Card hover lift, accordion | `1ms` |
| `--dokum-dur-medium` | `300ms` | `medium2` | Card entrance, overlay enter | `1ms` transform, keep a 150 ms opacity leg |
| `--dokum-dur-long` | `400ms` | `medium4` | Mobile sheet — the ceiling (Doherty) | `1ms` |
| `--dokum-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | `standard` | Default | — |
| `--dokum-ease-enter` | `cubic-bezier(0, 0, 0, 1)` | `standard.decelerate` | Appearing | — |
| `--dokum-ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | `standard.accelerate` | Leaving | — |
| `--dokum-ease-emph-in` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | `emphasized.decelerate` | Overlay opening | — |

Use `1ms`, not `0s`, in the reduced-motion block: `0s` can suppress `animationend`/`transitionend`, silently
breaking listeners — and `DocumentOverlay` may key off those.

### Library verdict: add nothing

| Option | CSP-safe | Safe near `.dokum-document` | Bytes | Verdict |
|---|---|---|---|---|
| Hand-written CSS | yes | yes | 0 | **Use this.** Covers everything needed today |
| WAAPI (`el.animate()`) from the renderer | yes | yes (imperative) | 0 | **Use for anything the renderer must animate** |
| CSS View Transitions | yes | yes — snapshots, doesn't reconcile | 0 | **Adopt for route/overlay transitions** (90.2% support, degrades to instant swap) |
| Motion (`useAnimate` mini) | yes | **no — chrome only** | 2.3 kb | Only if hand CSS proves insufficient |
| React `<ViewTransition>` | yes | n/a | 0 | **Blocked** — canary only; repo is on stable React 19.2.3 |

The invariant does the deciding. `<motion.div>` inside `.dokum-document` is exactly the React reconciliation
the architecture forbids — it would destroy student-typed values. View Transitions snapshot the DOM as
images rather than reconciling it, which is why they are the one new capability worth taking. *Caveat:* the
overlay is a native `<dialog>` in the top layer, and top-layer elements interact awkwardly with view
transitions in current implementations. Prototype before committing; plain `@keyframes` on the dialog +
`::backdrop` is the low-risk version.

---

## 4. Reduced motion is not optional — and one part of it has legal weight

`prefers-reduced-motion` appears **zero times** in `src/`. All ~12 animated declarations are unconditional.

Media Queries Level 5 defines `reduce` as: *"the user has expressed the desire to minimize the amount of
motion or animation, preferably to the point where all non-essential motions are removed."* W3C names the
query as a **sufficient technique** for WCAG SC 2.3.3.

Two criteria, at two different levels — do not conflate them:

- **SC 2.3.3 Animation from Interactions — Level AAA.** Covers `animate-slide-up` (a 12 px `translateY` =
  change in perceived position) and the card hover lift. Not a conformance blocker at AA, but the fix is
  three lines.
- **SC 2.2.2 Pause, Stop, Hide — Level A.** *This is the one with exposure.* Tailwind's `animate-pulse` is
  an **infinite** opacity oscillation. Read literally: starts automatically, presented in parallel with
  other content, and on a slow Supabase read runs past five seconds with no pause mechanism. It appears in
  **six files** — `src/app/loading.tsx`, `src/app/admin/loading.tsx`, the two `kurse/…/loading.tsx` files,
  `src/app/dokumente/[docId]/loading.tsx`, and `DocumentArticleSkeleton`.

  The counter-argument is genuinely strong — Understanding SC 2.3.3 excludes pure opacity change from
  "motion animation", and 2.2.2's own examples are tickers and marquees, not loading placeholders. Build to
  the safe reading anyway: stop the pulse under `reduce`, leaving a static grey block.

**Legal position for a German commercial product.** The **BFSG** (Germany's EAA transposition) has applied
since **28 June 2025**. `§1 Abs. 3 Nr. 5` covers "Dienstleistungen im elektronischen Geschäftsverkehr";
`§2 Nr. 26` defines these as digital services offered via websites, electronically, at a consumer's
individual request, with a view to concluding a consumer contract. Dokum sells Unit access to consumers via
Stripe Checkout — on the plain text of the statute, that is in scope.

Three genuine uncertainties, all for a lawyer rather than an engineer: (1) the **Kleinstunternehmen**
exemption in `§3 Abs. 3` (<10 employees *and* ≤ €2m turnover) — real today, but it evaporates on growth and
is a bad thing to architect around; (2) whether scope reaches only the purchase flow or the whole learning
surface; (3) the technical anchor is EN 301 549 → **WCAG 2.1 AA**, which means **SC 2.3.3 (AAA) is not
required by that route but SC 2.2.2 (A) is.** BITV 2.0 scopes itself to *öffentliche Stellen* and almost
certainly does not apply.

**Recommendation:** target **WCAG 2.2 Level AA** (it supersets 2.1 AA, and the repo already cites 2.5.8 in
`interactive-document.css`), and implement `prefers-reduced-motion` regardless — it is the cheapest AAA
criterion in the guidelines and Apple's App Store now evaluates apps on it.

---

## 5. What German students actually want

The German sources here were downloaded and text-extracted locally, which makes them the sturdiest numbers
in the whole pass. (EDUCAUSE domains were network-blocked; those figures are index extracts, marked
moderate.)

### The feature ranking, in students' own words

HFD-Arbeitspapier 54 (2020), n = 10,579: reliable functioning **>99%**, clear/uncluttered functions **99%**,
access to learning materials **99%** (first of 20 measured processes), **Datenschutz 96%**, single sign-on
84%, appealing design 80%, interoperability 78%, offline availability 72% — and **novelty dead last: Serious
Games 25%, VR 23%.**

> Reliability beats clarity beats privacy beats design beats novelty. **Gamification does not appear on the
> list students produce when asked.**

Bitkom (2024, n = 506, explicitly non-representative): the most urgent problems named are badly functioning
portals (27%) and poor Wi-Fi (26%) — infrastructure, not features. **65% have used ChatGPT**; among users,
**33% for exam preparation**.

EDUCAUSE frustrations (2025): unreliable Wi-Fi, inconsistent AI policies, and **tool overload**. Only **48%**
perceive consistency across their courses. *A product that adds a twelfth login is fighting a stated
preference.*

### Desktop, not mobile

Across four EDUCAUSE waves: laptop primary 72–81%, desktop 14%, **cellphone primary for academic needs: 3%**.
For a maths product this is doubly true — you cannot do integration by parts on a phone keyboard. Mobile's
honest job is **review and retrieval** (spaced repetition, checking a formula), not problem-solving.

*Watch the mis-citation:* Sung, Chang & Liu (2016, mean ES 0.523) compares **mobile-integrated vs conventional
instruction** and its "mobile devices" category **includes laptops**. It is not evidence that phones beat
desktops.

### Time budgets — the constraint that kills daily mechanics

22. Sozialerhebung (DZHW, SoSe 2021, ≈188,000 students at 250 Hochschulen):

| Fach | Total h/week | Lehrveranstaltungen | **Selbststudium** |
|---|---|---|---|
| **Mathematik / Naturwissenschaften** | **38.2** | 18.3 | **19.9** |
| (Int.) Betriebswirtschaftslehre | 33.3 | 17.7 | 15.6 |
| Wirtschaftswissenschaften (ohne BWL) | 33.1 | 17.1 | 16.0 |

**63.0% work alongside study, averaging 15.1 h/week** — a ~50-hour week — and the report states explicitly
that employment hours significantly reduce study time. **A daily-obligation mechanic is being sold to people
who are demonstrably at capacity.**

### The dropout data — this is the product thesis

DZHW-Brief 05|2022, German nationals, 2020 graduate cohort:

| | Universität | HAW/FH |
|---|---|---|
| All Bachelor | 35% | 20% |
| **Mathematik (Studienbereich)** | **59%** | — |
| Mathematik / Naturwissenschaften | 50% | 39% |
| **Wirtschaftswissenschaften** | **27%** | **17%** |

And why (DZHW Forum Hochschule 1|2017, 6,029 Exmatrikulierte): **30% of all dropouts failed the performance
requirements** — the single most common decisive reason, unchanged since 2008. In Math/Nat, **performance
problems play a role in 84%** of university dropouts, with **30% unable to compensate for missing prior
knowledge** and **33% never managing the entry into their studies.**

**But economics fails differently: 40% of Wirtschafts-/Sozialwissenschaften dropouts had largely lost
interest** — a motivation problem, not a competence one.

> **Two audiences, one product, two failure modes.** For maths: a **prerequisite-gap diagnostic in weeks 1–4**
> addresses the literal, measured, most common cause of failure — and conveniently supplies both the honest
> starting progress and the calibrated mastery experiences. For economics: relevance and meaning — worked
> examples tied to real economics, not more drill.

### Price anchor

German students spend **~28 €/month on Lernmittel**, rising (2016: 20 € → 2021: 28 €, +40%), against mean
income 1,106 €/month. Market context: **61% of all German private tutoring is mathematics** (Bertelsmann/
Klemm & Hollenbach-Biele 2016) — but the payer there is a parent and the learner is a schoolchild. The one
directly comparable behaviour: among US students using generative AI monthly, **almost half pay for AI tools**
out of pocket (Tyton Partners 2024) — students will pay for something that visibly works.

*Genuine gap:* no first-party German survey measures how many *university* students pay for exam-prep
material or how much. Confirmed by full-text grep — the 22. Sozialerhebung has no Nachhilfe item at all.

---

## 6. Mechanics: ship, constrain, don't

| Mechanic | Verdict | Why |
|---|---|---|
| **Progress bars** | **Ship — the safest, strongest mechanic here** | Endowed progress **34% vs 19%** completion (Nunes & Drèze 2006); goal-gradient acceleration (Kivetz, Urminsky & Zheng 2006). Information, not reward, so no undermining risk |
| **Mastery checkmarks** | **Ship — mark mastery, not exposure** | Cheapest legitimate competence feedback. See §2 |
| **Resume-where-you-left-off** | **Ship — least manipulative mechanic in the document** | The **Ovsiankina** effect survived meta-analysis: **67% resumption**, stable across 20–21 studies |
| **Task-directed feedback** | **Ship, with a hard rule** | Positive/informational feedback **d = +0.33 / +0.31** (Deci et al. 1999). But **>1/3 of feedback interventions make performance worse** (Kluger & DeNisi 1996, 607 ES) — the split is task-directed vs self-directed |
| **Adaptive difficulty** | **Ship at ~80–85%, and defend it from your own engagement metrics** | See §2 |
| **Anxiety interventions** | **Ship both — cheap and evidence-backed** | 10-min pre-exam expressive writing (Ramirez & Beilock 2011, *Science*, two field RCTs); arousal reappraisal microcopy (meta d = 0.23) |
| **Points / XP** | **Constrain hard** | Only as an *exam-readiness estimate*, never a spendable currency, never the headline number. Volume-scaled points produce the documented "preference for easy tasks" pathology (Toda et al. 2018) |
| **Badges** | **Content badges only — delete the whimsical tier** | "Integralrechnung: Grundlagen abgeschlossen" is a progress map. "Nachteule" is a token. Test: *would a student screenshot this to their Lerngruppe without embarrassment?* |
| **Growth-mindset copy** | **Ship the language, not a feature** | d = 0.08 (Sisk et al. 2018, N = 57,155); non-significant among best-practice studies (Macnamara & Burgoyne 2023) vs d = 0.14 (Burnette et al. 2023). All endpoints far below the trade-book narrative |
| **Daily streaks** | **Don't** | See below |
| **Leaderboards** | **Don't. No variant** | See below |
| **Zeigarnik-based design** | **Don't — it isn't real** | See §10 |
| **Spendable currency (gems/hearts/lives)** | **Absolutely not** | Expected + tangible + engagement-contingent + withdrawable — every factor in the **d = −0.40** cell at once, and gating learning behind a resource in a *paid* German product is a straight line to a UCPD argument |

### Why not leaderboards

Hanus & Fox (2015) is the study that matches this context exactly: a **16-week university semester**, two
sections of the same course, badges + leaderboard vs identical curriculum. Result: **less intrinsic
motivation, less satisfaction, less empowerment, and lower final exam scores — with the exam-score
difference mediated by intrinsic motivation.** Toda et al. (2018) find leaderboards the element most strongly
associated with mapped negative effects. Bai, Hew, Sailer & Jia (2021) show the mechanism: high rank →
competence satisfaction, **low rank → competence frustration**.

German econ/maths cohorts are already comparison-saturated — Notenspiegel, curved results, publicly discussed
Durchfallquoten. A leaderboard adds a redundant ranking signal and delivers it hardest to bottom-quartile
students, who are precisely the people who need the product and will pay for it.

If you want any social signal: **anonymous distributional feedback, positively framed, shown only when
favourable, switchable off.** Never a rank.

### Why not daily streaks

- **Reward category.** A streak is **engagement-contingent by construction** — the worst-performing category
  in Deci, Koestner & Ryan's 128-study meta-analysis at **d = −0.40**.
- **The honest vendor numbers are tiny.** Duolingo's own *causal* A/Bs: streak-animation improvement **+1.7%**
  7-day retention; doubling Streak Freeze **+0.38%** DAU. The circulating "3.6× more likely to complete" is
  **correlational and selection-confounded**. The gap between the correlational headline and the causal
  reality is the whole story.
- **Wrong behaviour.** A streak rewards daily 3-minute contact. Passing Analysis requires long focused
  blocks. Combined with points, it actively drives the preference-for-easy-tasks pathology.
- **Wrong calendar.** A German semester structurally contains zero-activity weeks — another module's
  Klausurenphase, Praktikum, Semesterferien, illness. A daily streak converts normal academic life into
  repeated failure.
- **Wrong students.** The failure state lands on maths-anxious students, in a maths product.
- **The loss-aversion rationale has collapsed.** λ = 2.25 is a *median fit to 8 mixed gambles from 25
  graduate students in 1992*. Yechiam & Zeif (2025) re-analysed Brown et al.'s own dataset (n = 149,218) and
  in the artefact-free cell — symmetric magnitudes, unordered presentation — found **λ = 1.07, CI
  [0.97, 1.18], p = .16**. Not significantly different from loss-neutrality.
- **Regulatory direction.** The Commission's Fitness Check names *"time-based elements (e.g. daily rewards,
  streaks, countdowns)"* among addictive-design concerns, with a Digital Fairness Act proposal due Q4 2026.
  *(This is direction, not prohibition — the verified record does not say a streak is per se unlawful.)*

**The replacement:** a **weekly, forgiving, never-resetting** consistency measure — *"in 9 der letzten 12
Wochen hast du mindestens zweimal gelernt."* No single-day failure state, matches how a semester actually
runs, and carries the same information.

*Evidence gap, stated honestly:* no peer-reviewed study isolates streak mechanics against intrinsic
motivation, in either direction. The confident numbers circulating ("63% more likely to abandon after one
missed day", "2.3× more likely to quit") are **habit-app vendor marketing with no traceable citation** — do
not use them. The case above is a **theory-grounded prior**, not an empirical finding, and should be
described that way internally.

---

## 7. Notifications: budget them as a commercial mechanism, not a learning one

This is the most one-sided evidence in the whole pass, and it points the opposite way from product intuition.

**The closest analogue to the decision.** Three behavioural tools randomised inside a MOOC: the
**commitment device** group spent **24% more time**, earned grades **0.29 SD higher**, and were **40% more
likely to complete**. The **alert tool was statistically indistinguishable from control** (Patterson 2018).

**The definitive negative.** Five years of RCTs at the University of Toronto, **~25,000 students**, six
escalating arms up to two-way text coaching by trained upper-year students and face-to-face coaching:
*"None of the interventions we test can generate a significant improvement in student grades or persistence.
We can rule out treatment effects larger than 7 percent of a standard deviation."* Null **for maths-only and
economics-only grades** specifically. Study time did rise (~1.3–2 h/week) — grades didn't. Students **liked
it**: >65% replied to their text coach, 70% wanted it continued (Oreopoulos & Petronijevic 2019).

The same authors' earlier peer-reviewed RCT proves it wasn't a power problem: **personal coaching +0.30 SD
grades / +0.35 SD GPA; the text-messaging campaign, no effects on any academic outcome, any subgroup**
(Oreopoulos & Petronijevic 2018).

**Don't try to optimise your way out of a null.** Bird et al. (2021) randomised **800,000 students** across
behavioural framing, delivery channel, timing, infographic-vs-text, and offer of one-on-one advising: *"We
find no impacts … no evidence that different approaches to message framing, delivery, or timing … affected
campaign efficacy."* Enrollment effects ruled out above **0.5 pp**.

**And discount every published nudge effect.** DellaVigna & Linos (2022, *Econometrica*), a complete census of
126 RCTs across two US government nudge units covering **>23 million people**: academic journals report
**8.7 pp**, nudge units get **1.4 pp** — ~6× smaller. Estimated probability that a null-result nudge paper
gets published: **0.10**. Correcting for publication bias closes the entire gap. Maier et al.'s (2022)
Bayesian re-analysis of the main nudge meta-analysis puts **information nudges at d = 0.00, BF₀₁ = 33.84** —
strong evidence *against* an effect. That is exactly what "here's a reminder about your course" is.

### What to do instead

- **Build student-authored commitment** — self-set exam date, weekly plan, target. The only arm that moved
  grades.
- **Fire in-app prompts at task breakpoints you already own** — ~5× lower interruption cost.
- **Remove friction rather than adding motivation.** In the H&R Block FAFSA experiment, *assistance*
  (pre-filling and submitting the form) raised enrollment; *information alone* did nothing. Resume-exactly-
  where-you-stopped and one-tap-next-exercise beat any reminder telling students to do those things.
- **Attribute messages to a named human** where possible. In the summer-melt scale-up, the arm where texts
  came from the student's **own counsellor** produced +8–9 pp; the national arm with anonymous virtual
  advisors was **null**. Sender identity, not message content, carried the effect.
- **Per-category toggles**, never one master switch — a master switch converts one bad notification into
  permanent total opt-out.

### Two rules from the notification literature

1. **Never notify a user about something they just did themselves.** At n = 40,191 that is the
   **lowest-rated notification class in the field** (importance 1.43/5).
2. **Dismissal is not a relevance signal.** **44.2% of dismissed notifications were rated maximally
   important** (Visuri et al. 2019). An ML "suppress what they dismiss" heuristic will suppress what users
   value. Ask, don't infer.

*And stop quoting "23 minutes to refocus."* That figure appears nowhere in Mark, Gonzalez & Harris (2005).
The paper reports 11 min 4 s per working sphere and 25 min 26 s to same-day resumption. In the controlled
follow-up, **interrupted work was completed faster, not slower** — the cost was entirely in stress,
frustration and effort (Mark, Gudith & Klocke 2008).

---

## 8. The ethical line, and the EU compliance surface

### The philosophy is genuinely unsettled — don't let anyone sell you a clean test

Susser, Roessler & Nissenbaum: *"manipulation is hidden influence"*, and *"the only necessary condition of
manipulation is that the influence is hidden"* — so disclosure cures it. Sunstein: *"Transparency is a
necessary condition. Note, however, that it is not sufficient"* — only **individual consent** justifies.
Klenk: *"manipulation is sometimes overt… manipulation is careless influence"*, defined as influence *"not
explained by the aim to reveal reasons to the interlocutor"* — so a mechanic chosen from an
engagement-optimisation A/B test is manipulative **even if fully visible and even if it helps the student
pass**. Sunstein concedes his own concept may not have *"necessary and sufficient conditions."*

**What survives all three accounts, in priority order:**

1. **Whose-interest — the only universally endorsed test, and the one to make mandatory.** For each mechanic,
   write down the metric it was chosen to move. Retention / DAU / session count → **fails**, re-justify
   against a learning metric. Exam pass rate / problem-set completion / delayed-recall accuracy → passes.
   This is auditable in a way "would they endorse it on reflection" never will be.
2. **Reconstruction.** Could a student who paused and thought work out **what** the app is doing and **why**,
   from the intervention itself? A visible streak counter passes. A reminder timed by a lapse-prediction
   model fails, even if a privacy policy discloses it. **Personalisation is the risk multiplier, not the
   base offence.**
3. **Ease of exit** — one step, permanent, no confirm-shaming.
4. **Consent over disclosure** — opt-in at onboarding beats disclosed-and-default-on. This also aligns with
   SDT's *"do not… demand actions from users without their assent."*
5. **Measure at the life sphere** (METUX — *Motivation, Engagement & Thriving in User Experience*). Engagement
   *"do[es] not necessarily contribute to sustainable wellbeing"*; you *"will need to measure at the life
   level."* Without a perceived-pressure and perceived-readiness measure you cannot distinguish learning from
   counter-feeding.

### The enforceable version — read from the Commission's own guidance

The UCPD Guidance supplies an operational manipulation test that closely tracks the philosophical criterion,
and it has teeth:

> *"It is the presence of these factors and their opaqueness that distinguishes, on the one hand, highly
> persuasive advertising or sales techniques from, on the other hand, commercial practices that may be
> manipulative and, hence, unfair under consumer law."*

**Four questions for design review:** (1) Does it rely on behavioural data about this user that the user
doesn't know you hold? (2) Is it personalised or dynamically timed to that user's inferred state? (3) Are you
A/B testing it to maximise a metric that is *yours*, not the student's? (4) Would the student, shown the
mechanism plainly, recognise what is being done to them?

If 1–3 are yes and 4 is no, the Commission's own framing puts you on the manipulation side — *"the UCPD does
not require intention."* A generic, non-personalised, user-configurable reminder passes cleanly. A
loss-framed streak warning, timed by a lapse model, tuned against retention, fails all four.

### Hard stops today, none requiring intent

**The UCPD is the live surface — and it reaches re-engagement even with no purchase.** The guidance states
the Directive covers *"commercial practices such as capturing the consumer's attention, which results in
transactional decisions such as continuing to using the service."*

1. **No fake countdowns or false scarcity** — UCPD Annex I No 7, unfair *in all circumstances*.
2. **No re-prompting after a student has declined** — mapped to Annex I No 26 (persistent unwanted
   solicitation).
3. **No guilt copy** on cancellation or notification opt-out — *"confirmshaming"* can amount to an aggressive
   practice under Art 8.
4. **Cancellation as easy as signup.**
5. **Do not personalise pressure to inferred emotional or academic state** — the guidance says vulnerability
   is *"dynamic and situational"* and, where a practice is highly personalised, the benchmark can be *"formulated
   from the perspective of a single person."* *(Whether exam-stressed 19–25s are a vulnerable group is
   unsettled — no case law found either way.)*

**DSA Art 25 almost certainly does not bind Dokum**, for two independent reasons: it is probably not an
"online platform" (Kurse/Units/Dokumente are authored by you, not stored at a recipient's request), and Art
19(1) excludes micro and small enterprises from that Section entirely. *This changes if student-generated
content visible to other students is ever added.*

**Split transactional from marketing messages at the architecture level.** ePrivacy Art 13 requires prior
consent for direct marketing by "electronic mail", and the UCPD Guidance notes Member States must penalise
from the *first* message — so "it's only occasional" is not a defence. Whether a push notification is
"electronic mail" under Art 2(h) is unsettled; **build as if it counts.**

### German law — where the sharpest, most concrete exposure actually is

Two BGH judgments land directly on this product, and one of them lands on the payment model.

**1. Retention offers on a cancellation confirmation page are now per se unlawful in Germany.**
**BGH, 16.07.2026 – I ZR 200/25 ("Bestätigungsseite")**, claimant vzbv. The defendant's confirmation page
carried a banner offering free contract *suspension* instead of cancellation. The OLG allowed it; the BGH
reversed:

> *"Die Ausgestaltung der Bestätigungsseite ist in § 312k Abs. 2 Satz 3 BGB **abschließend** geregelt. Über
> die dort vorgesehenen Angaben … hinausgehende **Angaben, Angebote oder Informationen darf die
> Bestätigungsseite nicht enthalten.**"*

No "pause instead?", no discount, no "here's what you'll lose", no cross-links. The page carries the
§ 312k Abs. 2 S. 3 Nr. 1 fields and the confirmation button, and nothing else.

**2. "It's a one-time payment, so § 312k doesn't apply" is foreclosed — and Dokum sells per-Unit one-time
purchases.** **BGH, 22.05.2025 – I ZR 161/24**: *"Eine Kündigungsschaltfläche nach § 312k BGB ist auch dann
notwendig, wenn der Verbraucher ein **einmaliges Entgelt** zu entrichten hat und der Vertrag **automatisch
endet**."* The trigger is a **Dauerschuldverhältnis** obliging the trader to an entgeltliche Leistung — a
one-off price for time-limited ongoing access to a Unit is a plausible fit. Whether a given per-Unit
purchase *is* one is a question for German counsel on the actual terms; the point is that the "one-off fee"
reasoning no longer answers it.

**Why this is a revenue risk, not a legal-notice risk:** `§ 312k Abs. 6` — if the buttons and page are
non-compliant, the consumer may terminate *"jederzeit und ohne Einhaltung einer Kündigungsfrist"*. And the
area is actively policed: vzbv and other consumer bodies **abgemahnt more than 150 companies** in the first
year alone, and their 2024 survey of 1,200 providers found **one in five still non-compliant**.

**Three more constraints, all age-neutral:**

- **`§ 4a Abs. 2 Nr. 4 UWG`** makes *"belastende oder unverhältnismäßige Hindernisse nichtvertraglicher
  Art"* obstructing the right to cancel an express **aggressiveness** criterion. This is the general
  dark-pattern hook for cancellation friction, separate from § 312k.
- **Login walls on cancellation are pending at the BGH** (I ZR 272/25 and I ZR 275/25, **hearing
  5 November 2026**). The Kammergericht allowed both claims below; lower courts have consistently held them
  unlawful. Safe design today: a cancellation path reachable **without authentication** — § 312k Abs. 2 S. 3
  Nr. 1 lit. b expressly contemplates the consumer *supplying* identifying data.
- **`Anhang zu § 3 Abs. 3 Nr. 7`** — a countdown must be real. The word in the statute is **unwahre**, so a
  genuinely time-limited, genuinely enforced offer is outside it. A fabricated one is per se unlawful with
  no balancing available. **Nr. 26** covers *"hartnäckiges und unerwünschtes Ansprechen"* via *"sonstiger
  für den Fernabsatz geeigneter Mittel der kommerziellen Kommunikation"* — an open catch-all that sidesteps
  the push-classification question entirely.

**And the rule that governs every message you send.** German law does not let you launder advertising by
attaching it to a transactional message. **BGH VI ZR 225/17**: a **customer satisfaction survey** is
advertising *even in the same e-mail as the invoice*, because it serves Kundenbindung and future
transactions. **BGH VI ZR 134/15**: an ad footer on an automated confirmation is advertising, and *"it makes
no difference"* that the confirmation is in the body and the ad only in the footer.

| Message | Classification |
|---|---|
| "Your payment failed, update your card" | Transactional |
| "Your Kurs access expires on 3 March" | Transactional if purely factual and necessary |
| **"You haven't studied in 5 days — come back!"** | **Werbung** — this is exactly the VI ZR 225/17 rationale |
| **"Rate your Kurs" / NPS survey** | **Werbung**, directly on point |
| Receipt + "Check out our new Kurs" footer | **Werbung** — the footer contaminates the message |

Whether a push notification is "elektronische Post" under `§ 7 Abs. 2 Nr. 2` is **unsettled** — no German
decision on app push was found. But CJEU **C-102/20** reasoned *functionally* (does the message land in the
user's message space looking like a real message?), which transfers naturally to a notification tray.
**Design as if it counts:** an OS permission prompt is a technical channel permission, **not** an
*ausdrückliche Einwilligung in Werbung*. Keep marketing consent separate, logged, revocable, per-category.

**One thing "our users are adults" does not buy you.** The minor-specific layer (JuSchG, JMStV § 6, UWG
Anhang Nr. 28, DSA Art. 28) genuinely doesn't apply to 19–25s. **Everything in §§ 3, 4a, 5, 5a, 7 UWG, the
rest of the Anhang, and § 312k BGB is age-neutral.** And the realistic exposure isn't "students are a
vulnerable group" under § 3 Abs. 4 — that's a weak, untested fit. It is `§ 4a Abs. 2`, which is a
**situational** test naming *"die **Angst** und die **Zwangslage** von Verbrauchern"* and *"die bewusste
Ausnutzung von konkreten Unglückssituationen"*. A generic "keep studying" nudge is fine. **"3 Tage bis zur
Klausur — jetzt Premium freischalten, Angebot endet in 2h"** combines all three things the provision names:
exploitation of an Angst/Zwangslage, timing chosen for maximum pressure, and a deadline that, if fabricated,
is separately per se unlawful under Anhang Nr. 7.

*One number to never repeat:* "dark patterns cost EU consumers €7.9 billion per year" is a misreading — the
SWD figure is post-redress detriment in the **digital environment as a whole**, not attributed to dark
patterns. *And hold both halves of this sentence:* the legal direction of travel is clear, but the
Commission's own Regulatory Scrutiny Board rated the Fitness Check *"POSITIVE WITH RESERVATIONS"*, finding
*"the quantitative analysis is mainly founded on opinion-based data"* and instructing that it *"should
refrain from stating or suggesting that the evidence base is robust."*

---

## 9. Concrete changes to this codebase

From the audit in [05-interface-craft.md](sources/05-interface-craft.md). Two of these are outright bugs.

| File | Now | Change | Why |
|---|---|---|---|
| [globals.css:39](../../src/app/globals.css#L39) | `font-family: Arial…` | remove, or use `var(--font-geist-sans)` | **Bug.** `next/font` loads Geist, then `body` hard-codes Arial after it. The site is very likely rendering in Arial |
| [interactive-document.css](../../src/components/documents/interactive-document.css) L29, 36, 89 | `var(--brand, #00338d)` | define `--brand` = `#db3627`, or fix the fallback | **Bug.** `--brand` is never defined, so student documents render **blue** headings inside the red-branded app |
| [globals.css](../../src/app/globals.css) | (absent) | add the `@media (prefers-reduced-motion: reduce)` block | §4 — zero occurrences repo-wide |
| [globals.css:26](../../src/app/globals.css#L26) | `0.65s ease-out` | `var(--dokum-dur-medium) var(--dokum-ease-enter)` | 650 ms is beyond M3 `long4` for a 12 px card entrance — ~3× too long by M3's own scale |
| [KursCard.tsx:17](../../src/components/kurse/KursCard.tsx#L17), [UnitCard.tsx:15](../../src/components/kurse/UnitCard.tsx#L15) | `transition-all` + 30 px `box-shadow` | `transition-[transform,border-color] duration-200` + opacity-animated shadow layer | `box-shadow` is paint-bound; web.dev names blur effects as the expensive case. Only `transform`/`opacity` stay composited |
| [UnitDetailClient.tsx:86](../../src/components/UnitDetailClient.tsx#L86) | `transition-[grid-template-rows] duration-300` | shorten to 200 ms | Animates a *layout* property every frame. The grid trick is still the cleanest auto-height approach — just shorter |
| `interactive-document.css` L46-49 | (absent) | `max-width: 70ch` on `p`, `li` | **Highest-leverage readability fix, and it's one declaration.** `/dokumente/[docId]` currently gives ~**100–110 characters per line** vs WCAG 1.4.8's 80 ceiling and Dyson & Haselgrove's best-performing 55. Leave `.formula-block`/`.image-block` full-width |
| `interactive-document.css` L46-53 | `p { margin: .8em 0 }` | `1.25em 0` | Paragraph spacing is currently **0.97× line spacing**, below the ≥1.5× AAA floor |
| `interactive-document.css` L96-105 | `.render-target` | reserve `min-height` before typeset | MathJax's LaTeX→SVG swap is a known CLS generator; the code already comments on the height change |
| six `loading.tsx` + `DocumentArticleSkeleton` | `animate-pulse` | covered by the global reduce-motion rule | §4 — SC 2.2.2, Level A |

**Two things already right, worth not breaking.** The skeletons mirror the real layout in the real positions,
which prevents layout shift — that justification is independent of the perceived-speed literature, which is
thinner than usually claimed (NN/g's skeleton-screen article rests on **one** ECCE'18 short paper and reports
no numbers, no effect size, no significance test). And `min-height: 44px` on `.student-input` plus the
explicit 24 px `.doc-link` padding already cite WCAG 2.5.8 in comments.

**One small navigation win.** [DocumentArticle.tsx:35-37](../../src/components/documents/DocumentArticle.tsx#L35-L37)
renders the breadcrumb as plain text. Correct that the current page isn't a link; the *ancestors* should be,
and `constants.ts` already exports `kursUrl()` and `unitUrl()`. This matters most in the **overlay**, where
the reader has lost sight of the page underneath — the component's own doc comment says exactly that.

**Dark mode: not a priority, and the evidence supports skipping it.** For readers with normal vision,
positive polarity generally wins (Piepenbrock 2013; Dobres 2017 found no daytime effect and a light-mode
advantage at night). Legge 1985 found a dark-mode advantage only for cloudy ocular media. It is a comfort and
accessibility feature for a specific minority, not a legibility upgrade for the median user — and here it
would be a tokenisation project across three CSS files with ~20 hard-coded hex values, not a class sweep.

**MathJax accessibility is mostly handled, and don't switch to MathML.** The assistive-MathML copy *is*
produced — that is why `globals.css:69-87` reproduces MathJax's own hiding CSS. What's missing is the speech/
explorer layer, which arrives in MathJax v4 via `aria-label` and doesn't depend on the screen reader
understanding MathML. That is a ticket, not a bump (v4 is ES6-module-first and the loader depends on exact
`window.MathJax`-before-import ordering). **Do not switch output to MathML**: `html2canvas` has no MathML
layout engine, and the exported PNG is the runtime fallback every student sees when live rendering fails.

---

## 10. Things that sound good but the evidence doesn't support

1. **Learning styles / the meshing hypothesis.** *Virtually no evidence*; several adequate studies flatly
   contradict it (Pashler et al. 2008; Rogowsky et al. 2015, 2020). **Dead.** No "Lerntyp" onboarding, no
   visual/auditory toggle.
2. **The learning pyramid** ("people remember 10% of what they read…"). Traced to **fabrication**, not data
   (Letrud & Hernes 2016, 2018). Never cite retention percentages by activity type.
3. **The Zeigarnik effect.** 2025 meta-analysis, 38 studies: interrupted:completed recall ratio **0.99** with
   and without Zeigarnik's own 1927 data; dz = 0.15. That is exactly chance. **But Ovsiankina survived** —
   67% resumption — so build the "Weitermachen" resume feature, which is the part that replicated.
4. **"Longhand beats typing."** Failed direct replication twice (Morehead 2019; Urry 2021). The
   verbatim-transcription *mechanism* replicated; the learning benefit did not. No reason to build handwriting
   input — but a reason to constrain note fields against verbatim capture.
5. **Highlighting as a study strategy.** Rated **Low utility** (Dunlosky et al. 2013); may **impair inference
   performance** (Peterson 1992) — which is exactly the question type economics exams use. *Honest correction:*
   Donoghue & Hattie (2021) put underlining at d = 0.44, so the real claim is **opportunity cost**, not zero.
   Ship it as navigation; convert highlights into retrieval items.
6. **"Feedback must be immediate."** The newest meta-analysis (51 studies, 160 ES, 1988–2024):
   **g = 0.03, CI [−0.08, 0.13], p = .61.** Timing is a **non-lever**. Don't build a delayed-feedback
   scheduler — spend it on feedback *content* (elaborated d = 0.49 vs correctness-only d = 0.05).
7. **Expanding-interval SRS as inherently superior.** Expanding beat equal intervals immediately but
   **reversed at delay** (Karpicke & Roediger 2007). What matters is that the **first** retrieval is delayed
   enough to be effortful. Don't over-engineer the ladder.
8. **"Interleave everything."** Sign-reverses by material: visual g = 0.67, **maths g = 0.34**, expository text
   non-significant, **word learning g = −0.39 — blocking is better** (Brunmair & Richter 2019). Interleave
   confusable problem types; block vocabulary.
9. **Loss aversion (λ ≈ 2).** Collapses to **λ = 1.07, n.s.** in the artefact-free cell (Yechiam & Zeif 2025).
   Delete it as a design rationale.
10. **Growth mindset as a feature.** See §6.
11. **Pre-quizzes as a general primer.** Prequestions help the prequestioned content (**g = .66**) and do
    essentially nothing for everything else (**g = .01**) (Pan & Carpenter 2023). Narrower than it sounds — one
    or two targeted pre-questions, not a pre-quiz.
12. **"80–95% of college students procrastinate."** Not Steel's finding — it's his citation to prior work,
    several of them dissertations. Steel's own result: procrastination correlates **r = −.19** with performance.
13. **Student satisfaction as a proxy for learning.** Students feel they learn *less* where they learn *more*
    (Deslauriers et al. 2019) and judge massing superior even after being shown otherwise (Kornell & Bjork 2008).
    **Actively misleading as a product metric.**

---

## 11. What to measure

Every mechanism that works makes students feel they learned less. If you optimise for in-session
satisfaction, you will systematically strip out the working mechanisms. Concretely:

- **Primary learning metric: delayed (≥48 h) re-test accuracy.** Never evaluate a study feature on immediate
  post-activity performance or session-end satisfaction — both are biased toward restudy.
- **Never accept a week-1 engagement lift as evidence.** Kizilcec et al. (2020), ~250,000 students across 247
  courses, showed exactly that metric moving with **no detectable effect on completion** — and a pilot effect
  of **24 pp at n = 64** collapsing to **0.25 pp at n = 12,879**.
- **Instrument perceived pressure and perceived exam-readiness**, not just retention. Otherwise you cannot
  distinguish learning from counter-feeding.
- **Show the student their delayed accuracy trend**, so the metric they see matches the metric you optimise.
  Interleaving will make in-session accuracy and NPS go *down* while learning goes up — decide before launch
  that you will not A/B-test it on those.
- **A note on the trough.** A German semester is ~14–15 weeks, and gamification effects follow a U-shape:
  decline starting around **week 4**, lasting 2–6 weeks, then partial recovery via familiarisation (Rodrigues
  et al. 2022, 756 STEM students). That trough lands exactly when semester content gets hard. Plan to shift
  from novelty to utility there — exam countdown, gap analysis, "these are the 6 concepts you still can't do."

---

## 12. Gaps and unverified claims

Listed so nobody later mistakes absence of evidence for evidence. Per-section gap lists live in the source
files; the ones that matter most:

- **No peer-reviewed RCT of a streak mechanic on university students exists** — in either direction. The
  case in §6 is a theory-grounded prior.
- **No first-party German survey** measures university students' willingness to pay for exam-prep material.
  Confirmed by full-text grep, not a search failure.
- **No peer-reviewed source gives a typical study-session length**, in any language. The "25–50 minute block"
  claim has no primary source; Pomodoro is a productivity convention.
- **No direct peer-reviewed smartphone-vs-desktop comparison** on identical learning tasks.
- **BFSG scope** — three genuine legal uncertainties in §4, all needing a lawyer.
- **Whether push notifications are "elektronische Post"** under ePrivacy Art 2(h) / `§ 7 Abs. 2 Nr. 2 UWG` —
  **no German case law on app push found**, and that is a negative finding from direct primary-source
  interrogation (dejure citators, vzbv's full sitemap, BGH press releases), not from exhaustive keyword
  search. "None found", not "none exists".
- **Login walls on cancellation** — pending at the BGH, hearing **5 November 2026**. Lower courts say
  unlawful; the BGH has not ruled.
- **Whether a per-Unit one-time purchase is a Dauerschuldverhältnis** under § 312k Abs. 1 — turns on the
  actual contract terms and needs German counsel.
- **Official BGH Leitsätze were not retrieved verbatim** for VI ZR 225/17, VI ZR 134/15, I ZR 25/19,
  I ZR 7/16 and I ZR 161/24 — existence, court, date, Aktenzeichen and substance are verified from multiple
  sources including official ones, but not the exact headnote wording. Three vzbv-hosted lower-court
  judgments are image-only scans; **do not cite LG Hildesheim (Digistore24), LG München I 10.10.2023 or
  LG Frankfurt a. M. 23.10.2025 with an Aktenzeichen you have not confirmed yourself.**
- **DSA Art. 25's operative text** was not retrieved — only recital 67. The **Digital Fairness Act's**
  legislative status is unverified; treat it as direction of travel, not law.
- **The Doherty threshold's "400 ms"** — bibliographically verified at the Computer History Museum (IBM, Nov
  1982, 12 pp), but the number itself could not be checked against the paper's text, and the common "IBM
  Systems Journal" attribution appears wrong.
- **Mis-citation traps documented in the sources**, briefly: Profiling Institut's "Mathematik 44% dropout"
  conflicts with DZHW's 59% (use DZHW); the "59%/44% GenAI" pairing is Tyton Partners, not EDUCAUSE; Kornell &
  Bjork (2007) contains no cramming item; "Duolingo's streak lifted retention 12%→55%" is a gamification
  vendor's claim, not Duolingo's.

Where a full-text PDF would not extract, figures were taken from abstracts or publisher records and marked as
such in the source files. One PDF extraction that produced numbers contradicting a verified abstract was
discarded rather than reported.
