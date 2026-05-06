import type { TVShow } from '@/features/shows/types/show.types'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GenreRow from '@/features/shows/components/GenreRow.vue'

const shows: TVShow[] = [
  {
    id: 1,
    name: 'One',
    genres: ['Drama'],
    rating: { average: 8 },
    image: null,
    summary: null,
    premiered: null,
    officialSite: null,
    url: '',
  },
]

function manyShows(count: number): TVShow[] {
  return Array.from({ length: count }, (_, idx) => ({
    ...shows[0],
    id: idx + 1,
    name: `Show ${idx + 1}`,
  }))
}

describe('GenreRow', () => {
  it('omits scroll buttons when only one show', () => {
    const w = mount(GenreRow, {
      props: { genre: 'Drama', shows },
      global: {
        stubs: { RouterLink: RouterLinkStub, ShowCard: true },
      },
    })
    expect(w.findAll('button')).toHaveLength(0)
  })

  it('renders scroll buttons when multiple shows', () => {
    const twoShows = [
      ...shows,
      { ...shows[0], id: 99, name: 'Second' },
    ]
    const w = mount(GenreRow, {
      props: { genre: 'Drama', shows: twoShows },
      global: {
        stubs: { RouterLink: RouterLinkStub, ShowCard: true },
      },
    })
    expect(w.findAll('button')).toHaveLength(2)
  })

  it('renders heading and a card per show', () => {
    const w = mount(GenreRow, {
      props: { genre: 'Drama', shows },
      global: {
        stubs: { RouterLink: RouterLinkStub, ShowCard: true },
      },
    })
    expect(w.find('h2').text()).toBe('Drama')
    expect(w.findAll('show-card-stub')).toHaveLength(1)
  })

  it('exposes region label for the row', () => {
    const w = mount(GenreRow, {
      props: { genre: 'Sports', shows: [] },
      global: {
        stubs: { RouterLink: RouterLinkStub, ShowCard: true },
      },
    })
    const section = w.find('section')
    expect(section.attributes('aria-label')).toBe('Sports shows')
  })

  it('shows only 15 cards initially and expands on show more', async () => {
    const w = mount(GenreRow, {
      props: { genre: 'Drama', shows: manyShows(18) },
      global: {
        stubs: { RouterLink: RouterLinkStub, ShowCard: true },
      },
    })

    expect(w.findAll('show-card-stub')).toHaveLength(15)
    const showAll = w.find('.row__show-all')
    expect(showAll.exists()).toBe(true)
    expect(showAll.text()).toContain('View all')
    expect(showAll.text()).toContain('18 shows')
  })
})
