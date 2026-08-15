# Part 1 — Learning science: interface-expressible mechanisms that actually increase study capability

Scope: German-language study platform, university students 19–25, economics/business + mathematics.
Date of research pass: 2026-08-15.

## Sourcing notes (read this first)

- Effect sizes below were taken from **journal abstract pages, publisher record pages (Springer/SAGE/ERIC/WWC), or the abstract text surfaced by search**. Full-text PDFs from `files.eric.ed.gov`, `gwern.net`, `ies.ed.gov`, `augmentingcognition.com` and `bjorklab.psych.ucla.edu` would not convert to text in this environment, so **no number below is quoted from a full-text PDF read in this pass**. Where a PDF-derived figure looked plausible but could not be cross-checked against an abstract, it was discarded — one such attempt (Rohrer et al. 2020) produced numbers that contradicted the verified abstract, so the verified abstract figures are used.
- Citations marked **[record-only]** were confirmed via bibliographic index (ERIC/CrossRef/publisher listing) but the volume/page detail was not read off the article itself.
- Everything is peer-reviewed unless explicitly labelled otherwise. The single NN/g item is explicitly labelled practitioner research.

---

# 1. Retrieval practice / the testing effect

## 1.1 The core effect

**What the evidence says.** In the founding demonstration, students read prose passages and either restudied or took free-recall tests without feedback. At a 5-minute delay restudy won; at 2 days and 1 week testing won. Abstract wording: *"When the final test was given after 5 min, repeated studying improved recall relative to repeated testing. However, on the delayed tests, prior testing produced substantially greater retention than studying."* The crossover — study looks better immediately, testing wins at delay — is the single most important structural fact about the effect.

**Source.** Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science*, 17(3), 249–255. DOI 10.1111/j.1467-9280.2006.01693.x. https://pubmed.ncbi.nlm.nih.gov/16507066/

**Confidence.** Strong.

**UI implication.** Never evaluate a study feature on immediate post-activity performance or on session-end satisfaction — both are biased toward restudy. Instrument delayed (≥48h) re-test accuracy as the product's primary learning metric.

---

**What the evidence says.** Meta-analysis of 159 effect sizes comparing retrieval practice with restudy: **g = 0.50, 95% CI [0.42, 0.58]**, with 81% of comparisons favouring retrieval. Moderator: initial **recall** tests produce larger benefits than **recognition** tests, consistent with an effortful-processing account.

**Source.** Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. *Psychological Bulletin*, 140(6), 1432–1463. https://pubmed.ncbi.nlm.nih.gov/25150680/

**Confidence.** Strong.

**UI implication.** Prefer free-recall / short-answer / "type the next step" inputs over multiple choice where the answer can be graded; MC is the fallback, not the default.

---

**What the evidence says.** Second, larger meta-analysis: 272 independent effect sizes from 188 experiments. Practice testing vs **restudy g = 0.51**; vs **filler/no activity g = 0.93**. Format moderator points the other way from Rowland: **multiple-choice g = 0.70 > short-answer g = 0.48** in this dataset.

**Source.** Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research*, 87(3), 659–701. DOI 10.3102/0034654316689306. https://journals.sagepub.com/doi/abs/10.3102/0034654316689306

**Confidence.** Strong for the main effect; **contested** for format. Rowland and Adesope disagree on whether recall or MC format wins. Do not build a product claim on format superiority.

**UI implication.** Any retrieval is worth far more than none (g = 0.93 vs filler). Ship the easy MC path first; treat "recall beats recognition" as an unresolved optimisation, not a requirement.

## 1.2 Does it hold for maths and for conceptual/economics material?

**What the evidence says — the maths caveat, and it is serious.** A 2025 meta-analysis restricted to *mathematics* found only **7 studies / 32 effect sizes** manipulating testing vs restudy, with weighted mean **g = 0.18 and a 95% CI crossing zero**. Authors' own words: *"the current literature does not provide conclusive evidence for a consistent effect of retrieval practice for mathematics learning."* (Same paper's spacing results are much healthier — see §2.)

**Source.** Murray, E., Horner, A. J., & Göbel, S. M. (2025). A meta-analytic review of the effectiveness of spacing and retrieval practice for mathematics learning. *Educational Psychology Review*, 37, 75. DOI 10.1007/s10648-025-10035-1. https://link.springer.com/article/10.1007/s10648-025-10035-1

**Confidence.** The *absence* of a proven maths testing effect is moderate-to-strong; the *presence* of one is weak. Blunt version: the testing effect is a verbal-memory finding that has not yet been demonstrated to transfer reliably to mathematical problem-solving.

---

**What the evidence says — the theoretical reason.** Van Gog & Sweller argued the testing effect shrinks and can vanish as **element interactivity** (the number of simultaneously interacting information elements — high in algebra, derivations, multi-step optimisation) rises. Karpicke & Aue's rebuttal in the same issue is that element interactivity has no quantitative metric and that Van Gog & Sweller mis-rated prior experiments. The dispute is unresolved.

**Sources.** van Gog, T., & Sweller, J. (2015). Not new, but nearly forgotten: The testing effect decreases or even disappears as the complexity of learning materials increases. *Educational Psychology Review*, 27(2), 247–264. https://eric.ed.gov/?id=EJ1062030 — and Karpicke, J. D., & Aue, W. R. (2015). The testing effect is alive and well with complex materials. *Educational Psychology Review*, 27, 317–326. https://link.springer.com/article/10.1007/s10648-015-9309-3

**Confidence.** Contested — genuinely, in print, between the two leading camps.

**UI implication.** Do not model a maths derivation as a flashcard. Reserve pure retrieval for the *low-interactivity* layer (definitions, formula statements, Lagrange conditions, elasticity definitions, notation) and use worked-example fading (§5) for the *high-interactivity* layer (multi-step solutions).

---

**What the evidence says — strategy depends on the knowledge type.** Direct head-to-head: retrieval practice outperformed worked examples when the goal was remembering the *content* of a worked example (facts, stable knowledge) after a 1-week delay; worked examples outperformed retrieval for acquiring flexible *procedures* and schema induction.

**Source.** Yeo, D. J., & Fazio, L. K. (2019). The optimal learning strategy depends on learning goals and processes: Retrieval practice versus worked examples. *Journal of Educational Psychology*, 111(1), 73–90.

**Confidence.** Moderate (single well-designed paper, not a meta-analysis).

**UI implication.** Two distinct content types in the data model: *facts to be retrieved* and *procedures to be faded*. Do not let authors put a derivation into the flashcard type.

## 1.3 Transfer — does testing buy anything beyond the tested item?

**What the evidence says.** 192 transfer effect sizes, 122 experiments, N = 10,382, 40 years of research: testing yields transferable learning at **d = 0.40, 95% CI [0.31, 0.50]** vs a non-testing re-exposure control. Transfer is **strongest across test formats and to application and inference questions**; it is **weakest to rearranged stimulus–response items and to untested material seen during study**.

**Source.** Pan, S. C., & Rickard, T. C. (2018). Transfer of test-enhanced learning: Meta-analytic review and synthesis. *Psychological Bulletin*, 144(7), 710–756. https://pubmed.ncbi.nlm.nih.gov/29733621/

**Confidence.** Strong.

**UI implication.** Two hard constraints: (a) quizzing item X does **not** meaningfully strengthen adjacent untested material, so coverage must be explicit — every learning objective needs its own item; (b) *do* write application/inference items, because transfer to that question type is where the effect is strongest.

## 1.4 Classroom evidence (not the lab)

**What the evidence says.** Three experiments in real 6th-grade social-studies classes, using the course's own material and the students' real graded exams, found low-stakes multiple-choice quizzing improved long-term retention of quizzed content.

