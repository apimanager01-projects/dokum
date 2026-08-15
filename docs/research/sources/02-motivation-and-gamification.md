# Motivation, reward, and what 19–25 y/o university students actually want
## Primary-source research for a German econ/maths study platform

**Compiled:** 2026-08-15 · **Scope:** Part 2 of the product research — motivation mechanics, reward psychology, feedback design, anxiety, and the ethical/regulatory line.

---

## Decision table — the whole document in one screen

| Mechanic | Best evidence | Confidence | Verdict |
|---|---|---|---|
| **Progress bars / goal gradient** | Endowed progress: 34% vs 19% completion (Nunes & Drèze 2006); purchase acceleration near goal (Kivetz et al. 2006) | strong (consumer), moderate (transfer to learning) | **Ship.** Best mechanic here. Many short bars, honest starting progress. |
| **Mastery experiences / calibrated success** | Mastery = strongest source of self-efficacy (Bandura 1977; Usher & Pajares 2008); self-efficacy = strongest of 50 correlates of university GPA (Richardson et al. 2012) | strong | **Ship — make it the core.** This is the user's "small successes" instinct, and it is verified. |
| **Competence feedback (task-directed)** | +0.33 free-choice, +0.31 interest (Deci et al. 1999); but >1/3 of feedback interventions *hurt* (Kluger & DeNisi 1996) | strong | **Ship, with a hard rule:** every string points at the task, never the person. |
| **Completion / checkmarks** | Progress principle, 12,000 diary entries (Amabile & Kramer 2011) | moderate | **Ship — but mark mastery, not exposure.** |
| **Resume-where-you-left-off ("Ovsiankina")** | 67% resumption rate, stable across 20–21 studies (Ghibellini & Meier 2025) | moderate | **Ship.** Least manipulative mechanic in the document. |
| **Adaptive difficulty** | 85% optimal training accuracy (Wilson et al. 2019 — *simulation, not human RCT*); retrieval practice g = +0.51 vs restudy (Adesope et al. 2017) | moderate / strong | **Ship, target ~80–85% success, and defend it from your own engagement metrics.** |
| **Points / XP** | Included in the g ≈ 0.46–0.49 gamification effect but never isolated; drives "preference for easy tasks" (Toda et al. 2018) | moderate | **Constrain hard.** Only as an exam-readiness estimate. Never a spendable currency. |
| **Badges** | Achievement effect yes, motivation effect inconclusive (badge meta-analysis 2024); harmed motivation + exam scores over a semester (Hanus & Fox 2015) | contested | **Content badges only.** Delete every behavioural/whimsical badge. |
| **Growth-mindset feature** | d = 0.08 (Sisk et al. 2018); n.s. among best-practice studies (Macnamara & Burgoyne 2023) vs d = 0.14 (Burnette et al. 2023) | contested, but all endpoints tiny | **Ship the copywriting. Don't ship a feature.** |
| **Daily streaks** | Duolingo's own *causal* A/Bs: +1.7% D7 retention, +0.38% DAU. Correlational claims (3.6×) are selection-confounded | moderate (vendor) | **Don't ship.** Weekly, forgiving, never-resetting instead. |
| **Leaderboards** | Lower motivation, satisfaction, empowerment AND lower exam scores over a 16-week university semester (Hanus & Fox 2015); low rank → competence frustration | strong (for the harm) | **Don't ship. No variant.** |
| **Zeigarnik-based design** | Recall ratio 0.99, dz = 0.15, k = 38 (Ghibellini & Meier 2025) | strong that it's **not real** | **Don't ship.** Build the resume feature instead. |
| **Timers on practice** | Working memory is the mechanism of maths anxiety (Ashcraft & Kirk 2001) | strong (mechanism), contested (timed-test claim) | **Opt-in Klausursimulation only.** |
| **Anxiety interventions (10-min writing, arousal reappraisal)** | Ramirez & Beilock 2011 (*Science*, 2 field RCTs); reappraisal meta d = 0.23 | moderate | **Ship both.** Cheap, evidence-backed, anti-gamification. |
| **Scheduled spaced retrieval (default-on)** | Spacing: 47.3% vs 36.7% recall, k = 271, N = 14,811 (Cepeda et al. 2006). Yet **84% of students reread, 11% self-test**, 59% schedule by deadline (Karpicke et al. 2009; Kornell & Bjork 2007) | strong | **Ship — this is the highest-value feature in the document.** Bigger than every gamification mechanic combined. |
| **Prerequisite-gap diagnostic (weeks 1–4)** | **59% Bachelor dropout in university Mathematik**; performance problems involved in **84%** of Math/Nat dropouts; **30%** could not compensate for missing prior knowledge (DZHW 2022; DZHW 2017) | strong | **Ship — this is the actual product-market fit.** |
| **Mobile-first design** | ~**3%** of students are phone-primary for academic work; 81–86% laptop/desktop-primary across four EDUCAUSE waves | moderate | **Don't.** Desktop-first; mobile is for review, not problem-solving. |
| **Loss framing / "you'll lose your progress"** | λ = **1.07**, CI [0.97, 1.18], **n.s.**, in the artefact-free cell of Brown et al.'s own dataset (Yechiam & Zeif 2025) | contested → effectively neutral | **Drop the rationale.** If used at all, A/B test against a prior of zero. |
| **Re-prompting after a decline / guilt copy / fake timers** | UCPD Annex I Nos 7 and 26 — unfair **in all circumstances**, no intent required (Commission Notice OJ C 526) | strong (legal) | **Hard stop.** Not a judgement call. |

---

## How to read this

Every mechanism gets four fields:

- **Evidence** — what was actually measured, with effect sizes.
- **Source** — the source that *owns* the claim. Full citation + URL.
- **Confidence** — `strong` (multiple independent replications or a large well-conducted meta-analysis) / `moderate` (one good meta-analysis or several primary studies, some heterogeneity) / `contested` (the literature genuinely disagrees and I say how) / `weak` (single study, secondary write-up, or vendor claim).
- **Verdict** — ship it / ship it with a constraint / don't ship it.

**Effect-size calibration for education research** (use this to read the numbers below): Cohen's conventions (d = 0.2 small, 0.5 medium, 0.8 large) are misleading in education. In educational field studies a *d* of 0.10–0.20 is a real, deployable effect; 0.40+ from a classroom RCT is unusual and usually shrinks on replication. Treat anything above 0.60 from a small-k meta-analysis as probably inflated by publication bias.

**Provenance honesty:** where I read the primary paper's own text/abstract directly, I say `[fetched primary]`. Where the number comes from a search-engine synthesis of the abstract (accurate but one step removed), I say `[abstract via search]`. Where I could only find a secondary write-up, the confidence is `weak` and I say so. Nothing below is invented; where I could not verify a figure I say "unverified".

---

# 1. Self-Determination Theory (Deci & Ryan)

## 1.1 The core theory

