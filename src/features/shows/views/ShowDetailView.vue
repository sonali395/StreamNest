<script setup lang="ts">
import AppErrorState from '@/components/AppErrorState.vue'
import AppLoader from '@/components/AppLoader.vue'
import { stripHtml } from '@/utils/stripHtml'
import { useShowsStore } from '@/store/showsStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps<{
  id: string
}>()

const store = useShowsStore()
const { detailShow, detailState, detailError } = storeToRefs(store)

const route = useRoute()

const numericId = computed(() => Number.parseInt(props.id, 10))

const heroImage = computed(() => {
  const s = detailShow.value
  if (!s?.image) return ''
  return s.image.original || s.image.medium
})

const summaryText = computed(() => {
  const s = detailShow.value?.summary
  if (!s) return ''
  return stripHtml(s)
})

function load(): void {
  const id = numericId.value
  if (Number.isNaN(id)) {
    return
  }
  void store.loadShowDetail(id)
}

onMounted(() => {
  load()
})

watch(
  () => route.params.id,
  () => {
    store.resetDetail()
    load()
  }
)
</script>

<template>
  <div class="detail">
    <nav
      class="detail__nav"
      aria-label="Back"
    >
      <RouterLink
        class="detail__back"
        to="/"
      >
        ← Back to home
      </RouterLink>
    </nav>
    <AppLoader
      v-if="detailState === 'loading'"
      label="Loading show"
    />

    <AppErrorState
      v-else-if="detailState === 'error'"
      :message="detailError ?? 'Could not load this show'"
      @retry="load"
    />

    <article
      v-else-if="detailShow"
      class="detail__article"
    >
      <div
        class="detail__hero"
        :class="{ 'detail__hero--empty': !heroImage }"
      >
        <img
          v-if="heroImage"
          :src="heroImage"
          :alt="`Key art for ${detailShow.name}`"
          class="detail__img"
          loading="lazy"
        >
      </div>
      <div class="detail__content">
        <h1 class="detail__title">
          {{ detailShow.name }}
        </h1>
        <div class="detail__meta">
          <span
            v-if="detailShow.rating?.average != null"
            class="detail__badge"
          >
            {{ detailShow.rating.average.toFixed(1) }} / 10
          </span>
          <span
            v-if="detailShow.premiered"
            class="detail__muted"
          >Premiered {{ detailShow.premiered }}</span>
        </div>
        <ul
          v-if="detailShow.genres.length"
          class="detail__genres"
          aria-label="Genres"
        >
          <li
            v-for="g in detailShow.genres"
            :key="g"
            class="detail__genre"
          >
            {{ g }}
          </li>
        </ul>
        <div
          v-if="summaryText"
          class="detail__summary"
        >
          <h2 class="detail__h2">
            About
          </h2>
          <p class="detail__body">
            {{ summaryText }}
          </p>
        </div>
        <a
          v-if="detailShow.officialSite"
          :href="detailShow.officialSite"
          class="detail__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official site
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.detail {
  padding-bottom: 3rem;
}

.detail__nav {
  margin-bottom: 1rem;
}

.detail__back {
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

.detail__article {
  display: grid;
  gap: 1.5rem;

  @media (min-width: 720px) {
    grid-template-columns: minmax(200px, 320px) 1fr;
    align-items: start;
  }
}

.detail__hero {
  border-radius: var(--sn-radius);
  overflow: hidden;
  background: var(--sn-surface-2);
  border: 1px solid var(--sn-border);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);

  &--empty {
    min-height: 12rem;
  }
}

.detail__img {
  width: 100%;
  display: block;
}

.detail__content {
  min-width: 0;
}

.detail__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
}

.detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
  align-items: center;
  margin-bottom: 0.85rem;
}

.detail__badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: var(--sn-surface-2);
  color: var(--sn-accent);
  border: 1px solid var(--sn-border);
}

.detail__muted {
  font-size: 0.88rem;
  color: var(--sn-text-muted);
}

.detail__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
}

.detail__genre {
  font-size: 0.78rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: var(--sn-surface);
  border: 1px solid var(--sn-border);
  color: var(--sn-text-muted);
}

.detail__h2 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.detail__body {
  margin: 0;
  color: var(--sn-text-muted);
  line-height: 1.6;
  font-size: 0.95rem;
}

.detail__link {
  display: inline-block;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--sn-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    border-color 0.15s,
    color 0.15s;

  &:hover,
  &:focus-visible {
    border-color: var(--sn-accent);
    outline: none;
  }
}
</style>