**Source.** Roediger, H. L., III, Agarwal, P. K., McDaniel, M. A., & McDermott, K. B. (2011). Test-enhanced learning in the classroom: Long-term improvements from quizzing. *Journal of Experimental Psychology: Applied*, 17(4), 382–395. https://pdf.retrievalpractice.org/guide/Roediger_Agarwal_etal_2011_JEPA.pdf

**Confidence.** Strong for the finding; note the population is school pupils, not university economics students.

**UI implication.** Low-stakes, ungraded, repeated. Do not attach grades or leaderboards to retrieval items — the classroom evidence is for low-stakes quizzing, and stakes add anxiety without evidence of benefit.

---

**Institutional synthesis.** The IES expert panel rated **"Use quizzes to re-expose students to key content" as STRONG evidence** — one of only two Strong ratings in the whole guide.

**Source.** Pashler, H., Bain, P., Bottge, B., Graesser, A., Koedinger, K., McDaniel, M., & Metcalfe, J. (2007). *Organizing Instruction and Study to Improve Student Learning* (NCER 2007-2004). Institute of Education Sciences, U.S. Dept of Education. https://ies.ed.gov/ncee/wwc/PracticeGuide/1 · PDF: https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/20072004.pdf

**Confidence.** Strong (this *is* the government synthesis, with its own published evidence rating).

## 1.5 Feedback timing after a retrieval attempt — the most contested item in this report

**What the evidence says (pro-delay).** Students read 12 prose passages, took MC tests, and got feedback either immediately or after a delay. **Delayed feedback produced better final-test performance than immediate feedback.** Feedback *type* (show correct answer vs answer-until-correct) did not matter. The authors' explanation is that delaying feedback spaces the re-presentation of the information.

**Source.** Butler, A. C., Karpicke, J. D., & Roediger, H. L., III (2007). The effect of type and timing of feedback on learning from multiple-choice tests. *Journal of Experimental Psychology: Applied*, 13(4), 273–281. DOI 10.1037/1076-898X.13.4.273. https://eric.ed.gov/?id=EJ783077

**Confidence (pro-delay).** Moderate — replicated in related work (e.g. Metcalfe, Kornell & Finn, 2009, *Memory & Cognition*, delayed vs immediate feedback in vocabulary learning **[record-only]**), but see the meta-analysis directly below.

---

**What the evidence says (null).** The most recent meta-analysis, and the first direct immediate-vs-delayed comparison since 1988, covering **51 studies (1988–2024), 160 effect sizes**, meta-regression with robust variance estimation: *"feedback timing does not significantly influence learning outcomes on average (g = 0.03, 95% CI [−0.08, 0.13], p = .61)."* Educational level, learning domain and response-time constraints moderated. Stated limitation: few studies used delays of a day or more.

**Source.** Kandemir, E. N., Esposito, E., Gurgand, L., & Ramus, F. (2026). A meta-analysis of the impact of feedback timing on learning outcomes in computer-assisted learning. *Educational Psychology Review*, 38, 13. DOI 10.1007/s10648-026-10117-8. https://link.springer.com/article/10.1007/s10648-026-10117-8

**Confidence.** Contested → practically, **treat feedback timing as a non-lever**.

**UI implication.** Do not spend engineering effort building a delayed-feedback scheduler. Show feedback immediately (it is simpler, and costs ~nothing in learning terms). Spend that effort on feedback *content* instead — see next.

---

**What the evidence says (content beats timing).** Meta-analysis of item-based feedback in computer-based environments, 40 studies / 70 effect sizes (range −0.78 to 2.29): **elaborated feedback (an explanation) d = 0.49**, **knowledge-of-correct-response d = 0.32**, **knowledge-of-result (right/wrong only) d = 0.05**. Elaborated feedback was especially superior for **higher-order** outcomes, and effect sizes were **larger for mathematics** than for social sciences, science or languages.

**Source.** Van der Kleij, F. M., Feskens, R. C. W., & Eggen, T. J. H. M. (2015). Effects of feedback in a computer-based learning environment on students' learning outcomes: A meta-analysis. *Review of Educational Research*, 85(4), 475–511. DOI 10.3102/0034654314564881. https://eric.ed.gov/?id=EJ1081708

**Confidence.** Strong.

**UI implication.** A red X with the right answer is worth almost nothing (d = 0.05). Every wrong answer must render a *worked explanation* of why the answer is wrong and what principle applies. This is the single highest-leverage feedback decision, and it is a content-authoring requirement, not a scheduling one.

---

**What the evidence says (confidence-weighted feedback).** Errors made with **high confidence** are corrected by feedback *more* reliably than low-confidence errors — the hypercorrection effect. Proposed mechanism: attention to feedback increases when it conflicts with a confident prior.

**Source.** Butterfield, B., & Metcalfe, J. (2001). Errors committed with high confidence are hypercorrected. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 27(6), 1491–1494. https://pubmed.ncbi.nlm.nih.gov/11713883/ (persistence over a week: Butterfield & Metcalfe follow-up, *Psychonomic Bulletin & Review*, https://link.springer.com/article/10.3758/s13423-011-0173-y)

**Confidence.** Strong (described as highly replicable across independent groups).

**UI implication.** Add a one-tap confidence slider ("sicher / unsicher") to each answer. Confidently-wrong answers are your highest-yield feedback moments — surface the full explanation there and re-queue that item soon.

---

# 2. Spacing / distributed practice

**What the evidence says.** The canonical meta-analysis covered **839 assessments in 317 experiments across 184 articles**. Its central structural finding is not "space more" but: **inter-study interval (ISI) and retention interval (RI) operate jointly — the ISI producing maximal retention increases as RI increases.** There is no single optimal gap.

**Source.** Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354–380. https://escholarship.org/uc/item/3rr6q10c

**Confidence.** Strong. Caveat the authors themselves flag by their title: this is *verbal recall*.

---

**What the evidence says — the actual ratios.** N > 1,350, gaps up to 3.5 months, final tests up to 1 year later. At any given retention interval, increasing the gap first *increases* then gradually *reduces* test performance — an inverted-U "ridgeline". Expressed as a proportion of test delay, the **optimal gap declines from roughly 20–40% of a 1-week delay to roughly 5–10% of a 1-year delay**; the widely quoted summary figure is ~20% for delays of a few weeks falling to ~5% at one year.

**Source.** Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science*, 19(11), 1095–1102. https://escholarship.org/uc/item/0kp5q19x · https://eric.ed.gov/?id=ED505660

**Confidence.** Strong for the shape of the function; moderate for any single ratio (the optimum is broad and the reported band is 5–40% depending on delay).

**UI implication — this is directly the "review in N days" feature.** Schedule the gap off the *exam date the student enters*, not off a fixed SRS constant:
- Klausur in 4 weeks → review gap ≈ 4–7 days.
- Klausur in 12 weeks → review gap ≈ 8–17 days.
- "Keep for the Bachelorarbeit / next year" → gap ≈ 3–5 weeks.
Ask for the target date in onboarding. A product that schedules on a fixed 1/3/7/14 ladder regardless of exam date is ignoring the only robust quantitative result in this literature.

---

**What the evidence says — spacing in maths specifically.** Overall spaced vs massed in mathematics: **g = 0.28** (27 studies, 53 effect sizes). Split by design: **isolated material g = 0.43** (10 studies), **course-embedded g = 0.24** (17 studies). Authors: *"spaced practice can improve mathematics learning for material in isolation and within a course. However, the effect may be smaller than in other domains."*

**Source.** Murray, Horner & Göbel (2025), as above. DOI 10.1007/s10648-025-10035-1

