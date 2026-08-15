# Dokum — What's new & QA checklist: the interactive viewer

Covers everything built for spec [#63](https://github.com/dokumtastisch/dokum/issues/63) except **video** (#76–#79), which is not built yet.

Test against **dev** (`elnupcpwhvfbmbpcbwrc`) with `npm run dev` on <http://localhost:3000>.
Older, foundation-level cases (auth, proxy, admin CRUD, uploads) stay in [TEST_CASES.md](TEST_CASES.md) — this document does not repeat them.

This is a **coarse** pass: one check per behaviour that matters, not per feature. If a block is green, the block is done.

---

## Part 1 — What's new

### For students

| | Before | Now |
|---|---|---|
| **A published document** | a flat PNG | live content — real selectable text, crisp formulas, images (#66, #67) |
| **Worked examples** | read the author's numbers | type your own into the inputs; every dependent output recomputes live (#68) |
| **Reaching a document** | only inside the Unit accordion | every Dokument has its own URL, `/dokumente/<id>` (#69) |
| **Following a link** | didn't exist | opens **on top** of what you're reading; the source page stays mounted, so typed values survive (#70) |
| **Links** | didn't exist | inline labelled chips to a Kurs, Einheit, Dokument or a Sprungmarke inside one (#72, #73) |
| **A link you can't reach** | didn't exist | locked → an unlock card naming the Einheit; deleted/archived → plain text with „ (nicht mehr verfügbar)" (#74) |
| **An archived Kurs** | hidden by app code only | dark at the database level too — RLS (#80) |

Two deliberate product consequences, worth knowing before you look:

- **Paid text is now selectable and copyable.** The watermark is a deterrent, not a lock. That was a decision, not an oversight.
- **A link into an unbought Einheit is a new purchase entry point** — the unlock card reuses the same `UnitPaywall` component as the locked-Einheit page, so the teaser text and price are identical by construction.

### For authors

- **Publishing preserves interactivity.** A draft is published as a JSON snapshot on the Document row (`documents.content`) *and* still writes the PNG — the PNG is the per-document safety net for this release (#65, #66).
- **Re-publishing updates the same Dokument**, so links and bookmarks keep working. „Als neues Dokument" is the one path that mints a new id (#66, #85).
- **Two new toolbar buttons**: „Sprungmarke" marks the block the cursor is in and asks for a name; „Link einfügen" opens a picker over the tree of **published** Kurse → Einheiten → Dokumente, with each document's Sprungmarken listed beneath it (#71, #72).
- **Deleting a linked Dokument now warns you first**, and the scan also sees links sitting in unpublished drafts (#75).
- Images in a published document are copied to fresh document-image rows at publish and served through the existing entitlement-gated route — no new access path (#66).

### Not in this build

Video (#77–#79) and its bunny.net provisioning (#76). The legacy PDF/image world is **still visible on dev** — removing it is #82, which is deliberately gated behind the prod cutover #81.

---

## Part 2 — Setup

**Accounts** (dev):

| Account | Role | Sees |
|---|---|---|
| `admin@dokum.at` | admin | everything, incl. archived |
| `testuser@dokum.at` | student | `TestUnit` ✅ · `PR102 QA – Gesperrte Einheit` ❌ (→ locked card) · a unit inside the archived Kurs ✅-but-dark (→ archive check) |
| `testuser2@dokum.at` | student | nothing — use for paywall checks |

**Main fixture** — published Kurs `publishTestKurs` → `TestUnit`:

```
/kurse/8e1b27e7-c357-4bfa-bf0a-12d171a87577/units/503d3a90-8f7c-4cdb-92d6-ccfdd55127d8?openTask=fee789d2-b5a5-429c-b4ee-4ccd8a9f2f90
```

| Document | What it's for |
|---|---|
| `PR89 QA – Interaktive Eingaben` | the live inputs — this is the one to type into |
| `PR89 QA – Zweites Dokument (gleiche Feld-IDs)` | same field ids as the above; proves two documents don't bleed into each other |
| `PR97 QA – Linkquelle` / `PR97 QA – Sprungziel` | link chips and Sprungmarken |
| `PR102 QA – Linkquelle #74` | links to a locked and to an archived target |
| `PR69 QA – Interaktiv ohne Snapshot` | interactive with no JSON → must fall back to the PNG |
| `PR69 QA – Snapshot mit unbekannter Version` / `… unbekanntem Knoten` | must fail honestly / fall back, never render half a document |
| `testPdf`, `Bild`, `PR69 QA – Bildsammlung` | the legacy branches, still expected to work |

**Locked target:** Kurs `PR102 QA – Verkaufskurs` → `PR102 QA – Gesperrte Einheit`.
**Archived Kurs:** `testtabkurs` (`published = false`).

---

## Part 3 — The checklist

### A · An interactive document renders live — *as `testuser`*

- [ ] Open the Unit page. `PR89 QA – Interaktive Eingaben` renders as **text you can select with the mouse**, not an image.
- [ ] Formulas are sharp when you zoom to 200 %, and each formula appears **once** (not doubled).
- [ ] Images inside the document load without a second login or a broken-image icon.
- [ ] The watermark is visible but does not block reading or selecting.

### B · Inputs recompute

- [ ] Type a new number into an input. Every output that depends on it updates immediately.
- [ ] The document's own text and structure cannot be edited — only the inputs.
- [ ] It's visually obvious which parts are yours to change.
- [ ] Type into `PR89 QA – Interaktive Eingaben`, then into `PR89 QA – Zweites Dokument`: the two do **not** affect each other despite sharing field ids.

### C · Document URLs and the overlay

- [ ] Type a value into a document on the Unit page, then click „Einzelansicht" on a **different** document → it opens **over** the page; the Unit page is still there behind it, **with your typed value intact**.
- [ ] Browser **Back**, **Escape**, the **backdrop** and „Schließen ✕" all close it the same way, and land back on the Unit page with `?openTask=` intact.
- [ ] Paste `/dokumente/<id>` into a **fresh tab** → renders **full-page**, no overlay, correct tab title.
- [ ] On a phone (a real one, not a resized window) the overlay is a full-screen sheet and the close button is reachable.
- [ ] A bogus id, e.g. `/dokumente/00000000-0000-4000-8000-000000000000`, shows the 404 page.

### D · Link chips

- [ ] In `PR97 QA – Linkquelle`, links render as inline labelled chips that read naturally inside the sentence, with an icon showing whether they point at a Kurs, Einheit, Dokument or Sprungmarke.
- [ ] Clicking a Dokument chip opens the target as an overlay; your typed values in the source are still there when you come back.
- [ ] A **Sprungmarke** chip scrolls to the marked spot — including when the target is the document already on screen.
- [ ] Nothing happens on hover. Touch and desktop behave identically.

### E · Links you can't reach — *as `testuser`*

- [ ] In `PR102 QA – Linkquelle #74`, the chip pointing into `PR102 QA – Gesperrte Einheit` stays **clickable** and opens a card naming that Einheit, with its teaser text and an unlock button — the same words and price as the Einheit page itself.
- [ ] Closing that card leaves you exactly where you were; the URL never changed.
- [ ] The chip pointing at archived/deleted content is **plain text** with a quiet „ (nicht mehr verfügbar)" — the sentence still reads.
- [ ] Neither case reveals the target's content or title beyond what's on the card.

### F · Fallbacks — nothing renders half-broken

- [ ] `PR69 QA – Interaktiv ohne Snapshot` shows its **PNG**, not a blank page.
- [ ] `PR69 QA – Snapshot mit unbekannter Version` and `… mit unbekanntem Knoten` fall back or fail **honestly** — never a document silently missing a section.
- [ ] The legacy documents (`testPdf`, `Bild`, `PR69 QA – Bildsammlung`) still open, both inline and as an overlay.

### G · Publishing — *as `admin`, in `/admin/editor`*

- [ ] Publish a draft containing text, a formula, an image and at least one input/output pair → open it as a student: it is **interactive**, not a picture.
- [ ] Re-publish the same draft → it updates the **same** Dokument (same URL), and its title is not silently overwritten.
- [ ] „Als neues Dokument" creates a second Dokument and leaves the first one intact.
- [ ] The published document's images still load after the draft has been edited again.
- [ ] The admin file-upload field no longer appears for interactive documents.

### H · Sprungmarke & link authoring — *as `admin`*

- [ ] „Sprungmarke" works on a **text, a formula and an image block** and asks for a name; the badge sits inside its own block.
- [ ] Copy/paste or duplicate a marked block → the copy gets a **new** Sprungmarke, not the same one.
- [ ] Rename a Sprungmarke, re-publish → an existing link to it **still lands in the right place**.
- [ ] „Link einfügen" offers only **published** Kurse/Einheiten/Dokumente, with Sprungmarken listed under their document by the names you gave them.
- [ ] With text selected, the selection becomes the chip label; with nothing selected, the target's own name does.

### I · Backlink warning — *as `admin`*

- [ ] Delete a Dokument that something links to → you are warned **before** it happens, and the warning names what points at it.
- [ ] The warning also catches a link that only exists in an **unpublished draft**.
- [ ] „Als neues Dokument" warns when it would orphan inbound links.
- [ ] Cancelling the warning leaves everything untouched.

### J · Archive & access — *as `testuser`, then `admin`*

- [ ] `testuser` cannot reach anything under the archived Kurs `testtabkurs` — **including the Einheit they bought**. That is the intended archive semantics, not a bug.
- [ ] `admin` still sees and can open the archived Kurs, its documents and its files.
- [ ] `testuser2` (no entitlements) reaches nothing paid anywhere, and the locked Einheit page shows its teaser text.

---

## Part 4 — Known, and deliberately not fixed here

| | Status |
|---|---|
| **Video** (#76–#79) | not built — out of scope for this pass |
| **Legacy PDF/image surfaces still visible** | expected; removal is #82, gated behind the prod cutover #81 |
| **Prod migrations** | `add_document_content.sql` and `add_rls_published_conjunct.sql` are **not confirmed applied to prod** — MCP can't reach prod. Hard gate on #81, irrelevant to this dev pass |
| **Datenschutzerklärung** (#61) | still declares Font Awesome + a Google Fonts CDN the app never calls. Open, unrelated to video |
| **Orphaned storage** | replacing a document leaves the old file in Supabase storage. Noted at the bottom of TEST_CASES.md, never filed as an issue |
| **Copyable paid text / unlock card as a sales surface** | product sign-offs, not defects — see Part 1 |

---

## If something fails

File it against the ticket it belongs to (the table in Part 1 maps behaviour → ticket), or as a new issue with the `bug` label. Per-ticket QA records from the automated passes live in the issue comments — #70 in particular has a 15-row overlay checklist with a recorded Playwright run, if you want more detail on any block above.
