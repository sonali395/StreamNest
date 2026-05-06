<script setup lang="ts">
defineProps<{
  direction: 'prev' | 'next'
  disabled: boolean
  label: string
}>()

const emit = defineEmits<{
  activate: []
}>()
</script>

<template>
  <button
    type="button"
    class="scroll-nav"
    :disabled="disabled"
    :aria-label="label"
    @click="emit('activate')"
  >
    <svg
      class="scroll-nav__icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <polyline
        v-if="direction === 'prev'"
        points="14 6 8 12 14 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        v-else
        points="10 6 16 12 10 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped lang="scss">
.scroll-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--sn-border);
  background: rgb(var(--sn-bg-rgb) / 0.92);
  color: var(--sn-text);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  transition:
    border-color 0.15s,
    color 0.15s,
    opacity 0.15s;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    border-color: var(--sn-accent-dim);
    color: var(--sn-accent);
    outline: none;
  }

  &:disabled {
    opacity: 0.28;
    cursor: default;
  }
}

.scroll-nav__icon {
  display: block;
}
</style>