**Confidence.** Strong that spacing works in maths; strong that it is **smaller than the headline verbal-domain numbers**. Do not market "2× retention".

---

**What the evidence says — expanding vs equal intervals.** Expanding retrieval schedules (the intuition behind most SRS products) beat equal-interval schedules on an *immediate* final test, but the pattern **reversed at a 2-day delay**: equally spaced retrieval produced better long-term retention. The authors concluded that the **placement of the first retrieval attempt** matters more than the expansion pattern — the first attempt should be delayed enough to be effortful.

**Source.** Karpicke, J. D., & Roediger, H. L., III (2007). Expanding retrieval practice promotes short-term retention, but equally spaced retrieval enhances long-term retention. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 33(4), 704–719 **[record-only]**. https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JEPLMC.pdf

**Confidence.** Moderate-to-strong; it directly contradicts the folk model behind expanding-interval SRS.

**UI implication.** Do not ship an aggressively expanding ladder. Equal-ish intervals are at least as good long-term. Concentrate design effort on making the **first** review land after a real delay (hours-to-days), not minutes.

---

**What the evidence says — personalised scheduling actually works in a real course.** A semester-long middle-school foreign-language course with retrieval-practice software combined individual-difference inference with a memory model: personalised review produced a **16.5% boost in end-of-course retention over massed study** and a **10.0% improvement over a one-size-fits-all spaced schedule**.

**Source.** Lindsey, R. V., Shroyer, J. D., Pashler, H., & Mozer, M. C. (2014). Improving students' long-term knowledge retention through personalized review. *Psychological Science*, 25(3), 639–647 **[record-only pages]**. DOI 10.1177/0956797613504302. https://pubmed.ncbi.nlm.nih.gov/24444515/

**Confidence.** Moderate-to-strong (single large field study, but it is the field study everyone cites).

**UI implication.** Personalisation is worth ~10 points over generic spacing — real, but it is the *second* 10 points. Ship generic spacing keyed to exam date first; per-item personalisation later.

---

**Institutional synthesis.** IES rated **"Space learning over time" — MODERATE evidence**.

**Source.** Pashler et al. (2007), IES Practice Guide, Recommendation 1. https://ies.ed.gov/ncee/wwc/PracticeGuide/1

---

# 3. Interleaving

**What the evidence says — the maths-specific studies.** Rohrer & Taylor's original: college students practised maths problems either massed or spaced (Exp. 1) or blocked-by-type vs randomly mixed (Exp. 2); **both experiments favoured the shuffled format** on a test one week later.

**Source.** Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science*, 35(6), 481–498. DOI 10.1007/s11251-007-9015-8. https://eric.ed.gov/?id=EJ786797 (the author's own PDF host, `uweb.cas.usf.edu`, refused connection during this pass, so the numeric detail of Exp. 2 was not read)

**Confidence.** Strong for direction; **weak** on my ability to report its exact effect sizes.

---

**What the evidence says — effect sizes in school maths.** 126 seventh-graders received identical practice problems over three months, arranged interleaved or blocked. Interleaved practice produced higher scores on both tests: **d = 0.42 at a 1-day delay and d = 0.79 at a 30-day delay.** The benefit *grows* with delay.

**Source.** Rohrer, D., Dedrick, R. F., & Stershic, S. (2015). Interleaved practice improves mathematics learning. *Journal of Educational Psychology*, 107(3), 900–908. https://eric.ed.gov/?id=ED557355

**Confidence.** Strong.

---

**What the evidence says — the randomised controlled trial.** 54 seventh-grade maths classes periodically completed interleaved or blocked assignments over four months; both groups then did an interleaved review assignment. **One month later, on an unannounced test, the interleaved group scored 61% vs the blocked group's 38%, d = 0.83.**

**Source.** Rohrer, D., Dedrick, R. F., Hartwig, M. K., & Cheung, C.-N. (2020). A randomized controlled trial of interleaved mathematics practice. *Journal of Educational Psychology*, 112(1), 40–52. DOI 10.1037/edu0000367. https://www.semanticscholar.org/paper/dc2f2a8e2989a54c87e8ae73a5fed46c720fc665

**Confidence.** Strong — this is a cluster-randomised field trial with a large effect, the best single piece of evidence in this whole document for a maths product.

---

**What the evidence says — the boundary conditions, which are severe.** Meta-analysis of 59 studies / 238 effect sizes / 158 samples: overall **g = 0.42**, but wildly moderated by material:
- paintings and other visual category material: **g = 0.67**
- **mathematics tasks: g = 0.34** (small)
- expository texts and tastes: **non-significant**
- **word learning: g = −0.39 — blocking is BETTER**

Authors' conclusion: interleaving fosters inductive learning *but the setting and material type must be considered*.

**Source.** Brunmair, M., & Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. *Psychological Bulletin*, 145(11), 1029–1052. DOI 10.1037/bul0000209. Preprint: https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf

**Confidence.** Strong.

**UI implication.** Interleave **problem types** (maths, and by extension similar-but-confusable econ models: Cournot vs Bertrand vs Stackelberg, substitution vs income effect, different elasticity cases). Do **not** interleave vocabulary/terminology decks — that is the g = −0.39 case. This is a per-content-type switch, not a global setting.

---

**What the evidence says — the perception problem, which is the product-killer.** In the induction study that launched the modern literature, learners studied paintings massed or interleaved. Interleaving produced better classification of new works by the same artists, yet **the overwhelming majority of participants believed massing had helped them more** — and later work found learners still report believing blocking is better even *after* taking the test that proves otherwise. Rohrer's maths work shows the parallel: performance *during* blocked practice looks better, while performance on the delayed test is worse.

**Source.** Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the "enemy of induction"? *Psychological Science*, 19(6), 585–592. https://web.williams.edu/Psychology/Faculty/Kornell/Publications/Kornell.Bjork.2008a.pdf

**Confidence.** Strong.

**UI implication.** Interleaving will make your NPS and in-session accuracy go **down** while learning goes up. Decide before launch that you will not A/B-test interleaving on session satisfaction or on practice-phase accuracy. Consider showing the student their *delayed* accuracy trend so the metric they see matches the metric you optimise.

---

**Institutional synthesis.** IES rated **"Interleave worked example solutions with problem-solving exercises" — MODERATE evidence** (Recommendation 2).

---

# 4. Cognitive Load Theory and Mayer's multimedia principles — what each one forbids

Mayer's own per-principle medians (from his 2017 review of his lab's comparisons) are listed first, then the **independent meta-analysis** where one exists. Where they diverge, trust the meta-analysis: Mayer's medians come from small numbers of controlled lab comparisons in his own programme.

**Mayer's medians.** multimedia d = 1.67; temporal contiguity d = 1.30; redundancy d = 0.87; spatial contiguity d = 0.79; personalization d = 0.79; modality d = 0.72; coherence d = 0.70; segmenting d = 0.70; signalling d = 0.46; pre-training d = 0.46.
**Source.** Mayer, R. E. (2017). Using multimedia for e-learning. *Journal of Computer Assisted Learning*, 33(5), 403–423. DOI 10.1111/jcal.12197. https://eric.ed.gov/?id=EJ1153516
**Confidence.** Moderate — narrative aggregation of the author's own programme, not an independent meta-analysis.

### 4.1 Split-attention / spatial contiguity

**Evidence.** Random-effects meta-analysis, **58 independent comparisons, n = 2,426, g = 0.63, p < .001**, favouring integrated designs (related words and pictures placed physically together).
**Source.** Schroeder, N. L., & Cenkci, A. T. (2018). Spatial contiguity and spatial split-attention effects in multimedia learning environments: A meta-analysis. *Educational Psychology Review*, 30(3), 679–701. DOI 10.1007/s10648-018-9435-9. https://eric.ed.gov/?id=EJ1186641
**Confidence.** Strong.
**Forbids.** A legend/key below a diagram. A footnote explaining a symbol used three screens up. A graph on the left and its interpretation in a right-hand sidebar. Any layout where the student must hold one representation in working memory while their eyes travel to another. **Labels go inside the figure; variable definitions go inline with the equation that uses them.**

