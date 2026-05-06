import type { TVShow } from '@/features/shows/types/show.types'
import {
  UNCATEGORIZED_GENRE,
  compareShowsByRating,
  groupShowsByGenre,
  sortGenreKeys,
} from '@/utils/groupShowsByGenre'
import { describe, expect, it } from 'vitest'

function show(
  partial: Pick<TVShow, 'id' | 'name' | 'genres' | 'rating'> &
    Partial<Omit<TVShow, 'id' | 'name' | 'genres' | 'rating'>>
): TVShow {
  return {
    summary: null,
    premiered: null,
    officialSite: null,
    url: '',
    image: null,
    ...partial,
  }
}

describe('compareShowsByRating', () => {
  it('orders higher ratings first', () => {
    const a = show({ id: 1, name: 'A', genres: [], rating: { average: 7 } })
    const b = show({ id: 2, name: 'B', genres: [], rating: { average: 9 } })
    expect(compareShowsByRating(a, b)).toBeGreaterThan(0)
  })

  it('treats null averages as lowest', () => {
    const a = show({ id: 1, name: 'A', genres: [], rating: { average: null } })
    const b = show({ id: 2, name: 'B', genres: [], rating: { average: 5 } })
    expect(compareShowsByRating(a, b)).toBeGreaterThan(0)
  })

  it('uses name as tie-breaker', () => {
    const a = show({ id: 1, name: 'Zed', genres: [], rating: { average: 8 } })
    const b = show({ id: 2, name: 'Ann', genres: [], rating: { average: 8 } })
    expect(compareShowsByRating(a, b)).toBeGreaterThan(0)
  })
})

describe('groupShowsByGenre', () => {
  it('places a show in each of its genres', () => {
    const s = show({
      id: 1,
      name: 'X',
      genres: ['Drama', 'Comedy'],
      rating: { average: 8 },
    })
    const g = groupShowsByGenre([s], 10)
    expect(g.Drama?.map((x) => x.id)).toEqual([1])
    expect(g.Comedy?.map((x) => x.id)).toEqual([1])
  })

  it('uses Uncategorized when genres empty', () => {
    const s = show({
      id: 2,
      name: 'Y',
      genres: [],
      rating: { average: 6 },
    })
    const g = groupShowsByGenre([s], 10)
    expect(g[UNCATEGORIZED_GENRE]?.map((x) => x.id)).toEqual([2])
  })

  it('sorts by rating desc and caps list', () => {
    const rows = [
      show({
        id: 1,
        name: 'Low',
        genres: ['Drama'],
        rating: { average: 5 },
      }),
      show({
        id: 2,
        name: 'High',
        genres: ['Drama'],
        rating: { average: 9 },
      }),
      show({
        id: 3,
        name: 'Mid',
        genres: ['Drama'],
        rating: { average: 7 },
      }),
    ]
    const g = groupShowsByGenre(rows, 2)
    expect(g.Drama?.map((x) => x.id)).toEqual([2, 3])
  })
})

describe('sortGenreKeys', () => {
  it('sorts alphabetically and pushes Uncategorized last', () => {
    expect(
      sortGenreKeys(['Zoo', UNCATEGORIZED_GENRE, 'Apple'])
    ).toEqual(['Apple', 'Zoo', UNCATEGORIZED_GENRE])
  })
})
