/**
 * Title filter of the drafts popup (#109).
 *
 * The popup replaced a standing list that was short enough to scan by eye; a
 * filter is what replaces that scanning once the list lives behind a button.
 * It is deliberately the dumbest thing that works — a case-insensitive
 * substring over the title — because the drafts are already ordered
 * newest-first by the DAL and the ticket declined sort controls: an author is
 * narrowing a list they mostly remember, not searching a corpus.
 *
 * ORDER IS NEVER TOUCHED. Ranking matches by relevance would fight the
 * newest-first ordering the list is otherwise read in.
 *
 * Kept pure and generic (`{ title: string }`) because the popup itself has no
 * test seam — the same reason `export-target.ts` exists next door.
 */

/** Case-insensitive, order-preserving substring filter over `title`. */
export function filterDraftsByTitle<T extends { title: string }>(
  drafts: readonly T[],
  query: string
): T[] {
  const needle = normalise(query)
  // A blank query — including one that is only whitespace — is not a filter.
  if (needle === '') return [...drafts]
  return drafts.filter((draft) => normalise(draft.title).includes(needle))
}

/**
 * Case folding is locale-aware ('de-DE'), so „ß"/„ẞ" and the umlauts fold the
 * way a German title expects. Diacritics are NOT stripped: „Wärme" is not
 * matched by „Warme", which is the same bargain the browser's own find-in-page
 * makes.
 */
function normalise(value: string): string {
  return value.trim().toLocaleLowerCase('de-DE')
}
