import * as api from '@/features/shows/services/tvmazeApi'
import type { TVShow } from '@/features/shows/types/show.types'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useShowsStore } from './showsStore'

vi.mock('@/features/shows/services/tvmazeApi', () => ({
  fetchShowPage: vi.fn(),
  searchShows: vi.fn(),
  fetchShowById: vi.fn(),
}))

function show(
  partial: Pick<TVShow, 'id' | 'name' | 'genres' | 'rating'>
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

describe('useShowsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loadDashboard groups and sorts genres', async () => {
    vi.mocked(api.fetchShowPage).mockResolvedValue([
      show({
        id: 1,
        name: 'A',
        genres: ['Drama'],
        rating: { average: 7 },
      }),
      show({
        id: 2,
        name: 'B',
        genres: ['Drama'],
        rating: { average: 9 },
      }),
    ])
    const store = useShowsStore()
    await store.loadDashboard()
    expect(store.dashboardState).toBe('success')
    expect(store.showsByGenre.Drama?.map((s) => s.id)).toEqual([2, 1])
    expect(store.genreOrder).toContain('Drama')
  })

  it('runSearch maps API results to shows', async () => {
    vi.mocked(api.searchShows).mockResolvedValue([
      {
        score: 1,
        show: show({
          id: 10,
          name: 'Found',
          genres: [],
          rating: { average: 8 },
        }),
      },
    ])
    const store = useShowsStore()
    await store.runSearch('found')
    expect(store.searchState).toBe('success')
    expect(store.searchResults.map((s) => s.id)).toEqual([10])
  })

  it('runSearch with empty query clears results', async () => {
    const store = useShowsStore()
    store.searchResults = [
      show({ id: 1, name: 'X', genres: [], rating: { average: 1 } }),
    ]
    await store.runSearch('   ')
    expect(store.searchResults).toEqual([])
    expect(store.searchState).toBe('idle')
  })
})
