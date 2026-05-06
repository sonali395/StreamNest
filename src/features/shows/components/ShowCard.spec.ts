import type { TVShow } from '@/features/shows/types/show.types'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ShowCard from './ShowCard.vue'

const baseShow: TVShow = {
  id: 42,
  name: 'Night Court',
  genres: ['Comedy'],
  rating: { average: 7.4 },
  image: {
    medium: 'https://example.com/m.jpg',
    original: 'https://example.com/o.jpg',
  },
  summary: '<p>A sitcom.</p>',
  premiered: '1984-01-04',
  officialSite: null,
  url: 'https://example.com',
}

describe('ShowCard', () => {
  it('renders title and rating', () => {
    const w = mount(ShowCard, {
      props: { show: baseShow },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })
    expect(w.text()).toContain('Night Court')
    expect(w.text()).toContain('7.4')
  })

  it('uses lazy loading on image when poster exists', () => {
    const w = mount(ShowCard, {
      props: { show: baseShow },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })
    const img = w.find('img')
    expect(img.attributes('loading')).toBe('lazy')
  })
})
