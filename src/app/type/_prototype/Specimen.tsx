'use client'

/**
 * PROTOTYPE (#117) — the type specimen. Throwaway; prototype rules apply
 * (no tests, no error handling, no abstractions worth keeping).
 *
 * ONE component renders every candidate system, so the only thing that changes
 * between A/B/C/D is the font stack and the handful of numbers in
 * `systems.ts`. Anything that differs beyond that would be a confound.
 *
 * The system lives in React state rather than the URL: switching must not
 * remount, because the whole point is to hold your eye on one paragraph and
 * flip the family under it. Scroll position is preserved for free.
 *
 * Everything is rendered on the ground #116 decided — warm paper at #f0eae2,
 * warm-white panels, the generated grain tile — because a face that only works
 * on white has not been tested.
 */

import { useCallback, useEffect, useState } from 'react'
import { SYSTEMS, systemFor, type TypeSystem } from './systems'
import { Formula } from './Formula'
import { PROTOTYPE_KURSE } from '../../kurse/_prototype/prototype-data'
import '@/components/documents/interactive-document.css'

const GRAIN = 'url(/prototype/paper-grain.png)'

export function Specimen({
  initialSystem,
  initialGrain,
}: {
  initialSystem?: string
  initialGrain?: string
}) {
  const [index, setIndex] = useState(() =>
    Math.max(0, SYSTEMS.indexOf(systemFor(initialSystem))),
  )
  const [grain, setGrain] = useState(initialGrain !== 'off')
  /* The ticket asks to settle the reading size, not just the family, and the
     two are not separable: 17px of a serif with a small x-height is not 17px
     of Geist. `+` / `−` nudges it live, and it resets when the system does. */
  const [sizeDelta, setSizeDelta] = useState(0)
  const sys = SYSTEMS[index]
  const docSize = sys.docSize + sizeDelta

  const step = useCallback((d: number) => {
    setIndex((i) => (i + d + SYSTEMS.length) % SYSTEMS.length)
    setSizeDelta(0)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key.toLowerCase() === 'g') setGrain((g) => !g)
      else if (/^[1-4]$/.test(e.key)) { setIndex(Number(e.key) - 1); setSizeDelta(0) }
      else if (e.key === '+' || e.key === '=') setSizeDelta((d) => Math.min(4, d + 1))
      else if (e.key === '-') setSizeDelta((d) => Math.max(-3, d - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  return (
    <div
      className="ts"
      style={
        {
          '--ui': sys.ui,
          '--doc': sys.doc,
          '--mono': sys.mono,
          '--doc-size': `${docSize}px`,
          '--doc-leading': sys.docLeading,
          '--doc-weight': sys.docWeight,
          '--num-weight': sys.numWeight,
          '--display-tracking': sys.displayTracking,
          '--display-weight': sys.displayWeight,
          backgroundImage: grain ? GRAIN : 'none',
        } as React.CSSProperties
      }
    >
      <style>{CSS}</style>

      <div className="wrap">
        <Head sys={sys} />
        <Wordmark />
        <Chrome />
        <LearningSurface sys={sys} docSize={docSize} />
        <MathPairing />
        <Weights />
        <Numerals />
        <Scale />
        <Compounds />
      </div>

      <Bar index={index} setIndex={setIndex} grain={grain} setGrain={setGrain} sys={sys} />
    </div>
  )
}

/* ------------------------------------------------------------------ header */

function Head({ sys }: { sys: TypeSystem }) {
  return (
    <header className="head">
      <div className="eyebrow">System {sys.key}</div>
      <h1 className="sysname">{sys.name}</h1>
      <p className="thesis">{sys.thesis}</p>
      <ul className="notes">
        {sys.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </header>
  )
}

/* --------------------------------------------------------------- 4. wordmark */

/** #116 settled the form — `dokum.` with the period as a red dot. What is open
 *  here is whether a given family can carry it: the period is doing real work,
 *  and a face whose full stop is a thin square pip has nothing to turn red. */
function Wordmark() {
  return (
    <Section n="4" title="Wordmark" hint="#116 settled the form. Open here: whether the family can carry it.">
      <div className="marks">
        {[44, 26, 17].map((size) => (
          <span key={size} className="mark" style={{ fontSize: size }}>
            dokum<span className="dot">.</span>
          </span>
        ))}
        <span className="mark mark-neg" style={{ fontSize: 26 }}>
          dokum<span className="dot">.</span>
        </span>
      </div>
      <p className="cap">
        Three sizes on paper, then on the dark navbar ground. The dot is whatever the family’s
        full stop is — nothing is redrawn.
      </p>
    </Section>
  )
}

/* ------------------------------------------------------- chrome: seam cards */

/** #116's decided card, unchanged, because the numerals are the reason this
 *  section exists: "heavy tabular numerals — the numbers are a load-bearing
 *  part of the register, not incidental." */
function Chrome() {
  return (
    <Section
      n="—"
      title="Chrome — the card with the seam"
      hint="Straight from #116. The only question here is what the family does to the numbers."
    >
      <div className="grid">
        {PROTOTYPE_KURSE.slice(0, 3).map((k) => (
          <article key={k.id} className="card">
            <h2>{k.title}</h2>
            <p>{k.description}</p>
            <div className="seam">
              <div className="num">
                {k.units}
                <span>Units</span>
              </div>
              <div className="num">
                {k.documents}
                <span>Dokumente</span>
              </div>
              {k.locked && <div className="chip">Locked</div>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------- 1+2+3. the learning surface */

/**
 * The section that decides the ticket. Real German prose with the compounds
 * Latin filler hides, a real MathJax formula inline in a line of that prose, a
 * real `.student-input` in a sentence, and the measure research §9 asks for
 * (70ch — today the page runs 100–110 characters).
 */
function LearningSurface({ sys, docSize }: { sys: TypeSystem; docSize: number }) {
  const [val, setVal] = useState('2400')

  return (
    <Section
      n="1·2·3"
      title="The learning surface"
      hint={`${docSize}px / ${sys.docLeading} · 70ch measure · real MathJax · real student input · +/− to resize`}
    >
      <div className="paper">
        <div className="dokum-document doc">
          <h1>Gewinnmaximierung unter einer Nebenbedingung</h1>

          <p>
            In den Wirtschaftswissenschaften ist die Optimierung unter einer Nebenbedingung der
            Normalfall und nicht die Ausnahme: Ein Haushalt maximiert seinen Nutzen, kann dabei
            aber nur so viel ausgeben, wie die Budgetbeschränkung zulässt. Genau dafür gibt es das
            Verfahren nach Lagrange — und gemäß dem Grenznutzenausgleich muss im Optimum jeder
            eingesetzte Euro in jeder Verwendung denselben zusätzlichen Nutzen stiften.
          </p>

          <h2>Die Bedingung erster Ordnung</h2>

          <p>
            Wir setzen die Lagrange-Funktion an und leiten nach beiden Gütern ab. Der Multiplikator{' '}
            <Formula tex="\lambda" /> misst dabei, um wie viel der Zielwert steigt, wenn die
            Nebenbedingung um eine Einheit gelockert wird — er ist also der Schattenpreis des
            Budgets. Im Optimum gilt die Gleichheit{' '}
            <Formula tex="\frac{\partial U/\partial x_1}{p_1} = \frac{\partial U/\partial x_2}{p_2}" />
            , und außerdem ist die Budgetbeschränkung mit Gleichheit erfüllt.
          </p>

          <div className="formula-block">
            <div className="render-target">
              <Formula
                display
                tex="\mathcal{L}(x_1, x_2, \lambda) = x_1^{\alpha} x_2^{1-\alpha} - \lambda\,\bigl(p_1 x_1 + p_2 x_2 - m\bigr)"
              />
            </div>
            <div className="block-caption">
              Die Zielfunktion in Cobb-Douglas-Form, abzüglich der bewerteten Nebenbedingung.
            </div>
          </div>

          <p>
            Setzen Sie das monatliche Budget ein, mit dem Sie rechnen möchten:{' '}
            <input
              className="input-field student-input"
              value={val}
              size={Math.max(4, val.length + 1)}
              onChange={(e) => setVal(e.target.value)}
            />{' '}
            Euro. Bei einem Preisverhältnis von <span className="output-field">1,5</span> und einem
            Ausgabenanteil <Formula tex="\alpha = 0{,}4" /> ergibt sich daraus die nachgefragte
            Menge <span className="output-field">{fmt(Number(val) * 0.4 / 1.5)}</span> Stück.
          </p>

          <p>
            Wie groß die Preiselastizität der Nachfrage in diesem Punkt ausfällt, rechnen wir in{' '}
            <a className="doc-link" data-link-icon="📄" href="#">
              Elastizitäten im Detail
            </a>{' '}
            durch. Die Kapitalwertmethode und die Deckungsbeitragsrechnung bauen später auf
            derselben Idee auf: Ein Zahlungsstrom wird bewertet, bevor über ihn entschieden wird.
          </p>

          <ul>
            <li>Straßenbahn, Größe, Maß, außerdem, dreißig — ß in der Laufschrift.</li>
            <li>Übung, Änderung, Öffnungszeiten, Übertrag — Umlaute in Versalien: ÄÖÜ.</li>
            <li>
              <code>--dokum-ink</code>, <code>MAX_FILE_SIZE_BYTES</code> — Mono im Fließtext.
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('de-DE', { maximumFractionDigits: 1 })
}

/* ------------------------------------------------ 2. the pairing, close up */

/**
 * The pairing at three reading sizes, isolated. MathJax's SVG scales in `ex`
 * units off the surrounding font, so a face with a big x-height makes the
 * formula grow with it — which is exactly the thing that either settles down
 * or clashes, and it is invisible at one size.
 */
function MathPairing() {
  return (
    <Section
      n="2"
      title="The pairing, close up"
      hint="Computer Modern is fixed — MathJax v3 SVG has no other maths font. The body face adapts, not the maths."
    >
      <div className="paper pairing">
        {[19, 17, 15].map((size) => (
          <p key={size} className="pair" style={{ fontSize: size }}>
            <span className="pair-size">{size}px</span>
            Für <Formula tex="x > 0" /> ist die Ableitung <Formula tex="f'(x) = \tfrac{1}{x}" />{' '}
            streng monoton fallend, also gilt <Formula tex="\ln(ab) = \ln a + \ln b" /> für alle
            zulässigen Größen.
          </p>
        ))}
        <div className="pair-block">
          <Formula
            display
            tex="\frac{\partial}{\partial x}\left[\int_0^x e^{-t^2}\,\mathrm{d}t\right] = e^{-x^2}"
          />
        </div>
      </div>
      <p className="cap">
        What to look for: does the formula read pale or heavy beside the running text? Do the
        x-heights agree? Does the colour of the line shift where the formula sits?
      </p>
    </Section>
  )
}

/* ---------------------------------------------------------------- weights */

function Weights() {
  return (
    <Section n="—" title="Weights" hint="Every weight that would be loaded, with ß and umlauts.">
      <div className="weights">
        {[400, 500, 600, 700].map((w) => (
          <div key={w} className="weight" style={{ fontWeight: w }}>
            <span className="wlabel">{w}</span>
            Größenmaß für Bäcker — Jörg zwängt QuickX über die Straße
          </div>
        ))}
      </div>
      <div className="weights doc-face">
        {[400, 600].map((w) => (
          <div key={w} className="weight" style={{ fontWeight: w }}>
            <span className="wlabel">{w} Doc</span>
            Nebenbedingung · Wirtschaftswissenschaften · Deckungsbeitragsrechnung
          </div>
        ))}
        <div className="weight doc-italic">
          <span className="wlabel">Kursiv</span>
          Der Schattenpreis <em>λ</em> ist definitionsgemäß nichtnegativ.
        </div>
      </div>
    </Section>
  )
}

/* --------------------------------------------------------------- numerals */

function Numerals() {
  return (
    <Section
      n="—"
      title="Numerals"
      hint="#116 asks for heavy tabular numerals. The column has to hold when the number changes."
    >
      <div className="nums">
        <div>
          <div className="nlabel">Tabular, heavy</div>
          <table className="tnum">
            <tbody>
              <tr>
                <td>Units</td>
                <td className="n">6</td>
              </tr>
              <tr>
                <td>Dokumente</td>
                <td className="n">61</td>
              </tr>
              <tr>
                <td>Aufgaben</td>
                <td className="n">148</td>
              </tr>
              <tr>
                <td>Preis</td>
                <td className="n">3 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className="nlabel">Confusable pairs</div>
          <div className="pairs">
            <span>0 O o</span>
            <span>1 l I i</span>
            <span>5 S s</span>
            <span>8 B</span>
            <span>rn m</span>
          </div>
          <div className="nlabel" style={{ marginTop: 18 }}>
            Mono
          </div>
          <pre className="mono">{`--dokum-ink:      #141417;
--dokum-surface:  #f0eae2;
MAX_FILE_SIZE:    4_194_304  // 4 MB
kurse.published = true       // 0 O 1 l I`}</pre>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ scale */

const SCALE: Array<[string, number, number, number]> = [
  ['Display / h1', 40, 1.05, 700],
  ['Section / h2', 26, 1.2, 700],
  ['Card title', 19, 1.2, 700],
  ['Body', 17, 1.6, 400],
  ['UI default', 15, 1.5, 400],
  ['Meta / caption', 13.5, 1.5, 400],
  ['Micro / chip', 11.5, 1.4, 500],
]

function Scale() {
  return (
    <Section n="—" title="The scale" hint="Seven steps. Fewer is not enough; more will not be kept to.">
      <div className="scale">
        {SCALE.map(([label, size, lh, w]) => (
          <div key={label} className="srow">
            <div className="smeta">
              {size} / {lh} / {w}
            </div>
            <div style={{ fontSize: size, lineHeight: lh, fontWeight: w }}>{label} — Nebenbedingung</div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------- compounds */

function Compounds() {
  return (
    <Section
      n="1"
      title="Compounds at card width"
      hint="Where a German word is wider than its column, the family decides how bad that looks."
    >
      <div className="compounds">
        {[
          'Wirtschaftswissenschaften',
          'Deckungsbeitragsrechnung',
          'Betriebsabrechnungsbogen',
          'Wahrscheinlichkeitsrechnung',
          'Nebenbedingung',
          'Grenznutzenausgleich',
        ].map((w) => (
          <div key={w} className="compound">
            {w}
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ----------------------------------------------------------------- shell */

function Section({
  n,
  title,
  hint,
  children,
}: {
  n: string
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <section className="sec">
      <div className="sechead">
        <span className="secn">{n}</span>
        <h2>{title}</h2>
        <span className="sechint">{hint}</span>
      </div>
      {children}
    </section>
  )
}

function Bar({
  index,
  setIndex,
  grain,
  setGrain,
  sys,
}: {
  index: number
  setIndex: (i: number) => void
  grain: boolean
  setGrain: (fn: (g: boolean) => boolean) => void
  sys: TypeSystem
}) {
  return (
    <div className="bar">
      {SYSTEMS.map((s, i) => (
        <button key={s.key} onClick={() => setIndex(i)} className={i === index ? 'on' : ''}>
          {s.key} · {s.name}
        </button>
      ))}
      <span className="sep" />
      <button onClick={() => setGrain((g) => !g)} className={grain ? 'on' : ''}>
        Grain {grain ? 'on' : 'off'}
      </button>
      <span className="hint">← → · 1–4 · G · +/−</span>
      <span className="hint now">{sys.name}</span>
    </div>
  )
}

/* ------------------------------------------------------------------- css */

const CSS = `
/* The root layout's Navbar and Footer are set in today's Geist and would sit
   above every specimen arguing with it. Hidden for the duration. */
body:has(.ts) > nav, body:has(.ts) > header, body:has(.ts) > footer { display: none !important; }
body:has(.ts) > main { padding: 0 !important; }

.ts {
  --ground: #f0eae2;
  --panel: #fffefb;
  --ink: #141417;
  --ink-soft: #6b6b73;
  --seam: rgba(20, 20, 23, 0.12);
  --accent: #db3627;

  background-color: var(--ground);
  color: var(--ink);
  min-height: 100svh;
  font-family: var(--ui);
  -webkit-font-smoothing: antialiased;
}
.ts .wrap { max-width: 1060px; margin: 0 auto; padding: 46px 36px 160px; }

.ts .head { margin-bottom: 52px; }
.ts .eyebrow { font-size: 11.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
.ts .sysname { margin-top: 8px; font-size: 40px; line-height: 1.05; font-weight: var(--display-weight); letter-spacing: var(--display-tracking); }
.ts .thesis { margin-top: 10px; max-width: 60ch; font-size: 17px; line-height: 1.55; color: var(--ink-soft); }
.ts .notes { margin-top: 14px; max-width: 72ch; padding-left: 1.1em; list-style: disc; }
.ts .notes li { font-size: 13.5px; line-height: 1.6; color: var(--ink-soft); margin-top: 4px; }

.ts .sec { margin-top: 58px; }
.ts .sechead { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1px solid var(--seam); }
.ts .secn { font-size: 11.5px; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
.ts .sechead h2 { font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
.ts .sechint { font-size: 12.5px; color: var(--ink-soft); }
.ts .cap { margin-top: 12px; font-size: 12.5px; line-height: 1.6; color: var(--ink-soft); max-width: 74ch; }

/* wordmark */
.ts .marks { display: flex; align-items: baseline; gap: 30px; flex-wrap: wrap; }
.ts .mark { font-weight: var(--display-weight); letter-spacing: var(--display-tracking); line-height: 1; }
.ts .dot { color: var(--accent); }
.ts .mark-neg { background: var(--ink); color: var(--panel); padding: 10px 14px; border-radius: 10px; align-self: center; }

/* chrome cards (#116) */
.ts .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.ts .card { display: flex; flex-direction: column; min-height: 220px; background: var(--panel); border-radius: 20px; padding: 22px 22px 0; }
.ts .card h2 { font-size: 19px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.2; text-wrap: balance; }
.ts .card p { margin-top: 8px; font-size: 13.5px; line-height: 1.55; color: var(--ink-soft); }
.ts .seam { margin-top: auto; border-top: 1px solid var(--seam); display: flex; align-items: baseline; gap: 18px; padding: 13px 0 17px; }
.ts .num { font-size: 26px; font-weight: var(--num-weight); letter-spacing: -0.04em; line-height: 1; font-variant-numeric: tabular-nums lining-nums; }
.ts .num span { margin-left: 5px; font-size: 11px; font-weight: 500; letter-spacing: 0.02em; color: var(--ink-soft); }
.ts .chip { margin-left: auto; align-self: center; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; padding: 3px 9px; border-radius: 999px; border: 1px solid var(--seam); color: var(--ink-soft); }

/* learning surface */
.ts .paper { background: var(--panel); border-radius: 20px; padding: 40px 44px; }
.ts .doc {
  font-family: var(--doc);
  font-size: var(--doc-size);
  line-height: var(--doc-leading);
  font-weight: var(--doc-weight);
  color: var(--ink);
  max-width: 70ch;
}
.ts .doc h1, .ts .doc h2 { font-family: var(--ui); letter-spacing: -0.02em; }
.ts .doc p, .ts .doc li { line-height: var(--doc-leading); max-width: 70ch; }
.ts .doc p { margin: 1.25em 0; }
.ts .doc code { font-family: var(--mono); font-size: 0.86em; }
.ts .doc .formula-block { max-width: none; }
.ts .doc .student-input { font-family: var(--doc); }

/* pairing */
.ts .pairing { display: flex; flex-direction: column; gap: 6px; }
.ts .pair { font-family: var(--doc); line-height: 1.7; max-width: 74ch; position: relative; padding-left: 62px; }
.ts .pair-size { position: absolute; left: 0; top: 0.35em; font-family: var(--mono); font-size: 11px; color: var(--ink-soft); }
.ts .pair-block { margin-top: 16px; padding: 18px 0 6px; border-top: 1px solid var(--seam); font-family: var(--doc); font-size: 17px; }

/* weights */
.ts .weights { display: flex; flex-direction: column; gap: 9px; }
.ts .weights.doc-face { margin-top: 22px; font-family: var(--doc); }
.ts .weight { font-size: 20px; letter-spacing: -0.01em; display: flex; align-items: baseline; gap: 14px; }
.ts .wlabel { font-family: var(--mono); font-size: 11px; font-weight: 400; color: var(--ink-soft); width: 62px; flex: none; font-variant-numeric: tabular-nums; }
.ts .doc-italic em { font-style: italic; }

/* numerals */
.ts .nums { display: grid; grid-template-columns: 260px 1fr; gap: 42px; }
.ts .nlabel { font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 10px; }
.ts .tnum { width: 100%; }
.ts .tnum td { padding: 5px 0; font-size: 14px; color: var(--ink-soft); }
.ts .tnum td.n { text-align: right; font-size: 22px; font-weight: var(--num-weight); color: var(--ink); font-variant-numeric: tabular-nums lining-nums; letter-spacing: -0.03em; }
.ts .pairs { display: flex; gap: 20px; flex-wrap: wrap; font-size: 24px; font-weight: 500; }
.ts .mono { font-family: var(--mono); font-size: 13px; line-height: 1.7; background: var(--panel); border-radius: 12px; padding: 14px 16px; overflow-x: auto; }

/* scale */
.ts .scale { display: flex; flex-direction: column; gap: 14px; }
.ts .srow { display: flex; align-items: baseline; gap: 20px; }
.ts .smeta { font-family: var(--mono); font-size: 11px; color: var(--ink-soft); width: 110px; flex: none; font-variant-numeric: tabular-nums; }

/* compounds */
.ts .compounds { display: grid; grid-template-columns: repeat(3, 300px); gap: 12px; }
.ts .compound { background: var(--panel); border-radius: 14px; padding: 14px 16px; font-size: 19px; font-weight: 700; letter-spacing: -0.025em; overflow-wrap: break-word; hyphens: auto; }

/* bar */
.ts .bar { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; align-items: center; gap: 6px; background: rgba(20,20,23,0.92); color: #fff; padding: 7px 9px; border-radius: 999px; font-size: 12px; z-index: 50; backdrop-filter: blur(6px); }
.ts .bar button { color: rgba(255,255,255,0.62); padding: 5px 11px; border-radius: 999px; font: inherit; cursor: pointer; white-space: nowrap; }
.ts .bar button.on { background: #fff; color: #141417; font-weight: 600; }
.ts .bar .sep { width: 1px; height: 18px; background: rgba(255,255,255,0.22); margin: 0 4px; }
.ts .bar .hint { color: rgba(255,255,255,0.45); padding: 0 8px; }
.ts .bar .hint.now { display: none; }

@media (max-width: 900px) {
  .ts .grid, .ts .compounds { grid-template-columns: 1fr; }
  .ts .nums { grid-template-columns: 1fr; }
}
`
