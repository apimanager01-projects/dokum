# Part 2b — The ethical line between persuasive design and manipulation

Sub-agent output (child of the motivation research pass). All quotations below were read
from full texts the agent downloaded, unless flagged otherwise.

---

## A. Susser, Roessler & Nissenbaum — "manipulation is hidden influence"

**A1. The definition.** Verbatim: *"In our view, manipulation is hidden influence. Or more fully,
manipulating someone means intentionally and covertly influencing their decision-making, by
targeting and exploiting their decision-making vulnerabilities."* Covertness: *"influencing them in
a way they aren't consciously aware of, and in a way they couldn't easily become aware of were they
to try and understand what was impacting their decision-making process."*

Source: Susser, Roessler & Nissenbaum (2019), "Technology, autonomy, and manipulation," *Internet
Policy Review* 8(2), DOI 10.14763/2019.2.1410 —
https://pure.uva.nl/ws/files/45262114/Susser_Roessler_Nissenbaum_Technology_autonomy_and_manipulation_.pdf
· and "Online Manipulation: Hidden Influences in a Digital World," *Georgetown Law Technology
Review* 4(1), 1–45, SSRN 3306006 —
https://pure.uva.nl/ws/files/45242068/Susser_Roessler_Nissenbaum_Online_Manipulation_.pdf
**Confidence: strong** (verbatim).

**A2. It is awareness, not rationality.** They explicitly distance themselves from the
"bypasses rational agency" framing: *"It is possible, on our account, to be irrationally influenced
without being manipulated, just as it is possible to be manipulated and still decide rationally…
the issue for us is not rationality but awareness."* (GLTR 4(1), p. 16 n.61.)
→ Design review asks "can they see it?", not "is it emotional?"

**A3. Persuasion / coercion / manipulation.** *"persuasion and coercion are alike in that they are
both forthright forms of influence… Manipulation, by contrast, is hidden."* Phenomenological test:
*"when a person is coerced that person feels used, when a person is manipulated that person feels
played."* Corollary: making a mechanic harsher but visible moves it toward coercion — a different
wrong, not a lesser one. Don't assume "softer = more ethical."

**A4. Hiddenness is the only necessary condition.** *"Strictly speaking, the only necessary condition
of manipulation is that the influence is hidden; targeting and exploiting vulnerabilities are the
means through which a hidden influence is imposed."* Targeting is *"an exacerbating condition."*
→ **Personalisation is the risk multiplier, not the base offence.** A uniform disclosed streak is
low-risk; the same streak with per-student ML-tuned thresholds is high-risk precisely because the
tuning is invisible.

**A5. Disclosed influence is not manipulation (on their account).** *"If you know you are being
guilted… then you have not been deprived of authorship over your decision."* On nudges: *"only some
nudges are manipulative"*; purely informational nudges (nutrition labels) are not. But harm does not
depend on benefit: *"the fundamental harm of manipulation is to the process of decision-making, not
its outcome"* and *"even purely beneficent manipulation is harmful."*
**Contested** — see B3/B4.

---

## B. Competing accounts

**B1. Sunstein's test.** *"A statement or action can be said to be manipulative if it does not
sufficiently engage or appeal to people's capacity for reflective and deliberative choice."* A matter
of degree: *"we should speak of degrees of manipulation, rather than a simple on-off switch."* Two
aggravating conditions: *"(1) when the manipulator's goals are self-interested or venal and (2) when
the act of manipulation is successful in subverting or bypassing the chooser's deliberative
capacities."*
Source: Sunstein (2016), "Fifty Shades of Manipulation," SSRN 2565892; full text read at Harvard DASH.
Draft is headed "Preliminary draft 2/18/2015". **Confidence: strong.**
→ Softer than SRN's test, and it catches loss-framed streak messaging even when disclosed.

