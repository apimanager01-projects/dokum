# German law on manipulative design, dark patterns, subscriptions and notifications

Sub-agent output (child of the motivation research pass). **Research findings, not legal advice.**
Statutory text retrieved verbatim from gesetze-im-internet.de (official, BMJ/juris) on 2026-08-15.
Court decisions verified against official BGH press releases, dejure.org and vzbv.

---

## A. UWG — the core provisions

### A1. § 3 UWG — general prohibition and the vulnerable-group standard

`§ 3 Abs. 1` unfair practices prohibited. `Abs. 2` a consumer-facing practice is unfair if it falls short
of **unternehmerische Sorgfalt** *and* is apt to **materially influence economic behaviour** (both
cumulative). `Abs. 3` Annex practices are **stets** unzulässig. `Abs. 4` benchmark is the average consumer,
or the average member of a clearly identifiable group particularly vulnerable *"auf Grund von geistigen
oder körperlichen Beeinträchtigungen, Alter oder Leichtgläubigkeit."*
https://www.gesetze-im-internet.de/uwg_2004/__3.html **Confidence: strong.**
→ `Abs. 2` is the residual catch-all when no blacklist entry fits. Note `§ 2 Abs. 1 Nr. 1` defines
*geschäftliche Entscheidung* broadly — including whether to **keep** a service or exercise a contractual
right.

### A2. § 4a UWG — aggressive practices, and the provision that matters most

`Abs. 1` aggressive if apt to significantly impair decision-making freedom through **Belästigung**,
**Nötigung**, or **unzulässige Beeinflussung** — the last defined as exploiting a *"Machtposition …
zur Ausübung von Druck, auch ohne Anwendung oder Androhung von körperlicher Gewalt, in einer Weise …, die
die Fähigkeit … zu einer informierten Entscheidung wesentlich einschränkt."*

`Abs. 2` criteria: **Nr. 1** time, place, nature or **duration**; Nr. 2 threatening/insulting language;
**Nr. 3** deliberate exploitation of specific misfortunes or circumstances grave enough to impair judgement;
**Nr. 4** *"belastende oder unverhältnismäßige Hindernisse nichtvertraglicher Art, mit denen der Unternehmer
den Verbraucher … an der Ausübung seiner vertraglichen Rechte zu hindern versucht, **wozu auch das Recht
gehört, den Vertrag zu kündigen**"*; Nr. 5 threats of unlawful acts.
`Abs. 2 S. 2` circumstances under Nr. 3 include *"geistige und körperliche Beeinträchtigungen, das Alter,
die geschäftliche Unerfahrenheit, die Leichtgläubigkeit, die **Angst** und die **Zwangslage** von
Verbrauchern."*
https://www.gesetze-im-internet.de/uwg_2004/__4a.html **Confidence: strong.**
→ **`§ 4a Abs. 2 Nr. 4` is the single most directly applicable dark-pattern provision in the UWG for a
subscription product.** Non-contractual friction obstructing the right to cancel is an express
aggressiveness criterion: extra steps, retention interstitials, a login wall.

### A3. §§ 5, 5a UWG — misleading action and omission

`§ 5 Abs. 2 Nr. 1` covers **Verfügbarkeit**; Nr. 2 the *Anlass des Verkaufs* including special price
advantages; Nr. 7 consumer rights. `§ 5 Abs. 5` rebuttable presumption against a discount claim where the
reference price applied only *"für eine unangemessen kurze Zeit"* — **burden on the advertiser**.

`§ 5a Abs. 2` withholding includes *"**die Bereitstellung wesentlicher Informationen in unklarer,
unverständlicher oder zweideutiger Weise**"*. `Abs. 4` failing to identify commercial purpose.
https://www.gesetze-im-internet.de/uwg_2004/__5.html · .../__5a.html **Confidence: strong.**
→ `§ 5a Abs. 2 Nr. 2` is the **obfuscation rule**: burying material information in unclear presentation is
legally equivalent to withholding it. The hook for low-contrast text and ambiguous button labels.
`§ 5a Abs. 4` catches a "learning reminder" that is in substance an upsell.

### A4. § 7 UWG — unzumutbare Belästigung (the notification provision)

`Abs. 1` *"Eine geschäftliche Handlung, durch die ein Marktteilnehmer in unzumutbarer Weise belästigt wird,
ist unzulässig. **Dies gilt insbesondere für Werbung, obwohl erkennbar ist, dass der angesprochene
Marktteilnehmer diese Werbung nicht wünscht.**"*

`Abs. 2` unzumutbare Belästigung is **stets** assumed: **Nr. 1** phone calls without prior express consent;
**Nr. 2** automatic calling machines, fax, or **elektronische Post** *"ohne dass eine vorherige
ausdrückliche Einwilligung des Adressaten vorliegt"*; **Nr. 3** messages concealing sender identity (a),
violating § 6 Abs. 1 DDG (b), or **(c) lacking a valid address at which the recipient can demand
cessation** at no more than base transmission cost.

`Abs. 3` the existing-customer exception — **e-mail only**, and all four conditions cumulative: address
obtained **in connection with a sale**; used for **eigene ähnliche** goods/services; customer has not
objected; and customer is clearly informed of the right to object **at collection and on every single
use**.
https://www.gesetze-im-internet.de/uwg_2004/__7.html **Confidence: strong.**

