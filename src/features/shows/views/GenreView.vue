<script setup lang="ts">
import AppErrorState from '@/components/AppErrorState.vue'
import AppLoader from '@/components/AppLoader.vue'
import ShowCard from '@/features/shows/components/ShowCard.vue'
import { fetchShowPage } from '@/features/shows/services/tvmazeApi'
import type { TVShow } from '@/features/shows/types/show.types'
import {
  compareShowsByRating,
  UNCATEGORIZED_GENRE,
} from '@/utils/groupShowsByGenre'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const PAGE_SIZE = 250

const route = useRoute()

const page = ref(0)
const isLoading = ref(false)
const didLoadAny = ref(false)
const hasReachedEnd = ref(false)
const errorMessage = ref<string | null>(null)
const matches = ref<TVShow[]>([])

const genre = computed(() => {
  const raw = route.params.genre
  if (typeof raw === 'string') return raw.trim()
  return ''
})

const canLoadMore = computed(
  () => !isLoading.value && !hasReachedEnd.value && !errorMessage.value
)

function isGenreMatch(show: TVShow): boolean {
  if (genre.value === UNCATEGORIZED_GENRE) return show.genres.length === 0
  return show.genres.includes(genre.value)
}

function mergeMatches(newShows: TVShow[]): void {
  const byId = new Map<number, TVShow>()
  for (const show of matches.value) byId.set(show.id, show)
  for (const show of newShows) {
    if (isGenreMatch(show)) byId.set(show.id, show)
  }
  matches.value = [...byId.values()].sort(compareShowsByRating)
}

async function loadNextPage(): Promise<void> {
  if (!canLoadMore.value || !genre.value) return
  isLoading.value = true
  errorMessage.value = null
  try {
    const rows = await fetchShowPage(page.value)
    didLoadAny.value = true
    if (rows.length === 0) {
      hasReachedEnd.value = true
      return
    }
    mergeMatches(rows)
    page.value += 1
    if (rows.length < PAGE_SIZE) {
      hasReachedEnd.value = true
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not load shows'
    if (message.includes('404')) {
      hasReachedEnd.value = true
      didLoadAny.value = true
      return
    }
    errorMessage.value = message
  } finally {
    isLoading.value = false
  }
}

function resetAndLoad(): void {
  page.value = 0
  isLoading.value = false
  didLoadAny.value = false
  hasReachedEnd.value = false
  errorMessage.value = null
  matches.value = []
  void loadNextPage()
}

watch(genre, () => {
  resetAndLoad()
}, { immediate: true })

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="genre-page">
    <nav
      class="genre-page__nav"
      aria-label="Back"
    >
      <RouterLink
        to="/"
        class="genre-page__back"
      >
        ← Back to home
      </RouterLink>
    </nav>

    <header class="genre-page__head">
      <p class="sn-eyebrow">Genre</p>
      <h1 class="genre-page__title">{{ genre }}</h1>
      <p class="genre-page__lede">
        Find your next {{ genre.toLowerCase() }} show to watch.
      </p>
    </header>

    <AppLoader
      v-if="isLoading && matches.length === 0"
      label="Loading shows"
    />

    <AppErrorState
      v-else-if="errorMessage && matches.length === 0"
      :message="errorMessage"
      @retry="loadNextPage"
    />

    <template v-else>
      <ul
        v-if="matches.length > 0"
        class="grid"
        role="list"
      >
        <li
          v-for="s in matches"
          :key="s.id"
          class="grid__cell"
        >
          <ShowCard :show="s" />
        </li>
      </ul>

      <p
        v-else-if="didLoadAny && hasReachedEnd"
        class="genre-page__empty"
      >
        No shows found for this genre.
      </p>

      <div class="genre-page__actions">
        <button
          v-if="canLoadMore"
          type="button"
          class="genre-page__load-more"
          @click="loadNextPage"
        >
          Load more
        </button>
        <button
          v-else-if="hasReachedEnd && matches.length > 0"
          type="button"
          class="genre-page__top"
          @click="scrollToTop"
        >
          Back to top
        </button>
      </div>

      <AppErrorState
        v-if="errorMessage && matches.length > 0"
        :message="errorMessage"
        @retry="loadNextPage"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.genre-page {
  padding-bottom: 3rem;
}

.genre-page__nav {
  margin-bottom: 1rem;
}

.genre-page__back {
  display: inline-block;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--sn-text-muted);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.15s;

  &:hover,
  &:focus-visible {
    color: var(--sn-accent);
    outline: none;
  }
}

.genre-page__head {
  margin-bottom: 1.25rem;
}

.genre-page__title {
  margin: 0 0 0.4rem;
  font-size: clamp(1.45rem, 4vw, 1.95rem);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.genre-page__lede {
  margin: 0;
  color: var(--sn-text-muted);
  font-size: 0.92rem;
}

.genre-page__empty {
  margin: 1.5rem 0 0;
  color: var(--sn-text-muted);
}

.genre-page__actions {
  margin-top: 1rem;
  min-height: 2rem;
}

.genre-page__load-more {
  border: 1px solid var(--sn-border);
  border-radius: 999px;
  background: var(--sn-surface);
  color: var(--sn-text);
  font: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    color 0.16s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    border-color: var(--sn-accent-dim);
    color: var(--sn-accent);
  }
}

.genre-page__top {
  border: 1px solid var(--sn-border);
  border-radius: 999px;
  background: transparent;
  color: var(--sn-text-muted);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    color 0.16s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    border-color: var(--sn-accent-dim);
    color: var(--sn-accent);
  }
}

.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 1rem 0.85rem;
  justify-items: start;
}

.grid__cell {
  margin: 0;
}
</style>
