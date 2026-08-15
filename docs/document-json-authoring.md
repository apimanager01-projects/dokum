# Document JSON — authoring guide (schema v1.1)

The LaTeX editor at `/admin/editor` can swallow a whole document at once:
toolbar → **Add JSON** → modal **„JSON importieren"** → paste → **„Importieren"**.
The checkbox „Bestehenden Editor-Inhalt ersetzen" decides whether the paste
replaces the document or is appended to it.

What the modal accepts is not obvious from the modal, which is what this file
fixes. It has three parts:

1. **[The prompt block](#1-the-prompt-block)** — paste it into an LLM, on its own,
   and it produces importable JSON. It is deliberately self-contained: none of
   the rest of this file has to travel with it.
2. **[The schema reference](#2-schema-reference)** — every block type, every inline
   node, the variable/field model, required vs optional.
3. **[Two worked examples](#3-worked-examples)** — complete documents you can paste
   into the modal as-is.

This file describes **schema version 1.1 only** — the version the editor writes
and the student viewer reads. Older snapshots still load (the read boundary
upgrades them), but nothing here describes them, on purpose: a guide that shows
an older shape teaches an LLM to emit it.

> **Images and links are out of scope** — see
> [Why images and links are excluded](#why-images-and-links-are-excluded). Add them
> in the editor *after* importing.

---

## 1. The prompt block

Copy everything inside the box, replace the `TASK:` line, paste into an LLM,
then paste the answer into the „JSON importieren" modal.

<!-- prompt-block -->
```text
You are writing ONE document for the Dokum LaTeX editor, as a single JSON
object that the editor's JSON import accepts. Output ONLY that JSON object:
no markdown fences, no comments (JSON has none), nothing before or after it.

TASK: <describe the document: topic, level, and which numbers the student
should be able to change>

Write all visible text in German unless the task above says otherwise.

=== TOP LEVEL ===

  { "version": "1.1", "meta": {...}, "variables": [...], "content": [...] }

- "version" must be exactly "1.1".
- "variables" and "content" are REQUIRED, even when empty ([]).
- "meta" is optional: { "title": "...", "term": "..." }. The import ignores it.
- Do not emit a top-level "library" key.
- The parser is STRICT: ONE unknown key anywhere rejects the WHOLE document,
  and nothing is imported. Emit only the keys listed below. Key order is free.

=== NEVER EMIT: IMAGES AND LINKS ===

Do NOT emit an image block ({ "type": "image", "imageId": ... }) and do NOT
emit a link node ({ "type": "link", "target": ... }). Both are addressed by
ids that only exist on the server: an image block carries the id of a row in
the "editor_images" table, minted when a human uploads the file, and a link
carries the published primary key of a Kurs, an Einheit or a Dokument. You
cannot know either one. An id you invent passes the schema and imports without
any error, and only THEN renders as a broken image or a dead link.

Where the author wants a picture or a link, write an ordinary paragraph
instead, and end your answer's JSON there. The author inserts images and links
in the editor after importing, with the „Bild einfügen" and „Link" buttons.

=== CONTENT: BLOCK TYPES ===

Every entry of "content" is one block. Five types are available:

  { "type": "paragraph", "children": [ ...inline... ] }
  { "type": "heading", "level": 1, "children": [ ...inline... ] }
  { "type": "list", "ordered": false, "items": [ [ ...inline... ], ... ] }
  { "type": "formula", "latex": "...", "caption": { "children": [...] } }
  { "type": "code", "text": "line 1\nline 2" }

- "level" is 1 or 2 ONLY. Anything else is silently clamped to 2.
- "ordered": true renders <ol>, false or omitted renders <ul>.
- "caption" is optional on a formula; it may also be a plain string.
- Every block may carry an optional "style" (see below) and an optional
  "anchor" (Sprungmarke, see below).

=== CONTENT: INLINE NODES ===

Inside "children" (and inside a list item) each entry is one of:

  "plain text"                                  a string, or a number
  { "text": "styled text", "style": {...} }     "style" optional
  { "br": true }                                a line break
  { "field": "Zinssatz" }                       a field pill, by variable name
  { "fieldId": "v_zins" }                       a field pill, by variable id
  { "children": [ ...inline... ], "style": {} } a styled group

- "field" matches a variable's "name", case-insensitively and trimmed. A name
  that matches no variable renders as a red "[NOT FOUND: ...]" in the document,
  so every field you reference must be declared in "variables".
- Field pills carry no style of their own; they inherit from the group.

"style" accepts exactly these keys, all optional:

  "color": "#00338d"        "backgroundColor": "#fff3bf"
  "fontSize": 18            (a number is px; a string is used verbatim)
  "bold": true              "italic": true
  "underline": true         "strike": true
  "align": "center"         (paragraph/heading level)

Booleans are only ever true — omit them instead of writing false.

=== VARIABLES: THE FIELD MODEL ===

"variables" declares every interactive number in the document. Each entry:

  { "id": "v_zins", "type": "input", "name": "Zinssatz",
    "refType": "static", "value": 0.05 }

  { "id": "v_bar", "type": "output", "name": "Barwert", "expr": "" }

- "type" is REQUIRED: "input" (a number the student may change) or "output"
  (a computed value the student cannot change).
- "id" is your handle for the variable; keep it ASCII
  ([A-Za-z0-9_-:.] — other characters are replaced by "_"). Give every
  variable an explicit id.
- "name" must be UNIQUE across the document, case-insensitively; a duplicate
  aborts the whole import. To use a name inside an expression it must also be
  a plain ASCII identifier: letters, digits and "_", not starting with a digit
  (so "Zinssatz" and "kapital_2" work, "Zinssatz p.a." and "Höhe" do not).
- Input, static value: "refType": "static" plus "value". Write the value as a
  JSON number or as a dot-decimal string ("0.05"). A comma is NOT a decimal
  separator here.
- Input, reference to another field (advanced, usually not needed):
  "refType": "ref" plus "refName": "<name of the target variable>".
- Output: "expr" is the expression. Write "" to let the editor derive it from
  the surrounding line (see below).
- Do NOT emit "latexValue", "referenceClone" or "sourceOutputName". The editor
  writes those itself.

A variable that is never placed inline still exists — it lives in the hidden
field store and shows up in the variables sidebar. Place it in the text with
{ "field": "<name>" } to make it visible.

=== EXPRESSIONS ===

Expressions are evaluated by a small built-in parser (there is no JavaScript
eval), so the grammar is exactly:

- numbers (1000, 0.05, .5, 1e3), + - * / and ** for powers, unary +/-,
  parentheses;
- functions sqrt abs pow sin cos tan log (base 10) ln (natural) min max round
  floor ceil;
- constants pi and e;
- variable NAMES, which are replaced by the referenced variable's value.

A LaTeX-flavoured expression is normalised first, so \frac{a}{b}, \sqrt{x},
\cdot, \times, \div, ^ and \pi are all understood inside "expr" too.

Anything the parser cannot read yields no value, and the pill shows „Err".
Write (-2)**2, never -2**2 — the latter is an error by design.

=== OUTPUTS WITH AN EMPTY "expr" ===

An output whose "expr" is "" gets its expression from where it is used:

1. In a TEXT line: the expression is everything between the nearest "=" before
   the pill and the last ":" or "=" before that (or the start of the line).
   So a paragraph reading
       "Netto: " {field Betrag} " * " {field Faktor} " = " {field Netto}
   computes Netto = Betrag * Faktor.

2. In a FORMULA: put [output:<name>] where the result belongs, and
   [input:<name>] wherever another variable's value belongs. The formula line
   is the expression, split at "=". Example:
       "latex": "\\begin{aligned}B &= \\frac{[input:Zahlung]}{(1 + [input:Zins])^{[input:Jahre]}} = [output:B]\\end{aligned}"
   [input:x] is ALWAYS a read; only [output:x] computes and stores a value.

Give each output exactly ONE place that computes it.

=== LATEX IN JSON ===

"latex" holds LaTeX inside a JSON string, so every backslash must be doubled:
\frac becomes \\frac, \begin{aligned} becomes \\begin{aligned}. This is the
single most common reason a generated document fails to import.

=== SPRUNGMARKEN (JUMP TARGETS) ===

Any block may carry an anchor another document can link to:

  { "type": "heading", "level": 1, "children": [...],
    "anchor": { "id": "anc_barwert", "label": "Barwert" } }

- Both "id" and "label" are required inside "anchor".
- "id" is an OPAQUE, non-empty string. No format is enforced; use a short
  ASCII token like "anc_<topic>". It must be UNIQUE within the document — two
  blocks holding one id is a broken document.
- Never derive an id from the heading text, the position or the content, and
  never change one afterwards: links stored elsewhere point at that exact id.
- "label" is free text; it is what a link picker shows. Keep it short.

Mark the few blocks worth linking to (major sections, a key formula), not
every block.

=== BEFORE YOU ANSWER, CHECK ===

- version is "1.1"; "variables" and "content" are both present.
- No key that is not listed above; no image block; no link node.
- Every { "field": ... } names a declared variable; names are unique.
- Every backslash inside "latex" is doubled.
- Every anchor id is unique; every anchor has an "id" and a "label".
- The whole answer is one JSON object and parses as JSON.

EXAMPLE OUTPUT (this document imports as-is):

{
  "version": "1.1",
  "meta": { "title": "Einfache Verzinsung" },
  "variables": [
    { "id": "v_kapital", "type": "input", "name": "Kapital", "refType": "static", "value": 2000 },
    { "id": "v_zins", "type": "input", "name": "Zinssatz", "refType": "static", "value": 0.04 },
    { "id": "v_zinsen", "type": "output", "name": "Zinsen", "expr": "Kapital * Zinssatz" }
  ],
  "content": [
    {
      "type": "heading",
      "level": 1,
      "children": [{ "text": "Einfache Verzinsung", "style": { "bold": true } }],
      "anchor": { "id": "anc_einfache_verzinsung", "label": "Einfache Verzinsung" }
    },
    {
      "type": "paragraph",
      "children": [
        "Ein Kapital von ",
        { "field": "Kapital" },
        " EUR wird mit ",
        { "field": "Zinssatz" },
        " verzinst."
      ]
    },
    {
      "type": "formula",
      "latex": "\\begin{aligned}Z &= [input:Kapital] \\cdot [input:Zinssatz] = [output:Zinsen]\\end{aligned}",
      "caption": "Zinsen eines Jahres"
    },
    {
      "type": "paragraph",
      "children": [
        { "text": "Ergebnis: ", "style": { "bold": true } },
        { "field": "Zinsen" },
        " EUR"
      ]
    }
  ]
}
```

---

## 2. Schema reference

The schema lives in [`src/lib/editor/document-json.ts`](../src/lib/editor/document-json.ts);
the read boundary that every pasted document passes through is `readDocumentJson`
in [`src/lib/editor/document-version.ts`](../src/lib/editor/document-version.ts).
Everything below is Zod `strictObject`: **an unknown key anywhere rejects the
entire document**, and the modal imports nothing.

### Top level

| Key | Required | Type | Notes |
|-----|----------|------|-------|
| `version` | yes | `"1.1"` | Exact literal. A different value is refused with „Nicht unterstützte Schema-Version". |
| `variables` | yes | array | May be `[]`, but the key must be present. |
| `content` | yes | array | May be `[]`, but the key must be present. |
| `meta` | no | `{ title?, term? }` | Ignored by the JSON import (the draft title lives in the DB, the Term field only reloads with a draft). |
| `library` | no | `string[]` | The formula-library sidebar list. Authoritative when present; omit it and the editor derives the library from the formula blocks instead. |

### Blocks

Every entry of `content` is one of these. All of them additionally accept the
optional `style` and `anchor` keys.

| `type` | Keys | Renders as |
|--------|------|------------|
| `paragraph` | `children` (inline array) *or* `text` | `<p>` |
| `heading` | `level` (1 or 2), `children` *or* `text` | `<h1>` / `<h2>` — any other level is clamped into that range |
| `list` | `ordered` (bool), `items` | `<ul>` / `<ol>`; each item is an inline array, or `{ children }` / `{ text }` |
| `formula` | `latex` (alias: `rawLatex`), `caption`, `library` (bool) | MathJax-rendered formula block; `caption` is a string or `{ children }` / `{ text }` |
| `code` | `text` | `<pre>` |
| `image` | `imageId`, `alt` | **out of scope — do not author by hand**, see below |

`library: false` on a formula keeps it out of the formula-library sidebar. It
is only consulted when the document has no top-level `library` array.

### Inline nodes

| Shape | Meaning |
|-------|---------|
| `"text"` or `42` | Plain text |
| `{ text, style? }` | Styled text run |
| `{ br: true }` or `{ type: "br" }` | Line break |
| `{ field: "Name" }` | Field pill, resolved by variable name (trimmed, case-insensitive) |
| `{ fieldId: "v_x" }` | Field pill, resolved by the variable's `id` |
| `{ children: [...], style? }` | Styled group; nests |
| `{ type: "link", target, label }` | **out of scope — do not author by hand**, see below |

A `{ field }` / `{ fieldId }` that resolves to nothing renders as a red
`[NOT FOUND: …]` marker in the document. That is the visible symptom of a typo
in a variable name.

### `style`

All keys optional: `color`, `backgroundColor` (alias `highlight`), `fontSize`
(number = px, string = verbatim CSS), `bold`, `italic`, `underline`, `strike`
(alias `strikethrough`), `align`. Booleans are only meaningful as `true`.

### Variables — the field model

| Key | Required | Applies to | Notes |
|-----|----------|------------|-------|
| `type` | **yes** | both | `"input"` or `"output"` |
| `id` | no | both | Your handle; also what `{ fieldId }` matches. Characters outside `A-Za-z0-9_-:.` are replaced by `_`. Missing → derived from `name`, then generated. |
| `name` | no | both | Display name; unique across the document, case-insensitively. Required in practice — `{ field }`, `[input:…]`, `[output:…]` and expression substitution all go by name. |
| `refType` | no | input | `"static"` (default) or `"ref"` |
| `value` | no | input (static) | JSON number or dot-decimal string; read with `parseFloat`. Missing → `0`. |
| `refName` / `ref` | no | input (ref) | Name of the referenced variable |
| `refId` | no | input (ref) | `id` of the referenced variable |
| `expr` | no | output | Expression; `""` means "derive it from the line" |
| `latexValue`, `referenceClone`, `sourceOutputName` | no | — | Editor-maintained round-trip state. **Do not author these.** |

Two names that differ only in case abort the import with „Doppelter
Variablenname im JSON". With „Bestehenden Editor-Inhalt ersetzen" **un**checked,
a name that already exists in the open document aborts it too.

**Display.** A static input shows its raw `value` string verbatim (`0.05` stays
`0.05`). Every computed value — a reference input, an output, a resolved
`[input:…]`/`[output:…]` inside a formula — is formatted German style: decimal
comma, space-grouped thousands, and a magnitude-dependent number of decimals
(0 above 1000, 2 from 10 to 1000, 3 below 10, 4 below 1, trailing zeros
trimmed). A value that cannot be computed shows „Err".

### Expressions

Evaluated by the parser in
[`expression-evaluator.ts`](../src/lib/editor/expression-evaluator.ts) — there
is no `eval` and no `new Function` anywhere (the production CSP forbids both),
so the grammar is closed and exactly this:

- numbers including `.5`, `5.`, `1e3`
- `+ - * / **`, unary `+`/`-`, parentheses
- `sqrt abs pow sin cos tan log ln min max round floor ceil` — `log` is base 10,
  `ln` is natural
- constants `pi`, `e`
- variable names (ASCII identifiers only, longest name substituted first)

Anything else is an error, and an error becomes „Err" rather than an exception.
`-2**2` is deliberately an error (JavaScript parity); write `(-2)**2`.

Before evaluation the string is LaTeX-normalised
([`latex-normalise.ts`](../src/lib/editor/latex-normalise.ts)): `\frac{a}{b}`,
`\sqrt{x}`, `\cdot`, `\times`, `\div`, `\pi`, `^`, `{}` and the alignment noise
of `\begin{aligned} … \end{aligned}` are all handled, so an `expr` may be
written in LaTeX.

**Deriving an output's expression (`expr: ""`).**

- *In a text line* — the expression is the segment between the nearest `=`
  before the output pill and the last `:` or `=` before that one (else the
  start of the block). Field pills in that segment are substituted by their
  values. No `=` before the pill → no expression → „Err".
- *In a formula* — `[output:Name]` marks the calculation target; the expression
  is read out of the raw LaTeX around it (between the last two `=` of the line,
  or before the only `=`). `[input:Name]` is *always* a read, never a write —
  that is what stops a later formula from overwriting an earlier output.

### Sprungmarken

A Sprungmarke is an author-placed jump target another document can link to
([`anchors.ts`](../src/lib/editor/anchors.ts), #71). Any block may carry one:

```
"anchor": { "id": "anc_barwert", "label": "Barwertformel" }
```

| Rule | Why |
|------|-----|
| `id` is a non-empty string; that is the **only** format the schema enforces | It is opaque by design — the editor mints `anc_<base36-time>_<n>`, but nothing parses it |
| `id` must be unique within the document | Two blocks answering to one link is a silently wrong document; the editor's anchor registry re-stamps duplicates it finds |
| `id` is minted once and copied verbatim — never derived from position, heading text or content, never regenerated | Links in other documents store that exact string; changing it breaks them |
| `label` is required (may be empty), and is free text | It is what a link picker and a link chip show; renaming it never touches the id |

A blank `id` is read as *no anchor at all* and the mark is dropped.

### Why images and links are excluded

Both key off ids that only exist server-side:

- an **image block** carries `imageId` — the primary key of a row in the
  `editor_images` table, minted when a file is uploaded through the editor. The
  block deliberately has no `src` field, so a base64 payload cannot be smuggled
  in; a document whose image block carries `src` is refused outright.
- a **link node** carries the published primary key of a Kurs, an Einheit or a
  Dokument (plus, optionally, a Sprungmarke id inside it).

Both are `uuid`-shaped, so an invented one **passes validation and imports
cleanly** — and only then renders as a broken image or a dead link. There is no
value an author or an LLM can write that is correct. Import the text first,
then insert images („Bild einfügen") and links („Link") in the editor, where
both are picked from real data.

### What the boundary rejects

The modal runs `JSON.parse`, then `readDocumentJson`, and nothing else. Every
failure aborts the whole import and leaves the editor untouched:

| Message (German) | Cause |
|------------------|-------|
| „Ungültiges JSON: …" | Not valid JSON — usually a markdown fence or prose left in the paste |
| „Nicht unterstützte Schema-Version — …" | `version` is missing or not a supported literal |
| „… Unbekannte Eigenschaft(en): …" | A key the schema does not know |
| „… Kein gültiger Block-/Inline-Knoten an dieser Stelle." | A block or inline node whose shape matches nothing |
| „Doppelter Variablenname im JSON: …" | Two variables share a name (case-insensitively) |
| „Bild-Blöcke referenzieren gespeicherte Bilder über „imageId" …" | An image block with an embedded `src` |

---

## 3. Worked examples

Both documents below are complete and importable: select the block, paste it
into „JSON importieren", press „Importieren".

### Example 1 — minimal

Text only: a heading, a paragraph, a list. No variables, no formulas.

<!-- example: minimal -->
```json
{
  "version": "1.1",
  "variables": [],
  "content": [
    {
      "type": "heading",
      "level": 1,
      "children": [{ "text": "Barwert: Grundidee" }]
    },
    {
      "type": "paragraph",
      "children": [
        "Der Barwert ist der heutige Wert einer künftigen Zahlung. Die Zahlung wird mit dem Kalkulationszins auf den heutigen Tag abgezinst."
      ]
    },
    {
      "type": "list",
      "ordered": false,
      "items": [
        ["Je später die Zahlung anfällt, desto kleiner ihr Barwert."],
        ["Je höher der Zins, desto kleiner ihr Barwert."]
      ]
    }
  ]
}
```

### Example 2 — formulas, input/output fields and a Sprungmarke

Exercises every in-scope block type, both field types, a manual and two derived
output expressions, styled inline text, and two Sprungmarken.

<!-- example: full -->
```json
{
  "version": "1.1",
  "meta": { "title": "Barwert einer einzelnen Zahlung" },
  "variables": [
    { "id": "v_zahlung", "type": "input", "name": "Zahlung", "refType": "static", "value": 1000 },
    { "id": "v_zinssatz", "type": "input", "name": "Zinssatz", "refType": "static", "value": 0.05 },
    { "id": "v_jahre", "type": "input", "name": "Jahre", "refType": "static", "value": 3 },
    { "id": "v_steuerfaktor", "type": "input", "name": "Steuerfaktor", "refType": "static", "value": 0.75 },
    { "id": "v_diskontfaktor", "type": "output", "name": "Diskontfaktor", "expr": "1 / (1 + Zinssatz) ** Jahre" },
    { "id": "v_barwert", "type": "output", "name": "Barwert", "expr": "" },
    { "id": "v_netto", "type": "output", "name": "NettoZahlung", "expr": "" }
  ],
  "content": [
    {
      "type": "heading",
      "level": 1,
      "children": [{ "text": "Barwert einer einzelnen Zahlung", "style": { "color": "#00338d", "bold": true } }],
      "anchor": { "id": "anc_barwert_start", "label": "Barwert einer einzelnen Zahlung" }
    },
    {
      "type": "paragraph",
      "children": [
        "Eine Zahlung von ",
        { "field": "Zahlung" },
        " EUR fällt in ",
        { "field": "Jahre" },
        " Jahren an. Der Kalkulationszins beträgt ",
        { "fieldId": "v_zinssatz" },
        "."
      ]
    },
    {
      "type": "heading",
      "level": 2,
      "children": [{ "text": "Abzinsung" }]
    },
    {
      "type": "formula",
      "latex": "\\begin{aligned}\\text{Barwert} &= \\frac{[input:Zahlung]}{(1 + [input:Zinssatz])^{[input:Jahre]}} = [output:Barwert]\\end{aligned}",
      "caption": { "children": [{ "text": "Abzinsung über ", "style": { "italic": true } }, { "field": "Jahre" }, { "text": " Jahre", "style": { "italic": true } }] },
      "anchor": { "id": "anc_formel_barwert", "label": "Barwertformel" }
    },
    {
      "type": "paragraph",
      "children": [
        "Der Barwert beträgt ",
        { "field": "Barwert" },
        " EUR."
      ]
    },
    {
      "type": "list",
      "ordered": true,
      "items": [
        ["Zahlung und Zins festlegen."],
        ["Laufzeit in Jahren wählen."],
        ["Barwert ablesen."]
      ]
    },
    {
      "type": "paragraph",
      "children": [
        { "text": "Zwischenwert: ", "style": { "bold": true } },
        "Der Diskontfaktor ist ",
        { "field": "Diskontfaktor" },
        ".",
        { "br": true },
        {
          "children": [
            "Kontrollrechnung: ",
            { "field": "Zahlung" },
            " * ",
            { "field": "Steuerfaktor" },
            " = ",
            { "field": "NettoZahlung" }
          ],
          "style": { "backgroundColor": "#fff3bf" }
        }
      ]
    },
    {
      "type": "code",
      "text": "Barwert = Zahlung / (1 + Zinssatz) ^ Jahre"
    },
    {
      "type": "paragraph",
      "children": [{ "text": "Werte in den Feldern ändern — alle Ergebnisse rechnen sich neu.", "style": { "italic": true, "align": "center" } }]
    }
  ]
}
```

#### What example 2 should look like after importing

Use this as the by-hand check. Pills:

| Field | Shows |
|-------|-------|
| Zahlung, Zinssatz, Jahre, Steuerfaktor | `1000`, `0.05`, `3`, `0.75` — static inputs show their raw value |
| Diskontfaktor | `0,8638` — from the manual `expr`, `1 / 1.05³` |
| Barwert | `863,84` — computed by the formula's `[output:Barwert]` |
| NettoZahlung | `750` — derived from the „Kontrollrechnung" line, `1000 · 0,75` |

The formula renders as `Barwert = 1 000 / (1 + 0,05)³ = 863,84`. Changing
`Zahlung` to `2000` doubles `Barwert` and `NettoZahlung` and leaves
`Diskontfaktor` alone. The block menu (⚓) shows the two Sprungmarken
„Barwert einer einzelnen Zahlung" and „Barwertformel". No red
`[NOT FOUND: …]` marker appears anywhere.

---

## How this file is kept honest

[`src/lib/editor/document-json-authoring.test.ts`](../src/lib/editor/document-json-authoring.test.ts)
reads **this file**, extracts the fenced JSON of both worked examples and of the
prompt block's example output, and runs all three through the real
`readDocumentJson` boundary and the real `importEditorJson` importer. It also
checks that the version named here is still the version the code emits, and
that no example carries an image block or a link node.

So a schema change that outdates anything printed above fails `npm test`
instead of drifting silently. If you edit an example, run `npm test`. If the
test fails, the document is wrong — not the test.
