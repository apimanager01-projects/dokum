# Part 2c — Push notifications, re-engagement, and nudges in education

Sub-agent output (child of the motivation research pass). Numbers were read out of the source
document (PDFs text-extracted with `pdftotext`) unless explicitly flagged otherwise.

---

## Part A — Push notifications: HCI/ubicomp evidence

**A1. Baseline load.** One-week in-situ logging, 15 Android users, 6,854 notifications: mean
**63.5/day** (abstract) / 65.3/day (results — the paper is internally inconsistent by ~2). Median
time-to-view **3.5 min** (messengers, weekend) to **27.7 min** (email, weekend). Screen had been off
in **69.2%** of arrivals — notifications *initiate* phone sessions.
Pielot, Church & de Oliveira (2014), MobileHCI '14, 233–242, DOI 10.1145/2628363.2628364 —
https://pielot.org/pubs/Pielot2014-MobileHCI-Notifications.pdf **Confidence: moderate** (N=15, 2013).

**A2. What generates negative emotion.** Same study, diary × logs (Spearman's ρ). **Email volume**
correlated with stress (ρ=0.356), feeling interrupted (0.499), annoyed (0.412), pressure to respond
(0.398). **Social** volume similar but weaker. **Messengers showed no such correlation** — more
messages correlated with *feeling more connected* (ρ=0.291).
→ Most transferable finding in Part A. Annoyance tracks *impersonal, obligation-creating,
unclear-urgency* content — exactly what "Du hast 3 offene Aufgaben" is. It is structurally an *email*,
not a *message from a friend*.

**A3. Large-scale: clicks and blacklisting.** 197,515,366 notifications, 40,191 users, plus 4,964
in-situ importance ratings.
- Median click time **30 s**. Not clicked within **5 min** → only **17%** chance of ever being clicked.
- Users blacklisted mean **5.51%** of notification-raising apps (SD 13.35). Messengers/social rarely
  blacklisted; music 10.4%, news 10.2%, utility 8.1% most.
- Importance (1–5): messaging **4.43**; real-life event reminders **4.07**; system events **1.78**;
  criticised for *frequency* **1.45**; **notifications about the user's own self-initiated action
  1.43 — the lowest class in the paper.**
Sahami Shirazi et al. (2014), CHI '14, 3055–3064, DOI 10.1145/2556288.2557189 —
https://pielot.org/pubs/Sahami2014-CHI-NotificationsLarge.pdf **Confidence: strong on scale.**
*Author-flagged confound: their apparatus mirrored notifications to a desktop app.*
→ Two hard rules. (1) **Never notify a user about something they just did themselves.** (2) The
5-minute cliff means an unopened study reminder is *dead*, not deferred — don't build catch-up logic.

**A4. Most notifications are never individually attended.** 40 participants, 113,197 notifications.
Mean **313.4/day** (median 185) but only **49.8 interactions/day** (median 12) — **15.8%**. Of all
notifications: **2.6% clicked, 9.7% dismissed, 82.7% "replaced"** (superseded before handling), 5.0%
auto-removed. **44.2%** arrived 5pm–midnight.
**44.2% of *dismissed* notifications were rated maximally important (5/5)**, vs 49.2% of clicked ones.
Visuri et al. (2019), IJHCS 128, 72–85, DOI 10.1016/j.ijhcs.2019.03.001 —
https://nielsvanberkel.com/files/publications/ijhcs2019b.pdf **Confidence: moderate** (N=40).
→ **Dismissal rate is not a relevance signal.** An ML "suppress what they dismiss" heuristic will
suppress content users consider important. Ask, don't infer.

**A5. Interruption cost — and two myths the papers do NOT support.**
- *(a) The "23 minutes to refocus" figure is wrong.* The actual paper (24 information workers, 3.5
  days each, >700 hours) reports average **11 min 4 s (SD 18:09)** in a working sphere before
  switching; same-day resumption of interrupted work averaged **25 min 26 s (SD 54:48)** with **2.26
  (SD 2.79)** intervening spheres. "23 minutes 15 seconds" appears nowhere in it.
  Mark, Gonzalez & Harris (2005), CHI '05, DOI 10.1145/1054972.1055017 —
  https://ics.uci.edu/~gmark/CHI2005.pdf
- *(b) Interrupted work was completed FASTER, not slower.* N=48 lab experiment. Time to perform:
  baseline **22.77 min (SD 7.60)**; same-context interruption **20.31 (5.94)**; different-context
  **20.60 (4.93)** — F(2,77.98)=3.36, p<.05, **baseline slowest**. The cost was entirely subjective
  (NASA-TLX, 20-pt): stress 6.92 → 9.46 → 9.13 (p<.001); frustration 4.73 → 6.63 → 6.48 (p<.007);
  effort 9.50 → 11.04 → 11.52 (p<.001). Interrupted subjects wrote *shorter* emails.
  Mark, Gudith & Klocke (2008), CHI '08, DOI 10.1145/1357054.1357072 —
  https://ics.uci.edu/~gmark/chi08-mark.pdf
- *(c) Field diversion cost.* 27 participants, 2 weeks, 2,267 logged hours. Return to the suspended
  application: **9 min 33 s** after email, **8 min (SD 11:32)** after IM — but time in the email
  client itself averaged only **4 min 59 s**, i.e. half the diversion was *chained secondary
  distraction*. Iqbal & Horvitz (2007), CHI '07, DOI 10.1145/1240624.1240730. *Caveat: publisher PDF
  403'd; figures from a full-text mirror. The alert-rate figure's time unit could not be verified and
  is not reported.*
- *(d) Timing beats content.* Notifications at task **breakpoints** got reaction time **3.07 s (SD
  1.2)** vs **4.08 s (SD 3.13)** immediate (F(1,66)=3.78, p<0.056). Task resumption after a *relevant*
  notification **4.65 s (SD 4.4)** vs **23.1 s (SD 41.4)** after a general-interest one during diagram
  editing (F(1,54)=5.91, p<0.018). Frustration lower at coarse/medium breakpoints (μ=2.6, SD 1.6) than
  fine/immediate (μ=4.5, SD 1.58), F(3,52)=6.2.
  Iqbal & Bailey (2008), CHI '08, DOI 10.1145/1357054.1357070 —
  https://interruptions.net/literature/Iqbal-CHI08.pdf
**Confidence: strong for (b) and (d); moderate for (a) and (c).**
→ The interruption tax is **stress and effort, not lost minutes** — and roughly **5× lower at a task
boundary**. A study platform *owns* its task boundaries (exercise submitted, Unit finished). In-app
nudges at those boundaries are the cheapest high-value thing here. And stop quoting "23 minutes".

**A6. Turning notifications off.** 30 white-collar participants, 24 h without notification alerts,
counterbalanced. Felt **less distracted** (z=−2.054, p=.020, δ=−0.32) and **more productive**
(z=−2.302, p=.011, δ=0.333); but **less responsive** (z=−3.269, p=.001, δ=−0.542 — largest effect),
**more worried about missing something** (z=−3.001, p=.001, δ=0.421), **less connected** (z=−2.813,
p=.002, δ=−0.342). **12/30 checked their phone more often.** 22/30 intended to change their settings;
a two-year follow-up found **13 (59.1%)** fully followed through.
Pielot & Rello (2017), MobileHCI '17, DOI 10.1145/3098279.3098526 — https://arxiv.org/abs/1612.02314
*Caveat: statistics extracted from the arXiv preprint, not the ACM version of record.*
→ The reason users don't turn your notifications off is usually **anxiety about missing something,
not perceived value.** A learning app that manufactures FOMO ("Deine Serie endet in 2 Stunden!") is
exploiting precisely the mechanism this paper documents as the source of reduced wellbeing.

**A7. Let users write the filtering rules.** PrefMiner mines interpretable rules from interaction logs
and shows them to the user for approval. 15-day deployment, 16 subjects: **179 rules proposed, 56.98%
accepted**; recall **45.81%**, precision **100%** (by construction — only accepted rules fire).
Mehrotra, Hendley & Musolesi (2016), UbiComp '16 (Best Paper), DOI 10.1145/2971648.2971747 —
https://www.mircomusolesi.org/papers/ubicomp16.pdf **Confidence: moderate** (N=16).
→ Expose **per-category toggles** ("Neue Inhalte", "Prüfungserinnerungen", "Wiederholungen fällig"),
not one master switch. The master switch converts one bad notification into permanent total opt-out.

**A8. Volume thresholds — the evidence is weak and vendor-owned.** The circulating numbers ("10%
disable at 1/week, 37% at 2–5/week", "52% find push annoying", "opt-in 49.4%", "32% uninstall after
>6 notifications", "3.4× more likely to uninstall") all trace to **Localytics** — a push-notification
vendor whose commercial interest is in customers sending *more* push — reached only through secondary
marketing blogs. Sample size, sampling frame and question wording **unverified for every one**.
**Confidence: weak. Do not use.**
→ Note the asymmetry: the vendor numbers are the *only* ones giving a clean frequency threshold, and
they are the least trustworthy numbers here. That is not a coincidence — **no peer-reviewed study
establishes a notifications-per-week uninstall threshold.** Anchor low (≤2–3/week) as a hypothesis.

---

## Part B — Notifications and reminders in learning specifically

**B1. The most directly relevant single result: the alert tool did nothing; the commitment device
worked.** Three behavioural tools randomised inside a MOOC. Relative to control, the **commitment
device** group spent **24% more time** on the course, earned grades **0.29 SD higher**, and were
**40% more likely to complete**. The **alert tool and the distraction blocker were statistically
indistinguishable from control.**
Patterson (2018), *JEBO* 153, 293–321, DOI 10.1016/j.jebo.2018.06.017. *Sample size unverified —
not in the abstract, full text paywalled.* **Confidence: moderate–strong.**
→ **The reminder is the weak arm.** Build the commitment step (student sets their own weekly plan,
exam date, target) and let notifications merely *serve* that self-authored commitment. "Du hattest dir
Dienstag 18:00 für Mikroökonomie vorgenommen" is a different intervention from "Neue Aufgaben
verfügbar."

**B2. Engagement ≠ learning: planning prompts raise week-1 clicks and change nothing else.** 2.5
years, ~250,000 students, **247 courses** from Harvard/MIT/Stanford, preregistered between waves.
- Plan-making prompts **raised week-1 activity** (y1 short plans β=0.0437, CI [0.0066, 0.0808],
  p=.021; y2 long plans β=0.1057, CI [0.0496, 0.1619], p<.001).
- Attenuated by week 2; **"not detectable in the final course completion rates."**
- Direct replication: **prior β = 3.9 pp on completion (n=2,053) → scaled 0.19 pp (n=26,586, p=.670)**;
  y2 −0.23 pp. Mental contrasting + implementation intentions: **prior 24 pp, z=2.26, p=.024, n=64 →
  scaled 0.25 pp, p=.662, n=12,879.**
- The one survivor — a value-relevance intervention — raised completion **2.79 pp** (y1) and **2.74 pp**
  (y2), **but only in courses that already had a global achievement gap.** Without one it **backfired:
  −1.62 pp** (y1, p=.004), **−1.71 pp** (y2, p=.031).
- Predicting which courses benefit: 21-feature model, **54.3% accuracy vs 50% chance.**
- Authors: scaling "can reduce their average effectiveness by an order-of-magnitude."
Kizilcec et al. (2020), *PNAS* 117(26), 14900–14905, DOI 10.1073/pnas.1921417117 —
https://par.nsf.gov/servlets/purl/10164956 **Confidence: strong.**
→ (1) **Never accept a week-1 engagement lift as evidence.** (2) The 24-pp-at-n=64 → 0.25-pp-at-n=12,879
collapse is the canonical pilot-result warning. (3) Light-touch interventions can be **actively
negative**; an aggregate null may be "+3pp for some, −2pp for others."

**B3. Spaced-repetition scheduling: read the comparison arm carefully.** Duolingo's half-life
regression scheduler, two production A/Bs measuring **daily retention**:
- **Exp I — HLR vs Leitner baseline, ~1M students, 6 weeks:** any activity **+0.3%**, new lessons
  **+0.3%**, **practice −7.3% (significant decrease, p<0.001)**.
- **Exp II — HLR−lex vs HLR, 3.3M students, 2 weeks:** any activity **+12.0%**, lessons +1.7%,
  practice +9.5% (all p<0.001).
The abstract's headline "+12% engagement" is **Experiment II — one version of their own model against
another**, not against the naive baseline. Against the actual baseline: ~0.3% and a significant *drop*
in practice sessions.
Settles & Meeder (2016), ACL 2016, 1848–1858 — https://aclanthology.org/P16-1174/
**Confidence: strong on the numbers. COI: first author is Duolingo; the outcome is retention, not
measured learning — the paper never tests whether students learned more.**

**B4. The underlying learning science is solid — but it's about *scheduling*, not *notifying*.**
Distributed practice and practice testing both rated "high utility" (Dunlosky et al. 2013). **None of
these papers tests push notifications.** The inferential leap from "spacing works" to "spacing
reminders work" is unsupported, and is precisely what B1 and B2 found to fail.
Cepeda et al. (2006) DOI 10.1037/0033-2909.132.3.354 · Adesope et al. (2017) DOI
10.3102/0034654316689306 (*headline g unverified — paywalled, not guessed*) · Dunlosky et al. (2013)
DOI 10.1177/1529100612453266.
→ The differentiated value is the **schedule and the retrieval content**, not the ping.

---

## Part C — Nudging university students, and where the effects vanished

**C1. Oreopoulos & Petronijevic: five years, ~25,000 students, six interventions, precise zeros.**
University of Toronto, three campuses. Six escalating arms: goal-setting, mindset, online coaching,
online + one-way text, online + **two-way text with trained upper-year coaches**, online +
**face-to-face** coaching.
- **Academic outcomes — nothing.** *"None of the interventions we test can generate a significant
  improvement in student grades or persistence. We can rule out treatment effects larger than 7 percent
  of a standard deviation and find precise null impacts even when focusing on students more at risk."*
- Fall grades: control mean 68.8% (SD 13.5 pp). **No effect significant at 5%**; largest 4.8% of a SD.
- Credits by end of year 1: control 3.1, no differences; **can rule out effects larger than 8% of a SD.**
- Persistence: 80% / 73% of controls enrol in years 2 and 3 — no differences in any arm. Null across
  all grade thresholds, all three campuses, and **for maths-only and economics-only grades.**
- **Intermediate outcomes were real:** two-way text coaching raised self-reported weekly study time by
  **11.3% of a SD ≈ 1.3 hours** (range across measures 10–20% of a SD ≈ ~2 hrs/week), corroborated by
  a next-day time diary (+0.3 hrs/day; controls 3.3 hrs/day, SD 2.7). Positive-study-behaviour index:
  online only +6% SD, two-way text +13%, face-to-face +19%. Coaching improved wellbeing and reduced stress.
- **Engagement was not the problem:** >65% replied at least once to their text coach; 70% wanted the
  programme continued. Students liked it. It just didn't work.
- **Mechanism:** students study **5–8 hours/week fewer than they plan to**, and nothing closed the gap.
  Coaching made some realise more effort was needed — and they **revised their grade expectations
  downward** instead of working harder. Ceiling model: eliminating the entire intention–action gap
  would raise mean grades only **~3.5 pp (27% of a SD)**.
Oreopoulos & Petronijevic (2019), NBER WP 26059, DOI 10.3386/w26059 —
https://www.nber.org/system/files/working_papers/w26059/w26059.pdf · AEARCTR-0000810.
**Confidence: strong on the empirics; formally a working paper, not peer-reviewed.**
→ Same age band, same institution type, **economics courses were the setting**. Two-way human coaching
by text — vastly more effortful than any push notification — moved grades zero.

**C2. The cleaner contrast: coaching works, texting doesn't.** 4,000+ undergraduates, three arms:
one-time online values affirmation, **text-messaging campaign**, **personal coaching** with upper-year
coaches. Coaching: **+0.30 SD average grades, +0.35 SD GPA.** The online exercise and the texting
campaign: **no effects on any academic outcome, overall or in any subgroup.**
Oreopoulos & Petronijevic (2018), *Journal of Human Resources* 53(2), 299–329, DOI
10.3368/jhr.53.2.1216-8439r **Confidence: strong** — the +0.3 SD coaching arm proves the study had
power; the texting null is not a power failure.
→ The active ingredient is **a human relationship, not the channel.**

**C3. Summer melt: strong small-scale positives that did not survive scaling.**
Originals (positive): Castleman & Page (2015), *JEBO* 115, 144–160, DOI 10.1016/j.jebo.2014.12.008;
Castleman & Page (2016), *JHR* 51(2), 389–415. *Exact effect sizes and Ns paywalled — direction only.*
Scale-up, two concurrent cluster-RCTs by the same group:
- **National arm:** 70,285 students, 745 schools, 15 states, monthly outreach from uAspire virtual
  advisors. **Null, occasionally negative.** ~1 pp on-time enrollment.
- **Texas arm:** 21,001 students, 72 schools, weekly texts **from the students' own high school
  counsellor**. FAFSA submission/completion **+8–9 pp** school level (+5–6 pp student level),
  applications **+8 pp**, SAT/ACT **+4 pp** (marginal), enrollment ~+2 pp. Low-GPA students: +6 pp SAT,
  **+15 pp applications**, +10 pp FAFSA, +8 pp enrollment.
- Treatment students in the **national** study were "nearly three times as likely" to misidentify the
  outreach as coming from their own counsellor — the authors' proposed mechanism for the divergence.
Avery, Castleman, Hurwitz, Long & Page (2020), NBER WP 27897 —
https://www.nber.org/system/files/working_papers/w27897/w27897.pdf **Confidence: strong** for the contrast.
→ **Identity of sender, not content of message, carried the effect.** Argues for messages attributed to
a named tutor/Dozent rather than to "Dokum", and against generic system voice.

**C4. Nudging at Scale — 800,000 students, precise zero.** Two RCTs by the researchers who produced the
positive small-scale FAFSA literature. Randomised across **behavioural framing** (financial-benefit /
identity-norms / planning), **channel** (mail, e-mail, text), **offer of one-on-one advising**, and a
**social nudge**; second arm randomised **timing** and **infographic vs text**.
*"We find no impacts on financial aid receipt or college enrollment overall or for any student
subgroups. We find no evidence that different approaches to message framing, delivery, or timing, or
access to one-on-one advising affected campaign efficacy."*
- Common App: **can rule out impacts greater than 0.5 pp.** Large State: **greater than 1.3 pp**; a
  modest +1.1 pp shift into two-year institutions.
- Context: the median prior study in their own literature table had **6,233 students**. This had 800,000.
Bird, Castleman, Denning, Goodman, Lamberton & Rosinger (2021), *JEBO* 183, 105–128, DOI
10.1016/j.jebo.2020.12.022 **Confidence: strong.**
→ **When your nudge A/B comes back null, the framing-optimisation loop is a trap.** This study already
ran that loop at n=800,000 across every dimension you would think to vary.

**C5. Friction removal beats motivation.** H&R Block FAFSA experiment: **assistance + information** (a
tax professional pre-filled and submitted the form) increased college enrollment; **information-only**
produced **no change**.
Bettinger, Long, Oreopoulos & Sanbonmatsu (2012), *QJE* 127(3), 1205–1242, DOI 10.1093/qje/qjs017.
*Magnitudes unverified — paywalled; direction as characterised in Bird et al.'s literature table.*
→ Pre-generating a study plan, resuming exactly where the student stopped, and one-tap access to the
next exercise will beat any reminder telling them to do those things themselves.

**C6. The publication-bias reckoning.** 126 RCTs, **>23 million individuals** — every trial run by two
large US government Nudge Units — vs nudge trials published in academic journals.
- **Academic journals: 8.7 pp take-up, a 33.5% increase over control. Nudge units: 1.4 pp, 8.1%** — ~6× smaller.
- Power: median academic arm **484 participants, MDE 6.3 pp**; median nudge-unit arm **10,006, MDE 0.8 pp**.
- Selective publication: **>4× as many academic studies with t ∈ [1.96, 2.96] as t ∈ [0.96, 1.96]**.
  Estimated probability a null-result paper gets published: **0.10 (SE 0.10)**.
- **Correcting closes the entire gap:** Andrews–Kasy correction takes the academic average from
  **8.7 pp to 3.16 pp**; 1/MDE weighting does the same.
- Academic involvement is not the explanation (BIT-NA without academics 1.7 pp; OES 1.0 pp; OES *with*
  academics 1.0 pp). Most forecasters over-predicted; **nudge practitioners were almost perfectly calibrated.**
DellaVigna & Linos (2022), *Econometrica* 90(1), 81–116, DOI 10.3982/ECTA18709 **Confidence: strong.**
→ **Discount every published nudge effect by ~6×.** Treat ~1–3 pp as the realistic at-scale ceiling for
a messaging intervention. If the business case needs 10 pp from notifications, the business case is wrong.

**C7. Does nudging work at all? The Mertens–Maier exchange.**
- *Meta-analysis:* 200+ studies, >450 effect sizes, n=2,149,683. **d = 0.45, CI [0.39, 0.52]**.
  Decision-structure > decision-information/assistance. Authors themselves reported *"a moderate
  publication bias toward positive results."*
  Mertens, Herberz, Hahnel & Brosch (2022), *PNAS* 119(1), e2107346118, DOI 10.1073/pnas.2107346118.
- *Rebuttal, same dataset, Robust Bayesian Meta-Analysis:* unadjusted d = 0.43; **bias-adjusted
  d = 0.04 [0.00, 0.14]**; most-precise-estimates-only d = 0.11. By category: **information nudges
  d = 0.00, BF₀₁ = 33.84** (strong evidence *against* an effect); assistance d = 0.01, BF₀₁ = 9.05;
  structure d = 0.12, BF₀₁ = 1.12 (indecisive). Strong evidence against effects in finance (BF₀₁ =
  41.23) and health (8.98). *"after correcting for this bias, no evidence remains that nudges are
  effective as tools for behaviour change."*
  Maier, Bartoš, Stanley, Shanks, Harris & Wagenmakers (2022), *PNAS* 119(31), e2200300119, DOI
  10.1073/pnas.2200300119.
**Confidence: contested** — live dispute. But note where it *isn't*: Mertens concedes bias exists;
DellaVigna & Linos independently measure it; and the category that dies hardest is **d = 0.00 for
information nudges**, which is exactly what "here's a reminder about your course" is.
→ Defensible reading: **pure information/reminder nudges have effectively no evidence base once bias is
accounted for; structural changes to the choice environment retain a weak, contested signal.** Changing
*what the default study path is* has more support than *sending a message about it*.

---

## Current scholarly consensus, stated plainly

1. **Small-scale nudge results in education do not survive scaling.** Demonstrated in FAFSA campaigns
   (800k, precise zero), MOOCs (250k, order-of-magnitude attenuation), university coaching (25k, ruled
   out above 7% SD). Not one bad study — the modal outcome.
2. **The gap between published and at-scale effects is fully explained by publication bias plus low
   power** (DellaVigna & Linos). Quantified, not speculated.
3. **Pure information/reminder nudges are the weakest sub-category** — d = 0.00 after correction, and
   the null arm in the one MOOC RCT that isolated an alert tool.
4. **Effects survive where there is a human relationship, low caseload, and local context** — none of
   which scale cheaply, which is exactly why they weren't what got scaled.
5. **Behavioural interventions can backfire in the wrong context** (−1.7 pp where the targeted gap was
   absent). Aggregate nulls can hide offsetting subgroup effects in both directions.
6. **Engagement metrics and learning outcomes routinely diverge.** Kizilcec: week-1 activity up,
   completion flat. Oreopoulos: study time up ~2 hrs/week, grades flat. Settles & Meeder: retention up
   12%, learning never measured.

---

## Consolidated recommendation

**Do:** build **student-authored commitment** (self-set plan, exam date, weekly target) — the only arm
that moved grades (+0.29 SD) · fire in-app prompts at **task breakpoints you already own** (~5× lower
interruption cost) · **attribute messages to a named human** where possible · **remove friction** rather
than adding motivation (resume-where-you-left-off, pre-built plans, one-tap next exercise) ·
**per-category notification toggles** · invest in the **spacing/retrieval engine**, where the real
evidence is.

**Don't:** notify users about actions they took themselves (lowest-rated class at n=40,191) · use
dismissal as a relevance signal (44.2% of dismissed were rated maximally important) · optimise
framing/timing/channel after a null (already exhausted at n=800,000) · report week-1 engagement lift as
success · build a business case requiring >1–3 pp lift from messaging · manufacture streak/FOMO anxiety.

---

## Explicitly unverified

Localytics/vendor frequency thresholds (COI, secondary blogs, no methodology) · Castleman & Page 2015
exact effects and Ns (paywalled) · Bettinger et al. 2012 magnitudes (paywalled) · Adesope et al. 2017
headline g (paywalled, not guessed) · Patterson 2018 sample size · Iqbal & Horvitz 2007 alert-rate time
unit · Okoshi et al. 2017 PerCom (403'd, deliberately excluded) · Damgaard & Nielsen 2018 review
(pointer only) · Pielot & Rello 2017 stats (preprint rendering, not the ACM version) · Page, Sacerdote,
Goldrick-Rab & Castleman (2023), *EEPA* 45(2):195–219 — a fourth independent large-scale null, worth
chasing.

*Flagged outside the literature:* for a German platform, web/mobile push consent sits under GDPR +
§25 TDDDG, making the opt-in prompt a legally constrained, one-shot resource. Not researched, no legal
claim made — but it reinforces A7: burning a single global opt-in on low-value notifications is
unrecoverable.