> **Numbering warning for reading older case law.** "Elektronische Post" has been in **Abs. 2 Nr. 2** only
> since **28 May 2022** (BGBl. I 2021 S. 3504). Before that it was **Abs. 2 Nr. 3**. Every pre-2022
> judgment — including both BGH cases in §B — cites "§ 7 Abs. 2 Nr. 3 UWG" for the same rule. Same
> provision. (§ 7 amended again 14.05.2024 to swap the TMG reference for § 6 Abs. 1 DDG.)
> Source: https://dejure.org/gesetze/UWG/7.html

#### Do push notifications fall under § 7 Abs. 2 Nr. 2?

**Marketing e-mail: yes, unambiguously.** Consent must be **vorherig** and **ausdrücklich**; opt-out is not
enough; the burden of proving consent is on the sender.

**Push: not answered by the statute, unsettled in German case law — but the best authority points to yes
for advertising pushes.** The chain:

1. UWG does not define "elektronische Post". The term comes from **Art. 2 lit. h) RL 2002/58/EG**: *"jede
   über ein öffentliches Kommunikationsnetz verschickte Text-, Sprach-, Ton- oder Bildnachricht, die im Netz
   oder im Endgerät des Empfängers gespeichert werden kann, bis sie von diesem abgerufen wird."*
2. **Recital 67 of RL 2009/136/EG** extends protection expressly to SMS, MMS *"sowie für ähnliche
   Anwendungen"*.
3. **CJEU, 25.11.2021, C-102/20 — StWL v eprimo** (referred by the BGH, language German). Operative part:
   inbox advertising *"in einer Form, die der einer tatsächlichen E-Mail ähnlich ist, und an derselben
   Stelle wie eine solche E-Mail"* is *"Verwendung … elektronischer Post für die Zwecke der
   Direktwerbung"*, permitted only with consent given *"für den konkreten Fall und in voller Kenntnis der
   Sachlage."* And on the blacklist: such insertion falls under *"hartnäckiges und unerwünschtes
   Ansprechen"* where frequent and regular.
   https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:62020CJ0102
4. On remand: **BGH, 13.01.2022 – I ZR 25/19 "Inbox-Werbung II"** — a general agreement to receive ad
   insertions is not valid consent. https://dejure.org/2022,12419

**Confidence: strong** for marketing e-mail; **moderate-to-unsettled** for push. The CJEU's reasoning is
**functional, not transport-specific** — it turned on the message appearing in the user's message space in
a form resembling a real message, which transfers naturally to an OS notification tray. But **no German
decision on app push notifications was found.**

→ **Two independent risk paths:**
- If the push is **Werbung**, `§ 7 Abs. 2 Nr. 2` requires prior express opt-in **specific to marketing**.
  An OS permission prompt ("Allow notifications?") is **not** an *ausdrückliche Einwilligung in Werbung* —
  it is a technical channel permission. Keep marketing consent separate, logged, revocable.
- Even if not Werbung, `§ 7 Abs. 1` still applies to any geschäftliche Handlung that unreasonably harasses,
  and `S. 2` makes continuing once unwillingness is recognisable the paradigm case. Frequency, late-night
  timing, and ignoring an implicit "stop" are the exposure.

#### Sanctions asymmetry

`§ 20 Abs. 1 Nr. 1` makes it an administrative offence to advertise **by telephone/automatic calling
machine** without consent, fine up to **€300,000** (`Abs. 2`), enforced by the **Bundesnetzagentur**
(`Abs. 3`). **Electronic mail is not listed.** https://www.gesetze-im-internet.de/uwg_2004/__20.html
→ No BNetzA fine for spam e-mail under the UWG. The route is civil: `§ 8` injunctions by competitors and
qualified consumer bodies, Abmahnung with contractual penalties, and per BGH VI ZR 134/15 / VI ZR 225/17 an
individual claim under `§§ 823 Abs. 1, 1004 BGB`. **Absence of a regulator ≠ absence of risk** — vzbv and
the Wettbewerbszentrale are the active enforcers.

### A5. Anhang zu § 3 Abs. 3 UWG — the blacklist

Chapeau: *"Folgende geschäftliche Handlungen sind gegenüber Verbrauchern **stets** unzulässig"* — per se,
no balancing, no need to show material influence. BGBl. I 2021, 3508–3510.
https://www.gesetze-im-internet.de/uwg_2004/anhang.html **Confidence: strong.**

**False scarcity / urgency**
- **Nr. 5** Lockangebote — under two days' stock, *the burden of proving adequacy is on the trader*.
- **Nr. 7** *"die **unwahre** Angabe, bestimmte Waren oder Dienstleistungen seien … **nur für einen sehr
  begrenzten Zeitraum verfügbar**, um den Verbraucher zu einer **sofortigen** geschäftlichen Entscheidung
  zu veranlassen, ohne dass dieser Zeit und Gelegenheit hat, sich auf Grund von Informationen zu
  entscheiden."* **This is the countdown-timer prohibition.**

