/**
 * PROTOTYPE (#116) — Variant B: "Luft". Throwaway.
 *
 * LEVER: generosity of space. Cool, near-achromatic ground; welcoming comes
 * from not being crowded. Deliberately NOT a card grid — the catalog is an
 * editorial index: one full-width row per Kurs, hairline-separated, with the
 * counts set as large light numerals on the right.
 *
 * This is the variant that tests whether the cream can go. If B reads as
 * welcoming without any warmth in the ground, the cream is a preference rather
 * than a load-bearing part of the answer.
 *
 * Memorable move: the measure and the numerals — nothing decorative at all.
 */

import { PROTOTYPE_KURSE } from './prototype-data'

const css = `
.pv-b {
  --ground: #fbfbfa;
  --ink: #17171a;
  --ink-soft: #74747c;
  --rule: #e7e7e4;
  --accent: #db3627;

  background: var(--ground);
  color: var(--ink);
  min-height: calc(100svh - 66px);
}
.pv-b .wrap { max-width: 1000px; margin: 0 auto; padding: 104px 40px 140px; }

.pv-b .mark { font-size: 22px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink-soft); }

.pv-b h1 {
  margin-top: 88px;
  font-size: 52px; font-weight: 400; letter-spacing: -0.035em; line-height: 1.05;
}
.pv-b .lede {
  margin-top: 22px; max-width: 52ch;
  font-size: 18px; line-height: 1.75; color: var(--ink-soft); font-weight: 300;
}

.pv-b .index { margin-top: 96px; border-top: 1px solid var(--rule); }
.pv-b .row {
  display: grid; grid-template-columns: 1fr auto;
  gap: 56px; align-items: start;
  padding: 44px 0 44px;
  border-bottom: 1px solid var(--rule);
  text-decoration: none; color: inherit;
  position: relative;
}
.pv-b .row::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
  background: var(--accent); transform: scaleX(0); transform-origin: left;
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
}
.pv-b .row:hover::after { transform: scaleX(1); }

.pv-b .row h2 {
  font-size: 27px; font-weight: 400; letter-spacing: -0.02em; line-height: 1.2;
  text-wrap: balance;
}
.pv-b .row p {
  margin-top: 14px; max-width: 62ch;
  font-size: 16px; line-height: 1.75; font-weight: 300; color: var(--ink-soft);
}
.pv-b .counts { display: flex; gap: 44px; padding-top: 4px; }
.pv-b .count { text-align: right; }
.pv-b .count b {
  display: block;
  font-size: 34px; font-weight: 200; letter-spacing: -0.03em; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.pv-b .count span {
  display: block; margin-top: 10px;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft);
}
.pv-b .chip {
  display: inline-block; margin-top: 18px;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-soft);
  border-bottom: 1px solid var(--rule); padding-bottom: 2px;
}

/* ---- specimen ---- */
.pv-b .spec { margin-top: 128px; }
.pv-b .spec-h {
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-soft); margin-bottom: 24px;
}
.pv-b .marks { display: flex; gap: 56px; align-items: baseline; flex-wrap: wrap; }
.pv-b .marks > span { font-size: 30px; font-weight: 400; letter-spacing: -0.025em; }
.pv-b .marks small {
  display: block; margin-top: 10px;
  font-size: 11px; font-weight: 400; letter-spacing: 0; color: var(--ink-soft);
}
.pv-b .sq {
  display: inline-block; width: 0.3em; height: 0.3em; border-radius: 999px;
  background: var(--accent);
}

.pv-b .doc { margin-top: 40px; padding: 56px 0 0; border-top: 1px solid var(--rule); }
.pv-b .doc h3 { font-size: 22px; font-weight: 500; color: var(--accent); letter-spacing: -0.02em; }
.pv-b .doc p { margin: 1.3em 0; font-size: 17px; line-height: 1.75; max-width: 68ch; font-weight: 300; }
.pv-b .formula {
  margin: 1.6em 0; padding: 26px 0;
  border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
  text-align: center;
}
.pv-b .m { font-family: 'Times New Roman', ui-serif, serif; font-size: 22px; }
.pv-b .m i { font-style: italic; }
.pv-b .inp {
  font: inherit; font-weight: 500; font-size: 1em;
  min-height: 2.1em; min-width: 4em; text-align: center;
  padding: 4px 10px; margin: 0 3px;
  border: 0; border-bottom: 1.5px solid var(--ink-soft); border-radius: 0;
  background: transparent; color: var(--ink);
  appearance: none;
}
.pv-b .inp:focus { outline: none; border-bottom-color: var(--accent); }
.pv-b .out {
  display: inline-block; padding: 0 2px; margin: 0 2px;
  border-bottom: 1.5px solid var(--rule);
  font-weight: 500; font-variant-numeric: tabular-nums;
}
.pv-b .note { margin-top: 24px; font-size: 12.5px; line-height: 1.7; color: var(--ink-soft); max-width: 68ch; }
@media (max-width: 760px) {
  .pv-b .wrap { padding: 56px 20px 140px; }
  .pv-b .row { grid-template-columns: 1fr; gap: 24px; }
  .pv-b h1 { font-size: 38px; }
}
`

export function VariantB() {
  return (
    <div className="pv-b">
      <style>{css}</style>
      <div className="wrap">
        <div className="mark">dokum.</div>

        <h1>Kurse</h1>
        <p className="lede">
          Wähle einen Kurs. Jede Unit enthält die Aufgaben und die durchgerechneten Dokumente dazu.
        </p>

        <div className="index">
          {PROTOTYPE_KURSE.map((k) => (
            <a key={k.id} className="row" href="#">
              <div>
                <h2>{k.title}</h2>
                <p>{k.description}</p>
                {k.locked && <span className="chip">Locked</span>}
              </div>
              <div className="counts">
                <span className="count">
                  <b>{k.units}</b>
                  <span>Units</span>
                </span>
                <span className="count">
                  <b>{k.documents}</b>
                  <span>Dokumente</span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <section className="spec">
          <div className="spec-h">Wordmark — wie sitzt der Punkt</div>
          <div className="marks">
            <span>
              dokum<span style={{ color: '#db3627' }}>.</span>
              <small>roter Punkt</small>
            </span>
            <span>
              dokum.
              <small>einfacher Schlusspunkt</small>
            </span>
            <span>
              dokum
              <i className="sq" />
              <small>roter Kreis</small>
            </span>
          </div>

          <div className="spec-h" style={{ marginTop: 72 }}>
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
              Hier wird der Preis dieser Richtung sichtbar: ohne Fläche und ohne Rahmen muss die
              Auszeichnung des Eingabefelds die ganze Arbeit machen. Zu prüfen ist, ob ein Feld noch
              als Feld gelesen wird, wenn nur eine Linie darunter steht.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