**B2. Whose interest.** *"the manipulator is promoting his own interests, and not those of the
chooser."* Benefiting the user does not launder it: *"Some acts of manipulation count as such even if
they leave the chooser better off."* And the subjective test is ruled out by name: *"The question is
whether someone has, in fact, sufficiently engaged a chooser's deliberative capacities – not whether
the chooser so believes."*
→ "Students told us they liked the streak" is not a defence.

**B3. Sunstein contradicts SRN on transparency — the crux.** *"Transparency is a necessary condition.
Note, however, that it is not sufficient. Subliminal advertising would not become acceptable merely
because people were informed about it."* His summary: *"individual consent justifies manipulation,
transparency and democratic authorization do not."*
→ **Consent (opt-in) does what disclosure alone cannot, on either account.**

**B4. Klenk — manipulation as careless influence, and it can be overt.** *"Several scholars have
argued that manipulative influence is always hidden. But manipulation is sometimes overt… I argue
that manipulation is careless influence."* Formally: *"an influence that aims to be effective but is
not explained by the aim to reveal reasons to the interlocutor."* Not laziness: *"manipulation is
often carefully crafted influence in its aim to be effective, but careless or indifferent only to the
aim of revealing reasons to others."* Benevolence does not exempt.
Source: Klenk (2021/2022), *Review of Social Economy* 80(1), 85–105, DOI 10.1080/00346764.2021.1894350
(abstract verbatim); definition + critique quoted from Klenk, "Algorithmic transparency and
manipulation," arXiv:2311.13286 (full text read). **Confidence: strong** on the account.
→ **The account that should worry a product team most: it indicts a process, not a feature.** A streak
chosen from an engagement-optimisation A/B test is manipulative on this view even if fully visible and
even if it helps the student pass. The fix is changing the selection criterion, not adding disclosure.

**B5. Sax — for-profit health apps.** Sax (2021), *Ethics and Information Technology* 23(3), 345–361,
DOI 10.1007/s10676-020-09576-6. **Confidence: weak — the agent never read this paper** (Springer
blocked every route). Citation exact; content unverified; do not quote it. The structural point is
transferable regardless: a platform earning from continued subscription has a standing incentive to
optimise for return visits rather than for the student passing the module and leaving.

**B6. The concept may be too vague to operationalise — Sunstein says so himself.** *"it is not
entirely clear that it is a unitary concept, or that we can identity [sic] necessary and sufficient
conditions."* And: *"as defined here, manipulation can plausibly be said to be pervasive."*
→ Use these tests as an argument-forcing checklist producing a written justification, not a pass/fail
gate producing a green tick.

*The brief's "Kahneman-adjacent ethics work on digital sovereignty" does not exist as a body of work;
Kahneman appears here only as the cited source for dual-process theory.*

---

## C. Self-determination theory and autonomy-supportive design

**C1. The three needs.** *"three innate psychological needs--competence, autonomy, and relatedness--
which when satisfied yield enhanced self-motivation and mental health and when thwarted lead to
diminished motivation and well-being."*
Source: Ryan & Deci (2000), *American Psychologist* 55(1), 68–78 —
https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf **Confidence: strong.**
→ Needs can be *thwarted*, not merely unmet. A pressuring mechanic is net negative, not neutral.

**C2. The overjustification meta-analysis — full abstract, verbatim.** *"A meta-analysis of 128 studies
examined the effects of extrinsic rewards on intrinsic motivation. As predicted, engagement-contingent,
completion-contingent, and performance-contingent rewards significantly undermined free-choice
intrinsic motivation (d = -0.40, -0.36, and -0.28, respectively), as did all rewards, all tangible
rewards, and all expected rewards. Engagement-contingent and completion-contingent rewards also
significantly undermined self-reported interest (d = -0.15, and -0.17)… Positive feedback enhanced both
free-choice behavior (d = 0.33) and self-reported interest (d = 0.31). Tangible rewards tended to be
more detrimental for children than college students, and verbal rewards tended to be less enhancing for
children than college students."*
Source: Deci, Koestner & Ryan (1999), *Psychological Bulletin* 125(6), 627–668 —
https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf
**Confidence: strong** (verbatim from PDF).
→ Two results that cut in opposite directions and both matter: **positive/informational feedback
enhances** intrinsic motivation (d = +0.33/+0.31) while **tangible contingent rewards undermine** it;
and **the undermining effect is weaker for college students than for children** — i.e. attenuated in the
19–25 band. Engagement-contingent rewards are the worst category (d = −0.40) — and a raw streak is
engagement-contingent by construction.

