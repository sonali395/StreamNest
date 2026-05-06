<script setup lang="ts">
import AppErrorState from '@/components/AppErrorState.vue'
import GenreRow from '@/features/shows/components/GenreRow.vue'
import GenreRowSkeleton from '@/features/shows/components/GenreRowSkeleton.vue'
import { useShowsStore } from '@/store/showsStore'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const store = useShowsStore()
const { dashboardState, dashboardError, genreOrder, showsByGenre, isDashboardLoading, selectedGenre } =
  storeToRefs(store)

const route = useRoute()
const filterRef = ref<HTMLElement | null>(null)
const isGenreMenuOpen = ref(false)
const filteredGenreOrder = computed(() => {
  if (!selectedGenre.value) return genreOrder.value
  return genreOrder.value.filter((g) => g === selectedGenre.value)
})

const genreLabel = computed(() => selectedGenre.value || 'All genres')

function toggleGenreMenu(): void {
  isGenreMenuOpen.value = !isGenreMenuOpen.value
}

function selectGenre(genre: string): void {
  store.setSelectedGenre(genre)
  isGenreMenuOpen.value = false
}

function clearGenre(): void {
  store.setSelectedGenre('')
  isGenreMenuOpen.value = false
}

function onDocumentClick(e: MouseEvent): void {
  const target = e.target
  if (!(target instanceof Node)) return
  if (!filterRef.value?.contains(target)) {
    isGenreMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  if (
    store.shows.length === 0 &&
    store.dashboardState !== 'loading' &&
    store.dashboardState !== 'success'
  ) {
    void store.loadDashboard()
  }
})

watch(
  () => route.name,
  (name) => {
    if (name === 'dashboard') {
      store.clearSearch()
      if (
        store.shows.length === 0 &&
        store.dashboardState !== 'loading'
      ) {
        void store.loadDashboard()
      }
    }
  }
)

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div class="dash">
    <header class="dash__intro">
      <p class="sn-eyebrow">
        Browse
      </p>
      <div class="dash__title-row">
        <h1 class="dash__title">
          Featured shows
        </h1>
        <div
          ref="filterRef"
          class="dash__filter"
        >
          <span class="dash__filter-label">Genre</span>
          <button
            type="button"
            class="dash__filter-select"
            :aria-expanded="isGenreMenuOpen"
            aria-haspopup="true"
            @click="toggleGenreMenu"
          >
            {{ genreLabel }}
          </button>
          <div
            v-if="isGenreMenuOpen"
            class="dash__filter-menu"
          >
            <button
              type="button"
              class="dash__filter-option"
              :class="{ 'dash__filter-option--active': !selectedGenre }"
              @click="clearGenre"
            >
              All genres
            </button>
            <button
              v-for="g in genreOrder"
              :key="g"
              type="button"
              class="dash__filter-option"
              :class="{ 'dash__filter-option--active': selectedGenre === g }"
              @click="selectGenre(g)"
            >
              {{ g }}
            </button>
          </div>
        </div>
      </div>
      <p class="dash__lede">
        Picked from the TVMaze catalog: grouped by genre, ranked by rating.
      </p>
    </header>

    <template v-if="dashboardState === 'loading'">
      <GenreRowSkeleton
        :card-count="10"
      />
      <GenreRowSkeleton :card-count="8" />
    </template>

    <AppErrorState
      v-else-if="dashboardState === 'error'"
      :message="dashboardError ?? 'Something went wrong'"
      @retry="store.loadDashboard"
    />

    <template v-else>
      <GenreRow
        v-for="g in filteredGenreOrder"
        :key="g"
        :genre="g"
        :shows="showsByGenre[g] ?? []"
      />
      <p
        v-if="!isDashboardLoading && filteredGenreOrder.length === 0"
        class="dash__empty"
      >
        No rows match the selected genre.
      </p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash {
  padding-bottom: 3rem;
}

.dash__intro {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 1.05rem;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.2rem;
    bottom: 0.2rem;
    width: 3px;
    border-radius: 3px;
    background: linear-gradient(
      180deg,
      var(--sn-accent) 0%,
      var(--sn-accent-deep) 100%
    );
  }
}

.dash__title {
  margin: 0;
  font-size: clamp(1.5rem, 4.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.12;
}

.dash__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.dash__filter {
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: 0.45rem;
}

.dash__filter-label {
  font-size: 0.78rem;
  color: var(--sn-text-muted);
}

.dash__filter-select {
  border: 1px solid var(--sn-border);
  border-radius: 999px;
  background-color: var(--sn-surface);
  color: var(--sn-text);
  font: inherit;
  font-size: 0.82rem;
  height: 2.2rem;
  padding: 0.38rem 0.85rem;
  min-width: 10.5rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    border-color: var(--sn-accent-dim);
    color: var(--sn-accent);
    box-shadow: 0 0 0 3px var(--sn-accent-glow);
  }
}

.dash__filter-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  width: 12.5rem;
  max-height: 14rem;
  overflow-y: auto;
  border: 1px solid var(--sn-border);
  border-radius: 10px;
  background: var(--sn-surface);
  padding: 0.3rem;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.32);
  z-index: 15;
}

.dash__filter-option {
  width: 100%;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--sn-text);
  font: inherit;
  font-size: 0.82rem;
  text-align: left;
  padding: 0.42rem 0.5rem;
  cursor: pointer;

  &:hover {
    background: var(--sn-surface-2);
  }
}

.dash__filter-option--active {
  color: var(--sn-accent);
  background: color-mix(in srgb, var(--sn-accent) 16%, transparent);
}

.dash__lede {
  margin: 0;
  max-width: 32rem;
  color: var(--sn-text-muted);
  font-size: 0.94rem;
  line-height: 1.55;
}

.dash__empty {
  color: var(--sn-text-muted);
  font-size: 0.9rem;
}
</style>
