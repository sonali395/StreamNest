import type { TVShow } from '@/features/shows/types/show.types'
import { useShowsStore } from '@/store/showsStore'
import { createPinia, setActivePinia } from 'pinia'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ShowDetailView from './ShowDetailView.vue'

const routeMock = reactive<{ params: Record<string, unknown> }>({
  params: { id: '42' },
})

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
  RouterLink: RouterLinkStub,
}))

function buildShow(id: number): TVShow {
  return {
    id,
    name: `Show ${id}`,
    genres: ['Drama'],
    rating: { average: 8.2 },
    image: null,
    summary: '<p>Great show</p>',
    premiered: '2020-01-01',
    officialSite: null,
    url: '',
  }
}

describe('ShowDetailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routeMock.params = { id: '42' }
  })

  it('loads detail on mount with valid numeric id', async () => {
    const store = useShowsStore()
    store.loadShowDetail = vi.fn(async () => undefined)

    mount(ShowDetailView, {
      props: { id: '42' },
      global: {
        stubs: {
          AppLoader: true,
          AppErrorState: true,
          RouterLink: RouterLinkStub,
        },
      },
    })

    await Promise.resolve()

    expect(store.loadShowDetail).toHaveBeenCalledWith(42)
  })

  it('does not call loadShowDetail when id is NaN', async () => {
    const store = useShowsStore()
    store.loadShowDetail = vi.fn(async () => undefined)

    mount(ShowDetailView, {
      props: { id: 'invalid-id' },
      global: {
        stubs: {
          AppLoader: true,
          AppErrorState: true,
          RouterLink: RouterLinkStub,
        },
      },
    })

    await Promise.resolve()

    expect(store.loadShowDetail).not.toHaveBeenCalled()
  })

  it('resets and reloads when route param changes', async () => {
    const store = useShowsStore()
    store.loadShowDetail = vi.fn(async () => undefined)
    store.resetDetail = vi.fn()

    const w = mount(ShowDetailView, {
      props: { id: '42' },
      global: {
        stubs: {
          AppLoader: true,
          AppErrorState: true,
          RouterLink: RouterLinkStub,
        },
      },
    })

    await Promise.resolve()
    vi.mocked(store.loadShowDetail).mockClear()

    routeMock.params = { id: '77' }
    await w.setProps({ id: '77' })
    await Promise.resolve()
    await Promise.resolve()

    expect(store.resetDetail).toHaveBeenCalled()
    expect(store.loadShowDetail).toHaveBeenCalledWith(77)
  })

  it('renders show content when detail is loaded', async () => {
    const store = useShowsStore()
    store.detailState = 'success'
    store.detailShow = buildShow(42)
    store.loadShowDetail = vi.fn(async () => undefined)

    const w = mount(ShowDetailView, {
      props: { id: '42' },
      global: {
        stubs: {
          AppLoader: true,
          AppErrorState: true,
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(w.text()).toContain('Show 42')
    expect(w.text()).toContain('8.2 / 10')
  })
})