**C3. METUX — six spheres.** Adoption · Interface · Task · Behavior · Life · Society. Needs glossed as
autonomy = *"feeling agency, acting in accordance with one's goals and values"*; competence = *"feeling
able and effective"*; relatedness = *"feeling connected to others, a sense of belonging."*
Source: Peters, Calvo & Ryan (2018), *Frontiers in Psychology* 9:797, DOI 10.3389/fpsyg.2018.00797.
**Correction:** METUX = "Motivation, Engagement & Thriving in User Experience."
→ A mechanic can satisfy needs at one sphere and frustrate them at another. A streak boosts competence
at Interface/Task while damaging autonomy at Life: 30 seconds of trivial revision at 23:55 satisfies the
app and is not studying.

**C4. Engagement ≠ wellbeing.** *"factors such as engagement and enjoyment do not necessarily contribute
to sustainable wellbeing"*; *"any technology wishing to claim it improves wellbeing… will need to measure
at the life level."* On crowding-out: a casual game *"can be so need satisfying within the first few
spheres, that at the life sphere, important activities get crowded out."* **Confidence: strong.**
→ A concrete measurement obligation: instrument perceived pressure and perceived exam-readiness, not
just retention. Otherwise you cannot distinguish learning from counter-feeding.

**C5. Autonomy-supportive vs controlling.** *"Controlled extrinsic motivation involves a sense of
pressure or obligation… while highly autonomous extrinsic motivation is close in quality to intrinsic
motivation."* Design rule: *"Devices that offer options and choices over use, and do not in turn demand
actions from users without their assent, enhance feelings of autonomy."*
→ Student sets their own weekly goal (autonomy-supportive) vs app imposes a daily target (controlling).
Same data, opposite motivational quality. Default-on streaks demand action *without assent*.

**C6. Gamification in learning — genuinely mixed.**
- *Negative:* Hanus & Fox (2015), *Computers & Education* 80, 152–161, DOI 10.1016/j.compedu.2014.08.019
  — gamified course students *decreased* in motivation, satisfaction and empowerment.
  **Confidence: moderate** — citation Crossref-verified, but full text and abstract both unobtainable;
  findings from a search summary. Do not quote effect sizes.