**Persistent solicitation**
- **Nr. 26** *"**hartnäckiges und unerwünschtes Ansprechen** … mittels Telefonanrufen, … elektronischer Post
  **oder sonstiger für den Fernabsatz geeigneter Mittel der kommerziellen Kommunikation**, es sei denn,
  dieses Verhalten ist zur rechtmäßigen Durchsetzung einer vertraglichen Verpflichtung gerechtfertigt."*
  **The open-ended catch-all sidesteps the "is push elektronische Post?" question entirely** for
  promotional pushes. The carve-out is only for enforcing a genuine contractual obligation — a payment
  failure notice, not a re-engagement nudge.

**Pricing / free claims** — Nr. 20 false "gratis/kostenlos"; Nr. 21 payment demand implying an order already
placed; Nr. 31 false prize claims or prizes conditional on payment.

**Disguised commercial content** — Nr. 10 statutory rights presented as a special feature; Nr. 11
advertorial; Nr. 11a undisclosed paid search placement; Nr. 23b review authenticity without *"angemessene
und verhältnismäßige Maßnahmen zur Überprüfung"*; Nr. 23c fake reviews.

**Aggressive** — Nr. 24 physical "cannot leave the premises" (the ancestor of the roach motel; the digital
analogue needs `§ 4a Abs. 2 Nr. 4`, not Nr. 24); Nr. 28 direct purchase appeals to children; Nr. 29 demands
for payment for unordered goods.

→ **Nr. 7 and Nr. 26 are the two most easily tripped.** Note the word **unwahre** in Nr. 7: a genuinely
time-limited offer, genuinely enforced, is outside it (then assessed under § 5 or § 4a). If you show a
countdown, the deadline must be real and the offer must actually end.

---

## B. Transactional/service messages vs. Werbung

### B1. The BGH's broad concept of Werbung — the sharpest operational rule here

**BGH, 10.07.2018 – VI ZR 225/17.** A seller's e-mail contained the invoice **and** a request to rate the
product. Held: a **customer satisfaction survey** falls under (direct) advertising **even where the same
e-mail transmits an invoice for a product already purchased**, because such surveys serve at least also to
bind the customer and promote future transactions. Using e-mail for advertising without consent is in
principle an interference with the protected private sphere and thus the allgemeines Persönlichkeitsrecht.
Cited: `§§ 823 Abs. 1, 1004 BGB`, `§ 7 Abs. 2 Nr. 3 und Abs. 3 UWG` (old numbering), Art. 1 Abs. 1, 2 Abs. 1
GG, Art. 8 Abs. 1 EMRK.
https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BGH&Datum=10.07.2018&Aktenzeichen=VI+ZR+225%2F17
· full text MIR-Dok. 2885: https://medien-internet-und-recht.de/volltext.php?mir_dok_id=2885
**Confidence: strong** on existence/court/date/Az/substance. **Official Leitsätze not retrieved verbatim.**

**BGH, 15.12.2015 – VI ZR 134/15 ("Autoreply-E-Mails").** A customer who had cancelled and expressly
objected to advertising received an automated acknowledgement carrying an ad footer. Held: unlawful
violation of the general right of personality; the concept of Werbung is construed broadly to include
indirect sales promotion; **it makes no difference that the confirmation is in the body and the advertising
only in the footer.**
https://dejure.org/dienste/vernetzung/rechtsprechung?Gericht=BGH&Datum=15.12.2015&Aktenzeichen=VI+ZR+134/15
· MIR-Dok. 2764 **Confidence: strong** on substance; Leitsätze not verbatim.

> **German law does not let you launder advertising by attaching it to a transactional message.** The
> transactional shell does not immunise the promotional payload, and footer placement does not help.

| Message | Likely classification |
|---|---|
| "Your payment failed, update your card" | Transactional — contract performance |
| "Your Kurs access expires on 3 March" | Transactional if purely factual and necessary |
| **"You haven't studied in 5 days — come back!"** | **Re-engagement = Werbung** — Kundenbindung + promoting future transactions is exactly the VI ZR 225/17 rationale |
| **"Rate your Kurs" / NPS survey** | **Werbung** per VI ZR 225/17, directly on point |
| Transactional receipt + "Check out our new Kurs" footer | **Werbung** per VI ZR 134/15 — the footer contaminates the message |

A "streak broken" or "you're falling behind" push is a re-engagement message. On the BGH's reasoning it is
Werbung, and needs prior express consent — via § 7 Abs. 2 Nr. 2 if push counts as elektronische Post, or via
Anhang Nr. 26 once it becomes persistent.

### B2. Case law on app push notifications specifically

**None found.** No German decision addressing app push under § 7 UWG surfaced across dejure's citator
networks for § 7 UWG and the Inbox-Werbung line, vzbv's full 9,092-URL sitemap, or BGH press releases. vzbv
has extensive published material on dark patterns, Abo-Fallen and the Kündigungsbutton and **nothing on
push**. The nearest authority is the Inbox-Werbung line, which reasons about *where the message lands and
how it looks*, not the transport protocol.
**Confidence: unsettled.** *Coverage caveat: the agent's web-search budget was exhausted early, so this rests
on direct source interrogation rather than exhaustive keyword search. "None found", not "none exists".*
→ Because the point is unsettled, the cheap and defensible posture is to **design as if push were
elektronische Post**: separate, express, logged marketing consent; per-category toggles; a genuine
unsubscribe path in-app (`§ 7 Abs. 2 Nr. 3 lit. c` requires a valid address for demanding cessation); no
promotional pushes to users who have not opted in. That also satisfies Anhang Nr. 26 and § 7 Abs. 1
regardless of how classification resolves.

