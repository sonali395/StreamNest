import { useShowsStore } from '@/store/showsStore'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import DashboardView from './DashboardView.vue'

const routeMock = reactive<{ name: string | null }>({ name: 'dashboard' })

vi.mock('vue-router', () => ({
  useRoute: () => routeMock,
}))

describe('DashboardView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routeMock.name = 'dashboard'
  })

  it('filters rows when a genre is selected from dropdown', async () => {
    const store = useShowsStore()
    store.dashboardState = 'success'
    store.shows = [{} as never]
    store.genreOrder = ['Action', 'Comedy']
    store.showsByGenre = {
      Action: [],
      Comedy: [],
    }

    const w = mount(DashboardView, {
      global: {
        stubs: {
          GenreRow: { props: ['genre'], template: '<div class="row-stub">{{ genre }}</div>' },
          GenreRowSkeleton: true,
          AppErrorState: true,
        },
      },
    })

    expect(w.findAll('.row-stub')).toHaveLength(2)

    await w.find('.dash__filter-select').trigger('click')
    const comedyOption = w
      .findAll('.dash__filter-option')
      .find((node) => node.text() === 'Comedy')
    expect(comedyOption).toBeDefined()
    await comedyOption!.trigger('click')

    expect(store.selectedGenre).toBe('Comedy')
    expect(w.findAll('.row-stub')).toHaveLength(1)
    expect(w.find('.row-stub').text()).toBe('Comedy')
  })
})
