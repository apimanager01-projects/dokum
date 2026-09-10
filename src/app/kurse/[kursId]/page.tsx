import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getKursNavTree, getKursViewerAccess } from '@/lib/dal'
import ShareButton from '@/components/ShareButton'
import { UNIT_PRICE_DISPLAY } from '@/lib/constants'

/**
 * The Kurs landing content (#106) — what fills the right-hand column before the
 * student has picked an Einheit.
 *
 * The grid of Unit cards that used to live here is gone: navigating the Kurs is
 * the sidebar's job now, and it is mounted by the layout. What remains is the
 * part navigation cannot do — introduce the Kurs, and sell the Einheiten that
 * are still locked.
 *
 * Both reads are the ones the layout already made. `cache()` on them means this
 * costs no extra round trip, which is why the page re-derives `locked` instead
 * of the layout passing it down (a layout cannot pass props to a page).
 */
export default async function KursPage({ params }: { params: Promise<{ kursId: string }> }) {
  const { kursId } = await params

  const [kurs, { isAdmin, entitledUnitIds }] = await Promise.all([
    getKursNavTree(kursId),
    getKursViewerAccess(),
  ])
  if (!kurs) notFound()

  const lockedUnits = kurs.units.filter((unit) => !isAdmin && !entitledUnitIds.has(unit.id))

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-[0] text-black">{kurs.title}</h1>
          {kurs.description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">{kurs.description}</p>
          )}
          <p className="mt-3 max-w-2xl text-xs text-gray-400">
            Alle Lernunterlagen ohne Gewähr auf Richtigkeit und Vollständigkeit. Fehler können nicht
            ausgeschlossen werden.
          </p>
        </div>
        <ShareButton title={kurs.title} />
      </div>

      {kurs.units.length === 0 ? (
        <p className="mt-10 text-sm text-gray-500">Dieser Kurs hat noch keine Einheiten.</p>
      ) : (
        <p className="mt-8 text-sm text-gray-500">
          Wähle links eine Einheit, um ihre Aufgaben und Dokumente zu öffnen.
        </p>
      )}

      {lockedUnits.length > 0 && (
        <section className="mt-10 max-w-2xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
            Noch nicht freigeschaltet
          </h2>
          <ul className="mt-3 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
            {lockedUnits.map((unit) => (
              <li key={unit.id}>
                <Link
                  href={`/kurse/${kursId}/units/${unit.id}`}
                  className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                >
                  <span aria-hidden className="mt-0.5 text-base">
                    🔒
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-black">{unit.title}</span>
                    {unit.description && (
                      <span className="mt-1 block text-sm leading-snug text-gray-600">
                        {unit.description}
                      </span>
                    )}
                    <span className="mt-1.5 block text-xs font-bold text-brand">Freischalten →</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">
                    {UNIT_PRICE_DISPLAY}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
