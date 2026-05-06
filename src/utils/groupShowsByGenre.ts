import type { TVShow } from '@/features/shows/types/show.types'

export const UNCATEGORIZED_GENRE = 'Other shows'

export const DEFAULT_MAX_PER_GENRE = Number.POSITIVE_INFINITY

/** Sort by rating average descending; null / NaN averages sort last */
export function compareShowsByRating(a: TVShow, b: TVShow): number {
  const av = a.rating?.average
  const bv = b.rating?.average
  const an = av != null && !Number.isNaN(av) ? av : Number.NEGATIVE_INFINITY
  const bn = bv != null && !Number.isNaN(bv) ? bv : Number.NEGATIVE_INFINITY
  if (bn !== an) return bn - an
  return a.name.localeCompare(b.name)
}

function genresForShow(show: TVShow): string[] {
  return show.genres.length > 0 ? show.genres : [UNCATEGORIZED_GENRE]
}

function pushToBucket(
  buckets: Map<string, TVShow[]>,
  genre: string,
  show: TVShow
): void {
  const existing = buckets.get(genre)
  if (existing) {
    existing.push(show)
    return
  }
  buckets.set(genre, [show])
}

/**
 * Groups shows by genre (a show appears in every genre it belongs to).
 * Each list is sorted by rating and optionally truncated to maxPerGenre.
 */
export function groupShowsByGenre(
  shows: TVShow[],
  maxPerGenre: number = DEFAULT_MAX_PER_GENRE
): Record<string, TVShow[]> {
  const showsByGenre = new Map<string, TVShow[]>()

  for (const show of shows) {
    for (const genre of genresForShow(show)) {
      pushToBucket(showsByGenre, genre, show)
    }
  }

  const grouped: Record<string, TVShow[]> = {}
  for (const [genre, list] of showsByGenre) {
    const sortedByRating = [...list].sort(compareShowsByRating)
    grouped[genre] = sortedByRating.slice(0, maxPerGenre)
  }

  return grouped
}

/** Stable genre order for dashboard rows: alphabetical, Other shows last */
export function sortGenreKeys(genres: string[]): string[] {
  return [...genres].sort((a, b) => {
    if (a === UNCATEGORIZED_GENRE) return 1
    if (b === UNCATEGORIZED_GENRE) return -1
    return a.localeCompare(b)
  })
}
