import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchBar from './SearchBar.vue'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces search emit', async () => {
    const w = mount(SearchBar, {
      props: { modelValue: '' },
    })
    const input = w.find('input')
    await input.setValue('a')
    await input.setValue('ab')
    expect(w.emitted('search')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(400)
    expect(w.emitted('search')?.length).toBe(1)
    expect(w.emitted('search')?.[0]).toEqual(['ab'])
  })

  it('clears immediately emits empty search', async () => {
    const w = mount(SearchBar, {
      props: { modelValue: 'hi' },
    })
    await w.find('button.search__clear').trigger('click')
    expect(w.emitted('search')?.pop()).toEqual([''])
  })
})
