import type { TVShow } from '@/features/shows/types/show.types'
import { useShowsStore } from '@/store/showsStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import SearchView from './SearchView.vue'

const routeMock = reactive<{ fullPath: string; query: Record<string, unknown> }>({
  fullPath: '/search?q=test',
  query: { q: 'test' },
})

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
}))

function show(id: number, name: string, genres: string[]): TVShow {
  return {
    id,
    name,
    genres,
    rating: { average: 7 },
    image: null,
    summary: null,
    premiered: null,
    officialSite: null,
    url: '',
  }
}

describe('SearchView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routeMock.fullPath = '/search?q=test'
    routeMock.query = { q: 'test' }
  })

  it('filters search results by selected genre', async () => {
    const store = useShowsStore()
    store.searchState = 'success'
    store.searchResults = [
      show(1, 'Action One', ['Action']),
      show(2, 'Comedy One', ['Comedy']),
    ]
    store.selectedGenre = 'Comedy'
    store.runSearch = vi.fn(async () => undefined)

    const w = mount(SearchView, {
      global: {
        stubs: {
          ShowCard: true,
          AppLoader: true,
          AppErrorState: true,
        },
      },
    })

    expect(w.findAll('show-card-stub')).toHaveLength(1)
  })
})
