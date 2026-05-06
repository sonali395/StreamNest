<script setup lang="ts">
defineProps<{
  cardCount?: number
}>()

const count = (n: number | undefined) =>
  Array.from({ length: n ?? 8 }, (_, i) => i)
</script>

<template>
  <section
    class="sk"
    aria-hidden="true"
  >
    <div class="sk__heading" />
    <div class="sk__track">
      <div
        v-for="i in count(cardCount)"
        :key="i"
        class="sk__card"
      >
        <div class="sk__poster" />
        <div class="sk__lines">
          <div class="sk__line sk__line--short" />
          <div class="sk__line" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sk {
  margin-bottom: 1.75rem;
}

.sk__heading {
  height: 1.1rem;
  width: 8rem;
  border-radius: 4px;
  margin-bottom: 0.65rem;
  background: linear-gradient(
    90deg,
    var(--sn-surface-2) 0%,
    var(--sn-surface) 50%,
    var(--sn-surface-2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.sk__track {
  display: flex;
  gap: 0.85rem;
  overflow: hidden;
  padding-bottom: 0.75rem;
}

.sk__card {
  width: 10.5rem;
  flex: 0 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background: var(--sn-surface);
}

.sk__poster {
  aspect-ratio: 2 / 3;
  background: var(--sn-surface-2);
  animation: shimmer 1.2s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    var(--sn-surface-2) 0%,
    var(--sn-surface) 50%,
    var(--sn-surface-2) 100%
  );
  background-size: 200% 100%;
}

.sk__lines {
  padding: 0.65rem 0.75rem 0.85rem;
}

.sk__line {
  height: 0.55rem;
  border-radius: 3px;
  margin-bottom: 0.35rem;
  background: linear-gradient(
    90deg,
    var(--sn-surface-2) 0%,
    var(--sn-surface) 50%,
    var(--sn-surface-2) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;

  &--short {
    width: 60%;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