### 4.2 Redundancy

**Evidence.** d = 0.87 (Mayer 2017) for removing redundant on-screen text that duplicates narration.
**Source.** Mayer (2017), as above; original: Mayer, R. E., Heiser, J., & Lonn, S. (2001), *Journal of Educational Psychology* **[record-only]**.
**Confidence.** Moderate.
**Forbids.** Narrated video that also displays the narration as on-screen text. A "summary box" that restates the paragraph directly above it. Duplicate captioning of a formula in prose ("i.e., we divide both sides by 2") *when the step is already shown symbolically* — for an expert student that duplication is load, not help (see 4.6).

### 4.3 Signalling (cueing)

**Evidence.** 103 studies, N = 12,201, 139 retention and 70 transfer measures: **retention g+ = 0.53 [0.42, 0.64]**, **transfer g+ = 0.33 [0.22, 0.43]**; signalling also **significantly reduced cognitive load** and changed eye fixations.
**Source.** Schneider, S., Beege, M., Nebel, S., & Rey, G. D. (2018). A meta-analysis of how signaling affects learning with media. *Educational Research Review*, 23, 1–24. https://www.sciencedirect.com/science/article/abs/pii/S1747938X17300581
**Confidence.** Strong.
**Prescribes.** Colour/weight/arrow cues that mark *which* term changed between derivation lines; highlighting the substituted variable; a persistent marker on the term currently under discussion. Signalling is cheap to build and has one of the better-evidenced effect sizes here.

### 4.4 Segmenting

**Evidence.** 56 investigations, 88 pairwise comparisons: **small-to-medium significant effects on retention and transfer**, plus **reduced overall cognitive load** and **increased learning time**. All four effects confirmed for system-paced formats. Moderator, and it is counter-intuitive: **learners with HIGH prior knowledge benefited more from segmenting on retention** than low/no prior-knowledge learners.
**Source.** Rey, G. D., Beege, M., Nebel, S., Wirzberger, M., Schmitt, T. H., & Schneider, S. (2019). A meta-analysis of the segmenting effect. *Educational Psychology Review*, 31, 389–419. DOI 10.1007/s10648-018-9456-4. https://link.springer.com/article/10.1007/s10648-018-9456-4
**Confidence.** Strong for the main effect; the prior-knowledge moderator is a single meta-analytic finding — moderate.
**Prescribes.** Break every derivation and every long explanation into learner-advanced segments (a "Weiter" per step). Budget for the increased time-on-task: segmenting makes sessions *longer*, which will look bad on an efficiency dashboard.

### 4.5 Coherence / seductive details

**Evidence.** 68 studies. Seductive details (interesting but irrelevant text, images, anecdotes, animation) produce a **small but statistically significant negative effect: overall g = −0.16; comprehension g = −0.19; recall g = −0.17; transfer g = −0.12**. Mediation analysis: the damage runs through **increased extraneous cognitive load**; intrinsic and germane load were not significant mediators.
**Source.** Sundararajan, N., & Adesope, O. (2020). Keep it coherent: A meta-analysis of the seductive details effect. *Educational Psychology Review*, 32, 707–734. DOI 10.1007/s10648-020-09522-4. https://link.springer.com/article/10.1007/s10648-020-09522-4
**Confidence.** Strong that the sign is negative; the magnitude is small (−0.16), so this is a "don't add it" rule, not a "rip everything out" emergency.
**Forbids.** Decorative hero illustrations on lesson pages. Animated transitions between derivation steps that convey no information. "Fun fact" boxes and celebrity-economist anecdotes beside the content. Confetti/mascot animations on correct answers *inside the learning surface*. The mechanism is extraneous load, so anything that competes for attention during encoding is in scope — motion is worse than static.

### 4.6 Expertise reversal

**Evidence.** Instructional techniques that reduce extraneous load and are highly effective for novices — worked examples, extra guidance, integrated explanatory text — **lose effectiveness and can become harmful as learners gain domain knowledge**, because the now-redundant support itself imposes working-memory load.
**Source.** Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist*, 38(1), 23–31. DOI 10.1207/S15326985EP3801_4. https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4
**Confidence.** Strong.
**Prescribes.** Scaffolding must be *removable*, and removal must be driven by measured performance, not by a user toggle in settings that nobody finds. This is the theoretical justification for fading (§5) and it means a static "beginner-friendly" layout is actively wrong for the student in week 10.

---

# 5. Worked examples → faded / completion problems

**What the evidence says — the base effect, in mathematics.** Meta-analysis screening 8,033 abstracts down to 43 articles / 55 studies / **181 effect sizes**, elementary through post-secondary. Robust variance estimation gives **g = 0.48** for worked examples on mathematics performance. Moderators examined: example type (correct vs incorrect vs both), pairing with self-explanation prompts, and timing (practice vs skill acquisition).

**Source.** Barbieri, C. A., Miller-Cotto, D., Clerjuste, S. N., & Chawla, K. (2023). A meta-analysis of the worked examples effect on mathematics performance. *Educational Psychology Review*, 35, 11. DOI 10.1007/s10648-023-09745-1. https://eric.ed.gov/?id=EJ1364058

**Confidence.** Strong. Note the contrast with §1.2: **for maths, worked examples have a demonstrated g = 0.48 while retrieval practice has an unproven g = 0.18.** For a maths/econ product this reverses the usual "retrieval practice is king" prior.

---

**What the evidence says — the fading procedure.** Worked examples are superior in the *early* stages of skill acquisition; problem solving is superior *later*. Renkl & Atkinson's proposal is a **fading procedure**: start from a fully worked example, then successively replace worked steps with blanks the learner must complete, until the learner is solving unaided. **Backward fading** (remove the *last* step first, then the second-to-last, …) outperformed conventional example–problem pairs on near transfer.

**Source.** Renkl, A., & Atkinson, R. K. (2003). Structuring the transition from example study to problem solving in cognitive skill acquisition: A cognitive load perspective. *Educational Psychologist*, 38(1), 15–22. DOI 10.1207/S15326985EP3801_3. https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_3

**Confidence.** Strong for fading in general; **moderate** for backward-specifically.

---

**What the evidence says — fading alone is not enough.** Fading worked-out steps reliably improves **near** transfer but **not far** transfer. Combining fading with **prompts that make the learner name the underlying principle** produced medium-to-large effects on **both near and far transfer, without additional time on task** (two experiments).

**Source.** Atkinson, R. K., Renkl, A., & Merrill, M. M. (2003). Transitioning from studying examples to solving problems: Effects of self-explanation prompts and fading worked-out steps. *Journal of Educational Psychology*, 95(4), 774–783. DOI 10.1037/0022-0663.95.4.774. https://asu.elsevierpure.com/en/publications/transitioning-from-studying-examples-to-solving-problems-effects-/

**Confidence.** Strong. This is the most directly buildable finding in the whole document.

**UI implication (the concrete feature).** A derivation is authored **once, as a complete solution with each step tagged by principle**. The renderer then produces a ladder for the same derivation:
1. all steps shown;
2. last step blanked, learner completes it;
3. last two blanked; … until only the problem statement remains.
At each blanked step, render a **required one-line prompt: "Welches Prinzip wird hier angewendet?"** with either a free-text box or a principle picker. Without that prompt you get near transfer only.

---

