<script setup lang="ts">
import type { TVShow } from '@/features/shows/types/show.types'
import { stripHtml } from '@/utils/stripHtml'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  show: TVShow
}>()

const ratingLabel = computed(() => {
  const v = props.show.rating?.average
  if (v == null || Number.isNaN(v)) return 'No score'
  return `${v.toFixed(1)} / 10`
})

const preview = computed(() => {
  const s = props.show.summary
  if (!s) return ''
  const plain = stripHtml(s)
  return plain.length > 90 ? `${plain.slice(0, 90)}…` : plain
})

const poster = computed(
  () => props.show.image?.medium ?? props.show.image?.original ?? ''
)
</script>

<template>
  <RouterLink
    :to="{ name: 'show-detail', params: { id: show.id } }"
    class="card"
  >
    <div class="card__media">
      <img
        v-if="poster"
        :src="poster"
        :alt="`Poster for ${show.name}`"
        class="card__img"
        loading="lazy"
        width="210"
        height="295"
      >
      <div
        v-else
        class="card__placeholder"
        aria-hidden="true"
      >
        Poster unavailable
      </div>
      <span
        class="card__rating"
        :title="ratingLabel"
      >{{ ratingLabel }}</span>
    </div>
    <div class="card__body">
      <h3 class="card__title">{{ show.name }}</h3>
      <p
        class="card__preview"
        :class="{ 'card__preview--placeholder': !preview }"
      >
        {{ preview || '\u00A0' }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.card {
  display: block;
  width: clamp(9.75rem, 30vw, 10.5rem);
  flex: 0 0 auto;
  text-decoration: none;
  color: inherit;
  border-radius: var(--sn-radius);
  overflow: hidden;
  background: var(--sn-surface);
  border: 1px solid var(--sn-border);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-5px);
    border-color: var(--sn-accent-dim);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.45),
      0 0 0 1px color-mix(in srgb, var(--sn-accent) 26%, transparent);
    outline: none;
  }
}

.card__media {
  position: relative;
  aspect-ratio: 2 / 3;
  background: var(--sn-surface-2);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgb(var(--sn-bg-rgb) / 0.92) 0%,
      transparent 42%
    );
    pointer-events: none;
  }
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;

  .card:hover &,
  .card:focus-visible & {
    transform: scale(1.04);
  }
}

.card__placeholder {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--sn-text-muted);
}

.card__rating {
  position: absolute;
  right: 0.45rem;
  bottom: 0.45rem;
  z-index: 1;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.22rem 0.5rem;
  border-radius: 6px;
  background: rgb(var(--sn-bg-rgb) / 0.88);
  border: 1px solid color-mix(in srgb, var(--sn-accent) 32%, transparent);
  color: var(--sn-accent);
}

.card__body {
  padding: 0.65rem 0.75rem 0.85rem;
  min-height: 4.7rem;
}

.card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__preview {
  margin: 0.35rem 0 0;
  font-size: 0.72rem;
  line-height: 1.35;
  color: var(--sn-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__preview--placeholder {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .card:hover,
  .card:focus-visible {
    transform: none;
  }

  .card:hover .card__img,
  .card:focus-visible .card__img {
    transform: none;
  }
}
</style>
