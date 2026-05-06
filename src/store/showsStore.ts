import {
  DEFAULT_MAX_PER_GENRE,
  groupShowsByGenre,
  sortGenreKeys,
} from '@/utils/groupShowsByGenre'
import {
  fetchShowById,
  fetchShowPage,
  searchShows,
} from '@/features/shows/services/tvmazeApi'
import type {
  DashboardLoadState,
  SearchLoadState,
  TVShow,
} from '@/features/shows/types/show.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<TVShow[]>([])
  const showsByGenre = ref<Record<string, TVShow[]>>({})
  const genreOrder = ref<string[]>([])

  const dashboardState = ref<DashboardLoadState>('idle')
  const dashboardError = ref<string | null>(null)

  const searchQuery = ref('')
  const selectedGenre = ref('')
  const searchResults = ref<TVShow[]>([])
  const searchState = ref<SearchLoadState>('idle')
  const searchError = ref<string | null>(null)

  const detailShow = ref<TVShow | null>(null)
  const detailState = ref<DashboardLoadState>('idle')
  const detailError = ref<string | null>(null)

  const isDashboardLoading = computed(() => dashboardState.value === 'loading')
  const isSearchLoading = computed(() => searchState.value === 'loading')

  function applyGroupedFromShows(
    list: TVShow[],
    maxPerGenre: number = DEFAULT_MAX_PER_GENRE
  ): void {
    shows.value = list
    const grouped = groupShowsByGenre(list, maxPerGenre)
    showsByGenre.value = grouped
    genreOrder.value = sortGenreKeys(Object.keys(grouped))
  }

  async function loadDashboard(): Promise<void> {
    dashboardState.value = 'loading'
    dashboardError.value = null
    try {
      const page = await fetchShowPage(0)
      applyGroupedFromShows(page)
      dashboardState.value = 'success'
    } catch (e) {
      dashboardState.value = 'error'
      dashboardError.value =
        e instanceof Error ? e.message : 'Could not load shows'
    }
  }

  let searchSeq = 0
  async function runSearch(rawQuery: string): Promise<void> {
    const q = rawQuery.trim()
    searchQuery.value = rawQuery
    if (!q) {
      searchResults.value = []
      searchState.value = 'idle'
      searchError.value = null
      return
    }

    const seq = ++searchSeq
    searchState.value = 'loading'
    searchError.value = null
    try {
      const items = await searchShows(q)
      if (seq !== searchSeq) return
      searchResults.value = items.map((i) => i.show)
      searchState.value = 'success'
    } catch (e) {
      if (seq !== searchSeq) return
      searchState.value = 'error'
      searchError.value =
        e instanceof Error ? e.message : 'Search failed'
    }
  }

  function clearSearch(): void {
    searchSeq += 1
    searchQuery.value = ''
    searchResults.value = []
    searchState.value = 'idle'
    searchError.value = null
  }

  function setSelectedGenre(genre: string): void {
    selectedGenre.value = genre
  }

  async function loadShowDetail(id: number): Promise<void> {
    if (!Number.isFinite(id) || id < 1) {
      detailState.value = 'error'
      detailError.value = 'Invalid show'
      detailShow.value = null
      return
    }
    detailState.value = 'loading'
    detailError.value = null
    detailShow.value = null
    try {
      detailShow.value = await fetchShowById(id)
      detailState.value = 'success'
    } catch (e) {
      detailState.value = 'error'
      detailError.value =
        e instanceof Error ? e.message : 'Could not load show'
    }
  }

  function resetDetail(): void {
    detailShow.value = null
    detailState.value = 'idle'
    detailError.value = null
  }

  return {
    shows,
    showsByGenre,
    genreOrder,
    dashboardState,
    dashboardError,
    searchQuery,
    selectedGenre,
    searchResults,
    searchState,
    searchError,
    detailShow,
    detailState,
    detailError,
    isDashboardLoading,
    isSearchLoading,
    loadDashboard,
    runSearch,
    clearSearch,
    setSelectedGenre,
    loadShowDetail,
    resetDetail,
    /** Exposed for tests */
    applyGroupedFromShows,
  }
})
