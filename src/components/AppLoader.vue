<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<template>
  <div
    class="loader"
    role="status"
    aria-live="polite"
  >
    <span class="loader__ring" aria-hidden="true" />
    <span class="visually-hidden">{{ label ?? 'Loading' }}</span>
  </div>
</template>

<style scoped lang="scss">
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 8rem;
}

.loader__ring {
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid var(--sn-border);
  border-top-color: var(--sn-accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