---

## C. § 312k BGB — the Kündigungsbutton, and the case law that just hardened it

### C1. The statute

`§ 312k Abs. 1` applies where consumers can conclude a contract via a website that establishes a
**Dauerschuldverhältnis** obliging the trader to an **entgeltliche Leistung**.
`Abs. 2` a **Kündigungsschaltfläche** labelled *"gut lesbar mit **nichts anderem als** den Wörtern
'Verträge hier kündigen'"* or an equivalently unambiguous formulation, leading **unmittelbar** to a
**Bestätigungsseite** carrying the Nr. 1 lit. a–e fields and a **Bestätigungsschaltfläche** labelled *"gut
lesbar mit **nichts anderem als** den Wörtern 'jetzt kündigen'"*. *"Die Schaltflächen und die
Bestätigungsseite müssen **ständig verfügbar** sowie **unmittelbar und leicht zugänglich** sein."*
`Abs. 3` the consumer must be able to store the declaration with **date and time** on a durable medium.
`Abs. 4` the trader must confirm content, date/time of receipt and end date **sofort** in Textform.
**`Abs. 6` if the buttons and page are non-compliant, the consumer may terminate *"jederzeit und ohne
Einhaltung einer Kündigungsfrist"*.**

In force **1 July 2022** (Gesetz für faire Verbraucherverträge, 10.08.2021, BGBl. I S. 3433).
https://www.gesetze-im-internet.de/bgb/__312k.html · https://dejure.org/gesetze/BGB/312k.html
**Confidence: strong.**
→ `Abs. 6` is the teeth: non-compliance converts every affected contract into one terminable at any time
with no notice. That is a **revenue-model risk**, not just a legal-notice risk. The button must be on the
**Webseite**, ständig verfügbar, unmittelbar und leicht zugänglich — **not a setting inside an account
area**.

### C2. BGH case law — decisive and very recent

**BGH, 16.07.2026 – I ZR 200/25 ("Bestätigungsseite").** Claimant vzbv; defendant a fitness-studio chain.
The confirmation page carried, in its upper part, a banner with a training photo and a second orange button
reading *"Vertrag im Selfservice pausieren"* pointing to free contract suspension. The OLG dismissed that
part; **the BGH reversed.** From the official press release, verbatim:

> *"Die Ausgestaltung der Bestätigungsseite ist in § 312k Abs. 2 Satz 3 BGB **abschließend** geregelt. Über
> die dort vorgesehenen Angaben … einschließlich der Bestätigungsschaltfläche hinausgehende **Angaben,
> Angebote oder Informationen darf die Bestätigungsseite nicht enthalten.** … Die Bestätigungsseite dient
> **allein** der Erfassung der für die Kündigung erforderlichen Angaben und der Abgabe der
> Kündigungserklärung."*

Vorinstanz OLG Düsseldorf, 18.09.2025 – 20 UKl 1/25; GRUR 2026, 1158.
BGH Pressemitteilung Nr. 128/2026: https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2026/2026128.html
· https://dejure.org/2026,20963 · vzbv "Kündigen ohne Tricks": https://www.vzbv.de/urteile/kuendigen-ohne-tricks
**Confidence: strong** — official BGH press release, retrieved verbatim.
→ **Retention offers on the cancellation confirmation page are now unlawful in Germany, full stop.** Not
"risky", not "balance the interests". No "pause instead?", no discount, no "here's what you'll lose", no
cross-links. The page carries the § 312k Abs. 2 S. 3 Nr. 1 fields and the confirmation button, nothing else.
The defendant also *conceded* that labelling the confirmation button "Vertrag finden" was unlawful.

**BGH, 22.05.2025 – I ZR 161/24 ("Kündigungsschaltfläche").** Headnote: *"Eine Kündigungsschaltfläche nach
§ 312k BGB ist auch dann notwendig, wenn der Verbraucher ein **einmaliges Entgelt** zu entrichten hat und
der Vertrag **automatisch endet**."* Vorinstanz OLG Hamburg, 22.08.2024 – 6 UKl 1/23.
https://dejure.org/2025,13683 · vzbv: https://www.vzbv.de/urteile/bundesgerichtshof-kuendigungsbutton-ist-auch-bei-laufzeitvertraegen-mit-einmalzahlung
**Confidence: strong** on existence and headline holding; Leitsätze not verbatim.
→ **Directly relevant to a per-Unit one-time-purchase model.** Do not assume "no recurring billing ⇒ no
Kündigungsbutton". The trigger is a **Dauerschuldverhältnis** obliging the trader to an entgeltliche
Leistung — a one-off price for time-limited ongoing access is a plausible fit, and the BGH has confirmed the
button is owed even where the fee is one-off and the contract ends automatically. Whether a given per-Unit
purchase *is* a Dauerschuldverhältnis is a question for German counsel on the actual terms — but **the
"it's a one-time payment so § 312k doesn't apply" reasoning is now foreclosed.**

