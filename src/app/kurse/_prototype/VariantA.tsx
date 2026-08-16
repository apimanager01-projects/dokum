/**
 * PROTOTYPE (#116) — Variant A: "Papier". Throwaway.
 *
 * LEVER: warmth of ground. Welcoming comes from the material; everything else
 * stays disciplined — no shadows, no radius to speak of, restrained weights.
 *
 * Ground is the measured colour of docs/design/references/01-paper-grain-cream.jpg
 * (#f3ece5 mean) lifted slightly to #faf6f0, with the seamless grain tile from
 * generate-grain.py laid over it. The tile swings both ways around the ground,
 * so the composited p2..p98 luma runs 232..248 — a +-8 excursion that WCAG has
 * to hold across, and does (see the specimen note at the bottom).
 *
 * Memorable move: the ground itself, plus a red hairline rule that is the only
 * chromatic mark on the page. Cards are panels ON paper — hairline, no shadow.
 */

import { PROTOTYPE_KURSE } from './prototype-data'

const css = `
.pv-a {
  --ground: #faf6f0;
  --panel: #fffcf7;
  --ink: #211d19;
  --ink-soft: #6d6459;
  --rule: #e0d8cb;
  --rule-soft: #ebe4d9;
  --accent: #db3627;

  /* The grain itself is applied by the host, not here — it is an ORTHOGONAL
     question (map #112: wanted product-wide, and #116's to implement
     deliberately), so it toggles with ?grain= across all three variants. */
  background-color: var(--ground);
  color: var(--ink);
  min-height: calc(100svh - 66px);
  font-feature-settings: 'ss01';
}
.pv-a .wrap { max-width: 1080px; margin: 0 auto; padding: 56px 40px 120px; }

.pv-a .mark {
  font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1;
}
.pv-a .mark i { font-style: normal; color: var(--accent); }

.pv-a .rule { height: 1px; background: var(--rule); margin: 22px 0 44px; }
.pv-a .rule-accent { height: 2px; width: 34px; background: var(--accent); margin-bottom: -1px; }

.pv-a h1 { font-size: 38px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.1; }
.pv-a .lede {
  margin-top: 12px; max-width: 58ch;
  font-size: 16px; line-height: 1.6; color: var(--ink-soft);
}

.pv-a .grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;
}
.pv-a .card {
  display: flex; flex-direction: column;
  background: var(--panel);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 26px 26px 22px;
  text-decoration: none; color: inherit;
  transition: border-color 100ms cubic-bezier(0.2, 0, 0, 1);
}
.pv-a .card:hover { border-color: #c9bda9; }
.pv-a .card h2 {
  font-size: 20px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.25;
  text-wrap: balance;
}
.pv-a .card p {
  margin-top: 10px; font-size: 14.5px; line-height: 1.6; color: var(--ink-soft);
  max-width: 46ch;
}
.pv-a .meta {
  margin-top: auto; padding-top: 22px;
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}
.pv-a .meta b { font-weight: 600; color: var(--ink); }
.pv-a .dot { color: var(--rule); }
.pv-a .chip {
  margin-left: auto;
  border: 1px solid var(--rule); border-radius: 3px;
  padding: 2px 7px; font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase;
  color: var(--ink-soft);
}

/* ---- specimen ---- */
.pv-a .spec { margin-top: 88px; }
.pv-a .spec-h {
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-soft); margin-bottom: 16px;
}
.pv-a .marks { display: flex; gap: 40px; align-items: baseline; flex-wrap: wrap; }
.pv-a .marks > span { font-size: 30px; font-weight: 600; letter-spacing: -0.03em; }
.pv-a .marks small {
  display: block; margin-top: 8px;
  font-size: 11px; font-weight: 400; letter-spacing: 0; color: var(--ink-soft);
}
.pv-a .sq {
  display: inline-block; width: 0.34em; height: 0.34em; border-radius: 1px;
  background: var(--accent); vertical-align: baseline;
}

.pv-a .doc {
  margin-top: 28px; padding: 34px 38px;
  background: var(--panel);
  border: 1px solid var(--rule); border-radius: 6px;
}
.pv-a .doc h3 { font-size: 21px; font-weight: 600; color: var(--accent); letter-spacing: -0.015em; }
.pv-a .doc p { margin: 1.1em 0; font-size: 17px; line-height: 1.65; max-width: 70ch; }
.pv-a .formula {
  margin: 1.2em 0; padding: 16px 18px;
  border-left: 3px solid var(--accent);
  background: #fffefb;
  border-radius: 4px;
  text-align: center;
}
.pv-a .m { font-family: 'Times New Roman', ui-serif, serif; font-size: 21px; }
.pv-a .m i { font-style: italic; }
.pv-a .inp {
  font: inherit; font-weight: 600; font-size: 1em;
  min-height: 2.1em; min-width: 4em; text-align: center;
  padding: 4px 10px; margin: 0 3px;
  border: 1.5px solid #cbbf9f; border-radius: 4px;
  background: #fdf8e8; color: #6b5410;
  appearance: none;
}
.pv-a .inp:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgb(219 54 39 / 0.16); }
.pv-a .out {
  display: inline-block; padding: 2px 9px; margin: 0 3px;
  border: 1px solid #c3cbb7; border-radius: 4px;
  background: #f1f3ea; color: #3f4a33; font-weight: 600; font-size: 0.94em;
}
.pv-a .note {
  margin-top: 18px; font-size: 12.5px; line-height: 1.6; color: var(--ink-soft); max-width: 70ch;
}
@media (max-width: 760px) { .pv-a .grid { grid-template-columns: 1fr; } .pv-a .wrap { padding: 40px 20px 120px; } }
`

