<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="error"
    role="alert"
  >
    <p class="error__text">{{ message }}</p>
    <button
      type="button"
      class="error__retry"
      @click="emit('retry')"
    >
      Try again
    </button>
  </div>
</template>

<style scoped lang="scss">
.error {
  text-align: center;
  padding: 2rem 1rem;
  max-width: 28rem;
  margin: 0 auto;
}

.error__text {
  color: var(--sn-text-muted);
  margin: 0 0 1rem;
  line-height: 1.5;
}

.error__retry {
  font: inherit;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--sn-border);
  background: var(--sn-surface-2);
  color: var(--sn-text);
  transition: border-color 0.15s, background 0.15s;

  &:hover,
  &:focus-visible {
    border-color: var(--sn-accent);
    background: var(--sn-surface);
    outline: none;
  }
}
</style>