**What the evidence says — incorrect examples.** In real Algebra I classrooms using a Cognitive Tutor, students randomly assigned to explain **worked examples (including incorrect ones)** during guided practice showed improved *conceptual* understanding relative to guided practice alone.

**Source.** Booth, J. L., Lange, K. E., Koedinger, K. R., & Newton, K. J. (2013). Using example problems to improve student learning in algebra: Differentiating between correct and incorrect examples. *Learning and Instruction*, 25, 24–34. https://www.sciencedirect.com/science/article/abs/pii/S0959475212000904 · ERIC full text: https://files.eric.ed.gov/fulltext/ED543090.pdf

**Confidence.** Moderate-to-strong.

**UI implication.** Add a content type: **"Fehlerhafte Lösung"** — show a plausible wrong derivation and ask the student to locate and explain the faulty step. This is cheap to author (invert an existing correct derivation) and targets the conceptual-understanding gap that pure procedure practice misses.

---

**Institutional synthesis.** IES Recommendation 2: **"Interleave worked example solutions with problem-solving exercises" — MODERATE evidence.** Note it pairs worked examples *with* interleaving, not as alternatives.

---

# 6. Desirable difficulties

**What the evidence says.** Bjork & Bjork's framework: conditions of practice that **slow apparent acquisition and depress performance during learning** (spacing, interleaving, retrieval instead of restudy, generation, varied conditions) often **enhance long-term retention and transfer**. Their standing caveat is that a difficulty is desirable **only if the learner can respond to it successfully**; where the learner lacks the background knowledge or skill to meet the difficulty, it becomes an undesirable difficulty.

**Source.** Bjork, E. L., & Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. In M. A. Gernsbacher et al. (Eds.), *Psychology and the Real World* (pp. 56–64). Worth. · Bjork, R. A., & Bjork, E. L. (2020). Desirable difficulties in theory and practice. *Journal of Applied Research in Memory and Cognition*, 9(4), 475–479. https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf
**Caveat:** neither PDF converted to text in this pass, so **the "only if the learner can respond successfully" condition is reported from the framework as summarised across the sources above, not as a verbatim quote I read.** Treat the specific wording as unverified; the *substance* is independently corroborated below.

**Confidence.** The framework: strong. The verbatim boundary statement: **weakly sourced in this pass** — but the boundary itself is well corroborated:

**Independent corroboration of where difficulty backfires:**
- **Expertise/prior knowledge is the moderator.** Kalyuga et al. (2003) — support that helps novices harms experts, and the reverse holds for removing support. https://www.tandfonline.com/doi/abs/10.1207/S15326985EP3801_4
- **High element interactivity kills the testing effect.** van Gog & Sweller (2015). https://eric.ed.gov/?id=EJ1062030
- **Interleaving reverses sign on the wrong material.** Brunmair & Richter (2019): words g = −0.39. DOI 10.1037/bul0000209
- **Segmenting helped high-prior-knowledge learners more, not less.** Rey et al. (2019). DOI 10.1007/s10648-018-9456-4

**UI implication.** Gate every difficulty on demonstrated competence at the easier level. Concretely: a student may only be shown an interleaved/faded/unsupported version of a problem type after they have completed the fully-worked version correctly. Never apply desirable difficulties to a first encounter with high-interactivity material — for a first pass at Lagrange optimisation, the difficulty is undesirable.

**Cost to be budgeted for.** Desirable difficulties make students feel they are learning less. In a controlled comparison in large introductory physics courses, students in active-learning conditions **learned more but reported feeling they learned less** than in a polished passive lecture. Any UI that adds difficulty must expect satisfaction to fall.
**Source.** Deslauriers, L., McCarty, L. S., Miller, K., Callaghan, K., & Kestin, G. (2019). Measuring actual learning versus feeling of learning in response to being actively engaged in the classroom. *PNAS*, 116(39), 19251–19257. DOI 10.1073/pnas.1821936116. https://pubmed.ncbi.nlm.nih.gov/31484770/
**Confidence.** Strong.

---

# 7. Note-taking, annotation, highlighting

## 7.1 The Dunlosky ratings table (the thing you asked for)

**What the evidence says.** Ten techniques rated on generalisability across materials, learners, criterion tasks and settings:

| Utility | Techniques |
|---|---|
| **High** | **Practice testing**, **distributed practice** |
| **Moderate** | Elaborative interrogation, self-explanation, interleaved practice |
| **Low** | **Summarization**, **highlighting/underlining**, the **keyword mnemonic**, **imagery use for text learning**, **rereading** |

The panel's stated reason for the Low ratings: *"Most students report rereading and highlighting, yet these techniques do not consistently boost students' performance, so other techniques should be used in their place (e.g., practice testing instead of rereading)."* The Moderate ratings are *"limited evidence"* verdicts, not negative ones — elaborative interrogation and self-explanation had not been adequately evaluated in educational contexts, and interleaving research had only just begun at the time.

**Source.** Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology. *Psychological Science in the Public Interest*, 14(1), 4–58. DOI 10.1177/1529100612453266. https://pubmed.ncbi.nlm.nih.gov/26173288/ · full text PDF: https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf

