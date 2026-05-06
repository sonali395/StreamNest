<script setup lang="ts">
import ScrollNavButton from '@/components/ScrollNavButton.vue'
import type { TVShow } from '@/features/shows/types/show.types'
import ShowCard from '@/features/shows/components/ShowCard.vue'
import { useHorizontalScroller } from '@/composables/useHorizontalScroller'
import { RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'

const INITIAL_VISIBLE_SHOWS = 15

const props = defineProps<{
  genre: string
  shows: TVShow[]
}>()

const scrollerRef = ref<HTMLElement | null>(null)
const { canGoPrev, canGoNext, measure, scrollPrev, scrollNext } =
  useHorizontalScroller(scrollerRef)
const visibleShows = computed(() => props.shows.slice(0, INITIAL_VISIBLE_SHOWS))
const hasMore = computed(() => props.shows.length > INITIAL_VISIBLE_SHOWS)

const showScrollNav = computed(
  () => visibleShows.value.length + (hasMore.value ? 1 : 0) > 1
)

watch(
  () => [props.genre, visibleShows.value.length, hasMore.value] as const,
  () => {
    requestAnimationFrame(measure)
  }
)

function scrollLabel(which: 'prev' | 'next'): string {
  return which === 'prev'
    ? `Scroll ${props.genre} row left`
    : `Scroll ${props.genre} row right`
}
</script>

<template>
  <section
    class="row"
    :aria-label="`${genre} shows`"
  >
    <div class="row__head">
      <h2 class="row__heading">{{ genre }}</h2>
      <div
        v-if="showScrollNav"
        class="row__controls"
      >
        <ScrollNavButton
          direction="prev"
          :disabled="!canGoPrev"
          :label="scrollLabel('prev')"
          @activate="scrollPrev"
        />
        <ScrollNavButton
          direction="next"
          :disabled="!canGoNext"
          :label="scrollLabel('next')"
          @activate="scrollNext"
        />
      </div>
    </div>

    <div class="row__shell">
      <div
        ref="scrollerRef"
        class="row__track-wrap"
        role="region"
      >
        <ul
          class="row__track"
          tabindex="0"
        >
          <li
            v-for="s in visibleShows"
            :key="s.id"
            class="row__item"
          >
            <ShowCard :show="s" />
          </li>
          <li
            v-if="hasMore"
            class="row__item"
          >
            <RouterLink
              :to="{ name: 'genre', params: { genre } }"
              class="row__show-all"
            >
              <span class="row__show-all-label">View all</span>
              <span class="row__show-all-count">{{ shows.length }} shows</span>
              <span
                class="row__show-all-arrow"
                aria-hidden="true"
              >→</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.row {
  margin-bottom: 1.75rem;
}

.row__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
  padding-left: max(0px, env(safe-area-inset-left));
  padding-right: max(0px, env(safe-area-inset-right));
}

.row__heading {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--sn-text);
  min-width: 0;

  &::before {
    content: '';
    width: 4px;
    height: 1.05em;
    border-radius: 2px;
    background: linear-gradient(
      180deg,
      var(--sn-accent) 0%,
      var(--sn-accent-deep) 100%
    );
    flex-shrink: 0;
  }
}

.row__controls {
  display: none;
  flex-shrink: 0;
  align-items: center;
  gap: 0.35rem;

  @media (pointer: fine) {
    display: flex;
  }
}

.row__shell {
  position: relative;
  margin-left: calc(-1 * var(--sn-page-pad));
  margin-right: calc(-1 * var(--sn-page-pad));
}

.row__track-wrap {
  padding-left: var(--sn-page-pad);
  padding-right: var(--sn-page-pad);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: var(--sn-border) transparent;
  -webkit-overflow-scrolling: touch;

  &:focus-within {
    outline: none;
  }
}

.row__track {
  display: flex;
  gap: 0.85rem;
  list-style: none;
  margin: 0;
  padding: 0.25rem 0 0.75rem;
  min-height: min-content;

  &:focus-visible {
    outline: 2px solid var(--sn-accent);
    outline-offset: 4px;
    border-radius: 8px;
  }
}

.row__item {
  flex: 0 0 auto;
}

.row__show-all {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.35rem;
  width: clamp(10.25rem, 32vw, 11rem);
  min-height: 100%;
  aspect-ratio: 2 / 3;
  border-radius: var(--sn-radius);
  border: 1px solid var(--sn-border);
  background:
    radial-gradient(ellipse at top, color-mix(in srgb, var(--sn-accent) 15%, transparent), transparent 55%),
    linear-gradient(165deg, var(--sn-surface-2), var(--sn-surface));
  text-decoration: none;
  color: var(--sn-text);
  padding: 0.8rem;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    transform: translateY(-4px);
    border-color: var(--sn-accent-dim);
    color: var(--sn-text);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
  }
}

.row__show-all-label {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition:
    color 0.18s ease,
    transform 0.18s ease;
}

.row__show-all-count {
  font-size: 0.76rem;
  color: var(--sn-text-muted);
  transition: color 0.18s ease;
}

.row__show-all-arrow {
  margin-top: 0.1rem;
  font-size: 1.2rem;
  line-height: 1;
  color: var(--sn-accent);
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.row__show-all:hover .row__show-all-label,
.row__show-all:focus-visible .row__show-all-label {
  color: var(--sn-accent);
  transform: translateY(-1px);
}

.row__show-all:hover .row__show-all-count,
.row__show-all:focus-visible .row__show-all-count {
  color: color-mix(in srgb, var(--sn-text-muted) 72%, var(--sn-text));
}

.row__show-all:hover .row__show-all-arrow,
.row__show-all:focus-visible .row__show-all-arrow {
  transform: translateX(4px);
}
</style>