- *Positive:* Li, Hew & Du (2024), *ETR&D* 72(2), 765–796, DOI 10.1007/s11423-023-10337-7 — 35
  interventions, 2500 participants: *"an overall significant but small effect size favoring gamified
  learning… (Hedges' g = 0.257, 95% CI [0.043, 0.471], p = .019) with no evidence of publication bias.
  Gamification also exerted a positive and significant effect on the students' perceptions of autonomy
  (g = 0.638) and relatedness (g = 1.776), but minimal impact on competence (g = 0.277, 95% CI [0.001,
  0.553], p = .049)."* **Confidence: strong** (verbatim abstract).
→ Read the *pattern*: gamification helps autonomy and relatedness and **barely touches competence**
(CI lower bound 0.001 — effectively null). For maths/econ, competence is the need that matters most and
is the one gamification demonstrably fails to serve. Competence comes from good feedback on hard
problems, not from badges.

**C7. Streaks and loss-framed messaging — a genuine evidence hole.** No peer-reviewed primary research
isolating streak mechanics against autonomy or intrinsic motivation was located. Searches returned
vendor marketing making confident causal claims ("streaks boost engagement by 60%") with no
methodology, no control, self-interested authorship. **The agent explicitly declined to cite these.**
Nearest adjacent, unverified: arXiv:2203.16175 (qualitative case study of gamification misuse in a
language-learning app, preprint).
→ Nobody can tell you from evidence whether a streak will help or hurt. Derive the prior from the layers
above: DKR 1999 says engagement-contingent rewards are the most undermining category (d = −0.40) and
streaks are engagement-contingent by construction; SDT says loss framing supplies *pressure*, the
defining mark of controlled motivation. That is a **theory-grounded prior, not an empirical finding** —
describe it that way internally.

---

## D. Operational tests a product team can apply

**D1. Publicity / transparency — and the paradox.** Thaler & Sunstein: *"The government should respect
the people whom it governs, and if it adopts policies that it could not defend in public, it fails to
manifest that respect."* Choice architects *"should be happy to reveal both their methods and their
motives."*
The paradox (Hansen & Jespersen): there is *"no such thing as a 'neutral' design"*, so the strong version
self-destructs — the architect either neglects those she influences or breaks the constraint.
Their usable fix: *"a transparent nudge is defined as a nudge provided in such a way that the intention
behind it, as well as the means by which behavioural change is pursued, could reasonably be expected to
be transparent to the agent being nudged as a result of the intervention."*
Source: Hansen & Jespersen (2013), *European Journal of Risk Regulation* 4(1), 3–28,
DOI 10.1017/S1867299X00002762 (full text read). **Confidence: strong.**
*Caveat flagged by the agent:* this paper cites Brian Wansink's plate-size experiments as canonical
examples; Wansink's work was later retracted for research misconduct. The argument doesn't depend on
them — don't reuse them as evidence.
→ **Two distinct questions.** (1) *Disclosure:* would you state the mechanism and your motive on the page
itself, in German? (2) *Reconstruction* (stronger, better): could a student who paused and thought work
out **what** the app is doing and **why**, from the intervention itself? A visible streak counter passes
both. A reminder timed by a lapse-prediction model fails (2) even if a privacy policy discloses it.

**D2. "Would it still work if disclosed?" — a bad primary test.** Bovens: *"these techniques do work best
in the dark."* Hansen & Jespersen rebut: *"there are several examples of transparent nudges that work
undisturbed by such transparency… Bovens clearly seems to overstate the case."*
Bruns et al. (2018), *Journal of Economic Psychology* 65, 41–59, DOI 10.1016/j.joep.2018.02.002 —
**the agent never obtained the text and does not know what they found.** Title poses the question; do not
assume the answer.
→ Use as an *alarm* that triggers review, never as the deciding test — it makes effectiveness the test of
ethics, which is backwards. If the team argues a mechanic must stay unexplained to work, stop and apply
D1 and D4.

**D3. Reflective endorsement.** Wood: manipulation *"undermine[s] or disrupt[s] the ways of choosing that
they themselves would critically endorse if they considered the matter in a way that is lucid and free of
error."* But three authors warn it can't be settled by asking the user. Susser et al. retreat to
*"manipulative practices—strategies that a reasonable person should expect to result in manipulation."*
→ Reformulate as a practices test: "would a reasonable economics student, shown the mechanism, recognise
it as helping them pass the module?" Spaced-repetition reminders survive. A midnight streak-loss warning
that rewards 30 seconds of trivial activity does not — the behaviour it elicits isn't the behaviour the
student would endorse.

**D4. Whose interest — the one test all three traditions endorse.** Sunstein's welfare limb + Klenk's
sharper version (influence *"not explained by the aim to reveal reasons"* is manipulative even when the
goal benefits the target) + METUX's measurement corollary. **Confidence: strong** — convergence from
different premises.
→ **Make this mandatory and auditable.** For each mechanic, write down the metric it was chosen to move.
Retention / DAU / session count → fails, needs re-justification against a learning metric. Exam pass
rate / problem-set completion / spaced-recall accuracy → passes.

**D5. Reversibility / ease of exit.** Sunstein: *"people do reject default rules that they genuinely
dislike, so long as opt-out is easy – an empirical point in favor of the conclusion that such rules should
not be counted as manipulative."* Note he makes ease-of-exit do work only *in combination with*
non-concealment.
→ Streaks, reminders and loss-framed messages each independently switchable off in one step, no
confirm-shaming, no buried toggle. German context makes granular, revocable, non-defaulted consent the
culturally and legally expected posture anyway.

**D6. Published checklists — verification results.**
- **IEEE P7008** *Standard for Ethically Driven Nudging for Robotic, Intelligent and Autonomous Systems*
  — **a draft, not a published standard.** Latest artefact P7008/D19, January 2026, on IEEE Xplore as an
  *IEEE Draft Standard*. **Do not claim conformance.** https://site.ieee.org/sagroups-7008
- **The usable academic instrument:** Weijers, de Koning & Paas (2020), "Nudging in education: from theory
  towards guidelines for successful implementation," *European Journal of Psychology of Education* 36,
  883–902, DOI 10.1007/s10212-020-00495-0 — operationalises Hansen & Jespersen's transparent/non-transparent
  × Type 1/Type 2 matrix for education. **Confidence: moderate** — abstract verified, full text blocked, so
  the matrix itself was not seen. Closest purpose-built checklist for this situation; worth acquiring
  through a university library.

---

## Where this leaves a German study platform for 19–25s

**The philosophy is genuinely unsettled and the team should not pretend otherwise.** SRN say disclosure
cures manipulation (hiddenness is *"the only necessary condition"*). Sunstein says it doesn't
(*"Transparency is a necessary condition… it is not sufficient"*). Klenk says covertness was never the
right criterion (*"manipulation is sometimes overt"*). Sunstein concedes his own concept may not have
*"necessary and sufficient conditions."* Any clean manipulation test on offer is overselling.

**The intersection of all three accounts, in priority order:**
1. **Whose-interest (D4)** — the only universally endorsed test. Auditable: write down the metric each
   mechanic was chosen to move; reject engagement metrics as justification.
2. **Reconstruction (D1)** — can the student work out what and why from the intervention itself? Uniform
   visible mechanics pass; per-student invisible optimisation fails (A4).
3. **Ease of exit (D5)** — one step, permanent, no confirm-shaming.
4. **Consent over disclosure (B3)** — opt-in at onboarding beats disclosed-and-default-on; aligns with
   SDT's *"do not… demand actions from users without their assent."*
5. **Measure at the life sphere (C4)** — perceived pressure and perceived exam-readiness, not just retention.

**On the four mechanics:**
- **Progress mechanics** — safest, and the best-evidenced. DKR 1999: informational feedback *enhances*
  intrinsic motivation (d = +0.33/+0.31). Show mastery of topics, not points. Also where the Li/Hew/Du
  competence gap says effort actually pays.
- **Reminders** — safe if student-set or plainly rule-based; manipulative under A1/D1 if timing is silently
  optimised against predicted lapse. Let the student choose the times.
- **Streaks** — engagement-contingent by construction, the worst category in DKR 1999 (d = −0.40). No
  streak-specific peer-reviewed evidence exists either way. Ship opt-in, uniform, visible, one-tap-off, and
  A/B against a competence measure.
- **Loss-framed messaging** — weakest ethical footing of the four. Supplies exactly the *"sense of pressure
  or obligation"* METUX defines as controlled motivation. Reframe to informational: "Du hast diese Woche 2
  von 4 Einheiten geschafft" carries the same information with no loss frame and no pressure.

**Corrections to carry forward.** METUX = "Motivation, Engagement & Thriving in User Experience". Susser et
al. explicitly reject the "bypasses rational agency" framing.

**Unverified, do not cite without checking:** Klenk's *Indifference Account* book (PhilPapers 403); Bruns et
al. 2018's actual finding; Sax 2021's content; IEEE P7008 scope wording.
