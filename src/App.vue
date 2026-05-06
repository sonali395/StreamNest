<script setup lang="ts">
import SearchBar from '@/features/shows/components/SearchBar.vue'
import { useShowsStore } from '@/store/showsStore'
import { storeToRefs } from 'pinia'
import {
  isNavigationFailure,
  NavigationFailureType,
  RouterLink,
  RouterView,
  useRoute,
  useRouter,
} from 'vue-router'

const store = useShowsStore()
const { searchQuery } = storeToRefs(store)

const route = useRoute()
const router = useRouter()

function onSearch(q: string): void {
  const trimmed = q.trim()
  if (!trimmed) {
    store.clearSearch()
    if (route.name === 'search') {
      void router.push({ name: 'dashboard' })
    }
    return
  }
  void router
    .push({ name: 'search', query: { q: trimmed } })
    .catch((failure: unknown) => {
      if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        void store.runSearch(trimmed)
      }
    })
}

function setQuery(v: string): void {
  searchQuery.value = v
}
</script>

<template>
  <div class="app">
    <a
      href="#main"
      class="app__skip"
    >Skip to content</a>
    <header class="app__header">
      <div class="app__bar">
        <RouterLink
          to="/"
          class="app__brand"
          aria-label="StreamNest home"
        >
          <span class="app__logo" aria-hidden="true">▶</span>
          <span class="app__name">StreamNest</span>
        </RouterLink>
        <SearchBar
          :model-value="searchQuery"
          class="app__search"
          placeholder="Search shows by name…"
          @update:model-value="setQuery"
          @search="onSearch"
        />
      </div>
    </header>
    <main
      class="app__main"
      id="main"
    >
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app__skip {
  position: absolute;
  left: -9999px;
  z-index: 100;
  padding: 0.5rem 1rem;
  background: var(--sn-accent);
  color: var(--sn-bg);
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 6px 0;

  &:focus {
    left: 0.5rem;
    top: 0.5rem;
    outline: 2px solid var(--sn-text);
  }
}

.app__header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--sn-bg) 82%, transparent);
  backdrop-filter: blur(14px) saturate(1.2);
  border-bottom: 1px solid var(--sn-border);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  padding: 0.65rem var(--sn-page-pad);
}

.app__bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.25rem;
}

.app__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.08rem;
  letter-spacing: -0.03em;
  color: var(--sn-text);
  padding: 0.25rem 0;
  border-radius: var(--sn-radius-sm);
  transition:
    color 0.18s ease,
    transform 0.18s ease;

  &:hover,
  &:focus-visible {
    color: var(--sn-accent);
    outline: none;
    transform: translateY(-1px);
  }
}

.app__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--sn-surface-2), var(--sn-surface));
  border: 1px solid var(--sn-border);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 4px 12px rgba(0, 0, 0, 0.25);
  font-size: 0.62rem;
  color: var(--sn-accent);
}

.app__search {
  flex: 1 1 12rem;
  margin-left: auto;
}

.app__main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem var(--sn-page-pad) 2.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .app__brand:hover,
  .app__brand:focus-visible {
    transform: none;
  }
}
</style>