**Confidence.** Strong (it is a commissioned PSPI review, and the ratings are the authors' explicit judgements, not derived effect sizes).

---

**Important corrective — the Low-utility techniques are not zero.** An independent meta-analysis of the same ten techniques (242 studies, **1,619 effect sizes, N = 169,179**) gives:

| Technique | d | cases |
|---|---|---|
| Distributed practice | 0.85 | 150 |
| Practice testing | 0.74 | 374 |
| Elaborative interrogation | 0.56 | 254 |
| Imagery | 0.56 | 135 |
| Self-explanation | 0.54 | 93 |
| Mnemonics | 0.50 | 107 |
| **Re-reading** | **0.47** | 113 |
| **Interleaved practice** | **0.47** | 104 |
| **Underlining** | **0.44** | 56 |
| Summarization | 0.44 | 234 |

The authors report strong correspondence with Dunlosky's ordering but note the boundary between "moderate" and "low" is somewhat arbitrary — *"the low effects were very close estimates to the moderate."*

**Source.** Donoghue, G. M., & Hattie, J. A. C. (2021). A meta-analysis of ten learning techniques. *Frontiers in Education*, 6, 581216. DOI 10.3389/feduc.2021.581216. https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full

**Confidence.** Moderate — it pools heterogeneous prior syntheses with varying control conditions, and its interleaving estimate (0.47) sits oddly against Brunmair & Richter's material-dependent picture. Use it as a corrective on rhetoric, not as the primary estimate.

**Blunt reading.** "Highlighting doesn't work" is an overstatement. The honest claim is **opportunity cost**: highlighting (0.44) and re-reading (0.47) buy roughly half of what spacing (0.85) and testing (0.74) buy, for the same student minute — and students overwhelmingly choose the cheap ones.

**UI implication.** Highlighting/annotation is fine to ship as a *navigation and note-capture* affordance. It must not be the primary study loop, and the app must not present "du hast 40 Stellen markiert" as a progress signal. Convert highlights into retrieval items — that is the feature that turns a low-utility behaviour into a high-utility one.

## 7.2 Highlighting can actively hurt

**What the evidence says.** Students read a 10,000-word history chapter under three conditions (highlight then review clean copy / highlight then review own highlights / read then review clean copy), tested 2 months later with factual and **inference** items. Highlighting showed no reliable benefit and **may impair inference performance** — plausibly because attention narrows to the marked propositions at the cost of relations between them.

**Source.** Peterson, S. E. (1992). The cognitive functions of underlining as a study technique. *Reading Research and Instruction*, 31(2), 49–56 **[record-only]**.

**Confidence.** Moderate (older, single study; the direction is consistent with Dunlosky's synthesis).

**Also.** Fowler, R. L., & Barker, A. S. (1974). Effectiveness of highlighting for retention of text material. *Journal of Applied Psychology*, 59(3), 358–364 **[record-only]** — *active* self-generated highlighting outperformed reading pre-highlighted text.

**UI implication.** Never ship pre-highlighted "key passages" as a learning aid — the only version with any support is learner-generated. And do not expect highlighting to help on the exam questions that matter in economics, which are inference questions.

## 7.3 Longhand vs typing — report the replication failure

**What the evidence says (original).** Three studies: laptop note-takers transcribed more verbatim and performed **worse on conceptual questions** than longhand note-takers.
**Source.** Mueller, P. A., & Oppenheimer, D. M. (2014). The pen is mightier than the keyboard: Advantages of longhand over laptop note taking. *Psychological Science*, 25(6), 1159–1168 **[record-only pages]**. https://pubmed.ncbi.nlm.nih.gov/24760141/

**What the evidence says (replication #1).** Direct replication plus extension (eWriter and no-notes groups): *"Some trends suggested longhand superiority; however, performance did not consistently differ between any groups."* A meta-analysis combining direct replications found **small, non-significant effects favouring longhand.**
**Source.** Morehead, K., Dunlosky, J., & Rawson, K. A. (2019). How much mightier is the pen than the keyboard for note-taking? A replication and extension of Mueller and Oppenheimer (2014). *Educational Psychology Review*, 31(3), 753–780 **[record-only pages]**. https://eric.ed.gov/?id=EJ1225471

**What the evidence says (replication #2).** Direct replication of Study 1 (laptop n = 74, longhand n = 68). The **verbatim-transcription difference replicated** — laptop notes contained more verbatim and more total words — but **quiz performance did not differ**. Exploratory mini meta-analyses across eight similar studies echoed the null.
**Source.** Urry, H. L., et al. (2021). Don't ditch the laptop just yet: A direct replication of Mueller and Oppenheimer's (2014) Study 1 plus mini meta-analyses across similar studies. *Psychological Science*, 32(3), 326–339 **[record-only pages]**. DOI 10.1177/0956797620965541. https://journals.sagepub.com/doi/10.1177/0956797620965541

**Confidence.** The "pen beats keyboard for learning" claim: **failed to replicate — do not use it.** The mechanism claim (typing → more verbatim transcription) **did** replicate.

**UI implication.** There is no evidence-based reason to discourage typed notes or to build handwriting input. There *is* a reason to discourage **verbatim capture**: constrain the note field (character cap, "in eigenen Worten" prompt, or auto-convert a note into a self-explanation prompt) so the medium's transcription pull is countered directly.

---

# 8. Self-explanation and elaborative interrogation — prompts an interface can literally render

**What the evidence says — self-explanation.** Meta-analysis of **69 effect sizes from 64 research reports**: overall random-effects **g = 0.55** for *inducing* self-explanation (i.e. prompting it), across 20 coded moderators including task type, subject area, education level, inducement type and duration. Conclusion: self-explanation prompts are a *"potentially powerful intervention across a range of instructional conditions."*

**Source.** Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. *Educational Psychology Review*, 30, 703–725. DOI 10.1007/s10648-018-9434-x. https://link.springer.com/article/10.1007/s10648-018-9434-x

**Confidence.** Strong.

---

**What the evidence says — self-explanation in mathematics specifically.** Prompted self-explanation gave **small-to-moderate improvements in procedural knowledge, conceptual knowledge and procedural transfer measured immediately**. Moderator: the effect was **stronger when scaffolding of high-quality explanation was provided**. Critical limitation stated by the authors: evidence that self-explanation reliably promotes learning **within a classroom context**, or **retention over a delay**, is *much more limited*.

**Source.** Rittle-Johnson, B., Loehr, A. M., & Durkin, K. (2017). Promoting self-explanation to improve mathematics learning: A meta-analysis and instructional design principles. *ZDM Mathematics Education*, 49(4), 599–611. https://eric.ed.gov/?id=EJ1149060

**Confidence.** Moderate — strong immediately, weak at delay and in-classroom. This is the honest ceiling on the claim.

**UI implication.** Ship the self-explanation box, but **scaffold it**: a free "Erkläre in eigenen Worten" textarea is the weak version. The evidenced version supplies structure — a principle picker, a sentence stem ("Dieser Schritt gilt, weil …"), or a menu of candidate justifications with one correct. Pair it with fading (§5), where Atkinson et al. showed the combination is what buys far transfer.

---

**What the evidence says — elaborative interrogation.** Rated **Moderate utility** by Dunlosky et al. (2013); independent meta-analytic estimate **d = 0.56 across 254 cases** (Donoghue & Hattie 2021). The technique is asking *"Warum ist das so?"* / *"Warum ergibt das Sinn?"* about a just-presented fact. It depends on prior knowledge: effects are larger when the learner has enough background to generate a *precise, self-generated* elaboration, and learners without prior knowledge can generate and then consolidate **inaccurate** explanations.

**Sources.** Dunlosky et al. (2013), DOI 10.1177/1529100612453266; Donoghue & Hattie (2021), DOI 10.3389/feduc.2021.581216.

**Confidence.** Moderate.

**UI implication.** Only fire "Warum?" prompts *after* the student has demonstrated baseline knowledge of the topic, and always show a model elaboration afterwards so a wrong self-generated explanation gets corrected rather than consolidated.

---

**Institutional synthesis — the strongest rating in the IES guide.** Recommendation 7: **"Ask deep explanatory questions" — STRONG evidence.**
**Source.** Pashler et al. (2007), IES Practice Guide. https://ies.ed.gov/ncee/wwc/PracticeGuide/1

---

# 9. Metacognition and judgement-of-learning miscalibration

**What the evidence says — students pick the wrong strategy, by a lot.** Surveyed on what they do when studying on their own, students overwhelmingly report **rereading** rather than self-testing; where they do test themselves, they typically do it to diagnose readiness, not as a learning event. The lab benefit of testing does not translate into student behaviour because students lack metacognitive awareness of it.

**Source.** Karpicke, J. D., Butler, A. C., & Roediger, H. L., III (2009). Metacognitive strategies in student learning: Do students practise retrieval when they study on their own? *Memory*, 17(4), 471–479. https://www.tandfonline.com/doi/abs/10.1080/09658210802647009

**Confidence.** Strong.

**UI implication (the strategic one).** **Do not make study strategy a user choice.** A product that offers "Karteikarten / Zusammenfassung / Nochmal lesen" as equal options will see students select the low-utility ones. The default path must be the evidenced one; alternatives, if offered, should be secondary.

---

**What the evidence says — the illusion is specifically about fluency.** Learners judge massed/blocked study as more effective than spaced/interleaved study *even after* taking the test that shows the opposite (Kornell & Bjork 2008, §3). Students in active-learning conditions feel they learned less while learning more (Deslauriers et al. 2019, §6). The common cause is that ease of processing during study is misread as evidence of learning.

**Confidence.** Strong.

**UI implication.** Anything that makes content feel smooth — a polished video, a clean summary, a re-read — inflates the student's judgement of learning without a matching gain. Do not let "feels productive" be the design target.

---

**What the evidence says — the one intervention that fixes calibration.** Judgements of learning made **immediately** after study are poor predictors of later recall; JOLs **delayed** by a short interval (minutes) are dramatically more accurate — in the original demonstration, close to perfect. Mechanism: a delayed judgement forces an actual retrieval attempt and uses retrieval fluency as the cue, whereas an immediate judgement reads off short-term availability, which is a bad cue.

**Source.** Nelson, T. O., & Dunlosky, J. (1991). When people's judgments of learning (JOLs) are extremely accurate at predicting subsequent recall: The "delayed-JOL effect." *Psychological Science*, 2(4), 267–270. https://journals.sagepub.com/doi/abs/10.1111/j.1467-9280.1991.tb00147.x

**Confidence.** Strong for the phenomenon.

**But:** the IES panel rated **"Help students allocate study time efficiently: teach students to use delayed judgements of learning" as MINIMAL evidence** at the classroom level, and likewise for using tests to identify content needing study. The lab effect is robust; its instructional payoff is not established.
**Source.** Pashler et al. (2007), Recommendations 6a and 6b. https://ies.ed.gov/ncee/wwc/PracticeGuide/1

**Confidence overall.** Moderate — real effect, unproven instructional value.

**UI implication.** Never ask "Hast du das verstanden?" on the page the student just read — that reading is worthless. Ask for the self-rating **at the start of the next session**, immediately before the item is re-tested, and then show the student their predicted-vs-actual gap. That gap display is the calibration feature; the immediate confidence checkbox is theatre.

---

**What the evidence says — confidence data has a second use.** High-confidence errors are corrected especially well by feedback (hypercorrection; Butterfield & Metcalfe 2001, §1.5).

**UI implication.** Collect a confidence rating per answer and use it twice: to compute calibration over time, and to prioritise which errors get the full elaborated explanation.

---

**What the evidence says — pre-questions.** Asking a question *before* the content improves learning **of exactly the prequestioned information (g = .66)** but produces **no general benefit for non-prequestioned information (g = .01)**.

**Source.** Pan, S. C., & Carpenter, S. K. (2023). Prequestioning and pretesting effects: A review of empirical research, theoretical perspectives, and implications for educational practice. *Educational Psychology Review*, 35, 97. DOI 10.1007/s10648-023-09814-5. https://link.springer.com/article/10.1007/s10648-023-09814-5

**Confidence.** Moderate-to-strong, and unusually precise about its own limits. The IES panel separately rated pre-questions as **minimal evidence** (Rec. 5a) — note the disagreement, with the newer synthesis being more favourable but also more narrowly scoped.

**UI implication.** A pre-question at the top of a lesson is cheap and helps — but only for what it asks about. It is not a comprehension primer; it is a targeted spotlight. One or two pre-questions covering the load-bearing concepts, not a pre-quiz.

---

# 10. Mathematics notation and worked derivations

**What the evidence says — spatial layout of a formula changes whether students parse it correctly.** Four experiments on validity judgements of algebraic equations, manipulating **non-mathematical perceptual grouping pressures** (physical spacing) to support or conflict with the order of operations. Accuracy was **highest when perceptual grouping supported the mathematical grouping**, and the difference was significantly larger when the judgement depended on operator precedence. Related prior work: people writing equations by hand spontaneously use **less space around multiplication than around addition, and most space around the equals sign** — spacing is already carrying syntactic meaning.

**Source.** Landy, D., & Goldstone, R. L. (2007). How abstract is symbolic thought? *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 33(4), 720–733. https://pubmed.ncbi.nlm.nih.gov/17576149/ · https://eric.ed.gov/?id=EJ768632

**Confidence.** Strong.

---

**What the evidence says — and it is perceptual, not strategic.** Grouping effects on arithmetic evaluation **persisted when the expression was briefly presented and masked**, and **were not eliminated by having participants say the expression aloud** (which should recruit verbal/rule-based processing). The effect is in the visual system, so you cannot instruct it away.

**Source.** Rivera, J., & Garrigan, P. (2016). Persistent perceptual grouping effects in the evaluation of simple arithmetic expressions. *Memory & Cognition*, 44, 750–761. DOI 10.3758/s13421-016-0593-z. https://pubmed.ncbi.nlm.nih.gov/26887867/

**Confidence.** Strong.

**UI implication — a real, checkable typography requirement.** Your maths renderer's spacing is not cosmetic; it is instruction.
- Tighten spacing around higher-precedence operations and loosen it around lower-precedence ones, so visual grouping *agrees* with precedence. Check that your MathJax/KaTeX output does this and does not, e.g., letter-space uniformly.
- Never allow an equation to line-wrap at an arbitrary point — a break that splits a product across lines creates a false grouping. Wide equations must scroll horizontally in their own container or break at author-specified points.
- Do not justify text containing inline maths (justification stretches inter-symbol spacing).
- Do not let responsive font scaling change relative spacing inside formulas.

---

**What the evidence says — isolate interacting elements for novices.** Three groups of 13-year-olds learned a mathematical task; the **Isolated** condition used part-tasks in which the constituent elements were separated from each other, reducing **intrinsic** load, before recombining them. Reducing element interactivity this way improved learning in this mathematical domain.

**Source.** Ayres, P. (2006). Impact of reducing intrinsic cognitive load on learning in a mathematical domain. *Applied Cognitive Psychology*, 20(3), 287–298. DOI 10.1002/acp.1245. https://onlinelibrary.wiley.com/doi/10.1002/acp.1245

**Confidence.** Moderate (school-age sample, single study, but it is the canonical isolated-elements demonstration and sits inside the well-supported CLT framework).

**UI implication.** For a first pass at a multi-part derivation (e.g. a constrained optimisation), present the parts separately — set up the Lagrangian; separately, take the partials; separately, solve the system — before showing the integrated whole. Then show the integrated whole, because integration is the learning goal.

---

**Composite prescription for rendering a derivation** (assembling §4.1, §4.3, §4.4, §5, §10):
1. **Segment.** One transformation per step, learner-advanced (Rey et al. 2019, DOI 10.1007/s10648-018-9456-4).
2. **Signal.** Cue exactly what changed from the previous line — colour or weight on the substituted term (Schneider et al. 2018, g+ = 0.53 retention / 0.33 transfer).
3. **Integrate.** Symbol definitions inline beside the symbol, never in a legend or a footnote (Schroeder & Cenkci 2018, g = 0.63).
4. **Justify.** A principle label attached to each step, and a prompt asking the learner to supply it once fading starts (Atkinson et al. 2003).
5. **Fade.** Blank steps from the end backwards across successive problems (Renkl & Atkinson 2003).
6. **Strip.** No decorative animation on step transitions (Sundararajan & Adesope 2020, g = −0.16).
7. **Remove the scaffold** once performance says the learner is no longer a novice (Kalyuga et al. 2003).

---

**Practitioner research (not peer-reviewed) — how the surrounding prose gets read.** NN/g's own eye-tracking work: users scan unformatted text in an F-shaped pattern (a wide first horizontal sweep, a shorter second sweep, then a vertical scan down the left edge). NN/g's stated cause: *"The F-pattern is the default pattern when there are no strong cues to attract the eyes towards meaningful information."* Their recommendations: most important points in the first two paragraphs; prominent headings and subheadings; headings that **start with the information-carrying words**; bolded key terms; bullets and visual grouping; meaningful link text.

**Source.** Pernice, K. (2017, November 12). *F-shaped pattern of reading on the web: Misunderstood, but still relevant (even on mobile)*. Nielsen Norman Group. **Practitioner research — NN/g's own eye-tracking studies, not peer-reviewed.** https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/

**Confidence.** Moderate as design guidance; the underlying claim (unformatted prose is scanned, not read) is uncontroversial, but effect sizes on *learning* are not established.

**UI implication.** Front-load the load-bearing sentence of every explanatory block, and start German headings with the content noun rather than an article or filler ("Preiselastizität der Nachfrage — Herleitung", not "Ein Blick auf die …"). This is a formatting rule, not a learning mechanism; do not confuse the two.

---

# Things that sound good but the evidence doesn't support

**1. Learning styles / the meshing hypothesis.** The commissioned review found *virtually no evidence* for the interaction pattern required to validate meshing; several methodologically adequate studies **flatly contradicted** it. Two later direct tests with college-educated adults found matching instruction to stated style preference made no difference to comprehension.
*Sources.* Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning styles: Concepts and evidence. *Psychological Science in the Public Interest*, 9(3), 105–119. https://pubmed.ncbi.nlm.nih.gov/26162104/ · Rogowsky, B. A., Calhoun, B. M., & Tallal, P. (2015). Matching learning style to instructional method: Effects on comprehension. *Journal of Educational Psychology*, 107(1), 64–78. https://eric.ed.gov/?id=EJ1055886 · Rogowsky, Calhoun & Tallal (2020). Providing instruction based on students' learning style preferences does not improve learning. *Frontiers in Psychology*, 11, 164. DOI 10.3389/fpsyg.2020.00164.
*Verdict.* **Dead.** Do not build a "Lerntyp" onboarding quiz, a visual/auditory content toggle, or style-based recommendations.

**2. The learning pyramid / Dale's cone ("people remember 10% of what they read, 90% of what they teach").** A family of unsubstantiated retention myths, widely propagated in academia with no empirical basis; the authors recommend removing it from educational research entirely and tracing its origins showed fabrication rather than data.
*Sources.* Letrud, K., & Hernes, S. (2016). The diffusion of the learning pyramid myths in academia: An exploratory study. *Journal of Curriculum Studies*, 48(3), 291–302 **[record-only pages]**. https://eric.ed.gov/?id=EJ1094936 · Letrud & Hernes (2018). Excavating the origins of the learning pyramid myths. *Cogent Education*, 5, 1518638. https://www.tandfonline.com/doi/full/10.1080/2331186X.2018.1518638
*Verdict.* **Fabricated.** Never cite retention percentages by activity type in marketing or in-product copy.

**3. "Longhand notes beat typed notes."** Failed direct replication twice; the widely-cited conceptual-learning advantage did not hold, though the verbatim-transcription difference did. (Mueller & Oppenheimer 2014 → Morehead et al. 2019 → Urry et al. 2021; §7.3.)
*Verdict.* **Failed replication.** Do not build handwriting input on this rationale.

**4. Highlighting as a study strategy.** Rated **Low utility**; may impair inference performance; only learner-generated highlighting has any support, and even that is roughly half the yield of testing or spacing per minute. (Dunlosky et al. 2013; Peterson 1992; Fowler & Barker 1974; Donoghue & Hattie 2021 d = 0.44.)
*Verdict.* **Not a learning feature.** Ship it as navigation; convert highlights into questions.

**5. Re-reading and passive review.** Rated **Low utility**; produces the largest gap between felt fluency and actual learning; it is also what students spontaneously do. (Dunlosky et al. 2013; Karpicke, Butler & Roediger 2009.) The honest number is d ≈ 0.47 vs no treatment (Donoghue & Hattie 2021) — not zero, but dominated.
*Verdict.* **Dominated.** Do not make "nochmal ansehen" a first-class action or count it as progress.

**6. Summarization, keyword mnemonics, imagery for text.** All rated **Low utility** by Dunlosky et al. (2013). Auto-generated summaries in particular combine low utility with a redundancy-principle cost (§4.2).
*Verdict.* **Low priority at best.**

**7. "Feedback must be immediate."** The most recent meta-analysis (51 studies, 160 effect sizes, 1988–2024) finds **g = 0.03, CI [−0.08, 0.13], p = .61** — feedback timing does not significantly affect learning on average. The older pro-delay finding (Butler et al. 2007) also cuts against the immediate-feedback dogma from the other direction. (Kandemir et al. 2026, DOI 10.1007/s10648-026-10117-8.)
*Verdict.* **Non-lever.** What matters is that feedback is **elaborated** (d = 0.49) rather than mere correctness (d = 0.05) (Van der Kleij et al. 2015).

**8. Expanding-interval spaced repetition as inherently superior.** Expanding beat equal intervals immediately, but **equal intervals beat expanding at delay**; what mattered was that the *first* retrieval was delayed enough to be effortful. (Karpicke & Roediger 2007.)
*Verdict.* **Folklore, from Landauer & Bjork 1978, superseded.** Don't over-engineer the ladder.

**9. "Interleave everything."** Sign-reverses by material: words **g = −0.39** (blocking better); expository texts non-significant; maths only **g = 0.34**. (Brunmair & Richter 2019, DOI 10.1037/bul0000209.)
*Verdict.* **Conditional, not universal.** Interleave confusable problem types; block vocabulary.

**10. "Retrieval practice is the strongest thing we know, so it will carry a maths product."** In mathematics specifically, testing vs restudy is **g = 0.18 with a CI crossing zero** across only 7 studies, while spacing is g = 0.28 and worked examples are g = 0.48. (Murray et al. 2025; Barbieri et al. 2023.) Theoretical challenge from element interactivity remains unresolved (van Gog & Sweller 2015 vs Karpicke & Aue 2015).
*Verdict.* **Weakly supported in your domain.** For maths, prioritise worked-example fading and spacing over flashcard-style retrieval. Retrieval still applies to the low-interactivity layer (definitions, formulas, terminology).

**11. Decorative animation, illustration, mascots and "fun facts" as engagement drivers.** Seductive details reduce learning: overall **g = −0.16**, comprehension −0.19, recall −0.17, transfer −0.12, mediated by extraneous cognitive load. (Sundararajan & Adesope 2020.)
*Verdict.* **Net negative inside the learning surface.** If you want celebration animation, put it between activities, not during encoding.

**12. Pre-quizzes as a general comprehension primer.** Prequestions help the prequestioned content (g = .66) and do essentially nothing for everything else (**g = .01**). (Pan & Carpenter 2023.)
*Verdict.* **Narrower than it sounds.**

**13. Teaching students to self-assess and allocate study time.** The delayed-JOL lab effect is robust, but the IES panel rated the instructional recommendation **Minimal evidence** (Recs. 6a and 6b). (Pashler et al. 2007.)
*Verdict.* **Unproven as an intervention.** Build calibration feedback because it is cheap, not because it is evidenced.

**14. Student satisfaction / perceived learning as a proxy for learning.** Students feel they learn *less* in the conditions where they learn *more* (Deslauriers et al. 2019, PNAS), and judge massing/blocking superior even after being shown otherwise (Kornell & Bjork 2008).
*Verdict.* **Actively misleading as a product metric.** Delayed retention is the only honest signal. If you optimise for in-session satisfaction, you will systematically remove the mechanisms that work.

---

## One-paragraph synthesis for the maths/econ case

For this specific product, the evidence ranks roughly: **worked-example fading with principle prompts (g ≈ 0.48 in maths, and the fading+prompt combination is the only manipulation shown to buy far transfer) > interleaved problem types (RCT d = 0.83 in school maths; meta g = 0.34) > spacing keyed to the student's exam date (maths g = 0.28; optimal gap ≈ 10–20% of the retention interval) > elaborated feedback (d = 0.49, versus d = 0.05 for correctness-only) > self-explanation prompts (g = 0.55, scaffolded) > retrieval practice for the low-interactivity layer only (unproven in maths at g = 0.18)**. On the presentation side, the cheap wins are split-attention removal (g = 0.63), signalling of what changed between derivation lines (g = 0.53/0.33), segmenting derivations into learner-advanced steps, formula spacing that agrees with operator precedence, and deleting decorative motion (g = −0.16). Every one of these will make the app *feel* harder and slower than a polished passive reader, and the literature is unanimous that this is what success looks like.
