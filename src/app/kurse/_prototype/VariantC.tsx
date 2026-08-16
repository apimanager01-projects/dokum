/**
 * PROTOTYPE (#116) — Variant C: "Karte". Throwaway.
 *
 * LEVER: softness of form. The ticket calls this the most likely to read
 * generic, so it is built from the ONE reference that argues for it rather
 * than from rounded-corner defaults: 02-flip-clock-black.jpg, inverted to a
 * light ground as the map requires. What survives inversion is the
 * rounded-square card, the heavy numeral, the hairline seam, and the austerity
 * of showing exactly one thing.
 *
 * Memorable move: the SEAM — a hairline crossing every card at a fixed
 * distance from the bottom, splitting name from numbers the way the flip card
 * splits its digit. It is one line of CSS, it is not a shadow, and nothing
 * else on the market uses it.
 *
 * Denser than A and B on purpose (3 columns): weight and geometry are what
 * carry this variant, so it needs to be judged where the tiles repeat.
 */

import { PROTOTYPE_KURSE } from './prototype-data'

const css = `
.pv-c {
  --ground: #f1f0ed;
  --panel: #ffffff;
  --ink: #141417;
  --ink-soft: #6b6b73;
  --seam: rgba(20, 20, 23, 0.12);
  --accent: #db3627;

  background: var(--ground);
  color: var(--ink);
  min-height: calc(100svh - 66px);
}
.pv-c .wrap { max-width: 1160px; margin: 0 auto; padding: 52px 36px 130px; }

.pv-c .mark {
  display: inline-flex; align-items: center; gap: 2px;
  font-size: 25px; font-weight: 700; letter-spacing: -0.04em; line-height: 1;
}
.pv-c .tile {
  display: inline-flex; align-items: center; justify-content: center;
  width: 0.5em; height: 0.5em; border-radius: 0.14em;
  background: var(--accent); margin-left: 0.06em; transform: translateY(0.02em);
}

.pv-c h1 { margin-top: 46px; font-size: 40px; font-weight: 700; letter-spacing: -0.035em; line-height: 1.05; }
.pv-c .lede { margin-top: 14px; max-width: 54ch; font-size: 16px; line-height: 1.6; color: var(--ink-soft); }

.pv-c .grid {
  margin-top: 40px;
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px;
}
.pv-c .card {
  display: flex; flex-direction: column; min-height: 230px;
  background: var(--panel);
  border-radius: 20px;
  padding: 24px 24px 0;
  text-decoration: none; color: inherit;
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
}
.pv-c .card:hover { transform: translateY(-2px); }
.pv-c .card h2 {
  font-size: 19px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.2;
  text-wrap: balance;
}
.pv-c .card p {
  margin-top: 9px; font-size: 13.5px; line-height: 1.55; color: var(--ink-soft);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

/* The seam. Fixed distance from the bottom on every card, exactly as the flip
   card splits its digit at a fixed height regardless of which digit it shows. */
.pv-c .seam {
  margin-top: auto;
  border-top: 1px solid var(--seam);
  display: flex; align-items: baseline; gap: 18px;
  padding: 14px 0 18px;
}
.pv-c .num {
  font-size: 26px; font-weight: 700; letter-spacing: -0.04em; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.pv-c .num span {
  margin-left: 5px; font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  color: var(--ink-soft); text-transform: none;
}
.pv-c .chip {
  margin-left: auto; align-self: center;
  background: #ececea; border-radius: 999px;
  padding: 4px 10px; font-size: 11px; font-weight: 600; color: var(--ink-soft);
}

/* ---- specimen ---- */
.pv-c .spec { margin-top: 96px; }
.pv-c .spec-h {
  font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--ink-soft); margin-bottom: 18px; font-weight: 600;
}
.pv-c .marks { display: flex; gap: 44px; align-items: baseline; flex-wrap: wrap; }
.pv-c .marks > span { font-size: 30px; font-weight: 700; letter-spacing: -0.04em; }
.pv-c .marks small {
  display: block; margin-top: 10px;
  font-size: 11px; font-weight: 400; letter-spacing: 0; color: var(--ink-soft);
}

.pv-c .doc {
  margin-top: 26px; padding: 34px 36px;
  background: var(--panel); border-radius: 20px;
}
.pv-c .doc h3 { font-size: 21px; font-weight: 700; color: var(--accent); letter-spacing: -0.025em; }
.pv-c .doc p { margin: 1.1em 0; font-size: 17px; line-height: 1.65; max-width: 70ch; }
.pv-c .formula {
  margin: 1.3em 0; padding: 20px 22px;
  background: var(--ground); border-radius: 14px; text-align: center;
}
.pv-c .m { font-family: 'Times New Roman', ui-serif, serif; font-size: 21px; }
.pv-c .m i { font-style: italic; }
.pv-c .inp {
  font: inherit; font-weight: 700; font-size: 1em;
  min-height: 2.1em; min-width: 4em; text-align: center;
  padding: 4px 12px; margin: 0 3px;
  border: 0; border-radius: 999px;
  background: var(--ground); color: var(--ink);
  box-shadow: inset 0 0 0 1.5px var(--seam);
  appearance: none;
}
.pv-c .inp:focus { outline: none; box-shadow: inset 0 0 0 2px var(--accent); }
.pv-c .out {
  display: inline-block; padding: 3px 12px; margin: 0 3px;
  border-radius: 999px; background: #16161a; color: #fff;
  font-weight: 700; font-size: 0.9em; font-variant-numeric: tabular-nums;
}
.pv-c .note { margin-top: 20px; font-size: 12.5px; line-height: 1.65; color: var(--ink-soft); max-width: 70ch; }
@media (max-width: 1000px) { .pv-c .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .pv-c .grid { grid-template-columns: 1fr; } .pv-c .wrap { padding: 40px 20px 130px; } }
`

export function VariantC() {
  return (
    <div className="pv-c">
      <style>{css}</style>
      <div className="wrap">
        <div className="mark">
          dokum<i className="tile" />
        </div>

        <h1>Kurse</h1>
        <p className="lede">
          Wähle einen Kurs. Jede Unit enthält die Aufgaben und die durchgerechneten Dokumente dazu.
        </p>

        <div className="grid">
          {PROTOTYPE_KURSE.map((k) => (
            <a key={k.id} className="card" href="#">
              <h2>{k.title}</h2>
              <p>{k.description}</p>
              <div className="seam">
                <span className="num">
                  {k.units}
                  <span>Units</span>
                </span>
                <span className="num">
                  {k.documents}
                  <span>Dokumente</span>
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
              dokum<span style={{ color: '#db3627' }}>.</span>
              <small>roter Punkt</small>
            </span>
            <span>
              dokum.
              <small>einfacher Schlusspunkt</small>
            </span>
            <span className="mark" style={{ fontSize: 30 }}>
              dokum<i className="tile" />
              <small>rote Karte</small>
            </span>
          </div>

          <div className="spec-h" style={{ marginTop: 60 }}>
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
              Der Formelblock ist hier eine Fläche statt einer Akzentleiste. Zu prüfen ist, ob die
              runde Geometrie neben gesetzter Mathematik noch ernst wirkt — die Formel ist das
              einzige Element auf der Seite, das seine Form nicht verhandeln kann.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