**Pending: the login-wall question. BGH I ZR 272/25 (vzbv, web hosting) and I ZR 275/25
(Wettbewerbszentrale, streaming), hearing 5 November 2026.** The **Kammergericht allowed both claims**,
reasoning that the button must lead **unmittelbar** to a **ständig verfügbare** confirmation page under
§ 312k Abs. 2 S. 3 and S. 4, which a credential gate defeats. Vorinstanzen: KG – 5 UKl 10/25 (18.11.2025);
LG Berlin II – 97 O 81/23 (27.11.2024) and KG – 5 U 6/25 (11.11.2025 per the BGH release; dejure lists
12.11.2025 — a one-day discrepancy left unresolved).
BGH Pressemitteilung Nr. 133/2026: https://www.bundesgerichtshof.de/SharedDocs/Pressemitteilungen/DE/2026/2026133.html
**Confidence: strong** on the procedural facts; **unsettled** on outcome.
→ Time-sensitive. Lower courts have consistently held login walls unlawful, so the safe design today is a
cancellation path reachable **without authentication**, identifying the contract from user-entered data
(`§ 312k Abs. 2 S. 3 Nr. 1 lit. b` expressly contemplates the consumer *supplying* identifying data).

### C3. Lower-court Kündigungsbutton case law

| Decision | Holding |
|---|---|
| **LG Köln, 29.07.2022 – 33 O 355/22** | Must be unmittelbar und leicht zugänglich; details page and submit button **must not be reachable only after logging into the customer portal** |
| **LG Berlin, 16.03.2023 – 52 O 333/22** | Meal-kit/subscription providers must supply a permanently available, immediately accessible button |
| **LG Hildesheim, reported 25.03.2024** | A reseller offering subscriptions exclusively via a **third party's** website is responsible for the missing button on that site. **Aktenzeichen not verified** |
| **OLG München, 20.03.2025 – 6 U 4336/23 e** | Not "leicht zugänglich" when it sits in the last line of a mass of other links (58 links) beside Impressum/Cookies/AGB, behind a "Weitere Links einblenden" control, in smaller grey type |

vzbv judgment pages: /urteile/zur-ausgestaltung-von-kuendigungsschaltflaechen · /urteile/zum-kuendigungsbutton-bei-marley-spoon
· /urteile/kuendigungsbutton-auch-bei-verkauf-von-online-abos-auf-webseiten-dritter · /urteile/zur-gestaltung-des-kuendigungsbuttons-von-sky
**Confidence: strong** on court/date/Az except LG Hildesheim.
→ OLG München is the **visual-prominence** rule: a footer link is fine; a footer link hidden among dozens in
small grey type behind an expander is not. Combined with BGH I ZR 200/25: **prominent entry point, then a
sterile confirmation page.**

Further § 312k decisions confirmed to exist but unread: OLG Nürnberg 30.07.2024 – 3 U 2214/23; OLG Hamburg
26.09.2024 – 5 UKl 1/23; KG 21.01.2025 – 5 UKl 8/24; OLG Schleswig 04.03.2026 – 6 U 42/25. dejure counts
**73 decisions** on § 312k BGB.

### C4. Enforcement is real and organised

vzbv reports that after § 312k took effect, *"mahnten der vzbv und weitere Verbraucherverbände noch im
selben Jahr **mehr als 150 Unternehmen** ab"*. A vzbv study (18.03.2024), ~20 months in, found that of
**1,200 providers surveyed, 80% had implemented a button and about one in five had not**; telecommunications
worst at **40% non-compliance**.
https://www.vzbv.de/meldungen/jeder-fuenfte-anbieter-hat-keinen-kuendigungsbutton-umgesetzt
→ An actively policed area with an organised, well-resourced claimant that litigates to the BGH and wins.

### C5. vzbv on dark patterns