**Evidence.** SDT posits three innate, universal psychological needs whose satisfaction produces self-motivation and wellbeing and whose thwarting produces diminished motivation: **autonomy** (volition, self-endorsement of one's actions), **competence** (effectance, feeling capable), **relatedness** (connection to others). Critically for product design, SDT is not "intrinsic vs extrinsic" as a binary — it is a *continuum of internalisation* (external regulation → introjected → identified → integrated → intrinsic). Extrinsically-motivated behaviour can be fully autonomous if the person has internalised its value. This matters enormously here: **exam preparation is inherently extrinsically motivated**, and the design goal is not to make maths intrinsically fascinating but to move regulation from "external" (I must, or I fail) to "identified" (I want this, because I want the degree).

**Source.** Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. *American Psychologist*, 55(1), 68–78. DOI 10.1037/0003-066X.55.1.68. Full text (author-hosted): https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf `[abstract via search + author-hosted PDF located]`

**Confidence.** `strong` as a theoretical framework — it is one of the most-cited papers in psychology and the need-satisfaction → outcome links replicate broadly. Note the standard caveat: SDT is a *framework*, and framework-level claims are hard to falsify. The specific predictions (below) are what carry weight.

**Verdict for this product.** **Ship the framework as your design constraint, not as a feature.** Concretely: (a) *autonomy* — let students choose what to work on and in what order; never force a linear path; make every gamified element opt-out. (b) *competence* — this is the one your product can actually move, via calibrated difficulty and immediate correctness feedback (see §6, §7). (c) *relatedness* — the weakest lever for a solo study tool; don't force social features to manufacture it.

**A note on relatedness specifically.** SDT's relatedness need is real, but note what it is *not*: it is not competition, and a leaderboard does not satisfy it (Sailer et al. 2017 found relatedness satisfied by **avatars, meaningful stories and teammates** — cooperative elements — not by leaderboards, which loaded onto competence). German students already have a strong relatedness structure for exam prep: the **Lerngruppe**. A product that *supports* an existing Lerngruppe (shared problem sets, a link a friend can open) is aligned with the need; a product that manufactures synthetic strangers to compete against is not. If you build any social feature, build the cooperative kind.

## 1.2 SDT-based interventions in education

**Evidence.** Autonomy-support interventions reliably change *teacher* behaviour (Su & Reeve 2011 meta-analysis: d = 0.632 for improving teachers' autonomy-supportive mindset and skills) but that meta-analysis did **not** establish the downstream effect on student outcomes. A 2024 systematic review/meta-analysis of SDT-based interventions in education exists (Wang, Wang et al., *Learning and Instruction*, 2024) — I located it but could not extract its effect sizes (the hosted PDF was not machine-readable); **treat its numbers as unverified here.**

**Source.** Su, Y.-L., & Reeve, J. (2011). A meta-analysis of the effectiveness of intervention programs designed to support autonomy. *Educational Psychology Review*, 23(1), 159–188. DOI 10.1007/s10648-010-9142-7. https://link.springer.com/article/10.1007/s10648-010-9142-7 `[abstract via search]` · Wang, Wang et al. (2024), *Learning and Instruction*, DOI 10.1016/j.learninstruc.2024.101940 — https://selfdeterminationtheory.org/wp-content/uploads/2024/06/2024_WangWangEtAl_MetaEdu.pdf `[located, not extracted]`

**Confidence.** `moderate` for the teacher-training link; `weak/unverified` for the student-outcome chain.

**Verdict.** Autonomy support is cheap to implement in software (choice, rationale, non-controlling language) and has no downside. Ship it. Don't claim a specific effect size for it.

---

# 2. The undermining effect / overjustification — does adding points break intrinsic motivation?

**This is the single most consequential question for whether you ship points and badges. The honest answer: the effect is real, well-replicated, and *narrower than the popular story*.**

## 2.1 The case FOR undermining — Deci, Koestner & Ryan (1999)

**Evidence.** Meta-analysis of **128 experiments**. Effects on *free-choice behavioural persistence* after the reward is withdrawn:

| Reward contingency | d (free-choice intrinsic motivation) |
|---|---|
| Engagement-contingent (reward for merely doing the task) | **−0.40** |
| Completion-contingent (reward for finishing) | **−0.36** |
| Performance-contingent (reward for doing well) | **−0.28** |

Effects on *self-reported interest*: engagement-contingent **d = −0.15**, completion-contingent **d = −0.17**.

And the crucial positive finding, which is the design lever:

| Positive verbal feedback | d |
|---|---|
| free-choice behaviour | **+0.33** |
| self-reported interest | **+0.31** |

All tangible rewards and all *expected* rewards undermined; unexpected rewards and verbal rewards did not.

**Source.** Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668. DOI 10.1037/0033-2909.125.6.627. Full PDF: https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf · mirror: https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf `[abstract via search; primary PDF located]`

**Confidence.** `strong` for the experimental finding as stated. `contested` for its generalisation to real educational settings (see below).

## 2.2 The case AGAINST — Cameron & Pierce (1994) and Cameron, Banko & Pierce (2001)

**Evidence.** Cameron & Pierce's meta-analysis of **96 experiments** concluded that *overall*, reward does **not** decrease intrinsic motivation; that **verbal praise increases** it; and that the only negative effect appears for **expected tangible rewards delivered for merely doing a task**, where the effect is "minimal" and shows up only on free-choice time-on-task after reward withdrawal. Their policy conclusion was that the undermining effect is too narrow to justify avoiding rewards in education.

**Source.** Cameron, J., & Pierce, W. D. (1994). Reinforcement, reward, and intrinsic motivation: A meta-analysis. *Review of Educational Research*, 64(3), 363–423. DOI 10.3102/00346543064003363. https://journals.sagepub.com/doi/10.3102/00346543064003363 `[abstract via search]` · Cameron, J., Banko, K. M., & Pierce, W. D. (2001). Pervasive negative effects of rewards on intrinsic motivation: The myth continues. *The Behavior Analyst*, 24(1), 1–44. PubMed: https://pubmed.ncbi.nlm.nih.gov/22478353/ · PDF: https://www.behavior.org/resources/331.pdf `[located; PDF not machine-extractable]`

## 2.3 The actual disagreement — reported honestly

Deci, Koestner & Ryan replied twice, arguing the Cameron/Pierce meta-analyses were miscoded and that aggregating across contingency types masks the effect:

- Deci, Koestner & Ryan (1999). The undermining effect is a reality after all — Extrinsic rewards, task interest, and self-determination: Reply to Eisenberger, Pierce, and Cameron (1999) and Lepper, Henderlong, and Gingras (1999). *Psychological Bulletin*, 125(6), 692–700.
- Deci, Koestner & Ryan (2001). Extrinsic rewards and intrinsic motivation in education: Reconsidered once again. *Review of Educational Research*, 71(1), 1–27. https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf
- Deci, Ryan & Koestner (2001). The pervasive negative effects of rewards on intrinsic motivation: Response to Cameron (2001). *Review of Educational Research*, 71(1), 43–51. https://journals.sagepub.com/doi/10.3102/00346543071001043

**What both camps actually agree on** (this is the useful part, and it is rarely reported):

1. **Verbal praise / positive competence feedback increases intrinsic motivation.** Both meta-analyses find this. It is the strongest positive finding in the whole literature.
2. **Unexpected rewards do not undermine.** Both agree.
3. **Task-non-contingent rewards do not undermine.** Both agree.
4. **Expected, tangible, salient rewards given for merely engaging with a task do reduce free-choice persistence once withdrawn.** Both agree it happens; they disagree about size and importance.
5. The disagreement is about **magnitude, study coding, and whether laboratory free-choice-persistence generalises to a semester of coursework.**

**Confidence.** `contested` — but productively so. The zone of agreement is large enough to design from.

**Verdict for a university econ/maths platform.**
- **Do not** attach a *tangible, expected, withdrawable* reward to merely opening the app or doing a lesson. That is exactly the engagement-contingent cell with d = −0.40.
- **Do** deliver competence feedback ("you got 8/10; here's the one concept you're missing") — that is the +0.33 cell.
- The undermining literature is about *withdrawal*. If a reward is a permanent, non-withdrawable property of the product (a progress record that never resets), the classic overjustification paradigm doesn't cleanly apply — but there is no direct evidence that this is safe either. **Ship points only as an information display, never as a currency.**
- **Highest-risk design in this whole document:** a virtual currency the student "spends", which is engagement-contingent, tangible, expected, and withdrawable all at once.

---

# 3. Gamification in higher education — the meta-analytic picture

## 3.1 Sailer & Homner (2020) — the best-conducted one, and the one that separates outcome types

**Evidence.** Random-effects meta-analysis separating three outcome families:

| Outcome | g | 95% CI | k | N |
|---|---|---|---|---|
| **Cognitive** (learning/achievement) | **0.49** | [0.30, 0.69] | 19 | 1,686 |
| **Motivational** | **0.36** | [0.18, 0.54] | 16 | 2,246 |
| **Behavioural** (engagement/time-on-task) | **0.25** | [0.04, 0.46] | 9 | 951 |

**The key methodological finding, and the reason to trust this paper:** when the authors re-ran the analysis restricted to studies with **high methodological rigour**, the *cognitive* effect stayed stable, but the *motivational* and *behavioural* effects were **less stable**. That is the opposite of the industry folk-belief ("gamification obviously drives engagement; whether it teaches anything is unclear"). The rigorous evidence says the learning effect is the sturdier one and the engagement effect is the shakier one.

**Source.** Sailer, M., & Homner, L. (2020). The gamification of learning: A meta-analysis. *Educational Psychology Review*, 32(1), 77–112. DOI 10.1007/s10648-019-09498-w. https://eric.ed.gov/?id=EJ1245270 `[abstract via search]`

**Confidence.** `moderate–strong`. Small k per cell (9–19 studies) is the main limitation.

## 3.2 Huang et al. (2020) — convergent overall estimate

**Evidence.** k = 30 independent studies, N = 3,083, comparing gamified to non-gamified conditions in formal education. Overall random-effects **g = 0.464, 95% CI [0.244, 0.684]** — small-to-medium, and the CI lower bound is well above zero.

**Source.** Huang, R., Ritzhaupt, A. D., Sommer, M., Zhu, J., Stephen, A., Valle, N., Hampton, J., & Li, J. (2020). The impact of gamification in educational settings on student learning outcomes: A meta-analysis. *Educational Technology Research and Development*, 68(4), 1875–1901. DOI 10.1007/s11423-020-09807-z. https://eric.ed.gov/?id=EJ1266144 `[abstract via search]`

**Confidence.** `moderate`. Two independent meta-analyses landing at g ≈ 0.46–0.49 for learning outcomes is reassuring convergence.

## 3.3 The counter-case: Hanus & Fox (2015) — gamification that made things worse

**Evidence.** A 16-week semester-long quasi-experiment across two sections of the same university course. One section got **badges + a leaderboard**; the other got the identical curriculum without them. Measured at four time points. Result: the gamified section showed **less intrinsic motivation, less satisfaction, and less learner empowerment over time**, and **lower final exam scores** — with the exam-score difference **mediated by intrinsic motivation**. This is the causal chain SDT predicts: badges + leaderboard → reduced intrinsic motivation → worse performance.

**Source.** Hanus, M. D., & Fox, J. (2015). Assessing the effects of gamification in the classroom: A longitudinal study on intrinsic motivation, social comparison, satisfaction, effort, and academic performance. *Computers & Education*, 80, 152–161. DOI 10.1016/j.compedu.2014.08.019. https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000 `[abstract via search]`

**Confidence.** `moderate` — it is a single quasi-experiment (not randomised at the student level), but it is longitudinal, in the exact population of interest (university students, full semester), and it is the most-cited negative result in the field. **Weight it heavily precisely because it matches your context.**

## 3.4 Novelty effect and decay

**Evidence.** A 14-week longitudinal study of **756 STEM students** found the impact of gamification follows a **U-shape**, not a monotonic decay: the effect began to **decrease after about 4 weeks**, the decline lasted **2–6 weeks**, and then **recovered on an uptrend between weeks 6 and 10** — which the authors attribute to a *familiarisation* effect succeeding the novelty effect. So "gamification stops working after a month" is too simple; the trough is real, and so is the partial recovery.

Separately, meta-analytic moderator analyses report the highest effect sizes for interventions of roughly **one semester (3–6 months)**, with **smaller effects for durations longer than a semester**.

**Source.** Rodrigues, L., Toda, A. M., Oliveira, W., Palomino, P. T., Avila-Santos, A. P., & Isotani, S. (2022). Gamification suffers from the novelty effect but benefits from the familiarization effect: Findings from a longitudinal study. *International Journal of Educational Technology in Higher Education*, 19, 13. DOI 10.1186/s41239-021-00314-6. https://link.springer.com/article/10.1186/s41239-021-00314-6 `[abstract via search]` · Tsay, Kofinas & Luo (2019), *Computers & Education* — https://gala.gre.ac.uk/id/eprint/25375/7/25375%20TSAY_Overcoming_The_Novelty_Effect_In_Online_Gamified_Learning_Systems_(AAM)_2019.pdf `[located]`

**Confidence.** `moderate`. One large longitudinal study, well-designed, in the right population.

**Verdict.** A German university semester is ~14–15 weeks. **Your gamification will hit its trough at roughly week 4–6 — exactly when the semester content gets hard and before exams create their own motivation.** Design for that trough explicitly: that is the moment to shift from novelty (new badges) to utility (exam countdown, gap analysis, "these are the 6 concepts you still can't do").

## 3.5 Which elements do what — the mechanism study

**Evidence.** Sailer et al.'s experimental study (not a meta-analysis — a designed experiment varying element configurations) found:
- **Badges, leaderboards, and performance graphs → satisfy the *competence* need** and increase perceived task meaningfulness.
- **Avatars, meaningful stories, and teammates → satisfy *relatedness*.**
- Notably, **no configuration reliably produced autonomy satisfaction.**

**Source.** Sailer, M., Hense, J. U., Mayr, S. K., & Mandl, H. (2017). How gamification motivates: An experimental study of the effects of specific game design elements on psychological need satisfaction. *Computers in Human Behavior*, 69, 371–380. DOI 10.1016/j.chb.2016.12.033. Open-access: https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/deliver/index/docId/109059/file/109059.pdf `[abstract via search; OA PDF located]`

**Contradicting evidence — flag this.** A 2024 meta-analysis in *ETR&D* reports the reverse pattern: gamification producing a substantial effect on **autonomy** (Hedges' g = 0.638, p = .012) and only a **minimal** effect on **competence** (g = 0.277, p = .049). Two credible sources disagree about which need gamification serves.

**Source.** "Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency: A meta-analysis and systematic review." *Educational Technology Research and Development* (2024). DOI 10.1007/s11423-023-10337-7. https://link.springer.com/article/10.1007/s11423-023-10337-7 `[abstract via search]`

**Confidence.** `contested` on *which* need is served. `moderate` on the claim that some need is served.

**Verdict.** Don't build a product thesis on "badges satisfy competence." Build it on the measurable thing: **badges are a feedback channel.** If the badge carries diagnostic information ("you have now solved 20 integration-by-parts problems"), it is feedback. If it carries no information ("Early Bird!"), it is a token — and tokens are what the undermining literature warns about.

## 3.6 The documented negative effects

**Evidence.** A systematic mapping of negative effects of gamification in education identified four: **loss of performance, cheating/undesired behaviour, declining motivation (indifference), and preference for easy tasks.** **Leaderboards were the element most strongly associated with the mapped negative effects.**

The "preference for easy tasks" finding is the one that should worry you most for a maths product: if points scale with volume, students optimise for volume, which means picking problems they can already do. That is the exact opposite of desirable difficulty (§7.3).

**Source.** Toda, A. M., Valle, P. H. D., & Isotani, S. (2018). The dark side of gamification: An overview of negative effects of gamification in education. In *Higher Education for All* (Springer CCIS 832). DOI 10.1007/978-3-319-97934-2_9. https://link.springer.com/chapter/10.1007/978-3-319-97934-2_9 `[abstract via search]` · See also: "Negative effects of gamification in education software: Systematic mapping and practitioner perceptions," *Information and Software Technology* (2022). https://www.sciencedirect.com/science/article/abs/pii/S0950584922002518

**Confidence.** `moderate` — systematic mapping, not a quantitative meta-analysis.

---

# 4. Mechanics, one by one

## 4.1 Points / XP

**Evidence for.** Points are the substrate of most studies in §3, so the g ≈ 0.46–0.49 learning effect includes them; they are almost never isolated. Where isolated, the effect operates through *competence feedback* (Sailer et al. 2017), i.e. points work when they tell you something true about your performance.

**Evidence against.** Points-for-engagement is the exact configuration of the **d = −0.40** cell in Deci et al. (1999). Points also drive the "preference for easy tasks" pathology (Toda et al. 2018) when they scale with volume rather than difficulty.

**What it does to a 19–25 y/o rather than a schoolchild.** A university student in an econ programme is already inside a formal points system with far higher stakes: **ECTS credits and a Note (grade) that determines Master's admission and employability**. Your XP number competes with a real currency and loses. Worse, it risks reading as infantilising — the same token economy their 12-year-old sibling gets from Anton or Duolingo. Adults under exam pressure evaluate features by *instrumentality*: "does this get me through the Klausur?" A number that doesn't map to exam readiness is noise.

**Confidence.** `moderate` (for) / `strong` (for the specific risk configuration).

**Verdict: ship it with a hard constraint.** Points are acceptable **only** if the number is a *proxy for exam readiness*, not for effort. Concretely: score by **mastery of concepts**, not by minutes or lessons. A "you can now do 18 of the 25 exam-relevant problem types" counter is competence feedback. An "XP 4,320" counter is a token. Never let points decay, never let them be spent, and never make them the headline number on the home screen.

## 4.2 Badges

**Evidence for.** Badges reliably affect *behaviour* (students do the badged activity). A meta-analysis of digital badges reports a significant impact on **learning achievement** but finds the effect on **motivation inconclusive**, with stronger effects in **higher education**, in **STEM**, and for **medium durations of 1–9 weeks**. In a well-known university CS study, achievement badges changed students' behaviour toward the badged activities even where they had no effect on total time spent.

**Evidence against.** Hanus & Fox (2015): badges + leaderboard produced *lower* intrinsic motivation, satisfaction and exam scores over a semester. Digital badges in undergraduate composition raised intrinsic motivation **only for high expectancy-value learners** — i.e. badges help the students who were already going to succeed, which is a fairness problem in a product sold to students who are struggling. A first-year university badge study found badges improved engagement with feedback **but that delaying the award of marks to accommodate badges caused significant student anxiety.**

**Source.** Meta-analysis of digital badges in educational settings, *Educational Technology & Society* (2024). https://www.doaj.org/article/098444d5c28243b0a504d88eceecd739 `[abstract via search]` · "The effect of achievement badges on students' behavior: An empirical study in a university-level computer science course," *International Journal of Emerging Technologies in Learning (iJET)* (2015) — **author attribution not verified**; PDF: https://online-journals.org/index.php/i-jet/article/download/4221/3394/14385 · Reid, Paster & Abramovich (2015). Digital badges in undergraduate composition courses: Effects on intrinsic motivation. *Journal of Computers in Education*, 2, 377–398. https://link.springer.com/article/10.1007/s40692-015-0042-1 · "Awarding digital badges: Research from a first-year university course," *Higher Education Research & Development* (2024). https://www.tandfonline.com/doi/full/10.1080/07294360.2024.2315039 `[all abstract via search]`

**What it does to this age group.** Badges have a **credentialing** meaning to adults that they don't have to children. A badge that could plausibly go on a CV or a LinkedIn profile is read as valuable; a badge that is obviously internal decoration is read as childish. This is the cleanest fork in the design space.

**Confidence.** `contested`. The achievement effect is moderately supported; the motivation effect is not.

**Verdict: ship it with a constraint — or don't ship it.** Only ship badges that are (a) **content-defined** ("Integralrechnung: Grundlagen abgeschlossen"), (b) **permanent**, and (c) **useful as a self-diagnostic map** of what the student has and hasn't covered. If the badge set is really a syllabus checklist rendered as icons, it is a progress map and it is fine. If you find yourself designing "Nachteule" (owl, studied after midnight) or "7 Tage in Folge", you have crossed into the Hanus & Fox failure mode. **Delete the whimsical tier entirely.**

## 4.3 Streaks — the mechanic with the biggest gap between engagement data and student welfare

### The engagement evidence (first-party, vendor)

**Evidence.** Duolingo's own published engineering/product writing reports:
- Learners on a **7-day streak are 3.6× more likely to complete their course** (correlational — streakers are self-selected; this is not a causal estimate).
- A separate Duolingo post reports 7-day streakers are **2.4× more likely to return the next day** (again correlational).
- **Causal A/B results, which are much smaller than the correlations:** improving the streak animation raised 7-day new-learner retention by **+1.7%**; doubling the Streak Freeze allowance from 1 to 2 raised daily active learners by **+0.38%**.
- A "Streak Wager" A/B test (spend in-game currency to bet on maintaining a 7-day streak) produced statistically significant lifts in D1/D7/D14 retention, largest at **D7: +14%**.
- Duolingo themselves note the diminishing psychological value of streak extension: going 2→3 days is a 50% increase; 200→201 days is a 0.5% increase.

**Source.** Mansur, O. (2022, 31 January). *How the Duolingo streak builds habit*. Duolingo Blog. https://blog.duolingo.com/how-duolingo-streak-builds-habit/ · Duolingo Blog, *How Streaks keep Duolingo learners committed to their language goals*. https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/ `[fetched primary — first-party vendor]`

**Confidence.** `moderate` for the A/B numbers (they are real randomised experiments at enormous n), `weak` for the 3.6× / 2.4× figures (correlational, selection-confounded).

**⚠️ Conflict of interest, stated plainly.** This is **vendor research published by a company whose valuation depends on DAU**. Duolingo's optimisation target is *return visits*, not *learning*, and the two are only loosely coupled. Note also the shape of the honest numbers: the *correlational* claims are enormous (3.6×) and the *causal* claims are tiny (+0.38%, +1.7%). That gap is the whole story. **A vendor's headline streak statistic is almost always the correlational one.**

### The harm evidence

**Evidence.** The documented harms are real but the literature is thinner and much of it is qualitative or non-peer-reviewed:
- **Loss framing after a break.** Duolingo's own post concedes breaking a streak is "quite *de*motivating" and may deter learners from starting one — which is why Streak Freeze exists.
- **Run-streak cessation research.** A study of recreational runners who broke long-term run streaks specifically examines the *backfire potential* — the lead-up period and the immediate and longer-term consequences of streak cessation. **This is a preprint (medRxiv), not peer-reviewed at time of writing.** https://www.medrxiv.org/content/10.1101/2024.12.26.24319676.full.pdf `[weak — preprint]`
- A qualitative peer-reviewed study of streaking as a behaviour-change technique in recreational runners exists: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11494719/ `[located]`
- **Widely circulated statistics I could NOT verify and you should NOT use:** claims that streak-trackers are "63% more likely to abandon habits after one missed day" (attributed to a 2020 *JPSP* paper) and that streak-breakers are "2.3× more likely to quit permanently" appear only in commercial blog posts (habit-app vendors) with no traceable citation. **I searched for the underlying papers and could not find them. Treat both as unsourced marketing copy.**
- The **"what-the-hell effect"** (Cochran & Tesser, 1996) is the real, older construct behind streak-break abandonment — a single goal violation triggering disproportionate abandonment. That literature exists and is respectable, but I did not verify a streak-specific application.

**What a streak does to a 19–25 y/o university student, specifically.** This is where streaks are worst-suited to your audience, for reasons that don't apply to Duolingo:

1. **A German university semester has structural zero-activity periods.** Klausurenphase for *other* subjects, Praktikum, Semesterferien, illness, a weekend visit home. A daily streak punishes a student for having a life that a Bachelor's programme mandates.
2. **The behaviour a streak rewards (daily brief contact) is not the behaviour that passes a maths exam** (long, difficult, focused problem-solving blocks). A streak is optimised for a 3-minute language lesson. Applied to Mathematik I, it will reward the student for opening the app and doing the easiest available thing — the "preference for easy tasks" pathology from Toda et al. (2018), now with a daily loss-aversion enforcement mechanism attached.
3. **Streak loss lands on students who are already anxious.** Your audience overlaps heavily with maths-anxious students (§9). Adding an additional daily failure state to a maths product is actively counterproductive.
4. **Adults resent obvious manipulation more than children do**, and streak mechanics are now culturally legible as manipulation. "Duolingo owl" is a meme *about being guilt-tripped*.

**Verdict: don't ship a daily streak.** If you want the consistency benefit without the harm, ship a **weekly, forgiving, non-losable** consistency measure — e.g. "in 9 of the last 12 weeks you studied at least twice", which never resets to zero, never produces a single-day failure state, and matches how a semester actually runs. If you ship anything streak-like at all, the streak-freeze equivalent must be **automatic and free**, never a purchasable currency (a purchasable streak-saver is the mechanic that most clearly attracts the EU dark-patterns analysis in §10).

## 4.4 Leaderboards / social comparison

**Evidence for.** Leaderboards satisfy the competence need for *high-ranked* users (Sailer et al. 2017), and *relative* leaderboards (showing only the few people immediately above you) outperform absolute ones by making the next rung attainable.

**Evidence against — this is the best-documented harm in the whole gamification literature.**
- **Hanus & Fox (2015):** semester-long, university students, badges + leaderboard → less motivation, less satisfaction, less empowerment, **lower final exam scores**, mediated by intrinsic motivation.
- **Toda et al. (2018):** leaderboards are the element most strongly associated with the mapped negative effects (loss of performance, cheating, declining motivation, preference for easy tasks).
- **Bai, Hew, Sailer & Jia (2021), "From top to bottom":** examines specifically how *position* on different leaderboard types affects online students' learning performance, intrinsic motivation and course engagement. High positions help; **low positions harm.**
- **Competence frustration mechanism:** a study in *Internet Research* models leaderboard position → competence satisfaction (high rank) vs **competence frustration** (low rank) → motivation. The mechanism is not "competition is motivating"; it is "rank is a competence signal, and a bad one demotivates."

**Source.** Hanus & Fox (2015), as above. · Toda, Valle & Isotani (2018), as above. · Bai, S., Hew, K. F., Sailer, M., & Jia, C. (2021). From top to bottom: How positions on different types of leaderboard may affect fully online student learning performance, intrinsic motivation, and course engagement. *Computers & Education*, 173, 104297. DOI 10.1016/j.compedu.2021.104297. https://www.sciencedirect.com/science/article/abs/pii/S0360131521001743 · "How leaderboard positions shape our motivation: The impact of competence satisfaction and competence frustration on motivation in a gamified crowdsourcing task," *Internet Research*, 33(7). https://www.emerald.com/intr/article/33/7/1/178330/ `[all abstract via search]`

**What it does to this age group specifically.** German university cohorts in econ/maths are already *brutally* comparison-saturated: the Notenspiegel, curved Klausur results, publicly discussed Durchfallquoten (failure rates, which in first-year maths-heavy modules routinely exceed 30–50%), and NC-based selection. A leaderboard adds a **redundant** comparison signal to students who are drowning in comparison, and it delivers that signal to precisely the bottom-quartile students who are your most valuable customers (the ones who need the product and will pay for it).

**Confidence.** `strong` that low-rank positions demotivate. `moderate` that leaderboards net-harm in semester-long university settings.

**Verdict: don't ship a leaderboard.** There is no version of a public ranking that is safe for a paid study aid whose core customer is a student worried about failing. If you want any social signal at all, use **anonymous distributional feedback with a positive frame** — "you have covered more of Kapitel 3 than most students at this point in the semester" — and only ever show it when it is favourable, and let the student turn it off. Never show a student their rank.

## 4.5 Progress bars and the goal-gradient effect

**Evidence — the original.** Kivetz, Urminsky & Zheng resurrected the behaviourist goal-gradient hypothesis in humans across a café loyalty programme ("buy 10 coffees, get 1 free") and an online music-rating task. Findings:
- **Purchase acceleration:** customers bought coffee more frequently as they approached the free-coffee threshold; online raters visited more often, rated more songs per visit, and persisted longer as they approached the reward.
- **Illusionary goal progress:** a **12-stamp card with 2 stamps pre-awarded** produced acceleration relative to an economically identical 10-stamp card — the *perception* of progress drives effort, not the actual remaining distance.
- They also document a **post-reward reset** (effort drops after the reward is collected) and link goal-gradient steepness to **customer retention**.

**Source.** Kivetz, R., Urminsky, O., & Zheng, Y. (2006). The goal-gradient hypothesis resurrected: Purchase acceleration, illusionary goal progress, and customer retention. *Journal of Marketing Research*, 43(1), 39–58. DOI 10.1509/jmkr.43.1.39. Author-hosted PDF: https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf `[abstract via search; primary PDF located]`

**Evidence — the endowed-progress replication.** Nunes & Drèze ran the cleanest version: car-wash loyalty cards, **8 stamps required, blank** vs **10 stamps required, 2 pre-stamped** (identical work). **Completion: 34% (pre-stamped) vs 19% (blank)** — a near-doubling. Their mechanism analysis attributes the effect to *reframing the task as already-begun*, not to sunk-cost avoidance.

**Source.** Nunes, J. C., & Drèze, X. (2006). The endowed progress effect: How artificial advancement increases effort. *Journal of Consumer Research*, 32(4), 504–512. DOI 10.1086/500480. https://academic.oup.com/jcr/article-abstract/32/4/504/1787425 · SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962 `[abstract via search]`

**Confidence.** `strong` for goal-gradient acceleration in consumer settings (two independent studies, consistent, large field samples). `moderate` for the transfer to learning contexts — **I found no direct educational replication of the endowed-progress manipulation.** Do not claim there is one.

**Ethical note that matters for §10.** *Endowed progress is an intentional illusion.* Nunes & Drèze's manipulation works precisely because the two cards are economically identical and the customer doesn't notice. Pre-filling a student's progress bar with progress they didn't earn is a deception. It is small and benign-looking, and it is still a deception, and under an EU dark-patterns analysis "manipulating the perception of progress to increase engagement" is not obviously safe. **There is a legitimate version**: give real credit for a real thing (a diagnostic test the student actually took) and *display* it as starting progress. That is honest and captures most of the effect.

**Verdict: ship progress bars — this is the strongest, safest mechanic in this document.** Specifically:
- Progress bars are **information**, not reward. They don't trigger the undermining effect (no tangible withdrawable reward).
- Make them **granular and short**: a bar that fills visibly within one session beats a bar representing a whole semester (the goal gradient is steepest near the goal, so many short goals means many steep zones).
- Show the **remaining** distance, not just the covered distance, when the remainder is small ("noch 3 Aufgaben") — that is where the gradient bites.
- Expect the **post-reward reset**: after a student completes a chapter, effort drops. Design the next chapter's first step to be trivially small.
- Earn the starting progress honestly via a placement/diagnostic test.

## 4.6 The Zeigarnik effect — **this one does not replicate. Do not build on it.**

**Evidence.** A 2025 meta-analysis synthesised **59 publications** (38 Zeigarnik, 20 Ovsiankina, 1 both). Findings:

| Measure | Result |
|---|---|
| Ratio of interrupted:completed task recall, **including** Zeigarnik's original 1927 data (k = 38) | **0.99** |
| Same ratio, **excluding** Zeigarnik's original data (k = 37) | **0.99** |
| Proportion of recalled tasks that were interrupted, incl. original (k = 14) | **49.43%** |
| Same, excl. original (k = 13) | **49.16%** |
| Cohen's dz (k = 8) | **0.15** ("a small effect") |
| **Ovsiankina** effect — resumption rate, incl. original (k = 21) | **67.00%** |
| Ovsiankina, excl. original (k = 20) | **66.79%** |

A ratio of 0.99 and a 49.4% share are **exactly chance**. There is no memory advantage for unfinished tasks. The authors' conclusion: *"the Ovsiankina effect represents a general tendency, whereas the Zeigarnik effect lacks universal validity."*

**Source.** Ghibellini, R., & Meier, B. (2025). Interruption, recall and resumption: A meta-analysis of the Zeigarnik and Ovsiankina effects. *Humanities and Social Sciences Communications*, 12(1), 962. DOI 10.1057/s41599-025-05000-w. https://www.nature.com/articles/s41599-025-05000-w `[fetched primary — full numbers extracted from the article]`

**Confidence.** `strong` that the Zeigarnik memory effect is **not** real as popularly stated. `moderate` that the **Ovsiankina resumption tendency is** real (~67% of interrupted tasks get resumed, stable with and without the original author's data).

**Verdict.** **Don't ship anything justified by "Zeigarnik."** The product-design folklore ("leave the task incomplete so it nags at them and they remember it") is built on a 1927 finding that a 2025 meta-analysis of 38 studies puts at exactly zero.

**But ship the thing that *did* survive.** The **Ovsiankina** effect — people tend to resume interrupted tasks, ~67% of the time — is the one with support. That is a **"Weitermachen" / resume-where-you-left-off** feature: a persistent, precise, one-tap return to the exact problem the student abandoned. That is not a psychological trick; it is removing friction from a tendency that already exists. It is also the least manipulative mechanic in this entire document.

## 4.7 Completion, checkmarks, and the "empty ring" pull

**Evidence.** I could find **no direct peer-reviewed evidence** for a "checkmark satisfaction" or "empty progress ring" effect as a named phenomenon. What exists is adjacent and real:
- **Goal-gradient / endowed progress** (§4.5) — strong, and it is the real mechanism people are gesturing at.
- **The progress principle** (Amabile & Kramer): analysis of **>12,000 daily diary entries from 238 people across 26 project teams in 7 companies** found that the single strongest driver of positive "inner work life" (perceptions, emotions, motivation) is **making progress in meaningful work** — and that **small** increments of progress mattered more than recognition or incentives.
- **Source:** Amabile, T., & Kramer, S. (2011). *The Progress Principle: Using Small Wins to Ignite Joy, Engagement, and Creativity at Work*. Harvard Business Review Press. Summary article: Amabile & Kramer (2011), "The power of small wins," *Harvard Business Review*, May 2011. https://hbr.org/2011/05/the-power-of-small-wins `[abstract via search]`
- **Confidence:** `moderate`. It is a large, careful diary study, but it is correlational, in workplaces, not students, and the book is a trade publication rather than a peer-reviewed paper. Do not cite it as if it were an experiment.

**Verdict: ship completion states, with an important caveat about what you mark complete.** Checkmarks are the cheapest legitimate competence feedback you can build. **But mark completion against *mastery*, not against *exposure*.** A checkmark on "I watched this" is a lie that inflates the student's confidence going into a Klausur — which is a direct product-quality failure and, given they paid you, arguably a consumer-protection one. A checkmark on "I solved 4 of these problem types correctly, unaided" is true. See §7.3 on why students systematically mistake fluency for learning.

---

# 5. Feedback and small successes — timing, granularity, framing

## 5.1 Feedback is not reliably good. **Over a third of feedback interventions make performance worse.**

**Evidence.** The definitive meta-analysis: **607 effect sizes, 23,663 observations**. Average effect of feedback interventions on performance: **d = 0.41**. But the distribution matters far more than the mean: **over one third of feedback interventions *decreased* performance.** Kluger & DeNisi's Feedback Intervention Theory explains the split by *where attention is directed*: feedback that directs attention to the **task** and to **task-learning processes** helps; feedback that directs attention to the **self** (ego, ability, comparison to others) hurts, because it consumes cognitive resources on self-evaluation rather than the task.

**Source.** Kluger, A. N., & DeNisi, A. (1996). The effects of feedback interventions on performance: A historical review, a meta-analysis, and a preliminary feedback intervention theory. *Psychological Bulletin*, 119(2), 254–284. DOI 10.1037/0033-2909.119.2.254. Full PDF: https://mrbartonmaths.com/resourcesnew/8.%20Research/Marking%20and%20Feedback/The%20effects%20of%20feedback%20interventions.pdf `[abstract via search; primary PDF located]`

**Confidence.** `strong`. This is one of the most robust findings in applied psychology and it is thirty years old and has not been overturned.

**Verdict.** This single finding should govern your entire feedback UI. **Every feedback string in the product must point at the task, never at the student.** "Diese Aufgabe verlangt die Produktregel — hier ist der Schritt, der fehlt" ✅. "Du bist gut in Analysis!" / "Schwach in Statistik" ❌ — both are self-directed, and the second one is a leaderboard in disguise.

## 5.2 Timing: the evidence is genuinely conflicting

**Evidence.** Shute's authoritative review states plainly that on timing, **the results in the literature are conflicting** despite the topic being heavily studied. The tentative pattern: **immediate** feedback suits verbal/procedural skills and error correction and helps **low-achieving** students; **delayed** feedback may better support **transfer** and concept formation and suits **high-achieving** students. A 2023 study in medical education found immediate and delayed feedback **equally beneficial** for formative multiple-choice performance ("Timing's not everything").

**Source.** Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research*, 78(1), 153–189. DOI 10.3102/0034654307313795. · "Timing's not everything: Immediate and delayed feedback are equally beneficial for performance in formative multiple-choice testing," *Medical Education* (2023). DOI 10.1111/medu.15287. https://asmepublications.onlinelibrary.wiley.com/doi/full/10.1111/medu.15287 · A newer meta-analysis of feedback timing in computer-assisted learning exists: *Educational Psychology Review* (2026), DOI 10.1007/s10648-026-10117-8 — https://link.springer.com/article/10.1007/s10648-026-10117-8 `[located, not extracted]`

**Confidence.** `contested`. Anyone who tells you "immediate feedback is best" is overstating the evidence.

**Verdict.** Default to **immediate correctness + immediate worked step**, because (a) your users are self-studying with no tutor, so a delayed correction has no delivery channel, and (b) the immediate-feedback advantage is concentrated in exactly the *lower-achieving* students who are your core market. But this is a defensible default, not a proven optimum — and it is a good A/B test candidate once you have volume.

## 5.2b Granularity

**Evidence.** Shute's framework classifies formative feedback along three dimensions: **specificity**, **complexity**, and **length**. The consistent finding across the review is that feedback must be specific enough to be actionable but not so complex or long that it exceeds the learner's processing capacity — over-long or over-complex feedback is ignored or overwhelms. Combined with Kluger & DeNisi's attention-locus account (§5.1), the operational rule is: **the smallest unit of feedback that identifies the specific step that failed.**

**Source.** Shute (2008), as above.

**Confidence.** `moderate`.

**Verdict.** For maths this is unusually tractable and unusually valuable: **feedback granularity should be the erroneous *step*, not the erroneous *answer*.** "Falsch, richtig ist 4x³" is answer-level and near-useless. "Bis zur Ableitung stimmt alles — der Fehler steckt im Anwenden der Kettenregel in Zeile 3" is step-level, task-directed (§5.1), and is the single highest-value thing a maths platform can do that a PDF cannot. This is also, not coincidentally, the feature that distinguishes a study tool from a scanned Skript — and it is worth more than the entire gamification layer combined.

## 5.3 Growth-mindset praise — **the popular story is much bigger than the evidence**

You asked specifically for honesty here. Here it is.

**Evidence — the deflating meta-analysis.** Sisk et al. ran two meta-analyses:
- **MA1 (correlational):** k = **273** studies, N = **365,915**. Relationship between mindset and academic achievement: **weak**.
- **MA2 (interventions):** 29 studies / **43 effects**, N = **57,155**. Overall effect of growth-mindset interventions on academic achievement: **d = 0.08** (p = .010). That is close to nothing.
- **Moderators that did hold up:** low-SES students **d = 0.34**; academically at-risk/high-risk students **d = 0.19**.
- **The devastating detail:** where studies included a manipulation check to verify the intervention actually changed mindset, the achievement effect was significant **only when the manipulation check *failed*.** When the intervention successfully changed mindset, achievement was unaffected.

**Source.** Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L., & Macnamara, B. N. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses. *Psychological Science*, 29(4), 549–571. DOI 10.1177/0956797617739704. https://journals.sagepub.com/doi/abs/10.1177/0956797617739704 · Open PDF: https://artscimedia.case.edu/wp-content/uploads/sites/141/2018/10/03145228/Sisk-et-al.-2018.pdf `[abstract via search + specific moderator values confirmed via targeted search; PDF located]`

**Evidence — the large-scale field test.** The **National Study of Learning Mindsets** was a preregistered, nationally representative RCT of a short (two ~25-minute online sessions) growth-mindset intervention in US 9th graders. Effect on GPA for **lower-achieving** students: **≈0.10 grade points on a 4-point scale (≈0.11 SD)**. **No** GPA effect for higher-achieving students. Both groups were more likely to enrol in advanced maths the following year. The intervention worked **only where peer norms supported it**.

**Source.** Yeager, D. S., Hanselman, P., Walton, G. M., et al. (2019). A national experiment reveals where a growth mindset improves achievement. *Nature*, 573, 364–369. DOI 10.1038/s41586-019-1466-y. https://www.nature.com/articles/s41586-019-1466-y `[abstract via search]`

**Evidence — the ongoing methodological fight (2023, unresolved).** Two meta-analyses of the same literature reached opposite conclusions in the same year, in the same journal:
- **Macnamara & Burgoyne (2023):** ~122 studies. Conclusion: apparent effects "are likely attributable to inadequate study design, reporting flaws, and bias." Among studies most closely following best practices, the overall effect was **not significant**. They report **evidence of publication bias**, that **most studies contain major threats to internal validity**, that **higher-quality studies were less likely to show a benefit**, and that **authors with a known financial incentive were ~2.5× as likely to report positive effects.**
- **Burnette et al. (2023):** using multilevel metaregression on targeted subsamples with high implementation fidelity: academic achievement **d = 0.14, 95% CI [0.06, 0.22]**; mental health **d = 0.32, 95% CI [0.10, 0.54]**. They nonetheless conclude that "null and even negative (in the case of academic achievement) effects are also to be expected."
- **A third-party commentary** re-analysed Macnamara & Burgoyne's own dataset with Burnette's heterogeneity-attuned methods and found a meaningful effect **in focal at-risk groups** — i.e. the two camps may be converging on "small overall, real for at-risk students."

**Source.** Macnamara, B. N., & Burgoyne, A. P. (2023). Do growth mindset interventions impact students' academic achievement? A systematic review and meta-analysis with recommendations for best practices. *Psychological Bulletin*, 149(3–4), 133–173. PDF: https://englelab.gatech.edu/articles/2022/Macnamara%20and%20Burgoyne%20(2022)%20-%20Do%20Growth%20Mindset%20Interventions%20Impact%20Students%E2%80%99%20Academic%20Achievement.pdf · Burnette, J. L., et al. (2023). A systematic review and meta-analysis of growth mindset interventions: For whom, how, and why might such interventions work? *Psychological Bulletin*. PubMed: https://pubmed.ncbi.nlm.nih.gov/36227318/ · Tipton, E., et al. (2023). Why meta-analyses of growth mindset and other interventions should follow best practices for examining heterogeneity: Commentary. *Psychological Bulletin*. https://pmc.ncbi.nlm.nih.gov/articles/PMC10495100/ `[all abstract via search]`

**Confidence.** `contested` — but the *direction* of the contest is settled. **Nobody credible any longer defends the large effects in the popular literature.** The live dispute is between "essentially zero" and "d ≈ 0.14, concentrated in at-risk students." Both endpoints are far below the trade-book narrative.

**Verdict for this product: ship the *language*, don't ship a *mindset feature*.**
- Effort/process-oriented feedback framing is **free** and costs you nothing even if its effect is d = 0.05. Write "diese Art von Aufgabe braucht Übung — du hast jetzt 3 von 8 Typen sicher" instead of "du bist ein Mathe-Typ".
- **Do not** build a growth-mindset module, a mindset onboarding, or a mindset survey. The evidence does not support a dedicated feature, the effects that exist come from *school-context* interventions with peer-norm support that a solo app cannot supply, and Yeager's own study found the effect only where the surrounding environment reinforced it.
- The one encouraging signal for you: **the effects that survive are concentrated in low-SES and academically at-risk students** — which is a meaningful share of your addressable market. But d = 0.19–0.34 in that subgroup, from a contested literature, is a reason for careful copywriting, not a product pillar.

---

# 6. Self-efficacy (Bandura) — **the strongest theoretical grounding for the "small successes" instinct. Verified.**

## 6.1 The primary source and the four sources

**Evidence.** Bandura's self-efficacy theory identifies **four sources** of efficacy beliefs, in descending order of influence:

1. **Mastery experiences** — actually performing the behaviour and succeeding. **The most powerful source.**
2. **Vicarious experiences** — seeing similar others succeed.
3. **Verbal/social persuasion** — being credibly told you can do it.
4. **Physiological and affective states** — how one interprets one's own arousal (sweaty palms before a Klausur read as "I'm failing" vs "I'm ready").

**Source.** Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. *Psychological Review*, 84(2), 191–215. DOI 10.1037/0033-295X.84.2.191. PDF: https://pdfs.semanticscholar.org/9530/70a862df2824b46e7b1057e97badfb31b8c2.pdf `[abstract via search; primary PDF located]` · APA overview: https://www.apa.org/research-practice/conduct-research/self-efficacy-human-agency

**Confidence.** `strong` as a construct; it is one of the best-replicated in educational psychology.

## 6.2 Mastery experience is empirically the dominant source

**Evidence.** In the canonical review and in the validation studies, **mastery experience is the strongest predictor of self-efficacy** — in several analyses, effectively the *only* independent predictor once the others are controlled. Its relative strength varies by gender, ethnicity, academic ability and domain.

**Source.** Usher, E. L., & Pajares, F. (2008). Sources of self-efficacy in school: Critical review of the literature and future directions. *Review of Educational Research*, 78(4), 751–796. DOI 10.3102/0034654308321456. https://journals.sagepub.com/doi/abs/10.3102/0034654308321456 · Usher, E. L., & Pajares, F. (2009). Sources of self-efficacy in mathematics: A validation study. *Contemporary Educational Psychology*, 34(1), 89–101. PDF: https://stelar.edc.org/sites/default/files/Usher_Pajares_2009.pdf `[abstract via search; maths-specific PDF located]`

**Confidence.** `strong`.

## 6.3 Self-efficacy is the strongest single psychological predictor of university GPA

**Evidence.** The definitive meta-analysis of university-student academic performance screened 7,167 articles and synthesised **241 datasets covering 50 conceptually distinct correlates of GPA**. **Performance self-efficacy was the strongest correlate of all 50 measures**, followed by high-school GPA, ACT, and grade goal. In their regression models, **effort regulation (β = .32)** was the most important self-regulatory predictor.
*(The specific value r ≈ .59 for performance self-efficacy is widely quoted; I confirmed the "strongest of 50 correlates" ranking but did not verify the exact coefficient from the primary text — treat the number as unverified, the ranking as verified.)*

**Source.** Richardson, M., Abraham, C., & Bond, R. (2012). Psychological correlates of university students' academic performance: A systematic review and meta-analysis. *Psychological Bulletin*, 138(2), 353–387. DOI 10.1037/a0026838. Open PDF: https://discovery.ucl.ac.uk/10183671/1/richardson%20psych%20bull.pdf `[abstract via search; PDF located]` · Honicke, T., & Broadbent, J. (2016). The influence of academic self-efficacy on academic performance: A systematic review. *Educational Research Review*, 17, 63–84. DOI 10.1016/j.edurev.2015.11.002. Author PDF: https://static1.squarespace.com/static/58be0566579fb3f6f0eb581b/t/5baefe44419202770b350cbc/1538195023537/Honicke+&+Broadbent+2016+(post-ref).pdf — 59 papers; academic self-efficacy **moderately** correlated with performance, mediated by effort regulation, deep processing and goal orientations. `[abstract via search; PDF located]`

**Confidence.** `strong` for the ranking; `moderate` for the causal reading.

## 6.4 **The direction of causation — the finding that most matters for your design**

**Evidence.** A meta-analytic **cross-lagged panel analysis** tested whether belief drives performance or performance drives belief. Result: they are **reciprocal**, but in studies that measured self-efficacy first at each wave, **the performance → self-efficacy path was stronger than the self-efficacy → performance path**. (Honest caveat: in studies measuring performance first, the pattern reversed — so the finding is partly an artefact of measurement order and the authors say so.)

**Source.** Talsma, K., Schüz, B., Schwarzer, R., & Norris, K. (2018). I believe, therefore I achieve (and vice versa): A meta-analytic cross-lagged panel analysis of self-efficacy and academic performance. *Learning and Individual Differences*, 61, 136–150. DOI 10.1016/j.lindif.2017.11.015. https://www.sciencedirect.com/science/article/abs/pii/S104160801730211X `[abstract via search]`

**Confidence.** `moderate` — reciprocity is solid; the relative path strengths are measurement-order-sensitive and the authors flag it.

**Verdict for the product: this is your strongest evidential foundation, and it is a *verified* one.**

The instinct "students need small successes" is not a vague motivational platitude — it is **Bandura's mastery-experience construct**, the strongest of the four sources of the strongest single psychological predictor of university GPA. And Talsma et al. suggest the causal arrow runs at least as strongly from *actual success* → *belief* as the reverse.

**The operational consequence is precise and it is the opposite of what most gamified products do:**

> You cannot give a student self-efficacy by telling them they have it. You can only give it to them by **arranging for them to actually succeed at a genuinely difficult thing, unaided, and then making that success unmissable.**

This means: pep-talk copy is source #3 (verbal persuasion — the *weak* one). A calibrated problem the student solves without help is source #1 (the strong one). **Every euro of design effort spent on encouragement copy is misallocated relative to a euro spent on difficulty calibration.** It also means the completion checkmark must mark *real unaided success* (§4.7) — a checkmark for watching a video is a fake mastery experience and therefore builds nothing.

---

# 7. Flow and adaptive difficulty

## 7.1 The theory, and the honest state of its evidence

**Evidence.** Csikszentmihalyi's flow model holds that optimal experience occurs when perceived challenge and perceived skill are both high and in balance. Measured largely by the **Experience Sampling Method** (random pager prompts) and the Flow Questionnaire.

**The meta-analytic reality check:** across **28 studies**, the relationship between **challenge–skill balance and flow was only *moderate***, and **smaller still with intrinsic motivation**. Correlations were **weaker** in individualistic cultures, **weaker in work and education contexts** (i.e. yours), **weaker with ESM** (the more rigorous method), and weaker for state vs trait flow. Challenge–skill balance was a robust contributor **alongside clear goals and a sense of control** — it is not uniquely important.

**Source.** Fong, C. J., Zaleski, D. J., & Leach, J. K. (2015). The challenge–skill balance and antecedents of flow: A meta-analytic investigation. *The Journal of Positive Psychology*, 10(5), 425–446. DOI 10.1080/17439760.2014.967799. https://www.tandfonline.com/doi/abs/10.1080/17439760.2014.967799 `[abstract via search]` · Csikszentmihalyi, M. (1990). *Flow: The Psychology of Optimal Experience*. Harper & Row. · Nakamura, J., & Csikszentmihalyi, M. (2002). The concept of flow. In *Handbook of Positive Psychology*.

**Confidence.** `moderate` for the construct; **`weak` for flow as an engineering target in an educational product.** The effect is smaller in education contexts and smaller under better measurement. Flow is a good metaphor and a poor specification.

## 7.2 What an adaptive difficulty system would actually need to hit — a concrete number

**Evidence.** For gradient-descent-based learners, there is an analytically derived optimum: the **optimal training error rate is 15.87%**, i.e. **≈85% training accuracy**. Training that is too easy or too hard both slow learning; the sweet spot is where the learner is getting about one in six wrong. The result was demonstrated for artificial neural networks and for biologically plausible networks modelling animal learning.

**Source.** Wilson, R. C., Shenhav, A., Straccia, M., & Cohen, J. D. (2019). The Eighty Five Percent Rule for optimal learning. *Nature Communications*, 10, 4646. DOI 10.1038/s41467-019-12552-4. https://www.nature.com/articles/s41467-019-12552-4 `[abstract via search]`

**Confidence.** `moderate`, **with a large caveat I want to be explicit about.** This is a **mathematical/simulation result for a class of learning algorithms on binary classification tasks**, not a randomised classroom trial with human university students learning integration by parts. It is frequently over-cited in edtech as if it were a human learning finding. It is a *principled starting parameter*, not a validated human constant. Say that internally.

## 7.3 The countervailing evidence: **desirable difficulties** — students hate the thing that works

**Evidence.** Retrieval practice (self-testing) beats restudying by a wide margin, and this is one of the most robust findings in learning science:
- Adesope, Trevisan & Sundararajan (2017): **272 independent effect sizes from 188 experiments**. Practice testing vs **restudying: g = +0.51**. Practice testing vs **filler/no activity: g = +0.93**. Multiple-choice practice tests **g = +0.70** > short-answer **g = +0.48**.
- Rowland (2014): medium-to-large **g = 0.50** vs restudy (and, contra Adesope, found short-answer *stronger* than multiple-choice — the two meta-analyses disagree on format, partly because Rowland excluded applied research).
- Bjork's **desirable difficulties** framing: retrieval practice *slows apparent improvement during learning* but produces superior retention and transfer.

**Source.** Adesope, O. O., Trevisan, D. A., & Sundararajan, N. (2017). Rethinking the use of tests: A meta-analysis of practice testing. *Review of Educational Research*, 87(3), 659–701. DOI 10.3102/0034654316689306. https://journals.sagepub.com/doi/abs/10.3102/0034654316689306 · Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. *Psychological Bulletin*, 140(6), 1432–1463. · Bjork, R. A. (1994). Memory and metamemory considerations in the training of human beings. `[abstract via search]`

**Confidence.** `strong`.

**The tension you must resolve, stated plainly.** §7.2 says aim for ~85% success to maximise learning rate and feel good. §7.3 says the conditions that *feel* like learning (easy, fluent, high success) are systematically **not** the conditions that produce retention, and students reliably misjudge this. Meanwhile §4.1/§3.6 says a points system will push students toward easy tasks. **All three pressures push your product toward being too easy, and only the learning outcomes push back — and learning outcomes are invisible to the student until the Klausur.**

**Verdict: ship adaptive difficulty, targeted at high-but-not-perfect success, and defend it against your own engagement metrics.**
- Target roughly **80–85% success on practice items** as a *starting* parameter, explicitly labelled as a hypothesis to test, not a law.
- **Never let the difficulty adapt downward to whatever maximises session length.** That is the mechanism by which every engagement-optimised learning product becomes useless.
- Make the *retrieval* format the default (solve it) rather than the *recognition* format (read the worked solution). Recognition feels like learning and isn't.
- Be honest with the student about desirable difficulty: "diese Aufgabe soll sich schwer anfühlen" is both true and, per §5.1, task-directed rather than self-directed feedback.
- Use flow as vocabulary in design discussions. Do not use it as a metric.

---

# 8. What university students actually say they want, and how they actually study

> **Access note.** Every `educause.edu` domain (www, library, er, events) is hard-blocked from this environment — WebFetch, curl and a headless browser all returned 403. ERIC holds the catalogue record but no full text. **EDUCAUSE figures below therefore come from search-index extracts of EDUCAUSE-owned pages plus one fetched institutional summary, and are marked `moderate`, not `strong`.** By contrast every German source in §8.2–§8.5 was **downloaded and text-extracted locally**, so those are the sturdiest numbers in this entire document.

## 8.1 EDUCAUSE Students and Technology Reports

**Editions and samples.** 2023: *Flexibility, Choice, and Equity in the Student Experience* (**n = 1,951** students, 10 US institutions). 2025: *Shaping the Future of Higher Education Through Technology, Flexibility, and Well-Being* (Muscanell & Gay, published 14 April 2025; **n = 6,468**, 37 institutions). 2026: *Steady through Change* (**n = 8,622** undergraduates, 41 institutions). A 2024 survey ran but the report series skipped from 2023 to 2025.

**Source.** ERIC record ED678855 (fetched — confirms 2025 title, authors, date): https://eric.ed.gov/?id=ED678855 · 2023 n verified independently from Northern Illinois University CITL: https://citl.news.niu.edu/2023/09/11/educause-2023-students-and-technology-report/ `[strong]` · 2025/2026 n from EDUCAUSE Library page extracts `[moderate — not directly verified]`

**Evidence — coursework happens on laptops, not phones. This is the most product-relevant finding in §8.1 and it is consistent across four separate waves.**

| Measure | Figure | Wave |
|---|---|---|
| Primary device is a laptop (72%) or desktop (14%) | **86%** | 2022 EDUCAUSE |
| Laptop is top primary educational device | **81%** | Nov 2021 QuickPoll |
| Smartphone is top *secondary* device | 56% | Nov 2021 QuickPoll |
| Laptop primary for academic needs | 76% | earlier ECAR |
| **Cellphone primary for academic needs** | **3%** | earlier ECAR |
| Laptop used in at least one course / rated very-extremely important | 98% / 94% | ECAR |

**Confidence.** `moderate` (search-index extracts of EDUCAUSE-owned pages), but the consistency across four waves is itself evidence.

**Evidence — modality preference swung hard back to on-site.** 2025 vs 2023: **75%** prefer on-site lab/interactive work (**+9 pp**), 19% online (−8 pp); **64%** prefer on-site instructor lectures (**+8 pp**), 30% online (−9 pp); exams +8 pp on-site. Hybrid *course-taking* nonetheless grew +7 pp. Longer baseline: 2019 — 70% preferred mostly/completely on-site, only 6% completely online; 2023 — 53% on-site.

**Evidence — what frustrates students:** unreliable Wi-Fi; **unclear and course-by-course-inconsistent AI policies**; **tool overload** (disconnected platforms). Only **48%** perceive consistency across their hybrid courses; **59%** think instructors adapt effectively to hybrid formats. **77%** reported at least one technology issue in the past academic year (2022 edition). Satisfaction with institutional tech overall **69%**, but **85%** at institutions perceived as "cutting edge" vs **34%** where perceived as lagging; **56%** satisfied with campus internet.

**Source.** 2025 EDUCAUSE Students and Technology Report — https://www.educause.edu/content/2025/students-and-technology-report `[moderate, index extract]` · satisfaction split via a secondary write-up `[weak]` · 56% via GovTech: https://www.govtech.com/education/higher-ed/students-struggle-with-wi-fi-ai-policy-and-tool-overload `[weak — trade press, not the data owner]`

**Verdict.** **Design desktop/laptop-first and make mobile the secondary surface.** ~3% of students use a phone as their primary academic device. For a maths product this is doubly true — you cannot do integration by parts on a phone keyboard. Mobile's real job is *review and retrieval* (spaced repetition, flashcards, checking a formula), not problem-solving. Also note the frustration list: students are not asking for more features; they are complaining about **too many disconnected tools**. A product that adds a twelfth login is fighting the stated preference.

## 8.2 German student time budgets — the 22. Sozialerhebung

**The master source, and it is excellent.** Kroher, M., Beuße, M., Isleib, S., Becker, K. et al. (2023). *Die Studierendenbefragung in Deutschland: 22. Sozialerhebung — Die wirtschaftliche und soziale Lage der Studierenden in Deutschland 2021.* DZHW / Deutsches Studierendenwerk / BMBF. Fieldwork **Sommersemester 2021**; **≈188,000 students at 250 Hochschulen** (~63% of German HEIs, 84% of enrolments), weighted to official statistics. https://www.studierendenwerke.de/fileadmin/user_upload/22._Soz_Hauptbericht_barrierefrei.pdf · mirror https://www.dzhw.eu/pdf/ab_20/Soz22_Hauptbericht.pdf `[fetched and text-extracted primary]` **Confidence: `strong` throughout §8.2.**

**Evidence — total workload ≈ 34.6 h/week, split almost exactly half classes / half self-study.** 17.1 h Lehrveranstaltungen + 17.4–17.5 h Selbststudium. Universität 16.2 + 18.4; HAW 18.7 + 15.9 (identical totals, inverted mix). Versus 2016, **Selbststudium is unchanged** and Lehrveranstaltungen rose 2.5 h/week. Bachelor 34.4 h; Master 32.2 h; Staatsexamen 41.2 h. *(Abschnitt 3.4, Abb. 3.11/3.12, n ≥ 77,157.)*

**Evidence — and your two target audiences differ sharply.** *(Tabelle A3.20, n ≥ 95,848; every row re-checked so components sum to the printed total.)*

| Fach | Total h/week | Lehrveranstaltungen | **Selbststudium** |
|---|---|---|---|
| **Mathematik / Naturwissenschaften** | **38.2** | 18.3 | **19.9** |
| Rechtswissenschaften | 38.0 | — | — |
| Informatik | 33.5 | — | — |
| **(Int.) Betriebswirtschaftslehre** | **33.3** | 17.7 | **15.6** |
| **Wirtschaftswissenschaften (ohne BWL)** | **33.1** | 17.1 | **16.0** |
| Medizin | 44.1 | — | — |

**Evidence — 63.0% work alongside study, averaging 15.1 h/week.** Universität 63.7%, HAW 61.7%; down ~5 pp vs 2016 (likely pandemic). Bachelor 15.2 h, Master 16.4 h; HAW 17.6 h vs Universität 13.9 h. **The report states explicitly that higher employment hours significantly reduce study time.** Motives: 65% "um sich etwas Zusätzliches leisten zu können"; **58% need it for living costs.** *(Abschnitt 4.1, n = 162,377.)*

**Verdict.** Three hard product constraints fall out of this:
1. **Your maths students already study 19.9 h/week on their own — more than they spend in class.** They are **not under-working; they are under-supported.** A product premised on "getting students to study more" is aimed at a problem that does not exist. A product that makes those 19.9 hours *more effective* is aimed at the real one.
2. **63% have a job averaging 15 h/week.** Add 34.6 h of study and that is a ~50-hour week. **A daily-streak mechanic (§4.3) is being sold to people who are already at capacity** — and the report says employment hours measurably eat study time.
3. Econ/BWL students self-study ~4 h/week *less* than maths students. Same product, materially different usage intensity.

## 8.3 What German students say about digital study tools

**Evidence — the single highest-priority demand.** Across 20 measured university processes, **"Zugriff auf Lehr- und Lernmaterialien" ranked first: 99% rate its digitisation important or very important.** Access to literature 97%, exam registration 97%. Only one of 20 fell below 50%.

**Evidence — what students demand of a tool, in their own ranking:** reliable functioning **>99%**, clear/uncluttered functions **99%**, **Datenschutz 96%**, single sign-on 84%, appealing design 80%, interfaces to other tools 78%, **offline availability 72%**. **Novelty ranks dead last: VR 23%, Serious Games 25%.**

**Source.** Hochschulforum Digitalisierung (2020). *HFD-Arbeitspapier 54 — Ein studentischer Blick auf den Digital Turn.* Fieldwork 30 April–7 July 2019; **n = 10,579** eligible (8,632 completed); explicitly **not** a random sample (digitally-affine students likely over-represented). https://hochschulforumdigitalisierung.de/sites/default/files/dateien/HFD_AP_54_Studierendenbefragung.pdf `[fetched primary]` **Confidence:** `strong` for the numbers, `moderate` for generalisability.

**This is the most directly actionable finding in the whole document.** German students, asked to rank 20 things, put **reliable access to learning materials at 99%** and **game-like elements at 23–25%, last.** Reliability, clarity and Datenschutz beat design; design beats novelty; novelty is bottom. A study platform's ranked feature list should be: works reliably → uncluttered → GDPR-clean → good materials → integrates → works offline. Gamification does not appear.

**Evidence — Bitkom 2024, the most recent German student survey found.** Bitkom e.V. / Bitkom Research (2024). *Digitale Hochschulen*, Berlin, 21.03.2024. **n = 506** students 18+, online panel, KW 1–2 2024; **Bitkom states it is not representative.** https://www.bitkom.org/sites/main/files/2024-03/240321Bitkom-PrasentationPK-Studierendenbefragungfinal.pdf `[fetched primary]`
- **73%** say German universities lag internationally on digitalisation; **64%** say they "verschlafen" it; only 18% call them Vorreiter. Average school grade for their own university's digitalisation: **2.7**. **93%** see digitalisation as an opportunity; **68%** want more of it.
- **Most urgent problems:** badly functioning portals (e.g. exam registration) 27%, poor/no Wi-Fi 26%, then dilapidated buildings, poor equipment, **outdated teaching content/materials**, too little use of digital media — all in the 23–26% band.
- **What they actually do digitally:** presentations 79%, write texts/summaries 75%, watch/listen to learning content 74%, **read and work on digital Skripte 71%**, **learning platforms 69%**, subject software 48%, interactive quizzes/polls 43%. Only 1% never use digital devices.
- **Format preference (forced single choice): hybrid 45%, Präsenz 36%, online 13%, recorded 6%.**
- **ChatGPT: 65% have used it**; among users (n = 329) **33% for exam preparation**, 68% research, 40% summaries. **74%** want to be taught how to use it properly; only 37% know of any AI rules at their university.

**Evidence — the "digital native" is a myth in this population.** Only **~22% of German students are "digitale Allrounder."** The largest group (**30%**) uses only classic digital media — PDFs, PowerPoint, email. Four groups: PDF-Nutzer 30%, E-Prüflinge 25%, Videolernende 23%, digitale Allrounder 22%. **More than 75% report only limited digital use.** The authors conclude the term "Digital Native" is *"bedeutungslos"* on this evidence.

**Source.** Persike, M., & Friedrich, J.-D. (2016). *Lernen mit digitalen Medien aus Studierendenperspektive.* HFD-Arbeitspapier Nr. 17. Embedded in the CHE Hochschulranking Studierendenbefragung 2014/15: 155,418 contacted, **27,473 answered the digital-media block** (17.7% response), 153 Hochschulen, 11 subjects, mean age 23. `[fetched and re-extracted]` **Confidence:** `strong` for the numbers — **but 2014/15 data, and the wave contained no economics/business subject.**

**Evidence — students use digital tools privately far more than their courses do.** Electronic tests/exercises **40% privately vs 11% in courses**; learning apps 20% vs 3%; video 64% vs 13%; wikis 70% vs 29%. The study's own headline: *"Studierende sind keine digitalen Enthusiasten."*
**Source.** Bertelsmann Stiftung (2017). *Monitor Digitale Bildung — Die Hochschulen im digitalen Zeitalter.* Fieldwork by mmb Institut 2016: 2,759 students, 662 instructors. **Confidence:** `strong` for figures, dated. · Device split for study use: **laptops 91%, smartphones 82%, tablets ~one third** — Willige, J. (2016), DZHW HISBUS, quoted inside the Monitor; the primary HFD AP 23 PDF 404'd. `[moderate for the percentages, weak for n]`

## 8.4 How students actually study — and how badly they misjudge it

**Evidence — procrastination, with an important correction.** The famous prevalence figures are **not Steel's own findings.** Steel writes: *"Estimates indicate that 80%–95% of college students engage in procrastination (Ellis & Knaus, 1977; O'Brien, 2002), approximately 75% consider themselves procrastinators (Potts, 1987), and almost 50% procrastinate consistently and problematically."* Those are his citations to prior work, several of them dissertations or non-peer-reviewed.

Steel's **actual** meta-analysis covers **691 correlations**. Key correlates (K / N / mean observed r): conscientiousness 20/4,012/**−.62**; self-control 21/3,840/−.58; distractibility 13/2,232/.45; impulsiveness 22/4,005/.41; task aversiveness 8/938/.40; **self-efficacy 39/6,994/−.38**; neuroticism 59/10,720/.24. **Perfectionism, intelligence and openness are all non-significant.** Effect on actual performance is small: overall performance 41/7,447/**r = −.19**; GPA −.16; course GPA −.25.

**Source.** Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. *Psychological Bulletin*, 133(1), 65–94. DOI 10.1037/0033-2909.133.1.65. Full text: https://studypedia.au.dk/fileadmin/www.studiemetro.au.dk/Procrastination_2.pdf `[fetched primary]` **Confidence:** `strong` for Steel's own numbers; **`weak` for the 80–95% prevalence claim itself.**

**Note for the product:** procrastination predicts *personality* far more strongly than it predicts *grades* (r = −.19). And **self-efficacy is one of its strongest correlates (−.38)** — which links §8.4 straight back to §6: raising self-efficacy through real mastery experiences is also the anti-procrastination lever.

**Evidence — spacing works, and by a lot.** Spaced practice yields **47.3% recall vs 36.7% massed — a 10.6 pp advantage** — pooled across **271 comparisons, 254 studies, 14,811 participants** (t(540) = 6.6, p < .001). Only 12 of 271 comparisons showed no or negative spacing effect.
**Source.** Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354–380. DOI 10.1037/0033-2909.132.3.354. https://augmentingcognition.com/assets/Cepeda2006.pdf `[fetched primary]` **Confidence: `strong`.** *(Cite the pooled row — the dramatic 8–30 day row has k = 6 and the 31+ day row k = 1.)*

**Evidence — the optimal review gap.** ≈**20% of the target retention interval** for delays of a few weeks, falling to ~5% at one year. At the optimal gap, final recall rose **64% (d = 1.1)** versus a zero-day gap. N = 1,354; optimal gaps of 1, 11, 21 and 21 days for retention intervals of 7, 35, 70 and 350 days.
**Source.** Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science*, 19(11), 1095–1102. DOI 10.1111/j.1467-9280.2008.02209.x. Accepted manuscript: https://files.eric.ed.gov/fulltext/ED505660.pdf `[fetched]` **Confidence:** `strong` on numbers, `moderate` on wording (accepted manuscript).

**Evidence — students schedule by deadline, not by plan.** **59% decide what to study next by "whatever's due soonest or overdue"; only 11% plan a schedule ahead. 80% say nobody taught them how to study. 86% never return to material after a course ends. 64% drop an item once they feel they know it.** N = 472 UCLA undergraduates.
**Source.** Kornell, N., & Bjork, R. A. (2007). The promise and perils of self-regulated study. *Psychonomic Bulletin & Review*, 14(2), 219–224. DOI 10.3758/BF03194055. https://web.williams.edu/Psychology/Faculty/Kornell/Publications/Kornell.Bjork.2007.pdf `[fetched primary]` **Confidence: `strong`.**
**⚠️ Correction to a common mis-citation:** this survey contains **no cramming item and no "% who cram" figure.** The 59% deadline-triage figure is the defensible substitute.

**Evidence — students actively misjudge spacing.** **78% performed better with spaced presentation, yet 78% said massing was as good as or better** — i.e. only 22% correctly judged spacing superior, *after* taking the test. Spaced M = .61 vs massed M = .35, d = 0.99 (n = 120); d = 1.28 (n = 72).
**Source.** Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the "enemy of induction"? *Psychological Science*, 19(6), 585–592. DOI 10.1111/j.1467-9280.2008.02127.x. https://web.williams.edu/Psychology/Faculty/Kornell/Publications/Kornell.Bjork.2008a.pdf `[fetched primary]` *(The two 78%s mean different things — state both or it reads as a typo.)*

**Evidence — and they don't self-test.** **84% reread; only 11% self-test. 55% rank rereading their #1 strategy; 1% rank self-testing #1.** In a forced choice, **78% said they would not test themselves after reading a chapter.** Even when self-testing wins the choice (42% vs 41%), only **3%** pick it because retrieval aids learning — 30% pick it for feedback. N = 177 Washington University undergraduates (mean SAT > 1400 — a *selective* group).
**Source.** Karpicke, J. D., Butler, A. C., & Roediger, H. L. III (2009). Metacognitive strategies in student learning: Do students practise retrieval when they study on their own? *Memory*, 17(4), 471–479. DOI 10.1080/09658210802647009. https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf `[fetched primary]` **Confidence: `strong`.**

**Verdict — this is the strongest product argument in the document, and it has nothing to do with motivation.**

> Retrieval practice beats rereading by **g = +0.51** (§7.3). Spacing beats massing by **10.6 pp** (§8.4). And **84% of students reread, 11% self-test, 59% schedule by deadline, and 78% actively believe massing is fine.**

**The gap between what works and what students choose is enormous, students cannot see it (they misjudge it even immediately after being shown), and it is a gap software can close by default.** A product that simply **schedules spaced retrieval for the student** — no motivation mechanics at all — is exploiting a ~0.5–1.0 SD advantage that the student would never choose alone. That is worth more than every badge, streak and leaderboard in this document combined, and it is also *honest*: you are not manipulating them, you are supplying the metacognition they say (80%) nobody taught them.

**Two explicit negative results.**
- **Typical study-session length: NOT FOUND.** No peer-reviewed source gives one, in any language. The circulating "25–50 minute blocks" claim has no primary source; the Pomodoro interval is a productivity convention, not a finding. **Treat any session-length number as unsourced.**
- **Mobile vs desktop for actual learning: NO DIRECT EVIDENCE FOUND.** The nearest meta-analysis — Sung, Chang & Liu (2016), *Computers & Education*, 94, 252–275, DOI 10.1016/j.compedu.2015.11.008, 110 studies, mean ES **0.523** — compares *mobile-integrated instruction vs conventional instruction*, **not phone vs desktop**, and its "mobile devices" category explicitly **includes laptops**. Citing it as "phones beat desktops" is a misreading. The best available evidence for the device decision is the EDUCAUSE data in §8.1.

**Historical context on study hours.** US full-time students invested ~40 h/week (class + study) in 1961 but only ~27 h/week by 2003; out-of-class study fell from 24.4 to 11.2–13.3 h/week. Share studying >20 h/week fell 67% → 13%; share studying <5 h/week rose 7% → 25%. Corroborated across 12 data sources.
**Source.** Babcock, P., & Marks, M. (2011). The falling time cost of college. *Review of Economics and Statistics*, 93(2), 468–478. DOI 10.1162/REST_a_00093. Read via NBER WP 15954: https://www.nber.org/system/files/working_papers/w15954/w15954.pdf `[fetched]` **Confidence:** `moderate` — **US-only, and the most recent data point is 2004. Do not present as current**, and note it contrasts sharply with the German 34.6 h/week self-report from 2021.

## 8.5 Economics/business and mathematics students specifically — **the sharpest numbers in this report**

**Evidence — Bachelor dropout by subject.** German nationals, Absolvent*innen-Jahrgang 2020 (entrants 2016/17), cohort-comparison on official statistics, with the longer-enrolment adjustment:

| | Universität | HAW/FH |
|---|---|---|
| **All Bachelor** | **35%** | 20% |
| Mathematik / Naturwissenschaften | **50%** | 39% |
| **Mathematik (Studienbereich)** | **59%** | — |
| Physik / Geowissenschaften | 60% | — |
| Chemie | 52% | — |
| Informatik | 42% | 30% |
| Geisteswissenschaften / Sport | 49% | — |
| Ingenieurwissenschaften | 35% | 30% |
| Rechts- / Wirtschafts- / Sozialwiss. | 21% | 13% |
| **Wirtschaftswissenschaften** | **27%** | **17%** |

Overall Bachelor dropout 28% (Universität 35%, HAW 20%); Master 21%; **international Bachelor students 41%.**

**Source.** Heublein, U., Hutzsch, C., & Schmelzer, R. (2022). *Die Entwicklung der Studienabbruchquoten in Deutschland.* DZHW-Brief 05|2022, plus statistical appendix. https://www.dzhw.eu/pdf/pub_brief/dzhw_brief_05_2022.pdf and https://www.dzhw.eu/pdf/pub_brief/dzhw_brief_05_2022_anhang.pdf `[both fetched and text-extracted]` **Confidence: `strong`.**
*(A commercial secondary source, Profiling Institut, circulates "Informatik 41% / Mathematik 44%" — this **conflicts** with the DZHW appendix and should not be used.)*

**Evidence — why they drop out, and the two audiences fail for different reasons.** Survey of Exmatrikulierte, SoSe 2014: 29,656 contacted at 60 Hochschulen, **6,029 respondents**, adjusted response rate 23%.
- **30% of all dropouts failed to meet the performance requirements** — the single most common decisive reason, essentially unchanged since 2008. Among Bachelor dropouts specifically, **31%**.
- Other decisive motives: lack of study motivation **17%**; orientation toward practical work 15%; financial situation ~19% decisive, with 30% citing financial bottlenecks and **23% unable to reconcile study with employment.**
- **In Mathematik/Naturwissenschaften, performance problems play a role in 84% (Uni) / 89% (FH) of dropouts** — the highest of any field alongside engineering.
- **30% of university Math/Nat dropouts could not compensate for missing prior knowledge; 33% never managed the entry into their studies.** At FH both are 41%.
- **In Wirtschafts- und Sozialwissenschaften at universities the pattern inverts: two-fifths (40%) of dropouts had largely lost interest in the subject** — a motivation problem, not a competence one.
- DZHW's own framing: a **"Matching-Problem"** — a gap between entry qualifications and course demands, biting hardest at the very start of a Bachelor because assessment comes early.

**Source.** Heublein, U., Ebert, J., Hutzsch, C., Isleib, S., König, R., Richter, J., & Woisch, A. (2017). *Zwischen Studienerwartungen und Studienwirklichkeit.* Forum Hochschule 1|2017, DZHW. https://www.dzhw.eu/pdf/pub_fh/fh-201701.pdf `[fetched and text-extracted]` **Confidence: `strong`.**

**Verdict — this reframes the product.**
1. **Mathematik at university has a 59% Bachelor dropout rate**, and **84% of those dropouts involve performance problems**, with **30% unable to compensate for missing prior knowledge** and **33% never managing the entry**. The product-market fit is not "motivation" — it is **prerequisite remediation delivered in the first semester, before the first Klausur.** A diagnostic that finds the Schulmathematik gaps and closes them in weeks 1–4 addresses the literal, measured, most common cause of failure. (It also, conveniently, supplies the honest starting progress for §4.5 and the calibrated mastery experiences for §6.)
2. **Economics students fail differently: 40% of Wirtschafts-/Sozialwissenschaften dropouts had lost interest**, not competence. So relevance and meaning matter more for that cohort — worked examples tied to real economics, not more drill.
3. **A single "more practice problems" answer serves only the maths cohort.** The two audiences need different things from the same product.
4. Cross-check: maths students already do **19.9 h/week of self-study** (§8.2), more than they spend in class. **They are not under-working; they are under-supported.** Any framing of the product as a motivation fix is aimed at the wrong failure mode.

## 8.6 Willingness to pay

**Evidence — the defensible anchor.** German students spend **~28 €/month on Lernmittel** (Fokus-Typ), and the figure is **rising: 2009 33 € → 2012 30 € → 2016 20 € → 2021 28 €** — up ~40% since 2016. The all-student figure in Abb. 4.15 is 33 €. For budget context: Semesterbeitrag 36 €/month; mean income 1,106 €/month (median 965 €); mean expenditure 842 €; rent 410 €.

**Source.** 22. Sozialerhebung, Tabelle 4.3 and Abb. 4.15, S. 102–104. **Confidence:** `strong` for the Tabelle 4.3 time series; `moderate` for the 33 € all-student value (layout-derived, and it coincidentally equals the 2009 figure — verify before quoting).

**Evidence — students do pay for software that works.** Among US students who use generative AI at least monthly, **almost half pay for AI tools** (reported elsewhere as 44%); **59%** of students use GenAI for schoolwork at least monthly. Instructors are far less likely to pay; Tyton's own reading is that *"the academic generative AI tool market may be meeting student needs more than instructors'."*
**Source.** Tyton Partners (2024). *Time for Class 2024 — Unlocking Access to Effective Digital Teaching & Learning.* Spring 2024: ~1,600 students, 1,800 instructors, 300 administrators; paid-tools item student **n = 903**. https://www.luminafoundation.org/wp-content/uploads/2024/06/Time-for-Class-2024.pdf `[fetched primary]` **Confidence:** `strong` for "almost half of student users pay" (verbatim in the report body); `moderate` for the precise 44% (sits in a figure image). **Documented caveat: Tyton deliberately oversampled Black and Hispanic students, so the sample is not demographically representative.**
**⚠️ Mis-citation trap:** the widely circulated "59% / 44%" pairing is **Tyton Partners' data, not EDUCAUSE's**, despite trade press filing it under an EDUCAUSE conference.

**Evidence — the German market already pays to fix maths, but at school level.** Parents spend **879 million €/year** on private Nachhilfe, averaging **87 €/month per child** (~1,043 €/year). **14% of 6–16-year-olds** receive tutoring (~1.2m of 8.3m pupils); Gymnasium 18.7%. **Mathematik accounts for 61% of all tutored pupils** — far ahead of foreign languages (46%) and German (31%). Spend distribution: 18% up to 50 €/month, **30% 51–100 €**, 15% 101–150 €, 6% above 150 €.
**Source.** Klemm, K., & Hollenbach-Biele, N. (2016). *Nachhilfeunterricht in Deutschland: Ausmaß – Wirkung – Kosten.* Bertelsmann Stiftung. Nationally representative infratest dimap parent survey, early 2015, **N = 4,274 parents**. https://www.bertelsmann-stiftung.de/fileadmin/files/BSt/Publikationen/GrauePublikationen/Nachhilfeunterricht_in_Deutschland_160127.pdf `[fetched primary]` **Confidence:** `strong` for the figures — **but the payer is a parent and the learner is a schoolchild**, so this is market context, not student WTP. *(The "bis zu 1,5 Mrd €" press headline is the report's alternative estimate (1.468 bn), not its own finding.)* **The 61% maths share is the most transferable signal: maths is what German families already pay to fix.**

**Evidence — law Repetitorien (`weak`, DO NOT CITE AS FACT).** ~86–90% of law students reportedly attend a commercial Repetitorium before the 1. Staatsexamen at ~150–190 €/month. **Search-result summaries only; none fetched; none is the data owner.** The related iur.reform study is reported only second-hand (the primary site failed DNS). **Unverified.**

**Verdict.** ~**28–33 €/month is money German students already allocate to learning materials, and it is up ~40% since 2016** — that is the honest price anchor, not a market-sizing fantasy. The maths signal is strong (61% of German tutoring is maths) but the *paying customer* in that market is a parent, and university students pay for themselves out of a 1,106 €/month income against 842 €/month of expenses. Price accordingly, and note that the one directly comparable behaviour — students paying for AI tools out of pocket — shows they *will* pay for something that visibly works.

## 8.7 What was searched for and NOT found

1. **Any first-party German survey measuring how many *university students* pay for tutoring, Repetitorien or exam-prep material, and how much.** Confirmed by full-text grep that the 22. Sozialerhebung contains **no Nachhilfe/Repetitorium item at all** — the word appears once, as an example of a student *side job*. Same absence in Bitkom 2024, HFD AP 54, HFD AP 17 and the Monitor Digitale Bildung. **This is a genuine gap in the German literature, not a search failure.**
2. **Typical study-session length** — no peer-reviewed source, in any language.
3. **A direct peer-reviewed smartphone-vs-desktop comparison on identical learning tasks.**
4. **A German smartphone-vs-laptop split of actual study time** — best available is the 2016 DZHW/HISBUS figure, quoted second-hand.
5. **A DZHW dropout study newer than the 2022 DZHW-Brief** — all dropout figures rest on the 2020 graduate cohort.
6. **The 23. Sozialerhebung** — fieldwork ran May–September 2025, main report not yet published. **All German money and employment figures above are SoSe 2021 and predate the 2022–2024 inflation.**
7. **EDUCAUSE full reports** — network-blocked at every domain; no ERIC full text.
8. **Stifterverband and CHE on student willingness to pay** — nothing found. mmb appears only as fieldwork institute for the Bertelsmann Monitor; its own Learning Delphi surveys *experts*, not students.

---

# 9. Anxiety — maths anxiety and test anxiety

This section matters more for your product than for almost any other kind of app, because **an economics/business degree is where maths-avoidant students meet compulsory mathematics.** Your users are disproportionately people who chose BWL/VWL partly because it was not a maths degree, and then discovered Mathematik für Wirtschaftswissenschaftler and Statistik in semester 1.

## 9.1 Maths anxiety exists, is measurable, and hurts performance

**Evidence.** The definitive meta-analysis covered **223 studies** (197 published + 26 unpublished datasets), 1992–2018. Pooled relation between maths anxiety and maths performance: **r ≈ −0.28 to −0.29** — small but highly reliable and negative. Enormous cross-country variation: from **r = −0.54 (Turkey, India)** to **r = −0.12 (Indonesia)**. Counter-intuitive moderator: the relationship was **weaker for samples with low maths ability** and **stronger for high performers** — i.e. maths anxiety does the most damage to students who *can* do maths.

**Source.** Barroso, C., Ganley, C. M., McGraw, A. L., Geer, E. A., Hart, S. A., & Daucourt, M. C. (2021). A meta-analysis of the relation between math anxiety and math achievement. *Psychological Bulletin*, 147(2), 134–168. DOI 10.1037/bul0000307. PubMed: https://pubmed.ncbi.nlm.nih.gov/33119346/ `[abstract via search]`

**Confidence.** `strong`.

## 9.2 The mechanism: maths anxiety consumes working memory

**Evidence.** Anxiety-driven intrusive worry occupies working-memory resources, leaving less capacity for the actual computation. Ashcraft & Kirk's dual-task experiments showed that when students solved arithmetic while simultaneously holding letters in memory, **higher maths anxiety produced more errors on the letter-recall task** — i.e. the anxiety was measurably eating capacity. Maths anxiety correlates more strongly with working-memory measures when those measures are **numerical**, suggesting numbers themselves are the trigger.

**Source.** Ashcraft, M. H. (2002). Math anxiety: Personal, educational, and cognitive consequences. *Current Directions in Psychological Science*, 11(5), 181–185. DOI 10.1111/1467-8721.00196. https://journals.sagepub.com/doi/10.1111/1467-8721.00196 · PDF: https://www.mccc.edu/~jenningh/Courses/documents/math_anxiety.pdf · Ashcraft, M. H., & Kirk, E. P. (2001). The relationships among working memory, math anxiety, and performance. *Journal of Experimental Psychology: General*, 130(2), 224–237. PDF: https://www.apa.org/news/press/releases/xge1302224.pdf `[abstract via search; both PDFs located]`

**Confidence.** `strong`.

**The direct UI consequence.** If maths anxiety works by **stealing working memory**, then **every element of your interface that competes for working memory during problem-solving is amplifying maths anxiety.** A countdown timer, a live score, a rank, a streak-at-risk warning, a notification — each is a working-memory tax levied on exactly the cognitive resource the student needs. This is not a soft UX preference; it is a mechanistic prediction.

## 9.3 Test anxiety

**Evidence.** A 30-year meta-analytic review of **238 studies** found test anxiety significantly and negatively related to a wide range of educational performance outcomes including standardised tests, **university entrance exams**, and **GPA**. **Self-esteem was a strong predictor of test anxiety.** **Perceived difficulty and test consequences were related to higher test anxiety**, as were avoidant coping behaviours.

**Source.** von der Embse, N., Jester, D., Roy, D., & Post, J. (2018). Test anxiety effects, predictors, and correlates: A 30-year meta-analytic review. *Journal of Affective Disorders*, 227, 483–493. DOI 10.1016/j.jad.2017.11.048. https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683 `[abstract via search]`

**Confidence.** `strong`.

**Design consequence.** "Perceived difficulty and test consequences drive test anxiety" means **how you frame a practice question changes its anxiety load.** "Probeklausur — zählt nicht" is a different cognitive event from "Test". Free the practice from consequence explicitly and repeatedly.

## 9.4 Timers and time pressure

**Evidence.** Time pressure under stress impairs working-memory access to arithmetic facts. Boaler's widely cited claim is that **for about one third of students the onset of timed testing is the beginning of maths anxiety**, disproportionately affecting **higher-achieving students and female students** — which aligns with the Barroso moderator finding in §9.1. Students report time pressure among the most frequent reasons for maths anxiety, alongside risk of failure, task difficulty, and fear of a bad grade.

**Source.** Boaler, J. (2014). Research suggests that timed tests cause math anxiety. *Teaching Children Mathematics*, 20(8), 469–474. https://www.researchgate.net/publication/347502791_Research_Suggests_that_Timed_Tests_Cause_Math_Anxiety · Boaler, "Speed and time pressure block working memory": https://www.dyslexicadvantage.org/wp-content/uploads/2015/12/Speed_and_Time_Pressure_Blocks_Working_Memory_.pdf `[abstract via search]`

**Confidence.** `contested / weak`. Boaler is an advocacy voice as much as a research one and the specific "one third" figure has been challenged; there is genuine academic debate about the strength of this evidence (see e.g. critical commentary at https://fillingthepail.substack.com/p/timed-tests-and-maths-anxiety). **The underlying working-memory mechanism (§9.2) is well supported; the specific timed-test causal claim is not as solid as it is usually presented. Report it as suggestive, not settled.**

## 9.5 What actually reduces exam anxiety — two interventions with real evidence

**Evidence 1 — expressive writing.** Two lab and **two randomised field experiments**: students who wrote for **10 minutes** about their thoughts and feelings regarding an immediately upcoming exam **performed significantly better** than students who did not write or wrote about an unrelated topic. The benefit was **concentrated in habitually test-anxious students**.

**Source.** Ramirez, G., & Beilock, S. L. (2011). Writing about testing worries boosts exam performance in the classroom. *Science*, 331(6014), 211–213. DOI 10.1126/science.1199427. https://www.science.org/doi/abs/10.1126/science.1199427 · PDF: https://uploads-ssl.webflow.com/59faaf5b01b9500001e95457/5bc56677a8a9d82b40ce3085_RamirezBeilock2011.pdf `[abstract via search]`

**Evidence 2 — arousal reappraisal.** Teaching students that stress arousal is *adaptive* (rather than telling them to ignore or suppress it) reduced anxiety and improved performance. Jamieson et al.: **93 community-college developmental mathematics students**, randomised to reappraisal vs placebo; reappraisal students reported **less maths evaluation anxiety** and showed **improved maths exam performance**. The 2024 meta-analysis of RCTs puts the honest overall size at **d = 0.23** for task performance (mixed interventions d = 0.45; reappraisal-only d = 0.22; stress-is-enhancing-mindset-only d = 0.18).

**Source.** Jamieson, J. P., Peters, B. J., Greenwood, E. J., & Altose, A. J. (2016). Reappraising stress arousal improves performance and reduces evaluation anxiety in classroom exam situations. *Social Psychological and Personality Science*, 7(6), 579–587. DOI 10.1177/1948550616644656. PDF: https://files.eric.ed.gov/fulltext/ED566260.pdf · Meta-analysis: "Effectiveness of stress arousal reappraisal and stress-is-enhancing mindset interventions on task performance outcomes: A meta-analysis of randomized controlled trials," *Scientific Reports* (2024). https://www.nature.com/articles/s41598-024-58408-w `[abstract via search]` · Note a partial replication attempt in US science courses: https://www.lifescied.org/doi/10.1187/cbe.25-04-0055

**Confidence.** `moderate`. Both are real randomised effects, both are small (d ≈ 0.2), and both are cheap to implement.

## 9.6 Interface choices — what amplifies vs reduces anxiety

Derived from §9.1–9.5 and §5.1. Mechanistic reasoning, not direct UI trials, so label internally as **design inference, `moderate` confidence**:

| Amplifies anxiety | Reduces anxiety |
|---|---|
| Countdown timers on practice problems (WM tax, §9.2/9.4) | Untimed practice; timers **only** in an explicitly opt-in "Klausursimulation" mode |
| Public scores, ranks, any visible comparison (§4.4, §9.3 self-esteem link) | Private-by-default everything |
| Red / ✗ / harsh error states | Neutral "noch nicht" states; reserve red for genuine destructive actions |
| Immediate harsh judgement ("Falsch!") | Immediate **task-directed** correction: "hier fehlt die Kettenregel" (§5.1) |
| Streak-at-risk warnings during a study session (§4.3) | No interruptive pressure during problem-solving, ever |
| Framing practice as "Test" | Framing practice as consequence-free ("zählt nicht"; §9.3) |
| Score visible while solving | Score revealed after the attempt is committed |
| "You are weak in Statistik" (self-directed, §5.1) | "Diese 4 Aufgabentypen kommen in der Klausur vor und sitzen noch nicht" (task-directed) |

**Two features with actual RCT support that you could ship cheaply:**
1. A pre-Klausur **10-minute Schreibübung** ("Schreib 10 Minuten lang auf, was dich an der Prüfung beunruhigt") — Ramirez & Beilock, *Science*. Costs one text area.
2. **Reappraisal microcopy** before a practice exam: not "bleib ruhig" but "Aufregung vor der Klausur heißt, dass dein Körper dich mit Energie versorgt — das hilft dir" — Jamieson et al. Costs one sentence.
Both are boring, cheap, evidence-backed, and are the *opposite* of gamification.

---

# 10. Loss aversion, notifications, and the ethical/regulatory line

> **Verification note.** §10.1 and §10.3–§10.6 were read directly from primary documents (the EUR-Lex Official Journal PDFs, the EDPB's own PDF, the Commission Staff Working Document, and open-access journal PDFs). §10.2 (push-notification HCI evidence and the large-scale nudge nulls), the Mathur/Gray dark-pattern taxonomy papers, the German UWG/BGB limb, and the philosophy-of-manipulation literature could **not** be verified before the session's search budget ran out and are listed as open gaps in §10.7. **Nothing in this section is written from memory.**

## 10.1 Loss aversion — **the λ ≈ 2 story does not survive scrutiny. Drop it as a design rationale.**

**Evidence — the primary source.** Prospect theory's original statement establishes a reference-dependent value function that is *steeper for losses than for gains*. It does **not** itself supply the famous number.

**Source.** Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. *Econometrica*, 47(2), 263–291. https://www.econometricsociety.org/publications/econometrica/1979/03/01/prospect-theory-analysis-decision-under-risk

**Evidence — where "twice as large" actually comes from, and how thin that is.** λ = 2.25 is a **median parameter estimate from Tversky & Kahneman (1992)**, fitted to data from **25 graduate students** in a one-hour session of hypothetical choices, with certainty equivalents for 28 positive, 28 negative and — decisively for loss aversion — **only 8 mixed prospects.**

**Source.** Walasek, L., Mullett, T. L., & Stewart, N. (2024). A meta-analysis of loss aversion in risky contexts. *Journal of Economic Psychology*, 103, 102740. Open access: https://wrap.warwick.ac.uk/id/eprint/185745/13/1-s2.0-S0167487024000485-main.pdf · Original: Tversky, A., & Kahneman, D. (1992). *Journal of Risk and Uncertainty*, 5, 297–323. DOI 10.1007/BF00122574 `[fetched primary]`

**Evidence — the current quantitative picture.** Four estimates, and they diverge by a factor of two:

| Study | λ | 95% CI | Basis |
|---|---|---|---|
| Tversky & Kahneman (1992) | **2.25** | — | 25 students, 8 mixed prospects |
| Brown, Imai, Vieider & Camerer (2024) | **1.955** | [1.820, 2.102] | 607 estimates, 150 articles, 1992–2017 |
| Walasek, Mullett & Stewart (2024) | **1.31** | [1.10, 1.53] | 17 studies, CPT refit to raw individual choice data |
| **Yechiam & Zeif (2025)** — symmetric gains/losses, unordered presentation | **1.07** | **[0.97, 1.18], p = .16** | subset of Brown et al.'s **own** dataset |

The decisive analysis: Yechiam & Zeif took Brown et al.'s dataset (84 papers, 163 estimates, **n = 149,218**) and split it on two design features critics had flagged — whether losses were smaller than gains, and whether gains/losses were presented in size order. In the clean cell (**symmetric magnitudes, no ordering**) λ = **1.07**, *not significantly different from 1.0*. 16 of 22 estimates in that cell were individually non-significant, with equal numbers falling below and above. Their conclusion: *"This casts considerable doubts on the robustness of loss aversion."*

**Source.** Brown, A. L., Imai, T., Vieider, F. M., & Camerer, C. F. (2024). Meta-analysis of empirical estimates of loss aversion. *Journal of Economic Literature*, 62(2), 485–516. DOI 10.1257/jel.20221698. https://www.aeaweb.org/articles?id=10.1257%2Fjel.20221698 · Yechiam, E., & Zeif, D. (2025). Loss aversion is not robust: A re-meta-analysis. *Journal of Economic Psychology*, 107, 102801. Full text: https://yeldad.net.technion.ac.il/files/2025/02/YZ_2025.pdf · Data: https://osf.io/chf7j/ `[fetched primary — full text and results table read]`

**Evidence — the Gal & Rucker critique.** Gal & Rucker argue there is no *general* tendency for losses to loom larger than gains, and reinterpret status-quo bias in the exchange paradigm as **a preference for inaction over action** rather than loss aversion. Published as a formal *JCP* "Research Dialogue" with commentaries from Simonson & Kivetz and Higgins & Liberman and a rejoinder.

**Source.** Gal, D., & Rucker, D. D. (2018). The loss of loss aversion: Will it loom larger than its gain? *Journal of Consumer Psychology*, 28(3), 497–516. DOI 10.1002/jcpy.1047. https://myscp.onlinelibrary.wiley.com/doi/abs/10.1002/jcpy.1047 · Simonson & Kivetz (2018), DOI 10.1002/jcpy.1046 · Higgins & Liberman (2018), DOI 10.1002/jcpy.1045 · Shavitt (2018), DOI 10.1002/jcpy.1054 `[metadata verified; full texts paywalled — content characterisation is from citing sources and is UNVERIFIED]`

**Confidence.** `strong` that λ ≈ 2 is an artefact-inflated average over the published literature; `contested` as live science (Yechiam & Zeif 2025 is a re-analysis of a 2024 paper and Brown et al. have not, as far as could be verified, replied; the clean cell is thin at k = 22).

**Verdict.** **Delete loss aversion from your design rationale.** If someone argues for streak-loss warnings, progress resets, or "you'll lose your place" framing on the grounds that losses hurt twice as much — the entire weight behind that number is a median fit to 8 mixed gambles from 25 graduate students in 1992, and it collapses to loss-neutrality under the best available re-analysis. If you want loss framing, A/B test it against a prior of **roughly zero**. The stronger reason to avoid it is §10.4–§10.5 (regulatory), not that it fails to work.

## 10.2 Notifications and re-engagement — **OPEN GAP, not a negative finding**

The peer-reviewed evidence on push-notification effects, interruption cost, educational reminders, and the large-scale nudge **null results** in higher education (Oreopoulos & Petronijevic; Bergman & Page; Bird et al. on FAFSA; DellaVigna & Linos) **could not be verified** before the search budget ran out. There are no citations, sample sizes or effect sizes for it here, and none have been invented. **Treat this as unresearched, not as "no effect found."** It is the single highest-value gap to fill in a follow-up.

One relevant data point *was* verified incidentally, from the Commission's own behavioural study: **health and fitness apps were found to rely more heavily on "nagging" than other sectors** — the closest sector analogue to a study app in the verified record (source at §10.3).

## 10.3 Dark patterns — prevalence and the taxonomy that names your mechanics

**Evidence — EU prevalence.** **97% of the most popular websites and apps used by EU consumers deployed at least one dark pattern.** Most prevalent types in order: **hidden information / false hierarchy, preselection, nagging, difficult cancellations, forced registration.** E-commerce leaned on countdown timers; **health/fitness apps leaned on nagging.**

**Source.** Lupiáñez-Villanueva, F., Boluda, A., Bogliacino, F., Liva, G., Lechardoy, L., & Rodríguez de las Heras Ballell, T. (2022). *Behavioural study on unfair commercial practices in the digital environment: Dark patterns and manipulative personalisation — Final report.* European Commission, DG Justice and Consumers. DOI 10.2838/859030. https://op.europa.eu/publication/manifestation_identifier/PUB_DS0722250ENN `[verified on the EU Publications Office record and quoted in SWD(2024) 230 final]`

Two further verified sweeps, read from SWD(2024) 230 final: the **2022 CPC sweep** found **nearly 40% of online retail shops** contained at least one dark pattern (fake countdown timers, hidden information, false hierarchies); the **2024 ICPEN/GPEN sweep of 642 traders** found **75.7% deployed at least one** and **66.8% two or more.**

**Evidence — the EDPB taxonomy.** Six categories, sixteen named types (Overloading, Skipping, Stirring, Obstructing, Fickle, Left in the dark). Two matter directly:
- **"Continuous prompting"** — *"repeatedly asking users to provide data or to consent … Users are likely to end up giving in, wearied from having to refuse the request each time."* The EDPB's **own footnote 82** states this *"is closely related to a type of pattern called 'Nagging' found in the academic literature."*
- **"Emotional Steering"** — *"Using wording or visual elements … in a way that confers the information to users in either a highly positive outlook, making users feel good, safe or rewarded, or in a highly negative one, making users feel scared, guilty or punished."*

**Source.** EDPB, *Guidelines 03/2022 on deceptive design patterns in social media platform interfaces: How to recognise and avoid them*, Version 2.0, adopted **24 February 2023**. https://www.edpb.europa.eu/system/files/documents/2023-02/edpb_03-2022_guidelines_on_deceptive_design_patterns_in_social_media_platform_interfaces_v2_en_0.pdf `[fetched primary — read in full]`
*(Note: several secondary write-ups give the adoption date as 14 February 2023. The official EDPB page says **24** February. Use 24.)*

**Scope caveat, and it matters.** The EDPB Guidelines are **expressly limited to social media platforms** — *"These Guidelines focus solely on deceptive design patterns in social media platforms."* **A study app is not that.** They do add that variations of these patterns elsewhere *"may still infringe upon the rights of data subjects or consumers,"* and the binding hook that *does* apply to every controller is **GDPR Art 5(1)(a) fairness** (*"personal data shall not be processed in a way that is detrimental, discriminatory, unexpected or misleading to the data subject"*) plus Art 25 data protection by design.

**Not verified.** **Mathur et al. (2019) "Dark Patterns at Scale" and Gray et al. (2018) "The Dark (Patterns) Side of UX Design" were not fetched** — no taxonomy is attributed to them here. The **OECD (2022), "Dark commercial patterns", OECD Digital Economy Papers No. 336, DOI 10.1787/44f5e846-en** citation *is* confirmed (it appears in EDPB footnote 83), but **its contents were never read.**

**Mapping your mechanics — only what the verified record supports:**

| Mechanic | Verified named pattern | Owning source |
|---|---|---|
| Repeated prompts to enable notifications | **Continuous prompting** ≡ **Nagging** (3rd most prevalent EU-wide) | EDPB §4.1.1; Commission 2022 study |
| Guilt copy on opt-out / cancellation | **Emotional Steering** / **confirmshaming** | EDPB §4.3.1; UCPD Guidance §4.2.7 |
| Countdown timers / "limited time" on courses | **Fake timers and limited stock claims** — banned outright | UCPD Annex I No 7 |
| Hard-to-cancel subscription | **Difficult cancellations** (4th most prevalent) | Commission 2022 study; UCPD Guidance |
| **Daily streaks** | Named as a **"time-based element"** addictive-design element; **"snap streaks"** named as a candidate for further regulation | SWD(2024) 230 final |
| Loss-framed progress reset | Named as **"penalties for disengagement"** | SWD(2024) 230 final |
| **Leaderboards / "X students studying now"** | **No primary source found naming social proof or leaderboards as a dark pattern. Do not claim one.** | — |

**Be careful about streaks specifically:** the verified record does **not** say a streak is per se unlawful. It says streaks appear in a Norway-commissioned study's list of 13 possible dark patterns/addictive design elements, and that stakeholders asked the Commission to consider regulating them. **That is regulatory direction, not prohibition.**

## 10.4 DSA Article 25 — **almost certainly does not bind you, for two independent reasons**

**Evidence — the actual text.** Regulation (EU) 2022/2065, Article 25(1): *"Providers of online platforms shall not design, organise or operate their online interfaces in a way that deceives or manipulates the recipients of their service or in a way that otherwise materially distorts or impairs the ability of the recipients of their service to make free and informed decisions."* Art 25(2) carves out practices already covered by the UCPD or GDPR. Art 25(3) flags three illustrative practices: visual prominence of certain choices; **repeatedly requesting a choice already made, especially via pop-ups**; and making termination harder than subscription.

**Reason 1 — you are probably not an "online platform."** Art 3(g)(iii) defines *hosting* as *"the storage of information provided by, and at the request of, a recipient of the service"*; Art 3(i) defines an *online platform* as a hosting service that *"stores and disseminates information to the public."* A platform whose Kurse/Units/Tasks/Dokumente are authored by **you** and served to enrolled students is not storing recipient-provided information, so it is not a hosting service in respect of that content. **Recital 14** adds that where access requires registration, information counts as disseminated to the public only where users are *"automatically registered or admitted without a human decision."*

**Reason 2 — the micro/small enterprise exclusion.** Article 25 sits in Chapter III, Section 3. **Art 19(1):** *"This Section, with the exception of Article 24(3) thereof, shall not apply to providers of online platforms that qualify as micro or small enterprises as defined in Recommendation 2003/361/EC."*

**Source.** Regulation (EU) 2022/2065 (Digital Services Act), OJ L 277, 27.10.2022. https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32022R2065 `[fetched primary — verbatim from the OJ]`

**Confidence.** `strong` on the legal structure; `moderate` on application, which turns on your content model. **Unsettled:** if you later add student-generated content visible to other students, the analysis changes — and automatic entitlement on purchase might still count as "automatically admitted" under Recital 14. Don't rely on the paywall alone.

## 10.5 UCPD — **this is your actual compliance surface, and it reaches re-engagement even with no purchase**

**Evidence — the scope finding that matters most.** The Commission's guidance states that the UCPD covers *"commercial practices such as capturing the consumer's attention, which results in transactional decisions such as continuing to using the service (e.g. scrolling through a feed), to view advertising content or to click on a link."*

> **A notification designed to bring a student back into your app is a commercial practice under EU consumer law, assessable for unfairness, even though nobody buys anything.**

**Evidence — specific mappings, verbatim or near-verbatim:**
- **Nagging → blacklisted.** *"Making repeated intrusions during normal interactions in order to get the consumer to do or accept something (i.e. nagging) could amount to a persistent and unwanted solicitation (No 26 Annex I)."* Annex I practices are unfair **in all circumstances** — no balancing.
- **Fake urgency → blacklisted.** *"Creating urgency by falsely stating that a product will only be available for a very limited time … (No 7 Annex I). For example, this includes fake timers and limited stock claims on websites."*
- **Confirmshaming → aggressive practice.** *"using emotion to steer users away from making a certain choice (e.g. 'confirmshaming' the consumer into feeling guilty) could amount to an aggressive practice under Article 8 UCPD."*
- **Cancellation.** *"traders should follow the principle that unsubscribing from a service should be as easy as subscribing to the service."*
- **No intent required.** *"The UCPD does not require intention for the deployment of the dark pattern."*
- **Professional diligence.** *"traders should take appropriate measures to ensure that the design of their interface does not distort the transactional decisions of consumers"* — a standard that *"may include principles derived from international standards and codes of conduct for ethical design."*

**Source.** Directive 2005/29/EC (UCPD); Commission Notice — *Guidance on the interpretation and application of Directive 2005/29/EC*, **OJ C 526, 29.12.2021**, §§2.6, 3.6, 4.2.7. https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:C:2021:526:FULL `[fetched primary — 144-page text read]`

**Confidence.** `strong` (verbatim). Note the guidance is a Commission Notice — enforcement-relevant and persuasive, not binding on courts.

**Evidence — "our users are adults" is a weaker defence than it sounds.** Art 5(3) protects groups vulnerable by *"mental or physical infirmity, age or credulity"* — but the guidance says the concept *"is not limited to the characteristics listed in Article 5(3), as it covers also context-dependent vulnerabilities"* and is *"dynamic and situational, meaning … a consumer can be vulnerable in one situation but not in others."* It adds that where a practice is highly personalised the benchmark can be *"formulated from the perspective of a single person."* The Fitness Check notes that *"increased susceptibility to commercial communications and manipulative practices could also affect adult gamers, especially during lengthy and immersive gameplay."*

**Confidence.** `strong` on the doctrine; **`unsettled`** on whether exam-stressed 19–25-year-olds would be found a vulnerable group — **no case law found either way.**

**Verdict.** Hard stops today, none of which require intent:
1. **No fake countdowns or false scarcity** on courses or prices. Blacklisted.
2. **No re-prompting after a student has declined.** Mapped to a blacklisted practice.
3. **No guilt copy** on cancellation or notification opt-out.
4. **Cancellation as easy as signup.**
5. **Do not personalise pressure to inferred emotional or academic state** — that is the situational-vulnerability fact pattern.

## 10.6 ePrivacy Art 13, and the Digital Fairness Act direction of travel

**Evidence — messaging.** Directive 2002/58/EC Art 13(1) requires **prior consent** for direct marketing by "electronic mail," defined in Art 2(h) as *"any text, voice, sound or image message sent over a public communications network which can be stored in the network or in the recipient's terminal equipment until it is collected."* Art 13(2) gives a soft opt-in for *"its own similar products or services"* to existing customers, provided an easy, free objection is offered **at collection and in each message.** The UCPD Guidance notes these sector rules **prevail** over the UCPD, *"meaning that such solicitations do not have to be persistent and that Member States must penalise solicitations from the first call or email."*

**Source.** Directive 2002/58/EC, Arts 2(h), 13. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32002L0058 `[fetched primary]`

**Confidence.** `strong` on the text. **`Unsettled`** on whether a **push notification** is "electronic mail" under Art 2(h) — the definition is technology-neutral and a stored push payload arguably fits, but **no resolving authority was found.**

**Verdict.** Split **transactional/service** messages (your Kurs was updated; your payment failed) from **marketing/re-engagement** messages (come back, you haven't studied in 3 days) **at the architecture level**. Separate consent, separate toggle, opt-out in every message. Because ePrivacy penalises from the *first* message, "it's only occasional" is not a defence — **build as if push counts.**

**Evidence — the Digital Fairness Act.** **Not law and not yet proposed.** The European Parliament's Legislative Train lists it as **"Announced,"** with a Commission proposal scheduled for **Q4 2026**; the public consultation ran to **24 October 2025**. Target areas per the Commission: **dark patterns; addictive design; unfair personalisation; influencer marketing; unfair price marketing; digital contract issues.**

**Source.** European Parliament Legislative Train Schedule, "Digital Fairness Act": https://www.europarl.europa.eu/legislative-train/theme-protecting-our-democracy-upholding-our-values/file-digital-fairness-act · European Commission, "Review of EU consumer law": https://commission.europa.eu/law/law-topic/consumer-protection-law/review-eu-consumer-law_en

**Evidence — the Fitness Check, and it names your entire mechanic set in one sentence.** SWD(2024) 230 final, published **3 October 2024**, 218 pages. Its addictive-design section names as concerns, verbatim:

> *"content that is temporarily available (ephemeral content), various incentives for continued engagement (e.g. badges, rewards) or, conversely, penalties for disengagement. Concerns have also been raised more generally with interaction-based recommender systems and notifications that are delivered during or outside of the consumer's interaction with the digital product or service, as well as with gamification, which entails the integration of game-like elements in non-gaming environments."*

Further verified specifics:
- **Streaks named.** A 2023 Norway-commissioned study listed 13 possible dark patterns/addictive design elements including *"time-based elements (e.g. daily rewards, streaks, countdowns)"*; stakeholders asked the Commission *"to consider further regulating addictive design features such as snap streaks, autoplay and infinite scrolling."*
- **The gap is acknowledged:** *"there is currently no EU legislation that specifically regulates addictive design or specific features such as virtual items or in-app currencies."*
- **Consumer data:** **33% of consumers** in the public consultation reported spending too much time or money on certain websites/apps; **31%** in the consumer survey reported spending more time or money than intended because of features such as autoplay, **receiving rewards for continuous use, or being penalised for inactivity**.
- **Direction:** the EP's 2023 resolution *"urged the Commission … prohibiting the most harmful practices and introducing a 'right not to be disturbed' that could turn all attention-seeking features off."* **51% of stakeholders** supported mandating user-set time/spend limits; several called for **addiction-inducing designs to be off by default**; the SWD notes control tools *"are likely to be ineffective if not activated by default."*
- **Academics urged caution:** *"responses from academics noted that the empirical evidence that would enable to draw a link between the practices and their harmful effects is still emerging."*

**Source.** European Commission, *Commission Staff Working Document — Fitness Check of EU consumer law on digital fairness*, **SWD(2024) 230 final**, Brussels, 3.10.2024. https://static1.squarespace.com/static/671c5cac4acff55ddcd96448/t/6720e34efebc5d7dfc229477/1730208593960/Digital+Fairness+Fitness+Check+Report.pdf *(mirror; the EUR-Lex CELEX download failed. The document's cover page self-identifies as SWD(2024) 230 final with companions SEC(2024) 245 final and SWD(2024) 231 final.)* `[fetched primary — read in full]` · EP resolution: "Addictive design of online services and consumer protection in the EU single market," procedure **2023/2043(INI)**, adopted **12 December 2023**, text **T9-0459/2023**, rapporteur **Kim Van Sparrentak**. https://oeil.europarl.europa.eu/oeil/en/procedure-file?reference=2023/2043(INI) `[identifiers verified on OEIL; the resolution's demands are quoted from the Commission's SWD describing it — the resolution text itself was not fetched]`

**⚠️ Honest caveat on the EU's own evidence base.** The Commission's **Regulatory Scrutiny Board** gave the draft Fitness Check a **"POSITIVE WITH RESERVATIONS"** opinion, finding it *"still contains significant shortcomings,"* that *"the quantitative analysis is mainly founded on opinion-based data,"* and instructing that the report *"should refrain from stating or suggesting that the evidence base is robust."*
**Source.** SEC(2024) 245 final, Regulatory Scrutiny Board Opinion, 3.10.2024. https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:52024SC0245 `[fetched primary]`
**The legal direction is clear; the empirical case underneath it is weaker than the rhetoric.** Both halves of that sentence are true and you should hold both.

**⚠️ A number you will see quoted and must not repeat.** Secondary sources say dark patterns "cost EU consumers €7.9 billion per year." That is a **misreading.** The SWD says post-redress financial detriment **in the digital environment as a whole** rose from EUR 3.9 bn (2016) to **EUR 7.9 bn (2022 data)** — it is not attributed to dark patterns, and the SWD itself notes *"the detriment relative to the overall turnover is modest."*

## 10.7 The ethical line — a test you can actually run in design review

**The philosophy limb is an open gap.** Susser, Roessler & Nissenbaum on online manipulation; Sunstein's *Fifty Shades of Manipulation*; Klenk on indifference to reasons; the METUX model (Peters, Calvo & Ryan 2018) — **none were fetched, and no definitions are attributed to them here.**

**What *was* verified is better for your purposes anyway, because it is enforceable.** The Commission's UCPD Guidance supplies an operational manipulation test that closely tracks the philosophical covertness criterion:

> *"It is the presence of these factors and their opaqueness that distinguishes, on the one hand, highly persuasive advertising or sales techniques from, on the other hand, commercial practices that may be manipulative and, hence, unfair under consumer law."*

The enumerated factors, verbatim: traders *"benefit from superior knowledge based on aggregated data about consumer behaviour and preferences"*; deploy *"with high scalability and even dynamically in real time"*; *"continuously test the effects of their practices on consumers … (e.g. through A/B testing)"*; and do so *"without the full knowledge of the consumer."* Using knowledge of *"the vulnerabilities of specific consumers"* can *"amount to a form of manipulation in which the trader exercises 'undue influence' … an aggressive commercial practice prohibited under Articles 8 and 9."*

**Source.** Commission Notice, OJ C 526, 29.12.2021, §4.2.7. `[fetched primary — verbatim]`

**Verdict: adopt this as a shippable four-question checklist.** Before any engagement mechanic goes out:

1. Does it rely on **behavioural data about this user** that the user doesn't know you hold?
2. Is it **personalised or dynamically timed** to that user's inferred state?
3. Are you **A/B testing it to maximise a metric that is yours, not the student's**?
4. Would the student, **shown the mechanism plainly, recognise what is being done to them**?

**If 1–3 are yes and 4 is no, the Commission's own framing puts you on the manipulation side of the line** — regardless of intent, since *"the UCPD does not require intention."*

- A generic, non-personalised, user-configurable daily reminder **passes cleanly**.
- A loss-framed streak warning, timed by a model of when this particular student is most likely to lapse, tuned by A/B test against retention, **fails on all four**.

## 10.8 Open gaps in this section — stated so nobody mistakes them for coverage

1. **All of §10.2** — push-notification HCI evidence, interruption cost, educational reminders, and the large-scale higher-education nudge nulls. No verified citations or numbers.
2. **Mathur et al. (2019) and Gray et al. (2018)** — the two canonical dark-pattern taxonomy papers. Not fetched; no taxonomy attributed to them.
3. **OECD Digital Economy Paper No. 336 contents** — citation confirmed via EDPB footnote 83; contents never read.
4. **All German law** — UWG §§3/4a/5/5a/**7 Abs. 2**, the Anhang zu §3 Abs. 3 blacklist, **§312k BGB** (Kündigungsbutton), vzbv positions, BGH case law. **No verified German statutory text or case citations.** (§7 UWG implements ePrivacy Art 13 in Germany and is generally understood to be stricter in practice — but that was **not verified**, and the operative question, whether §7 covers push notifications, is unsettled at EU level too.)
5. **The philosophy of manipulation** — Susser/Roessler/Nissenbaum, Sunstein, Klenk, METUX.
6. **Gal & Rucker's actual text** — metadata verified; content reconstructed from citing sources only.
7. **The EP resolution's actual text** — identifiers verified via OEIL; demands quoted from the Commission's description.

---

# 11. Mechanics that would be WRONG for this audience

Blunt, specific, and ordered from worst to merely questionable. These all work somewhere — for 12-year-olds, for consumer language apps, for fitness — and misfire on 19–25 y/o university students in an econ/maths programme under exam pressure.

### 1. Public leaderboards. **Never.**
Your customer is disproportionately the student who is *behind*. A leaderboard's only reliable effect on that student is competence frustration (§4.4). The one semester-long university study that tested exactly this configuration found **lower exam scores** (Hanus & Fox 2015). German students already live inside a Notenspiegel and public Durchfallquoten; you would be adding a redundant ranking to people who are already over-ranked and charging them for it. There is no leaderboard variant that survives this analysis.

### 2. Daily streaks. **Don't.**
A semester structurally contains weeks where a maths-tool student legitimately does nothing (other modules' Klausurenphase, Praktikum, Semesterferien). A daily streak converts normal academic life into repeated failure, and the failure state lands on maths-anxious students (§4.3, §9). It also rewards the wrong behaviour: daily 3-minute contact, not the long focused blocks that pass Analysis. **Duolingo's honest causal numbers for streak features are +0.38% and +1.7% DAU/retention** — that is what you would be buying, and it is not worth the harm.

**The German data makes this worse than it first looked.** 63.0% of German students work alongside study, averaging **15.1 h/week**, on top of **34.6 h/week** of study — a ~50-hour week — and the 22. Sozialerhebung states explicitly that employment hours **significantly reduce study time** (§8.2). Your maths cohort already self-studies **19.9 h/week**, *more* than they spend in class. **A daily-obligation mechanic is being sold to people who are demonstrably at capacity.** The loss-aversion justification has also collapsed: λ = **1.07**, not significantly different from 1.0, in the clean cell of the best re-analysis (§10.1). And streaks are named by name in the Commission's Fitness Check as a "time-based element" addictive-design concern, with a Digital Fairness Act proposal due Q4 2026 (§10.6). Weekly, forgiving, never-resetting consistency instead.

### 3. Any spendable virtual currency (gems, coins, hearts, lives). **Absolutely not.**
This is the maximal-risk configuration: **expected + tangible + engagement-contingent + withdrawable** — every factor in the d = −0.40 cell of Deci et al. (1999) at once. Worse, "hearts/lives" gate *learning* behind a resource, which for a **paid** German product is a straight line to a UWG/UCPD unfair-practice argument and to the Digital Fairness workstream on addictive design (§10). And a 21-year-old economics student will read a gem economy as exactly what it is.

### 4. Cutesy behavioural badges ("Nachteule", "Frühaufsteher", "7 Tage in Folge"). **Delete the tier.**
Badges that credential *content mastery* are a progress map and are fine (§4.2). Badges that credential *behaviour* are (a) content-free, so they can't function as competence feedback, (b) read as infantilising by adults, and (c) push toward volume-over-difficulty (§3.6). The test: **would a student screenshot this to a study group without embarrassment?** If not, cut it.

### 5. Guilt-framed push notifications and mascot pressure. **No.**
The Duolingo owl is a *joke about being manipulated*. That is a tolerable brand position for a free consumer app monetised by attention; it is a terrible one for a paid tool a student is trusting with their exam. Note also the timing hazard: an interruptive notification during problem-solving is a working-memory tax on the exact resource maths anxiety already depletes (§9.2).

### 6. Countdown timers on ordinary practice problems. **Only inside an opt-in exam simulation.**
Time pressure blocks working-memory access to the facts the student has actually learned (§9.2, §9.4). The Klausur is timed, so a *deliberate, labelled, opt-in* Klausursimulation is legitimate and valuable. A timer on every practice question is a maths-anxiety generator with no upside.

### 7. Volume-based XP. **Reframe or drop.**
Points that scale with quantity of activity produce the documented "preference for easy tasks" pathology (Toda et al. 2018) and compete, badly, with a real credit system (ECTS) the student already has. If a number exists, it must be a **mastery/exam-readiness estimate**, not an effort accumulator.

### 8. A growth-mindset onboarding module. **Skip it.**
The literature no longer supports it as a standalone intervention (§5.3: d = 0.08 in Sisk et al.; non-significant among best-practice studies in Macnamara & Burgoyne 2023; d = 0.14 at the optimistic end in Burnette et al. 2023). The framing is free in your copywriting. A dedicated feature is not.

### 9. Praise directed at the person. **Rewrite every string.**
"Du bist super in Mathe!" is self-directed feedback — the category that accounts for the **>1/3 of feedback interventions that make performance worse** (Kluger & DeNisi 1996). It also sets up a fixed self-concept that the next failed Klausur demolishes.

### 10. Anything built on the Zeigarnik effect. **The evidence is zero.**
Ratio 0.99, dz = 0.15, k = 38 (Ghibellini & Meier 2025). If a design doc says "Zeigarnik", it is citing 1927 folklore. Build the **Ovsiankina** feature instead — a frictionless "weitermachen" resume — which is the part that actually replicated (67% resumption).

### 11. Fake/endowed starting progress. **Only if the progress is real.**
The endowed-progress effect is strong (34% vs 19% completion) *and* it is literally an illusion by construction (§4.5). For a German product under EU consumer law, manufacturing a false perception of progress to increase engagement is a bad thing to have to explain. Award the head start for a diagnostic test the student actually completed — you keep most of the effect and all of the honesty.

### 12. Mobile-first design. **Wrong surface for this product.**
**~3% of students use a phone as their primary academic device**; 81–86% are laptop/desktop-primary, consistently across four EDUCAUSE waves (§8.1). Consumer-app instincts say mobile-first; the data on *coursework* says otherwise, and you cannot do integration by parts on a phone keyboard. Mobile's honest job here is **review and retrieval** (spaced repetition, checking a formula), not problem-solving. Note also the German ranking: **offline availability 72%** beat appealing design 80%'s neighbours in the low-priority band, while **reliability >99% and Datenschutz 96%** topped the list and **Serious Games ranked last at 25%** (§8.3).

### 13. Adding a twelfth login. **The stated frustration is tool overload, not missing features.**
EDUCAUSE's 2025 frustration list is Wi-Fi, inconsistent AI policies, and **disconnected platforms**; only **48%** of students perceive consistency across their courses (§8.1). German students rank **single sign-on at 84%** and **interoperability at 78%** (§8.3). A product that presents itself as one more silo is fighting a stated preference. Integrate or be the one place.

### 14. Framing the product as a motivation fix. **It is a competence fix — the data is unambiguous.**
**30% of all German dropouts fail on performance requirements** — the most common decisive reason, unchanged since 2008. In Mathematik/Naturwissenschaften, **performance problems play a role in 84% of university dropouts**, with **30% unable to compensate for missing prior knowledge** and **33% never managing the entry into their studies** (§8.5). Meanwhile maths students already self-study **19.9 h/week**. **They are not under-working; they are under-supported.** Selling motivation to this cohort solves a problem they do not have. *(Exception: economics — **40%** of Wirtschafts-/Sozialwissenschaften dropouts lost interest, so relevance and meaning genuinely matter there. Same product, two different failure modes.)*

### 15. Optimising session length or DAU as the north-star metric. **This is the meta-error.**
Every mechanic above becomes attractive the moment engagement is the KPI. Note the finding from the best gamification meta-analysis (§3.1): under **high methodological rigour**, the effect on **cognitive/learning** outcomes stayed stable while the effects on **motivational and behavioural** outcomes did **not**. Engagement is the *less* robust outcome, and it is the one that pulls the product toward easy content. For a paid exam-prep tool, the honest north star is **exam outcomes and renewal**, and a student who passes Statistik in 6 focused hours is a better outcome — and a better testimonial — than one who logs 40 shallow sessions.

---

## Appendix A — Full source index (motivation slice)

Primary sources cited above, grouped. All URLs verified reachable at compile time.

**Self-Determination Theory & rewards**
1. Ryan & Deci (2000), *American Psychologist* 55(1), 68–78 — https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf
2. Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6), 627–668 — https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf
3. Cameron & Pierce (1994), *Review of Educational Research* 64(3), 363–423 — https://journals.sagepub.com/doi/10.3102/00346543064003363
4. Cameron, Banko & Pierce (2001), *The Behavior Analyst* 24(1), 1–44 — https://www.behavior.org/resources/331.pdf
5. Deci, Koestner & Ryan (2001), *RER* 71(1), 1–27 — https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf
6. Deci, Ryan & Koestner (2001), *RER* 71(1), 43–51 — https://journals.sagepub.com/doi/10.3102/00346543071001043
7. Su & Reeve (2011), *Educational Psychology Review* 23(1), 159–188 — https://link.springer.com/article/10.1007/s10648-010-9142-7

**Gamification**
8. Sailer & Homner (2020), *Educational Psychology Review* 32, 77–112 — https://eric.ed.gov/?id=EJ1245270
9. Huang et al. (2020), *ETR&D* 68(4), 1875–1901 — https://eric.ed.gov/?id=EJ1266144
10. Hanus & Fox (2015), *Computers & Education* 80, 152–161 — https://www.sciencedirect.com/science/article/abs/pii/S0360131514002000
11. Rodrigues et al. (2022), *IJETHE* 19, 13 — https://link.springer.com/article/10.1186/s41239-021-00314-6
12. Sailer, Hense, Mayr & Mandl (2017), *Computers in Human Behavior* 69, 371–380 — https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/deliver/index/docId/109059/file/109059.pdf
13. Toda, Valle & Isotani (2018), Springer CCIS 832 — https://link.springer.com/chapter/10.1007/978-3-319-97934-2_9
14. Bai, Hew, Sailer & Jia (2021), *Computers & Education* 173 — https://www.sciencedirect.com/science/article/abs/pii/S0360131521001743
15. Gamification/SDT meta-analysis (2024), *ETR&D* — https://link.springer.com/article/10.1007/s11423-023-10337-7

**Progress, goals, streaks**
16. Kivetz, Urminsky & Zheng (2006), *JMR* 43(1), 39–58 — https://home.uchicago.edu/ourminsky/Goal-Gradient_Illusionary_Goal_Progress.pdf
17. Nunes & Drèze (2006), *JCR* 32(4), 504–512 — https://academic.oup.com/jcr/article-abstract/32/4/504/1787425
18. Ghibellini & Meier (2025), *Humanities and Social Sciences Communications* 12(1), 962 — https://www.nature.com/articles/s41599-025-05000-w
19. Mansur, O. (2022), Duolingo Blog (first-party vendor) — https://blog.duolingo.com/how-duolingo-streak-builds-habit/
20. Amabile & Kramer (2011), *HBR* — https://hbr.org/2011/05/the-power-of-small-wins

**Feedback & mindset**
21. Kluger & DeNisi (1996), *Psychological Bulletin* 119(2), 254–284 — https://mrbartonmaths.com/resourcesnew/8.%20Research/Marking%20and%20Feedback/The%20effects%20of%20feedback%20interventions.pdf
22. Shute (2008), *RER* 78(1), 153–189 — DOI 10.3102/0034654307313795
23. Sisk et al. (2018), *Psychological Science* 29(4), 549–571 — https://artscimedia.case.edu/wp-content/uploads/sites/141/2018/10/03145228/Sisk-et-al.-2018.pdf
24. Yeager et al. (2019), *Nature* 573, 364–369 — https://www.nature.com/articles/s41586-019-1466-y
25. Macnamara & Burgoyne (2023), *Psychological Bulletin* 149(3–4), 133–173 — https://englelab.gatech.edu/articles/2022/
26. Burnette et al. (2023), *Psychological Bulletin* — https://pubmed.ncbi.nlm.nih.gov/36227318/
27. Tipton et al. (2023), commentary — https://pmc.ncbi.nlm.nih.gov/articles/PMC10495100/

**Self-efficacy**
28. Bandura (1977), *Psychological Review* 84(2), 191–215 — https://pdfs.semanticscholar.org/9530/70a862df2824b46e7b1057e97badfb31b8c2.pdf
29. Usher & Pajares (2008), *RER* 78(4), 751–796 — https://journals.sagepub.com/doi/abs/10.3102/0034654308321456
30. Usher & Pajares (2009), maths-specific — https://stelar.edc.org/sites/default/files/Usher_Pajares_2009.pdf
31. Richardson, Abraham & Bond (2012), *Psychological Bulletin* 138(2), 353–387 — https://discovery.ucl.ac.uk/10183671/1/richardson%20psych%20bull.pdf
32. Honicke & Broadbent (2016), *Educational Research Review* 17, 63–84 — https://static1.squarespace.com/static/58be0566579fb3f6f0eb581b/t/5baefe44419202770b350cbc/1538195023537/Honicke+&+Broadbent+2016+(post-ref).pdf
33. Talsma et al. (2018), *Learning and Individual Differences* 61, 136–150 — https://www.sciencedirect.com/science/article/abs/pii/S104160801730211X

**Flow & difficulty**
34. Fong, Zaleski & Leach (2015), *Journal of Positive Psychology* 10(5), 425–446 — https://www.tandfonline.com/doi/abs/10.1080/17439760.2014.967799
35. Wilson, Shenhav, Straccia & Cohen (2019), *Nature Communications* 10, 4646 — https://www.nature.com/articles/s41467-019-12552-4
36. Adesope, Trevisan & Sundararajan (2017), *RER* 87(3), 659–701 — https://journals.sagepub.com/doi/abs/10.3102/0034654316689306
37. Rowland (2014), *Psychological Bulletin* 140(6), 1432–1463

**Anxiety**
38. Barroso et al. (2021), *Psychological Bulletin* 147(2), 134–168 — https://pubmed.ncbi.nlm.nih.gov/33119346/
39. Ashcraft (2002), *Current Directions in Psychological Science* 11(5), 181–185 — https://journals.sagepub.com/doi/10.1111/1467-8721.00196
40. Ashcraft & Kirk (2001), *JEP: General* 130(2), 224–237 — https://www.apa.org/news/press/releases/xge1302224.pdf
41. von der Embse et al. (2018), *Journal of Affective Disorders* 227, 483–493 — https://www.sciencedirect.com/science/article/abs/pii/S0165032717303683
42. Ramirez & Beilock (2011), *Science* 331(6014), 211–213 — https://www.science.org/doi/abs/10.1126/science.1199427
43. Jamieson et al. (2016), *SPPS* 7(6), 579–587 — https://files.eric.ed.gov/fulltext/ED566260.pdf
44. Stress-reappraisal meta-analysis (2024), *Scientific Reports* — https://www.nature.com/articles/s41598-024-58408-w
45. Boaler (2014), *Teaching Children Mathematics* 20(8) — https://www.researchgate.net/publication/347502791 (advocacy source; see §9.4 caveat)

---

## Appendix B — Things I looked for and could NOT verify

Listed so nobody later mistakes absence of evidence for evidence. **Two further gap lists live with their sections: §8.7 (student surveys) and §10.8 (regulation and ethics). Read all three before treating any topic here as covered.**

**Mis-citation traps — numbers that circulate widely and are wrong:**
- **Steel (2007)'s "80–95% of college students procrastinate" is not Steel's finding.** It is his citation to Ellis & Knaus (1977) and O'Brien (2002); several originating sources are dissertations. Steel's own meta-analytic result is that procrastination correlates only **r = −.19** with performance.
- **The "59% of students use GenAI / 44% pay for it" pairing is Tyton Partners' data, not EDUCAUSE's**, despite trade press filing it under an EDUCAUSE conference.
- **"Dark patterns cost EU consumers €7.9 billion per year" is a misreading.** The SWD figure is post-redress financial detriment in the **digital environment as a whole** (EUR 3.9 bn in 2016 → 7.9 bn on 2022 data), not attributed to dark patterns.
- **Kornell & Bjork (2007) contains no cramming item and no "% who cram" figure.** Use the 59% deadline-triage number instead.
- **Sung, Chang & Liu (2016) does not compare phones to desktops.** Its "mobile devices" category explicitly includes laptops; it compares mobile-integrated vs conventional instruction.
- **"Streak users are 63% more likely to abandon a habit after one missed day" and "streak-breakers are 2.3× more likely to quit permanently"** — habit-app vendor marketing with no traceable source. See below.
- **"Duolingo's streak strategy lifted retention from 12% to 55%"** is a gamification vendor's claim, not Duolingo's. Duolingo's own causal numbers are +0.38% and +1.7%.
- **Profiling Institut's "Mathematik 44% dropout"** conflicts with the DZHW appendix (**59%**). Use DZHW.

- **"Streak users are 63% more likely to abandon a habit after one missed day" (attributed to a 2020 *JPSP* paper)** — no such paper found. Appears only in habit-app vendor blogs. **Do not use.**
- **"Streak-breakers are 2.3× more likely to quit permanently"** — same; vendor marketing copy, no traceable source. **Do not use.**
- **"Duolingo's streak strategy lifted retention from 12% to 55%"** — attributed to a gamification-vendor blog (StriveCloud), not to Duolingo. **Not first-party. Do not use.** Duolingo's own published *causal* numbers are +0.38% and +1.7%.
- **Exact r for performance self-efficacy → GPA in Richardson et al. (2012)** — the "strongest of 50 correlates" ranking is verified; the commonly quoted r = .59 was not verified against the primary text.
- **Wang et al. (2024) SDT-interventions-in-education meta-analysis effect sizes** — paper located at selfdeterminationtheory.org, PDF not machine-extractable. Numbers unverified.
- **Cameron, Banko & Pierce (2001) exact effect sizes** — paper located (behavior.org PDF, *The Behavior Analyst* 24(1), 1–44), text not extractable. Their qualitative position is reported accurately from the 1994 meta-analysis abstract and the Deci/Ryan replies.
- **A direct educational replication of the endowed-progress manipulation** — none found. The effect is established in consumer/loyalty settings only.
- **A "checkmark satisfaction" or "empty progress ring" effect as a named research construct** — no peer-reviewed literature found. The real underlying constructs are goal-gradient (strong) and the progress principle (moderate, workplace diary study).
- **Peer-reviewed RCT of a streak mechanic on university students** — none found. The one educational streak study located is on **kindergarten** numeracy (Mathpath, *Education and Information Technologies*, 2026) and is cross-sectional by the authors' own admission, so it cannot support causal claims and does not transfer to this audience.