export function VariantA() {
  return (
    <div className="pv-a">
      <style>{css}</style>
      <div className="wrap">
        <div className="mark">
          dokum<i>.</i>
        </div>
        <div className="rule" />

        <div className="rule-accent" />
        <h1>Kurse</h1>
        <p className="lede">
          Wähle einen Kurs. Jede Unit enthält die Aufgaben und die durchgerechneten Dokumente dazu.
        </p>

        <div className="grid">
          {PROTOTYPE_KURSE.map((k) => (
            <a key={k.id} className="card" href="#">
              <h2>{k.title}</h2>
              <p>{k.description}</p>
              <div className="meta">
                <span>
                  <b>{k.units}</b> Units
                </span>
                <span className="dot">·</span>
                <span>
                  <b>{k.documents}</b> Dokumente
                </span>
                {k.locked && <span className="chip">Locked</span>}
              </div>
            </a>
          ))}
        </div>

        <section className="spec">
          <div className="spec-h">Wordmark — wie sitzt der Punkt</div>
          <div className="marks">
            <span>
              dokum<i style={{ color: '#db3627' }}>.</i>
              <small>roter Punkt</small>
            </span>
            <span>
              dokum.
              <small>einfacher Schlusspunkt</small>
            </span>
            <span>
              dokum
              <i className="sq" />
              <small>rotes Quadrat</small>
            </span>
          </div>

          <div className="spec-h" style={{ marginTop: 56 }}>
            Lernoberfläche — überlebt die Richtung das Dokument?
          </div>
          <div className="doc">
            <h3>Kapitalwert einer Investition</h3>
            <p>
              Der Kapitalwert diskontiert alle Zahlungsströme auf den Zeitpunkt der Investition
              zurück. Ist er positiv, verzinst sich das eingesetzte Kapital höher als der
              Kalkulationszinssatz — das Projekt ist vorteilhaft.
            </p>
            <div className="formula">
              <span className="m">
                <i>C</i>₀ = −<i>I</i>₀ + Σ <i>CF</i>ₜ · (1 + <i>i</i>)<sup>−t</sup>
              </span>
            </div>
            <p>
              Setze den Kalkulationszinssatz auf{' '}
              <input className="inp" defaultValue="7" size={3} aria-label="Kalkulationszinssatz" /> %
              ein. Der Kapitalwert beträgt dann <span className="out">12.480 €</span> — die
              Investition ist vorteilhaft.
            </p>
            <p className="note">
              Die Fläche trägt hier dieselbe Körnung wie die Seite. Das ist genau die Stelle, an der
              es etwas kostet: <code>html2canvas</code> muss den Grund für den PNG-Fallback
              mitzeichnen (§9). Grund ohne Körnung ist im Dokument die billigere Antwort und bleibt
              möglich.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
