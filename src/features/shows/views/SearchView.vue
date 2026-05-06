<script setup lang="ts">
import AppErrorState from '@/components/AppErrorState.vue'
import AppLoader from '@/components/AppLoader.vue'
import ShowCard from '@/features/shows/components/ShowCard.vue'
import { useShowsStore } from '@/store/showsStore'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

function queryParam(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0]
  return ''
}

const store = useShowsStore()
const { searchResults, searchState, searchError, isSearchLoading, selectedGenre } =
  storeToRefs(store)

const route = useRoute()

const qLabel = computed(() => queryParam(route.query.q))
const filteredSearchResults = computed(() => {
  if (!selectedGenre.value) return searchResults.value
  return searchResults.value.filter((show) => show.genres.includes(selectedGenre.value))
})
const selectedGenreHint = computed(() => {
  if (!selectedGenre.value) return ''
  return ` in ${selectedGenre.value}`
})

function syncFromRoute(): void {
  void store.runSearch(queryParam(route.query.q))
}

watch(
  () => route.fullPath,
  () => {
    syncFromRoute()
  },
  { immediate: true }
)
</script>

<template>
  <div class="search-page">
    <header class="search-page__head">
      <p class="sn-eyebrow">
        Search
      </p>
      <h1 class="search-page__title">
        Find a show
      </h1>
      <p
        v-if="qLabel.trim()"
        class="search-page__query"
      >
        {{ qLabel }}
      </p>
    </header>

    <AppLoader
      v-if="searchState === 'loading'"
      label="Searching"
    />

    <AppErrorState
      v-else-if="searchState === 'error'"
      :message="searchError ?? 'Search failed'"
      @retry="syncFromRoute"
    />

    <template v-else-if="searchState === 'success'">
      <ul
        v-if="filteredSearchResults.length > 0"
        class="grid"
        role="list"
      >
        <li
          v-for="s in filteredSearchResults"
          :key="s.id"
          class="grid__cell"
        >
          <ShowCard :show="s" />
        </li>
      </ul>
      <p
        v-else
        class="search-page__empty"
      >
        No matches for that title{{ selectedGenreHint }}.
      </p>
    </template>

    <p
      v-else-if="!isSearchLoading && !qLabel.trim()"
      class="search-page__hint"
    >
      Enter a show name in the header.
    </p>
  </div>
</template>

<style scoped lang="scss">
.search-page {
  padding-bottom: 3rem;
}

.search-page__head {
  position: relative;
  margin-bottom: 1.75rem;
  padding-left: 1.05rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.15rem;
    bottom: 0.15rem;
    width: 3px;
    border-radius: 3px;
    background: linear-gradient(
      180deg,
      var(--sn-accent) 0%,
      var(--sn-accent-deep) 100%
    );
  }
}

.search-page__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 3.8vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.search-page__query {
  display: inline-block;
  margin: 0;
  padding: 0.35rem 0.85rem;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--sn-accent);
  background: var(--sn-surface);
  border: 1px solid var(--sn-border);
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.search-page__empty,
.search-page__hint {
  color: var(--sn-text-muted);
  font-size: 0.95rem;
  margin: 2rem 0 0;
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
