import * as api from '@/features/shows/services/tvmazeApi'
import type { TVShow } from '@/features/shows/types/show.types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { reactive } from 'vue'
import GenreView from './GenreView.vue'

const routeMock = reactive<{ params: Record<string, unknown> }>({
  params: { genre: 'Comedy' },
})

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  RouterLink: RouterLinkStub,
}))

vi.mock('@/features/shows/services/tvmazeApi', () => ({
  fetchShowPage: vi.fn(),
}))

function show(id: number, genres: string[]): TVShow {
  return {
    id,
    name: `Show ${id}`,
    genres,
    rating: { average: 7 },
    image: null,
    summary: null,
    premiered: null,
    officialSite: null,
    url: '',
  }
}

describe('GenreView', () => {
  beforeEach(() => {
    routeMock.params = { genre: 'Comedy' }
    vi.clearAllMocks()
  })

  it('loads first page and renders only matching genre shows', async () => {
    vi.mocked(api.fetchShowPage).mockResolvedValue([
      show(1, ['Comedy']),
      show(2, ['Drama']),
      show(3, ['Comedy']),
    ])

    const w = mount(GenreView, {
      global: {
        stubs: {
          ShowCard: true,
          AppLoader: true,
          AppErrorState: true,
          RouterLink: RouterLinkStub,
        },
      },
    })

    await Promise.resolve()
    await Promise.resolve()

    expect(api.fetchShowPage).toHaveBeenCalledWith(0)
    expect(w.findAll('show-card-stub')).toHaveLength(2)
  })
})
