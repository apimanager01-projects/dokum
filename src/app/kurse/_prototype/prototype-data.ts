/**
 * PROTOTYPE (#116) — throwaway. Not imported by anything in production.
 *
 * Why not the real DAL rows: the dev project's catalog is QA fixtures —
 * `publishTestKurs`, `testtabkurs`, `PR102 QA – Verkaufskurs`. Judging German
 * typography, compound-noun wrapping, and card density against those titles
 * would answer nothing, because they are shorter and more ASCII than anything
 * a real Kurs is ever called. This set is what the product actually holds:
 * German business/maths course names, including two long enough to wrap.
 *
 * Lexicon follows #115 — Kurs / Unit / Aufgabe / Dokument, "Mini Case" absent
 * because it names no level, state word `Locked` live.
 */

export interface PrototypeKurs {
  id: string
  title: string
  description: string
  units: number
  documents: number
  locked?: boolean
}

export const PROTOTYPE_KURSE: PrototypeKurs[] = [
  {
    id: 'k1',
    title: 'Investitionsrechnung',
    description:
      'Kapitalwert, interner Zinsfuss und Amortisation — gerechnet an Fällen, die in der Klausur so drankommen.',
    units: 6,
    documents: 34,
  },
  {
    id: 'k2',
    title: 'Kosten- und Leistungsrechnung',
    description:
      'Vom Betriebsabrechnungsbogen bis zur Deckungsbeitragsrechnung. Der Stoff, an dem im ersten Jahr die meisten hängenbleiben.',
    units: 9,
    documents: 61,
    locked: true,
  },
  {
    id: 'k3',
    title: 'Statistik I',
    description:
      'Deskriptive Kennzahlen, Wahrscheinlichkeitsrechnung und die ersten Testverfahren.',
    units: 7,
    documents: 48,
  },
  {
    id: 'k4',
    title: 'Analysis für Wirtschaftswissenschaften',
    description:
      'Ableitungen, Optimierung unter Nebenbedingungen, Lagrange. Jede Herleitung Schritt für Schritt.',
    units: 8,
    documents: 52,
    locked: true,
  },
  {
    id: 'k5',
    title: 'Bilanzierung nach UGB',
    description: 'Ansatz, Bewertung, Ausweis — mit den Fällen aus den letzten vier Terminen.',
    units: 5,
    documents: 27,
  },
  {
    id: 'k6',
    title: 'Makroökonomie',
    description: 'IS-LM, AS-AD und Wachstumsmodelle, jeweils an einer durchgerechneten Volkswirtschaft.',
    units: 6,
    documents: 39,
  },
]