Analysis of **24.03.2022**, based on **over 160 consumer complaints**: *"Vermittlungsplattformen, Online-
Marktplätze und andere Webseiten setzen Dark Patterns ein. Sie **erschweren Kündigungen** und verleiten
Verbraucher:innen dazu, **unerwünschte Verträge abzuschließen** … **Der vzbv hat Anbieter wegen der
Verwendung von Dark Patterns bereits abgemahnt.**"* Two-pronged taxonomy: techniques that **hindern**
(cancellation, account deletion) and techniques that **anlocken**. Worked example: the Amazon Prime
cancellation flow (vzbv's *"Schabenfalle"* / roach motel) — warnings, a claim that cancelling forfeits
already-paid benefits immediately, information overload, multicoloured design, and a continue button
labelled *"Ich verzichte auf meine Prime-Vorteile"*.
https://www.vzbv.de/meldungen/dark-patterns-designtricks-im-internet-bereiten-probleme
**Confidence: strong** as a statement of vzbv's position (advocacy, not a holding).
→ Confirm-shaming labels, asymmetric visual weight, loss-framing on the cancellation path, information
overload as distraction. **Post-BGH I ZR 200/25, every one of these on a § 312k confirmation page is now
flatly unlawful, not merely criticised.**

### C6. vzbv on the Digital Fairness Act

Press release 23.10.2025 + position paper. Demands, verbatim: *"Manipulative Designelemente, die Verhalten
oder Entscheidungen von Verbraucher:innen erzwingen, erschweren oder manipulieren, müssen … **grundsätzlich
verboten** werden. Dazu gehören zum Beispiel **lange Klickpfade**, unaufgefordertes Hinzufügen von Produkten
in den Warenkorb oder **wiederholte Aufforderungen etwas zu tun, trotz bereits getroffener Entscheidung.**
**Suchtfördernde Elemente wie endloses Scrollen, Autoplay oder Gamification sollten per Default-Einstellung
ausgeschaltet sein.**"* And: *"Personalisierung unter Ausnutzung persönlicher oder situativer Schwächen darf
… nicht erlaubt sein. Dazu gehört etwa die Anpassung von Angeboten aufgrund von **Suchtneigung,
Impulsivität oder Angst**, sowie **situativen Not- oder Zwangslagen**."*
https://www.vzbv.de/pressemitteilungen/digital-fairness-act-die-eu-verbraucherrechte-brauchen-ein-update
**Confidence: strong** as a record of vzbv's position. **DFA legislative status not verified** — treat as
direction of travel, not current law.
→ Two named targets are things a study app is tempted to build: **Gamification** (vzbv wants it off by
default) and **re-asking after a "no"**. The second is **already actionable** under existing law — it
appears verbatim in DSA recital 67 and maps onto `§ 7 Abs. 1 S. 2 UWG` and Anhang Nr. 26.

---

## D. Consent design and manipulative UI in the German courts

### D1. BGH, 28.05.2020 – I ZR 7/16 ("Cookie-Einwilligung II")

Consent via a **pre-ticked checkbox** the user must un-tick does not satisfy the consent requirement.
GRUR 2020, 891 = NJW 2020, 2540. Follows CJEU C-673/17 (Planet49).

The dark-pattern strand later relied on by other courts: at **Rn. 33** the decisive question is *"von
welchen Informationen der Nutzer aufgrund der **Gestaltung** der Einwilligungserklärung 'regelmäßig'
Kenntnis nehmen wird"*; at **Rn. 37**, where two options get visually different treatment, *"erscheint es
daher naheliegend, dass hierdurch das Wahlrecht der Webseitenbesucher beeinflusst werden soll"*.
https://dejure.org/2020,12443 **Confidence: strong** on existence/holding; the paragraph quotations are
**second-hand from citing judgments**, not read in the BGH original.
→ The *"regelmäßig Kenntnis nehmen"* test is a **design test, not a disclosure test**. Formally correct text
that the layout ensures nobody reads does not produce valid consent.

### D2. Lower courts — a consistent anti-nudging line

- **LG Rostock, 15.09.2020 – 3 O 762/19** — pre-selected consent fails; *"steht fest, dass die durch die
  Beklagte gewählte **Opt-Out-Variante** dazu nicht geeignet ist."*
- **LG Köln, 04.05.2023 – 33 O 311/22** → **OLG Köln, 19.01.2024 – 6 U 80/23** — cookie banner, *"Irreführung
  und Intransparenz"*; OLG partly amended in the claimant's favour.
- **VG Hannover, 19.03.2025 – 10 A 5385/22** — the crispest German statement of the rule: *"Jedenfalls darf
  aber das Cookie-Banner nicht so gestaltet sein, dass es den Nutzer **gezielt zur Abgabe der Einwilligung
  hinlenkt und von der Ablehnung der Cookies abhält**."*
- **LG München I, 29.11.2022 – 33 O 14776/19** — applies the Rn. 37 asymmetric-design reasoning.
- **LG Berlin, 24.08.2023 – 16 O 420/19** — LinkedIn may not ignore the browser's Do-Not-Track setting.

All retrieved through dejure's citation network for I ZR 7/16. **Confidence: strong** on Gericht/Az/date and
the VG Hannover quotation; read as citator entries with quoted passages, **not full judgments**.
→ The operative rule is **symmetry**: accept and reject equally easy, equally prominent, at the same level.
Stated for cookie banners, but VG Hannover's formulation is generic enough to transplant to any consent
surface — including a notifications opt-in.

### D3. Bundeskartellamt / Meta — forced consent as abuse of dominance

**Bundeskartellamt, Beschluss 06.02.2019, B6-22/16.** Mundt: *"Ein **obligatorisches Häkchen** bei der
Zustimmung … stellt angesichts der überragenden Marktmacht keine ausreichende Grundlage dar. … **Von einer
freiwilligen Einwilligung … kann in einer solchen Zwangssituation des Nutzers keine Rede sein.**"*

**BGH, Beschluss 23.06.2020 – KVR 69/19** set aside the OLG Düsseldorf suspension: *"Entscheidend ist
vielmehr, dass Nutzungsbedingungen missbräuchlich sind, **die den privaten Facebook-Nutzern keine
Wahlmöglichkeit lassen**"*; the lack of choice impairs *"**persönliche Autonomie**"* and, given
**"Lock-in-Effekte"**, constitutes *"eine kartellrechtlich relevante **Ausbeutung**"*. The BGH expressly
declined to rest on the GDPR question.
BGH Pressemitteilung Nr. 080/2020 **Confidence: strong** (official, verbatim). Note: **interim** ruling on
suspensive effect, not a final merits judgment.
→ **Almost certainly does not bind a study platform** — the whole analysis presupposes a
*marktbeherrschende Stellung* under `§ 19 GWB`. Relevance is doctrinal: the same "no genuine choice"
vocabulary reappears in the `§ 4a Abs. 1 S. 3 UWG` *Machtposition* test, **which has no dominance
threshold.**

### D4. DSA Art. 25 — likely out of scope, but note the standard

DSA recital 67 names, in official EU legislative language: choices presented *"in einer nicht neutralen
Weise"* with some options *"stärker hervorgehoben"*; *"einen Nutzer **wiederholt aufzufordern, eine Auswahl
zu treffen, wenn diese Auswahl bereits getroffen wurde**"*; *"das Verfahren zur **Stornierung eines Dienstes
erheblich umständlicher** zu gestalten als die entsprechende Anmeldung"*; and *"**Standardeinstellungen, die
sehr schwer zu ändern sind**"*.

German enforcement: `§ 12 Abs. 1 DDG` designates the **Bundesnetzagentur** under Art. 49(1) DSA; `§ 12
Abs. 2 DDG` gives the Bundeszentrale für Kinder- und Jugendmedienschutz competence for Art. 14(3) and
Art. 28(1).
https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32022R2065 · https://www.gesetze-im-internet.de/ddg/__12.html
**Confidence: strong** for recital 67 and § 12 DDG (both verbatim). **Art. 25's operative text was not
retrieved** — verify before relying on it.
→ A study platform is a hosting service but probably **not** an "Online-Plattform" under Art. 3 lit. i),
which requires storing *and disseminating information to the public* at a recipient's request. Own-published
course content does not. But recital 67's three named patterns are worth internalising regardless — and the
middle one is now separately **hard law** in Germany via § 312k BGB + BGH I ZR 200/25.

