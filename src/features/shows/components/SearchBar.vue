<script setup lang="ts">
import { debounce } from '@/utils/debounce'

const DEBOUNCE_MS = 320
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [query: string]
}>()

const local = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    local.value = v
  }
)

const debouncedNotify = debounce((q: string) => {
  emit('update:modelValue', q)
  emit('search', q)
}, DEBOUNCE_MS)

function onInput(e: Event): void {
  const v = (e.target as HTMLInputElement).value
  local.value = v
  debouncedNotify(v)
}

function onClear(): void {
  local.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

const hasValue = computed(() => local.value.trim().length > 0)
</script>

<template>
  <div
    class="search"
    role="search"
  >
    <label class="search__label">
      <span class="visually-hidden">Search shows</span>
      <input
        :value="local"
        type="search"
        class="search__input"
        :placeholder="placeholder ?? 'Search by title…'"
        autocomplete="off"
        enterkeyhint="search"
        @input="onInput"
      >
    </label>
    <button
      v-if="hasValue"
      type="button"
      class="search__clear"
      aria-label="Clear search"
      @click="onClear"
    >
      ×
    </button>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  width: 100%;
  max-width: 22rem;
}

.search__label {
  display: block;
}

.search__input {
  width: 100%;
  box-sizing: border-box;
  font: inherit;
  padding: 0.58rem 2.35rem 0.58rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--sn-border);
  background: linear-gradient(180deg, var(--sn-surface-2) 0%, var(--sn-surface) 100%);
  color: var(--sn-text);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 2px 8px rgba(0, 0, 0, 0.2);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;

  &::placeholder {
    color: var(--sn-text-muted);
  }

  &:hover {
    border-color: var(--sn-border-strong);
  }

  &:focus {
    outline: none;
    border-color: var(--sn-accent-dim);
    box-shadow:
      0 0 0 3px var(--sn-accent-glow),
      0 1px 0 rgba(255, 255, 255, 0.06) inset;
  }

  /* Hide native browser clear controls so only our custom clear button is shown. */
  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }
}

.search__clear {
  position: absolute;
  right: 0.35rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  color: var(--sn-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover,
  &:focus-visible {
    color: var(--sn-text);
    background: var(--sn-surface-2);
    outline: none;
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
