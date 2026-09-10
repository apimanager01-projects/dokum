import { getKurseNewestFirst } from '@/lib/dal'
import { formatAdminDate } from '@/lib/format-date'
import { AdminSubpageNav } from '@/components/admin/AdminSubpageNav'
import { KurseTable, type KursRow } from '@/components/admin/KurseTable'

// Auth is enforced by the proxy (src/proxy.ts) — the single enforcement point
// for /admin/*. No role check is duplicated here (see CLAUDE.md).

/**
 * „Kurse verwalten" (#108) — the catalogue as a table. Creating stays in a
 * compact modal; editing opens the course-wide workspace.
 *
 * This replaced `/admin/kurse/new`, whose URL said „new" while being the only
 * way to reach the list. The old route is gone rather than redirected: the
 * three places that linked to it (the admin cards, the subpage nav, the tree's
 * edit link) were updated, and nothing outside the admin ever pointed at it.
 *
 * `getAllKurseWithUnits()` already returns exactly what the table needs — the
 * Kurs row plus its Einheiten — so counting them costs no extra query.
 */
export default async function AdminKursePage() {
  // Newest first: the Kurs you just made is the one you are about to open.
  const kurse = await getKurseNewestFirst()

  const rows: KursRow[] = kurse.map((kurs) => ({
    id: kurs.id,
    title: kurs.title,
    description: kurs.description,
    position: kurs.position,
    published: kurs.published,
    kurs_type: kurs.kurs_type,
    sold_as: kurs.sold_as,
    // Formatted here, on the server, with a fixed time zone — see format-date.ts.
    createdLabel: formatAdminDate(kurs.created_at),
    units: (kurs.units ?? []).map((unit) => ({ id: unit.id })),
  }))

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <AdminSubpageNav active="kurse" />
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Kurse verwalten</h1>
      <KurseTable kurse={rows} />
    </main>
  )
}