---

## E. Minors vs adults — and whether adult students can be "vulnerable"

### E1. The minor-specific regimes do not bind a 19–25 audience

`§ 1 Abs. 1 JuSchG`: **Kinder** <14, **Jugendliche** 14–17.
`§ 6 Abs. 2 JMStV`: advertising must not contain *"**direkte Aufrufe zum Kaufen** … an Kinder oder
Jugendliche …, die deren **Unerfahrenheit und Leichtgläubigkeit ausnutzen**"*, must not urge them to get
parents to buy, must not exploit *"das besondere Vertrauen … zu Eltern, Lehrern"*, must not show them in
dangerous situations. https://www.gesetze-bayern.de/Content/Document/JMStV-6
UWG Anhang **Nr. 28**: *"die … **unmittelbare Aufforderung an Kinder**, selbst die beworbene Ware zu
erwerben …"*
**Confidence: strong.**

Two caveats:
1. **The user base is what it actually is, not what the ToS says.** DSA recital 71: a platform may be
   regarded as accessible to minors *"wenn ihre allgemeinen Geschäftsbedingungen es Minderjährigen
   gestatten, den Dienst zu nutzen, wenn ihr Dienst sich an Minderjährige richtet oder überwiegend von
   Minderjährigen genutzt wird oder wenn dem Anbieter in anderer Weise bekannt ist, dass einige seiner
   Nutzer minderjährig sind."* Abitur students, under-18 Erstsemester or dual-study students would engage
   the minor-protection layer.
2. vzbv's DFA position asks for a **two-tier** model — addictive design default-off for everyone, and
   *"Minderjährige sollten diese grundsätzlich nicht anstellen können"*. If adopted, "our users are adults"
   becomes a partial defence rather than a full one.

### E2. Can adult students be "vulnerable consumers"?

`§ 3 Abs. 4 S. 2 UWG` / `Art. 5(3) UCPD` trigger on *geistige oder körperliche Beeinträchtigungen*, **Alter**,
or *Leichtgläubigkeit*. **Assessment (flagged as assessment, not authority): a weak fit.** "Alter" is
understood to target the very young and very old; adult university students are not an obvious *"eindeutig
identifizierbare Gruppe"* particularly vulnerable by reason of age. **No German case law applying § 3 Abs. 4
to young adults was found, either way. Unsettled and weakly supported.**

**The stronger route is `§ 4a Abs. 2`, not `§ 3 Abs. 4`.** `Abs. 2 S. 2` lists *"geistige und körperliche
Beeinträchtigungen, das Alter, die **geschäftliche Unerfahrenheit**, die Leichtgläubigkeit, die **Angst** und
die **Zwangslage** von Verbrauchern"* — **a situational test applied to the concrete practice, not a
group-vulnerability test.** And `Abs. 2 Nr. 3` targets *"die **bewusste Ausnutzung** von konkreten
Unglückssituationen oder Umständen von solcher Schwere, dass sie das **Urteilsvermögen** … beeinträchtigen,
um dessen Entscheidung zu beeinflussen."*
**Confidence: strong** on the text; **contested/untested** as applied to exam stress.
→ The realistic exposure is not "students are a vulnerable group" but "**this specific campaign deliberately
exploited a specific pressure situation**". A generic "keep studying" nudge is fine. A campaign that detects
an approaching exam date and uses that pressure to sell — *"3 Tage bis zur Klausur, jetzt Premium
freischalten, Angebot endet in 2h"* — combines all three things § 4a Abs. 2 names: exploitation of an
*Angst/Zwangslage* (S. 2), timing chosen for maximum pressure (Nr. 1), and a deadline that, if fabricated, is
separately per se unlawful under Anhang Nr. 7.

### E3. Which rules distinguish adults from minors

- **Minor-specific:** JuSchG, JMStV § 6, UWG Anhang Nr. 28, DSA Art. 28 + recital 71, § 12 Abs. 2 DDG.
- **Age-neutral:** the whole of §§ 3, 4a, 5, 5a, 7 UWG, the entire Anhang except Nr. 28, § 312k BGB, DSA
  Art. 25/recital 67. **None has an adult carve-out.** § 312k applies to every *Verbraucher*; § 7 protects
  every *Marktteilnehmer*; the BGH's Kündigungsbutton and Werbung case law was made in adult-consumer cases.
**Confidence: strong.**
→ **"Our users are adults" is not a defence to anything in sections A–D.** It is a defence only to the
minor-specific layer.

---

## Consolidated risk ranking

| # | Risk | Governing rule | Confidence | Severity |
|---|---|---|---|---|
| 1 | Retention offer / "pause instead?" / cross-link on the cancellation confirmation page | § 312k Abs. 2 S. 3 BGB; **BGH 16.07.2026 – I ZR 200/25** | Strong | Per se unlawful. Injunction + § 312k Abs. 6 |
| 2 | No Kündigungsbutton because "it's a one-time payment" | § 312k Abs. 1 S. 1; **BGH 22.05.2025 – I ZR 161/24** | Strong | § 312k Abs. 6 on every affected contract |
| 3 | Cancellation behind a login wall | § 312k Abs. 2 S. 3 + S. 4; LG Köln 33 O 355/22; KG 5 UKl 10/25 — **BGH I ZR 272/25 & 275/25 pending, 05.11.2026** | Lower courts strong; BGH **unsettled** | Same; resolution imminent |
| 4 | Re-engagement / streak / survey pushes without separate express marketing consent | § 7 Abs. 2 Nr. 2, § 7 Abs. 1 S. 2 UWG; Anhang Nr. 26; **BGH VI ZR 225/17**, **VI ZR 134/15**, CJEU **C-102/20** | Push classification **unsettled**; Werbung doctrine **strong** | Abmahnung, injunction, §§ 823/1004 BGB claims |
| 5 | Fabricated countdown / "only X seats left" | **Anhang Nr. 7** (and Nr. 5) | Strong | Per se unlawful, no balancing |
| 6 | Cancellation button buried among other footer links | § 312k Abs. 2 S. 4; **OLG München 6 U 4336/23 e** | Strong | § 312k Abs. 6 |
| 7 | Asymmetric consent UI | BGH I ZR 7/16 Rn. 33/37; LG Rostock; LG/OLG Köln; VG Hannover | Strong for consent surfaces; transplant **moderate** | Injunction; invalid consent |
| 8 | Re-prompting after the user declined | § 7 Abs. 1 S. 2; Anhang Nr. 26; DSA rec. 67 | Moderate | Abmahnung |
| 9 | Exam-stress-timed upsell exploiting Angst/Zwangslage | § 4a Abs. 1 + Abs. 2 Nr. 1, Nr. 3, S. 2 | **Contested/untested** | Injunction if a court bites |
| 10 | Gamification / streaks as such | No binding German rule today; vzbv DFA demand only | Weak (advocacy) | Future regulatory risk |
| 11 | Minor-protection regimes | Keyed to under-18s | Strong that they don't apply | Nil — **unless** ToS or actual usage admits minors |
| 12 | Bundeskartellamt-style forced consent | § 19 GWB — requires dominance | Strong that it doesn't apply | Nil |

---

## Verification gaps

- **Official Leitsätze not retrieved verbatim** for BGH VI ZR 225/17, VI ZR 134/15, I ZR 25/19, I ZR 7/16,
  I ZR 161/24. Existence, court, date, Az and substance verified from multiple sources including official
  ones; exact headnote wording not. (The BGH's old `juris.bundesgerichtshof.de/cgi-bin/` endpoint now returns
  a generic page; dejure's outbound link service 403s non-browser clients.)
- **LG Hildesheim (Digistore24, 25.03.2024): Aktenzeichen not verified.** Same for **LG München I,
  10.10.2023** and **LG Frankfurt a. M., 23.10.2025** — vzbv hosts these as image-only scans. **Do not cite
  with an Az you have not confirmed.**
- **One-day discrepancy:** BGH PM 133/2026 dates KG – 5 U 6/25 to **11.11.2025**; dejure says **12.11.2025**.
- **DSA Art. 25 operative text not retrieved** — only recital 67.
- **Digital Fairness Act legislative status not verified.**
- **No German case law on app push notifications found** — negative finding from direct primary-source
  interrogation, not exhaustive keyword search.
- **Cookie-banner lower-court decisions in D2** read as citator entries with quoted passages, not full
  judgments.
